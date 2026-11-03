import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import campus from './assets/school-campus.jpg'
import {
  changeFeeStatus, createClass, createSection, createStudent, getAllStudents,
  getBranches, getClasses, getFeeSummary, getSchool, getSections, getUnpaidStudents,
} from './api'
import type { Branch, FeeStatus, FeeSummary, School, SchoolClass, Section, Student } from './api'
import './App.css'

type View = 'overview' | 'students' | 'classes' | 'fees'
type ClassWithSections = SchoolClass & { sections: Section[] }

const navItems: { id: View; icon: string; label: string }[] = [
  { id: 'overview', icon: '⌂', label: 'Overview' },
  { id: 'students', icon: '♙', label: 'Students' },
  { id: 'classes', icon: '▤', label: 'Classes & sections' },
  { id: 'fees', icon: '₹', label: 'Fee status' },
]

function App() {
  const [school, setSchool] = useState<School | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [branchId, setBranchId] = useState<number | null>(null)
  const [classes, setClasses] = useState<ClassWithSections[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [unpaidStudents, setUnpaidStudents] = useState<Student[]>([])
  const [feeSummary, setFeeSummary] = useState<FeeSummary>({ paidCount: 0, unpaidCount: 0, activeStudentCount: 0 })
  const [view, setView] = useState<View>('overview')
  const [query, setQuery] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [sectionFilter, setSectionFilter] = useState('')
  const [formClassId, setFormClassId] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showStudentForm, setShowStudentForm] = useState(false)

  const branch = branches.find((item) => item.id === branchId) ?? branches[0] ?? null
  const currentClasses = classes.filter((item) => item.branchId === branch?.id)
  const paidCount = feeSummary.paidCount
  const unpaidCount = feeSummary.unpaidCount
  const percentagePaid = feeSummary.activeStudentCount
    ? Math.round((paidCount / feeSummary.activeStudentCount) * 100) : 0
  const selectedFormSections = classes.find((item) => item.id === Number(formClassId))?.sections.filter((item) => item.active) ?? []
  const filteredStudents = useMemo(() => students.filter((student) => {
    const text = `${student.firstName} ${student.lastName ?? ''} ${student.admissionNumber}`.toLowerCase()
    return (!query || text.includes(query.toLowerCase()))
      && (!classFilter || String(student.classId ?? '') === classFilter)
      && (!sectionFilter || student.sectionName === sectionFilter)
  }), [students, query, classFilter, sectionFilter])

  async function loadWorkspace(showLoading = true) {
    if (showLoading) setLoading(true)
    setError('')
    try {
      const [schoolData, branchData, studentData, summaryData, unpaidData] = await Promise.all([
        getSchool(), getBranches(), getAllStudents(), getFeeSummary(), getUnpaidStudents(),
      ])
      const branchClasses = (await Promise.all(branchData.map(async (item) => {
        const rows = await getClasses(item.id)
        return Promise.all(rows.map(async (schoolClass) => ({ ...schoolClass, sections: await getSections(schoolClass.id) })))
      }))).flat()
      setSchool(schoolData)
      setBranches(branchData)
      setBranchId((current) => current && branchData.some((item) => item.id === current)
        ? current : branchData[0]?.id ?? null)
      setClasses(branchClasses)
      setStudents(studentData)
      setFeeSummary(summaryData)
      setUnpaidStudents(unpaidData)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load data from the backend.')
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => { void loadWorkspace() }, [])

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  function navigate(nextView: View) {
    setView(nextView)
    setSidebarOpen(false)
  }

  async function markFeeStatus(student: Student, status: FeeStatus) {
    setSaving(true)
    setError('')
    try {
      await changeFeeStatus(student.id, status)
      await loadWorkspace(false)
      notify(`${student.firstName} ${student.lastName ?? ''} marked ${status.toLowerCase()}.`)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update fee status.')
    } finally { setSaving(false) }
  }

  async function onCreateStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!branch || !formClassId) { notify('Create or select a class before adding a student.'); return }
    const data = new FormData(event.currentTarget)
    setSaving(true)
    setError('')
    try {
      await createStudent({
        branchId: branch.id,
        classId: Number(formClassId),
        sectionId: Number(data.get('sectionId')),
        admissionNumber: String(data.get('admissionNumber')).trim(),
        firstName: String(data.get('firstName')).trim(),
        lastName: String(data.get('lastName')).trim() || undefined,
        dateOfBirth: String(data.get('dateOfBirth')) || undefined,
        email: String(data.get('email')).trim() || undefined,
        mobile: String(data.get('mobile')).trim() || undefined,
      })
      setShowStudentForm(false)
      await loadWorkspace(false)
      navigate('students')
      notify('Student created successfully.')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not create student.')
    } finally { setSaving(false) }
  }

  async function onCreateClass() {
    if (!branch) { notify('Register a school and branch before creating classes.'); return }
    const name = window.prompt('Class name (for example, Class 6)')?.trim()
    if (!name) return
    const code = window.prompt('Optional class code', '')?.trim() ?? ''
    setSaving(true)
    setError('')
    try {
      await createClass(branch.id, name, code, '')
      await loadWorkspace(false)
      notify(`${name} created.`)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not create class.')
    } finally { setSaving(false) }
  }

  async function onCreateSection(schoolClass: SchoolClass) {
    const name = window.prompt(`Section name for ${schoolClass.name} (for example, A)`)?.trim()
    if (!name) return
    setSaving(true)
    setError('')
    try {
      await createSection(schoolClass.id, name)
      await loadWorkspace(false)
      notify(`Section ${name} created in ${schoolClass.name}.`)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not create section.')
    } finally { setSaving(false) }
  }

  const viewLabel = navItems.find((item) => item.id === view)?.label ?? 'Overview'
  const today = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())
  const todayLong = new Intl.DateTimeFormat('en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()).toUpperCase()

  return <>
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <a className="brand" href="#overview" onClick={(event) => { event.preventDefault(); navigate('overview') }}><span className="brand-mark">C</span><span><strong>CampusFlow</strong><small>SCHOOL ERP</small></span></a>
      <div className="school-switcher"><span className="school-avatar">{(school?.name ?? 'MS').slice(0, 2).toUpperCase()}</span><span className="school-identity"><strong>{school?.name ?? 'School not registered'}</strong>{branches.length > 1 ? <select aria-label="Select branch" value={branchId ?? ''} onChange={(event) => setBranchId(Number(event.target.value))}>{branches.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select> : <small>{branch?.name ?? 'Register a branch to continue'}</small>}</span><span className="chevron">⌄</span></div>
      <nav className="main-nav" aria-label="Main navigation"><p className="nav-label">WORKSPACE</p>{navItems.map((item) => <button key={item.id} className={`nav-item ${view === item.id ? 'active' : ''}`} onClick={() => navigate(item.id)}><span className="nav-icon">{item.icon}</span>{item.label}{item.id === 'students' && <span className="nav-count">{students.length}</span>}{item.id === 'fees' && <span className="nav-dot" />}</button>)}<p className="nav-label nav-spaced">ADMINISTRATION</p><button className="nav-item muted" onClick={() => notify('Staff management is planned for a later phase.')}><span className="nav-icon">♧</span>Staff<span className="soon">Soon</span></button><button className="nav-item muted" onClick={() => notify('Attendance is planned for a later phase.')}><span className="nav-icon">▦</span>Attendance<span className="soon">Soon</span></button></nav>
      <div className="sidebar-bottom"><div className="help-card"><span className="help-icon">?</span><div><strong>{error ? 'Connection issue' : loading ? 'Connecting…' : 'Backend connected'}</strong><small>{branch?.name ?? import.meta.env.VITE_API_BASE_URL}</small></div><span className="arrow">●</span></div><div className="profile"><span className="profile-avatar">AD</span><span><strong>School Admin</strong><small>Administrator</small></span><button className="more" aria-label="Profile menu">•••</button></div></div>
    </aside>

    <main className="main-shell">
      <header className="topbar"><button className="mobile-menu" aria-label="Open menu" onClick={() => setSidebarOpen((open) => !open)}>☰</button><div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{viewLabel}</strong></div><div className="top-actions"><span className="today">{today}</span><button className="icon-button" aria-label="Refresh data" onClick={() => void loadWorkspace()} title="Refresh data">↻</button><span className="top-avatar">AD</span></div></header>
      {error && <div className="api-alert" role="alert"><span><strong>Backend request failed</strong><small>{error}</small></span><button onClick={() => void loadWorkspace()}>Retry</button></div>}
      {loading && <div className="loading-banner"><span className="loading-spinner" /> Loading school data from the backend…</div>}

      {view === 'overview' && <section className="view active-view">
        <div className="page-heading"><div><p className="eyebrow">{todayLong}</p><h1>Good morning, Admin <span className="wave">✦</span></h1><p className="subheading">Here’s what’s happening at {school?.name ?? 'your school'} today.</p></div><button className="button button-primary" disabled={loading || !branch} onClick={() => { setFormClassId(String(currentClasses.find((item) => item.active)?.id ?? '')); setShowStudentForm(true) }}><span>＋</span> Add a student</button></div>
        <section className="hero-card"><img src={campus} alt="Sample modern school campus surrounded by greenery" /><div className="hero-overlay" /><div className="hero-copy"><span className="hero-tag"><span className="live-dot" /> SCHOOL OVERVIEW</span><h2>A great day to make<br />learning happen.</h2><p>Your school at a glance. Keep everything moving, one day at a time.</p><button className="hero-link" onClick={() => navigate('classes')}>Explore classes <span>→</span></button></div><div className="hero-date"><span>ACADEMIC YEAR</span><strong>2026 – 27</strong></div></section>
        <div className="section-heading"><div><h2>Today at a glance</h2><p>Live figures from your school database</p></div><span className="updated-label"><span className="status-dot" /> Backend data</span></div>
        <div className="stats-grid"><StatCard icon="♙" iconClass="icon-violet" kicker="ALL ENROLLED" value={String(students.length)} caption="Total students" action="View all" onAction={() => navigate('students')} spark="spark-purple" /><StatCard icon="✓" iconClass="icon-green" kicker="FEE STATUS" value={String(paidCount)} caption={`Fees paid ${percentagePaid}%`} action="View status" onAction={() => navigate('fees')} progress={percentagePaid} /><StatCard icon="◷" iconClass="icon-amber" kicker="ACTION NEEDED" value={String(unpaidCount)} caption="Fees unpaid" action="Follow up" onAction={() => navigate('fees')} progress={100 - percentagePaid} amber /><StatCard icon="▤" iconClass="icon-blue" kicker="LEARNING GROUPS" value={`${currentClasses.length} classes`} caption={`Across ${currentClasses.reduce((total, item) => total + item.sections.length, 0)} sections`} action="Explore" onAction={() => navigate('classes')} spark="spark-blue" /></div>
        <div className="dashboard-grid"><section className="panel recent-panel"><div className="panel-heading"><div><h2>Student records</h2><p>Recently returned by the student API</p></div><button className="text-link" onClick={() => navigate('students')}>View students <span>→</span></button></div><div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>CLASS</th><th>ADMISSION NO.</th><th>FEE STATUS</th></tr></thead><tbody>{students.slice(0, 5).map((student, index) => <tr key={student.id}><td><Person student={student} index={index} /></td><td>{student.className ?? '—'}{student.sectionName ? ` · Section ${student.sectionName}` : ''}</td><td>{student.admissionNumber}</td><td><FeePill status={student.feeStatus} /></td></tr>)}</tbody></table>{!students.length && <EmptyMessage loading={loading} message="No students found. Add your first student to get started." />}</div></section><section className="panel quick-panel"><div className="panel-heading"><div><h2>Quick actions</h2><p>Common tasks, one click away</p></div></div><QuickAction icon="＋" tone="quick-violet" title="Register student" subtitle="Add a student record" onClick={() => { setFormClassId(String(currentClasses.find((item) => item.active)?.id ?? '')); setShowStudentForm(true) }} /><QuickAction icon="▤" tone="quick-blue" title="Manage classes" subtitle="Review classes & sections" onClick={() => navigate('classes')} /><QuickAction icon="₹" tone="quick-amber" title="Check fee status" subtitle="See unpaid student fees" onClick={() => navigate('fees')} /><div className="note-card"><span>✦</span><p><strong>Live school data.</strong><br />Changes are saved to the connected backend.</p></div></section></div><Footer />
      </section>}

      {view === 'students' && <section className="view active-view"><div className="page-heading"><div><p className="eyebrow">SCHOOL DIRECTORY</p><h1>Students</h1><p className="subheading">Browse student records and classroom placements.</p></div><button className="button button-primary" disabled={loading || !branch} onClick={() => { setFormClassId(String(currentClasses.find((item) => item.active)?.id ?? '')); setShowStudentForm(true) }}><span>＋</span> Add a student</button></div><section className="panel list-panel"><div className="filter-bar"><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or admission number" /></label><select value={classFilter} onChange={(event) => setClassFilter(event.target.value)} aria-label="Filter by class"><option value="">All classes</option>{classes.map((item) => <option key={item.id} value={String(item.id)}>{item.name}</option>)}</select><select value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)} aria-label="Filter by section"><option value="">All sections</option>{Array.from(new Set(classes.flatMap((item) => item.sections.map((section) => section.name)))).map((name) => <option key={name} value={name}>Section {name}</option>)}</select></div><div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>ADMISSION NO.</th><th>CLASS &amp; SECTION</th><th>FEE STATUS</th><th>STATUS</th></tr></thead><tbody>{filteredStudents.length ? filteredStudents.map((student, index) => <tr key={student.id}><td><Person student={student} index={index} /></td><td>{student.admissionNumber}</td><td>{student.className ?? '—'}{student.sectionName ? ` · Section ${student.sectionName}` : ''}</td><td><FeePill status={student.feeStatus} /></td><td><span className="status-pill active-pill">{student.active ? 'Active' : 'Inactive'}</span></td></tr>) : <tr><td className="empty-state" colSpan={5}>{loading ? 'Loading students…' : 'No students match these filters.'}</td></tr>}</tbody></table></div><div className="table-foot"><span>Showing {filteredStudents.length} of {students.length} students</span><span>Loaded from the student API</span></div></section><Footer /></section>}

      {view === 'classes' && <section className="view active-view"><div className="page-heading"><div><p className="eyebrow">ACADEMIC STRUCTURE</p><h1>Classes &amp; sections</h1><p className="subheading">{branch?.name ?? 'Select a branch'} · Classes and sections from the backend</p></div><button className="button button-primary" disabled={saving || !branch} onClick={() => void onCreateClass()}><span>＋</span> Add a class</button></div><div className="class-grid">{currentClasses.map((item) => { const classStudents = students.filter((student) => student.classId === item.id); return <article className="class-card" key={item.id}><div className="class-card-head"><span className="class-symbol">▤</span><span className="class-number">{item.code || `CLASS ${String(item.id).padStart(2, '0')}`}</span></div><h3>{item.name}</h3><p>{item.branchName} · {item.active ? 'Active' : 'Inactive'}</p><div className="class-metrics"><span><strong>{classStudents.length}</strong><small>Students</small></span><span><strong>{item.sections.length}</strong><small>Sections</small></span></div>{item.sections.map((section) => <div className="section-row" key={section.id}><span>Section {section.name}{!section.active && ' · Inactive'}</span><b>{classStudents.filter((student) => student.sectionId === section.id).length} students</b></div>)}<button className="text-link section-add" disabled={saving || !item.active} onClick={() => void onCreateSection(item)}>＋ Add a section</button></article>})}{!currentClasses.length && <div className="empty-panel">{loading ? 'Loading classes…' : 'No classes for this branch yet. Use “Add a class” to create one.'}</div>}</div><Footer /></section>}

      {view === 'fees' && <section className="view active-view"><div className="page-heading"><div><p className="eyebrow">PAYMENTS OVERVIEW</p><h1>Fee status</h1><p className="subheading">A clear view of paid and outstanding student fees.</p></div><span className="updated-label"><span className="status-dot" /> All students</span></div><div className="fee-summary"><FeeSummaryCard icon="♙" tone="fee-total" label="TOTAL STUDENTS" value={feeSummary.activeStudentCount} detail="Active students" /><FeeSummaryCard icon="✓" tone="fee-paid" label="FEES PAID" value={paidCount} detail="Students marked paid" /><FeeSummaryCard icon="◷" tone="fee-unpaid" label="FEES UNPAID" value={unpaidCount} detail="Follow-up may be needed" /></div><section className="panel list-panel"><div className="panel-heading fee-table-heading"><div><h2>Students with unpaid fees</h2><p>Update fee status in the school database</p></div><span className="unpaid-badge"><i /> {unpaidStudents.length} unpaid</span></div><div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>ADMISSION NO.</th><th>CLASS &amp; SECTION</th><th>FEE STATUS</th><th /></tr></thead><tbody>{unpaidStudents.length ? unpaidStudents.map((student, index) => <tr key={student.id}><td><Person student={student} index={index} /></td><td>{student.admissionNumber}</td><td>{student.className ?? '—'}{student.sectionName ? ` · Section ${student.sectionName}` : ''}</td><td><FeePill status={student.feeStatus} /></td><td><button className="mark-paid" disabled={saving} onClick={() => void markFeeStatus(student, 'PAID')}>Mark paid</button></td></tr>) : <tr><td className="empty-state" colSpan={5}>{loading ? 'Loading fee data…' : 'No unpaid students found.'}</td></tr>}</tbody></table></div><div className="table-foot"><span>Showing {unpaidStudents.length} unpaid students</span><span>Fee status is a simple paid/unpaid flag</span></div></section><Footer /></section>}
    </main>

    {showStudentForm && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowStudentForm(false) }}><section className="student-modal" role="dialog" aria-modal="true" aria-labelledby="studentModalTitle"><div className="modal-heading"><div><p className="eyebrow">STUDENT RECORD</p><h2 id="studentModalTitle">Register a student</h2><p className="subheading">Saved to {school?.name ?? 'your school'} in the backend.</p></div><button className="modal-close" onClick={() => setShowStudentForm(false)} aria-label="Close">×</button></div><form onSubmit={(event) => void onCreateStudent(event)}><div className="form-grid"><label>First name<input name="firstName" required maxLength={100} /></label><label>Last name<input name="lastName" maxLength={100} /></label><label>Admission number<input name="admissionNumber" required maxLength={50} /></label><label>Date of birth<input name="dateOfBirth" type="date" /></label><label>Email<input name="email" type="email" maxLength={150} /></label><label>Mobile<input name="mobile" maxLength={20} /></label><label>Class<select value={formClassId} onChange={(event) => setFormClassId(event.target.value)} required><option value="">Select class</option>{currentClasses.filter((item) => item.active).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Section<select name="sectionId" required disabled={!selectedFormSections.length}><option value="">Select section</option>{selectedFormSections.map((item) => <option key={item.id} value={item.id}>Section {item.name}</option>)}</select></label></div><p className="form-note">New students start with fee status Unpaid.</p><div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setShowStudentForm(false)}>Cancel</button><button type="submit" className="button button-primary" disabled={saving || !selectedFormSections.length}>{saving ? 'Saving…' : 'Save student'}</button></div></form></section></div>}
    {toast && <div className="toast show" role="status" aria-live="polite">{toast}</div>}
  </>
}

function StatCard({ icon, iconClass, kicker, value, caption, action, onAction, spark, progress, amber = false }: { icon: string; iconClass: string; kicker: string; value: string; caption: string; action: string; onAction: () => void; spark?: string; progress?: number; amber?: boolean }) {
  const splitValue = value.match(/^(\d+)( classes)$/)
  return <article className="stat-card"><div className="stat-top"><span className={`stat-icon ${iconClass}`}>{icon}</span><span className="stat-kicker">{kicker}</span><span className="stat-menu">•••</span></div><strong className="stat-value">{splitValue ? <>{splitValue[1]}<small>{splitValue[2]}</small></> : value}</strong><div className="stat-bottom"><span className="stat-caption">{caption}</span><button className={`text-link ${amber ? 'text-amber' : ''}`} onClick={onAction}>{action} <span>→</span></button></div>{spark && <div className={`sparkline ${spark}`}>{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>}{progress !== undefined && <div className="progress-track"><span className={amber ? 'progress-amber' : 'progress-green'} style={{ width: `${progress}%` }} /></div>}</article>
}

function Person({ student, index }: { student: Student; index: number }) {
  const initials = `${student.firstName[0] ?? ''}${student.lastName?.[0] ?? ''}`.toUpperCase()
  return <div className="student-cell"><span className={`student-avatar color-${index % 4}`}>{initials}</span><span><strong>{student.firstName} {student.lastName}</strong><small>{student.className ?? 'Unassigned'}{student.sectionName ? ` · Section ${student.sectionName}` : ''}</small></span></div>
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

function EmptyMessage({ loading, message }: { loading: boolean; message: string }) {
  return <div className="empty-state">{loading ? 'Loading…' : message}</div>
}

function Footer() { return <footer className="footer">© 2026 CampusFlow <span>Built for better school days</span></footer> }

export default App
