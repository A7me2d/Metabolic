export interface Exercise {
  id: number;
  name: string;
  nameAr: string;
  sets: number;
  reps: string;
  rest: string;
  primaryMuscle: string;
  primaryMuscleAr: string;
  secondaryMuscle: string[];
  secondaryMuscleAr: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string;
  equipmentAr: string;
  imageUrl: string;
  description: string;
  descriptionAr: string;
  instructions: string[];
  instructionsAr: string[];
  commonMistakes: string[];
  commonMistakesAr: string[];
  safetyTips: string[];
  safetyTipsAr: string[];
  alternatives: string[];
  alternativesAr: string[];
}

export interface ExerciseLog {
  exerciseId: number;
  completed: boolean;
  weights: number[];
  completedSets: number;
}

export interface WorkoutDay {
  id: number;
  name: string;
  focus: string;
  isRestDay: boolean;
  exercises: Exercise[];
}

export interface WorkoutLog {
  id: string;
  date: string;
  dayId: number;
  exerciseLogs: ExerciseLog[];
  totalVolume: number;
  duration: number;
  completed: boolean;
}

export interface WeeklyProgress {
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  completedDays: number[];
  totalVolume: number;
  totalWorkouts: number;
}

export interface UserStats {
  totalWorkouts: number;
  totalVolume: number;
  totalSets: number;
  totalReps: number;
  personalRecords: { [exerciseName: string]: number };
  personalRecordsCount: number;
  streak: number;
  lastWorkoutDate: string | null;
}
