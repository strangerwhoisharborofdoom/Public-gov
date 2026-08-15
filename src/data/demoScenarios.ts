import { CitizenProfile, LanguageCode } from '../types';

export interface JudgeScenario {
  id: string;
  title: string;
  subtitle: string;
  personaName: string;
  age: number;
  demographicType: 'STUDENT' | 'FARMER' | 'SENIOR_CITIZEN' | 'RURAL_ARTISAN';
  defaultLanguage: LanguageCode;
  initialVoicePrompt: string;
  initialTextPrompt: string;
  englishTranslation: string;
  citizenProfile: CitizenProfile;
  expectedPrimarySchemeId: string;
  expectedMatchPercentage: number;
  keyHighlights: string[];
  suggestedMissingQuestions: string[];
}

export const JUDGE_DEMO_SCENARIOS: JudgeScenario[] = [
  {
    id: 'scenario-student',
    title: 'Student & Youth Opportunity',
    subtitle: 'Higher education scholarship for girl student in engineering/diploma',
    personaName: 'Asha (Parent applying for daughter)',
    age: 19,
    demographicType: 'STUDENT',
    defaultLanguage: 'kn',
    initialVoicePrompt: 'ನನ್ನ ಮಗಳ ಓದಿಗೆ ಹಣದ ಸಹಾಯ ಬೇಕು.',
    initialTextPrompt: 'ನನ್ನ ಮಗಳ ಓದಿಗೆ ಹಣದ ಸಹಾಯ ಬೇಕು.',
    englishTranslation: 'I need financial support for my daughter\'s higher education.',
    citizenProfile: {
      id: 'citizen-asha',
      fullName: 'Asha Kumari',
      age: 19,
      gender: 'FEMALE',
      state: 'Karnataka',
      district: 'Bengaluru Rural',
      annualIncome: 180000,
      occupation: 'STUDENT',
      studentLevel: 'UNDERGRADUATE',
      isArtisan: false,
      hasDisability: false,
      casteCategory: 'OBC',
      rationCardType: 'BPL',
      preferredLanguage: 'kn',
      seniorMode: false,
      highContrast: false,
      voiceReadAloud: true
    },
    expectedPrimarySchemeId: 'aicte-pragati-scholarship',
    expectedMatchPercentage: 92,
    keyHighlights: [
      'Kannada speech-to-text recognition',
      'Intent detection: Education & Girl Child Scholarship',
      'Deterministic rule match: Age, Income ≤ ₹8L, Female student in Degree',
      'AI Explain Simply breakdown in Kannada',
      'Guided Application Workspace with instant reference ID'
    ],
    suggestedMissingQuestions: [
      'Is she enrolled in 1st year degree or diploma college?',
      'What is your approximate family annual income?'
    ]
  },

  {
    id: 'scenario-farmer',
    title: 'Farmer & Agriculture Support',
    subtitle: 'Direct financial support and crop insurance for agricultural landholder',
    personaName: 'Ravi Kumar',
    age: 44,
    demographicType: 'FARMER',
    defaultLanguage: 'kn',
    initialVoicePrompt: 'ನನ್ನ ಜಮೀನಿಗೆ ಬೆಳೆ ವಿಮೆ ಮತ್ತು ಕೃಷಿ ಸಹಾಯಧನ ಬೇಕಾಗಿದೆ.',
    initialTextPrompt: 'ನನ್ನ ಜಮೀನಿಗೆ ಬೆಳೆ ವಿಮೆ ಮತ್ತು ಕೃಷಿ ಸಹಾಯಧನ ಬೇಕಾಗಿದೆ.',
    englishTranslation: 'I need crop insurance and financial assistance for my farm.',
    citizenProfile: {
      id: 'citizen-ravi',
      fullName: 'Ravi Kumar Gowda',
      age: 44,
      gender: 'MALE',
      state: 'Karnataka',
      district: 'Mandya',
      annualIncome: 120000,
      occupation: 'FARMER',
      landHoldingAcres: 2.5,
      isArtisan: false,
      hasDisability: false,
      casteCategory: 'GENERAL',
      rationCardType: 'BPL',
      preferredLanguage: 'kn',
      seniorMode: false,
      highContrast: false,
      voiceReadAloud: false
    },
    expectedPrimarySchemeId: 'pm-kisan-samman-nidhi',
    expectedMatchPercentage: 95,
    keyHighlights: [
      'Landholding check: 2.5 acres agricultural parcel in Mandya',
      'Dual Scheme Match: PM-KISAN (₹6,000/yr) + PM Fasal Bima (Crop Insurance)',
      'Document requirements: RTC Pahani & eKYC Aadhaar passbook',
      'Offline-First local execution demonstration'
    ],
    suggestedMissingQuestions: [
      'Do you own agricultural land in your name?',
      'Which crop are you currently growing?'
    ]
  },

  {
    id: 'scenario-senior',
    title: 'Senior Citizen & Elder Care',
    subtitle: 'Universal ₹5 Lakh hospital cover and monthly old-age pension',
    personaName: 'Lakshmi Devi',
    age: 72,
    demographicType: 'SENIOR_CITIZEN',
    defaultLanguage: 'hi',
    initialVoicePrompt: 'मेरी उम्र 72 वर्ष है, मुझे स्वास्थ्य और दवा के लिए सहायता चाहिए।',
    initialTextPrompt: 'मेरी उम्र 72 वर्ष है, मुझे स्वास्थ्य और दवा के लिए सहायता चाहिए।',
    englishTranslation: 'I am 72 years old, I need help with hospital healthcare and medicines.',
    citizenProfile: {
      id: 'citizen-lakshmi',
      fullName: 'Lakshmi Devi',
      age: 72,
      gender: 'FEMALE',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      annualIncome: 60000,
      occupation: 'RETIRED',
      isArtisan: false,
      hasDisability: false,
      casteCategory: 'GENERAL',
      rationCardType: 'BPL',
      preferredLanguage: 'hi',
      seniorMode: true,
      highContrast: true,
      voiceReadAloud: true
    },
    expectedPrimarySchemeId: 'ayushman-vay-vandana-card',
    expectedMatchPercentage: 100,
    keyHighlights: [
      'Senior Citizen Mode: High contrast, large fonts, audio read aloud',
      'Universal ₹5 Lakh Ayushman Vay Vandana coverage (Age 70+ verified)',
      'IGNOAPS Monthly Pension integration',
      'One-tap Helpline (Elderline 14567) access'
    ],
    suggestedMissingQuestions: [
      'Do you have an active Aadhaar card with your date of birth?',
      'Do you have a BPL ration card for monthly pension credit?'
    ]
  },

  {
    id: 'scenario-artisan',
    title: 'Rural Artisan & MSME Enterprise',
    subtitle: 'PM Vishwakarma toolkit ₹15,000 and 5% collateral-free credit',
    personaName: 'Meera Bai',
    age: 36,
    demographicType: 'RURAL_ARTISAN',
    defaultLanguage: 'en',
    initialVoicePrompt: 'I make traditional handicrafts and need support to buy modern tools and grow my work.',
    initialTextPrompt: 'I make traditional handicrafts and need support to buy modern tools and grow my work.',
    englishTranslation: 'I make traditional handicrafts and need support to buy modern tools and grow my work.',
    citizenProfile: {
      id: 'citizen-meera',
      fullName: 'Meera Bai Soni',
      age: 36,
      gender: 'FEMALE',
      state: 'Rajasthan',
      district: 'Jaipur',
      annualIncome: 140000,
      occupation: 'ARTISAN',
      isArtisan: true,
      artisanTrade: 'WEAVER_SCULPTOR',
      hasDisability: false,
      casteCategory: 'OBC',
      rationCardType: 'BPL',
      preferredLanguage: 'en',
      seniorMode: false,
      highContrast: false,
      voiceReadAloud: false
    },
    expectedPrimarySchemeId: 'pm-vishwakarma-scheme',
    expectedMatchPercentage: 96,
    keyHighlights: [
      'Artisan Trade Classification: 18 traditional trades',
      '₹15,000 ToolKit e-voucher + 5% Collateral-Free ₹3 Lakh Credit',
      'Panchayat / Urban Body verification workflow',
      'Guided Application with instant demo submission'
    ],
    suggestedMissingQuestions: [
      'Which traditional craft or trade do you practice?',
      'Are you looking for toolkits, skill training, or business credit?'
    ]
  }
];
