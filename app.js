/*
 * EduTrack — Interactive HCI prototype based on the uploaded Figma PDF.
 * All records, accounts, evaluations and scores are mock/demo data.
 * No API calls, authentication service, database, or backend are used.
 * Drafts and staff release switches persist in THIS browser's localStorage.
 */
(() => {
  'use strict';

  const LOGO = './assets/lagonoy-logo.png';
  const STORAGE_KEY = 'edutrack-hci-v1';
  const STUDENT_NAME = 'Raymund Stephen L. Pamor';
  const STUDENT_LRN = '112660120043';
  const STAFF_NAME = 'Dr. Julian Vance';
  const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];
  const TEACHER_Q = [
    'The teacher explains concepts clearly and uses helpful examples.',
    'The teacher uses varied activities and learning materials.',
    'The teacher checks understanding and offers useful feedback.',
    'The teacher encourages questions and class discussion.',
    'The teacher communicates instructions respectfully and clearly.',
    'The teacher starts and ends classes on time.',
    'The teacher is consistently present and prepared for lessons.'
  ];
  const FACILITY_Q = [
    'The facility is clean and well maintained.',
    'Equipment is available, functional, and safe to use.',
    'The facility is accessible and easy to navigate.',
    'Staff treat students with courtesy and respect.',
    'Staff respond promptly to requests and concerns.',
    'Staff provide useful technical help and guidance.'
  ];
  const TEACHER_STEPS = [
    { label: 'Teaching approach', items: [0, 1, 2] },
    { label: 'Communication', items: [3, 4] },
    { label: 'Punctuality', items: [5, 6] },
    { label: 'Comments', items: [] }
  ];
  const FACILITY_STEPS = [
    { label: 'Facility', items: [0, 1, 2] },
    { label: 'Staff', items: [3, 4, 5] },
    { label: 'Comments', items: [] }
  ];
  const TEACHERS = [
    { id: 'dizon', name: 'Mr. Dizon', subtitle: 'Associate Professor', subject: 'Mathematics', due: '30 Nov 2026' },
    { id: 'chen', name: 'Prof. Daniel Chen', subtitle: 'Senior Lecturer', subject: 'Filipino', due: '30 Nov 2026' },
    { id: 'williams', name: 'Dr. Sofia Williams', subtitle: 'Assistant Professor', subject: 'Araling Panlipunan', due: '30 Nov 2026' },
    { id: 'patel', name: 'Prof. Ravi Patel', subtitle: 'Lecturer', subject: 'English', due: '30 Nov 2026' }
  ];
  const FACILITIES = [
    { id: 'library', name: 'Library', subtitle: 'School facility', subject: 'Learning resources', due: '30 Nov 2026' },
    { id: 'gym', name: 'Gymnasium', subtitle: 'School facility', subject: 'Sports and recreation', due: '30 Nov 2026' },
    { id: 'cafeteria', name: 'Cafeteria', subtitle: 'School facility', subject: 'Food and dining', due: '30 Nov 2026' },
    { id: 'laboratory', name: 'Science Laboratory', subtitle: 'School facility', subject: 'Laboratory spaces', due: '30 Nov 2026' },
    { id: 'classrooms', name: 'Classrooms', subtitle: 'School facility', subject: 'Teaching spaces', due: '30 Nov 2026' },
    { id: 'restrooms', name: 'Restrooms', subtitle: 'School facility', subject: 'Health and sanitation', due: '30 Nov 2026' }
  ];
  const SURVEYS = [
    { id: 'teachers', title: 'Subject teachers', subtitle: 'Teaching and classroom experience', responses: 168, invited: 200 },
    { id: 'facilities', title: 'Facilities and staff', subtitle: 'School spaces and support services', responses: 135, invited: 150 },
    { id: 'advisers', title: 'Class advisers', subtitle: 'Advisory guidance and student support', responses: 0, invited: 120 },
    { id: 'general', title: 'General staff', subtitle: 'Administrative and non-teaching support', responses: 0, invited: 100 }
  ];

  const freshState = () => ({
    drafts: {
      'teacher:chen': { ratings: [4, 4, 4, 4, 4, 4, null], comment: '' },
      'facility:gym': { ratings: [4, 4, 4, null, null, null], comment: '' }
    },
    submissions: {
      'teacher:patel': { ratings: [4, 4, 4, 4, 4, 4, 4], comment: '', submitted: '12 Nov 2026' },
      'facility:classrooms': { ratings: [4, 4, 4, 4, 4, 4], comment: '', submitted: '12 Nov 2026' },
      'facility:restrooms': { ratings: [4, 4, 4, 4, 4, 4], comment: '', submitted: '12 Nov 2026' }
    },
    surveyLive: { teachers: true, facilities: true, advisers: false, general: false }
  });
  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (stored && stored.drafts && stored.submissions && stored.surveyLive) return stored;
    } catch (_) { /* reset corrupt demo state */ }
    return freshState();
  }
  let data = loadState();
  let ui = { filter: 'all', search: '', modal: null, passwordVisible: false, recoverSent: false, mobileMenu: false };
  const app = document.getElementById('app');

  function persist() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (_) { /* no storage */ } }
  const escape = (s) => String(s ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const itemKey = (type, id) => `${type}:${id}`;
  function setPath(path) {
    const next = '#' + path;
    if (location.hash === next) render();
    else location.hash = next;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  const routePath = () => decodeURI((location.hash || '#/login/student').slice(1));
  const itemsFor = (type) => type === 'teacher' ? TEACHERS : FACILITIES;
  const questionsFor = (type) => type === 'teacher' ? TEACHER_Q : FACILITY_Q;
  const stepsFor = (type) => type === 'teacher' ? TEACHER_STEPS : FACILITY_STEPS;
  const getItem = (type, id) => itemsFor(type).find(x => x.id === id);
  function answersFor(type, id) {
    return data.drafts[itemKey(type, id)] || { ratings: Array(questionsFor(type).length).fill(null), comment: '' };
  }
  const answerCount = x => (x?.ratings || []).filter(n => Number.isInteger(n) && n >= 1 && n <= 5).length;
  function itemStatus(type, id) {
    const key = itemKey(type, id);
    if (data.submissions[key]) return 'Completed';
    if (answerCount(data.drafts[key]) > 0 || (data.drafts[key]?.comment || '').trim()) return 'In progress';
    return 'Not started';
  }
  function updateDraft(type, id, updater) {
    const key = itemKey(type, id);
    if (!data.drafts[key]) data.drafts[key] = { ratings: Array(questionsFor(type).length).fill(null), comment: '' };
    updater(data.drafts[key]);
    persist();
  }
  function toast(message) {
    const region = document.getElementById('toast-region');
    region.innerHTML = `<div class="toast" role="status"><span class="toast-tick">✓</span>${escape(message)}</div>`;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => region.replaceChildren(), 3000);
  }
  const btn = (label, action, css = 'btn-primary', attrs = '') => `<button type="button" class="btn ${css}" data-action="${action}" ${attrs}>${label}</button>`;
  const badge = (label, style = '') => `<span class="badge ${style}">${escape(label)}</span>`;
  const infoStrip = (text, style = 'blue') => `<div class="info-strip info-${style}">${text}</div>`;

  function brand(size = 'normal') {
    return `<div class="brand brand-${size}"><img src="${LOGO}" alt="Lagonoy High School seal" /><div><strong>EduTrack</strong><small>${size === 'large' ? 'Lagonoy High School' : 'LAGONOY HIGH SCHOOL · EVALUATION SYSTEM'}</small></div></div>`;
  }
  function studentHeader() {
    return `<header class="student-header"><div class="header-inner">${brand()}<div class="header-profile"><div class="profile-label"><strong>${STUDENT_NAME}</strong><small>Student ID ${STUDENT_LRN}</small></div>${btn('Log out', 'signout', 'btn-white')}</div></div></header>`;
  }
  function studentShell(inner, footer = true) {
    return `<div class="student-app">${studentHeader()}<main class="student-main">${inner}${footer ? `<footer class="student-footer">Lagonoy High School · Student evaluation system</footer>` : ''}</main></div>`;
  }
  function studentNotice() { return infoStrip('Your answers are anonymous. Your name is never shared with the people you evaluate.'); }
  function breadcrumbs(label) { return `<div class="breadcrumb"><a href="#/student/dashboard">Dashboard</a><span>/</span>${escape(label)}</div>`; }

  // -------------------- Login, forgot-password screens --------------------
  function loginPage(role, recovery = false) {
    const isStaff = role === 'staff';
    const intro = isStaff
      ? 'Turn student feedback into meaningful improvements. Manage evaluations and discover where your school can grow.'
      : 'Your voice helps shape a better school. Share honest, anonymous feedback on teaching, facilities, and support.';
    const caption = isStaff ? 'Insight with care. Decisions with confidence.' : 'A safe space for your feedback';
    const captionSub = isStaff ? 'Anonymous feedback. Clear, actionable results.' : 'Anonymous responses. Meaningful improvements.';
    return `<div class="login-layout">
      <aside class="login-brand"><div class="login-brand-inner">${brand('large')}<h1>Quality education<br/>through insight.</h1><p>${intro}</p><div class="brand-message"><strong>${caption}</strong><span>${captionSub}</span></div><div class="brand-foot">${isStaff ? 'STAFF' : 'STUDENT'} PORTAL / ACADEMIC EVALUATION</div></div></aside>
      <main class="login-content"><div class="login-stack"><div class="auth-card">
        <p class="eyebrow">${recovery ? 'ACCOUNT RECOVERY' : isStaff ? 'STAFF ACCESS' : 'WELCOME TO EDUTRACK'}</p>
        <h2>${recovery ? 'Forgot password?' : 'Welcome back'}</h2>
        <p class="auth-desc">${recovery ? 'Enter your registered ' + (isStaff ? 'email or employee ID' : 'email and LRN') + '. School staff will help you reset your password.' : isStaff ? 'Sign in as Dr. Julian Vance.' : 'Sign in to your student evaluation portal.'}</p>
        ${recovery ? `<form id="recover-form">
           <label class="field-label" for="recovery-email">${isStaff ? 'Email or Employee ID' : 'Email address'}</label>
           <input class="text-field" id="recovery-email" type="${isStaff ? 'text' : 'email'}" placeholder="${isStaff ? 'Your registered email or ID' : 'Your registered email'}" required />
           ${isStaff ? '' : `<label class="field-label field-spaced" for="recovery-lrn">Learner Reference Number (LRN)</label><input class="text-field" id="recovery-lrn" value="${STUDENT_LRN}" required />`}
           <button type="submit" class="btn btn-primary btn-block auth-submit">Send reset request</button>
         </form>${btn('Back to sign in', 'back-login', 'btn-outline btn-block auth-secondary')}` : `
         <div class="role-tabs" role="tablist" aria-label="Account type"><button type="button" role="tab" aria-selected="${!isStaff}" class="role-tab ${isStaff ? '' : 'active'}" data-action="role-student">Student</button><button type="button" role="tab" aria-selected="${isStaff}" class="role-tab ${isStaff ? 'active' : ''}" data-action="role-staff">Staff</button></div>
         <form id="login-form"><label class="field-label" for="login-id">${isStaff ? 'Email or Employee ID' : 'Learner Reference Number (LRN)'}</label><input class="text-field" id="login-id" type="text" autocomplete="username" ${isStaff ? 'placeholder="Enter your email or employee ID" value="JVANCE001"' : `value="${STUDENT_LRN}"`} required />
         <label class="field-label field-spaced" for="login-pass">Password</label><div class="password-wrap"><input class="text-field" id="login-pass" type="${ui.passwordVisible ? 'text' : 'password'}" autocomplete="current-password" value="edutrack123" required /><button aria-label="Show or hide password" type="button" data-action="toggle-password" class="password-toggle">${ui.passwordVisible ? 'Hide' : '◉'}</button></div>
         <div class="forgot-row"><a href="#/recover/${role}">Forgot password?</a></div><button type="submit" class="btn btn-primary btn-block auth-submit">Sign in</button></form>`}
      </div><p class="auth-help">Need help? Visit the school computer laboratory.</p></div></main>
    </div>`;
  }

  // ------------------------- Student dashboard -----------------------------
  function studentDashboard() {
    const teacherRemaining = TEACHERS.filter(t => itemStatus('teacher', t.id) !== 'Completed').length;
    const facilityRemaining = FACILITIES.filter(t => itemStatus('facility', t.id) !== 'Completed').length;
    const cards = [
      { state: data.surveyLive.teachers ? 'ACTIVE' : 'LOCKED', cls: data.surveyLive.teachers ? 'active' : 'disabled', title: 'Subject teachers', copy: data.surveyLive.teachers ? 'Evaluate teaching, communication, and classroom support.' : 'This evaluation is currently closed by staff.', meta: data.surveyLive.teachers ? `${teacherRemaining} of 4 remaining` : 'Not yet available', action: data.surveyLive.teachers ? 'Continue evaluation' : 'Locked', path: data.surveyLive.teachers ? '/student/teachers' : null },
      { state: data.surveyLive.advisers ? 'ACTIVE' : 'PENDING STAFF APPROVAL', cls: data.surveyLive.advisers ? 'active' : 'disabled', title: 'Class advisors', copy: data.surveyLive.advisers ? 'Share feedback on advisory guidance and student support.' : 'This module will open after staff approval.', meta: data.surveyLive.advisers ? 'Ready to begin' : 'Not yet available', action: data.surveyLive.advisers ? 'View evaluation' : 'Awaiting approval', path: data.surveyLive.advisers ? '/student/module/advisers' : null },
      { state: data.surveyLive.general ? 'ACTIVE' : 'LOCKED', cls: data.surveyLive.general ? 'active' : 'disabled', title: 'General staff', copy: 'Evaluate administrative services and school support.', meta: data.surveyLive.general ? 'Ready to begin' : 'Not yet available', action: data.surveyLive.general ? 'View evaluation' : 'Locked', path: data.surveyLive.general ? '/student/module/general' : null },
      { state: data.surveyLive.facilities ? 'ACTIVE' : 'LOCKED', cls: data.surveyLive.facilities ? 'active' : 'disabled', title: 'Facilities and facility staff', copy: data.surveyLive.facilities ? 'Share feedback on school spaces and the staff who support them.' : 'This evaluation is currently closed by staff.', meta: data.surveyLive.facilities ? `${facilityRemaining} of 6 remaining` : 'Not yet available', action: data.surveyLive.facilities ? 'Start evaluation' : 'Locked', path: data.surveyLive.facilities ? '/student/facilities' : null }
    ];
    return studentShell(`<div class="page-heading"><h1>Academic evaluation portal</h1><p>Welcome back, ${STUDENT_NAME}. Your feedback makes our school better.</p></div>
      <div class="module-grid">${cards.map(c => `<article class="module-card ${c.cls}">${badge(c.state, c.cls === 'active' ? 'badge-cream' : 'badge-muted')}<h2>${c.title}</h2><p>${c.copy}</p><p class="module-meta">${c.meta}</p>${c.path ? `<a class="btn btn-primary btn-block" href="#${c.path}">${c.action}</a>` : `<button disabled class="btn btn-block btn-disabled">${c.action}</button>`}</article>`).join('')}</div>
      ${studentNotice()}`);
  }

  function unpublishedModule(module) {
    const label = module === 'advisers' ? 'Class advisors' : 'General staff';
    return studentShell(`<a class="back-link" href="#/student/dashboard">← Back to dashboard</a><div class="page-heading"><h1>${label}</h1><p>Evaluation module</p></div><section class="panel empty-results"><h2>Questionnaire not in the provided design</h2><p>Staff have released this module in the UI demo. The supplied Figma screens do not show questions for ${label.toLowerCase()}, so this prototype does not invent an evaluation form.</p><a href="#/student/dashboard" class="btn btn-outline">Back to dashboard</a></section>`);
  }

  function listPage(type) {
    const teacher = type === 'teacher';
    const list = itemsFor(type);
    const done = list.filter(x => itemStatus(type, x.id) === 'Completed').length;
    const inProgress = list.filter(x => itemStatus(type, x.id) === 'In progress').length;
    const notStarted = list.length - done - inProgress;
    const search = ui.search.toLowerCase();
    const shown = list.filter(x => {
      const status = itemStatus(type, x.id);
      const matchFilter = ui.filter === 'all' || (ui.filter === 'pending' && status !== 'Completed') || (ui.filter === 'completed' && status === 'Completed');
      const matchQuery = (x.name + ' ' + x.subject + ' ' + x.subtitle).toLowerCase().includes(search);
      return matchFilter && matchQuery;
    });
    const typeLabel = teacher ? 'Teacher evaluations' : 'Facilities evaluations';
    const percent = Math.round(done / list.length * 100);
    return studentShell(`${breadcrumbs(typeLabel)}<div class="page-heading slim"><h1>${typeLabel}</h1><p>One evaluation at a time. Save a draft whenever you need a break.</p></div>
      <section class="panel summary-panel"><div class="summary-progress"><strong>${done} of ${list.length} completed (${percent}%)</strong><div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div></div>
       <div class="summary-stats">${[[list.length, 'Assigned'],[notStarted, 'Not started'],[inProgress, 'In progress'],[done, 'Completed']].map(([num, lab]) => `<div class="stat-block"><strong>${num}</strong><span>${lab}</span></div>`).join('')}</div></section>
      <div class="listing-tools"><label class="search-field"><span class="search-icon">⌕</span><input id="listing-search" type="search" placeholder="${teacher ? 'Search teachers or subjects' : 'Search facilities'}" value="${escape(ui.search)}" autocomplete="off" aria-label="Search evaluations" /></label>
      <div class="filter-tabs" role="group" aria-label="Filter by status">${[['all','All'],['pending','Pending'],['completed','Completed']].map(([key,text])=>`<button type="button" class="filter-tab ${ui.filter === key ? 'selected':''}" data-action="filter" data-value="${key}">${text} (${key==='all' ? list.length : key==='pending' ? list.length - done : done})</button>`).join('')}</div></div>
      <div class="panel table-panel"><div class="table-scroll"><table class="data-table student-table"><thead><tr><th>${teacher ? 'TEACHER' : 'FACILITY'}</th><th>${teacher ? 'SUBJECT' : 'AREA'}</th><th>STATUS</th><th>DETAILS</th><th>ACTION</th></tr></thead><tbody>
      ${shown.length ? shown.map(x=>{ const status=itemStatus(type,x.id); const completed = status==='Completed'; const answers=answerCount(data.drafts[itemKey(type,x.id)]);return `<tr><td><strong>${escape(x.name)}</strong><small>${escape(x.subtitle)}</small></td><td>${escape(x.subject)}</td><td>${badge(status, status==='Completed' ? 'badge-success' : status==='In progress' ? 'badge-blue' : 'badge-amber')}</td><td class="td-muted">${completed ? `Submitted ${escape(data.submissions[itemKey(type,x.id)].submitted)}` : status==='In progress' ? `${answers} of ${questionsFor(type).length} answered` : `Due ${x.due}`}</td><td>${completed ? `<a class="btn btn-outline btn-sm table-btn" href="#/student/response/${type}/${x.id}">View response</a>` : `<a class="btn btn-primary btn-sm table-btn" href="#/student/evaluation/${type}/${x.id}/1">${status==='In progress' ? 'Continue' : 'Start evaluation'}</a>`}</td></tr>`;}).join('') : `<tr><td colspan="5" class="empty-table">No evaluations found. Try a different search or filter.</td></tr>`}</tbody></table></div></div>
      ${studentNotice()}`);
  }

  function wizardPage(type, id, stepNumber) {
    const item=getItem(type,id);
    if (!item) return notFound();
    if (data.submissions[itemKey(type,id)] && ui.modal?.kind !== 'submitted') { setTimeout(()=>setPath(`/student/response/${type}/${id}`), 0); return ''; }
    const steps=stepsFor(type);
    const step=Math.max(0,Math.min(steps.length-1, Number(stepNumber)-1 || 0));
    const current=steps[step];
    const questions=questionsFor(type);
    const draft=ui.modal?.kind === 'submitted' ? data.submissions[itemKey(type,id)] : answersFor(type,id);
    const count=answerCount(draft);
    const total=questions.length;
    const finished=count===total;
    const listRoute=type==='teacher'?'/student/teachers':'/student/facilities';
    const subheading=type==='teacher'?`${item.subtitle} · ${item.subject}`:'Facility and facility staff';
    const isComment=current.items.length===0;
    return studentShell(`<a class="back-link" href="#${listRoute}">← Back to ${type==='teacher'?'teacher':'facilities'} evaluations</a>
     <div class="evaluation-title"><h1>${escape(item.name)}</h1><span>${escape(subheading)}</span></div>
     <section class="panel wizard-progress"><div class="wizard-progress-top"><h2>Step ${step+1} of ${steps.length}: ${current.label}</h2><span>${count} of ${total} answered</span></div><div class="progress-track"><div class="progress-fill" style="width:${Math.round(count/total*100)}%"></div></div></section>
     <section class="panel wizard-body">
      ${isComment ? `<div class="comment-header"><h2>Anything else you’d like to share?</h2><p>Optional. Please avoid including your name or other identifying details.</p></div><textarea class="comment-input" id="comment-text" placeholder="Share suggestions that could improve the student experience…" data-type="${type}" data-id="${id}">${escape(draft.comment)}</textarea>
       ${finished ? infoStrip(`All ${total} required questions are answered. You can submit your evaluation.`) : infoStrip(`${total-count} required ${total-count===1?'answer is':'answers are'} still missing. Go back to finish your ratings.`, 'orange')}` : `<div class="rating-legend"><strong>1 = Poor, 5 = Excellent</strong><span>Choose one rating for each statement.</span></div>
       <div class="question-stack">${current.items.map(i=>{ const val=draft.ratings[i]; return `<div class="question-row"><p><span class="question-index">${String(i+1).padStart(2,'0')}</span>${escape(questions[i])}</p><div class="answer-row"><div class="rating-options" role="group" aria-label="Rate question ${i+1}">${[1,2,3,4,5].map(r=>`<button type="button" class="rating-button ${val===r?'picked':''}" aria-label="${r} out of 5: ${LABELS[r]}" aria-pressed="${val===r}" data-action="rate" data-type="${type}" data-id="${id}" data-q="${i}" data-rating="${r}">${r}</button>`).join('')}</div><span class="rating-label ${val?'rated':''}">${val ? escape(LABELS[val]) : 'Choose a rating'}</span></div></div>`;}).join('')}</div>`}
     </section><div class="wizard-actions"><div class="wizard-actions-left">${btn('Back','wizard-back','btn-outline',`data-type="${type}" data-id="${id}" data-step="${step+1}"`)}${btn('Save draft and exit','save-draft','btn-outline',`data-type="${type}" data-id="${id}"`)}<span class="saved-label">✓ Draft saved locally</span></div>
      ${isComment ? btn(finished ? 'Submit evaluation' : `${total-count} left to answer`,finished?'submit-evaluation':'missing-answers',finished?'btn-primary btn-wide':'btn-disabled btn-wide',`data-type="${type}" data-id="${id}" ${finished?'':'disabled'}`) : btn('Next','wizard-next','btn-primary btn-wide',`data-type="${type}" data-id="${id}" data-step="${step+1}"`)}</div>
      <p class="privacy-note">Your answers are anonymous and used only to improve Lagonoy High School.</p>`,false);
  }

  function responsePage(type,id) {
    const item=getItem(type,id);
    const response=data.submissions[itemKey(type,id)];
    if (!item||!response) return notFound();
    const labels=type==='teacher' ? ['Clear explanations and examples','Varied learning activities','Helpful feedback','Encourages questions','Clear and respectful communication','Starts and ends on time','Prepared and consistently present'] : ['Cleanliness and maintenance','Equipment availability and safety','Accessibility','Staff courtesy','Staff promptness','Technical helpfulness'];
    const path=type==='teacher'?'/student/teachers':'/student/facilities';
    return studentShell(`<a class="back-link" href="#${path}">← Back to ${type==='teacher'?'teacher':'facilities'} evaluations</a><div class="evaluation-title review-title"><h1>${escape(item.name)}</h1>${badge('Completed','badge-success')}</div>
       ${infoStrip(`Submitted ${escape(response.submitted)} · Your response is saved and cannot be edited.`)}
       <section class="panel response-panel">${labels.map((label,i)=>`<div class="response-row"><span><span class="question-index">${String(i+1).padStart(2,'0')}</span>${label}</span><strong>${response.ratings[i]} / 5 · ${LABELS[response.ratings[i]]}</strong></div>`).join('')}
       <div class="response-comment"><strong>Comments</strong><p>${escape(response.comment||'No additional comments.')}</p></div></section>
       <a class="btn btn-outline" href="#${path}">Back to evaluations</a>`,false);
  }

  // ---------------------------- Staff screens ------------------------------
  function staffShell(inner, active) {
    const links = [
      { key: 'dashboard', label: 'Dashboard', href: '/staff/dashboard' },
      { key: 'surveys', label: 'Survey manager', href: '/staff/surveys' },
      { key: 'results', label: 'Results', href: '/staff/results' }
    ];
    return `<div class="staff-app"><aside class="staff-sidebar ${ui.mobileMenu ? 'sidebar-open' : ''}"><a class="sidebar-brand" href="#/staff/dashboard"><img src="${LOGO}" alt="Lagonoy High School seal" /><span>EduTrack</span></a><nav class="side-nav" aria-label="Staff navigation">${links.map(x=>`<a class="side-nav-link ${active===x.key ? 'current' : ''}" href="#${x.href}">${x.label}</a>`).join('')}</nav><div class="sidebar-bottom"><div class="sidebar-account"><strong>${STAFF_NAME}</strong><span>Head of Faculty</span></div>${btn('Sign out','signout','btn-white btn-block')}</div></aside>
     <div class="staff-content"><div class="staff-mobile-top"><button class="menu-toggle" type="button" data-action="toggle-menu" aria-label="Toggle menu">☰</button><strong>EduTrack</strong><button class="small-signout" data-action="signout" type="button">Sign out</button></div><main class="staff-main">${inner}</main></div></div>`;
  }
  const staffHeading=(title,subtitle,breadcrumb='')=>`<header class="staff-heading">${breadcrumb?`<a href="#/staff/results" class="staff-crumb">Results</a>`:''}<h1>${escape(title)}</h1><p>${escape(subtitle)}</p></header>`;
  const metric=(label,num,desc)=>`<article class="panel metric-card"><p>${label}</p><strong>${num}</strong><small>${desc}</small></article>`;
  const surveyPercent=(s)=>Math.round(s.responses/s.invited*100);
  function staffDashboard() {
    const attention=SURVEYS.filter(s=>!data.surveyLive[s.id]);
    const live=SURVEYS.filter(s=>data.surveyLive[s.id]);
    const participation=[44,51,58,63,71,78,86.6];
    return staffShell(`${staffHeading('Staff dashboard','Welcome back, Dr. Vance. Here is your evaluation activity.')}
     <div class="metrics-grid">${metric('Response rate','86.6%','303 of 350 invited students')}${metric('Live surveys',live.length,'Open for student responses')}${metric('Awaiting release',attention.length,'Review before opening access')}</div>
     <div class="staff-dashboard-grid"><section class="panel participation-panel"><div class="panel-heading"><h2>Evaluation participation</h2><p>Oct 12–18 · Cumulative response rate</p></div><div class="chart-bars" aria-label="Response rate from October 12 to 18">${participation.map((v,i)=>`<div class="chart-col"><strong>${v}%</strong><div class="chart-bar-track"><div class="chart-bar" style="height:${v}%"></div></div><span>Oct ${12+i}</span></div>`).join('')}</div></section>
     <section class="panel attention-panel"><h2>Requires your attention</h2>${attention.length ? attention.map(s=>`<div class="attention-item"><div><h3>${s.title}</h3><a href="#/staff/surveys">Review and release →</a></div>${badge('Locked','badge-muted')}</div>`).join('') : `<div class="all-clear">✓ All evaluations have been released.</div>`}</section>
     <section class="panel watch-panel"><h2>Live survey watchlist</h2>${live.length ? live.map(s=>`<div class="watch-item"><div class="watch-head"><strong>${s.title}</strong><b>${surveyPercent(s)}%</b></div><div class="progress-track"><div class="progress-fill" style="width:${surveyPercent(s)}%"></div></div><p>${s.responses} / ${s.invited} · Closes ${s.id==='teachers'?'Oct 26':'Oct 24'}</p></div>`).join('') : `<p>No live surveys right now.</p>`}</section>
     <section class="panel activity-panel"><h2>Recent activity</h2><div class="activity-entry"><p>Subject teachers evaluation released to students</p><span>2d ago</span></div><div class="activity-entry"><p>Facilities and staff evaluation released to students</p><span>3d ago</span></div></section></div>`, 'dashboard');
  }
  function surveyManager() {
    return staffShell(`${staffHeading('Survey release manager','Release an evaluation so students can answer it, or lock it to stop access.')}
      <div class="panel table-panel"><div class="table-scroll"><table class="data-table staff-table"><thead><tr><th>EVALUATION</th><th>STATUS</th><th>RESPONSES</th><th>ACTION</th></tr></thead><tbody>
      ${SURVEYS.map(s=>{const live=data.surveyLive[s.id];return `<tr><td><strong>${s.title}</strong><small>${s.subtitle}</small></td><td>${badge(live?'Live':'Locked',live?'badge-success':'badge-muted')}</td><td><strong>${s.responses} / ${s.invited}</strong><small>student responses</small></td><td>${btn(live?'Lock evaluation':'Approve and release','survey-prompt',live?'btn-outline btn-sm':'btn-primary btn-sm',`data-id="${s.id}"`)}</td></tr>`;}).join('')}</tbody></table></div></div>
      ${infoStrip('<strong>You control when students can respond.</strong><br/>Releasing opens access immediately. Locking keeps saved answers and prevents new responses.')}`, 'surveys');
  }
  function resultsOverview() {
    return staffShell(`${staffHeading('Results overview','A clear view of participation and feedback across your evaluations.')}
     <div class="metrics-grid">${metric('Total responses','303','168 teachers + 135 facilities')}${metric('Participation','86.6%','303 of 350 invited students')}${metric('Average score','4.4 / 5','Subject teachers · available scores')}</div>
     <div class="panel table-panel"><div class="table-scroll"><table class="data-table results-table"><thead><tr><th>EVALUATION</th><th>STATUS</th><th>RESPONSES</th><th>PARTICIPATION</th><th>SCORE</th><th>ACTION</th></tr></thead><tbody>
      ${SURVEYS.map(s=>`<tr><td><strong>${s.title}</strong></td><td>${badge(data.surveyLive[s.id]?'Live':'Locked',data.surveyLive[s.id]?'badge-success':'badge-muted')}</td><td>${s.responses} / ${s.invited}</td><td>${surveyPercent(s)}%</td><td><strong>${s.id==='teachers'?'4.4 / 5':'–'}</strong></td><td><a href="#/staff/results/${s.id}" class="btn btn-outline btn-sm">View results</a></td></tr>`).join('')}
      </tbody></table></div></div>${infoStrip('<strong>Student privacy comes first.</strong><br/>Groups with fewer than 5 responses show “–” for scores. Facilities scores are not yet available.')}`,'results');
  }
  function resultDetails(id) {
    const s=SURVEYS.find(s=>s.id===id);
    if (!s) return notFound();
    const hasScores=id==='teachers';
    const noResponses=s.responses<5;
    const scored=[['Teaching clarity',4.6],['Student engagement',4.3],['Learning resources',4.4],['Assessment quality',4.2],['Feedback and support',4.5]];
    const distribution=[['5',73],['4',17],['3',7],['2',2],['1',1]];
    const title=id==='teachers'?'Subject teachers':id==='facilities'?'Facilities and staff':s.title;
    return staffShell(`${staffHeading(title,hasScores||id==='facilities'?'Live: scores update as students respond.':'Anonymous evaluation results.','results')}
      <div class="metrics-grid">${metric('Responses',`${s.responses} / ${s.invited}`,s.responses?'Completed anonymous evaluations':'No responses received yet')}${metric('Participation',`${surveyPercent(s)}%`,'Of invited students')}${metric('Overall score',hasScores?'4.4 / 5':'–',hasScores?'Across the evaluation criteria':noResponses?'Hidden until at least 5 responses':'Score not yet available')}</div>
      ${hasScores ? `<div class="result-grid"><section class="panel score-card"><h2>Criterion scores</h2>${scored.map(([label,score])=>`<div class="score-row"><span>${label}</span><div class="progress-track"><div class="progress-fill" style="width:${score/5*100}%"></div></div><strong>${score.toFixed(1)} / 5</strong></div>`).join('')}</section>
        <section class="panel score-card"><h2>Response distribution</h2>${distribution.map(([rating,pct])=>`<div class="distribution-row"><span>${rating}</span><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><strong>${pct}%</strong></div>`).join('')}</section></div>
        <section class="panel feedback-panel"><h2>Anonymous student feedback</h2><p>Student names and identifying details are never shown.</p><div class="feedback-grid"><div class="feedback-quote">${badge('Strength','badge-success')}<blockquote>“Lessons use clear examples that make difficult ideas easier to understand.”</blockquote></div><div class="feedback-quote">${badge('Improvement','badge-amber')}<blockquote>“More worked examples before assessments would help us prepare.”</blockquote></div><div class="feedback-quote">${badge('Strength','badge-success')}<blockquote>“Questions are welcomed, and feedback helps me improve.”</blockquote></div></div></section>` : `<section class="panel empty-results"><h2>${noResponses?'Not enough responses yet':'Scores are not yet available'}</h2><p>${noResponses?'Results appear after at least 5 responses, to protect student privacy.':`${s.responses} responses have been received. Criterion scores and anonymous comments will appear when the results are available.`}</p><a class="btn btn-outline" href="#/staff/results">Back to results</a></section>`}
     `,'results');
  }

  // ------------------------------ Dialogs ---------------------------------
  function modalHtml() {
    if (!ui.modal) return '';
    const m=ui.modal;
    if (m.kind==='recover') {
      return `<div class="modal-overlay" data-action="dismiss-overlay"><div class="modal-card success-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><span class="success-check">✓</span><h2 id="modal-title">Reset request sent</h2><p>School staff will review your request. Check your registered email for the next steps.</p>${btn('Return to sign in','modal-login','btn-primary btn-block')}</div></div>`;
    }
    if (m.kind==='submitted') {
      return `<div class="modal-overlay"><div class="modal-card success-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><span class="success-check">✓</span><h2 id="modal-title">Evaluation sent</h2><p>Your feedback stays anonymous and helps improve the school.</p><div class="receipt"><div><small>REFERENCE ID</small><strong>EVAL-2026-0001</strong></div><div><small>DATE</small><strong>14 Nov 2026</strong></div></div>${btn('Return to dashboard','modal-dashboard','btn-primary btn-block')}</div></div>`;
    }
    if (m.kind==='survey') {
      const s=SURVEYS.find(x=>x.id===m.id);
      const live=data.surveyLive[m.id];
      return `<div class="modal-overlay" data-action="dismiss-overlay"><div class="modal-card confirm-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">${live?'Lock':'Release'} ${s.title.toLowerCase()}?</h2><p>${live?'Students will no longer be able to open or answer this evaluation. Saved answers are kept.':'Students will see this evaluation and can start answering right away.'}</p><div class="modal-actions">${btn('Cancel','close-modal','btn-outline')}${btn(live?'Lock':'Release','confirm-survey','btn-primary',`data-id="${m.id}"`)}</div></div></div>`;
    }
    return '';
  }
  function notFound() { return `<div class="not-found"><h1>Page not found</h1><p>This screen is not part of the EduTrack prototype.</p><a class="btn btn-primary" href="#/login/student">Back to sign in</a></div>`; }
  function render() {
    ui.mobileMenu=false;
    const path=routePath();
    let content='';
    if (path==='/' || path==='/login' || path==='/login/student') content=loginPage('student');
    else if(path==='/login/staff') content=loginPage('staff');
    else if(path==='/recover/student') content=loginPage('student',true);
    else if(path==='/recover/staff') content=loginPage('staff',true);
    else if(path==='/student/dashboard') content=studentDashboard();
    else if(path==='/student/teachers') content=listPage('teacher');
    else if(path==='/student/facilities') content=listPage('facility');
    else if(path==='/student/module/advisers') content=unpublishedModule('advisers');
    else if(path==='/student/module/general') content=unpublishedModule('general');
    else if(path.startsWith('/student/evaluation/')) {
      const [, , , type, id, step='1'] = path.split('/');
      content=wizardPage(type,id,step);
    }
    else if(path.startsWith('/student/response/')) {
      const [, , , type, id] = path.split('/');
      content=responsePage(type,id);
    }
    else if(path==='/staff/dashboard') content=staffDashboard();
    else if(path==='/staff/surveys') content=surveyManager();
    else if(path==='/staff/results') content=resultsOverview();
    else if(path.startsWith('/staff/results/')) content=resultDetails(path.split('/')[3]);
    else content=notFound();
    app.innerHTML=content+modalHtml();
    document.title=`EduTrack — ${path.includes('/staff')?'Staff':'Student'} Portal`;
    if(ui.modal) { const first=app.querySelector('.modal-card button'); first?.focus(); }
  }

  // One delegated event layer: all prototype controls behave without a server.
  document.addEventListener('click',e=>{
    const element=e.target.closest('[data-action]');
    if(!element) return;
    const action=element.dataset.action;
    const type=element.dataset.type;
    const id=element.dataset.id;
    if(action==='dismiss-overlay') { if(e.target===element) { ui.modal=null;render(); } return; }
    if(action==='role-student') { ui.passwordVisible=false;setPath('/login/student');return; }
    if(action==='role-staff') { ui.passwordVisible=false;setPath('/login/staff');return; }
    if(action==='back-login') { setPath(routePath().endsWith('/staff')?'/login/staff':'/login/student');return; }
    if(action==='toggle-password') {
      const input=document.getElementById('login-pass');
      if(input){ui.passwordVisible=!ui.passwordVisible;input.type=ui.passwordVisible?'text':'password';element.textContent=ui.passwordVisible?'Hide':'◉';}
      return;
    }
    if(action==='signout') { ui.modal=null; ui.search=''; ui.filter='all'; setPath(routePath().startsWith('/staff')?'/login/staff':'/login/student');toast('Signed out of the demo.');return; }
    if(action==='filter') {ui.filter=element.dataset.value;render();return;}
    if(action==='rate') {
      const q=Number(element.dataset.q), rating=Number(element.dataset.rating);
      updateDraft(type,id,d=>{d.ratings[q]=rating;});render();return;
    }
    if(action==='save-draft') { persist();setPath(type==='teacher'?'/student/teachers':'/student/facilities');toast('Draft saved in this browser.');return; }
    if(action==='wizard-next') {setPath(`/student/evaluation/${type}/${id}/${Number(element.dataset.step)+1}`);return;}
    if(action==='wizard-back') {
      const step=Number(element.dataset.step);
      setPath(step<=1 ? (type==='teacher'?'/student/teachers':'/student/facilities') : `/student/evaluation/${type}/${id}/${step-1}`);return;
    }
    if(action==='submit-evaluation') {
      const key=itemKey(type,id), d=answersFor(type,id);
      if(answerCount(d)!==questionsFor(type).length) { toast('Finish all required ratings before submitting.');return; }
      data.submissions[key]={...JSON.parse(JSON.stringify(d)), submitted:'14 Nov 2026'};
      delete data.drafts[key];persist();ui.modal={kind:'submitted'};render();return;
    }
    if(action==='missing-answers') {toast('Please finish the missing ratings.');return;}
    if(action==='modal-dashboard') {ui.modal=null;setPath('/student/dashboard');return;}
    if(action==='modal-login') {ui.modal=null;setPath(routePath().endsWith('/staff')?'/login/staff':'/login/student');return;}
    if(action==='close-modal') {ui.modal=null;render();return;}
    if(action==='survey-prompt') {ui.modal={kind:'survey',id};render();return;}
    if(action==='confirm-survey') {data.surveyLive[id]=!data.surveyLive[id];persist();ui.modal=null;render();toast(`Evaluation ${data.surveyLive[id]?'released':'locked'} in demo.`);return;}
    if(action==='toggle-menu') {ui.mobileMenu=!ui.mobileMenu;app.querySelector('.staff-sidebar')?.classList.toggle('sidebar-open',ui.mobileMenu);return;}
  });
  document.addEventListener('submit',e=>{
    if(e.target?.id==='login-form') {
      e.preventDefault();ui.search='';ui.filter='all';
      setPath(routePath().endsWith('staff')?'/staff/dashboard':'/student/dashboard');
    }
    if(e.target?.id==='recover-form') {e.preventDefault();ui.modal={kind:'recover'};render();}
  });
  document.addEventListener('input',e=>{
    if(e.target?.id==='listing-search') {
      const caret=e.target.selectionStart;ui.search=e.target.value;render();
      const input=document.getElementById('listing-search');input?.focus();try{input?.setSelectionRange(caret,caret);}catch(_){};
    }
    if(e.target?.id==='comment-text') updateDraft(e.target.dataset.type,e.target.dataset.id,d=>{d.comment=e.target.value;});
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ui.modal){ui.modal=null;render();}});
  window.addEventListener('hashchange',()=>{ui.modal=null;render();});
  window.EduTrackDemo={reset:()=>{localStorage.removeItem(STORAGE_KEY);data=freshState();ui={filter:'all',search:'',modal:null,passwordVisible:false,recoverSent:false,mobileMenu:false};setPath('/login/student');}};
  render();
})();
