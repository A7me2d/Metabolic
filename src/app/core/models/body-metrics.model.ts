export interface BodyMetrics {
  id: string;
  userId: string;
  weight: number; // in kg
  height: number; // in cm
  bmi: number;
  date: string; // ISO date string
  createdAt: string; // ISO datetime string
}

export interface BodyMetricsInput {
  weight: number;
  height: number;
  date?: string;
}

export interface WeeklyProgressReport {
  currentWeight: number;
  weightChange: number;
  averageBMI: number;
  workoutsCompleted: number;
  startDate: string;
  endDate: string;
  goalWeight?: number;
  progressToGoal?: number; // percentage
  estimatedDaysToGoal?: number;
}

export interface BodyMetricsGoal {
  targetWeight: number;
  startDate: string;
  targetDate?: string;
}

export interface BMICategory {
  min: number;
  max: number;
  label: string;
  labelAr: string;
  color: string;
}

export const BMI_CATEGORIES: BMICategory[] = [
  { min: 0, max: 18.5, label: 'Underweight', labelAr: 'نقص الوزن', color: 'blue' },
  { min: 18.5, max: 25, label: 'Normal', labelAr: 'طبيعي', color: 'green' },
  { min: 25, max: 30, label: 'Overweight', labelAr: 'زيادة الوزن', color: 'yellow' },
  { min: 30, max: 35, label: 'Obese Class I', labelAr: 'سمنة درجة أولى', color: 'orange' },
  { min: 35, max: 40, label: 'Obese Class II', labelAr: 'سمنة درجة ثانية', color: 'red' },
  { min: 40, max: 100, label: 'Obese Class III', labelAr: 'سمنة درجة ثالثة', color: 'red' }
];

export function calculateBMI(weight: number, heightInCm: number): number {
  const heightInMeters = heightInCm / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

export function getBMICategory(bmi: number): BMICategory {
  return BMI_CATEGORIES.find(cat => bmi >= cat.min && bmi < cat.max) || BMI_CATEGORIES[1];
}

export function calculateProgressToGoal(currentWeight: number, startWeight: number, targetWeight: number): number {
  if (targetWeight === startWeight) return 100;
  const totalChange = targetWeight - startWeight;
  const currentChange = currentWeight - startWeight;
  const progress = (currentChange / totalChange) * 100;
  return Math.min(100, Math.max(0, Math.round(progress)));
}

export function estimateDaysToGoal(currentWeight: number, targetWeight: number, weeklyChangeRate: number): number | null {
  if (weeklyChangeRate === 0) return null;
  const weightDiff = Math.abs(currentWeight - targetWeight);
  const weeklyRate = Math.abs(weeklyChangeRate);
  const weeksNeeded = weightDiff / weeklyRate;
  return Math.ceil(weeksNeeded * 7);
}
