import type { Profile } from '../types';

export const EMAIL_PROMPT_V1 = {
  version: '1.0.0',
  generate: (client: Profile, candidate: Profile): string => {
    return `
You are a senior matchmaker assistant at "The Date Crew". Create a personalized email introduction draft to recommend ${candidate.fullName} to ${client.fullName}'s family.

CLIENT HIGHLIGHTS:
Name: ${client.fullName}
Profession: ${client.designation} at ${client.company}
City: ${client.city}
Education: ${client.degree}

CANDIDATE HIGHLIGHTS:
Name: ${candidate.fullName}
Profession: ${candidate.designation} at ${candidate.company}
City: ${candidate.city}
Education: ${candidate.degree}

Draft three variants of the email introduction (a recommendation pitch) from the matchmaker to ${client.fullName}'s parents/family.
Your output MUST be a valid JSON object matching this structure EXACTLY:
{
  "professional": "An elegant, respectful, and career-focused formal email recommendation.",
  "friendly": "A warm, pleasant, and approachable introduction emphasizing shared interests and vibes.",
  "warm": "A deeply personal, family-oriented, and emotionally resonant email highlighting cultural alignment and life goals."
}

Do not include any markdown styling like \`\`\`json or backticks in the response. Return ONLY raw JSON text.
`;
  }
};
