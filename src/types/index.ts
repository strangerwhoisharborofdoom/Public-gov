/**
 * GovMitra - Data Models and Type Definitions
 * PS3: Digital Citizen Assistant for Multilingual Access to Government Services
 */

export type LanguageCode = 'en' | 'kn' | 'hi' | 'ta' | 'te' | 'mr' | 'bn' | 'ml';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  speechCode: string;
}

export type DemographicCategory = 
  | 'STUDENT'
  | 'FARMER'
  | 'SENIOR_CITIZEN'
  | 'RURAL_ARTISAN'
  | 'WOMEN_AND_CHILD'
  | 'DISABILITY'
  | 'GENERAL_CITIZEN';

export type SchemeCategory =
  | 'EDUCATION'
  | 'AGRICULTURE'
  | 'HEALTHCARE'
  | 'HOUSING'
  | 'EMPLOYMENT'
  | 'WOMEN_CHILD'
  | 'SENIOR_CITIZEN'
  | 'DISABILITY'
  | 'ARTISAN_MSME'
  | 'SOCIAL_WELFARE';

export type VerificationStatus = 'VERIFIED' | 'DEMO' | 'NEEDS_REVIEW' | 'ARCHIVED';

export type ApplicationStatus = 
  | 'DRAFT' 
  | 'IN_PROGRESS' 
  | 'READY_FOR_REVIEW' 
  | 'READY_TO_SUBMIT' 
  | 'PREPARED_READY_FOR_PORTAL'
  | 'DEMO_SUBMITTED' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type SyncState = 'SYNCED' | 'PENDING' | 'FAILED' | 'CONFLICT';

export interface EligibilityRule {
  id: string;
  field: string;
  operator: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'IN' | 'NOT_IN';
  value: string | number | boolean | string[] | number[];
  labelEn: string;
  labelKn?: string;
  labelHi?: string;
  isMandatory: boolean;
}

export interface RequiredDocument {
  id?: string;
  name: string;
  nameKn?: string;
  nameHi?: string;
  description?: string;
  purpose?: string;
  issuingAuthority?: string;
  formatAccepted?: string[];
  maxSizeMB?: number;
  sampleTips?: string;
  isMandatory: boolean;
}

export interface Scheme {
  id: string;
  name: string;
  nameLocal?: Record<LanguageCode, string>;
  localizedNames?: Record<LanguageCode, string>;
  category: SchemeCategory;
  department?: string;
  ministry: string;
  description: string;
  localizedDescriptions?: Record<LanguageCode, string>;
  benefit: string;
  benefitType?: 'FINANCIAL_DBT' | 'SUBSIDY' | 'HEALTH_COVER' | 'TRAINING_KIT' | 'INSURANCE' | 'LOAN_ASSISTANCE' | 'PENSION';
  stateScope?: 'ALL_INDIA' | string;
  officialPortalUrl?: string;
  officialUrl?: string;
  applicationUrl?: string;
  sourceName?: string;
  sourceUrl?: string;
  isVerifiedSource?: boolean;
  verificationStatus?: VerificationStatus;
  lastVerifiedDate?: string;
  lastVerifiedAt?: string;
  active?: boolean;
  simplifiedExplanation: Record<LanguageCode, string>;
  eligibilityRules: EligibilityRule[];
  documentsRequired?: RequiredDocument[];
  requiredDocuments?: RequiredDocument[];
  applicationSteps?: string[];
  tags: string[];
  targetDemographics?: DemographicCategory[];
  helplineNumber?: string;
}

export interface RuleEvaluationResult {
  rule: EligibilityRule;
  status: 'MATCHED' | 'FAILED' | 'UNKNOWN';
  userValue?: any;
  reason: string;
}

export interface EligibilityMatchResult {
  schemeId: string;
  matchScore: number;
  status: 'HIGH_MATCH' | 'POTENTIAL_MATCH' | 'UNLIKELY_MATCH' | 'INSUFFICIENT_DATA';
  matchedRules: RuleEvaluationResult[];
  failedRules: RuleEvaluationResult[];
  unknownRules: RuleEvaluationResult[];
  summaryText: string;
  disclaimer: string;
}

export interface CitizenProfile {
  id: string;
  fullName: string;
  age: number;
  gender?: 'MALE' | 'FEMALE' | 'TRANSGENDER' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  state: string;
  district?: string;
  annualIncome: number;
  occupation: 'STUDENT' | 'FARMER' | 'ARTISAN' | 'SELF_EMPLOYED' | 'UNEMPLOYED' | 'RETIRED' | 'OTHER';
  studentLevel?: 'SCHOOL' | 'SECONDARY' | 'HIGHER_SECONDARY' | 'UNDERGRADUATE' | 'POSTGRADUATE' | 'DIPLOMA' | 'ITI' | 'NONE';
  landHoldingAcres?: number;
  isArtisan?: boolean;
  artisanTrade?: string;
  hasDisability?: boolean;
  disabilityPercent?: number;
  casteCategory?: 'GENERAL' | 'OBC' | 'SC' | 'ST' | 'EWS';
  rationCardType?: 'BPL' | 'AAY' | 'APL' | 'NONE';
  mobileNumber?: string;
  preferredLanguage: LanguageCode;
  seniorMode: boolean;
  highContrast: boolean;
  voiceReadAloud: boolean;
}

export interface UploadedDocument {
  id: string;
  documentId: string;
  documentName: string;
  fileName: string;
  fileSize: number;
  fileDataUrl?: string;
  uploadedAt: string;
  status: 'MISSING' | 'UPLOADED' | 'REVIEW_REQUIRED' | 'READY';
  aiAnalysis?: {
    verifiedDocumentType: boolean;
    extractedName?: string;
    confidenceScore: number;
    notes: string;
  };
}

export interface SchemeApplication {
  id: string;
  schemeId: string;
  schemeName: string;
  referenceId: string;
  citizenProfileId?: string;
  applicantId?: string;
  applicantName?: string;
  currentStep?: number;
  status: ApplicationStatus;
  submittedAt: string;
  formData: Record<string, any>;
  answers?: Record<string, any>;
  documents?: UploadedDocument[];
  documentsAttached: Array<{
    documentType: string;
    fileName: string;
    verificationStatus: string;
  }>;
  selfDeclarationConfirmed?: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  syncState?: SyncState;
  officialSubmissionUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'MITRA' | 'SYSTEM' | 'CITIZEN' | 'ASSISTANT';
  text: string;
  timestamp: string;
  language?: LanguageCode;
  type?: 'TEXT' | 'SCHEME_CARD' | 'ELIGIBILITY_CARD' | 'DOCUMENT_CARD' | 'QUESTIONNAIRE' | 'CONFIRMATION' | 'SYSTEM_ALERT';
  schemeCards?: Scheme[];
  detectedIntent?: string;
  matchedSchemes?: Scheme[];
  eligibilityResult?: EligibilityMatchResult;
  suggestedFollowUps?: string[];
  isAiGenerated?: boolean;
  audioBase64?: string;
  isReadAloudActive?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'APPLICATION_UPDATE' | 'DOCUMENT_REMINDER' | 'SCHEME_ALERT' | 'SYNC_STATUS';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  category: 'ELIGIBILITY' | 'APPLICATION' | 'AI_QUERY' | 'SYNC' | 'ADMIN' | 'DATA_PRIVACY' | 'SIMULATION' | 'PROFILE';
  details: string;
  userId?: string;
}
