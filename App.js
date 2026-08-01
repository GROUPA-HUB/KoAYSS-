// App.js
// KoAYSS — Sudan Healthcare App
// Expo / React Native
//
// Required Expo packages:
// npx expo install expo-location react-native-maps
//
// This version includes:
// - Arabic-first interface + Arabic/English switch
// - User registration + Guest mode
// - Blood group / age / conditions / allergies / other information
// - Personal health profile
// - Nearby hospitals, clinics and pharmacies on a real map
// - OpenStreetMap/Overpass nearby-health-facility search
// - Prescription medicine locator interface
// - Vaccination recommendations based on age
// - Location-based health alerts structure
// - Infectious disease information
// - First aid
// - Emergency numbers
// - Medication and vaccination reminders
// - EHR interface
// - Doctor consultation interface
// - Sudan-focused design

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  Linking,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const TEAL = '#0798A6';
const DARK_TEAL = '#087A87';
const NAVY = '#07556B';
const ORANGE = '#F59A35';
const BG = '#F8F8F3';
const WHITE = '#FFFFFF';
const TEXT = '#173C46';
const MUTED = '#75909A';
const BORDER = '#E5E8E6';

const STRINGS = {
  ar: {
    welcome: 'مرحباً بك!',
    subtitle: 'كيف يمكننا مساعدتك اليوم؟',
    start: 'ابدأ الآن',
    login: 'تسجيل دخول',
    guest: 'الدخول كضيف',
    language: 'English',
    home: 'الرئيسية',
    health: 'سجل صحي',
    favorites: 'المفضلة',
    more: 'المزيد',
    nearby: 'أقرب المستشفيات والمراكز',
    search: 'ابحث عن مستشفى أو مركز أو صيدلية',
    morePlaces: 'عرض المزيد',
    infectious: 'الأمراض المعدية',
    doctors: 'طبيب أونلاين',
    vaccines: 'التطعيمات',
    emergency: 'الحالات الطارئة',
    hospitals: 'المستشفيات',
    firstAid: 'الإسعافات الأولية',
    reminders: 'التنبيهات الصحية',
    healthEducation: 'التوعية الصحية',
    emergencyNumbers: 'أرقام الطوارئ',
    chronic: 'الأمراض المزمنة',
    prescription: 'الوصفة الطبية',
    profile: 'ملفي الصحي',
    medications: 'الأدوية',
    appointments: 'المواعيد',
    map: 'الخريطة',
    back: 'رجوع',
    save: 'حفظ',
    next: 'التالي',
    skip: 'تخطي',
    age: 'العمر',
    blood: 'فصيلة الدم',
    conditions: 'الأمراض المزمنة',
    allergies: 'الحساسيات',
    other: 'أخرى',
    otherPlaceholder: 'اكتب أي معلومات إضافية',
    select: 'اختر',
    guestWarning:
      'يمكنك استخدام التطبيق كضيف، لكن بعض خدمات السجل الصحي تحتاج إلى حساب.',
    location: 'موقعك الحالي',
    allowLocation: 'السماح بالوصول إلى الموقع',
    locationDenied: 'لم يتم السماح بالوصول إلى الموقع.',
    loading: 'جاري البحث عن الأماكن القريبة...',
    noPlaces: 'لم يتم العثور على أماكن قريبة.',
    pharmacy: 'صيدلية',
    hospital: 'مستشفى',
    clinic: 'مركز صحي',
    openMap: 'فتح الاتجاهات',
    vaccinationTitle: 'جدول التطعيمات',
    vaccinationSubtitle:
      'يتم اقتراح التطعيمات حسب العمر، ويمكن إضافة تنبيهات صحية مرتبطة بالمنطقة.',
    ageBased: 'حسب العمر',
    regionalAlerts: 'تنبيهات المنطقة',
    noAlerts: 'لا توجد تنبيهات مسجلة حالياً.',
    medicineLocator: 'البحث عن الدواء',
    uploadPrescription: 'إضافة وصفة طبية',
    medicineName: 'اسم الدواء',
    findPharmacies: 'البحث عن الصيدليات المتوفرة',
    prescriptionNote:
      'في النسخة المتصلة بقاعدة بيانات الصيدليات، ستظهر الصيدليات التي لديها الدواء متوفراً.',
    ehrTitle: 'السجل الصحي الإلكتروني',
    ehrNote:
      'تتم إضافة البيانات الصحية بعد الفحص الشامل في مركز صحي معتمد، وبعد موافقة المستخدم.',
    healthCenter: 'المركز الصحي',
    medicalHistory: 'التاريخ المرضي',
    tests: 'نتائج الفحوصات',
    doctorAccess: 'السماح للطبيب بالوصول',
    consultation: 'استشارة طبيب',
    chooseSpecialty: 'اختر التخصص',
    requestDoctor: 'طلب استشارة',
    firstAidTitle: 'الإسعافات الأولية',
    diabetes: 'طوارئ السكري',
    hypertension: 'طوارئ ارتفاع ضغط الدم',
    burns: 'الحروق',
    bleeding: 'النزيف',
    choking: 'الاختناق',
    fainting: 'الإغماء',
    diseaseTitle: 'الأمراض المعدية',
    prevention: 'الوقاية',
    symptoms: 'الأعراض',
    remindersTitle: 'التذكيرات',
    addReminder: 'إضافة تذكير',
    medicationReminder: 'تذكير دواء',
    vaccineReminder: 'تذكير تطعيم',
    appointmentReminder: 'تذكير موعد',
    emergencyCall: 'اتصال بالطوارئ',
    confirmCall: 'هل تريد الاتصال بهذا الرقم؟',
    cancel: 'إلغاء',
    call: 'اتصال',
    healthInfo: 'المعلومات الصحية',
    noData: 'لا توجد بيانات بعد',
    add: 'إضافة',
    logout: 'تسجيل الخروج',
    name: 'الاسم',
    namePlaceholder: 'اكتب اسمك',
    region: 'الولاية / المنطقة',
    selectRegion: 'اختر المنطقة',
    continue: 'متابعة',
    profileSaved: 'تم حفظ معلوماتك الصحية',
  },

  en: {
    welcome: 'Welcome!',
    subtitle: 'How can we help you today?',
    start: 'Get Started',
    login: 'Sign In',
    guest: 'Continue as Guest',
    language: 'العربية',
    home: 'Home',
    health: 'Health Record',
    favorites: 'Favorites',
    more: 'More',
    nearby: 'Nearby Hospitals & Centers',
    search: 'Search hospital, center or pharmacy',
    morePlaces: 'View More',
    infectious: 'Infectious Diseases',
    doctors: 'Online Doctor',
    vaccines: 'Vaccinations',
    emergency: 'Emergency',
    hospitals: 'Hospitals',
    firstAid: 'First Aid',
    reminders: 'Health Reminders',
    healthEducation: 'Health Education',
    emergencyNumbers: 'Emergency Numbers',
    chronic: 'Chronic Conditions',
    prescription: 'Prescription',
    profile: 'My Health Profile',
    medications: 'Medications',
    appointments: 'Appointments',
    map: 'Map',
    back: 'Back',
    save: 'Save',
    next: 'Next',
    skip: 'Skip',
    age: 'Age',
    blood: 'Blood Group',
    conditions: 'Chronic Conditions',
    allergies: 'Allergies',
    other: 'Other',
    otherPlaceholder: 'Enter additional information',
    select: 'Select',
    guestWarning:
      'You can use the app as a guest, but some health-record services require an account.',
    location: 'Your current location',
    allowLocation: 'Allow Location Access',
    locationDenied: 'Location access was not granted.',
    loading: 'Searching for nearby places...',
    noPlaces: 'No nearby places found.',
    pharmacy: 'Pharmacy',
    hospital: 'Hospital',
    clinic: 'Health Center',
    openMap: 'Get Directions',
    vaccinationTitle: 'Vaccination Schedule',
    vaccinationSubtitle:
      'Vaccinations are suggested by age, with regional health alerts added when available.',
    ageBased: 'Age-based',
    regionalAlerts: 'Regional Alerts',
    noAlerts: 'No regional alerts are currently registered.',
    medicineLocator: 'Medicine Locator',
    uploadPrescription: 'Add Prescription',
    medicineName: 'Medicine name',
    findPharmacies: 'Find Available Pharmacies',
    prescriptionNote:
      'When connected to pharmacy inventory, pharmacies with available medicine will appear here.',
    ehrTitle: 'Electronic Health Record',
    ehrNote:
      'Health information can be added after a comprehensive check-up at an approved health center with user permission.',
    healthCenter: 'Health Center',
    medicalHistory: 'Medical History',
    tests: 'Test Results',
    doctorAccess: 'Allow Doctor Access',
    consultation: 'Doctor Consultation',
    chooseSpecialty: 'Choose Specialty',
    requestDoctor: 'Request Consultation',
    firstAidTitle: 'First Aid',
    diabetes: 'Diabetes Emergency',
    hypertension: 'Hypertension Emergency',
    burns: 'Burns',
    bleeding: 'Bleeding',
    choking: 'Choking',
    fainting: 'Fainting',
    diseaseTitle: 'Infectious Diseases',
    prevention: 'Prevention',
    symptoms: 'Symptoms',
    remindersTitle: 'Reminders',
    addReminder: 'Add Reminder',
    medicationReminder: 'Medication Reminder',
    vaccineReminder: 'Vaccination Reminder',
    appointmentReminder: 'Appointment Reminder',
    emergencyCall: 'Emergency Call',
    confirmCall: 'Do you want to call this number?',
    cancel: 'Cancel',
    call: 'Call',
    healthInfo: 'Health Information',
    noData: 'No data yet',
    add: 'Add',
    logout: 'Log Out',
    name: 'Name',
    namePlaceholder: 'Enter your name',
    region: 'State / Region',
    selectRegion: 'Select region',
    continue: 'Continue',
    profileSaved: 'Your health information has been saved',
  },
};

const REGIONS = [
  'الخرطوم',
  'الجزيرة',
  'البحر الأحمر',
  'كسلا',
  'القضارف',
  'سنار',
  'النيل الأزرق',
  'النيل الأبيض',
  'نهر النيل',
  'الشمالية',
  'شمال كردفان',
  'جنوب كردفان',
  'غرب كردفان',
  'شمال دارفور',
  'جنوب دارفور',
  'غرب دارفور',
  'وسط دارفور',
  'شرق دارفور',
];

const CONDITIONS = [
  'السكري',
  'ارتفاع ضغط الدم',
  'الربو',
  'أمراض القلب',
  'أمراض الكلى',
  'أمراض الكبد',
  'أمراض أخرى',
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DISEASES = [
  {
    ar: 'الملاريا',
    en: 'Malaria',
    symptomsAr: 'حمى، قشعريرة، صداع، تعب وآلام عضلية.',
    symptomsEn: 'Fever, chills, headache, fatigue and muscle aches.',
    preventionAr: 'تجنب لدغات البعوض واستخدم الناموسيات والمواد الطاردة.',
    preventionEn:
      'Avoid mosquito bites and use bed nets and insect repellents.',
  },
  {
    ar: 'حمى الضنك',
    en: 'Dengue Fever',
    symptomsAr: 'حمى، صداع شديد، آلام عضلية ومفصلية وقد يظهر طفح جلدي.',
    symptomsEn:
      'Fever, severe headache, muscle and joint pain, sometimes rash.',
    preventionAr: 'تجنب لدغات البعوض والتخلص من المياه الراكدة.',
    preventionEn: 'Avoid mosquito bites and remove standing water.',
  },
  {
    ar: 'الكوليرا',
    en: 'Cholera',
    symptomsAr: 'إسهال مائي شديد وقد يؤدي إلى الجفاف بسرعة.',
    symptomsEn: 'Severe watery diarrhea that can rapidly cause dehydration.',
    preventionAr: 'المياه النظيفة وغسل اليدين والطعام الآمن.',
    preventionEn: 'Safe water, hand hygiene and safe food.',
  },
  {
    ar: 'الحصبة',
    en: 'Measles',
    symptomsAr: 'حمى، سعال، رشح، احمرار العينين وطفح جلدي.',
    symptomsEn: 'Fever, cough, runny nose, red eyes and rash.',
    preventionAr: 'التطعيم وتجنب مخالطة الحالات المصابة.',
    preventionEn:
      'Vaccination and avoiding close contact with infected people.',
  },
];

const VACCINES = [
  {
    age: 0,
    titleAr: 'تطعيمات حديثي الولادة',
    titleEn: 'Newborn Vaccinations',
    descAr: 'تُحدد حسب البرنامج الوطني للتطعيمات وتعليمات المركز الصحي.',
    descEn:
      'Follow the national immunization schedule and health-center guidance.',
  },
  {
    age: 2,
    titleAr: 'تطعيمات الطفولة المبكرة',
    titleEn: 'Early Childhood Vaccinations',
    descAr: 'التطعيمات المقررة حسب العمر والبرنامج الوطني.',
    descEn: 'Vaccinations scheduled according to age and national guidance.',
  },
  {
    age: 12,
    titleAr: 'تطعيمات الأطفال',
    titleEn: 'Childhood Vaccinations',
    descAr: 'تحقق من الجرعات المطلوبة حسب السجل الصحي.',
    descEn: "Check required doses against the child's health record.",
  },
  {
    age: 18,
    titleAr: 'تطعيمات المراهقين',
    titleEn: 'Adolescent Vaccinations',
    descAr: 'تختلف حسب العمر والبرنامج الوطني والحالة الصحية.',
    descEn: 'May vary according to age, national schedule and health status.',
  },
  {
    age: 19,
    titleAr: 'تطعيمات البالغين',
    titleEn: 'Adult Vaccinations',
    descAr: 'تحقق من اللقاحات المطلوبة حسب التاريخ الصحي والسفر.',
    descEn: 'Check vaccinations according to health history and travel needs.',
  },
];

const FIRST_AID = [
  {
    key: 'bleeding',
    icon: '🩸',
    ar: 'النزيف',
    en: 'Bleeding',
    stepsAr: [
      'اضغط مباشرة على مكان النزيف بقطعة قماش نظيفة.',
      'استمر بالضغط ولا ترفع القماش بشكل متكرر.',
      'اطلب المساعدة الطبية عند النزيف الشديد أو المستمر.',
    ],
    stepsEn: [
      'Apply direct pressure with clean cloth or dressing.',
      'Keep pressure on the wound.',
      'Seek urgent medical care for severe or persistent bleeding.',
    ],
  },
  {
    key: 'burns',
    icon: '🔥',
    ar: 'الحروق',
    en: 'Burns',
    stepsAr: [
      'أبعد مصدر الحرارة عن المصاب.',
      'برّد المنطقة بماء جارٍ فاتر أو بارد لمدة مناسبة.',
      'لا تضع الثلج أو المواد المنزلية على الحرق.',
    ],
    stepsEn: [
      'Remove the person from the heat source.',
      'Cool the burn with cool running water.',
      'Do not apply ice or household substances.',
    ],
  },
  {
    key: 'choking',
    icon: '🫁',
    ar: 'الاختناق',
    en: 'Choking',
    stepsAr: [
      'إذا كان الشخص يستطيع السعال، شجعه على السعال.',
      'إذا كان الاختناق شديداً، اطلب الطوارئ فوراً.',
      'استخدم إسعافات الاختناق المناسبة حسب عمر المصاب وتدريبك.',
    ],
    stepsEn: [
      'If the person can cough, encourage coughing.',
      'For severe choking, call emergency services immediately.',
      'Use age-appropriate choking first aid if trained.',
    ],
  },
  {
    key: 'fainting',
    icon: '🧍',
    ar: 'الإغماء',
    en: 'Fainting',
    stepsAr: [
      'ضع الشخص في مكان آمن وتأكد من التنفس.',
      'اجعله مستلقياً وراقب حالته.',
      'اطلب المساعدة إذا لم يستعد وعيه بسرعة أو ظهرت أعراض خطيرة.',
    ],
    stepsEn: [
      'Move the person to a safe place and check breathing.',
      'Keep them lying down and monitor them.',
      'Seek urgent help if consciousness does not return promptly.',
    ],
  },
  {
    key: 'diabetes',
    icon: '🩸',
    ar: 'طوارئ السكري',
    en: 'Diabetes Emergency',
    stepsAr: [
      'إذا كان الشخص واعياً وقادراً على البلع، افحص السكر إن أمكن.',
      'عند الاشتباه بانخفاض السكر، اتبع خطة العلاج التي وصفها الطبيب.',
      'اطلب الطوارئ عند فقدان الوعي أو عدم القدرة على البلع.',
    ],
    stepsEn: [
      'If conscious and able to swallow, check glucose if possible.',
      "For suspected low glucose, follow the person's prescribed plan.",
      'Call emergency services for unconsciousness or inability to swallow.',
    ],
  },
  {
    key: 'hypertension',
    icon: '❤️',
    ar: 'طوارئ ارتفاع ضغط الدم',
    en: 'Hypertension Emergency',
    stepsAr: [
      'اجلس بهدوء وأعد قياس الضغط إذا كان الجهاز متاحاً.',
      'لا تضاعف جرعة الدواء دون تعليمات طبية.',
      'ألم الصدر أو ضيق التنفس أو ضعف مفاجئ يستدعي الطوارئ فوراً.',
    ],
    stepsEn: [
      'Sit calmly and repeat the blood pressure reading if available.',
      'Do not double medication doses without medical advice.',
      'Chest pain, breathing difficulty or sudden weakness needs emergency care.',
    ],
  },
];

const EMERGENCY = [
  { titleAr: 'الإسعاف', titleEn: 'Ambulance', number: '123', icon: '🚑' },
  { titleAr: 'الشرطة', titleEn: 'Police', number: '999', icon: '👮' },
  {
    titleAr: 'الدفاع المدني',
    titleEn: 'Civil Defense',
    number: '998',
    icon: '🚒',
  },
];

function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function IconButton({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.serviceButton} onPress={onPress}>
      <Text style={styles.serviceIcon}>{icon}</Text>
      <Text style={styles.serviceText}>{label}</Text>
    </TouchableOpacity>
  );
}

function Header({ title, onBack, lang, setLang }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.headerSide}>
        <Text style={styles.headerBack}>{lang === 'ar' ? '→' : '←'}</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>{title}</Text>

      <TouchableOpacity
        onPress={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        style={styles.languageSmall}>
        <Text style={styles.languageSmallText}>
          {lang === 'ar' ? 'EN' : 'ع'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [lang, setLang] = useState('ar');
  const [screen, setScreen] = useState('welcome');
  const [user, setUser] = useState({
    name: '',
    age: '',
    blood: '',
    conditions: [],
    allergies: '',
    other: '',
    region: '',
    guest: false,
  });

  const t = STRINGS[lang];
  const rtl = lang === 'ar';

  const navigate = (next) => setScreen(next);

  if (screen === 'welcome') {
    return (
      <Welcome
        lang={lang}
        setLang={setLang}
        t={t}
        onStart={() => setScreen('profileSetup')}
        onGuest={() => {
          setUser((p) => ({ ...p, guest: true }));
          setScreen('home');
        }}
      />
    );
  }

  if (screen === 'profileSetup') {
    return (
      <ProfileSetup
        lang={lang}
        setLang={setLang}
        t={t}
        user={user}
        setUser={setUser}
        onSave={() => {
          Alert.alert(t.profileSaved);
          setScreen('home');
        }}
      />
    );
  }

  const screens = {
    home: (
      <Home
        t={t}
        lang={lang}
        setLang={setLang}
        user={user}
        navigate={navigate}
      />
    ),
    nearby: (
      <Nearby
        t={t}
        lang={lang}
        setLang={setLang}
        onBack={() => navigate('home')}
      />
    ),
    vaccines: (
      <Vaccinations
        t={t}
        lang={lang}
        setLang={setLang}
        user={user}
        onBack={() => navigate('home')}
      />
    ),
    diseases: (
      <Diseases
        t={t}
        lang={lang}
        setLang={setLang}
        onBack={() => navigate('home')}
      />
    ),
    firstAid: (
      <FirstAid
        t={t}
        lang={lang}
        setLang={setLang}
        onBack={() => navigate('home')}
      />
    ),
    emergency: (
      <Emergency
        t={t}
        lang={lang}
        setLang={setLang}
        onBack={() => navigate('home')}
      />
    ),
    prescription: (
      <Prescription
        t={t}
        lang={lang}
        setLang={setLang}
        onBack={() => navigate('home')}
      />
    ),
    healthRecord: (
      <HealthRecord
        t={t}
        lang={lang}
        setLang={setLang}
        user={user}
        onBack={() => navigate('home')}
      />
    ),
    doctors: (
      <Doctors
        t={t}
        lang={lang}
        setLang={setLang}
        onBack={() => navigate('home')}
      />
    ),
    reminders: (
      <Reminders
        t={t}
        lang={lang}
        setLang={setLang}
        onBack={() => navigate('home')}
      />
    ),
    education: (
      <Education
        t={t}
        lang={lang}
        setLang={setLang}
        onBack={() => navigate('home')}
      />
    ),
    profile: (
      <Profile
        t={t}
        lang={lang}
        setLang={setLang}
        user={user}
        setUser={setUser}
        onBack={() => navigate('home')}
      />
    ),
  };

  return (
    <View style={styles.app}>
      {screens[screen] || screens.home}

      {screen !== 'welcome' &&
        screen !== 'profileSetup' &&
        screen !== 'nearby' &&
        screen !== 'vaccines' &&
        screen !== 'diseases' &&
        screen !== 'firstAid' &&
        screen !== 'emergency' &&
        screen !== 'prescription' &&
        screen !== 'healthRecord' &&
        screen !== 'doctors' &&
        screen !== 'reminders' &&
        screen !== 'education' &&
        screen !== 'profile' && (
          <BottomNav t={t} screen={screen} navigate={navigate} />
        )}
    </View>
  );
}

/* ========================= WELCOME ========================= */

function Welcome({ lang, setLang, t, onStart, onGuest }) {
  return (
    <View style={styles.welcome}>
      <TouchableOpacity
        style={styles.topLanguage}
        onPress={() => setLang(lang === 'ar' ? 'en' : 'ar')}>
        <Text style={styles.topLanguageText}>
          {lang === 'ar' ? 'EN' : 'عربي'}
        </Text>
      </TouchableOpacity>

      <View style={styles.logoCircle}>
        <Text style={styles.logoHeart}>♥</Text>
        <Text style={styles.logoCheck}>✓</Text>
      </View>

      <Text style={styles.logoText}>
        K<Text style={styles.logoSmile}>☺</Text>AYSS
      </Text>

      <Text style={styles.logoArabic}>كويـس</Text>

      <Text style={styles.good}>GOOD</Text>

      <Text style={styles.welcomeSlogan}>
        {lang === 'ar' ? 'صحتك في يدك' : 'Your health in your hand'}
      </Text>

      <TouchableOpacity style={styles.mainButton} onPress={onStart}>
        <Text style={styles.mainButtonText}>{t.start}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.textButton} onPress={onGuest}>
        <Text style={styles.textButtonText}>{t.guest}</Text>
      </TouchableOpacity>

      <Text style={styles.sudanText}>Sudan Healthcare Platform</Text>
    </View>
  );
}

/* ========================= PROFILE SETUP ========================= */

function ProfileSetup({ lang, setLang, t, user, setUser, onSave }) {
  const [selectedConditions, setSelectedConditions] = useState(
    user.conditions || []
  );

  const toggleCondition = (condition) => {
    setSelectedConditions((old) =>
      old.includes(condition)
        ? old.filter((x) => x !== condition)
        : [...old, condition]
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.formContainer}>
      <View style={styles.formTop}>
        <TouchableOpacity
          style={styles.languageSmall}
          onPress={() => setLang(lang === 'ar' ? 'en' : 'ar')}>
          <Text style={styles.languageSmallText}>
            {lang === 'ar' ? 'EN' : 'ع'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.bigTitle}>
        {lang === 'ar' ? 'معلوماتك الصحية' : 'Your Health Information'}
      </Text>

      <Text style={styles.description}>
        {lang === 'ar'
          ? 'أدخل معلوماتك الأساسية لتخصيص الخدمات الصحية لك.'
          : 'Enter basic information to personalize your healthcare services.'}
      </Text>

      <Field
        label={t.name}
        value={user.name}
        placeholder={t.namePlaceholder}
        onChangeText={(v) => setUser({ ...user, name: v })}
      />

      <Field
        label={t.age}
        value={user.age}
        placeholder="18"
        keyboardType="numeric"
        onChangeText={(v) => setUser({ ...user, age: v })}
      />

      <Text style={styles.fieldLabel}>{t.blood}</Text>

      <View style={styles.optionsWrap}>
        {BLOOD_TYPES.map((blood) => (
          <TouchableOpacity
            key={blood}
            style={[
              styles.option,
              user.blood === blood && styles.optionSelected,
            ]}
            onPress={() => setUser({ ...user, blood })}>
            <Text
              style={[
                styles.optionText,
                user.blood === blood && styles.optionTextSelected,
              ]}>
              {blood}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.fieldLabel}>{t.conditions}</Text>

      <View style={styles.optionsWrap}>
        {CONDITIONS.map((condition) => (
          <TouchableOpacity
            key={condition}
            style={[
              styles.conditionOption,
              selectedConditions.includes(condition) && styles.optionSelected,
            ]}
            onPress={() => toggleCondition(condition)}>
            <Text
              style={[
                styles.optionText,
                selectedConditions.includes(condition) &&
                  styles.optionTextSelected,
              ]}>
              {condition}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Field
        label={t.allergies}
        value={user.allergies}
        placeholder={lang === 'ar' ? 'مثال: البنسلين' : 'Example: Penicillin'}
        onChangeText={(v) => setUser({ ...user, allergies: v })}
      />

      <Field
        label={t.other}
        value={user.other}
        placeholder={t.otherPlaceholder}
        multiline
        onChangeText={(v) => setUser({ ...user, other: v })}
      />

      <Text style={styles.fieldLabel}>{t.region}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 10 }}>
        {REGIONS.map((region) => (
          <TouchableOpacity
            key={region}
            style={[
              styles.regionOption,
              user.region === region && styles.optionSelected,
            ]}
            onPress={() => setUser({ ...user, region })}>
            <Text
              style={[
                styles.optionText,
                user.region === region && styles.optionTextSelected,
              ]}>
              {region}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.mainButton}
        onPress={() =>
          onSave({
            ...user,
            conditions: selectedConditions,
          })
        }>
        <Text style={styles.mainButtonText}>{t.save}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType,
  multiline,
}) {
  return (
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#A7B7BA"
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );
}

/* ========================= HOME ========================= */

function Home({ t, lang, setLang, user, navigate }) {
  return (
    <View style={styles.app}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.homeHeader}>
          <View>
            <Text style={styles.locationText}>
              📍 {user.region || 'الخرطوم'} · السودان
            </Text>
            <Text style={styles.homeWelcome}>
              {t.welcome} {user.name || ''}!
            </Text>
            <Text style={styles.homeSubtitle}>{t.subtitle}</Text>
          </View>

          <TouchableOpacity
            style={styles.bell}
            onPress={() => navigate('reminders')}>
            <Text style={{ fontSize: 23 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            placeholder={t.search}
            placeholderTextColor={MUTED}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.servicesGrid}>
          <IconButton
            icon="🦠"
            label={t.infectious}
            onPress={() => navigate('diseases')}
          />

          <IconButton
            icon="👨‍⚕️"
            label={t.doctors}
            onPress={() => navigate('doctors')}
          />

          <IconButton
            icon="🏥"
            label={t.hospitals}
            onPress={() => navigate('nearby')}
          />

          <IconButton
            icon="💉"
            label={t.vaccines}
            onPress={() => navigate('vaccines')}
          />

          <IconButton
            icon="🚨"
            label={t.emergency}
            onPress={() => navigate('emergency')}
          />

          <IconButton
            icon="🩹"
            label={t.firstAid}
            onPress={() => navigate('firstAid')}
          />

          <IconButton
            icon="💊"
            label={t.prescription}
            onPress={() => navigate('prescription')}
          />

          <IconButton
            icon="📋"
            label={t.health}
            onPress={() => navigate('healthRecord')}
          />

          <IconButton
            icon="📚"
            label={t.healthEducation}
            onPress={() => navigate('education')}
          />

          <IconButton
            icon="☎️"
            label={t.emergencyNumbers}
            onPress={() => navigate('emergency')}
          />
        </View>

        <TouchableOpacity
          style={styles.emergencyBanner}
          onPress={() => navigate('emergency')}>
          <View>
            <Text style={styles.emergencyBannerTitle}>🚨 {t.emergency}</Text>
            <Text style={styles.emergencyBannerText}>
              {lang === 'ar'
                ? 'الوصول السريع إلى المساعدة'
                : 'Quick access to emergency support'}
            </Text>
          </View>
          <Text style={styles.bannerArrow}>{lang === 'ar' ? '←' : '→'}</Text>
        </TouchableOpacity>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>{t.nearby}</Text>
          <TouchableOpacity onPress={() => navigate('nearby')}>
            <Text style={styles.moreText}>{t.morePlaces}</Text>
          </TouchableOpacity>
        </View>

        <NearbyPreview t={t} navigate={navigate} />
      </ScrollView>

      <BottomNav t={t} screen="home" navigate={navigate} />
    </View>
  );
}

/* ========================= NEARBY MAP ========================= */

function NearbyPreview({ t, navigate }) {
  return (
    <Card>
      <View style={styles.previewMap}>
        <Text style={{ fontSize: 42 }}>📍</Text>
        <Text style={styles.previewMapText}>{t.location}</Text>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => navigate('nearby')}>
          <Text style={styles.smallButtonText}>{t.map}</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

function Nearby({ t, lang, setLang, onBack }) {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const searchOSM = useCallback(async (lat, lon) => {
    try {
      const radius = 10000;

      const queryOverpass = `
        [out:json][timeout:20];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lon});
          way["amenity"="hospital"](around:${radius},${lat},${lon});
          node["amenity"="clinic"](around:${radius},${lat},${lon});
          way["amenity"="clinic"](around:${radius},${lat},${lon});
          node["amenity"="pharmacy"](around:${radius},${lat},${lon});
          way["amenity"="pharmacy"](around:${radius},${lat},${lon});
        );
        out center tags;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'data=' + encodeURIComponent(queryOverpass),
      });

      const data = await response.json();

      const converted = (data.elements || [])
        .map((item, index) => {
          const latitude = item.lat || item.center?.lat;
          const longitude = item.lon || item.center?.lon;

          if (!latitude || !longitude) return null;

          const amenity = item.tags?.amenity;

          return {
            id: String(item.id || index),
            name:
              item.tags?.name ||
              (amenity === 'pharmacy'
                ? 'Pharmacy'
                : amenity === 'hospital'
                ? 'Hospital'
                : 'Health Center'),
            type: amenity,
            latitude,
            longitude,
            address:
              item.tags?.['addr:street'] || item.tags?.['addr:city'] || 'Sudan',
          };
        })
        .filter(Boolean);

      setPlaces(converted.length ? converted : getFallbackPlaces());
    } catch (error) {
      setPlaces(getFallbackPlaces());
    }
  }, []);

  const getNearbyPlaces = useCallback(async () => {
    setLoading(true);

    try {
      let current;

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status === 'granted') {
        current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const coords = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        };

        setLocation(coords);
        await searchOSM(coords.latitude, coords.longitude);
      } else {
        // Default location: Khartoum
        const fallback = {
          latitude: 15.5007,
          longitude: 32.5599,
        };

        setLocation(fallback);
        await searchOSM(fallback.latitude, fallback.longitude);
      }
    } catch (error) {
      const fallback = {
        latitude: 15.5007,
        longitude: 32.5599,
      };

      setLocation(fallback);
      setPlaces(getFallbackPlaces());
    }

    setLoading(false);
  }, [searchOSM]);

  useEffect(() => {
    getNearbyPlaces();
  }, [getNearbyPlaces]);

  const filteredPlaces = places.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.app}>
      <Header title={t.nearby} onBack={onBack} lang={lang} setLang={setLang} />

      <View style={styles.searchBoxMap}>
        <Text>⌕</Text>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder={t.search}
          placeholderTextColor={MUTED}
        />
      </View>

      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.12,
            longitudeDelta: 0.12,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}>
          <Marker coordinate={location} title={t.location} />

          {filteredPlaces.map((place) => (
            <Marker
              key={place.id}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              title={place.name}
              description={place.address}
            />
          ))}
        </MapView>
      )}

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={TEAL} />
          <Text style={styles.loadingText}>{t.loading}</Text>
        </View>
      )}

      <FlatList
        data={filteredPlaces.slice(0, 8)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <Card style={styles.placeCard}>
            <View style={styles.placeIcon}>
              <Text style={{ fontSize: 24 }}>
                {item.type === 'pharmacy' ? '💊' : '🏥'}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeType}>
                {item.type === 'pharmacy'
                  ? t.pharmacy
                  : item.type === 'hospital'
                  ? t.hospital
                  : t.clinic}
              </Text>
              <Text style={styles.placeAddress}>{item.address}</Text>
            </View>

            <TouchableOpacity
              style={styles.directionButton}
              onPress={() => openDirections(item.latitude, item.longitude)}>
              <Text style={styles.directionText}>↗</Text>
            </TouchableOpacity>
          </Card>
        )}
      />
    </View>
  );
}

function getFallbackPlaces() {
  return [
    {
      id: '1',
      name: 'Khartoum Teaching Hospital',
      type: 'hospital',
      latitude: 15.6002,
      longitude: 32.5308,
      address: 'Khartoum, Sudan',
    },
    {
      id: '2',
      name: 'Omdurman Hospital',
      type: 'hospital',
      latitude: 15.6466,
      longitude: 32.4777,
      address: 'Omdurman, Sudan',
    },
    {
      id: '3',
      name: 'Nearby Pharmacy',
      type: 'pharmacy',
      latitude: 15.505,
      longitude: 32.55,
      address: 'Khartoum, Sudan',
    },
  ];
}

function openDirections(latitude, longitude) {
  const url = Platform.select({
    ios: `maps://?daddr=${latitude},${longitude}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
    default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
  });

  Linking.openURL(url).catch(() => {});
}

/* ========================= VACCINATIONS ========================= */

function Vaccinations({ t, lang, setLang, user, onBack }) {
  const age = Number(user.age || 0);

  const recommended = VACCINES.filter((v, index) => {
    if (age === 0) return index === 0;
    if (age <= 2) return index <= 1;
    if (age <= 12) return index <= 2;
    if (age <= 18) return index <= 3;
    return index >= 3;
  });

  return (
    <View style={styles.app}>
      <Header
        title={t.vaccinationTitle}
        onBack={onBack}
        lang={lang}
        setLang={setLang}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ padding: 18, paddingBottom: 30 }}>
        <Card style={styles.infoCard}>
          <Text style={styles.infoIcon}>💉</Text>
          <Text style={styles.infoText}>{t.vaccinationSubtitle}</Text>
        </Card>

        <View style={styles.vaccineTabs}>
          <View style={styles.vaccineTabActive}>
            <Text style={styles.vaccineTabActiveText}>{t.ageBased}</Text>
          </View>

          <View style={styles.vaccineTab}>
            <Text style={styles.vaccineTabText}>{t.regionalAlerts}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          {lang === 'ar'
            ? `التطعيمات المناسبة لعمر ${age || 'غير محدد'}`
            : `Vaccinations for age ${age || 'not specified'}`}
        </Text>

        {recommended.map((v, index) => (
          <Card key={index}>
            <View style={styles.vaccineRow}>
              <View style={styles.vaccineIcon}>
                <Text style={{ fontSize: 25 }}>💉</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>
                  {lang === 'ar' ? v.titleAr : v.titleEn}
                </Text>
                <Text style={styles.cardDescription}>
                  {lang === 'ar' ? v.descAr : v.descEn}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.reminderButton}>
              <Text style={styles.reminderButtonText}>🔔 {t.addReminder}</Text>
            </TouchableOpacity>
          </Card>
        ))}

        <Card>
          <Text style={styles.cardTitle}>📍 {t.regionalAlerts}</Text>
          <Text style={styles.cardDescription}>
            {lang === 'ar'
              ? `المنطقة المحددة: ${user.region || 'لم يتم تحديد المنطقة'}`
              : `Selected region: ${user.region || 'Not selected'}`}
          </Text>

          <Text style={styles.warningText}>{t.noAlerts}</Text>
        </Card>
      </ScrollView>
    </View>
  );
}

/* ========================= DISEASES ========================= */

function Diseases({ t, lang, setLang, onBack }) {
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.app}>
      <Header
        title={t.diseaseTitle}
        onBack={onBack}
        lang={lang}
        setLang={setLang}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ padding: 18, paddingBottom: 30 }}>
        {DISEASES.map((disease, index) => (
          <TouchableOpacity key={index} onPress={() => setSelected(disease)}>
            <Card>
              <View style={styles.diseaseRow}>
                <Text style={styles.diseaseIcon}>🦠</Text>

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>
                    {lang === 'ar' ? disease.ar : disease.en}
                  </Text>
                  <Text style={styles.cardDescription}>
                    {lang === 'ar' ? disease.symptomsAr : disease.symptomsEn}
                  </Text>
                </View>

                <Text style={styles.arrow}>←</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!selected} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            {selected && (
              <>
                <Text style={styles.modalTitle}>
                  {lang === 'ar' ? selected.ar : selected.en}
                </Text>

                <Text style={styles.modalHeading}>{t.symptoms}</Text>
                <Text style={styles.modalText}>
                  {lang === 'ar' ? selected.symptomsAr : selected.symptomsEn}
                </Text>

                <Text style={styles.modalHeading}>{t.prevention}</Text>
                <Text style={styles.modalText}>
                  {lang === 'ar'
                    ? selected.preventionAr
                    : selected.preventionEn}
                </Text>

                <TouchableOpacity
                  style={styles.mainButton}
                  onPress={() => setSelected(null)}>
                  <Text style={styles.mainButtonText}>{t.back}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ========================= FIRST AID ========================= */

function FirstAid({ t, lang, setLang, onBack }) {
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.app}>
      <Header
        title={t.firstAidTitle}
        onBack={onBack}
        lang={lang}
        setLang={setLang}
      />

      <ScrollView style={styles.screen} contentContainerStyle={{ padding: 18 }}>
        <Card style={styles.warningCard}>
          <Text style={styles.warningTitle}>⚠️</Text>
          <Text style={styles.warningText}>
            {lang === 'ar'
              ? 'هذه إرشادات عامة ولا تستبدل التقييم الطبي. في الحالات الخطيرة اطلب الطوارئ.'
              : 'General guidance only. It does not replace medical assessment. Seek emergency help for serious cases.'}
          </Text>
        </Card>

        {FIRST_AID.map((item) => (
          <TouchableOpacity key={item.key} onPress={() => setSelected(item)}>
            <Card>
              <View style={styles.diseaseRow}>
                <Text style={styles.diseaseIcon}>{item.icon}</Text>
                <Text style={styles.cardTitle}>
                  {lang === 'ar' ? item.ar : item.en}
                </Text>
                <Text style={styles.arrow}>←</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!selected} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            {selected && (
              <>
                <Text style={styles.modalTitle}>
                  {selected.icon} {lang === 'ar' ? selected.ar : selected.en}
                </Text>

                {(lang === 'ar' ? selected.stepsAr : selected.stepsEn).map(
                  (step, index) => (
                    <View key={index} style={styles.stepRow}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.modalText}>{step}</Text>
                    </View>
                  )
                )}

                <TouchableOpacity
                  style={styles.mainButton}
                  onPress={() => setSelected(null)}>
                  <Text style={styles.mainButtonText}>{t.back}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ========================= EMERGENCY ========================= */

function Emergency({ t, lang, setLang, onBack }) {
  const callNumber = (number) => {
    Alert.alert(t.emergencyCall, `${t.confirmCall}\n${number}`, [
      {
        text: t.cancel,
        style: 'cancel',
      },
      {
        text: t.call,
        onPress: () => Linking.openURL(`tel:${number}`),
      },
    ]);
  };

  return (
    <View style={styles.app}>
      <Header
        title={t.emergencyNumbers}
        onBack={onBack}
        lang={lang}
        setLang={setLang}
      />

      <ScrollView style={styles.screen} contentContainerStyle={{ padding: 18 }}>
        <View style={styles.bigEmergency}>
          <Text style={styles.bigEmergencyIcon}>🚨</Text>
          <Text style={styles.bigEmergencyTitle}>{t.emergency}</Text>
          <Text style={styles.bigEmergencySubtitle}>
            {lang === 'ar'
              ? 'إذا كانت الحالة مهددة للحياة، اطلب المساعدة الطبية فوراً.'
              : 'For life-threatening situations, seek emergency medical help immediately.'}
          </Text>
        </View>

        {EMERGENCY.map((item) => (
          <TouchableOpacity
            key={item.number}
            style={styles.emergencyNumberCard}
            onPress={() => callNumber(item.number)}>
            <Text style={styles.emergencyIcon}>{item.icon}</Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.emergencyTitle}>
                {lang === 'ar' ? item.titleAr : item.titleEn}
              </Text>
              <Text style={styles.emergencyNumber}>{item.number}</Text>
            </View>

            <Text style={styles.callIcon}>☎</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.mainButton} onPress={() => onBack()}>
          <Text style={styles.mainButtonText}>{t.back}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ========================= PRESCRIPTION ========================= */

function Prescription({ t, lang, setLang, onBack }) {
  const [medicine, setMedicine] = useState('');
  const [searched, setSearched] = useState(false);

  return (
    <View style={styles.app}>
      <Header
        title={t.medicineLocator}
        onBack={onBack}
        lang={lang}
        setLang={setLang}
      />

      <ScrollView style={styles.screen} contentContainerStyle={{ padding: 18 }}>
        <Card style={styles.prescriptionTop}>
          <Text style={styles.prescriptionIcon}>💊</Text>
          <Text style={styles.cardTitle}>{t.medicineLocator}</Text>
          <Text style={styles.cardDescription}>{t.prescriptionNote}</Text>
        </Card>

        <Text style={styles.fieldLabel}>{t.medicineName}</Text>

        <TextInput
          style={styles.input}
          value={medicine}
          onChangeText={setMedicine}
          placeholder={
            lang === 'ar' ? 'مثال: Paracetamol' : 'Example: Paracetamol'
          }
          placeholderTextColor="#A7B7BA"
        />

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setSearched(true)}>
          <Text style={styles.mainButtonText}>🔎 {t.findPharmacies}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineButton}>
          <Text style={styles.outlineButtonText}>
            📄 {t.uploadPrescription}
          </Text>
        </TouchableOpacity>

        {searched && (
          <Card>
            <Text style={styles.cardTitle}>
              {lang === 'ar'
                ? `البحث عن: ${medicine || 'دواء'}`
                : `Searching for: ${medicine || 'medicine'}`}
            </Text>

            <Text style={styles.cardDescription}>
              {lang === 'ar'
                ? 'لم يتم ربط التطبيق بعد بقاعدة بيانات مخزون الصيدليات. يمكن ربطها لاحقاً بواجهة API للصيدليات.'
                : 'The app is not yet connected to live pharmacy inventory. A pharmacy API can be connected later.'}
            </Text>

            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => onBack()}>
              <Text style={styles.smallButtonText}>📍 {t.nearby}</Text>
            </TouchableOpacity>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

/* ========================= EHR ========================= */

function HealthRecord({ t, lang, setLang, user, onBack }) {
  return (
    <View style={styles.app}>
      <Header
        title={t.ehrTitle}
        onBack={onBack}
        lang={lang}
        setLang={setLang}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ padding: 18, paddingBottom: 30 }}>
        <Card style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 32 }}>👤</Text>
          </View>

          <View>
            <Text style={styles.cardTitle}>{user.name || t.guest}</Text>
            <Text style={styles.cardDescription}>
              {user.age ? `${t.age}: ${user.age}` : t.noData}
            </Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>🩸 {t.blood}</Text>
          <Text style={styles.recordValue}>{user.blood || t.noData}</Text>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>🩺 {t.conditions}</Text>

          {user.conditions?.length ? (
            user.conditions.map((condition) => (
              <View key={condition} style={styles.recordItem}>
                <Text>•</Text>
                <Text style={styles.recordText}>{condition}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.recordValue}>{t.noData}</Text>
          )}
        </Card>

        <Card>
          <Text style={styles.cardTitle}>⚠️ {t.allergies}</Text>
          <Text style={styles.recordValue}>{user.allergies || t.noData}</Text>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>🏥 {t.healthCenter}</Text>
          <Text style={styles.cardDescription}>{t.ehrNote}</Text>

          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>+ {t.add}</Text>
          </TouchableOpacity>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>🧪 {t.tests}</Text>
          <Text style={styles.cardDescription}>{t.noData}</Text>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>📖 {t.medicalHistory}</Text>
          <Text style={styles.cardDescription}>{t.noData}</Text>
        </Card>

        <TouchableOpacity style={styles.mainButton}>
          <Text style={styles.mainButtonText}>🔐 {t.doctorAccess}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ========================= DOCTORS ========================= */

function Doctors({ t, lang, setLang, onBack }) {
  const specialties =
    lang === 'ar'
      ? ['طب عام', 'أطفال', 'نساء وتوليد', 'باطنية', 'قلب', 'جلدية']
      : [
          'General Medicine',
          'Pediatrics',
          'Obstetrics & Gynecology',
          'Internal Medicine',
          'Cardiology',
          'Dermatology',
        ];

  const [selected, setSelected] = useState('');

  return (
    <View style={styles.app}>
      <Header
        title={t.consultation}
        onBack={onBack}
        lang={lang}
        setLang={setLang}
      />

      <ScrollView style={styles.screen} contentContainerStyle={{ padding: 18 }}>
        <Card style={styles.doctorHero}>
          <Text style={styles.doctorHeroIcon}>👨‍⚕️</Text>
          <Text style={styles.cardTitle}>{t.doctors}</Text>
          <Text style={styles.cardDescription}>
            {lang === 'ar'
              ? 'اختر التخصص المطلوب لطلب استشارة.'
              : 'Choose a specialty to request a consultation.'}
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>{t.chooseSpecialty}</Text>

        {specialties.map((specialty) => (
          <TouchableOpacity
            key={specialty}
            style={[
              styles.specialty,
              selected === specialty && styles.specialtySelected,
            ]}
            onPress={() => setSelected(specialty)}>
            <Text style={{ fontSize: 23 }}>🩺</Text>
            <Text
              style={[
                styles.specialtyText,
                selected === specialty && styles.specialtyTextSelected,
              ]}>
              {specialty}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.mainButton, !selected && { opacity: 0.5 }]}
          disabled={!selected}
          onPress={() =>
            Alert.alert(
              lang === 'ar' ? 'تم إرسال الطلب' : 'Request sent',
              lang === 'ar' ? `التخصص: ${selected}` : `Specialty: ${selected}`
            )
          }>
          <Text style={styles.mainButtonText}>{t.requestDoctor}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ========================= REMINDERS ========================= */

function Reminders({ t, lang, setLang, onBack }) {
  const [reminders, setReminders] = useState([]);

  const addReminder = (type) => {
    const item =
      type === 'medication'
        ? t.medicationReminder
        : type === 'vaccine'
        ? t.vaccineReminder
        : t.appointmentReminder;

    setReminders((old) => [...old, item]);

    Alert.alert(lang === 'ar' ? 'تمت الإضافة' : 'Added', item);
  };

  return (
    <View style={styles.app}>
      <Header
        title={t.remindersTitle}
        onBack={onBack}
        lang={lang}
        setLang={setLang}
      />

      <ScrollView style={styles.screen} contentContainerStyle={{ padding: 18 }}>
        <TouchableOpacity
          style={styles.reminderAdd}
          onPress={() => addReminder('medication')}>
          <Text style={styles.reminderAddIcon}>💊</Text>
          <Text style={styles.reminderAddText}>{t.medicationReminder}</Text>
          <Text>＋</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reminderAdd}
          onPress={() => addReminder('vaccine')}>
          <Text style={styles.reminderAddIcon}>💉</Text>
          <Text style={styles.reminderAddText}>{t.vaccineReminder}</Text>
          <Text>＋</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reminderAdd}
          onPress={() => addReminder('appointment')}>
          <Text style={styles.reminderAddIcon}>📅</Text>
          <Text style={styles.reminderAddText}>{t.appointmentReminder}</Text>
          <Text>＋</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t.remindersTitle}</Text>

        {reminders.length === 0 ? (
          <Card>
            <Text style={styles.cardDescription}>{t.noData}</Text>
          </Card>
        ) : (
          reminders.map((reminder, index) => (
            <Card key={index}>
              <Text style={styles.cardTitle}>🔔 {reminder}</Text>
              <Text style={styles.cardDescription}>
                {lang === 'ar'
                  ? 'يمكن ربط هذا التذكير بإشعارات الهاتف.'
                  : 'This reminder can later be connected to phone notifications.'}
              </Text>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

/* ========================= EDUCATION ========================= */

function Education({ t, lang, setLang, onBack }) {
  const articles =
    lang === 'ar'
      ? [
          [
            '💧',
            'أهمية شرب الماء',
            'الحفاظ على الترطيب يساعد الجسم على أداء وظائفه بشكل طبيعي.',
          ],
          [
            '🥗',
            'التغذية الصحية',
            'اجعل وجباتك متنوعة وتحتوي على الخضروات والفواكه ومصادر البروتين.',
          ],
          [
            '🏃',
            'النشاط البدني',
            'النشاط البدني المنتظم جزء مهم من نمط الحياة الصحي.',
          ],
          [
            '🧼',
            'غسل اليدين',
            'غسل اليدين بالماء والصابون يساعد على تقليل انتقال العديد من العدوى.',
          ],
        ]
      : [
          [
            '💧',
            'Hydration',
            'Adequate hydration supports normal body functions.',
          ],
          [
            '🥗',
            'Healthy Nutrition',
            'Eat a varied diet with vegetables, fruits and protein sources.',
          ],
          [
            '🏃',
            'Physical Activity',
            'Regular physical activity is an important part of a healthy lifestyle.',
          ],
          [
            '🧼',
            'Hand Hygiene',
            'Handwashing with soap helps reduce transmission of many infections.',
          ],
        ];

  return (
    <View style={styles.app}>
      <Header
        title={t.healthEducation}
        onBack={onBack}
        lang={lang}
        setLang={setLang}
      />

      <ScrollView style={styles.screen} contentContainerStyle={{ padding: 18 }}>
        {articles.map((article, index) => (
          <Card key={index}>
            <Text style={styles.educationIcon}>{article[0]}</Text>
            <Text style={styles.cardTitle}>{article[1]}</Text>
            <Text style={styles.cardDescription}>{article[2]}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

/* ========================= PROFILE ========================= */

function Profile({ t, lang, setLang, user, setUser, onBack }) {
  const [edit, setEdit] = useState(false);

  return (
    <View style={styles.app}>
      <Header title={t.profile} onBack={onBack} lang={lang} setLang={setLang} />

      <ScrollView style={styles.screen} contentContainerStyle={{ padding: 18 }}>
        <Card style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 32 }}>👤</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{user.name || t.guest}</Text>

            <Text style={styles.cardDescription}>
              {user.guest ? t.guest : 'KoAYSS User'}
            </Text>
          </View>
        </Card>

        {!edit ? (
          <>
            <InfoRow label={t.age} value={user.age} />
            <InfoRow label={t.blood} value={user.blood} />
            <InfoRow label={t.region} value={user.region} />
            <InfoRow
              label={t.conditions}
              value={user.conditions?.join('، ') || ''}
            />
            <InfoRow label={t.allergies} value={user.allergies} />

            <TouchableOpacity
              style={styles.mainButton}
              onPress={() => setEdit(true)}>
              <Text style={styles.mainButtonText}>✏️ {t.add}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Field
              label={t.name}
              value={user.name}
              placeholder={t.namePlaceholder}
              onChangeText={(v) => setUser({ ...user, name: v })}
            />

            <Field
              label={t.age}
              value={user.age}
              placeholder="18"
              keyboardType="numeric"
              onChangeText={(v) => setUser({ ...user, age: v })}
            />

            <Field
              label={t.blood}
              value={user.blood}
              placeholder="O+"
              onChangeText={(v) => setUser({ ...user, blood: v })}
            />

            <Field
              label={t.region}
              value={user.region}
              placeholder={t.selectRegion}
              onChangeText={(v) => setUser({ ...user, region: v })}
            />

            <TouchableOpacity
              style={styles.mainButton}
              onPress={() => {
                setEdit(false);
                Alert.alert(t.profileSaved);
              }}>
              <Text style={styles.mainButtonText}>{t.save}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <Card>
      <Text style={styles.infoRowLabel}>{label}</Text>
      <Text style={styles.infoRowValue}>{value || '—'}</Text>
    </Card>
  );
}

/* ========================= BOTTOM NAV ========================= */

function BottomNav({ t, screen, navigate }) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigate('home')}>
        <Text style={[styles.navIcon, screen === 'home' && styles.navActive]}>
          🏠
        </Text>
        <Text style={[styles.navText, screen === 'home' && styles.navActive]}>
          {t.home}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigate('healthRecord')}>
        <Text
          style={[
            styles.navIcon,
            screen === 'healthRecord' && styles.navActive,
          ]}>
          📋
        </Text>
        <Text
          style={[
            styles.navText,
            screen === 'healthRecord' && styles.navActive,
          ]}>
          {t.health}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigate('nearby')}>
        <Text style={[styles.navIcon, screen === 'nearby' && styles.navActive]}>
          📍
        </Text>
        <Text style={[styles.navText, screen === 'nearby' && styles.navActive]}>
          {t.map}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigate('profile')}>
        <Text
          style={[styles.navIcon, screen === 'profile' && styles.navActive]}>
          👤
        </Text>
        <Text
          style={[styles.navText, screen === 'profile' && styles.navActive]}>
          {t.profile}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ========================= STYLES ========================= */

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: BG,
  },

  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  welcome: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  topLanguage: {
    position: 'absolute',
    top: 55,
    right: 25,
    borderWidth: 1,
    borderColor: TEAL,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },

  topLanguageText: {
    color: TEAL,
    fontWeight: '700',
  },

  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F7F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },

  logoHeart: {
    color: ORANGE,
    fontSize: 48,
    position: 'absolute',
    top: 10,
    left: 25,
  },

  logoCheck: {
    color: TEAL,
    fontSize: 68,
    fontWeight: '900',
    transform: [{ rotate: '-10deg' }],
  },

  logoText: {
    color: TEAL,
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -2,
  },

  logoSmile: {
    color: NAVY,
  },

  logoArabic: {
    color: TEAL,
    fontSize: 39,
    fontWeight: '900',
    marginTop: -5,
  },

  good: {
    color: NAVY,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: -5,
  },

  welcomeSlogan: {
    color: NAVY,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 35,
  },

  mainButton: {
    height: 52,
    backgroundColor: TEAL,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  mainButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '800',
  },

  textButton: {
    padding: 15,
  },

  textButtonText: {
    color: TEAL,
    fontWeight: '800',
  },

  sudanText: {
    position: 'absolute',
    bottom: 25,
    color: MUTED,
    fontSize: 11,
  },

  header: {
    height: 90,
    paddingTop: 35,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BG,
  },

  headerSide: {
    width: 45,
    alignItems: 'flex-start',
  },

  headerBack: {
    color: TEAL,
    fontSize: 28,
    fontWeight: '700',
  },

  headerTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '900',
    flex: 1,
    textAlign: 'center',
  },

  languageSmall: {
    minWidth: 40,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  languageSmallText: {
    color: TEAL,
    fontWeight: '900',
  },

  formContainer: {
    padding: 22,
    paddingTop: 45,
    paddingBottom: 50,
  },

  formTop: {
    position: 'absolute',
    top: 25,
    right: 22,
  },

  bigTitle: {
    color: NAVY,
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 10,
  },

  description: {
    color: MUTED,
    lineHeight: 23,
    marginBottom: 25,
  },

  fieldLabel: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 8,
  },

  input: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    height: 50,
    borderRadius: 15,
    paddingHorizontal: 15,
    color: TEXT,
    fontSize: 15,
  },

  multiline: {
    height: 100,
    paddingTop: 14,
    textAlignVertical: 'top',
  },

  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  option: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 4,
  },

  conditionOption: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 13,
    marginBottom: 4,
  },

  regionOption: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginRight: 7,
  },

  optionSelected: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },

  optionText: {
    color: TEXT,
    fontWeight: '700',
  },

  optionTextSelected: {
    color: WHITE,
  },

  homeHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  locationText: {
    color: NAVY,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 16,
  },

  homeWelcome: {
    color: TEXT,
    fontSize: 23,
    fontWeight: '900',
  },

  homeSubtitle: {
    color: MUTED,
    marginTop: 5,
  },

  bell: {
    width: 43,
    height: 43,
    backgroundColor: WHITE,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },

  searchBox: {
    marginHorizontal: 18,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 18,
  },

  searchBoxMap: {
    marginHorizontal: 15,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  searchIcon: {
    color: TEAL,
    fontSize: 25,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    color: TEXT,
    fontSize: 13,
  },

  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },

  serviceButton: {
    width: '30.8%',
    minHeight: 100,
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },

  serviceIcon: {
    fontSize: 29,
    marginBottom: 8,
  },

  serviceText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },

  emergencyBanner: {
    marginHorizontal: 18,
    marginTop: 5,
    marginBottom: 18,
    backgroundColor: '#E9F7F6',
    borderRadius: 18,
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4EEEE',
  },

  emergencyBannerTitle: {
    color: NAVY,
    fontSize: 16,
    fontWeight: '900',
  },

  emergencyBannerText: {
    color: MUTED,
    marginTop: 4,
  },

  bannerArrow: {
    color: TEAL,
    fontSize: 28,
    fontWeight: '800',
  },

  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 10,
  },

  sectionTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 10,
    marginBottom: 10,
  },

  moreText: {
    color: TEAL,
    fontWeight: '800',
  },

  card: {
    backgroundColor: WHITE,
    borderRadius: 17,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  previewMap: {
    height: 145,
    borderRadius: 14,
    backgroundColor: '#E9F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  previewMapText: {
    color: TEXT,
    fontWeight: '800',
    marginTop: 3,
  },

  smallButton: {
    backgroundColor: TEAL,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 10,
  },

  smallButtonText: {
    color: WHITE,
    fontWeight: '800',
  },

  bottomNav: {
    height: 72,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 12 : 4,
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },

  navIcon: {
    fontSize: 20,
    opacity: 0.65,
  },

  navText: {
    color: MUTED,
    fontSize: 10,
    marginTop: 4,
    fontWeight: '700',
  },

  navActive: {
    color: TEAL,
    opacity: 1,
  },

  map: {
    height: 290,
    width: '100%',
  },

  loadingBox: {
    position: 'absolute',
    top: 145,
    left: 20,
    right: 20,
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 3,
  },

  loadingText: {
    color: TEXT,
    fontWeight: '700',
  },

  placeCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  placeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAF7F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  placeName: {
    color: TEXT,
    fontWeight: '900',
    fontSize: 14,
  },

  placeType: {
    color: TEAL,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
  },

  placeAddress: {
    color: MUTED,
    fontSize: 11,
    marginTop: 3,
  },

  directionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },

  directionText: {
    color: WHITE,
    fontSize: 20,
    fontWeight: '900',
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF7F5',
  },

  infoIcon: {
    fontSize: 28,
    marginRight: 10,
  },

  infoText: {
    color: TEXT,
    flex: 1,
    lineHeight: 20,
    fontWeight: '600',
  },

  vaccineTabs: {
    flexDirection: 'row',
    backgroundColor: '#E9EEEE',
    borderRadius: 25,
    padding: 4,
    marginBottom: 18,
  },

  vaccineTabActive: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 10,
  },

  vaccineTabActiveText: {
    color: TEAL,
    fontWeight: '900',
  },

  vaccineTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },

  vaccineTabText: {
    color: MUTED,
    fontWeight: '700',
  },

  vaccineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  vaccineIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EAF7F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  cardTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 6,
  },

  cardDescription: {
    color: MUTED,
    lineHeight: 20,
    fontSize: 13,
  },

  reminderButton: {
    borderWidth: 1,
    borderColor: TEAL,
    borderRadius: 20,
    paddingVertical: 9,
    alignItems: 'center',
    marginTop: 13,
  },

  reminderButtonText: {
    color: TEAL,
    fontWeight: '900',
  },

  warningText: {
    color: '#B36C1C',
    marginTop: 10,
    lineHeight: 20,
  },

  diseaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  diseaseIcon: {
    fontSize: 30,
    marginRight: 13,
  },

  arrow: {
    color: TEAL,
    fontSize: 22,
    fontWeight: '800',
  },

  warningCard: {
    backgroundColor: '#FFF7E9',
    borderColor: '#F4D9A8',
  },

  warningTitle: {
    fontSize: 25,
    marginBottom: 5,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },

  modalCard: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '80%',
  },

  modalTitle: {
    color: NAVY,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 18,
  },

  modalHeading: {
    color: TEAL,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 8,
    marginBottom: 5,
  },

  modalText: {
    color: TEXT,
    lineHeight: 22,
    flex: 1,
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 13,
  },

  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  stepNumberText: {
    color: WHITE,
    fontWeight: '900',
  },

  bigEmergency: {
    backgroundColor: '#EAF7F5',
    borderRadius: 22,
    padding: 25,
    alignItems: 'center',
    marginBottom: 18,
  },

  bigEmergencyIcon: {
    fontSize: 45,
  },

  bigEmergencyTitle: {
    color: NAVY,
    fontSize: 23,
    fontWeight: '900',
    marginTop: 8,
  },

  bigEmergencySubtitle: {
    color: MUTED,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 7,
  },

  emergencyNumberCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },

  emergencyIcon: {
    fontSize: 30,
    marginRight: 15,
  },

  emergencyTitle: {
    color: TEXT,
    fontWeight: '800',
  },

  emergencyNumber: {
    color: TEAL,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 3,
  },

  callIcon: {
    color: TEAL,
    fontSize: 25,
  },

  prescriptionTop: {
    alignItems: 'center',
  },

  prescriptionIcon: {
    fontSize: 48,
    marginBottom: 8,
  },

  outlineButton: {
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  outlineButtonText: {
    color: TEAL,
    fontWeight: '900',
  },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#EAF7F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  recordValue: {
    color: TEAL,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },

  recordItem: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 5,
  },

  recordText: {
    color: TEXT,
    fontWeight: '700',
  },

  doctorHero: {
    alignItems: 'center',
    backgroundColor: '#EAF7F5',
  },

  doctorHeroIcon: {
    fontSize: 55,
    marginBottom: 5,
  },

  specialty: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  specialtySelected: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },

  specialtyText: {
    color: TEXT,
    fontWeight: '800',
    marginLeft: 12,
  },

  specialtyTextSelected: {
    color: WHITE,
  },

  reminderAdd: {
    backgroundColor: WHITE,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 17,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  reminderAddIcon: {
    fontSize: 27,
    marginRight: 13,
  },

  reminderAddText: {
    color: TEXT,
    fontWeight: '800',
    flex: 1,
  },

  educationIcon: {
    fontSize: 35,
    marginBottom: 8,
  },

  infoRowLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 5,
  },

  infoRowValue: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
  },
});
