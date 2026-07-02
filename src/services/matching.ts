import type { Profile, MatchExplanation } from '../types';
import { MATCHING_RULES } from '../config/matchingRules';

export const matchingService = {
  /**
   * Evaluates compatibility and returns a list of candidate matches sorted by score
   */
  findMatches(client: Profile, pool: Profile[]): { profile: Profile; explanation: MatchExplanation }[] {
    // 1. Filter candidates by opposite gender
    const oppositeGenderPool = pool.filter(
      (candidate) => candidate.gender !== client.gender && candidate.id !== client.id
    );

    const matches: { profile: Profile; explanation: MatchExplanation }[] = [];

    for (const candidate of oppositeGenderPool) {
      // 2. Evaluate Hard Filters
      const hardFilterResult = this.evaluateHardFilters(client, candidate);

      if (!hardFilterResult.isEligible) {
        // We log them as excluded candidates for the "Why Not" list (score 0)
        matches.push({
          profile: candidate,
          explanation: {
            score: 0,
            reasons: [],
            missingData: candidate.missingFields,
            confidence: 'Low',
            confidenceReason: 'Failed hard filter criteria.',
            recommendation: `Exclude from suggestions. Reason: ${hardFilterResult.reason}`,
            nextStep: 'Adjust client preferences or search filters.'
          }
        });
        continue;
      }

      // 3. Compute Soft Scoring
      const scoreResult = this.computeSoftScore(client, candidate);

      // 4. Determine Confidence & Recommendations
      const completeness = (client.profileCompleteness + candidate.profileCompleteness) / 2;
      const confidence: 'High' | 'Medium' | 'Low' = completeness > 95 ? 'High' : completeness > 85 ? 'Medium' : 'Low';
      const confidenceReason = `Based on average profile completeness of ${Math.round(completeness)}%.`;

      let recommendation = 'Wait before introducing.';
      let nextStep = 'Verify profile details or schedule a secondary consultation.';

      if (scoreResult.score >= 85) {
        recommendation = '★★★★★ Excellent Fit - Send introduction immediately.';
        nextStep = 'Schedule an introductory call between families.';
      } else if (scoreResult.score >= 70) {
        recommendation = '★★★★☆ Good Fit - Recommended for review.';
        nextStep = 'Share the profile summary and await client feedback.';
      } else {
        recommendation = '★★★☆☆ Fair Fit - Keep as secondary option.';
        nextStep = 'Confirm location and career flexibility.';
      }

      matches.push({
        profile: candidate,
        explanation: {
          score: scoreResult.score,
          reasons: scoreResult.reasons,
          missingData: candidate.missingFields,
          confidence,
          confidenceReason,
          recommendation,
          nextStep
        }
      });
    }

    // Return matches sorted by score descending
    return matches.sort((a, b) => b.explanation.score - a.explanation.score);
  },

  /**
   * Evaluate hard constraints. Returns isEligible and failure reasons.
   */
  evaluateHardFilters(client: Profile, candidate: Profile): { isEligible: boolean; reason?: string } {
    // Rule: Must be opposite gender (already handled in pool filtering, but double check)
    if (client.gender === candidate.gender) {
      return { isEligible: false, reason: 'Same gender profile.' };
    }

    // Gender-specific rule: Males match with women who are younger
    if (client.gender === 'Male' && candidate.age >= client.age) {
      return { isEligible: false, reason: `Candidate is older (${candidate.age} yrs) than client (${client.age} yrs).` };
    }

    // Gender-specific rule: Females match with men who are older or equal age
    if (client.gender === 'Female' && candidate.age <= client.age - 5) {
      return { isEligible: false, reason: `Candidate is significantly younger (${candidate.age} yrs) than client (${client.age} yrs).` };
    }

    // Gender-specific rule: Males match with women who are shorter
    if (client.gender === 'Male' && candidate.heightCm >= client.heightCm) {
      return { isEligible: false, reason: 'Candidate height is greater than or equal to client.' };
    }

    // Gender-specific rule: Males match with women who have matching views on children
    if (client.gender === 'Male') {
      if (client.wantKids === 'Yes' && candidate.wantKids === 'No') {
        return { isEligible: false, reason: 'Conflicting family planning views (Client wants kids, candidate does not).' };
      }
      if (client.wantKids === 'No' && candidate.wantKids === 'Yes') {
        return { isEligible: false, reason: 'Conflicting family planning views (Client does not want kids, candidate wants).' };
      }
    }

    // Religion matching (Optional check, let's flag as warning or hard filter if client specifies strict preference)
    // For this assignment, we will allow matching across religions unless they are strictly incompatible (e.g. different wantKids/relocation issues)

    return { isEligible: true };
  },

  /**
   * Computes weighted soft compatibility scores out of 100
   */
  computeSoftScore(client: Profile, candidate: Profile): { score: number; reasons: string[] } {
    let score = 40; // Base score for passing hard filters
    const reasons: string[] = [];

    // 1. Children Views (Weight: 30)
    if (client.wantKids === candidate.wantKids) {
      score += MATCHING_RULES.children;
      reasons.push('Shared long-term family goals');
    } else if (client.wantKids === 'Maybe' || candidate.wantKids === 'Maybe') {
      score += MATCHING_RULES.children * 0.5;
      reasons.push('Flexible views on having children');
    }

    // 2. Career / Income (Weight: 20)
    // For male matching female: Female earns less/comparable (standard rule)
    // For female matching male: Male earns equal/more, compatible educational backgrounds
    if (client.gender === 'Male') {
      if (candidate.income <= client.income) {
        score += MATCHING_RULES.career;
        reasons.push('Compatible career stages');
      } else {
        score += MATCHING_RULES.career * 0.5;
        reasons.push('Candidate has higher financial standing');
      }
    } else {
      if (candidate.income >= client.income) {
        score += MATCHING_RULES.career;
        reasons.push('Excellent financial compatibility');
      } else if (candidate.income >= client.income * 0.7) {
        score += MATCHING_RULES.career * 0.7;
        reasons.push('Compatible financial backgrounds');
      }
    }

    // 3. Lifestyle Compatibility (Weight: 15)
    // Diet match, smoking/drinking, fitness level
    let lifestyleScore = 0;
    let lifestyleMatched = 0;
    if (client.diet === candidate.diet) {
      lifestyleScore += 5;
      lifestyleMatched++;
    }
    if (client.drinking === candidate.drinking && client.smoking === candidate.smoking) {
      lifestyleScore += 5;
      lifestyleMatched++;
    }
    if (client.fitnessLevel === candidate.fitnessLevel) {
      lifestyleScore += 5;
      lifestyleMatched++;
    }
    score += (lifestyleScore / 15) * MATCHING_RULES.lifestyle;
    if (lifestyleMatched >= 2) {
      reasons.push('Aligned daily habits and lifestyles');
    }

    // 4. Education (Weight: 15)
    // Check if both went to elite colleges (contains "IIT", "BITS", "IIM", "SRCC", "NIT", "COEP", "VJTI")
    const isClientElite = /IIT|BITS|IIM|SRCC|NIT|COEP|VJTI/.test(client.college);
    const isCandidateElite = /IIT|BITS|IIM|SRCC|NIT|COEP|VJTI/.test(candidate.college);
    if (isClientElite && isCandidateElite) {
      score += MATCHING_RULES.education;
      reasons.push('Similar educational background (Tier-1)');
    } else if (client.degree.split(' ')[0] === candidate.degree.split(' ')[0]) {
      score += MATCHING_RULES.education * 0.7;
      reasons.push('Matching academic streams');
    } else {
      score += MATCHING_RULES.education * 0.4;
    }

    // 5. Language (Weight: 10)
    // Check overlapping languages
    const sharedLanguages = client.languages.filter(lang => candidate.languages.includes(lang));
    if (sharedLanguages.length > 0) {
      score += MATCHING_RULES.language;
      reasons.push(`Communicate in same languages (${sharedLanguages.join(', ')})`);
    }

    // 6. City / Relocation (Weight: 10)
    if (client.city === candidate.city) {
      score += MATCHING_RULES.city;
      reasons.push('Located in same city');
    } else if (client.openToRelocate === 'Yes' || candidate.openToRelocate === 'Yes') {
      score += MATCHING_RULES.city * 0.8;
      reasons.push('Open to relocation');
    } else if (client.openToRelocate === 'Maybe' || candidate.openToRelocate === 'Maybe') {
      score += MATCHING_RULES.city * 0.4;
      reasons.push('Potential relocation flexibility');
    }

    // Bound score between 0 and 100
    const finalScore = Math.min(100, Math.max(0, Math.round(score)));

    return {
      score: finalScore,
      reasons
    };
  }
};
