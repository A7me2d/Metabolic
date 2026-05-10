export interface Meal {
  id: string;
  userId: string;
  foodName: string;
  macros: Macros;
  confidence?: number; // AI confidence score (0-1)
  source: 'ai' | 'manual';
  imageUrl?: string; // Base64 or URL
  timestamp: string;
  createdAt: string;
}

export interface Macros {
  cal: number; // calories
  p: number;   // protein (g)
  c: number;   // carbs (g)
  f: number;   // fat (g)
}

export interface GeminiFoodResponse {
  food_name: string;
  macros: {
    cal: number;
    p: number;
    c: number;
    f: number;
  };
  confidence: number;
}

export interface DailyTargets {
  lose: number;
  maintain: number;
  gain: number;
}
