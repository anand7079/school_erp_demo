export type Branch = { id: number; name: string; code: string; schoolId: number; active: boolean }
export type School = { id: number; name: string; address?: string; active: boolean }
export type SchoolClass = { id: number; branchId: number; branchName: string; name: string; code?: string; description?: string; active: boolean }
export type Section = { id: number; classId: number; className: string; branchId: number; name: string; capacity?: number; active: boolean }
export type FeeStatus = 'PAID' | 'UNPAID'
export type Student = {
  id: number; schoolId: number; branchId: number; branchName: string
  classId: number | null; className: string | null; sectionId: number | null; sectionName: string | null
  admissionNumber: string; firstName: string; lastName: string | null; dateOfBirth: string | null
  email: string | null; mobile: string | null; active: boolean; feeStatus: FeeStatus
  createdAt: string | null
}
export type FeeSummary = { paidCount: number; unpaidCount: number; activeStudentCount: number }
export type PageResponse<T> = { content: T[]; number: number; size: number; totalElements: number; totalPages: number }
export type StudentCreate = { branchId: number; classId: number; sectionId: number; admissionNumber: string; firstName: string; lastName?: string; dateOfBirth?: string; email?: string; mobile?: string }

const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) { super(message); this.name = 'ApiError'; this.status = status }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${apiBase}${path}`, {
      ...init,
      headers: { ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers },
    })
  } catch {
    throw new ApiError(`Cannot reach the backend at ${apiBase}. Check that Spring Boot is running and CORS allows this frontend origin.`, 0)
  }
  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`
    try {
      const body = await response.json() as { message?: string; details?: Record<string, string>; error?: string }
      message = body.message || body.error || message
      const fields = body.details ? Object.entries(body.details).map(([field, detail]) => `${field}: ${detail}`).join(' · ') : ''
      if (fields) message += ` — ${fields}`
    } catch { /* use the HTTP status when the response is not JSON */ }
    throw new ApiError(message, response.status)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string) => request<T>(path, { method: 'PATCH' }),
}

export async function getAllStudents(): Promise<Student[]> {
  const students: Student[] = []
  let page = 0
  let pages = 1
  while (page < pages) {
    const result = await api.get<PageResponse<Student>>(`/students?page=${page}&size=100`)
    students.push(...result.content)
    pages = Math.max(result.totalPages, 1)
    page++
  }
  return students
}

export function getBranches() { return api.get<Branch[]>('/branches') }
export function getSchool() { return api.get<School>('/schools') }
export function getClasses(branchId: number) { return api.get<SchoolClass[]>(`/classes?branchId=${branchId}`) }
export function getSections(classId: number) { return api.get<Section[]>(`/sections?classId=${classId}`) }
export function getFeeSummary() { return api.get<FeeSummary>('/students/fees/summary') }
export function getUnpaidStudents() { return api.get<Student[]>('/students/fees/unpaid') }
export function createClass(branchId: number, name: string, code: string, description: string) {
  return api.post<SchoolClass>('/classes', { branchId, name, code: code || null, description: description || null })
}
export function createSection(classId: number, name: string, capacity?: number) {
  return api.post<Section>('/sections', { classId, name, capacity: capacity || null })
}
export function createStudent(body: StudentCreate) { return api.post<Student>('/students', body) }
export function changeFeeStatus(studentId: number, status: FeeStatus) {
  return api.patch<Student>(`/students/${studentId}/fee-status?status=${status}`)
}
