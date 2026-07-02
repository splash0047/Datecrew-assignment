export const LANGUAGES = [
  'Hindi',
  'English',
  'Marathi',
  'Gujarati',
  'Bengali',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Punjabi'
] as const;

export type Language = typeof LANGUAGES[number];
