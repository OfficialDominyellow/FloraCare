export interface LightCare {
  level: string;
  description: string;
  idealHours: string;
}

export interface WateringCare {
  frequencyDaysSummer: number;
  frequencyDaysWinter: number;
  method: string;
  soilCheckTip: string;
  overwaterSigns: string;
  underwaterSigns: string;
}

export interface TemperatureCare {
  idealRange: string;
  minSurvivalC: number;
  winterAdvice: string;
}

export interface HumidityCare {
  idealPercent: string;
  tips: string;
}

export interface SoilAndPottingCare {
  soilMix: string;
  potType: string;
  repottingIntervalMonths: number;
  repottingTips: string;
}

export interface FertilizerCare {
  frequency: string;
  season: string;
  tips: string;
}

export interface ToxicityCare {
  safeForPets: boolean;
  safeForChildren: boolean;
  details: string;
}

export interface PropagationCare {
  methods: string[];
  bestSeason: string;
  instructions: string;
}

export interface DiagnosisInfo {
  hasIssue: boolean;
  issueTitle?: string;
  severity?: '경미' | '보통' | '심각' | string;
  symptoms?: string[];
  cause?: string;
  treatments?: string[];
  preventions?: string[];
}

export interface PlantCareGuide {
  light: LightCare;
  watering: WateringCare;
  temperature: TemperatureCare;
  humidity: HumidityCare;
  soilAndPotting: SoilAndPottingCare;
  fertilizer: FertilizerCare;
  toxicity: ToxicityCare;
  propagation: PropagationCare;
  pruning: string;
  funFacts: string[];
}

export interface PlantAnalysisResult {
  isPlant: boolean;
  commonNameKo: string;
  commonNameEn: string;
  scientificName: string;
  family: string;
  confidence: number;
  difficultyLevel: string;
  airPurifyingEffect: number;
  summary: string;
  healthStatus: '건강함' | '주의 필요' | '병충해/과습 의심' | '알 수 없음' | string;
  diagnosis?: DiagnosisInfo;
  careGuide: PlantCareGuide;
}

export interface SavedPlant {
  id: string;
  nickname: string;
  plantData: PlantAnalysisResult;
  imageUrl: string;
  location: string;
  lastWateredDate: string; // ISO string
  notes?: string;
  createdDate: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
}
