export interface Supplement {
  id: string;
  userId: string;
  name: string;
  type: SupplementType;
  dosage?: string;
  time: string; // Time of day taken
  timestamp: string;
  createdAt: string;
}

export type SupplementType = 'vitamin' | 'mineral' | 'herbal' | 'protein' | 'other';

export const SUPPLEMENT_TYPES: SupplementType[] = ['vitamin', 'mineral', 'herbal', 'protein', 'other'];
