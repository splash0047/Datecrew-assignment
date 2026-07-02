export const RELIGIONS = [
  'Hindu',
  'Muslim',
  'Christian',
  'Sikh',
  'Jain',
  'Buddhist',
  'Parsi',
  'Spiritual - Non Religious'
] as const;

export type Religion = typeof RELIGIONS[number];
