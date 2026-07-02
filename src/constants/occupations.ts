export const OCCUPATIONS = [
  'Software Engineer',
  'Product Manager',
  'Doctor',
  'Chartered Accountant',
  'Consultant',
  'Investment Banker',
  'Marketing Director',
  'Architect',
  'HR Business Partner',
  'Entrepreneur',
  'Data Scientist',
  'Design Lead'
] as const;

export type Occupation = typeof OCCUPATIONS[number];
