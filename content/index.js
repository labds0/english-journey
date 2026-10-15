const unit1 = {
  id: 'a1-u1',
  title: 'Greetings',
  titleAr: 'التحيات',
  exercises: [
    { type: 'choice', prompt: 'How do you say "صباح الخير"?', options: ['Good morning', 'Good night', 'Good evening', 'Goodbye'], answer: 0, note: 'Good morning = صباح الخير' },
    { type: 'choice', prompt: '"How are you?" - choose the best reply.', options: ["I'm fine, thanks.", 'My name is Ali.', 'Goodbye.'], answer: 0, note: "I'm fine, thanks = أنا بخير، شكرًا" },
    { type: 'choice', prompt: 'Nice to ___ you.', options: ['meet', 'run', 'sleep'], answer: 0, note: 'Nice to meet you = تشرفت بمعرفتك' },
    { type: 'order', prompt: 'رتّب الجملة: اسمي سارة', words: ['My', 'name', 'is', 'Sara'], note: 'My name is Sara.' },
    { type: 'order', prompt: 'رتّب الجملة: كيف حالك؟', words: ['How', 'are', 'you'], note: 'How are you?' },
    { type: 'choice', prompt: 'When do we say "Good night"?', options: ['Before going to bed', 'When we meet in the morning', 'At lunch'], answer: 0, note: 'Good night تُقال قبل النوم' },
  ],
};

const unit2 = {
  id: 'a1-u2',
  title: 'About me',
  titleAr: 'عن نفسي',
  exercises: [
    { type: 'choice', prompt: 'I ___ from Egypt.', options: ['am', 'is', 'are'], answer: 0, note: 'I → am' },
    { type: 'choice', prompt: 'She ___ a teacher.', options: ['am', 'is', 'are'], answer: 1, note: 'She/He/It → is' },
    { type: 'choice', prompt: 'They ___ students.', options: ['am', 'is', 'are'], answer: 2, note: 'You/We/They → are' },
    { type: 'order', prompt: 'رتّب الجملة: عمري عشرون سنة', words: ['I', 'am', 'twenty', 'years', 'old'], note: 'I am twenty years old.' },
    { type: 'order', prompt: 'رتّب الجملة: هو أخي', words: ['He', 'is', 'my', 'brother'], note: 'He is my brother.' },
    { type: 'choice', prompt: 'What does "country" mean?', options: ['بلد', 'مدينة', 'عائلة'], answer: 0, note: 'country = بلد / دولة' },
  ],
};

export const LEVELS = [
  { code: 'A1', name: 'Beginner', nameAr: 'مبتدئ', units: [unit1, unit2] },
  { code: 'A2', name: 'Elementary', nameAr: 'أساسي', units: [] },
  { code: 'B1', name: 'Intermediate', nameAr: 'متوسط', units: [] },
  { code: 'B2', name: 'Upper-Intermediate', nameAr: 'فوق المتوسط', units: [] },
  { code: 'C1', name: 'Advanced', nameAr: 'متقدم', units: [] },
  { code: 'C2', name: 'Proficient', nameAr: 'محترف', units: [] },
];
