import type { Profile } from '../types';

export const COMPATIBILITY_PROMPT_V1 = {
  version: '1.0.0',
  generate: (client: Profile, candidate: Profile): string => {
    return `
You are an expert matchmaking assistant from "The Date Crew". Analyze the compatibility between these two individuals:

CLIENT PROFILE:
Name: ${client.fullName}
Gender: ${client.gender}
Age: ${client.age}
City: ${client.city}
Religion/Caste: ${client.religion} / ${client.caste}
Education: ${client.degree} from ${client.college}
Profession: ${client.designation} at ${client.company} (Income: ${client.income} LPA)
Diet/Lifestyle: ${client.diet} diet, Smoking: ${client.smoking}, Drinking: ${client.drinking}
Family Background: Sibling: ${client.siblings}, Preferred Family Type: ${client.preferredFamilyType}
Hobbies: ${client.hobbies.join(', ')}
About Client: "${client.aboutMe}"

CANDIDATE MATCH PROFILE:
Name: ${candidate.fullName}
Gender: ${candidate.gender}
Age: ${candidate.age}
City: ${candidate.city}
Religion/Caste: ${candidate.religion} / ${candidate.caste}
Education: ${candidate.degree} from ${candidate.college}
Profession: ${candidate.designation} at ${candidate.company} (Income: ${candidate.income} LPA)
Diet/Lifestyle: ${candidate.diet} diet, Smoking: ${candidate.smoking}, Drinking: ${candidate.drinking}
Family Background: Sibling: ${candidate.siblings}, Preferred Family Type: ${candidate.preferredFamilyType}
Hobbies: ${candidate.hobbies.join(', ')}
About Candidate: "${candidate.aboutMe}"

Based on this information, provide a detailed compatibility report. Your output MUST be a valid JSON object matching this structure EXACTLY:
{
  "score": <number between 0 and 100 representing compatibility>,
  "reasons": ["strength 1", "strength 2", "strength 3"],
  "concerns": ["concern 1", "concern 2"],
  "recommendation": "A detailed 2-3 sentence summary explaining why this match works and how they align.",
  "nextStep": "A single specific recommended action (e.g., 'Schedule a virtual introduction', 'Discuss location flexibility', 'Confirm diet preferences')."
}

Do not include any markdown styling like \`\`\`json or backticks in the response. Return ONLY raw JSON text.
`;
  }
};
