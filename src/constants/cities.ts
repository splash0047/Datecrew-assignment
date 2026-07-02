export const CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Nashik',
  'Gurgaon',
  'Noida'
] as const;

export type City = typeof CITIES[number];
