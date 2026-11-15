export const STUDENT_NAME = 'Raymund Stephen L. Pamor';
export const STUDENT_LRN = '112660120043';
export const STAFF_NAME = 'Dr. Julian Vance';
export const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];
export const TEACHER_QUESTIONS = [
  'The teacher explains concepts clearly and uses helpful examples.',
  'The teacher uses varied activities and learning materials.',
  'The teacher checks understanding and offers useful feedback.',
  'The teacher encourages questions and class discussion.',
  'The teacher communicates instructions respectfully and clearly.',
  'The teacher starts and ends classes on time.',
  'The teacher is consistently present and prepared for lessons.',
];
export const FACILITY_QUESTIONS = [
  'The facility is clean and well maintained.',
  'Equipment is available, functional, and safe to use.',
  'The facility is accessible and easy to navigate.',
  'Staff treat students with courtesy and respect.',
  'Staff respond promptly to requests and concerns.',
  'Staff provide useful technical help and guidance.',
];
export const TEACHER_STEPS = [
  {label:'Teaching approach', items:[0,1,2]},
  {label:'Communication', items:[3,4]},
  {label:'Punctuality', items:[5,6]},
  {label:'Comments', items:[]},
];
export const FACILITY_STEPS = [
  {label:'Facility', items:[0,1,2]},
  {label:'Staff', items:[3,4,5]},
  {label:'Comments', items:[]},
];
export const TEACHERS = [
  {id:'dizon', name:'Mr. Dizon', subtitle:'Associate Professor', subject:'Mathematics', due:'30 Nov 2026'},
  {id:'chen', name:'Prof. Daniel Chen', subtitle:'Senior Lecturer', subject:'Filipino', due:'30 Nov 2026'},
  {id:'williams', name:'Dr. Sofia Williams', subtitle:'Assistant Professor', subject:'Araling Panlipunan', due:'30 Nov 2026'},
  {id:'patel', name:'Prof. Ravi Patel', subtitle:'Lecturer', subject:'English', due:'30 Nov 2026'},
];
export const FACILITIES = [
  {id:'library', name:'Library', subtitle:'School facility', subject:'Learning resources', due:'30 Nov 2026'},
  {id:'gym', name:'Gymnasium', subtitle:'School facility', subject:'Sports and recreation', due:'30 Nov 2026'},
  {id:'cafeteria', name:'Cafeteria', subtitle:'School facility', subject:'Food and dining', due:'30 Nov 2026'},
  {id:'laboratory', name:'Science Laboratory', subtitle:'School facility', subject:'Laboratory spaces', due:'30 Nov 2026'},
  {id:'classrooms', name:'Classrooms', subtitle:'School facility', subject:'Teaching spaces', due:'30 Nov 2026'},
  {id:'restrooms', name:'Restrooms', subtitle:'School facility', subject:'Health and sanitation', due:'30 Nov 2026'},
];
export const SURVEYS = [
  {id:'teachers', title:'Subject teachers', subtitle:'Teaching and classroom experience', responses:168, invited:200},
  {id:'facilities', title:'Facilities and staff', subtitle:'School spaces and support services', responses:135, invited:150},
  {id:'advisers', title:'Class advisers', subtitle:'Advisory guidance and student support', responses:0, invited:120},
  {id:'general', title:'General staff', subtitle:'Administrative and non-teaching support', responses:0, invited:100},
];
export const questionsFor = type => type === 'teacher' ? TEACHER_QUESTIONS : FACILITY_QUESTIONS;
export const stepsFor = type => type === 'teacher' ? TEACHER_STEPS : FACILITY_STEPS;
export const itemsFor = type => type === 'teacher' ? TEACHERS : FACILITIES;
export const itemKey = (type,id) => `${type}:${id}`;
export const countAnswers = item => (item?.ratings ?? []).filter(n => Number.isInteger(n) && n >= 1 && n <= 5).length;
