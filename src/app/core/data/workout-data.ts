import { Exercise, WorkoutDay } from '../models/exercise.model';

const createExercise = (
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
  equipment: string,
  equipmentAr: string,
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
  imageUrl?: string
): Exercise => ({
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
  equipment,
  equipmentAr,
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
  alternativesAr
});

export const WORKOUT_DAYS: WorkoutDay[] = [
  {
    id: 1,
    name: 'Day 1',
    focus: 'Chest + Triceps (Heavy Focus)',
    isRestDay: false,
    exercises: [
      createExercise(
        1,
        'Barbell Bench Press',
        'ضغط البنش بالباربل',
        4,
        '6-8',
        '2-3 min',
        'Chest',
        'صدر',
        ['Triceps', 'Shoulders'],
        ['ترايسيبس', 'أكتاف'],
        'Intermediate',
        'Barbell, Bench',
        'باربل، بنش',
        'The barbell bench press is the king of chest exercises. It targets the pectoralis major, anterior deltoids, and triceps. This compound movement builds upper body pushing strength and mass.',
        'ضغط البنش بالباربل هو ملك تمارين الصدر. يستهدف العضلة الصدرية الكبرى والعضلات الدالية الأمامية والترايسيبس. هذه الحركة المركبة تبني قوة وكتلة الجزء العلوي من الجسم.',
        [
          'Lie flat on the bench with your feet firmly on the floor',
          'Grip the bar slightly wider than shoulder-width apart',
          'Unrack the bar and lower it to your mid-chest',
          'Push the bar back up to the starting position',
          'Keep your elbows at about 45 degrees from your body'
        ],
        [
          'استلقِ على البنش مع وضع قدميك بإحكام على الأرض',
          'أمسك البار بعرض أوسع قليلاً من عرض الكتفين',
          'ارفع البار من الحامل وأنزله إلى منتصف صدرك',
          'ادفع البار لأعلى إلى وضع البداية',
          'حافظ على مرفقيك بزاوية 45 درجة تقريباً من جسمك'
        ],
        [
          'Bouncing the bar off your chest',
          'Flaring elbows out too wide (90 degrees)',
          'Arching your lower back excessively',
          'Using momentum instead of controlled movement'
        ],
        [
          'ارتداد البار من صدرك',
          'فتح المرفقين بشكل واسع جداً (90 درجة)',
          'تقوس أسفل الظهر بشكل مفرط',
          'استخدام الزخم بدلاً من الحركة المتحكم بها'
        ],
        [
          'Always use a spotter for heavy lifts',
          'Start with lighter weight to warm up',
          'Keep your shoulders retracted and depressed',
          'Use collars to secure weights on the bar'
        ],
        [
          'استخدم مساعداً دائماً للأوزان الثقيلة',
          'ابدأ بوزن أخف للإحماء',
          'حافظ على كتفيك للخلف ولأسفل',
          'استخدم طوقاً لتثبيت الأوزان على البار'
        ],
        ['Dumbbell Bench Press', 'Incline Bench Press', 'Machine Chest Press'],
        ['ضغط الدمبل', 'ضغط البنش المائل', 'ضغط الصدر بالماكينة'],
        '/assets/gym/day1/Barbell Bench Press.png'
      ),
      createExercise(
        2,
        'Incline Dumbbell Press',
        'ضغط الدمبل المائل',
        3,
        '8-10',
        '90 sec',
        'Upper Chest',
        'أعلى الصدر',
        ['Triceps', 'Shoulders'],
        ['ترايسيبس', 'أكتاف'],
        'Intermediate',
        'Dumbbells, Incline Bench',
        'دمبل، بنش مائل',
        'The incline dumbbell press targets the upper pectorals more effectively than flat pressing. Using dumbbells allows for a greater range of motion and helps correct muscle imbalances.',
        'ضغط الدمبل المائل يستهدف الجزء العلوي من الصدر بشكل أكثر فعالية من الضغط المستوي. استخدام الدمبل يسمح بنطاق حركة أكبر ويساعد في تصحيح عدم توازن العضلات.',
        [
          'Set the bench to a 30-45 degree incline',
          'Sit with dumbbells resting on your thighs',
          'Kick the dumbbells up to shoulder level',
          'Press the dumbbells up until arms are extended',
          'Lower slowly to the starting position'
        ],
        [
          'اضبط البنش على زاوية ميل 30-45 درجة',
          'اجلس والدمبل يستقر على فخذيك',
          'ارفع الدمبل إلى مستوى الكتفين',
          'اضغط الدمبل لأعلى حتى تمتد ذراعيك',
          'أنزل ببطء إلى وضع البداية'
        ],
        [
          'Setting the incline too high (targets shoulders)',
          'Not controlling the descent',
          'Letting dumbbells drift inward at the top',
          'Using too much weight with poor form'
        ],
        [
          'ضبط الميل عالياً جداً (يستهدف الأكتاف)',
          'عدم التحكم في النزول',
          'انحراف الدمبل للداخل في الأعلى',
          'استخدام وزن ثقيل جداً مع شكل سيء'
        ],
        [
          'Start with lighter weight to find your groove',
          'Keep your back flat against the bench',
          'Breathe out as you press up',
          'Lower dumbbells to the side of your upper chest'
        ],
        [
          'ابدأ بوزن أخف لإيجاد وضعك المناسب',
          'حافظ على ظهرك مسطحاً على البنش',
          'ازفر أثناء الضغط لأعلى',
          'أنزل الدمبل إلى جانب أعلى صدرك'
        ],
        ['Incline Barbell Press', 'Reverse Grip Bench Press', 'Cable Incline Fly'],
        ['ضغط الباربل المائل', 'ضغط البنش بالقبضة العكسية', 'فتح الكابل المائل'],
        '/assets/gym/day1/Incline Dumbbell Press.png'
      ),
      createExercise(
        3,
        'Chest Fly Machine',
        'ماكينة فتح الصدر',
        3,
        '12',
        '60 sec',
        'Chest',
        'صدر',
        ['Shoulders'],
        ['أكتاف'],
        'Beginner',
        'Chest Fly Machine',
        'ماكينة فتح الصدر',
        'The chest fly machine provides a safe and effective way to isolate the pectoral muscles. The guided movement pattern helps maintain proper form throughout the exercise.',
        'ماكينة فتح الصدر توفر طريقة آمنة وفعالة لعزل عضلات الصدر. نمط الحركة الموجه يساعد في الحفاظ على الشكل الصحيح طوال التمرين.',
        [
          'Adjust the seat so handles are at chest level',
          'Sit with your back flat against the pad',
          'Grip the handles with palms facing forward',
          'Bring arms together in front of you',
          'Slowly return to the starting position'
        ],
        [
          'اضبط المقعد بحيث تكون المقابض عند مستوى الصدر',
          'اجلس وظهرك مسطح على الوسادة',
          'أمسك المقابض وراحتا يديك متجهتان للأمام',
          'اجمع ذراعيك أمامك',
          'عد ببطء إلى وضع البداية'
        ],
        [
          'Using too much weight and sacrificing form',
          'Not controlling the eccentric phase',
          'Rushing through the movement',
          'Not fully extending at the start position'
        ],
        [
          'استخدام وزن ثقيل جداً والتضحية بالشكل',
          'عدم التحكم في مرحلة النزول',
          'الاستعجال في الحركة',
          'عدم المد الكامل في وضع البداية'
        ],
        [
          'Focus on squeezing your chest at the midpoint',
          'Keep shoulders down and back',
          'Maintain a controlled tempo throughout',
          'Adjust weight to achieve full range of motion'
        ],
        [
          'ركز على ضغط صدرك في المنتصف',
          'حافظ على كتفيك للأسفل والخلف',
          'حافظ على إيقاع متحكم به طوال الوقت',
          'اضبط الوزن لتحقيق نطاق حركة كامل'
        ],
        ['Dumbbell Fly', 'Cable Crossover', 'Pec Deck'],
        ['فتح الدمبل', 'فتح الكابل', 'جهاز الصدر'],
        '/assets/gym/day1/Chest Fly Machine.png'
      ),
      createExercise(
        4,
        'Weighted Dips',
        'الغطس المثقل',
        3,
        '8-10',
        '90 sec',
        'Triceps',
        'ترايسيبس',
        ['Chest', 'Shoulders'],
        ['صدر', 'أكتاف'],
        'Advanced',
        'Dip Station, Weight Belt/Dumbbell',
        'محطة الغطس، حزام أوزان/دمبل',
        'Weighted dips are an excellent compound exercise for building triceps and lower chest mass. Adding weight increases the challenge for advanced lifters.',
        'الغطس المثقل تمرين مركب ممتاز لبناء كتلة الترايسيبس وأسفل الصدر. إضافة الوزن تزيد التحدي للرياضيين المتقدمين.',
        [
          'Grip the parallel bars and lift yourself up',
          'Lean forward slightly to engage chest',
          'Lower your body until elbows are at 90 degrees',
          'Push back up to the starting position',
          'Add weight using a dip belt or dumbbell between legs'
        ],
        [
          'أمسك القضبان المتوازية وارفع نفسك',
          'انحنِ للأمام قليلاً لإشراك الصدر',
          'أنزل جسمك حتى يكون مرفقيك بزاوية 90 درجة',
          'ادفع لأعلى إلى وضع البداية',
          'أضف وزناً باستخدام حزام الغطس أو دمبل بين الساقين'
        ],
        [
          'Going too deep and stressing the shoulder joint',
          'Not leaning forward enough (less chest engagement)',
          'Flaring elbows out too wide',
          'Using momentum to push back up'
        ],
        [
          'النزول عميقاً جداً وإجهاد مفصل الكتف',
          'عدم الانحناء للأمام بما يكفي (أقل إشراك للصدر)',
          'فتح المرفقين بشكل واسع جداً',
          'استخدام الزخم للدفع لأعلى'
        ],
        [
          'Master bodyweight dips before adding weight',
          'Keep shoulders down and back throughout',
          'Control the descent - dont drop quickly',
          'Stop if you feel shoulder pain'
        ],
        [
          'أتقن الغطس بوزن الجسم قبل إضافة أوزان',
          'حافظ على كتفيك للأسفل والخلف طوال الوقت',
          'تحكم في النزول - لا تسقط بسرعة',
          'توقف إذا شعرت بألم في الكتف'
        ],
        ['Bench Dips', 'Assisted Dip Machine', 'Close Grip Bench Press'],
        ['غطس البنش', 'ماكينة الغطس المساعدة', 'ضغط البنش بالقبضة الضيقة'],
        '/assets/gym/day1/Weighted Dips.png'
      ),
      createExercise(
        5,
        'Rope Pushdown',
        'ضغط الحبل للأسفل',
        3,
        '12-15',
        '60 sec',
        'Triceps',
        'ترايسيبس',
        [],
        [],
        'Beginner',
        'Cable Machine, Rope Attachment',
        'ماكينة الكابل، حبل',
        'The rope pushdown is a staple triceps isolation exercise. The rope attachment allows for a greater range of motion and better muscle activation at the bottom of the movement.',
        'ضغط الحبل للأسفل تمرين أساسي لعزل الترايسيبس. ملحق الحبل يسمح بنطاق حركة أكبر وتفعيل عضلي أفضل في أسفل الحركة.',
        [
          'Attach the rope to a high pulley',
          'Stand facing the machine with feet shoulder-width apart',
          'Grip the rope with palms facing each other',
          'Push the rope down, spreading it apart at the bottom',
          'Slowly return to the starting position'
        ],
        [
          'اربط الحبل بالبكرة العلوية',
          'قف مواجهاً للماكينة مع وضع القدمين بعرض الكتفين',
          'أمسك الحبل وراحتا يديك متجهتان لبعضهما',
          'اضغط الحبل للأسفل، وافرده في الأسفل',
          'عد ببطء إلى وضع البداية'
        ],
        [
          'Using momentum from the upper body',
          'Not spreading the rope at the bottom',
          'Letting the weight stack rest between reps',
          'Elbows flaring out to the sides'
        ],
        [
          'استخدام الزخم من الجزء العلوي من الجسم',
          'عدم فرد الحبل في الأسفل',
          'ترك كومة الأوزان تستقر بين التكرارات',
          'خروج المرفقين للجانبين'
        ],
        [
          'Keep elbows pinned to your sides',
          'Focus on the mind-muscle connection',
          'Squeeze triceps hard at the bottom',
          'Control the weight on the way up'
        ],
        [
          'حافظ على المرفقين ثابتين بجانبك',
          'ركز على الربط الذهني العضلي',
          'اضغط الترايسيبس بقوة في الأسفل',
          'تحكم في الوزن أثناء الصعود'
        ],
        ['Straight Bar Pushdown', 'V-Bar Pushdown', 'Reverse Grip Pushdown'],
        ['ضغط البار المستقيم', 'ضغط البار V', 'ضغط القبضة العكسية'],
        '/assets/gym/day1/Rope Pushdown.png'
      ),
      createExercise(
        6,
        'Overhead Dumbbell Triceps Extension',
        'تمديد الترايسيبس بالدمبل فوق الرأس',
        3,
        '10',
        '60 sec',
        'Triceps',
        'ترايسيبس',
        [],
        [],
        'Beginner',
        'Dumbbell',
        'دمبل',
        'The overhead dumbbell triceps extension targets the long head of the triceps. This exercise helps build full triceps development and arm size.',
        'تمديد الترايسيبس بالدمبل فوق الرأس يستهدف الرأس الطويل للترايسيبس. هذا التمرين يساعد في بناء تطور كامل للترايسيبس وحجم الذراع.',
        [
          'Stand or sit holding a dumbbell with both hands',
          'Lift the dumbbell overhead, arms extended',
          'Lower the dumbbell behind your head by bending elbows',
          'Extend arms back to the starting position',
          'Keep elbows close to your head throughout'
        ],
        [
          'قف أو اجلس ممسكاً بدمبل بكلتا يديك',
          'ارفع الدمبل فوق رأسك، والذراعان ممدودتان',
          'أنزل الدمبل خلف رأسك بثني المرفقين',
          'مد ذراعيك للعودة إلى وضع البداية',
          'حافظ على المرفقين قريبين من رأسك طوال الوقت'
        ],
        [
          'Flaring elbows out to the sides',
          'Using too much weight with poor form',
          'Not getting a full stretch at the bottom',
          'Arching the lower back'
        ],
        [
          'فتح المرفقين للجانبين',
          'استخدام وزن ثقيل جداً مع شكل سيء',
          'عدم الحصول على مد كامل في الأسفل',
          'تقوس أسفل الظهر'
        ],
        [
          'Start light to master the form',
          'Keep your core engaged for stability',
          'Focus on the triceps stretch and contraction',
          'Avoid locking out at the top'
        ],
        [
          'ابدأ بوزن خفيف لإتقان الشكل',
          'حافظ على عضلاتك الأساسية مشدودة للثبات',
          'ركز على مد وضغط الترايسيبس',
          'تجنب القفل الكامل في الأعلى'
        ],
        ['Skull Crushers', 'Cable Overhead Extension', 'EZ Bar Extension'],
        ['سحق الجمجمة', 'تمديد الكابل فوق الرأس', 'تمديد بار EZ'],
        '/assets/gym/day1/Overhead Dumbbell Triceps Extension.png'
      )
    ]
  },
  {
    id: 2,
    name: 'Day 2',
    focus: 'Back + Biceps',
    isRestDay: false,
    exercises: [
      createExercise(
        7,
        'Deadlift',
        'الرفعة الميتة',
        3,
        '5',
        '3-4 min',
        'Back',
        'ظهر',
        ['Glutes', 'Hamstrings', 'Traps'],
        ['أرداف', 'عضلات الفخذ الخلفية', 'ترابيس'],
        'Advanced',
        'Barbell',
        'باربل',
        'The deadlift is a fundamental compound exercise that builds total body strength. It primarily targets the posterior chain including the back, glutes, and hamstrings.',
        'الرفعة الميتة تمرين مركب أساسي يبني قوة الجسم بالكامل. يستهدف بشكل أساسي السلسلة الخلفية بما في ذلك الظهر والأرداف وعضلات الفخذ الخلفية.',
        [
          'Stand with feet hip-width apart, bar over mid-foot',
          'Bend at the hips and knees to grip the bar',
          'Keep back flat, chest up, and core braced',
          'Drive through your feet to stand up with the bar',
          'Lower the bar with control by hinging at the hips'
        ],
        [
          'قف مع وضع القدمين بعرض الوركين، البار فوق منتصف القدم',
          'انحنِ من الوركين والركبتين لتمسك البار',
          'حافظ على الظهر مسطحاً، الصدر مرتفعاً، والعضلات الأساسية مشدودة',
          'ادفع من خلال قدميك للوقوف مع البار',
          'أنزل البار بتحكم بالانحناء من الوركين'
        ],
        [
          'Rounding the lower back',
          'Starting with hips too low (squatting the weight)',
          'Jerking the bar off the floor',
          'Looking up excessively during the lift'
        ],
        [
          'تقوس أسفل الظهر',
          'البداية مع الوركين منخفضين جداً (القرفصة بالوزن)',
          'انتزاع البار من الأرض',
          'النظر لأعلى بشكل مفرط أثناء الرفع'
        ],
        [
          'Always maintain a neutral spine',
          'Use a mixed grip or straps for heavy weights',
          'Start light and progress gradually',
          'Consider using a belt for heavy attempts'
        ],
        [
          'حافظ دائماً على عمود فقري محايد',
          'استخدم قبضة مختلطة أو أحزمة للأوزان الثقيلة',
          'ابدأ خفيفاً وتقدم تدريجياً',
          'فكر في استخدام حزام للمحاولات الثقيلة'
        ],
        ['Romanian Deadlift', 'Trap Bar Deadlift', 'Rack Pulls'],
        ['الرفعة الميتة الرومانية', 'الرفعة الميتة ببار التراب', 'سحب الرف'],
        '/assets/gym/day2/Deadlift.png'
      ),
      createExercise(
        8,
        'Barbell Row',
        'سحب الباربل',
        4,
        '8',
        '90 sec',
        'Lats',
        'عضلات الظهر العريضة',
        ['Rhomboids', 'Rear Delts', 'Biceps'],
        ['العضلات المعينية', 'الأكتاف الخلفية', 'بايسيبس'],
        'Intermediate',
        'Barbell',
        'باربل',
        'The barbell row is a classic back builder that develops thickness in the lats, rhomboids, and middle back. Its essential for a strong, muscular back.',
        'سحب الباربل تمرين كلاسيكي لبناء الظهر يطور السماكة في عضلات الظهر العريضة والمعينية ومنتصف الظهر. إنه أساسي لظهر قوي وعضلي.',
        [
          'Stand with feet shoulder-width apart, knees slightly bent',
          'Hinge forward at the hips until torso is nearly parallel to floor',
          'Grip the bar with hands slightly wider than shoulder width',
          'Pull the bar to your lower chest, squeezing shoulder blades',
          'Lower the bar with control'
        ],
        [
          'قف مع وضع القدمين بعرض الكتفين، الركبتان مثنيتان قليلاً',
          'انحنِ للأمام من الوركين حتى يكون الجذع موازياً تقريباً للأرض',
          'أمسك البار بيد أوسع قليلاً من عرض الكتفين',
          'اسحب البار إلى أسفل صدرك، مع ضغط لوحي الكتفين',
          'أنزل البار بتحكم'
        ],
        [
          'Using momentum to pull the weight',
          'Standing too upright',
          'Pulling to the wrong position (too high/low)',
          'Rounding the lower back'
        ],
        [
          'استخدام الزخم لسحب الوزن',
          'الوقوف منتصباً جداً',
          'السحب إلى وضع خاطئ (عالٍ جداً/منخفض جداً)',
          'تقوس أسفل الظهر'
        ],
        [
          'Keep your core tight throughout',
          'Maintain a neutral neck position',
          'Focus on pulling with your back, not arms',
          'Control the eccentric phase'
        ],
        [
          'حافظ على عضلاتك الأساسية مشدودة طوال الوقت',
          'حافظ على وضع رقبة محايد',
          'ركز على السحب بظهرك، وليس ذراعيك',
          'تحكم في مرحلة النزول'
        ],
        ['Dumbbell Row', 'T-Bar Row', 'Seated Cable Row'],
        ['سحب الدمبل', 'سحب بار T', 'سحب الكابل الجالس'],
        '/assets/gym/day2/Barbell Row.png'
      ),
      createExercise(
        9,
        'Lat Pulldown (Close Grip)',
        'سحب الظهر بالكابل (قبضة ضيقة)',
        3,
        '10',
        '60 sec',
        'Lats',
        'عضلات الظهر العريضة',
        ['Biceps', 'Mid Back'],
        ['بايسيبس', 'منتصف الظهر'],
        'Beginner',
        'Cable Machine, Close Grip Bar',
        'ماكينة الكابل، بار قبضة ضيقة',
        'The close grip lat pulldown emphasizes the lower lats and provides a greater range of motion compared to wide grip variations. Its excellent for building lat width.',
        'سحب الظهر بالقبضة الضيقة يركز على أسفل عضلات الظهر العريضة ويوفر نطاق حركة أكبر مقارنة بالقبضة الواسعة. ممتاز لبناء عرض الظهر.',
        [
          'Sit at the lat pulldown station, thighs secured under pads',
          'Grip the close grip bar with palms facing you',
          'Pull the bar down to your upper chest',
          'Squeeze your lats at the bottom',
          'Slowly return to the starting position'
        ],
        [
          'اجلس في محطة سحب الظهر، الفخذان مثبتان تحت الوسائد',
          'أمسك بار القبضة الضيقة وراحتا يديك متجهتان لك',
          'اسحب البار إلى أعلى صدرك',
          'اضغط عضلات ظهرك في الأسفل',
          'عد ببطء إلى وضع البداية'
        ],
        [
          'Using momentum by swinging back',
          'Pulling behind the neck (can cause injury)',
          'Not fully extending arms at the top',
          'Using too much weight with poor form'
        ],
        [
          'استخدام الزخم بالتأرجح للخلف',
          'السحب خلف الرقبة (قد يسبب إصابة)',
          'عدم مد الذراعين بالكامل في الأعلى',
          'استخدام وزن ثقيل جداً مع شكل سيء'
        ],
        [
          'Keep your chest up throughout',
          'Focus on driving elbows down and back',
          'Control the weight on the way up',
          'Maintain a slight lean back'
        ],
        [
          'حافظ على صدرك مرتفعاً طوال الوقت',
          'ركز على دفع المرفقين للأسفل والخلف',
          'تحكم في الوزن أثناء الصعود',
          'حافظ على ميل خفيف للخلف'
        ],
        ['Wide Grip Lat Pulldown', 'Reverse Grip Pulldown', 'Chin-ups'],
        ['سحب الظهر بالقبضة الواسعة', 'سحب الظهر بالقبضة العكسية', 'السحب للأعلى'],
        '/assets/gym/day2/Lat Pulldown.png'
      ),
      createExercise(
        10,
        'Seated Cable Row',
        'سحب الكابل الجالس',
        3,
        '12',
        '60 sec',
        'Mid Back',
        'منتصف الظهر',
        ['Lats', 'Rear Delts', 'Biceps'],
        ['عضلات الظهر العريضة', 'الأكتاف الخلفية', 'بايسيبس'],
        'Beginner',
        'Cable Machine, V-Bar or Straight Bar',
        'ماكينة الكابل، بار V أو بار مستقيم',
        'The seated cable row is an excellent exercise for developing mid-back thickness. The constant tension from the cable provides effective muscle stimulation.',
        'سحب الكابل الجالس تمرين ممتاز لتطوير سماكة منتصف الظهر. الشد المستمر من الكابل يوفر تحفيز عضلي فعال.',
        [
          'Sit on the platform with feet on the foot rests',
          'Grip the handle with both hands',
          'Keep knees slightly bent, torso upright',
          'Pull the handle to your lower chest',
          'Squeeze your shoulder blades together',
          'Return with control'
        ],
        [
          'اجلس على المنصة مع وضع القدمين على المساند',
          'أمسك المقبض بكلتا يديك',
          'حافظ على الركبتين مثنيتين قليلاً، الجذع منتصب',
          'اسحب المقبض إلى أسفل صدرك',
          'اضغط لوحي كتفيك معاً',
          'عد بتحكم'
        ],
        [
          'Rounding the back during the pull',
          'Using too much upper body momentum',
          'Not squeezing at the contraction',
          'Letting the weight pull you forward too much'
        ],
        [
          'تقوس الظهر أثناء السحب',
          'استخدام زخم الجسم العلوي بشكل مفرط',
          'عدم الضغط عند الانقباض',
          'السماح للوزن بسحبك للأمام كثيراً'
        ],
        [
          'Maintain an upright torso throughout',
          'Focus on the mind-muscle connection with your back',
          'Keep shoulders down and back',
          'Control the eccentric phase'
        ],
        [
          'حافظ على الجذع منتصباً طوال الوقت',
          'ركز على الربط الذهني العضلي مع ظهرك',
          'حافظ على الكتفين للأسفل والخلف',
          'تحكم في مرحلة النزول'
        ],
        ['Barbell Row', 'T-Bar Row', 'Machine Row'],
        ['سحب الباربل', 'سحب بار T', 'سحب الماكينة'],
        '/assets/gym/day2/Seated Cable Row.png'
      ),
      createExercise(
        11,
        'Barbell Curl',
        'لف الباربل',
        3,
        '8-10',
        '60 sec',
        'Biceps',
        'بايسيبس',
        ['Forearms'],
        ['ساعد'],
        'Beginner',
        'Barbell',
        'باربل',
        'The barbell curl is the premier biceps mass builder. It allows for heavy loading and targets both heads of the biceps for maximum arm development.',
        'لف الباربل هو أفضل تمرين لبناء كتلة البايسيبس. يسمح بتحميل ثقيل ويستهدف كلا رأسي البايسيبس لأقصى تطور للذراع.',
        [
          'Stand with feet shoulder-width apart',
          'Grip the bar with palms facing forward, hands shoulder-width',
          'Keep elbows pinned to your sides',
          'Curl the bar up toward your shoulders',
          'Squeeze biceps at the top',
          'Lower with control'
        ],
        [
          'قف مع وضع القدمين بعرض الكتفين',
          'أمسك البار وراحتا يديك متجهتان للأمام، اليدان بعرض الكتفين',
          'حافظ على المرفقين ثابتين بجانبك',
          'الف البار لأعلى نحو كتفيك',
          'اضغط البايسيبس في الأعلى',
          'أنزل بتحكم'
        ],
        [
          'Swinging the bar using momentum',
          'Moving elbows forward during the curl',
          'Not fully extending at the bottom',
          'Using a weight thats too heavy'
        ],
        [
          'تأرجح البار باستخدام الزخم',
          'تحريك المرفقين للأمام أثناء اللف',
          'عدم المد الكامل في الأسفل',
          'استخدام وزن ثقيل جداً'
        ],
        [
          'Keep your core engaged to prevent swinging',
          'Focus on the biceps doing the work',
          'Maintain a controlled tempo',
          'Dont lean back to complete reps'
        ],
        [
          'حافظ على عضلاتك الأساسية مشدودة لمنع التأرجح',
          'ركز على البايسيبس القيام بالعمل',
          'حافظ على إيقاع متحكم به',
          'لا تميل للخلف لإكمال التكرارات'
        ],
        ['EZ Bar Curl', 'Dumbbell Curl', 'Cable Curl'],
        ['لف بار EZ', 'لف الدمبل', 'لف الكابل'],
        '/assets/gym/day2/Barbell Curl.png'
      ),
      createExercise(
        12,
        'Incline Dumbbell Curl',
        'لف الدمبل المائل',
        3,
        '10-12',
        '60 sec',
        'Biceps',
        'بايسيبس',
        ['Forearms'],
        ['ساعد'],
        'Intermediate',
        'Dumbbells, Incline Bench',
        'دمبل، بنش مائل',
        'The incline dumbbell curl provides a greater stretch for the biceps and emphasizes the long head. This variation helps build peaked biceps.',
        'لف الدمبل المائل يوفر مداً أكبر للبايسيبس ويركز على الرأس الطويل. هذا التمرين يساعد في بناء بايسيبس بارز.',
        [
          'Set an incline bench to about 45 degrees',
          'Sit back with dumbbells at your sides, arms hanging',
          'Curl both dumbbells up, supinating your wrists',
          'Squeeze biceps at the top',
          'Lower slowly to the starting position'
        ],
        [
          'اضبط بنش مائل بحوالي 45 درجة',
          'اجلس والدمبل بجانبك، الذراعان معلقتان',
          'الف كلا الدمبلين لأعلى، مع لف راحتي يديك',
          'اضغط البايسيبس في الأعلى',
          'أنزل ببطء إلى وضع البداية'
        ],
        [
          'Setting the incline too steep',
          'Using momentum to curl the weight',
          'Not fully extending at the bottom',
          'Curling both arms simultaneously (can use alternating)'
        ],
        [
          'ضبط الميل شديد الانحدار',
          'استخدام الزخم لرفع الوزن',
          'عدم المد الكامل في الأسفل',
          'لف كلتا الذراعين في نفس الوقت (يمكن استخدام التبادل)'
        ],
        [
          'Keep your back flat against the bench',
          'Focus on the stretch at the bottom',
          'Control the weight throughout',
          'Supinate your wrists as you curl'
        ],
        [
          'حافظ على ظهرك مسطحاً على البنش',
          'ركز على المد في الأسفل',
          'تحكم في الوزن طوال الوقت',
          'لف راحتي يديك أثناء الرفع'
        ],
        ['Preacher Curl', 'Concentration Curl', 'Hammer Curl'],
        ['لف الواعظ', 'لف التركيز', 'لف المطرقة'],
        '/assets/gym/day2/Incline Dumbbell Curl.png'
      )
    ]
  },
  {
    id: 3,
    name: 'Day 3',
    focus: 'Rest / Light Cardio',
    isRestDay: true,
    exercises: []
  },
  {
    id: 4,
    name: 'Day 4',
    focus: 'Legs (Quad Focus)',
    isRestDay: false,
    exercises: [
      createExercise(
        13,
        'Barbell Squat',
        'السكوات بالباربل',
        4,
        '6-8',
        '2-3 min',
        'Quadriceps',
        'عضلات الفخذ الأمامية',
        ['Glutes', 'Hamstrings', 'Core'],
        ['أرداف', 'عضلات الفخذ الخلفية', 'عضلات الجذع'],
        'Advanced',
        'Barbell, Squat Rack',
        'باربل، رف السكوات',
        'The barbell squat is the king of leg exercises. Its a compound movement that builds strength and mass in the quadriceps, glutes, and entire lower body.',
        'السكوات بالباربل هو ملك تمارين الأرجل. إنه تمرين مركب يبني القوة والكتلة في عضلات الفخذ الأمامية والأرداف والجسم السفلي بالكامل.',
        [
          'Set the bar at upper chest height in the rack',
          'Step under the bar, resting it on your upper back/traps',
          'Unrack and step back with feet shoulder-width apart',
          'Brace your core and squat down by sitting back',
          'Descend until thighs are at least parallel to floor',
          'Drive through your feet to stand back up'
        ],
        [
          'اضبط البار على ارتفاع أعلى الصدر في الرف',
          'ادخل تحت البار، ضعه على أعلى ظهرك/الترابيس',
          'ارفع البار من الرف وتراجع مع القدمين بعرض الكتفين',
          'شدد عضلاتك الأساسية وانزل بالجلوس للخلف',
          'انزل حتى يكون فخذيك موازيين على الأقل للأرض',
          'ادفع من خلال قدميك للوقوف'
        ],
        [
          'Rounding the lower back',
          'Knees caving inward',
          'Not reaching proper depth',
          'Lifting heels off the ground'
        ],
        [
          'تقوس أسفل الظهر',
          'الركبتان تنحنيان للداخل',
          'عدم الوصول للعمق الصحيح',
          'رفع الكعبين عن الأرض'
        ],
        [
          'Always use a spotter or safety pins for heavy sets',
          'Keep your chest up and core braced',
          'Push knees out in line with toes',
          'Start light and focus on mobility'
        ],
        [
          'استخدم مساعداً أو مسامير أمان دائماً للمجموعات الثقيلة',
          'حافظ على صدرك مرتفعاً وعضلاتك الأساسية مشدودة',
          'ادفع الركبتين للخارج في خط مع أصابع القدمين',
          'ابدأ خفيفاً وركز على المرونة'
        ],
        ['Front Squat', 'Goblet Squat', 'Leg Press'],
        ['سكوات أمامي', 'سكوات الكوبل', 'ضغط الأرجل'],
        '/assets/gym/day4/Barbell Squat.png'
      ),
      createExercise(
        14,
        'Hack Squat',
        'سكوات الهاك',
        3,
        '10',
        '90 sec',
        'Quadriceps',
        'عضلات الفخذ الأمامية',
        ['Glutes'],
        ['أرداف'],
        'Intermediate',
        'Hack Squat Machine',
        'ماكينة سكوات الهاك',
        'The hack squat machine provides a guided squatting motion that emphasizes the quadriceps. Its excellent for building quad size with reduced spinal loading.',
        'ماكينة سكوات الهاك توفر حركة سكوات موجهة تركز على عضلات الفخذ الأمامية. ممتازة لبناء حجم الفخذ مع تقليل الحمل على العمود الفقري.',
        [
          'Load the machine and position yourself on the platform',
          'Place feet shoulder-width apart, slightly forward on platform',
          'Unrack the safety handles',
          'Lower by bending your knees',
          'Push through your heels to return to start'
        ],
        [
          'حمل الماكينة وتموضع نفسك على المنصة',
          'ضع القدمين بعرض الكتفين، قليلاً للأمام على المنصة',
          'افتح مقابض الأمان',
          'انزل بثني ركبتيك',
          'ادفع من خلال كعبيك للعودة للبداية'
        ],
        [
          'Going too deep and lifting hips off the pad',
          'Locking knees at the top',
          'Using too much weight with limited range of motion',
          'Positioning feet too low on the platform'
        ],
        [
          'النزول عميقاً جداً ورفع الوركين عن الوسادة',
          'قفل الركبتين في الأعلى',
          'استخدام وزن ثقيل جداً مع نطاق حركة محدود',
          'وضع القدمين منخفضاً جداً على المنصة'
        ],
        [
          'Keep your back flat against the pad',
          'Control the descent',
          'Dont lock out at the top to maintain tension',
          'Adjust foot position for different emphasis'
        ],
        [
          'حافظ على ظهرك مسطحاً على الوسادة',
          'تحكم في النزول',
          'لا تقفل في الأعلى للحفاظ على الشد',
          'اضبط وضع القدمين لتركيز مختلف'
        ],
        ['Leg Press', 'Front Squat', 'Bulgarian Split Squat'],
        ['ضغط الأرجل', 'سكوات أمامي', 'سكوات البلغاري'],
        '/assets/gym/day4/Hack Squat.png'
      ),
      createExercise(
        15,
        'Leg Press',
        'ضغط الأرجل',
        3,
        '12',
        '90 sec',
        'Quadriceps',
        'عضلات الفخذ الأمامية',
        ['Glutes', 'Hamstrings'],
        ['أرداف', 'عضلات الفخذ الخلفية'],
        'Beginner',
        'Leg Press Machine',
        'ماكينة ضغط الأرجل',
        'The leg press allows for heavy loading of the legs with minimal spinal stress. Its excellent for building quad mass and is beginner-friendly.',
        'ضغط الأرجل يسمح بتحميل ثقيل للأرجل مع ضغط بسيط على العمود الفقري. ممتاز لبناء كتلة الفخذ ومناسب للمبتدئين.',
        [
          'Sit in the machine with your back flat against the pad',
          'Place feet shoulder-width apart on the platform',
          'Unrack the safety handles',
          'Lower the platform by bending your knees',
          'Push through your feet to extend legs'
        ],
        [
          'اجلس في الماكينة وظهرك مسطح على الوسادة',
          'ضع القدمين بعرض الكتفين على المنصة',
          'افتح مقابض الأمان',
          'أنزل المنصة بثني ركبتيك',
          'ادفع من خلال قدميك لمد الأرجل'
        ],
        [
          'Locking knees at the top',
          'Going too deep and lifting hips',
          'Using too much weight with tiny range of motion',
          'Placing feet too narrow (knee stress)'
        ],
        [
          'قفل الركبتين في الأعلى',
          'النزول عميقاً جداً ورفع الوركين',
          'استخدام وزن ثقيل جداً مع نطاق حركة صغير',
          'وضع القدمين ضيقاً جداً (ضغط على الركبة)'
        ],
        [
          'Keep your lower back pressed into the seat',
          'Control the weight throughout',
          'Dont lock out your knees',
          'Adjust foot position for different muscle emphasis'
        ],
        [
          'حافظ على أسفل ظهرك مضغوطاً على المقعد',
          'تحكم في الوزن طوال الوقت',
          'لا تقفل ركبتيك',
          'اضبط وضع القدمين لتركيز عضلي مختلف'
        ],
        ['Hack Squat', 'Squat', 'Bulgarian Split Squat'],
        ['سكوات الهاك', 'سكوات', 'سكوات البلغاري'],
        '/assets/gym/day4/Leg Press.png'
      ),
      createExercise(
        16,
        'Leg Extension',
        'تمديد الفخذ',
        3,
        '15',
        '60 sec',
        'Quadriceps',
        'عضلات الفخذ الأمامية',
        [],
        [],
        'Beginner',
        'Leg Extension Machine',
        'ماكينة تمديد الفخذ',
        'The leg extension is an isolation exercise that targets the quadriceps. Its excellent for finishing off your quad workout and building definition.',
        'تمديد الفخذ تمرين عزل يستهدف عضلات الفخذ الأمامية. ممتاز لإنهاء تمرين الفخذ وبناء التحديد.',
        [
          'Sit on the machine with your back against the pad',
          'Position your ankles under the pad',
          'Grip the handles for stability',
          'Extend your legs until theyre straight',
          'Squeeze your quads at the top',
          'Lower with control'
        ],
        [
          'اجلس على الماكينة وظهرك على الوسادة',
          'ضع كاحليك تحت الوسادة',
          'أمسك المقابض للثبات',
          'مد ساقيك حتى تصبح مستقيمة',
          'اضغط عضلات فخذك في الأعلى',
          'أنزل بتحكم'
        ],
        [
          'Using momentum to swing the weight up',
          'Not controlling the eccentric phase',
          'Using too much weight',
          'Not fully extending at the top'
        ],
        [
          'استخدام الزخم لتأرجح الوزن لأعلى',
          'عدم التحكم في مرحلة النزول',
          'استخدام وزن ثقيل جداً',
          'عدم المد الكامل في الأعلى'
        ],
        [
          'Focus on the mind-muscle connection',
          'Squeeze hard at the top',
          'Control the weight down slowly',
          'Adjust the pad so it sits just above your ankles'
        ],
        [
          'ركز على الربط الذهني العضلي',
          'اضغط بقوة في الأعلى',
          'تحكم في الوزن للنزول ببطء',
          'اضبط الوسادة لتجلس فوق كاحليك مباشرة'
        ],
        ['Sissy Squat', 'Reverse Nordic Curl', 'Cable Leg Extension'],
        ['سكوات السيزي', 'التمديد النوردي العكسي', 'تمديد الفخذ بالكابل'],
        '/assets/gym/day4/Leg Extension.png'
      ),
      createExercise(
        17,
        'Standing Calf Raise',
        'رفع الساق واقفاً',
        4,
        '12-15',
        '60 sec',
        'Calves',
        'بطة الساق',
        [],
        [],
        'Beginner',
        'Calf Raise Machine or Smith Machine',
        'ماكينة رفع الساق أو ماكينة سميث',
        'The standing calf raise targets the gastrocnemius, the larger calf muscle visible from behind. This exercise builds calf size and ankle stability.',
        'رفع الساق واقفاً يستهدف عضلة البطة الكبرى، العضلة الكبيرة المرئية من الخلف. هذا التمرين يبني حجم الساق وثبات الكاحل.',
        [
          'Stand with the balls of your feet on a raised platform',
          'Position your shoulders under the pads',
          'Lower your heels below the platform level',
          'Push up onto your toes as high as possible',
          'Squeeze your calves at the top',
          'Lower slowly to stretch'
        ],
        [
          'قف على كرات قدميك على منصة مرتفعة',
          'ضع كتفيك تحت الوسائد',
          'أنزل كعبيك تحت مستوى المنصة',
          'ارفع على أصابع قدميك لأعلى قدر المستطاع',
          'اضغط عضلات ساقك في الأعلى',
          'أنزل ببطء للمد'
        ],
        [
          'Bouncing through the movement',
          'Not getting a full stretch at the bottom',
          'Rushing through reps',
          'Using too much weight with poor range of motion'
        ],
        [
          'الارتداد خلال الحركة',
          'عدم الحصول على مد كامل في الأسفل',
          'الاستعجال في التكرارات',
          'استخدام وزن ثقيل جداً مع نطاق حركة ضعيف'
        ],
        [
          'Control the movement throughout',
          'Pause briefly at the top and bottom',
          'Focus on the stretch and contraction',
          'Use full range of motion'
        ],
        [
          'تحكم في الحركة طوال الوقت',
          'توقف قليلاً في الأعلى والأسفل',
          'ركز على المد والانقباض',
          'استخدم نطاق حركة كامل'
        ],
        ['Seated Calf Raise', 'Donkey Calf Raise', 'Leg Press Calf Raise'],
        ['رفع الساق جالساً', 'رفع الساق بالحمار', 'رفع الساق بضغط الأرجل'],
        '/assets/gym/day4/Standing Calf Raise.png'
      )
    ]
  },
  {
    id: 5,
    name: 'Day 5',
    focus: 'Shoulders + Rear Delt',
    isRestDay: false,
    exercises: [
      createExercise(
        18,
        'Dumbbell Shoulder Press',
        'ضغط الكتف بالدمبل',
        4,
        '8',
        '90 sec',
        'Shoulders',
        'أكتاف',
        ['Triceps', 'Upper Chest'],
        ['ترايسيبس', 'أعلى الصدر'],
        'Intermediate',
        'Dumbbells',
        'دمبل',
        'The dumbbell shoulder press is a fundamental exercise for building shoulder mass and strength. It targets all three heads of the deltoid with emphasis on the front and middle heads.',
        'ضغط الكتف بالدمبل تمرين أساسي لبناء كتلة وقوة الأكتاف. يستهدف الرؤوس الثلاثة للعضلة الدالية مع التركيز على الرأسين الأمامي والأوسط.',
        [
          'Sit on a bench with back support, feet flat on floor',
          'Hold dumbbells at shoulder height, palms facing forward',
          'Press the dumbbells overhead until arms are extended',
          'Lower slowly to the starting position',
          'Keep your core engaged throughout'
        ],
        [
          'اجلس على بنش مع دعم للظهر، القدمان مسطحتان على الأرض',
          'أمسك الدمبل على ارتفاع الكتف، راحتا اليدين متجهتان للأمام',
          'اضغط الدمبل فوق رأسك حتى تمتد الذراعان',
          'أنزل ببطء إلى وضع البداية',
          'حافظ على عضلاتك الأساسية مشدودة طوال الوقت'
        ],
        [
          'Arching the lower back',
          'Using momentum to press the weight',
          'Not controlling the descent',
          'Flaring elbows too far forward'
        ],
        [
          'تقوس أسفل الظهر',
          'استخدام الزخم لضغط الوزن',
          'عدم التحكم في النزول',
          'فتح المرفقين كثيراً للأمام'
        ],
        [
          'Keep your back flat against the bench',
          'Control the weight throughout',
          'Dont lock out elbows at the top',
          'Start light to warm up your shoulders'
        ],
        [
          'حافظ على ظهرك مسطحاً على البنش',
          'تحكم في الوزن طوال الوقت',
          'لا تقفل المرفقين في الأعلى',
          'ابدأ خفيفاً لإحماء كتفيك'
        ],
        ['Barbell Overhead Press', 'Arnold Press', 'Machine Shoulder Press'],
        ['ضغط الباربل فوق الرأس', 'ضغط أرنولد', 'ضغط الكتف بالماكينة'],
        '/assets/gym/day5/Dumbbell Shoulder Press.png'
      ),
      createExercise(
        19,
        'Lateral Raise',
        'الرفع الجانبي',
        4,
        '12-15',
        '60 sec',
        'Side Delts',
        'الأكتاف الجانبية',
        [],
        [],
        'Beginner',
        'Dumbbells',
        'دمبل',
        'The lateral raise is essential for building shoulder width. It isolates the middle deltoid head, creating the appearance of broader shoulders.',
        'الرفع الجانبي أساسي لبناء عرض الكتف. يعزل الرأس الأوسط للعضلة الدالية، مما يخلق مظهر أكتاف أوسع.',
        [
          'Stand with feet shoulder-width apart',
          'Hold dumbbells at your sides with a slight bend in elbows',
          'Raise dumbbells out to the sides until shoulder height',
          'Lead with your elbows, slightly forward',
          'Lower slowly with control'
        ],
        [
          'قف مع وضع القدمين بعرض الكتفين',
          'أمسك الدمبل بجانبك مع انحناء خفيف في المرفقين',
          'ارفع الدمبل للجانبين حتى ارتفاع الكتف',
          'قد بمرفقيك، قليلاً للأمام',
          'أنزل ببطء بتحكم'
        ],
        [
          'Using momentum to swing the weight up',
          'Going above shoulder height',
          'Keeping arms completely straight',
          'Using too much weight'
        ],
        [
          'استخدام الزخم لتأرجح الوزن لأعلى',
          'الرفع فوق ارتفاع الكتف',
          'إبقاء الذراعين مستقيمين تماماً',
          'استخدام وزن ثقيل جداً'
        ],
        [
          'Use light weight and focus on form',
          'Think about leading with your elbows',
          'Control the weight on the way down',
          'Slightly bend forward for better isolation'
        ],
        [
          'استخدم وزناً خفيفاً وركز على الشكل',
          'فكر في القيادة بمرفقيك',
          'تحكم في الوزن أثناء النزول',
          'انحنِ قليلاً للأمام لعزل أفضل'
        ],
        ['Cable Lateral Raise', 'Machine Lateral Raise', 'Upright Row'],
        ['الرفع الجانبي بالكابل', 'الرفع الجانبي بالماكينة', 'سحب مستقيم'],
        '/assets/gym/day5/Lateral Raise.png'
      ),
      createExercise(
        20,
        'Rear Delt Fly',
        'فتح الأكتاف الخلفية',
        4,
        '15',
        '60 sec',
        'Rear Delts',
        'الأكتاف الخلفية',
        ['Upper Back'],
        ['أعلى الظهر'],
        'Beginner',
        'Dumbbells or Machine',
        'دمبل أو ماكينة',
        'The rear delt fly targets the often-neglected posterior deltoid. Developing rear delts improves shoulder health, posture, and creates a 3D shoulder look.',
        'فتح الأكتاف الخلفية يستهدف العضلة الدالية الخلفية المهملة. تطوير الأكتاف الخلفية يحسن صحة الكتف والوضعية ويخلق مظهر كتف ثلاثي الأبعاد.',
        [
          'Lie face down on an incline bench or bend at the hips',
          'Hold dumbbells with arms hanging down',
          'Raise dumbbells out to the sides with slightly bent elbows',
          'Squeeze your rear delts at the top',
          'Lower with control'
        ],
        [
          'استلقِ على وجهك على بنش مائل أو انحنِ من الوركين',
          'أمسك الدمبل والذراعان معلقتان',
          'ارفع الدمبل للجانبين مع مرفقين مثنيين قليلاً',
          'اضغط أكتافك الخلفية في الأعلى',
          'أنزل بتحكم'
        ],
        [
          'Using too much weight',
          'Not getting a full contraction',
          'Swinging the weight up',
          'Not maintaining the bent-over position'
        ],
        [
          'استخدام وزن ثقيل جداً',
          'عدم الحصول على انقباض كامل',
          'تأرجح الوزن لأعلى',
          'عدم الحفاظ على وضع الانحناء'
        ],
        [
          'Use light weight and focus on the squeeze',
          'Think about pulling with your elbows',
          'Keep your back flat',
          'Control the movement throughout'
        ],
        [
          'استخدم وزناً خفيفاً وركز على الضغط',
          'فكر في السحب بمرفقيك',
          'حافظ على ظهرك مسطحاً',
          'تحكم في الحركة طوال الوقت'
        ],
        ['Face Pull', 'Reverse Pec Deck', 'Cable Reverse Fly'],
        ['سحب الوجه', 'فتح الصدر العكسي', 'فتح الكابل العكسي'],
        '/assets/gym/day5/Rear Delt Fly.png'
      ),
      createExercise(
        21,
        'Face Pull',
        'سحب الوجه',
        3,
        '15',
        '60 sec',
        'Rear Delts',
        'الأكتاف الخلفية',
        ['Rhomboids', 'External Rotators'],
        ['العضلات المعينية', 'المدورات الخارجية'],
        'Beginner',
        'Cable Machine, Rope Attachment',
        'ماكينة الكابل، حبل',
        'The face pull is excellent for shoulder health and rear delt development. It also strengthens the rotator cuff and improves posture.',
        'سحب الوجه ممتاز لصحة الكتف وتطوير الأكتاف الخلفية. يقوي أيضاً الكفة المدورة ويحسن الوضعية.',
        [
          'Attach a rope to a cable at upper chest height',
          'Grab the rope with both hands, step back',
          'Pull the rope toward your face',
          'Rotate your hands back as you pull',
          'Squeeze your rear delts and upper back',
          'Return with control'
        ],
        [
          'اربط حبلاً بالكابل على ارتفاع أعلى الصدر',
          'أمسك الحبل بكلتا يديك، تراجع للخلف',
          'اسحب الحبل نحو وجهك',
          'لف يديك للخلف أثناء السحب',
          'اضغط أكتافك الخلفية وأعلى ظهرك',
          'عد بتحكم'
        ],
        [
          'Using too much weight',
          'Not rotating hands back at the end',
          'Pulling too low (toward chest)',
          'Using momentum'
        ],
        [
          'استخدام وزن ثقيل جداً',
          'عدم لف اليدين للخلف في النهاية',
          'السحب منخفضاً جداً (نحو الصدر)',
          'استخدام الزخم'
        ],
        [
          'Focus on the external rotation at the end',
          'Keep your shoulders down and back',
          'Control the weight throughout',
          'This is a control exercise, not a heavy one'
        ],
        [
          'ركز على الدوران الخارجي في النهاية',
          'حافظ على كتفيك للأسفل والخلف',
          'تحكم في الوزن طوال الوقت',
          'هذا تمرين تحكم، وليس تمرين ثقيل'
        ],
        ['Rear Delt Fly', 'Reverse Pec Deck', 'Band Pull-Apart'],
        ['فتح الأكتاف الخلفية', 'فتح الصدر العكسي', 'فتح الشريط'],
        '/assets/gym/day5/Face Pull.png'
      ),
      createExercise(
        22,
        'EZ Bar Shrugs',
        'رفع الكتفين ببار EZ',
        3,
        '12',
        '60 sec',
        'Traps',
        'ترابيس',
        [],
        [],
        'Beginner',
        'EZ Bar',
        'بار EZ',
        'The EZ bar shrug targets the trapezius muscles. Well-developed traps create a powerful upper body appearance and support neck health.',
        'رفع الكتفين ببار EZ يستهدف عضلات الترابيس. الترابيس المتطور يخلق مظهر جسم علوي قوي ويدعم صحة الرقبة.',
        [
          'Stand with feet shoulder-width apart',
          'Hold the EZ bar in front of you with an overhand grip',
          'Shrug your shoulders up toward your ears',
          'Squeeze your traps at the top',
          'Lower slowly with control'
        ],
        [
          'قف مع وضع القدمين بعرض الكتفين',
          'أمسك بار EZ أمامك بقبضة علوية',
          'ارفع كتفيك نحو أذنيك',
          'اضغط الترابيس في الأعلى',
          'أنزل ببطء بتحكم'
        ],
        [
          'Rolling shoulders instead of shrugging straight up',
          'Using momentum to bounce the weight',
          'Not controlling the descent',
          'Using straps too early in training'
        ],
        [
          'لف الكتفين بدلاً من الرفع مباشرة',
          'استخدام الزخم لارتداد الوزن',
          'عدم التحكم في النزول',
          'استخدام الأحزمة مبكراً جداً في التدريب'
        ],
        [
          'Shrug straight up and down, not in circles',
          'Hold the contraction briefly at the top',
          'Control the weight down',
          'Consider using straps for heavier weights'
        ],
        [
          'ارفع مباشرة لأعلى ولأسفل، ليس في دوائر',
          'احتفظ بالانقباض قليلاً في الأعلى',
          'تحكم في الوزن أثناء النزول',
          'فكر في استخدام أحزمة للأوزان الثقيلة'
        ],
        ['Dumbbell Shrugs', 'Barbell Shrugs', 'Cable Shrugs'],
        ['رفع الكتفين بالدمبل', 'رفع الكتفين بالباربل', 'رفع الكتفين بالكابل'],
        '/assets/gym/day5/EZ Bar Shrugs.png'
      )
    ]
  },
  {
    id: 6,
    name: 'Day 6',
    focus: 'Legs (Hamstring Focus)',
    isRestDay: false,
    exercises: [
      createExercise(
        23,
        'Romanian Deadlift',
        'الرفعة الميتة الرومانية',
        4,
        '8',
        '90 sec',
        'Hamstrings',
        'عضلات الفخذ الخلفية',
        ['Glutes', 'Lower Back'],
        ['أرداف', 'أسفل الظهر'],
        'Intermediate',
        'Barbell',
        'باربل',
        'The Romanian deadlift is the premier hamstring builder. It emphasizes the eccentric phase and provides a deep stretch in the hamstrings.',
        'الرفعة الميتة الرومانية هي أفضل تمرين لبناء عضلات الفخذ الخلفية. يركز على مرحلة النزول ويوفر مداً عميقاً في عضلات الفخذ الخلفية.',
        [
          'Stand with feet hip-width apart, holding the bar at hip height',
          'Keep knees slightly bent but fixed throughout',
          'Hinge at the hips, pushing them back',
          'Lower the bar down your legs until you feel a hamstring stretch',
          'Drive hips forward to return to standing'
        ],
        [
          'قف مع وضع القدمين بعرض الوركين، ممسكاً البار على ارتفاع الورك',
          'حافظ على الركبتين مثنيتين قليلاً لكن ثابتين طوال الوقت',
          'انحنِ من الوركين، دافعاً إياهما للخلف',
          'أنزل البار على ساقيك حتى تشعر بمد في عضلات الفخذ الخلفية',
          'ادفع الوركين للأمام للعودة للوقوف'
        ],
        [
          'Bending the knees too much (turns into a squat)',
          'Rounding the lower back',
          'Not getting a full stretch in the hamstrings',
          'Looking up instead of keeping neck neutral'
        ],
        [
          'ثني الركبتين كثيراً (يتحول لسكوات)',
          'تقوس أسفل الظهر',
          'عدم الحصول على مد كامل في عضلات الفخذ الخلفية',
          'النظر لأعلى بدلاً من إبقاء الرقبة محايدة'
        ],
        [
          'Maintain a neutral spine throughout',
          'Focus on the hip hinge motion',
          'Feel the stretch in your hamstrings',
          'Start light to master the form'
        ],
        [
          'حافظ على عمود فقري محايد طوال الوقت',
          'ركز على حركة الانحناء من الوركين',
          'شعر بالمد في عضلات فخذك الخلفية',
          'ابدأ خفيفاً لإتقان الشكل'
        ],
        ['Stiff-Leg Deadlift', 'Good Morning', 'Cable Pull-Through'],
        ['الرفعة الميتة بالأرجل المستقيمة', 'صباح الخير', 'السحب بالكابل'],
        '/assets/gym/day6/Romanian Deadlift.png'
      ),
      createExercise(
        24,
        'Lying Leg Curl',
        'لف الساق راقداً',
        3,
        '12',
        '60 sec',
        'Hamstrings',
        'عضلات الفخذ الخلفية',
        [],
        [],
        'Beginner',
        'Leg Curl Machine',
        'ماكينة لف الساق',
        'The lying leg curl isolates the hamstrings effectively. Its excellent for building hamstring size and strength with minimal lower back involvement.',
        'لف الساق راقداً يعزل عضلات الفخذ الخلفية بفعالية. ممتاز لبناء حجم وقوة عضلات الفخذ الخلفية مع تدخل بسيط من أسفل الظهر.',
        [
          'Lie face down on the machine',
          'Position your ankles under the pad',
          'Curl your heels toward your glutes',
          'Squeeze your hamstrings at the top',
          'Lower with control'
        ],
        [
          'استلقِ على وجهك على الماكينة',
          'ضع كاحليك تحت الوسادة',
          'لف كعبيك نحو أردافك',
          'اضغط عضلات فخذك الخلفية في الأعلى',
          'أنزل بتحكم'
        ],
        [
          'Using momentum to swing the weight',
          'Lifting hips off the pad',
          'Not controlling the descent',
          'Using too much weight with poor form'
        ],
        [
          'استخدام الزخم لتأرجح الوزن',
          'رفع الوركين عن الوسادة',
          'عدم التحكم في النزول',
          'استخدام وزن ثقيل جداً مع شكل سيء'
        ],
        [
          'Keep your hips pressed into the pad',
          'Focus on the squeeze at the top',
          'Control the weight down',
          'Adjust the pad for proper positioning'
        ],
        [
          'حافظ على الوركين مضغوطين على الوسادة',
          'ركز على الضغط في الأعلى',
          'تحكم في الوزن أثناء النزول',
          'اضبط الوسادة للوضع الصحيح'
        ],
        ['Seated Leg Curl', 'Nordic Curl', 'Stability Ball Curl'],
        ['لف الساق جالساً', 'اللف النوردي', 'لف الكرة الثابتة'],
        '/assets/gym/day6/Lying Leg Curl.png'
      ),
      createExercise(
        25,
        'Bulgarian Split Squat',
        'سكوات البلغاري',
        3,
        '10 each leg',
        '60 sec',
        'Quadriceps',
        'عضلات الفخذ الأمامية',
        ['Glutes', 'Hamstrings'],
        ['أرداف', 'عضلات الفخذ الخلفية'],
        'Intermediate',
        'Dumbbells, Bench',
        'دمبل، بنش',
        'The Bulgarian split squat is a unilateral exercise that builds leg strength while improving balance. It targets quads and glutes with minimal spinal loading.',
        'سكوات البلغاري تمرين أحادي الجانب يبني قوة الأرجل مع تحسين التوازن. يستهدف عضلات الفخذ الأمامية والأرداف مع حمل بسيط على العمود الفقري.',
        [
          'Stand facing away from a bench, holding dumbbells',
          'Place one foot on the bench behind you',
          'Lower your back knee toward the ground',
          'Push through your front foot to return',
          'Complete all reps on one side before switching'
        ],
        [
          'قف مواجهاً بعيداً عن بنش، ممسكاً بدمبل',
          'ضع قدماً واحدة على البنش خلفك',
          'أنزل ركبتك الخلفية نحو الأرض',
          'ادفع من خلال قدمك الأمامية للعودة',
          'أكمل جميع التكرارات على جانب واحد قبل التبديل'
        ],
        [
          'Leaning too far forward',
          'Not getting full range of motion',
          'Letting front knee cave inward',
          'Rushing through reps'
        ],
        [
          'الميل كثيراً للأمام',
          'عدم الحصول على نطاق حركة كامل',
          'السماح للركبة الأمامية بالانحناء للداخل',
          'الاستعجال في التكرارات'
        ],
        [
          'Keep your torso upright',
          'Control the descent',
          'Push through your front heel',
          'Start light to master the form'
        ],
        [
          'حافظ على جذعك منتصباً',
          'تحكم في النزول',
          'ادفع من خلال كعبك الأمامي',
          'ابدأ خفيفاً لإتقان الشكل'
        ],
        ['Lunges', 'Step-Ups', 'Single-Leg Leg Press'],
        ['طعن', 'صعود الدرج', 'ضغط الأرجل أحادي الرجل'],
        '/assets/gym/day6/Bulgarian Split Squat.png'
      ),
      createExercise(
        26,
        'Hip Thrust',
        'دفعة الورك',
        3,
        '8-10',
        '90 sec',
        'Glutes',
        'أرداف',
        ['Hamstrings'],
        ['عضلات الفخذ الخلفية'],
        'Intermediate',
        'Barbell, Bench',
        'باربل، بنش',
        'The hip thrust is the premier glute builder. It provides heavy loading for the glutes with minimal lower back stress.',
        'دفعة الورك هي أفضل تمرين لبناء الأرداف. يوفر تحميلاً ثقيلاً للأرداف مع ضغط بسيط على أسفل الظهر.',
        [
          'Sit on the floor with your upper back against a bench',
          'Roll a barbell over your hips',
          'Drive through your heels to lift your hips',
          'Squeeze your glutes hard at the top',
          'Lower with control'
        ],
        [
          'اجلس على الأرض وظهرك العلوي على بنش',
          'لف باربل على وركك',
          'ادفع من خلال كعبيك لرفع وركك',
          'اضغط أردافك بقوة في الأعلى',
          'أنزل بتحكم'
        ],
        [
          'Not getting full hip extension at the top',
          'Looking up instead of keeping chin tucked',
          'Pushing through toes instead of heels',
          'Using too much weight with poor form'
        ],
        [
          'عدم الحصول على مد ورك كامل في الأعلى',
          'النظر لأعلى بدلاً من وضع الذقن للصدر',
          'الدفع من خلال أصابع القدم بدلاً من الكعبين',
          'استخدام وزن ثقيل جداً مع شكل سيء'
        ],
        [
          'Squeeze your glutes hard at the top',
          'Keep your chin tucked to your chest',
          'Drive through your heels',
          'Use a pad or mat to protect your hips'
        ],
        [
          'اضغط أردافك بقوة في الأعلى',
          'حافظ على ذقنك للصدر',
          'ادفع من خلال كعبيك',
          'استخدم وسادة لحماية وركك'
        ],
        ['Glute Bridge', 'Romanian Deadlift', 'Cable Pull-Through'],
        ['جسر الأرداف', 'الرفعة الميتة الرومانية', 'السحب بالكابل'],
        '/assets/gym/day6/Hip Thrust.png'
      ),
      createExercise(
        27,
        'Seated Calf Raise',
        'رفع الساق جالساً',
        4,
        '15',
        '60 sec',
        'Calves',
        'بطة الساق',
        [],
        [],
        'Beginner',
        'Seated Calf Raise Machine',
        'ماكينة رفع الساق جالساً',
        'The seated calf raise targets the soleus muscle, which lies beneath the gastrocnemius. This exercise builds calf size from a different angle.',
        'رفع الساق جالساً يستهدف عضلة السوليوس، التي تقع تحت عضلة البطة الكبرى. هذا التمرين يبني حجم الساق من زاوية مختلفة.',
        [
          'Sit in the machine with your knees under the pads',
          'Place the balls of your feet on the platform',
          'Release the safety and lower your heels',
          'Push up onto your toes as high as possible',
          'Squeeze your calves at the top',
          'Lower slowly'
        ],
        [
          'اجلس في الماكينة وركباك تحت الوسائد',
          'ضع كرات قدميك على المنصة',
          'افتح الأمان وأنزل كعبيك',
          'ارفع على أصابع قدميك لأعلى قدر المستطاع',
          'اضغط عضلات ساقك في الأعلى',
          'أنزل ببطء'
        ],
        [
          'Using momentum to bounce',
          'Not getting a full stretch at the bottom',
          'Rushing through reps',
          'Using too much weight with poor range'
        ],
        [
          'استخدام الزخم للارتداد',
          'عدم الحصول على مد كامل في الأسفل',
          'الاستعجال في التكرارات',
          'استخدام وزن ثقيل جداً مع نطاق ضعيف'
        ],
        [
          'Control the movement throughout',
          'Get a full stretch at the bottom',
          'Pause briefly at the top',
          'Focus on the squeeze'
        ],
        [
          'تحكم في الحركة طوال الوقت',
          'احصل على مد كامل في الأسفل',
          'توقف قليلاً في الأعلى',
          'ركز على الضغط'
        ],
        ['Standing Calf Raise', 'Donkey Calf Raise', 'Tibialis Raise'],
        ['رفع الساق واقفاً', 'رفع الساق بالحمار', 'رفع قصبة الساق'],
        '/assets/gym/day6/Seated Calf Raise.png'
      )
    ]
  },
  {
    id: 7,
    name: 'Day 7',
    focus: 'Rest',
    isRestDay: true,
    exercises: []
  }
];

export const getWorkoutDay = (id: number): WorkoutDay | undefined => {
  return WORKOUT_DAYS.find(day => day.id === id);
};

export const getExercise = (id: number): Exercise | undefined => {
  for (const day of WORKOUT_DAYS) {
    const exercise = day.exercises.find(ex => ex.id === id);
    if (exercise) return exercise;
  }
  return undefined;
};

export const getAllExercises = (): Exercise[] => {
  return WORKOUT_DAYS.flatMap(day => day.exercises);
};
