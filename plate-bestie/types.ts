
export enum AppState {
  HOME = 'HOME',
  SCAN = 'SCAN',
  ANALYZING = 'ANALYZING',
  GARDEN = 'GARDEN',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS',
  SPACE_SCAN = 'SPACE_SCAN',
  SPACE_RESULTS = 'SPACE_RESULTS'
}

export interface InterestPoint {
  x: number; // 0-100
  y: number; // 0-100
  label: string;
  explanation?: string;
}

export interface ChatEntry {
  role: 'user' | 'assistant';
  text: string;
}

export interface PlantAnalysis {
  name?: string;
  intro?: string;
  sun: {
    level: string;
    requirement: string;
  };
  seed: {
    stage: string;
  };
  soil: {
    quality: string;
    ph: string;
  };
  water: {
    status: string;
  };
  missionLog: string;
  interestPoint?: InterestPoint;
}

export interface SpaceHotSpot {
  x: number; // 0-100
  y: number; // 0-100
  label: string;
  severity: number; // 1-5
  reasoning: string;
  recommendedPlant: string;
}

export interface SpaceAnalysis {
  hotSpots: SpaceHotSpot[];
  summary: string;
}

export interface HistoryItem {
  id: string;
  name: string;
  date: string;
  image: string;
  audio?: string; // Base64 encoded audio snippet
  analysis: PlantAnalysis | SpaceAnalysis;
  type: 'plant' | 'space';
  chatHistory?: ChatEntry[];
}

export interface UserStats {
  xp: number;
  coins: number;
  streak: number;
}
