const firstNames = ['Aarav','Maya','Ishaan','Anaya','Vivaan','Diya','Arjun','Aanya','Kabir','Meera','Reyansh','Kiara','Advik','Sara','Rohan','Ira','Kian','Tara','Neil','Myra'];
const lastNames = ['Sharma','Patel','Rao','Mehta','Nair','Kapoor','Das','Iyer','Khan','Joshi'];
const students = [];
for (let classNo = 1; classNo <= 5; classNo++) {
  for (const section of ['A','B']) {
    for (let n = 1; n <= 10; n++) {
      const serial = (classNo - 1) * 20 + (section === 'B' ? 10 : 0) + n;
      students.push({
        id: serial, name: firstNames[(serial - 1) % firstNames.length],
        surname: lastNames[(serial + classNo) % lastNames.length],
        admission: `SAMPLE-C${classNo}-${section}-${String(n).padStart(2,'0')}`,
        classNo, section, fee: n % 2 === 0 ? 'PAID' : 'UNPAID', active: true
      });
    }
  }
}

const initials = s => s.split(/\s+/).map(part => part[0]).join('').slice(0,2).toUpperCase();
const person = (student, index) => `<div class="student-cell"><span class="student-avatar color-${index % 4}">${initials(student.name + ' ' + student.surname)}</span><span><strong>${student.name} ${student.surname}</strong><small>Class ${student.classNo} · Section ${student.section}</small></span></div>`;
const feePill = fee => `<span class="status-pill ${fee === 'PAID' ? 'paid-pill' : 'unpaid-pill'}">${fee === 'PAID' ? 'Paid' : 'Unpaid'}</span>`;
const activePill = '<span class="status-pill active-pill">Active</span>';
const classLabel = student => `Class ${student.classNo} <span class="class-label">· Section ${student.section}</span>`;
const toast = message => {
  const el = document.getElementById('toast'); el.textContent = message; el.classList.add('show');
  clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
};

function renderRecent() {
  document.getElementById('recentStudents').innerHTML = students.slice(-5).reverse().map((s,i) =>
    `<tr><td>${person(s,i)}</td><td>${classLabel(s)}</td><td>${s.admission}</td><td>${feePill(s.fee)}</td></tr>`).join('');
}
function renderStudents() {
  const query = document.getElementById('studentSearch').value.trim().toLowerCase();
  const classNo = document.getElementById('classFilter').value;
  const section = document.getElementById('sectionFilter').value;
  const filtered = students.filter(s => (!query || `${s.name} ${s.surname} ${s.admission}`.toLowerCase().includes(query))
    && (!classNo || String(s.classNo) === classNo) && (!section || s.section === section));
  document.getElementById('studentRows').innerHTML = filtered.length ? filtered.map((s,i) =>
    `<tr><td>${person(s,i)}</td><td>${s.admission}</td><td>${classLabel(s)}</td><td>${feePill(s.fee)}</td><td>${activePill}</td></tr>`).join('')
    : '<tr><td class="empty-state" colspan="5">No students match these filters.</td></tr>';
  document.getElementById('studentCount').textContent = `Showing ${filtered.length} of ${students.length} students`;
}
function renderClasses() {
  document.getElementById('classCards').innerHTML = Array.from({length:5},(_,i) => {
    const n = i + 1, group = students.filter(s => s.classNo === n);
    const a = group.filter(s => s.section === 'A').length, b = group.filter(s => s.section === 'B').length;
    return `<article class="class-card"><div class="class-card-head"><span class="class-symbol">▤</span><span class="class-number">CLASS ${String(n).padStart(2,'0')}</span></div><h3>Class ${n}</h3><p>Main Campus</p><div class="class-metrics"><span><strong>${group.length}</strong><small>Students</small></span><span><strong>2</strong><small>Sections</small></span></div><div class="section-row"><span>Section A</span><b>${a} students</b></div><div class="section-row"><span>Section B</span><b>${b} students</b></div></article>`;
  }).join('');
}
function renderFees() {
  const paid = students.filter(s => s.fee === 'PAID').length;
  const unpaid = students.length - paid;
  document.getElementById('feesTotal').textContent = students.length;
  document.getElementById('feesPaid').textContent = paid;
  document.getElementById('feesUnpaid').textContent = unpaid;
  document.getElementById('paidCountCard').textContent = paid;
  document.getElementById('unpaidCountCard').textContent = unpaid;
  const percent = students.length ? Math.round(100 * paid / students.length) : 0;
  document.getElementById('paidPercent').textContent = `${percent}%`;
  document.getElementById('paidProgress').style.width = `${percent}%`;
  document.getElementById('unpaidProgress').style.width = `${100-percent}%`;
  document.getElementById('unpaidBadge').innerHTML = `<i></i> ${unpaid} unpaid`;
  const unpaidStudents = students.filter(s => s.fee === 'UNPAID');
  document.getElementById('unpaidFoot').textContent = `Showing ${unpaidStudents.length} unpaid students`;
  document.getElementById('unpaidRows').innerHTML = unpaidStudents.length ? unpaidStudents.map((s,i) =>
    `<tr><td>${person(s,i)}</td><td>${s.admission}</td><td>${classLabel(s)}</td><td>${feePill(s.fee)}</td><td><button class="mark-paid" data-paid-id="${s.id}">Mark paid</button></td></tr>`).join('')
    : '<tr><td class="empty-state" colspan="5">All students are marked paid.</td></tr>';
}
function renderAll() { renderRecent(); renderStudents(); renderClasses(); renderFees(); }

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
  document.getElementById(`${name}View`).classList.add('active-view');
  document.querySelectorAll('.nav-item[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === name));
  const labels = {overview:'Overview',students:'Students',classes:'Classes & sections',fees:'Fee status'};
  document.getElementById('breadcrumbCurrent').textContent = labels[name];
  document.getElementById('sidebar').classList.remove('open');
  if (name === 'students') renderStudents();
  if (name === 'fees') renderFees();
}

document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showView(button.dataset.go)));
document.getElementById('studentSearch').addEventListener('input', renderStudents);
document.getElementById('classFilter').addEventListener('change', renderStudents);
document.getElementById('sectionFilter').addEventListener('change', renderStudents);
document.getElementById('unpaidRows').addEventListener('click', event => {
  const button = event.target.closest('[data-paid-id]'); if (!button) return;
  const student = students.find(s => s.id === Number(button.dataset.paidId));
  if (student) { student.fee = 'PAID'; renderAll(); toast(`${student.name} ${student.surname} marked as paid.`); }
});
document.getElementById('addStudent').addEventListener('click', () => toast('Student form will connect to POST /api/v1/students.'));
document.getElementById('addClass').addEventListener('click', () => toast('Class form will connect to POST /api/v1/classes.'));
document.getElementById('menuButton').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));
document.getElementById('currentDate').textContent = new Intl.DateTimeFormat('en', {weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date()).toUpperCase();
document.getElementById('todayLabel').textContent = new Intl.DateTimeFormat('en', {day:'numeric',month:'short',year:'numeric'}).format(new Date());
renderAll();
