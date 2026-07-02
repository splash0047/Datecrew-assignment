import fs from 'fs';
import path from 'path';

const MALE_FIRST_NAMES = [
  'Arjun', 'Kabir', 'Rohan', 'Aravind', 'Dev', 'Zain', 'Vikram', 'Nikhil', 'Siddharth', 'Aditya',
  'Rahul', 'Sanjay', 'Amit', 'Sandeep', 'Ranveer', 'Kunal', 'Aaryan', 'Girish', 'Varun', 'Karan',
  'Abhishek', 'Manoj', 'Rakesh', 'Manish', 'Gaurav', 'Tarun', 'Puneet', 'Vivek', 'Harish', 'Aniket',
  'Piyush', 'Parth', 'Shreyas', 'Ishaan', 'Pranav', 'Yash', 'Ritvik', 'Ayush', 'Kartik', 'Chirag'
];

const FEMALE_FIRST_NAMES = [
  'Priya', 'Sneha', 'Neha', 'Anjali', 'Ritu', 'Farah', 'Meera', 'Jaspreet', 'Shruti', 'Tanvi',
  'Riya', 'Shreya', 'Aditi', 'Divya', 'Pooja', 'Aarti', 'Swati', 'Preeti', 'Payal', 'Komal',
  'Kajal', 'Nikita', 'Mansi', 'Rashi', 'Kirti', 'Nisha', 'Shilpa', 'Rashmi', 'Deepa', 'Kavita',
  'Jyoti', 'Sunita', 'Madhuri', 'Kiran', 'Rekha', 'Shraddha', 'Alia', 'Deepika', 'Anushka', 'Kriti'
];

const LAST_NAMES = [
  'Mehta', 'Sharma', 'Deshmukh', 'Nair', 'Khanna', 'Siddiqui', 'Singhania', 'Pillai', 'Joshi', 'Roy',
  'Deshpande', 'Patel', 'Sen', 'Reddy', 'Gill', 'Singhal', 'Goel', 'Menon', 'Kapoor', 'Wadhwa',
  'Trivedi', 'Bhatia', 'Malhotra', 'Bansal', 'Gupta', 'Aggarwal', 'Verma', 'Bose', 'Iyer', 'Iyengar',
  'Rao', 'Kulkarni', 'Sawant', 'Shinde', 'Patil', 'More', 'Pawar', 'Raje', 'Gaikwad', 'Nambiar'
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Nashik', 'Gurgaon', 'Noida'
];

const LANGUAGES = [
  'Hindi', 'English', 'Marathi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Punjabi'
];

const OCCUPATIONS_CONFIG = [
  { title: 'Software Engineer', companies: ['Google', 'Microsoft', 'TCS', 'Infosys', 'Cognizant'], incomeRange: [15, 45], degrees: ['B.Tech Computer Science', 'M.Tech Data Science', 'MS in Computer Science'] },
  { title: 'Product Manager', companies: ['Google', 'Microsoft', 'Siemens', 'Uber', 'Flipkart'], incomeRange: [25, 60], degrees: ['MBA', 'B.Tech + MBA'] },
  { title: 'Doctor', companies: ['Apollo Hospitals', 'Fortis Healthcare', 'Care Dental Clinic', 'Max Hospital'], incomeRange: [18, 50], degrees: ['MBBS', 'BDS Dentistry', 'MD Internal Medicine'] },
  { title: 'Chartered Accountant', companies: ['EY', 'Deloitte', 'PwC', 'KPMG'], incomeRange: [12, 35], degrees: ['Chartered Accountant (CA)', 'B.Com + CA'] },
  { title: 'Consultant', companies: ['McKinsey', 'BCG', 'Bain & Company', 'PwC', 'KPMG'], incomeRange: [18, 55], degrees: ['MBA Finance', 'PGDM', 'B.Sc Economics'] },
  { title: 'Investment Banker', companies: ['JP Morgan', 'Goldman Sachs', 'Morgan Stanley'], incomeRange: [30, 90], degrees: ['MBA Finance', 'M.Sc Finance'] },
  { title: 'Architect', companies: ['Wadhwa Associates', 'Hafeez Contractor', 'Morphogenesis'], incomeRange: [10, 30], degrees: ['B.Arch', 'M.Arch'] },
  { title: 'HR Manager', companies: ['TCS', 'Google', 'ICICI Bank', 'Unilever'], incomeRange: [10, 25], degrees: ['MBA HR', 'M.A. Psychology'] },
  { title: 'Entrepreneur', companies: ['Self-Owned', 'Singhal Capital', 'Startups'], incomeRange: [30, 150], degrees: ['B.Tech', 'B.Com', 'MBA'] },
  { title: 'Data Scientist', companies: ['Google', 'Microsoft', 'Amazon', 'Fractal Analytics'], incomeRange: [18, 50], degrees: ['B.Tech', 'M.Sc Statistics', 'MS Data Science'] }
];

const RELIGION_CASTE_MAP = {
  Hindu: ['Brahmin', 'Khatri', 'Maratha', 'Nair', 'Marwari Agrawal', 'Baniya Goel', 'Deshastha Brahmin', 'Kokanastha Brahmin', 'Kayastha', 'Gujarati Patel', 'Rajput', 'Reddy', 'Iyer', 'Iyengar', 'Lingayat', 'Gowda'],
  Muslim: ['Sunni', 'Shia'],
  Sikh: ['Jat Sikh', 'Khatri Sikh'],
  Jain: ['Shvetambara', 'Digambara'],
  Christian: ['Roman Catholic', 'Protestant'],
  Buddhist: ['Neo-Buddhist'],
  Parsi: ['Parsi']
};

const HOBBIES = [
  'Trekking', 'Reading', 'Photography', 'Yoga', 'Baking', 'Classical Kathak', 'Painting', 'Travel Writing', 'Gardening',
  'Running', 'Stocks', 'Gourmet Cooking', 'Chess', 'Sci-Fi Movies', 'Astronomy', 'Polo', 'Wine Tasting', 'Art Collecting',
  'Cycling', 'DIY', 'Playing Violin', 'Debating', 'Playing Harmonium', 'Tennis', 'Squash', 'Standup Comedy', 'Salsa Dance', 'Singing'
];

const MALE_AVATAR_LINKS = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1542327897-d73f4005b533?w=150&h=150&fit=crop'
];

const FEMALE_AVATAR_LINKS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&h=150&fit=crop'
];

const STAGES = ['Verified', 'Consultation', 'Matching', 'Meeting', 'Closed'];

function generateProfile(idNum, gender) {
  const isMale = gender === 'Male';
  const firstNames = isMale ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES;
  const avatars = isMale ? MALE_AVATAR_LINKS : FEMALE_AVATAR_LINKS;

  const firstName = firstNames[idNum % firstNames.length];
  const lastName = LAST_NAMES[(idNum + 3) % LAST_NAMES.length];
  const fullName = `${firstName} ${lastName}`;
  const id = `TDC-2026-${String(idNum).padStart(3, '0')}`;

  const age = 25 + (idNum % 13); // Ages 25-37
  const birthYear = 2026 - age;
  const birthMonth = String((idNum % 12) + 1).padStart(2, '0');
  const birthDay = String((idNum % 28) + 1).padStart(2, '0');
  const dob = `${birthYear}-${birthMonth}-${birthDay}`;

  const city = CITIES[idNum % CITIES.length];
  const country = 'India';

  // Heights from 150cm to 190cm
  const baseHeight = isMale ? 170 : 155;
  const heightCm = baseHeight + (idNum % 18);
  const ft = Math.floor(heightCm / 30.48);
  const inches = Math.round((heightCm % 30.48) / 2.54);
  const height = `${ft}'${inches}"`;

  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  const phone = `+91 9${String(100000000 + (idNum * 123456) % 899999999)}`;

  // Profession configuration
  const config = OCCUPATIONS_CONFIG[idNum % OCCUPATIONS_CONFIG.length];
  const designation = config.title === 'Software Engineer' ? (age > 32 ? 'Principal Architect' : 'Senior Tech Lead') :
                      config.title === 'Doctor' ? 'Consultant Practitioner' :
                      config.title === 'Consultant' ? (age > 30 ? 'Senior Manager Strategy' : 'Consultant') :
                      config.title === 'Entrepreneur' ? 'Founder & CEO' : 'Lead Specialist';
  const company = config.companies[idNum % config.companies.length];
  const income = config.incomeRange[0] + (idNum % (config.incomeRange[1] - config.incomeRange[0]));
  const degree = config.degrees[idNum % config.degrees.length];
  const college = idNum % 3 === 0 ? 'IIT Bombay' : idNum % 3 === 1 ? 'BITS Pilani' : 'Delhi University';

  const maritalStatus = idNum % 15 === 0 ? 'Divorced' : 'Never Married';
  
  // Religion and caste
  const religions = Object.keys(RELIGION_CASTE_MAP);
  const religion = religions[idNum % religions.length];
  const castes = RELIGION_CASTE_MAP[religion];
  const caste = castes[idNum % castes.length];

  const wantKids = idNum % 5 === 0 ? 'Maybe' : idNum % 5 === 4 ? 'No' : 'Yes';
  const openToRelocate = idNum % 3 === 0 ? 'Yes' : idNum % 3 === 1 ? 'Maybe' : 'No';
  const openToPets = idNum % 4 === 0 ? 'Yes' : idNum % 4 === 3 ? 'Maybe' : 'No';
  const preferredFamilyType = idNum % 2 === 0 ? 'Nuclear' : 'Joint';
  const diet = idNum % 3 === 0 ? 'Vegetarian' : idNum % 3 === 1 ? 'Eggitarian' : 'Non-Vegetarian';
  
  const smoking = idNum % 10 === 0 ? 'Yes' : idNum % 10 === 1 ? 'Occasionally' : 'No';
  const drinking = idNum % 5 === 0 ? 'Yes' : idNum % 5 === 1 ? 'Occasionally' : 'No';
  
  const weekendPreference = idNum % 3 === 0 ? 'Outdoors / Trekking' : idNum % 3 === 1 ? 'Social Gatherings / Dining' : 'Resting / Music at Home';
  const travelFrequency = idNum % 3 === 0 ? 'High' : idNum % 3 === 1 ? 'Moderate' : 'Low';
  const fitnessLevel = idNum % 2 === 0 ? 'High' : 'Moderate';
  const workStyle = idNum % 3 === 0 ? 'Remote' : idNum % 3 === 1 ? 'Hybrid' : 'Office';

  const languages = ['English'];
  if (isMale) {
    languages.push(idNum % 2 === 0 ? 'Hindi' : 'Marathi');
  } else {
    languages.push(idNum % 2 === 0 ? 'Hindi' : 'Bengali');
  }
  if (idNum % 3 === 0) languages.push('Gujarati');

  const siblingsList = ['None', '1 younger sister', '1 older brother', '1 sister', '2 brothers'];
  const siblings = siblingsList[idNum % siblingsList.length];

  const hobbiesList = [
    [HOBBIES[idNum % HOBBIES.length], HOBBIES[(idNum + 5) % HOBBIES.length]],
    [HOBBIES[(idNum + 2) % HOBBIES.length], HOBBIES[(idNum + 8) % HOBBIES.length], HOBBIES[(idNum + 12) % HOBBIES.length]]
  ];
  const hobbies = hobbiesList[idNum % hobbiesList.length];

  const avatar = avatars[idNum % avatars.length];

  const stage = STAGES[idNum % STAGES.length];

  const completenessScore = 80 + (idNum % 21); // 80% to 100%
  const missing = [];
  if (completenessScore < 90) missing.push('Parents\' Occupation', 'Weekend Preferences');
  else if (completenessScore < 100) missing.push('Family Wealth Details');

  const verificationStatus = {
    identity: 'Verified',
    phone: 'Verified',
    email: 'Verified',
    income: idNum % 7 === 0 ? 'Pending' : 'Verified',
    education: 'Verified'
  };

  const lifestyleText = isMale ? 'Active' : 'Balanced';
  const aboutMe = `I am a ${designation.toLowerCase()} based in ${city}. I consider myself a ${lifestyleText.toLowerCase()} person who values ${preferredFamilyType.toLowerCase()} family values. Looking for a partner who is career-focused yet grounded.`;

  return {
    id,
    firstName,
    lastName,
    fullName,
    gender,
    dob,
    age,
    city,
    country,
    height,
    heightCm,
    email,
    phone,
    college,
    degree,
    income,
    company,
    designation,
    maritalStatus,
    languages,
    siblings,
    caste,
    religion,
    wantKids,
    openToRelocate,
    openToPets,
    lifestyle: lifestyleText,
    hobbies,
    preferredFamilyType,
    diet,
    smoking,
    drinking,
    weekendPreference,
    travelFrequency,
    fitnessLevel,
    workStyle,
    profileCompleteness: completenessScore,
    missingFields: missing,
    verificationStatus,
    avatar,
    aboutMe,
    stage
  };
}

const maleProfiles = [];
const femaleProfiles = [];

for (let i = 1; i <= 75; i++) {
  maleProfiles.push(generateProfile(i, 'Male'));
}

for (let i = 101; i <= 175; i++) {
  femaleProfiles.push(generateProfile(i, 'Female'));
}

fs.writeFileSync(path.join(process.cwd(), 'src/data/male.json'), JSON.stringify(maleProfiles, null, 2));
fs.writeFileSync(path.join(process.cwd(), 'src/data/female.json'), JSON.stringify(femaleProfiles, null, 2));

console.log('Seeded 75 male and 75 female static profiles successfully!');
