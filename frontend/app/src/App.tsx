import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import campus from './assets/school-campus.jpg'
import './App.css'

type FeeStatus = 'PAID' | 'UNPAID'
type View = 'overview' | 'students' | 'classes' | 'fees'
type Student = {
  id: number
  name: string
  surname: string
  admission: string
  classNo: number
  section: string
  fee: FeeStatus
  active: boolean
  email?: string
  mobile?: string
}

const firstNames = ['Aarav','Maya','Ishaan','Anaya','Vivaan','Diya','Arjun','Aanya','Kabir','Meera','Reyansh','Kiara','Advik','Sara','Rohan','Ira','Kian','Tara','Neil','Myra']
const lastNames = ['Sharma','Patel','Rao','Mehta','Nair','Kapoor','Das','Iyer','Khan','Joshi']

function createSampleStudents(): Student[] {
  const rows: Student[] = []
  for (let classNo = 1; classNo <= 5; classNo++) {
    for (const section of ['A', 'B']) {
      for (let n = 1; n <= 10; n++) {
        const serial = (classNo - 1) * 20 + (section === 'B' ? 10 : 0) + n
        rows.push({
          id: serial,
          name: firstNames[(serial - 1) % firstNames.length],
          surname: lastNames[(serial + classNo) % lastNames.length],
          admission: `SAMPLE-C${classNo}-${section}-${String(n).padStart(2, '0')}`,
          classNo,
          section,
          fee: n % 2 === 0 ? 'PAID' : 'UNPAID',
          active: true,
        })
      }
    }
  }
  return rows
}

const navItems: { id: View; icon: string; label: string }[] = [
  { id: 'overview', icon: '⌂', label: 'Overview' },
  { id: 'students', icon: '♙', label: 'Students' },
  { id: 'classes', icon: '▤', label: 'Classes & sections' },
  { id: 'fees', icon: '₹', label: 'Fee status' },
]

function App() {
  const [students, setStudents] = useState(createSampleStudents)
  const [classNames, setClassNames] = useState(['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'])
  const [view, setView] = useState<View>('overview')
  const [query, setQuery] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [sectionFilter, setSectionFilter] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [showStudentForm, setShowStudentForm] = useState(false)

  const paidCount = students.filter((student) => student.fee === 'PAID').length
  const unpaidStudents = students.filter((student) => student.fee === 'UNPAID')
  const percentagePaid = students.length ? Math.round((paidCount / students.length) * 100) : 0
  const filteredStudents = useMemo(() => students.filter((student) => {
    const text = `${student.name} ${student.surname} ${student.admission}`.toLowerCase()
    return (!query || text.includes(query.toLowerCase()))
      && (!classFilter || String(student.classNo) === classFilter)
      && (!sectionFilter || student.section === sectionFilter)
  }), [students, query, classFilter, sectionFilter])

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  function navigate(nextView: View) {
    setView(nextView)
    setSidebarOpen(false)
  }

  function markPaid(studentId: number) {
    const student = students.find((row) => row.id === studentId)
    setStudents((current) => current.map((row) => row.id === studentId ? { ...row, fee: 'PAID' } : row))
    if (student) notify(`${student.name} ${student.surname} marked as paid.`)
  }

  function addStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const classNo = Number(formData.get('classNo'))
    const section = String(formData.get('section'))
    const newStudent: Student = {
      id: Date.now(),
      name: String(formData.get('firstName')).trim(),
      surname: String(formData.get('lastName')).trim(),
      admission: String(formData.get('admissionNumber')).trim(),
      classNo,
      section,
      fee: 'UNPAID',
      active: true,
      email: String(formData.get('email')).trim(),
      mobile: String(formData.get('mobile')).trim(),
    }
    setStudents((current) => [newStudent, ...current])
    setShowStudentForm(false)
    navigate('students')
    notify('Student added to the local prototype data.')
  }

  function addClass() {
    const proposed = `Class ${classNames.length + 1}`
    const name = window.prompt('Enter a class name', proposed)?.trim()
    if (!name) return
    if (classNames.some((item) => item.toLowerCase() === name.toLowerCase())) {
      notify('That class is already in the list.')
      return
    }
    setClassNames((current) => [...current, name])
    notify(`${name} added to the local prototype.`)
  }

  const viewLabel = navItems.find((item) => item.id === view)?.label ?? 'Overview'
  const today = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())
  const todayLong = new Intl.DateTimeFormat('en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()).toUpperCase()

  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <a className="brand" href="#overview" onClick={(event) => { event.preventDefault(); navigate('overview') }}>
          <span className="brand-mark">C</span><span><strong>CampusFlow</strong><small>SCHOOL ERP</small></span>
        </a>
        <div className="school-switcher"><span className="school-avatar">MS</span><span><strong>Mashcod School</strong><small>Main Campus</small></span><span className="chevron">⌄</span></div>
        <nav className="main-nav" aria-label="Main navigation">
          <p className="nav-label">WORKSPACE</p>
          {navItems.map((item) => <button key={item.id} className={`nav-item ${view === item.id ? 'active' : ''}`} onClick={() => navigate(item.id)}><span className="nav-icon">{item.icon}</span>{item.label}{item.id === 'students' && <span className="nav-count">{students.length}</span>}{item.id === 'fees' && <span className="nav-dot" />}</button>)}
          <p className="nav-label nav-spaced">ADMINISTRATION</p>
          <button className="nav-item muted" onClick={() => notify('Staff management is planned for a later phase.')}><span className="nav-icon">♧</span>Staff<span className="soon">Soon</span></button>
          <button className="nav-item muted" onClick={() => notify('Attendance is planned for a later phase.')}><span className="nav-icon">▦</span>Attendance<span className="soon">Soon</span></button>
        </nav>
        <div className="sidebar-bottom"><div className="help-card"><span className="help-icon">?</span><div><strong>Need a hand?</strong><small>School ERP workspace</small></div><span className="arrow">↗</span></div><div className="profile"><span className="profile-avatar">AD</span><span><strong>School Admin</strong><small>Administrator</small></span><button className="more" aria-label="Profile menu">•••</button></div></div>
      </aside>

      <main className="main-shell">
        <header className="topbar"><button className="mobile-menu" aria-label="Open menu" onClick={() => setSidebarOpen((open) => !open)}>☰</button><div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{viewLabel}</strong></div><div className="top-actions"><span className="today">{today}</span><button className="icon-button" aria-label="Notifications">♧<i /></button><span className="top-avatar">AD</span></div></header>

        {view === 'overview' && <section className="view active-view">
          <div className="page-heading"><div><p className="eyebrow">{todayLong}</p><h1>Good morning, Admin <span className="wave">✦</span></h1><p className="subheading">Here’s what’s happening at your school today.</p></div><button className="button button-primary" onClick={() => setShowStudentForm(true)}><span>＋</span> Add a student</button></div>
          <section className="hero-card"><img src={campus} alt="Modern school campus surrounded by greenery" /><div className="hero-overlay" /><div className="hero-copy"><span className="hero-tag"><span className="live-dot" /> SCHOOL OVERVIEW</span><h2>A great day to make<br />learning happen.</h2><p>Your school at a glance. Keep everything moving, one day at a time.</p><button className="hero-link" onClick={() => navigate('classes')}>Explore classes <span>→</span></button></div><div className="hero-date"><span>ACADEMIC YEAR</span><strong>2026 – 27</strong></div></section>
          <div className="section-heading"><div><h2>Today at a glance</h2><p>Key numbers across your school</p></div><span className="updated-label"><span className="status-dot" /> Live overview</span></div>
          <div className="stats-grid">
            <StatCard icon="♙" iconClass="icon-violet" kicker="ALL ENROLLED" value={String(students.length)} caption="Total students" action="View all" onAction={() => navigate('students')} spark="spark-purple" />
            <StatCard icon="✓" iconClass="icon-green" kicker="FEE STATUS" value={String(paidCount)} caption={`Fees paid ${percentagePaid}%`} action="View status" onAction={() => navigate('fees')} progress={percentagePaid} />
            <StatCard icon="◷" iconClass="icon-amber" kicker="ACTION NEEDED" value={String(unpaidStudents.length)} caption="Fees unpaid" action="Follow up" onAction={() => navigate('fees')} progress={100 - percentagePaid} amber />
            <StatCard icon="▤" iconClass="icon-blue" kicker="LEARNING GROUPS" value={`${classNames.length} classes`} caption={`Across ${classNames.length * 2} sections`} action="Explore" onAction={() => navigate('classes')} spark="spark-blue" />
          </div>
          <div className="dashboard-grid"><section className="panel recent-panel"><div className="panel-heading"><div><h2>Recently added students</h2><p>Your latest student records</p></div><button className="text-link" onClick={() => navigate('students')}>View students <span>→</span></button></div><div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>CLASS</th><th>ADMISSION NO.</th><th>FEE STATUS</th></tr></thead><tbody>{students.slice(0, 5).map((student, index) => <tr key={student.id}><td><Person student={student} index={index} /></td><td>Class {student.classNo} · Section {student.section}</td><td>{student.admission}</td><td><FeePill status={student.fee} /></td></tr>)}</tbody></table></div></section>
            <section className="panel quick-panel"><div className="panel-heading"><div><h2>Quick actions</h2><p>Common tasks, one click away</p></div></div><QuickAction icon="＋" tone="quick-violet" title="Register student" subtitle="Add a student record" onClick={() => setShowStudentForm(true)} /><QuickAction icon="▤" tone="quick-blue" title="Manage classes" subtitle="Review classes & sections" onClick={() => navigate('classes')} /><QuickAction icon="₹" tone="quick-amber" title="Check fee status" subtitle="See unpaid student fees" onClick={() => navigate('fees')} /><div className="note-card"><span>✦</span><p><strong>Small steps, big impact.</strong><br />Keep student records up to date for a smoother school day.</p></div></section></div>
          <Footer />
        </section>}

        {view === 'students' && <section className="view active-view"><div className="page-heading"><div><p className="eyebrow">SCHOOL DIRECTORY</p><h1>Students</h1><p className="subheading">Browse student records and classroom placements.</p></div><button className="button button-primary" onClick={() => setShowStudentForm(true)}><span>＋</span> Add a student</button></div><section className="panel list-panel"><div className="filter-bar"><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or admission number" /></label><select value={classFilter} onChange={(event) => setClassFilter(event.target.value)} aria-label="Filter by class"><option value="">All classes</option>{classNames.map((name, index) => <option key={name} value={String(index + 1)}>{name}</option>)}</select><select value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)} aria-label="Filter by section"><option value="">All sections</option><option value="A">Section A</option><option value="B">Section B</option></select></div><div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>ADMISSION NO.</th><th>CLASS &amp; SECTION</th><th>FEE STATUS</th><th>STATUS</th></tr></thead><tbody>{filteredStudents.length ? filteredStudents.map((student, index) => <tr key={student.id}><td><Person student={student} index={index} /></td><td>{student.admission}</td><td>Class {student.classNo} · Section {student.section}</td><td><FeePill status={student.fee} /></td><td><span className="status-pill active-pill">{student.active ? 'Active' : 'Inactive'}</span></td></tr>) : <tr><td className="empty-state" colSpan={5}>No students match these filters.</td></tr>}</tbody></table></div><div className="table-foot"><span>Showing {filteredStudents.length} of {students.length} students</span><span>Prototype data · API integration is the next step</span></div></section><Footer /></section>}

        {view === 'classes' && <section className="view active-view"><div className="page-heading"><div><p className="eyebrow">ACADEMIC STRUCTURE</p><h1>Classes &amp; sections</h1><p className="subheading">Organize learners into classes and sections.</p></div><button className="button button-primary" onClick={addClass}><span>＋</span> Add a class</button></div><div className="class-grid">{classNames.map((name, index) => { const classNo = index + 1; const classStudents = students.filter((student) => student.classNo === classNo); return <article className="class-card" key={name}><div className="class-card-head"><span className="class-symbol">▤</span><span className="class-number">CLASS {String(classNo).padStart(2, '0')}</span></div><h3>{name}</h3><p>Main Campus</p><div className="class-metrics"><span><strong>{classStudents.length}</strong><small>Students</small></span><span><strong>2</strong><small>Sections</small></span></div>{['A', 'B'].map((section) => <div className="section-row" key={section}><span>Section {section}</span><b>{classStudents.filter((student) => student.section === section).length} students</b></div>)}</article> })}</div><Footer /></section>}

        {view === 'fees' && <section className="view active-view"><div className="page-heading"><div><p className="eyebrow">PAYMENTS OVERVIEW</p><h1>Fee status</h1><p className="subheading">A clear view of paid and outstanding student fees.</p></div><span className="updated-label"><span className="status-dot" /> All students</span></div><div className="fee-summary"><FeeSummaryCard icon="♙" tone="fee-total" label="TOTAL STUDENTS" value={students.length} detail="Across all classes" /><FeeSummaryCard icon="✓" tone="fee-paid" label="FEES PAID" value={paidCount} detail="Students marked paid" /><FeeSummaryCard icon="◷" tone="fee-unpaid" label="FEES UNPAID" value={unpaidStudents.length} detail="Follow-up may be needed" /></div><section className="panel list-panel"><div className="panel-heading fee-table-heading"><div><h2>Students with unpaid fees</h2><p>Review the list and update a student’s fee status</p></div><span className="unpaid-badge"><i /> {unpaidStudents.length} unpaid</span></div><div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>ADMISSION NO.</th><th>CLASS &amp; SECTION</th><th>FEE STATUS</th><th /></tr></thead><tbody>{unpaidStudents.length ? unpaidStudents.map((student, index) => <tr key={student.id}><td><Person student={student} index={index} /></td><td>{student.admission}</td><td>Class {student.classNo} · Section {student.section}</td><td><FeePill status={student.fee} /></td><td><button className="mark-paid" onClick={() => markPaid(student.id)}>Mark paid</button></td></tr>) : <tr><td className="empty-state" colSpan={5}>All students are marked paid.</td></tr>}</tbody></table></div><div className="table-foot"><span>Showing {unpaidStudents.length} unpaid students</span><span>Sample fee status · no payment history</span></div></section><Footer /></section>}
      </main>

      {showStudentForm && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowStudentForm(false) }}><section className="student-modal" role="dialog" aria-modal="true" aria-labelledby="studentModalTitle"><div className="modal-heading"><div><p className="eyebrow">STUDENT RECORD</p><h2 id="studentModalTitle">Register a student</h2><p className="subheading">Prototype only — saved in this browser session.</p></div><button className="modal-close" onClick={() => setShowStudentForm(false)} aria-label="Close">×</button></div><form onSubmit={addStudent}><div className="form-grid"><label>First name<input name="firstName" required maxLength={100} /></label><label>Last name<input name="lastName" maxLength={100} /></label><label>Admission number<input name="admissionNumber" required maxLength={50} /></label><label>Email<input name="email" type="email" maxLength={150} /></label><label>Mobile<input name="mobile" maxLength={20} /></label><label>Class<select name="classNo">{classNames.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}</select></label><label>Section<select name="section"><option value="A">Section A</option><option value="B">Section B</option></select></label></div><p className="form-note">New students start with fee status Unpaid.</p><div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setShowStudentForm(false)}>Cancel</button><button type="submit" className="button button-primary">Save student</button></div></form></section></div>}
      {toast && <div className="toast show" role="status" aria-live="polite">{toast}</div>}
    </>
  )
}

function StatCard({ icon, iconClass, kicker, value, caption, action, onAction, spark, progress, amber = false }: { icon: string; iconClass: string; kicker: string; value: string; caption: string; action: string; onAction: () => void; spark?: string; progress?: number; amber?: boolean }) {
  return <article className="stat-card"><div className="stat-top"><span className={`stat-icon ${iconClass}`}>{icon}</span><span className="stat-kicker">{kicker}</span><span className="stat-menu">•••</span></div><strong className="stat-value">{value.includes(' classes') ? <>{value.replace(' classes', '')}<small> classes</small></> : value}</strong><div className="stat-bottom"><span className="stat-caption">{caption}</span><button className={`text-link ${amber ? 'text-amber' : ''}`} onClick={onAction}>{action} <span>→</span></button></div>{spark && <div className={`sparkline ${spark}`}>{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</div>}{progress !== undefined && <div className="progress-track"><span className={amber ? 'progress-amber' : 'progress-green'} style={{ width: `${progress}%` }} /></div>}</article>
}

function Person({ student, index }: { student: Student; index: number }) {
  const initials = `${student.name[0] ?? ''}${student.surname[0] ?? ''}`.toUpperCase()
  return <div className="student-cell"><span className={`student-avatar color-${index % 4}`}>{initials}</span><span><strong>{student.name} {student.surname}</strong><small>Class {student.classNo} · Section {student.section}</small></span></div>
}

function FeePill({ status }: { status: FeeStatus }) {
  return <span className={`status-pill ${status === 'PAID' ? 'paid-pill' : 'unpaid-pill'}`}>{status === 'PAID' ? 'Paid' : 'Unpaid'}</span>
}

function QuickAction({ icon, tone, title, subtitle, onClick }: { icon: string; tone: string; title: string; subtitle: string; onClick: () => void }) {
  return <button className="quick-action" onClick={onClick}><span className={`quick-icon ${tone}`}>{icon}</span><span><strong>{title}</strong><small>{subtitle}</small></span><b>→</b></button>
}

function FeeSummaryCard({ icon, tone, label, value, detail }: { icon: string; tone: string; label: string; value: number; detail: string }) {
  return <article className={`fee-card ${tone}`}><span className="fee-icon">{icon}</span><small>{label}</small><strong>{value}</strong><span>{detail}</span></article>
}

function Footer() {
  return <footer className="footer">© 2026 CampusFlow <span>Built for better school days</span></footer>
}

export default App
