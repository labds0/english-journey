// لإضافة وحدة جديدة: اعمل ملف JSON في المجلد المناسب وضيفه هنا.
export const LEVELS = [
  { code: 'A1', name: 'Beginner', nameAr: 'مبتدئ', units: [require('./a1/unit1.json'), require('./a1/unit2.json')] },
  { code: 'A2', name: 'Elementary', nameAr: 'أساسي', units: [] },
  { code: 'B1', name: 'Intermediate', nameAr: 'متوسط', units: [] },
  { code: 'B2', name: 'Upper-Intermediate', nameAr: 'فوق المتوسط', units: [] },
  { code: 'C1', name: 'Advanced', nameAr: 'متقدم', units: [] },
  { code: 'C2', name: 'Proficient', nameAr: 'محترف', units: [] },
];
