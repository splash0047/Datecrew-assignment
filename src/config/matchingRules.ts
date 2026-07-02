export const MATCHING_RULES = {
  children: 30,
  career: 20,
  lifestyle: 15,
  education: 15,
  language: 10,
  city: 10,
} as const;

export type MatchingRulesKeys = keyof typeof MATCHING_RULES;
