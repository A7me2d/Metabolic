import { Injectable, signal, computed } from '@angular/core';

export type Language = 'en' | 'ar';

export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const TRANSLATIONS: Translations = {
  // App Name
  'app.name': {
    en: 'Hypertrophy Pro',
    ar: 'بروتيروفاي برو'
  },
  'app.subtitle': {
    en: '6-Day Push/Pull/Legs Split for Maximum Gains',
    ar: 'تقسيم 6 أيام دفع/سحب/أرجل لأقصى نتائج'
  },

  // Navigation
  'nav.dashboard': {
    en: 'Dashboard',
    ar: 'لوحة التحكم'
  },
  'nav.analytics': {
    en: 'Analytics',
    ar: 'التحليلات'
  },
  'nav.settings': {
    en: 'Settings',
    ar: 'الإعدادات'
  },
  'nav.bodyTracking': {
    en: 'Body Tracking',
    ar: 'تتبع الجسم'
  },

  // Dashboard
  'dashboard.streak': {
    en: 'Day Streak',
    ar: 'أيام متتالية'
  },
  'dashboard.workouts': {
    en: 'Workouts',
    ar: 'التمارين'
  },
  'dashboard.kgLifted': {
    en: 'kg Lifted',
    ar: 'كجم مرفوعة'
  },
  'dashboard.personalRecords': {
    en: 'Personal Records',
    ar: 'الأرقام القياسية'
  },
  'dashboard.weekProgress': {
    en: 'Week',
    ar: 'الأسبوع'
  },
  'dashboard.progress': {
    en: 'Progress',
    ar: 'التقدم'
  },
  'dashboard.workoutsCount': {
    en: 'workouts',
    ar: 'تمارين'
  },
  'dashboard.weeklySplit': {
    en: 'Weekly Split',
    ar: 'التقسيم الأسبوعي'
  },
  'dashboard.gymProgram': {
    en: 'Gym Program',
    ar: 'برنامج الجيم'
  },
  'dashboard.gymProgramDesc': {
    en: '6-day push/pull/legs split',
    ar: 'تقسيم 6 أيام دفع/سحب/أرجل'
  },
  'dashboard.homeProgram': {
    en: 'Home Bodyweight',
    ar: 'تمارين منزلية'
  },
  'dashboard.homeProgramDesc': {
    en: '5-day no equipment program',
    ar: 'برنامج 5 أيام بدون معدات'
  },
  'dashboard.withEquipment': {
    en: 'With Equipment',
    ar: 'بمعدات'
  },
  'dashboard.noEquipment': {
    en: 'No Equipment',
    ar: 'بدون معدات'
  },
  'dashboard.active': {
    en: 'Active',
    ar: 'نشط'
  },

  // Home Workout
  'homeWorkout.title': {
    en: 'Home Workout',
    ar: 'تمارين منزلية'
  },
  'homeWorkout.subtitle': {
    en: '5-Day Bodyweight Program',
    ar: 'برنامج 5 أيام بوزن الجسم'
  },
  'homeWorkout.difficulty': {
    en: 'Difficulty Mode',
    ar: 'مستوى الصعوبة'
  },
  'homeWorkout.beginner': {
    en: 'Beginner',
    ar: 'مبتدئ'
  },
  'homeWorkout.beginnerDesc': {
    en: 'Easier',
    ar: 'أسهل'
  },
  'homeWorkout.intermediate': {
    en: 'Intermediate',
    ar: 'متوسط'
  },
  'homeWorkout.intermediateDesc': {
    en: 'Standard',
    ar: 'قياسي'
  },
  'homeWorkout.advanced': {
    en: 'Advanced',
    ar: 'متقدم'
  },
  'homeWorkout.advancedDesc': {
    en: 'Harder',
    ar: 'أصعب'
  },
  'homeWorkout.daysCompleted': {
    en: 'Days Completed',
    ar: 'الأيام المكتملة'
  },
  'homeWorkout.weeklyProgram': {
    en: 'Weekly Program',
    ar: 'البرنامج الأسبوعي'
  },
  'homeWorkout.workoutProgress': {
    en: 'Workout Progress',
    ar: 'تقدم التمرين'
  },
  'homeWorkout.timer': {
    en: 'Timer',
    ar: 'المؤقت'
  },
  'homeWorkout.start': {
    en: 'Start',
    ar: 'ابدأ'
  },
  'homeWorkout.pause': {
    en: 'Pause',
    ar: 'إيقاف'
  },
  'homeWorkout.duration': {
    en: 'Duration',
    ar: 'المدة'
  },
  'homeWorkout.backToHome': {
    en: 'Back to Home Workout',
    ar: 'العودة للتمارين المنزلية'
  },

  // Day Card extensions
  'dayCard.today': {
    en: 'Today',
    ar: 'اليوم'
  },
  'dayCard.days': {
    en: 'days',
    ar: 'أيام'
  },
  'dayCard.exercises': {
    en: 'exercises',
    ar: 'تمارين'
  },
  'dayCard.startWorkout': {
    en: 'Start Workout',
    ar: 'ابدأ التمرين'
  },
  'dayCard.redoWorkout': {
    en: 'Redo Workout',
    ar: 'أعد التمرين'
  },
  'dayCard.restDay': {
    en: 'Rest & Recovery Day',
    ar: 'يوم الراحة والتعافي'
  },
  'dayCard.restMessage': {
    en: 'Let your muscles grow stronger',
    ar: 'دع عضلاتك تنمو أقوى'
  },

  // Workout Day
  'workoutDay.progress': {
    en: 'Progress',
    ar: 'التقدم'
  },
  'workoutDay.completed': {
    en: 'Completed',
    ar: 'مكتمل'
  },
  'workoutDay.totalExercises': {
    en: 'Total Exercises',
    ar: 'إجمالي التمارين'
  },
  'workoutDay.currentVolume': {
    en: 'Current Volume',
    ar: 'الحجم الحالي'
  },
  'workoutDay.kg': {
    en: 'kg',
    ar: 'كجم'
  },
  'workoutDay.startWorkout': {
    en: 'Start Workout',
    ar: 'ابدأ التمرين'
  },
  'workoutDay.completeWorkout': {
    en: 'Complete Workout',
    ar: 'أكمل التمرين'
  },
  'workoutDay.cancelWorkout': {
    en: 'Cancel Workout',
    ar: 'إلغاء التمرين'
  },
  'workoutDay.finishWorkout': {
    en: 'Finish Workout',
    ar: 'إنهاء التمرين'
  },
  'workoutDay.exercises': {
    en: 'Exercises',
    ar: 'التمارين'
  },
  'workoutDay.restDay': {
    en: 'Rest Day',
    ar: 'يوم الراحة'
  },
  'workoutDay.recoveryTips': {
    en: 'Recovery Tips',
    ar: 'نصائح التعافي'
  },
  'workoutDay.tip1': {
    en: 'Get 7-9 hours of quality sleep',
    ar: 'احصل على 7-9 ساعات نوم جيد'
  },
  'workoutDay.tip2': {
    en: 'Stay hydrated throughout the day',
    ar: 'حافظ على ترطيب جسمك طوال اليوم'
  },
  'workoutDay.tip3': {
    en: 'Consume adequate protein for muscle repair',
    ar: 'تناول كمية كافية من البروتين لإصلاح العضلات'
  },
  'workoutDay.tip4': {
    en: 'Light stretching or yoga can help recovery',
    ar: 'التمارين الخفيفة أو اليوغا تساعد في التعافي'
  },
  'workoutDay.sleep': {
    en: 'Sleep',
    ar: 'النوم'
  },
  'workoutDay.sleepTip': {
    en: 'Get 7-9 hours of quality sleep',
    ar: 'احصل على 7-9 ساعات نوم جيد'
  },
  'workoutDay.hydrate': {
    en: 'Hydrate',
    ar: 'الترطيب'
  },
  'workoutDay.hydrateTip': {
    en: 'Drink plenty of water',
    ar: 'اشرب الكثير من الماء'
  },
  'workoutDay.stretch': {
    en: 'Stretch',
    ar: 'التمدد'
  },
  'workoutDay.stretchTip': {
    en: 'Light stretching or yoga',
    ar: 'تمدد خفيف أو يوغا'
  },
  'workoutDay.nutrition': {
    en: 'Nutrition',
    ar: 'التغذية'
  },
  'workoutDay.nutritionTip': {
    en: 'Eat protein-rich foods',
    ar: 'تناول أطعمة غنية بالبروتين'
  },
  'workoutDay.startWorkoutBtn': {
    en: 'Start Workout',
    ar: 'ابدأ التمرين'
  },
  'workoutDay.completeWorkoutBtn': {
    en: 'Complete Workout',
    ar: 'أكمل التمرين'
  },
  'workoutDay.cancelBtn': {
    en: 'Cancel',
    ar: 'إلغاء'
  },
  'workoutDay.totalVolume': {
    en: 'Total Volume',
    ar: 'الحجم الإجمالي'
  },
  'workoutDay.completedExercises': {
    en: 'Completed',
    ar: 'مكتمل'
  },
  'workoutDay.rest': {
    en: 'Rest',
    ar: 'راحة'
  },
  'workoutDay.getReady': {
    en: 'Get Ready!',
    ar: 'استعد!'
  },
  'workoutDay.count': {
    en: 'Count',
    ar: 'العد'
  },
  'workoutDay.stop': {
    en: 'Stop',
    ar: 'توقف'
  },
  'workoutDay.startCounting': {
    en: 'Start Counting',
    ar: 'ابدأ العد'
  },

  'workoutDay.notFoundTitle': {
    en: 'Workout Not Found',
    ar: 'التمرين غير موجود'
  },
  'workoutDay.notFoundDesc': {
    en: "The requested workout day doesn't exist.",
    ar: 'يوم التمرين المطلوب غير موجود.'
  },
  'workoutDay.backToDashboard': {
    en: 'Back to Dashboard',
    ar: 'العودة للوحة التحكم'
  },

  // Exercise Card
  'exerciseCard.sets': {
    en: 'Sets',
    ar: 'المجموعات'
  },
  'exerciseCard.reps': {
    en: 'Reps',
    ar: 'التكرارات'
  },
  'exerciseCard.rest': {
    en: 'Rest',
    ar: 'الراحة'
  },
  'exerciseCard.weightPerSet': {
    en: 'Weight per set (kg)',
    ar: 'الوزن لكل مجموعة (كجم)'
  },
  'exerciseCard.set': {
    en: 'Set',
    ar: 'مجموعة'
  },
  'exerciseCard.markCompleted': {
    en: 'Mark as completed',
    ar: 'وضع علامة مكتمل'
  },
  'exerciseCard.details': {
    en: 'Details',
    ar: 'التفاصيل'
  },
  'exerciseCard.complete': {
    en: 'Complete',
    ar: 'إكمال'
  },
  'exerciseCard.done': {
    en: 'Done',
    ar: 'تم'
  },
  'exerciseCard.completed': {
    en: 'Completed',
    ar: 'مكتمل'
  },
  'exerciseCard.markComplete': {
    en: 'Mark Complete',
    ar: 'وضع علامة مكتمل'
  },

  // Exercise Details
  'exerciseDetails.back': {
    en: 'Back',
    ar: 'رجوع'
  },
  'exerciseDetails.description': {
    en: 'Description',
    ar: 'الوصف'
  },
  'exerciseDetails.instructions': {
    en: 'Step-by-Step Instructions',
    ar: 'التعليمات خطوة بخطوة'
  },
  'exerciseDetails.commonMistakes': {
    en: 'Common Mistakes',
    ar: 'الأخطاء الشائعة'
  },
  'exerciseDetails.safetyTips': {
    en: 'Safety Tips',
    ar: 'نصائح السلامة'
  },
  'exerciseDetails.targetMuscles': {
    en: 'Target Muscles',
    ar: 'العضلات المستهدفة'
  },
  'exerciseDetails.primary': {
    en: 'Primary',
    ar: 'رئيسي'
  },
  'exerciseDetails.alternatives': {
    en: 'Alternative Exercises',
    ar: 'التمارين البديلة'
  },
  'exerciseDetails.notFound': {
    en: 'Exercise Not Found',
    ar: 'التمرين غير موجود'
  },
  'exerciseDetails.notFoundMessage': {
    en: "The requested exercise doesn't exist or has been removed.",
    ar: 'التمرين المطلوب غير موجود أو تمت إزالته.'
  },
  'exerciseDetails.backToDashboard': {
    en: 'Back to Dashboard',
    ar: 'العودة للوحة التحكم'
  },
  'exerciseDetails.secondary': {
    en: 'Secondary',
    ar: 'ثانوي'
  },
  'exerciseDetails.rest': {
    en: 'Rest',
    ar: 'الراحة'
  },

  // Analytics
  'analytics.title': {
    en: 'Analytics',
    ar: 'التحليلات'
  },
  'analytics.subtitle': {
    en: 'Track your progress and performance',
    ar: 'تتبع تقدمك وأدائك'
  },
  'analytics.kgLifted': {
    en: 'kg Lifted',
    ar: 'كجم مرفوعة'
  },
  'analytics.totalSets': {
    en: 'Total Sets',
    ar: 'إجمالي المجموعات'
  },
  'analytics.totalWorkouts': {
    en: 'Total Workouts',
    ar: 'إجمالي التمارين'
  },
  'analytics.totalVolume': {
    en: 'Total Volume',
    ar: 'الحجم الإجمالي'
  },
  'analytics.avgWorkoutTime': {
    en: 'Avg Workout Time',
    ar: 'متوسط وقت التمرين'
  },
  'analytics.bestStreak': {
    en: 'Best Streak',
    ar: 'أفضل سلسلة'
  },
  'analytics.weeklyVolume': {
    en: 'Weekly Volume',
    ar: 'الحجم الأسبوعي'
  },
  'analytics.personalRecords': {
    en: 'Personal Records',
    ar: 'الأرقام القياسية'
  },
  'analytics.recentWorkouts': {
    en: 'Recent Workouts',
    ar: 'التمارين الأخيرة'
  },
  'analytics.noRecords': {
    en: 'No personal records yet. Keep pushing!',
    ar: 'لا توجد أرقام قياسية بعد. استمر في الضغط!'
  },
  'analytics.noWorkouts': {
    en: 'No workouts recorded yet. Start your journey!',
    ar: 'لم يتم تسجيل تمارين بعد. ابدأ رحلتك!'
  },
  'analytics.days': {
    en: 'days',
    ar: 'أيام'
  },
  'analytics.dayStreak': {
    en: 'Day Streak',
    ar: 'أيام متتالية'
  },
  'analytics.maxWeight': {
    en: 'Max Weight',
    ar: 'أقصى وزن'
  },
  'analytics.completeWorkoutsPR': {
    en: 'Complete workouts to set personal records!',
    ar: 'أكمل التمارين لتسجيل أرقام قياسية!'
  },
  'analytics.exercises': {
    en: 'exercises',
    ar: 'تمارين'
  },
  'analytics.noWorkoutHistory': {
    en: 'No workout history yet. Start your first workout!',
    ar: 'لا يوجد سجل تمارين بعد. ابدأ تمرينك الأول!'
  },
  'analytics.minutes': {
    en: 'min',
    ar: 'دقيقة'
  },

  // Settings
  'settings.title': {
    en: 'Settings',
    ar: 'الإعدادات'
  },
  'settings.preferences': {
    en: 'Preferences',
    ar: 'التفضيلات'
  },
  'settings.darkMode': {
    en: 'Dark Mode',
    ar: 'الوضع الداكن'
  },
  'settings.darkModeDesc': {
    en: 'Enable dark theme for better visibility',
    ar: 'تفعيل السمة الداكنة لرؤية أفضل'
  },
  'settings.language': {
    en: 'Language',
    ar: 'اللغة'
  },
  'settings.languageDesc': {
    en: 'Choose your preferred language',
    ar: 'اختر لغتك المفضلة'
  },
  'settings.weightUnit': {
    en: 'Weight Unit',
    ar: 'وحدة الوزن'
  },
  'settings.kilograms': {
    en: 'Kilograms (kg)',
    ar: 'كيلوغرام (كجم)'
  },
  'settings.pounds': {
    en: 'Pounds (lbs)',
    ar: 'رطل (lbs)'
  },
  'settings.tools': {
    en: 'Tools',
    ar: 'الأدوات'
  },
  'settings.bmiCalculator': {
    en: 'BMI Calculator',
    ar: 'حاسبة مؤشر كتلة الجسم'
  },
  'settings.bmiDesc': {
    en: 'Calculate your Body Mass Index',
    ar: 'احسب مؤشر كتلة جسمك'
  },
  'settings.calorieCalculator': {
    en: 'Calorie Calculator',
    ar: 'حاسبة السعرات'
  },
  'settings.calorieDesc': {
    en: 'Estimate your daily calorie needs',
    ar: 'قدر احتياجاتك اليومية من السعرات'
  },
  'settings.data': {
    en: 'Data',
    ar: 'البيانات'
  },
  'settings.exportData': {
    en: 'Export Data',
    ar: 'تصدير البيانات'
  },
  'settings.exportDesc': {
    en: 'Download your workout history',
    ar: 'حمّل سجل تمارينك'
  },
  'settings.resetData': {
    en: 'Reset All Data',
    ar: 'إعادة تعيين البيانات'
  },
  'settings.resetDesc': {
    en: 'Clear all workout history and settings',
    ar: 'مسح كل سجل التمارين والإعدادات'
  },
  'settings.about': {
    en: 'About',
    ar: 'حول'
  },
  'settings.version': {
    en: 'Version',
    ar: 'الإصدار'
  },
  'settings.developer': {
    en: 'Developer',
    ar: 'المطور'
  },
  'settings.feedback': {
    en: 'Send Feedback',
    ar: 'أرسل ملاحظات'
  },
  'settings.rateApp': {
    en: 'Rate this App',
    ar: 'قيم هذا التطبيق'
  },

  // Timer
  'timer.restTimer': {
    en: 'Rest Timer',
    ar: 'مؤقت الراحة'
  },
  'timer.start': {
    en: 'Start',
    ar: 'ابدأ'
  },
  'timer.pause': {
    en: 'Pause',
    ar: 'إيقاف مؤقت'
  },
  'timer.resume': {
    en: 'Resume',
    ar: 'استمرار'
  },
  'timer.stop': {
    en: 'Stop',
    ar: 'توقف'
  },

  // Difficulty levels
  'difficulty.beginner': {
    en: 'Beginner',
    ar: 'مبتدئ'
  },
  'difficulty.intermediate': {
    en: 'Intermediate',
    ar: 'متوسط'
  },
  'difficulty.advanced': {
    en: 'Advanced',
    ar: 'متقدم'
  },

  // Equipment
  'equipment.barbell': {
    en: 'Barbell',
    ar: 'بار'
  },
  'equipment.dumbbell': {
    en: 'Dumbbell',
    ar: 'دمبل'
  },
  'equipment.machine': {
    en: 'Machine',
    ar: 'جهاز'
  },
  'equipment.cable': {
    en: 'Cable',
    ar: 'كابل'
  },
  'equipment.bodyweight': {
    en: 'Bodyweight',
    ar: 'وزن الجسم'
  },

  // Common
  'common.back': {
    en: 'Back',
    ar: 'رجوع'
  },
  'common.save': {
    en: 'Save',
    ar: 'حفظ'
  },
  'common.cancel': {
    en: 'Cancel',
    ar: 'إلغاء'
  },
  'common.confirm': {
    en: 'Confirm',
    ar: 'تأكيد'
  },
  'common.close': {
    en: 'Close',
    ar: 'إغلاق'
  },
  'common.loading': {
    en: 'Loading...',
    ar: 'جاري التحميل...'
  },

  // Body Tracking
  'bodyTracking.title': {
    en: 'Body Tracking',
    ar: 'تتبع الجسم'
  },
  'bodyTracking.subtitle': {
    en: 'Track your weight and body metrics',
    ar: 'تتبع وزنك ومقاييس جسمك'
  },
  'bodyTracking.logMetrics': {
    en: 'Log Body Metrics',
    ar: 'تسجيل المقاييس'
  },
  'bodyTracking.logMetricsDesc': {
    en: 'Record your weight and height',
    ar: 'سجل وزنك وطولك'
  },
  'bodyTracking.weight': {
    en: 'Weight',
    ar: 'الوزن'
  },
  'bodyTracking.height': {
    en: 'Height',
    ar: 'الطول'
  },
  'bodyTracking.bmi': {
    en: 'BMI',
    ar: 'مؤشر كتلة الجسم'
  },
  'bodyTracking.date': {
    en: 'Date',
    ar: 'التاريخ'
  },
  'bodyTracking.weightPlaceholder': {
    en: 'Enter weight',
    ar: 'أدخل الوزن'
  },
  'bodyTracking.heightPlaceholder': {
    en: 'Enter height',
    ar: 'أدخل الطول'
  },
  'bodyTracking.bmiPreview': {
    en: 'Calculated BMI',
    ar: 'مؤشر كتلة الجسم المحسوب'
  },
  'bodyTracking.saveMetrics': {
    en: 'Save Metrics',
    ar: 'حفظ المقاييس'
  },
  'bodyTracking.saveSuccess': {
    en: 'Metrics saved successfully!',
    ar: 'تم حفظ المقاييس بنجاح!'
  },
  'bodyTracking.saveError': {
    en: 'Failed to save metrics',
    ar: 'فشل حفظ المقاييس'
  },
  'bodyTracking.weightError': {
    en: 'Please enter a valid weight (30-300 kg)',
    ar: 'الرجاء إدخال وزن صحيح (30-300 كجم)'
  },
  'bodyTracking.heightError': {
    en: 'Please enter a valid height (100-250 cm)',
    ar: 'الرجاء إدخال طول صحيح (100-250 سم)'
  },
  'bodyTracking.underweight': {
    en: 'Underweight',
    ar: 'نقص الوزن'
  },
  'bodyTracking.normal': {
    en: 'Normal',
    ar: 'طبيعي'
  },
  'bodyTracking.overweight': {
    en: 'Overweight',
    ar: 'زيادة وزن'
  },
  'bodyTracking.obese': {
    en: 'Obese',
    ar: 'سمنة'
  },
  'bodyTracking.weightProgress': {
    en: 'Weight Progress',
    ar: 'تقدم الوزن'
  },
  'bodyTracking.days': {
    en: 'days',
    ar: 'أيام'
  },
  'bodyTracking.highest': {
    en: 'Highest',
    ar: 'الأعلى'
  },
  'bodyTracking.lowest': {
    en: 'Lowest',
    ar: 'الأدنى'
  },
  'bodyTracking.average': {
    en: 'Average',
    ar: 'المتوسط'
  },
  'bodyTracking.noData': {
    en: 'No data available',
    ar: 'لا توجد بيانات'
  },
  'bodyTracking.logFirst': {
    en: 'Log your first metrics to see progress',
    ar: 'سجل مقاييسك الأولى لرؤية التقدم'
  },
  'bodyTracking.weeklyReport': {
    en: 'Weekly Progress Report',
    ar: 'تقرير التقدم الأسبوعي'
  },
  'bodyTracking.currentWeight': {
    en: 'Current Weight',
    ar: 'الوزن الحالي'
  },
  'bodyTracking.weightChange': {
    en: 'Weight Change',
    ar: 'تغير الوزن'
  },
  'bodyTracking.avgBMI': {
    en: 'Avg BMI',
    ar: 'متوسط المؤشر'
  },
  'bodyTracking.workouts': {
    en: 'Workouts',
    ar: 'التمارين'
  },
  'bodyTracking.goalProgress': {
    en: 'Goal Progress',
    ar: 'تقدم الهدف'
  },
  'bodyTracking.target': {
    en: 'Target',
    ar: 'الهدف'
  },
  'bodyTracking.complete': {
    en: 'complete',
    ar: 'مكتمل'
  },
  'bodyTracking.daysRemaining': {
    en: 'days remaining',
    ar: 'أيام متبقية'
  },
  'bodyTracking.bmiCategory': {
    en: 'BMI Category',
    ar: 'تصنيف المؤشر'
  },
  'bodyTracking.noReportData': {
    en: 'No report data available',
    ar: 'لا توجد بيانات للتقرير'
  },
  'bodyTracking.logMetricsFirst': {
    en: 'Log your metrics to see your weekly report',
    ar: 'سجل مقاييسك لرؤية تقريرك الأسبوعي'
  },
  'bodyTracking.latestStats': {
    en: 'Latest Stats',
    ar: 'آخر الإحصائيات'
  },
  'bodyTracking.lastLogged': {
    en: 'Last logged',
    ar: 'آخر تسجيل'
  },
  'bodyTracking.setGoal': {
    en: 'Set Goal',
    ar: 'تحديد الهدف'
  },
  'bodyTracking.targetWeight': {
    en: 'Target Weight',
    ar: 'الوزن المستهدف'
  },
  'bodyTracking.clearGoal': {
    en: 'Clear Goal',
    ar: 'إلغاء الهدف'
  },
  'bodyTracking.enterTarget': {
    en: 'Enter target weight',
    ar: 'أدخل الوزن المستهدف'
  },
  'bodyTracking.saveGoal': {
    en: 'Save Goal',
    ar: 'حفظ الهدف'
  },
  'bodyTracking.history': {
    en: 'History',
    ar: 'السجل'
  },
  'bodyTracking.entries': {
    en: 'entries',
    ar: 'إدخالات'
  },
  'bodyTracking.actions': {
    en: 'Actions',
    ar: 'إجراءات'
  },
  'bodyTracking.confirmDelete': {
    en: 'Are you sure you want to delete this entry?',
    ar: 'هل أنت متأكد من حذف هذا الإدخال؟'
  },
  'bodyTracking.showAll': {
    en: 'Show All',
    ar: 'عرض الكل'
  },
  'bodyTracking.showLess': {
    en: 'Show Less',
    ar: 'عرض أقل'
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = signal<Language>('en');
  
  // Computed signal for reactive translations
  isArabic = computed(() => this.currentLanguage() === 'ar');
  isRTL = computed(() => this.currentLanguage() === 'ar');
  
  direction = computed(() => this.isRTL() ? 'rtl' : 'ltr');
  
  language = this.currentLanguage.asReadonly();

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    // Update document direction for RTL support
    document.documentElement.dir = this.isRTL() ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    // Store preference
    localStorage.setItem('language', lang);
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage() === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }

  // Initialize language from storage
  initLanguage(): void {
    const savedLang = localStorage.getItem('language') as Language | null;
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      this.setLanguage(savedLang);
    }
  }

  // Get translation for a key
  t(key: string): string {
    const translation = TRANSLATIONS[key];
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`);
      return key;
    }
    return translation[this.currentLanguage()];
  }

  // Get translation with interpolation
  tInterpolate(key: string, params: { [key: string]: string | number }): string {
    let text = this.t(key);
    Object.keys(params).forEach(param => {
      text = text.replace(`{{${param}}}`, String(params[param]));
    });
    return text;
  }
}
