import { HomeExercise, HomeWorkoutDay, DifficultyConfig } from '../models/home-workout.model';

const createHomeExercise = (
  id: number,
  name: string,
  nameAr: string,
  sets: number,
  reps: string,
  rest: string,
  primaryMuscle: string,
  primaryMuscleAr: string,
  secondaryMuscle: string[],
  secondaryMuscleAr: string[],
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
  description: string,
  descriptionAr: string,
  instructions: string[],
  instructionsAr: string[],
  commonMistakes: string[],
  commonMistakesAr: string[],
  safetyTips: string[],
  safetyTipsAr: string[],
  alternatives: string[],
  alternativesAr: string[],
  isDurationBased: boolean = false,
  duration?: number,
  imageUrl?: string
): HomeExercise => ({
  id,
  name,
  nameAr,
  sets,
  reps,
  rest,
  primaryMuscle,
  primaryMuscleAr,
  secondaryMuscle,
  secondaryMuscleAr,
  difficulty,
  equipment: 'Bodyweight',
  equipmentAr: 'وزن الجسم',
  imageUrl: imageUrl || `https://images.unsplash.com/photo-1571019614242-c5c8d8d8d8d8?w=400&h=300&fit=crop&query=${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`,
  description,
  descriptionAr,
  instructions,
  instructionsAr,
  commonMistakes,
  commonMistakesAr,
  safetyTips,
  safetyTipsAr,
  alternatives,
  alternativesAr,
  isDurationBased,
  duration
});

// Difficulty configurations
export const DIFFICULTY_CONFIGS: Record<string, DifficultyConfig> = {
  Beginner: {
    repsMultiplier: 0.7,
    setsMultiplier: 0.75,
    restModifier: 1, // Longer rest
    additionalExercises: false
  },
  Intermediate: {
    repsMultiplier: 1,
    setsMultiplier: 1,
    restModifier: 0,
    additionalExercises: false
  },
  Advanced: {
    repsMultiplier: 1.3,
    setsMultiplier: 1.25,
    restModifier: -1, // Shorter rest
    additionalExercises: true
  }
};

export const HOME_WORKOUT_DAYS: HomeWorkoutDay[] = [
  // Day 1 - Chest + Core
  {
    id: 1,
    name: 'Day 1',
    nameAr: 'اليوم 1',
    focus: 'Chest + Core',
    focusAr: 'صدر + عضلات البطن',
    isRestDay: false,
    exercises: [
      createHomeExercise(
        101,
        'Push Ups',
        'ضغط الصدر',
        4,
        '15',
        '60 sec',
        'Chest',
        'صدر',
        ['Triceps', 'Shoulders'],
        ['ترايسيبس', 'أكتاف'],
        'Beginner',
        'Push ups are a fundamental bodyweight exercise that targets the chest, shoulders, and triceps. They build upper body pushing strength and core stability.',
        'ضغط الصدر تمرين أساسي بوزن الجسم يستهدف الصدر والكتفين والترايسيبس. يبني قوة الدفع للجزء العلوي واستقرار الجذع.',
        [
          'Start in a plank position with hands slightly wider than shoulder-width',
          'Lower your body until your chest nearly touches the floor',
          'Keep your core tight and body in a straight line',
          'Push back up to the starting position',
          'Breathe in as you lower, breathe out as you push up'
        ],
        [
          'ابدأ في وضع البلانك مع وضع اليدين أوسع قليلاً من عرض الكتفين',
          'أنزل جسمك حتى يقترب صدرك من الأرض',
          'حافظ على شد عضلات البطن وجسمك في خط مستقيم',
          'ادفع لأعلى إلى وضع البداية',
          'تنفس عند النزول، زفير عند الصعود'
        ],
        [
          'Letting hips sag or pike up',
          'Flaring elbows out to 90 degrees',
          'Not going through full range of motion',
          'Holding breath during the movement'
        ],
        [
          'ترهل الوركين أو رفعها لأعلى',
          'فتح المرفقين بزاوية 90 درجة',
          'عدم إكمال المدى الكامل للحركة',
          'حبس النفس أثناء الحركة'
        ],
        [
          'Keep your core engaged throughout',
          'Start with knee push ups if needed',
          'Keep your neck neutral',
          'Warm up your wrists before starting'
        ],
        [
          'حافظ على شد عضلات البطن طوال التمرين',
          'ابدأ بضغط الركبتين إذا لزم الأمر',
          'حافظ على رقبتك في وضع محايد',
          'سخن معصميك قبل البدء'
        ],
        ['Incline Push Ups', 'Diamond Push Ups', 'Wide Push Ups'],
        ['ضغط مائل', 'ضغط الماس', 'ضغط واسع'],
        false,
        undefined,
        '/assets/home/day1/Push Ups.png'
      ),
      createHomeExercise(
        102,
        'Wide Push Ups',
        'ضغط واسع',
        3,
        '12',
        '60 sec',
        'Chest',
        'صدر',
        ['Shoulders', 'Triceps'],
        ['أكتاف', 'ترايسيبس'],
        'Intermediate',
        'Wide push ups emphasize the chest muscles more than standard push ups by increasing the stretch and reducing triceps involvement.',
        'الضغط الواسع يركز أكثر على عضلات الصدر من الضغط العادي عن طريق زيادة المد وتقليل مشاركة الترايسيبس.',
        [
          'Place hands wider than shoulder-width, about 1.5x width',
          'Lower your body with control',
          'Keep elbows at about 45 degrees from your body',
          'Push back up explosively',
          'Focus on squeezing your chest at the top'
        ],
        [
          'ضع يديك أوسع من عرض الكتفين بحوالي 1.5 ضعف',
          'أنزل جسمك بتحكم',
          'حافظ على المرفقين بزاوية 45 درجة من جسمك',
          'ادفع لأعلى بقوة',
          'ركز على ضغط صدرك في الأعلى'
        ],
        [
          'Hands too wide causing shoulder strain',
          'Not maintaining proper form',
          'Elbows flaring out too much'
        ],
        [
          'اليدين واسعتان جداً مما يسبب إجهاد الكتف',
          'عدم الحفاظ على الوضع الصحيح',
          'المرفقين مفتوحان أكثر من اللازم'
        ],
        [
          'Start with a moderate width and adjust',
          'Stop if you feel shoulder pain',
          'Keep your core tight'
        ],
        [
          'ابدأ بعرض معتدل وعدّل حسب الحاجة',
          'توقف إذا شعرت بألم في الكتف',
          'حافظ على شد عضلات البطن'
        ],
        ['Standard Push Ups', 'Incline Push Ups', 'Plyometric Push Ups'],
        ['ضغط عادي', 'ضغط مائل', 'ضغط القفز'],
        false,
        undefined,
        '/assets/home/day1/Wide Push Ups.png'
      ),
      createHomeExercise(
        103,
        'Decline Push Ups',
        'ضغط منحدر',
        3,
        '10',
        '60 sec',
        'Upper Chest',
        'أعلى الصدر',
        ['Shoulders', 'Triceps'],
        ['أكتاف', 'ترايسيبس'],
        'Intermediate',
        'Decline push ups target the upper chest by positioning your feet higher than your hands, shifting more weight to the upper pectorals.',
        'الضغط المنحدر يستهدف أعلى الصدر عن طريق رفع القدمين أعلى من اليدين، مما ينقل وزناً أكثر للعضلة الصدرية العلوية.',
        [
          'Place your feet on an elevated surface (bed, chair, step)',
          'Position hands shoulder-width apart on the floor',
          'Lower your body until chest nearly touches floor',
          'Push back up to starting position',
          'Maintain a straight line from head to heels'
        ],
        [
          'ضع قدميك على سطح مرتفع (سرير، كرسي، درجة)',
          'ضع يديك بعرض الكتفين على الأرض',
          'أنزل جسمك حتى يقترب صدرك من الأرض',
          'ادفع لأعلى إلى وضع البداية',
          'حافظ على خط مستقيم من الرأس للكعبين'
        ],
        [
          'Arching or rounding the back',
          'Feet too high causing instability',
          'Not controlling the descent'
        ],
        [
          'تقوس أو تقوس الظهر',
          'القدمين عاليتان جداً مما يسبب عدم استقرار',
          'عدم التحكم في النزول'
        ],
        [
          'Start with a low elevation and progress',
          'Keep your core engaged',
          'Use a stable surface for your feet'
        ],
        [
          'ابدأ بارتفاع منخفض وتقدم تدريجياً',
          'حافظ على شد عضلات البطن',
          'استخدم سطحاً مستقراً لقدميك'
        ],
        ['Standard Push Ups', 'Incline Push Ups', 'Pike Push Ups'],
        ['ضغط عادي', 'ضغط مائل', 'ضغط بايك'],
        false,
        undefined,
        '/assets/home/day1/Decline Push Ups.png'
      ),
      createHomeExercise(
        104,
        'Plank',
        'البلانك',
        3,
        '45 sec',
        '30 sec',
        'Core',
        'عضلات البطن',
        ['Shoulders', 'Lower Back'],
        ['أكتاف', 'أسفل الظهر'],
        'Beginner',
        'The plank is an isometric core exercise that builds endurance and stability in the entire core region.',
        'البلانك تمرين ثابت للجذع يبني التحمل والاستقرار في منطقة الجذع بأكملها.',
        [
          'Start in a push up position or on forearms',
          'Keep your body in a straight line from head to heels',
          'Engage your core by pulling your belly button toward your spine',
          'Hold the position for the prescribed time',
          'Breathe normally throughout the hold'
        ],
        [
          'ابدأ في وضع الضغط أو على الساعدين',
          'حافظ على جسمك في خط مستقيم من الرأس للكعبين',
          'اشد عضلات البطن بسحب السرة نحو العمود الفقري',
          'ثبت على الوضع للوقت المحدد',
          'تنفس بشكل طبيعي طوال التثبيت'
        ],
        [
          'Letting hips sag or pike up',
          'Holding your breath',
          'Looking up or dropping head'
        ],
        [
          'ترهل الوركين أو رفعها',
          'حبس النفس',
          'النظر لأعلى أو إسقاط الرأس'
        ],
        [
          'Start with shorter holds and build up',
          'Keep your neck neutral',
          'Squeeze your glutes to help maintain alignment'
        ],
        [
          'ابدأ بفترات أقصر وبناء تدريجي',
          'حافظ على رقبتك محايدة',
          'اضغط على الأرداف للمساعدة في الحفاظ على المحاذاة'
        ],
        ['Side Plank', 'High Plank', 'Plank Jacks'],
        ['بلانك جانبي', 'بلانك عالي', 'بلانك جاك'],
        true,
        45,
        '/assets/home/day1/Plank.png'
      ),
      createHomeExercise(
        105,
        'Mountain Climbers',
        'تسلق الجبال',
        3,
        '20 each',
        '45 sec',
        'Core',
        'عضلات البطن',
        ['Hip Flexors', 'Shoulders'],
        ['عضلات الفخذ', 'أكتاف'],
        'Intermediate',
        'Mountain climbers are a dynamic exercise that combines core training with cardio, targeting the abs while elevating your heart rate.',
        'تسلق الجبال تمرين ديناميكي يجمع بين تدريب الجذع والكارديو، يستهدف البطن مع رفع معدل ضربات القلب.',
        [
          'Start in a high plank position',
          'Drive one knee toward your chest',
          'Quickly switch legs in a running motion',
          'Keep your hips down and core engaged',
          'Move as fast as you can with good form'
        ],
        [
          'ابدأ في وضع البلانك العالي',
          'اسحب ركبة واحدة نحو صدرك',
          'بدّل الساقين بسرعة في حركة جري',
          'حافظ على الوركين منخفضين وعضلات البطن مشدودة',
          'تحرك بأسرع ما يمكنك مع الحفاظ على الوضع الصحيح'
        ],
        [
          'Bouncing on toes instead of driving knees',
          'Hips piking up too high',
          'Not bringing knees far enough forward'
        ],
        [
          'الارتداد على أطراف الأصابع بدلاً من سحب الركبتين',
          'رفع الوركين عالياً جداً',
          'عدم سحب الركبتين للأمام بما يكفي'
        ],
        [
          'Start slow and build speed',
          'Keep your back flat',
          'Breathe rhythmically with the movement'
        ],
        [
          'ابدأ ببطء وزد السرعة',
          'حافظ على ظهرك مسطحاً',
          'تنفس بإيقاع مع الحركة'
        ],
        ['Slow Mountain Climbers', 'Cross-Body Mountain Climbers', 'Plank Jacks'],
        ['تسلق جبال بطيء', 'تسلق جبال متقاطع', 'بلانك جاك'],
        false,
        undefined,
        '/assets/home/day1/Mountain Climbers.png'
      )
    ]
  },
  // Day 2 - Legs
  {
    id: 2,
    name: 'Day 2',
    nameAr: 'اليوم 2',
    focus: 'Legs',
    focusAr: 'أرجل',
    isRestDay: false,
    exercises: [
      createHomeExercise(
        201,
        'Bodyweight Squats',
        'سكوات بوزن الجسم',
        4,
        '20',
        '60 sec',
        'Quadriceps',
        'عضلات الفخذ الأمامية',
        ['Glutes', 'Hamstrings'],
        ['أرداف', 'عضلات الفخذ الخلفية'],
        'Beginner',
        'Bodyweight squats are a fundamental lower body exercise that builds strength in the quads, glutes, and hamstrings while improving mobility.',
        'السكوات بوزن الجسم تمرين أساسي للجزء السفلي يبني قوة في عضلات الفخذ الأمامية والأرداف والخلفية مع تحسين المرونة.',
        [
          'Stand with feet shoulder-width apart',
          'Lower your body by bending your knees and pushing hips back',
          'Keep your chest up and weight on your heels',
          'Descend until your thighs are parallel to the floor',
          'Push through your heels to stand back up'
        ],
        [
          'قف مع وضع القدمين بعرض الكتفين',
          'أنزل جسمك بثني الركبتين ودفع الوركين للخلف',
          'حافظ على صدرك مرتفعاً ووزنك على الكعبين',
          'انزل حتى يصبح فخذيك موازيين للأرض',
          'ادفع من خلال كعبيك للوقوف'
        ],
        [
          'Knees caving inward',
          'Lifting heels off the ground',
          'Leaning too far forward',
          'Not going deep enough'
        ],
        [
          'الركبتين تنحنيان للداخل',
          'رفع الكعبين عن الأرض',
          'الميل أكثر من اللازم للأمام',
          'عدم النزول بالعمق الكافي'
        ],
        [
          'Keep your knees tracking over your toes',
          'Maintain a neutral spine',
          'Start with shallow squats if needed',
          'Warm up your ankles and hips first'
        ],
        [
          'حافظ على الركبتين في اتجاه أصابع القدمين',
          'حافظ على عمود فقري محايد',
          'ابدأ بسكوات ضحلة إذا لزم الأمر',
          'سخن كاحليك ووركك أولاً'
        ],
        ['Jump Squats', 'Sumo Squats', 'Pistol Squat Progression'],
        ['سكوات القفز', 'سكوات سومو', 'تقدم سكوات المسدس'],
        false,
        undefined,
        '/assets/home/day2/Bodyweight Squats.png'
      ),
      createHomeExercise(
        202,
        'Jump Squats',
        'سكوات القفز',
        3,
        '12',
        '60 sec',
        'Quadriceps',
        'عضلات الفخذ الأمامية',
        ['Glutes', 'Calves'],
        ['أرداف', 'بطن الساق'],
        'Intermediate',
        'Jump squats add a plyometric element to the traditional squat, building explosive power and increasing heart rate.',
        'سكوات القفز يضيف عنصر القفز للسكوات التقليدي، يبني قوة متفجرة ويرفع معدل ضربات القلب.',
        [
          'Start in a squat position',
          'Explode upward jumping as high as you can',
          'Swing your arms for momentum',
          'Land softly with bent knees',
          'Immediately lower into the next squat'
        ],
        [
          'ابدأ في وضع السكوات',
          'انفجر للأعلى قافزاً بأعلى ما يمكنك',
          'أرجح ذراعيك للزخم',
          'الهبط بنعومة مع ثني الركبتين',
          'انزل فوراً للسكوات التالية'
        ],
        [
          'Landing with straight legs',
          'Not using arms for momentum',
          'Landing loudly instead of softly'
        ],
        [
          'الهبوط بأرجل مستقيمة',
          'عدم استخدام الذراعين للزخم',
          'الهبوط بصوت عالٍ بدلاً من النعومة'
        ],
        [
          'Land softly to protect your joints',
          'Start with bodyweight squats first',
          'Keep your core engaged throughout'
        ],
        [
          'الهبط بنعومة لحماية مفاصلك',
          'ابدأ بالسكوات العادي أولاً',
          'حافظ على شد عضلات البطن طوال الوقت'
        ],
        ['Bodyweight Squats', 'Pop Squats', 'Squat Pulses'],
        ['سكوات عادي', 'سكوات البوب', 'سكوات النبض'],
         false,
        undefined,
        '/assets/home/day2/Jump Squats.png'
      ),
      createHomeExercise(
        203,
        'Lunges',
        'طعنات',
        3,
        '12 each',
        '60 sec',
        'Quadriceps',
        'عضلات الفضع الأمامية',
        ['Glutes', 'Hamstrings'],
        ['أرداف', 'عضلات الفخذ الخلفية'],
        'Beginner',
        'Lunges are a unilateral exercise that builds leg strength while improving balance and coordination.',
        'الطعنات تمرين أحادي الجانب يبني قوة الأرجل مع تحسين التوازن والتنسيق.',
        [
          'Stand with feet hip-width apart',
          'Take a big step forward with one leg',
          'Lower your back knee toward the ground',
          'Keep your front knee at 90 degrees',
          'Push through your front heel to return to start'
        ],
        [
          'قف مع وضع القدمين بعرض الوركين',
          'اتخذ خطوة كبيرة للأمام بإحدى الساقين',
          'أنزل ركبتك الخلفية نحو الأرض',
          'حافظ على ركبتك الأمامية بزاوية 90 درجة',
          'ادفع من خلال كعبك الأمامي للعودة للبداية'
        ],
        [
          'Front knee extending past toes',
          'Leaning torso too far forward',
          'Not lowering back knee enough'
        ],
        [
          'الركبة الأمامية تتجاوز أصابع القدمين',
          'الجذع يميل أكثر من اللازم للأمام',
          'عدم إنزال الركبة الخلفية بما يكفي'
        ],
        [
          'Keep your torso upright',
          'Step wide enough for stability',
          'Focus on driving through your front heel'
        ],
        [
          'حافظ على جذعك منتصباً',
          'اتخذ خطوة واسعة بما يكفي للاستقرار',
          'ركز على الدفع من خلال كعبك الأمامي'
        ],
        ['Reverse Lunges', 'Walking Lunges', 'Jump Lunges'],
        ['طعنات خلفية', 'طعنات المشي', 'طعنات القفز'],
        false,
        undefined,
        '/assets/home/day2/Lunges.png'
      ),
      createHomeExercise(
        204,
        'Wall Sit',
        'جلوس الحائط',
        3,
        '45 sec',
        '30 sec',
        'Quadriceps',
        'عضلات الفخذ الأمامية',
        ['Glutes', 'Calves'],
        ['أرداف', 'بطن الساق'],
        'Beginner',
        'The wall sit is an isometric exercise that builds endurance in the quadriceps and improves mental toughness.',
        'جلوس الحائط تمرين ثابت يبني التحمل في عضلات الفخذ الأمامية ويحسن الصلابة الذهنية.',
        [
          'Stand with your back against a wall',
          'Slide down until your thighs are parallel to the floor',
          'Keep your knees at 90 degrees',
          'Hold the position for the prescribed time',
          'Keep your hands off your legs'
        ],
        [
          'قف مع ظهرك على الحائط',
          'انزلق حتى يصبح فخذيك موازيين للأرض',
          'حافظ على ركبتيك بزاوية 90 درجة',
          'ثبت على الوضع للوقت المحدد',
          'لا تضع يديك على ساقيك'
        ],
        [
          'Knees extending past ankles',
          'Leaning forward off the wall',
          'Not holding long enough'
        ],
        [
          'الركبتين تتجاوزان الكاحلين',
          'الميل للأمام بعيداً عن الحائط',
          'عدم التثبيت لوقت كافٍ'
        ],
        [
          'Start with shorter holds',
          'Keep your back flat against the wall',
          'Breathe normally throughout'
        ],
        [
          'ابدأ بفترات أقصر',
          'حافظ على ظهرك مسطحاً على الحائط',
          'تنفس بشكل طبيعي طوال الوقت'
        ],
        ['Bodyweight Squats', 'Split Squats', 'Bulgarian Split Squats'],
        ['سكوات عادي', 'سكوات منقسمة', 'سكوات بلغارية منقسمة'],
        true,
        45,
        '/assets/home/day2/Wall Sit.png'
      ),
      createHomeExercise(
        205,
        'Calf Raises',
        'رفع بطن الساق',
        4,
        '20',
        '30 sec',
        'Calves',
        'بطن الساق',
        ['Ankles'],
        ['كاحلين'],
        'Beginner',
        'Calf raises strengthen the gastrocnemius and soleus muscles, improving ankle stability and lower leg strength.',
        'رفع بطن الساق يقوي عضلات الساق ويحسن استقرار الكاحل وقوة أسفل الساق.',
        [
          'Stand on the edge of a step or flat ground',
          'Rise up onto the balls of your feet',
          'Hold for a moment at the top',
          'Lower slowly back down',
          'Keep your core engaged for balance'
        ],
        [
          'قف على حافة درجة أو أرض مستوية',
          'ارتفع على كرات قدميك',
          'ثبت للحظة في الأعلى',
          'أنزل ببطء',
          'حافظ على شد عضلات البطن للتوازن'
        ],
        [
          'Bouncing instead of controlled movement',
          'Not using full range of motion',
          'Rushing through the exercise'
        ],
        [
          'الارتداد بدلاً من الحركة المتحكم بها',
          'عدم استخدام المدى الكامل للحركة',
          'الاستعجال في التمرين'
        ],
        [
          'Use a wall for balance if needed',
          'Control both the up and down phases',
          'Stretch your calves between sets'
        ],
        [
          'استخدم الحائط للتوازن إذا لزم الأمر',
          'تحكم في مرحلتي الصعود والنزول',
          'مط عضلات بطن الساق بين المجموعات'
        ],
        ['Single-Leg Calf Raises', 'Seated Calf Raises', 'Jump Rope'],
        ['رفع بطن الساق ساق واحدة', 'رفع بطن الساق جلوس', 'القفز بالحبل'],
        false,
        undefined,
        '/assets/home/day2/Calf Raises.png'
      )
    ]
  },
  // Day 3 - Rest
  {
    id: 3,
    name: 'Day 3',
    nameAr: 'اليوم 3',
    focus: 'Rest / Light Cardio',
    focusAr: 'راحة / كارديو خفيف',
    isRestDay: true,
    exercises: []
  },
  // Day 4 - Back + Arms
  {
    id: 4,
    name: 'Day 4',
    nameAr: 'اليوم 4',
    focus: 'Back + Arms',
    focusAr: 'ظهر + ذراعين',
    isRestDay: false,
    exercises: [
      createHomeExercise(
        401,
        'Superman Hold',
        'ثبات سوبرمان',
        3,
        '30 sec',
        '45 sec',
        'Lower Back',
        'أسفل الظهر',
        ['Glutes', 'Hamstrings'],
        ['أرداف', 'عضلات الفخذ الخلفية'],
        'Beginner',
        'The superman hold strengthens the lower back and posterior chain muscles, improving posture and preventing back pain.',
        'ثبات سوبرمان يقوي أسفل الظهر وعضلات السلسلة الخلفية، يحسن القامة ويمنع آلام الظهر.',
        [
          'Lie face down on the floor',
          'Extend your arms in front of you',
          'Simultaneously lift your arms, chest, and legs off the ground',
          'Hold the position for the prescribed time',
          'Lower back down with control'
        ],
        [
          'استلقِ على وجهك على الأرض',
          'مد ذراعيك أمامك',
          'ارفع ذراعيك وصدرك وساقيك عن الأرض في نفس الوقت',
          'ثبت على الوضع للوقت المحدد',
          'أنزل بتحكم'
        ],
        [
          'Lifting too high causing hyperextension',
          'Holding breath',
          'Jerky movements instead of controlled'
        ],
        [
          'الرفع عالياً جداً مما يسبب فرط التمدد',
          'حبس النفس',
          'حركات متقطعة بدلاً من المتحكم بها'
        ],
        [
          'Start with shorter holds',
          'Keep your neck neutral',
          'Squeeze your glutes at the top'
        ],
        [
          'ابدأ بفترات أقصر',
          'حافظ على رقبتك محايدة',
          'اضغط على الأرداف في الأعلى'
        ],
        ['Swimmers', 'Bird Dog', 'Back Extensions'],
        ['السباحون', 'بيرد دوج', 'تمديدات الظهر'],
        true,
        30,
        '/assets/home/day4/Superman Hold.png'
      ),
      createHomeExercise(
        402,
        'Reverse Snow Angels',
        'ملائكة الثلج العكسية',
        3,
        '12',
        '45 sec',
        'Back',
        'ظهر',
        ['Rear Delts', 'Traps'],
        ['كتف خلفي', 'ترابيس'],
        'Intermediate',
        'Reverse snow angels target the upper back and rear deltoids, improving shoulder health and posture.',
        'ملائكة الثلج العكسية تستهدف أعلى الظهر والكتف الخلفي، تحسن صحة الكتف والقامة.',
        [
          'Lie face down with arms extended in front',
          'Sweep your arms out to the sides and back',
          'Keep your arms off the ground throughout',
          'Squeeze your shoulder blades together at the bottom',
          'Return to starting position with control'
        ],
        [
          'استلقِ على وجهك مع ذراعين ممدودتين للأمام',
          'مرر ذراعيك للجانبين والخلف',
          'حافظ على ذراعيك بعيدتين عن الأرض طوال الوقت',
          'اضغط على لوحي كتفك معاً في الأسفل',
          'عد لوضع البداية بتحكم'
        ],
        [
          'Lifting head too high',
          'Arms touching the ground',
          'Rushing through the movement'
        ],
        [
          'رفع الرأس عالياً جداً',
          'الذراعين تلمسان الأرض',
          'الاستعجال في الحركة'
        ],
        [
          'Keep your neck neutral',
          'Move slowly and with control',
          'Focus on the squeeze in your upper back'
        ],
        [
          'حافظ على رقبتك محايدة',
          'تحرك ببطء وبالتحكم',
          'ركز على الضغط في أعلى ظهرك'
        ],
        ['Prone Y-W-T Raises', 'Face Pulls', 'Band Pull-Aparts'],
        ['رفعات Y-W-T على البطن', 'فيس بول', 'سحب الشريط'],
        false,
        undefined,
        '/assets/home/day4/Reverse Snow Angels.png'
      ),
      createHomeExercise(
        403,
        'Diamond Push Ups',
        'ضغط الماس',
        3,
        '10',
        '60 sec',
        'Triceps',
        'ترايسيبس',
        ['Chest', 'Shoulders'],
        ['صدر', 'أكتاف'],
        'Intermediate',
        'Diamond push ups place more emphasis on the triceps by bringing your hands close together in a diamond shape.',
        'ضغط الماس يركز أكثر على الترايسيبس عن طريق تقريب اليدين معاً بشكل الماس.',
        [
          'Start in a push up position',
          'Place your hands together under your chest forming a diamond',
          'Lower your body keeping elbows close to your sides',
          'Push back up to the starting position',
          'Keep your core tight throughout'
        ],
        [
          'ابدأ في وضع الضغط',
          'ضع يديك معاً تحت صدرك بشكل الماس',
          'أنزل جسمك مع الحفاظ على المرفقين قريبين من جنبك',
          'ادفع لأعلى لوضع البداية',
          'حافظ على شد عضلات البطن طوال الوقت'
        ],
        [
          'Flaring elbows out',
          'Hands not forming a proper diamond',
          'Not going through full range of motion'
        ],
        [
          'فتح المرفقين للخارج',
          'اليدين لا تشكلان ماساً صحيحاً',
          'عدم إكمال المدى الكامل للحركة'
        ],
        [
          'Start with standard push ups first',
          'Keep your body in a straight line',
          'Warm up your wrists before starting'
        ],
        [
          'ابدأ بالضغط العادي أولاً',
          'حافظ على جسمك في خط مستقيم',
          'سخن معصميك قبل البدء'
        ],
        ['Standard Push Ups', 'Close Grip Push Ups', 'Tricep Dips'],
        ['ضغط عادي', 'ضغط قبضة ضيقة', 'غطط الترايسيبس'],
        false,
        undefined,
        '/assets/home/day4/Diamond Push Ups.png'
      ),
      createHomeExercise(
        404,
        'Plank Shoulder Taps',
        'لمس الكتفين في البلانك',
        3,
        '10 each',
        '45 sec',
        'Core',
        'عضلات البطن',
        ['Shoulders', 'Arms'],
        ['أكتاف', 'ذراعين'],
        'Intermediate',
        'Plank shoulder taps challenge core stability while adding upper body movement, improving anti-rotation strength.',
        'لمس الكتفين في البلانك يتحدى استقرار الجذع مع إضافة حركة الجزء العلوي، يحسن قوة مضاد الدوران.',
        [
          'Start in a high plank position',
          'Lift one hand and tap the opposite shoulder',
          'Keep your hips as still as possible',
          'Return the hand to the floor and switch sides',
          'Minimize hip rotation throughout'
        ],
        [
          'ابدأ في وضع البلانك العالي',
          'ارفع إحدى اليدين والمس الكتف المقابل',
          'حافظ على وركك ثابتاً قدر الإمكان',
          'أعد اليد للأرض وبدّل الجانبين',
          'قلل دوران الورك طوال الوقت'
        ],
        [
          'Rotating hips too much',
          'Rushing the movement',
          'Sagging hips'
        ],
        [
          'دوران الورك أكثر من اللازم',
          'الاستعجال في الحركة',
          'ترهل الوركين'
        ],
        [
          'Move slowly and with control',
          'Spread your feet wider for more stability',
          'Keep your core braced'
        ],
        [
          'تحرك ببطء وبالتحكم',
          'افتح قدميك أوسع لمزيد من الاستقرار',
          'حافظ على شد عضلات البطن'
        ],
        ['High Plank', 'Plank Up-Downs', 'Plank Jacks'],
        ['بلانك عالي', 'صعود ونزول البلانك', 'بلانك جاك'],
        false,
        undefined,
        '/assets/home/day4/Plank Shoulder Taps.png'
      ),
      createHomeExercise(
        405,
        'Table Rows',
        'سحب الطاولة',
        3,
        '12',
        '60 sec',
        'Back',
        'ظهر',
        ['Biceps', 'Rear Delts'],
        ['بايسيبس', 'كتف خلفي'],
        'Intermediate',
        'Table rows are a home alternative to pull-ups, using a sturdy table to perform inverted rows that target the back muscles.',
        'سحب الطاولة بديل منزلي للسحب، باستخدام طاولة متينة لأداء سحب مقلوبة تستهدف عضلات الظهر.',
        [
          'Lie under a sturdy table with chest below the edge',
          'Grip the edge of the table with both hands',
          'Pull your chest up toward the table edge',
          'Squeeze your shoulder blades together at the top',
          'Lower back down with control'
        ],
        [
          'استلقِ تحت طاولة متينة مع صدرك أسفل الحافة',
          'أمسك حافة الطاولة بكلتا اليدين',
          'اسحب صدرك لأعلى نحو حافة الطاولة',
          'اضغط على لوحي كتفك معاً في الأعلى',
          'أنزل بتحكم'
        ],
        [
          'Using momentum to pull up',
          'Not squeezing shoulder blades',
          'Table not sturdy enough'
        ],
        [
          'استخدام الزخم للسحب',
          'عدم ضغط لوحي الكتف',
          'الطاولة غير متينة بما يكفي'
        ],
        [
          'Ensure the table is stable and strong',
          'Keep your body in a straight line',
          'Control the movement throughout'
        ],
        [
          'تأكد من أن الطاولة مستقرة وقوية',
          'حافظ على جسمك في خط مستقيم',
          'تحكم في الحركة طوال الوقت'
        ],
        ['Door Frame Rows', 'Towel Rows', 'Resistance Band Rows'],
        ['سحب إطار الباب', 'سحب المنشفة', 'سحب شريط المقاومة'],
        false,
        undefined,
        '/assets/home/day4/Table Rows.png'
      )
    ]
  },
  // Day 5 - Full Body HIIT
  {
    id: 5,
    name: 'Day 5',
    nameAr: 'اليوم 5',
    focus: 'Full Body HIIT',
    focusAr: 'كامل الجسم HIIT',
    isRestDay: false,
    exercises: [
      createHomeExercise(
        501,
        'Burpees',
        'بيربي',
        3,
        '10',
        '90 sec',
        'Full Body',
        'كامل الجسم',
        ['Chest', 'Legs'],
        ['صدر', 'أرجل'],
        'Advanced',
        'Burpees are a high-intensity full body exercise that combines a squat, push-up, and jump, providing excellent cardio and strength benefits.',
        'البيربي تمرين عالي الشدة لكامل الجسم يجمع بين السكوات والضغط والقفز، يوفر فوائد كارديو وقوة ممتازة.',
        [
          'Start standing with feet shoulder-width apart',
          'Drop into a squat and place your hands on the floor',
          'Kick your feet back into a push-up position',
          'Perform a push-up (optional)',
          'Jump your feet back to your hands and explode upward'
        ],
        [
          'ابدأ واقفاً مع قدمين بعرض الكتفين',
          'انزل لسكوات وضع يديك على الأرض',
          'اركل قدميك للخلف لوضع الضغط',
          'أدِ ضغط (اختياري)',
          'اقفز بقدميك ليدك وانفجر للأعلى'
        ],
        [
          'Skipping the push-up if able to do it',
          'Not jumping explosively enough',
          'Poor form due to fatigue'
        ],
        [
          'تخطي الضغط إذا كان بإمكانك فعله',
          'عدم القفز بقوة كافية',
          'وضع سيء بسبب التعب'
        ],
        [
          'Start with half burpees (no push-up)',
          'Maintain good form over speed',
          'Land softly on the jump'
        ],
        [
          'ابدأ بنصف بيربي (بدون ضغط)',
          'حافظ على الوضع الصحيح على السرعة',
          'الهبط بنعومة عند القفز'
        ],
        ['Half Burpees', 'Squat Thrusts', 'Burpee to Pull-Up'],
        ['نصف بيربي', 'دفعة السكوات', 'بيربي للسحب'],
        false,
        undefined,
        '/assets/home/day5/Burpees.png'
      ),
      createHomeExercise(
        502,
        'Jumping Jacks',
        'تفتح القفز',
        3,
        '30',
        '30 sec',
        'Full Body',
        'كامل الجسم',
        ['Calves', 'Shoulders'],
        ['بطن الساق', 'أكتاف'],
        'Beginner',
        'Jumping jacks are a classic cardio exercise that elevates heart rate while working the entire body.',
        'تفتح القفز تمرين كارديو كلاسيكي يرفع معدل ضربات القلب بينما يعمل على كامل الجسم.',
        [
          'Stand with feet together and arms at sides',
          'Jump while spreading your legs and raising your arms overhead',
          'Land softly with feet wider than shoulder-width',
          'Jump back to starting position',
          'Maintain a steady rhythm'
        ],
        [
          'قف مع قدمين معاً وذراعين على الجانبين',
          'اقفز مع فتح ساقيك ورفع ذراعيك فوق الرأس',
          'الهبط بنعومة مع قدمين أوسع من الكتفين',
          'اقفز لوضع البداية',
          'حافظ على إيقاع ثابت'
        ],
        [
          'Not using full range of motion',
          'Landing with straight legs',
          'Moving too slowly'
        ],
        [
          'عدم استخدام المدى الكامل للحركة',
          'الهبوط بأرجل مستقيمة',
          'الحركة ببطء شديد'
        ],
        [
          'Land with slightly bent knees',
          'Keep your core engaged',
          'Breathe rhythmically'
        ],
        [
          'الهبط مع ثني بسيط للركبتين',
          'حافظ على شد عضلات البطن',
          'تنفس بإيقاع'
        ],
        ['Star Jumps', 'Seal Jacks', 'Cross Jacks'],
        ['قفز النجمة', 'جاك الفقمة', 'جاك متقاطع'],
        false,
        undefined,
        '/assets/home/day5/Jumping Jacks.png'
      ),
      createHomeExercise(
        503,
        'High Knees',
        'رفع الركبتين',
        3,
        '20 each',
        '30 sec',
        'Hip Flexors',
        'عضلات الفخذ',
        ['Quadriceps', 'Core'],
        ['عضلات الفخذ الأمامية', 'عضلات البطن'],
        'Intermediate',
        'High knees are a running-in-place exercise that targets the hip flexors and elevates heart rate.',
        'رفع الركبتين تمرين جري في المكان يستهدف عضلات الفخذ ويرفع معدل ضربات القلب.',
        [
          'Stand in place with feet hip-width apart',
          'Drive one knee up toward your chest',
          'Quickly switch to bring the other knee up',
          'Pump your arms in a running motion',
          'Stay on the balls of your feet'
        ],
        [
          'قف في المكان مع قدمين بعرض الوركين',
          'ارفع ركبة واحدة نحو صدرك',
          'بدّل بسرعة لرفع الركبة الأخرى',
          'حرك ذراعيك في حركة جري',
          'ابقَ على كرات قدميك'
        ],
        [
          'Not bringing knees high enough',
          'Leaning back too much',
          'Moving too slowly'
        ],
        [
          'عدم رفع الركبتين عالياً بما يكفي',
          'الميل للخلف أكثر من اللازم',
          'الحركة ببطء شديد'
        ],
        [
          'Keep your core engaged',
          'Stay light on your feet',
          'Maintain an upright posture'
        ],
        [
          'حافظ على شد عضلات البطن',
          'ابقَ خفيفاً على قدميك',
          'حافظ على قامة منتصبة'
        ],
        ['Butt Kicks', 'A-Skips', 'Mountain Climbers'],
        ['رفع الكعبين', 'سكيبس', 'تسلق الجبال'],
        false,
        undefined,
        '/assets/home/day5/High Knees.png'
      ),
      createHomeExercise(
        504,
        'Squat to Push Up',
        'سكوات للضغط',
        3,
        '8',
        '90 sec',
        'Full Body',
        'كامل الجسم',
        ['Chest', 'Legs'],
        ['صدر', 'أرجل'],
        'Intermediate',
        'Squat to push-up combines a bodyweight squat with a push-up for a compound full-body movement.',
        'سكوات للضغط يجمع بين السكوات والضغط لحركة مركبة لكامل الجسم.',
        [
          'Start standing with feet shoulder-width apart',
          'Perform a squat, placing hands on the floor',
          'Kick feet back into a push-up position',
          'Perform one push-up',
          'Jump feet back to hands and stand up'
        ],
        [
          'ابدأ واقفاً مع قدمين بعرض الكتفين',
          'أدِ سكوات، وضع اليدين على الأرض',
          'اركل القدمين للخلف لوضع الضغط',
          'أدِ ضغط واحد',
          'اقفز بالقدمين لليدين وقف'
        ],
        [
          'Rushing through the movement',
          'Poor push-up form',
          'Not squatting deep enough'
        ],
        [
          'الاستعجال في الحركة',
          'وضع ضغط سيء',
          'عدم النزول بالسكوات بما يكفي'
        ],
        [
          'Control each part of the movement',
          'Maintain good form throughout',
          'Breathe steadily'
        ],
        [
          'تحكم في كل جزء من الحركة',
          'حافظ على الوضع الصحيح طوال الوقت',
          'تنفس بثبات'
        ],
        ['Burpees', 'Thrusters', 'Man Makers'],
        ['بيربي', 'ثراسترز', 'مان ميكرز'],
        false,
        undefined,
        '/assets/home/day5/Squat to Push Up.png'
      ),
      createHomeExercise(
        505,
        'Plank',
        'البلانك',
        3,
        '60 sec',
        '30 sec',
        'Core',
        'عضلات البطن',
        ['Shoulders', 'Lower Back'],
        ['أكتاف', 'أسفل الظهر'],
        'Beginner',
        'The plank is an isometric core exercise that builds endurance and stability in the entire core region.',
        'البلانك تمرين ثابت للجذع يبني التحمل والاستقرار في منطقة الجذع بأكملها.',
        [
          'Start in a push up position or on forearms',
          'Keep your body in a straight line from head to heels',
          'Engage your core by pulling your belly button toward your spine',
          'Hold the position for the prescribed time',
          'Breathe normally throughout the hold'
        ],
        [
          'ابدأ في وضع الضغط أو على الساعدين',
          'حافظ على جسمك في خط مستقيم من الرأس للكعبين',
          'اشد عضلات البطن بسحب السرة نحو العمود الفقري',
          'ثبت على الوضع للوقت المحدد',
          'تنفس بشكل طبيعي طوال التثبيت'
        ],
        [
          'Letting hips sag or pike up',
          'Holding your breath',
          'Looking up or dropping head'
        ],
        [
          'ترهل الوركين أو رفعها',
          'حبس النفس',
          'النظر لأعلى أو إسقاط الرأس'
        ],
        [
          'Start with shorter holds and build up',
          'Keep your neck neutral',
          'Squeeze your glutes to help maintain alignment'
        ],
        [
          'ابدأ بفترات أقصر وبناء تدريجي',
          'حافظ على رقبتك محايدة',
          'اضغط على الأرداف للمساعدة في الحفاظ على المحاذاة'
        ],
        ['Side Plank', 'High Plank', 'Plank Jacks'],
        ['بلانك جانبي', 'بلانك عالي', 'بلانك جاك'],
        true,
        60,
        '/assets/home/day5/Plank.png'
      )
    ]
  },
  // Day 6 - Core Focus
  {
    id: 6,
    name: 'Day 6',
    nameAr: 'اليوم 6',
    focus: 'Core Focus',
    focusAr: 'تركيز على البطن',
    isRestDay: false,
    exercises: [
      createHomeExercise(
        601,
        'Leg Raises',
        'رفع الأرجل',
        3,
        '15',
        '45 sec',
        'Lower Abs',
        'أسفل البطن',
        ['Hip Flexors'],
        ['عضلات الفخذ'],
        'Intermediate',
        'Leg raises target the lower abdominal muscles while challenging hip flexor control.',
        'رفع الأرجل يستهدف عضلات البطن السفلية مع تحدي التحكم في عضلات الفخذ.',
        [
          'Lie flat on your back with legs extended',
          'Place your hands under your lower back for support',
          'Raise your legs up until they are perpendicular to the floor',
          'Slowly lower your legs back down without touching the floor',
          'Keep your lower back pressed into the floor'
        ],
        [
          'استلقِ على ظهرك مع أرجل ممدودة',
          'ضع يديك تحت أسفل ظهرك للدعم',
          'ارفع ساقيك حتى تصبحا عموديتين على الأرض',
          'أنزل ساقيك ببطء دون لمس الأرض',
          'حافظ على أسفل ظهرك مضغوطاً على الأرض'
        ],
        [
          'Lower back arching off the ground',
          'Using momentum to swing legs up',
          'Lowering legs too quickly'
        ],
        [
          'أسفل الظهر يرتفع عن الأرض',
          'استخدام الزخم لتأرجح الأرجل',
          'إنزال الأرجل بسرعة كبيرة'
        ],
        [
          'Press your lower back into the floor',
          'Control the movement throughout',
          'Bend knees slightly if needed'
        ],
        [
          'اضغط أسفل ظهرك على الأرض',
          'تحكم في الحركة طوال الوقت',
          'اثنِ ركبتيك قليلاً إذا لزم الأمر'
        ],
        ['Hanging Leg Raises', 'Reverse Crunches', 'Flutter Kicks'],
        ['رفع الأرجل المعلقة', 'تقلصات عكسية', 'رفس الأرجل'],
        false,
        undefined,
        '/assets/home/day6/Leg Raises.png'
      ),
      createHomeExercise(
        602,
        'Russian Twists',
        'اللف الروسي',
        3,
        '20 total',
        '45 sec',
        'Obliques',
        'عضلات الجانب',
        ['Abs'],
        ['عضلات البطن'],
        'Intermediate',
        'Russian twists target the oblique muscles through rotational movement, building core strength and stability.',
        'اللف الروسي يستهدف عضلات الجانب من خلال الحركة الدورانية، يبني قوة واستقرار الجذع.',
        [
          'Sit on the floor with knees bent and feet elevated',
          'Lean back slightly to engage your core',
          'Clasp your hands together in front of you',
          'Rotate your torso from side to side',
          'Touch the floor beside your hip each time'
        ],
        [
          'اجلس على الأرض مع ثني الركبتين ورفع القدمين',
          'امل للخلف قليلاً لشد عضلات البطن',
          'ضم يديك معاً أمامك',
          'دور جذعك من جانب لآخر',
          'المس الأرض بجانب وركك كل مرة'
        ],
        [
          'Moving arms instead of rotating torso',
          'Using momentum to swing',
          'Not keeping feet elevated'
        ],
        [
          'تحريك الذراعين بدلاً من دوران الجذع',
          'استخدام الزخم للتأرجح',
          'عدم رفع القدمين'
        ],
        [
          'Keep your core engaged throughout',
          'Move with control, not speed',
          'Keep your back straight'
        ],
        [
          'حافظ على شد عضلات البطن طوال الوقت',
          'تحرك بالتحكم، ليس السرعة',
          'حافظ على ظهرك مستقيماً'
        ],
        ['Bicycle Crunches', 'Side Planks', 'Wood Chops'],
        ['تقلصات الدراجة', 'بلانك جانبي', 'تقطيع الخشب'],
        false,
        undefined,
        '/assets/home/day6/Russian Twists.png'
      ),
      createHomeExercise(
        603,
        'Flutter Kicks',
        'رفس الأرجل',
        3,
        '20 each',
        '45 sec',
        'Lower Abs',
        'أسفل البطن',
        ['Hip Flexors', 'Quads'],
        ['عضلات الفخذ', 'عضلات الفخذ الأمامية'],
        'Intermediate',
        'Flutter kicks are a swimming-inspired exercise that targets the lower abs and hip flexors.',
        'رفس الأرجل تمرين مستوحى من السباحة يستهدف أسفل البطن وعضلات الفخذ.',
        [
          'Lie flat on your back with legs extended',
          'Place your hands under your glutes for support',
          'Lift both legs slightly off the ground',
          'Alternate kicking your legs up and down',
          'Keep your lower back pressed into the floor'
        ],
        [
          'استلقِ على ظهرك مع أرجل ممدودة',
          'ضع يديك تحت أردافك للدعم',
          'ارفع كلا الساقين قليلاً عن الأرض',
          'بدّل رفس ساقيك لأعلى ولأسفل',
          'حافظ على أسفل ظهرك مضغوطاً على الأرض'
        ],
        [
          'Lower back arching',
          'Legs too high off the ground',
          'Moving too fast'
        ],
        [
          'أسفل الظهر يقوس',
          'الأرجل عالية جداً عن الأرض',
          'الحركة سريعة جداً'
        ],
        [
          'Keep your lower back flat',
          'Maintain a small range of motion',
          'Breathe steadily'
        ],
        [
          'حافظ على أسفل ظهرك مسطحاً',
          'حافظ على مدى حركة صغير',
          'تنفس بثبات'
        ],
        ['Scissor Kicks', 'Leg Raises', 'Dead Bug'],
        ['مقص الأرجل', 'رفع الأرجل', 'الحشرة الميتة'],
        false,
        undefined,
        '/assets/home/day6/Flutter Kicks.png'
      ),
      createHomeExercise(
        604,
        'Bicycle Crunch',
        'تقلص الدراجة',
        3,
        '15 each',
        '45 sec',
        'Abs',
        'عضلات البطن',
        ['Obliques', 'Hip Flexors'],
        ['عضلات الجانب', 'عضلات الفخذ'],
        'Intermediate',
        'Bicycle crunches are one of the most effective ab exercises, targeting the rectus abdominis and obliques simultaneously.',
        'تقلص الدراجة من أكثر تمارين البطن فعالية، تستهدف عضلات البطن المستقيمة والجانبية في نفس الوقت.',
        [
          'Lie on your back with hands behind your head',
          'Bring your knees up to a 90-degree angle',
          'Crunch up and rotate, bringing elbow to opposite knee',
          'Extend the other leg out straight',
          'Alternate sides in a pedaling motion'
        ],
        [
          'استلقِ على ظهرك مع يدين خلف رأسك',
          'ارفع ركبتيك لزاوية 90 درجة',
          'ارفع وتدور، bringing المرفق للركبة المقابلة',
          'مد الساق الأخرى مستقيمة',
          'بدّل الجانبين في حركة دوران'
        ],
        [
          'Pulling on the neck',
          'Not fully extending the leg',
          'Moving too quickly'
        ],
        [
          'السحب على الرقبة',
          'عدم مد الساق بالكامل',
          'الحركة بسرعة كبيرة'
        ],
        [
          'Keep your lower back flat',
          'Move with control',
          'Breathe steadily'
        ],
        [
          'حافظ على أسفل ظهرك مسطحاً',
          'تحرك بالتحكم',
          'تنفس بثبات'
        ],
        ['Crunches', 'Russian Twists', 'Dead Bug'],
        ['تقلصات', 'اللف الروسي', 'الحشرة الميتة'],
        false,
        undefined,
        '/assets/home/day6/Bicycle Crunch.png'
      ),
      createHomeExercise(
        605,
        'Plank Variations',
        'تنويعات البلانك',
        3,
        '45 sec',
        '30 sec',
        'Core',
        'عضلات البطن',
        ['Shoulders', 'Back'],
        ['أكتاف', 'ظهر'],
        'Intermediate',
        'Plank variations challenge core stability from different angles, building comprehensive core strength.',
        'تنويعات البلانك تتحدى استقرار الجذع من زوايا مختلفة، تبني قوة جذع شاملة.',
        [
          'Start in a forearm plank position',
          'Hold for 15 seconds',
          'Transition to a side plank for 15 seconds',
          'Switch to the other side for 15 seconds',
          'Return to center plank'
        ],
        [
          'ابدأ في وضع بلانك الساعدين',
          'ثبت لمدة 15 ثانية',
          'انتقل لبلانك جانبي لمدة 15 ثانية',
          'بدّل للجانب الآخر لمدة 15 ثانية',
          'عد لبلانك المنتصف'
        ],
        [
          'Letting hips sag',
          'Rushing through transitions',
          'Holding breath'
        ],
        [
          'ترهل الوركين',
          'الاستعجال في الانتقالات',
          'حبس النفس'
        ],
        [
          'Move slowly through transitions',
          'Keep core engaged throughout',
          'Breathe normally'
        ],
        [
          'تحرك ببطء خلال الانتقالات',
          'حافظ على شد عضلات البطن طوال الوقت',
          'تنفس بشكل طبيعي'
        ],
        ['Standard Plank', 'Side Plank', 'Plank Up-Downs'],
        ['بلانك عادي', 'بلانك جانبي', 'صعود ونزول البلانك'],
        true,
        45,
        '/assets/home/day6/Plank Variations.png'
      )
    ]
  },
  // Day 7 - Rest
  {
    id: 7,
    name: 'Day 7',
    nameAr: 'اليوم 7',
    focus: 'Rest',
    focusAr: 'راحة',
    isRestDay: true,
    exercises: []
  }
];

export const getHomeWorkoutDay = (id: number): HomeWorkoutDay | undefined => {
  return HOME_WORKOUT_DAYS.find(day => day.id === id);
};

export const getHomeExercise = (id: number): HomeExercise | undefined => {
  for (const day of HOME_WORKOUT_DAYS) {
    const exercise = day.exercises.find(ex => ex.id === id);
    if (exercise) return exercise;
  }
  return undefined;
};

// Apply difficulty modifiers to exercise
export const applyDifficulty = (
  exercise: HomeExercise,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
): HomeExercise => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  
  const adjustedSets = Math.round(exercise.sets * config.setsMultiplier);
  
  let adjustedReps = exercise.reps;
  if (!exercise.isDurationBased && exercise.reps.includes('-')) {
    // Handle range reps like "6-8"
    const [min, max] = exercise.reps.split('-').map(Number);
    const newMin = Math.round(min * config.repsMultiplier);
    const newMax = Math.round(max * config.repsMultiplier);
    adjustedReps = `${newMin}-${newMax}`;
  } else if (!exercise.isDurationBased) {
    // Handle single rep count
    const reps = parseInt(exercise.reps);
    adjustedReps = Math.round(reps * config.repsMultiplier).toString();
  }
  
  // Adjust rest time
  let restSeconds = parseInt(exercise.rest.replace(/[^0-9]/g, ''));
  if (config.restModifier === 1) {
    restSeconds = Math.round(restSeconds * 1.25);
  } else if (config.restModifier === -1) {
    restSeconds = Math.round(restSeconds * 0.75);
  }
  const adjustedRest = `${restSeconds} sec`;
  
  // Adjust duration for duration-based exercises
  let adjustedDuration = exercise.duration;
  if (exercise.isDurationBased && exercise.duration) {
    adjustedDuration = Math.round(exercise.duration * config.repsMultiplier);
    adjustedReps = `${adjustedDuration} sec`;
  }
  
  return {
    ...exercise,
    sets: adjustedSets,
    reps: adjustedReps,
    rest: adjustedRest,
    duration: adjustedDuration
  };
};
