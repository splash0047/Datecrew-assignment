import type { Profile } from '../../types';
import { ENV } from '../../config/env';
import { COMPATIBILITY_PROMPT_V1 } from '../../prompts/compatibility.v1';
import { EMAIL_PROMPT_V1 } from '../../prompts/email.v1';
import { matchingService } from '../matching';

export interface AIAnalysisResult {
  score: number;
  reasons: string[];
  concerns: string[];
  recommendation: string;
  nextStep: string;
}

export interface AIEmailResult {
  professional: string;
  friendly: string;
  warm: string;
}

export const geminiService = {
  /**
   * Generates compatibility analysis between client and candidate
   */
  async generateAnalysis(client: Profile, candidate: Profile): Promise<{ data: AIAnalysisResult; isFallback: boolean }> {
    if (!ENV.GEMINI_API_KEY) {
      console.info('No Gemini API key found, using local fallback analysis.');
      return { data: this.generateLocalAnalysisFallback(client, candidate), isFallback: true };
    }

    const prompt = COMPATIBILITY_PROMPT_V1.generate(client, candidate);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${ENV.MODEL}:generateContent?key=${ENV.GEMINI_API_KEY}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API responded with status ${response.status}`);
      }

      const payload = await response.json();
      const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('Empty text response from Gemini API');
      }

      const cleanJson = this.extractJson(text);
      const data = JSON.parse(cleanJson) as AIAnalysisResult;
      
      return { data, isFallback: false };
    } catch (e) {
      console.warn('Gemini API call failed, falling back to local analysis.', e);
      return { data: this.generateLocalAnalysisFallback(client, candidate), isFallback: true };
    }
  },

  /**
   * Generates three tone email drafts
   */
  async generateEmailDrafts(client: Profile, candidate: Profile): Promise<{ data: AIEmailResult; isFallback: boolean }> {
    if (!ENV.GEMINI_API_KEY) {
      console.info('No Gemini API key found, using local fallback email generator.');
      return { data: this.generateLocalEmailFallback(client, candidate), isFallback: true };
    }

    const prompt = EMAIL_PROMPT_V1.generate(client, candidate);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${ENV.MODEL}:generateContent?key=${ENV.GEMINI_API_KEY}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API responded with status ${response.status}`);
      }

      const payload = await response.json();
      const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('Empty text response from Gemini API');
      }

      const cleanJson = this.extractJson(text);
      const data = JSON.parse(cleanJson) as AIEmailResult;

      return { data, isFallback: false };
    } catch (e) {
      console.warn('Gemini API call failed, falling back to local email generator.', e);
      return { data: this.generateLocalEmailFallback(client, candidate), isFallback: true };
    }
  },

  /**
   * Extracts clean JSON from potential markdown wrapped response
   */
  extractJson(text: string): string {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? jsonMatch[0] : text;
  },

  /**
   * High-fidelity local fallback generator for compatibility analysis
   */
  generateLocalAnalysisFallback(client: Profile, candidate: Profile): AIAnalysisResult {
    // Rely on our local matching engine for the base score and strengths list
    const matchResult = matchingService.computeSoftScore(client, candidate);
    
    const concerns: string[] = [];
    let nextStep = 'Schedule an introductory call.';
    let recommendation = '';

    // Generate smart concerns based on differences
    if (client.city !== candidate.city) {
      concerns.push(`Living in different cities (Client: ${client.city}, Candidate: ${candidate.city})`);
      nextStep = 'Discuss relocation preferences during the introductory call.';
    }
    if (client.diet !== candidate.diet) {
      concerns.push(`Different dietary habits (Client: ${client.diet}, Candidate: ${candidate.diet})`);
    }
    if (Math.abs(client.income - candidate.income) > 20) {
      concerns.push('Large income gap between partners');
    }
    if (client.religion !== candidate.religion) {
      concerns.push(`Different religious practices (${client.religion} and ${candidate.religion})`);
    }

    if (concerns.length === 0) {
      concerns.push('No significant lifestyle or demographic conflicts detected.');
    }

    // Dynamic paragraph generation
    const commonHobbies = client.hobbies.filter(h => candidate.hobbies.includes(h));
    const hobbiesText = commonHobbies.length > 0 
      ? ` sharing mutual interests in ${commonHobbies.join(' and ')}`
      : '';

    recommendation = `${client.firstName} and ${candidate.firstName} demonstrate solid alignment in core values,${hobbiesText}. Both profiles show strong educational credentials (${client.college} and ${candidate.college}) and stable career positions. ${candidate.firstName}'s career as a ${candidate.designation} matches ${client.firstName}'s status, establishing a reliable ground for mutual understanding.`;

    return {
      score: matchResult.score,
      reasons: matchResult.reasons.length > 0 ? matchResult.reasons : ['Passing hard filters', 'Stable career stages'],
      concerns,
      recommendation,
      nextStep
    };
  },

  /**
   * High-fidelity local fallback generator for emails
   */
  generateLocalEmailFallback(client: Profile, candidate: Profile): AIEmailResult {
    const subjectLine = `[Recommendation] Profile match for ${client.fullName} - The Date Crew`;
    
    const professional = `Subject: ${subjectLine}\n\nDear Wadhwa/Mehta family,\n\nWe have reviewed the profile of ${candidate.fullName} (ID: ${candidate.id}) for ${client.firstName}.\n\n${candidate.firstName} is working as a ${candidate.designation} at ${candidate.company} (Income: ${candidate.income} LPA) and completed ${candidate.degree} from ${candidate.college}. He/she comes from a respectable ${candidate.preferredFamilyType.toLowerCase()} family and is settled in ${candidate.city}.\n\nGiven the aligned professional and educational backgrounds, we highly recommend initiating a conversation. Please let us know if we should share ${client.firstName}'s details with them.\n\nWarm regards,\nLead Matchmaker\nThe Date Crew`;

    const friendly = `Subject: Quick profile match suggestion: ${candidate.firstName}!\n\nHey ${client.firstName},\n\nI was looking at some profiles today and found ${candidate.firstName} (ID: ${candidate.id}).\n\nI think you two would vibe really well! She/he is a ${candidate.designation} at ${candidate.company} in ${candidate.city}. Aside from work, she/he loves ${candidate.hobbies.slice(0, 2).join(' and ')} which matches your interest. Plus, she/he went to ${candidate.college}.\n\nLet me know if this looks interesting, and we can schedule a quick intro call!\n\nBest,\nYour Matchmaker`;

    const warm = `Subject: Aligned profile match: ${candidate.fullName} for ${client.firstName}\n\nNamaste Wadhwa/Mehta Family,\n\nWe hope you are doing well. We have found a wonderful proposal of ${candidate.fullName} for ${client.firstName}.\n\n${candidate.firstName} is a highly educated and family-oriented individual, working as a ${candidate.designation} at ${candidate.company}. They share your family's values of ${candidate.diet.toLowerCase()} diet and respect for traditions, while maintaining a progressive modern outlook. \n\nWe feel this match has excellent compatibility and family alignment. We would be happy to facilitate a meeting between the families.\n\nPranam,\nThe Date Crew Matchmaking Team`;

    return {
      professional,
      friendly,
      warm
    };
  }
};
