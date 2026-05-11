export interface HomeExercise {
  id: number;
  name: string;
  nameAr: string;
  sets: number;
  reps: string;
  rest: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  primaryMuscle: string;
  primaryMuscleAr: string;
  secondaryMuscle: string[];
  secondaryMuscleAr: string[];
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
  isDurationBased: boolean;
  duration?: number; // Duration in seconds for holds/planks
}

export interface HomeWorkoutDay {
  id: number;
  name: string;
  nameAr: string;
  focus: string;
  focusAr: string;
  isRestDay: boolean;
  exercises: HomeExercise[];
}

export interface HomeExerciseLog {
  exerciseId: number;
  completed: boolean;
  completedSets: number;
  duration?: number; // For duration-based exercises
}

export interface HomeWorkoutLog {
  id: string;
  date: string;
  dayId: number;
  exerciseLogs: HomeExerciseLog[];
  duration: number;
  completed: boolean;
  difficultyMode: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface HomeUserProgress {
  totalWorkouts: number;
  streak: number;
  lastWorkoutDate: string | null;
  completedDays: number[];
  workoutLogs: HomeWorkoutLog[];
  difficultyMode: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface DifficultyConfig {
  repsMultiplier: number;
  setsMultiplier: number;
  restModifier: number; // -1 = shorter rest, 0 = normal, 1 = longer rest
  additionalExercises: boolean;
}
