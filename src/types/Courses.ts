export type CourseInitatedList = CourseInitated[]

export interface CourseInitated {
  id: number
  headquarter_id: number
  course_id: number
  user_id: number
  status_course: string
  created_at: string
  updated_at: string
  headquarter: Headquarter
  course: Course
  course_schedules: CourseSchedule[]
  user: User
  students: Student[]
}

export interface Headquarter {
  id: number
  name: string
  status: string
  created_at: string
  updated_at: string
  discarded_at: any
}

export interface Course {
  id: number
  name: string
  status: string
  created_at: string
  updated_at: string
  discarded_at: any
}

export interface CourseSchedule {
  id: number
  schedule_day: string
  start_time: string
  end_time: string
  created_at: string
  updated_at: string
  course_initiated_id: number
  discarded_at: any
}

export interface User {
  id: number
  email: string
  name: string
  role: string
  username: any
  status: string
  created_at: string
  updated_at: string
  jti: string
  discarded_at: any
}

export interface Student {
  id: number
  first_name: string
  last_name: string
  address: string
  commune: string
  phone: string
  name_emergency_contact: string
  phone_emergency_contact: string
  rut: string
  rut_expiry_date: string
  passport: string
  passport_expiry_date: string
  license: string
  driver_license: string
  driver_license_expiry_date: string
  company: string
  sipa_password: string
  folio: string
  schedule_mode: string
  status: string
  image: string
  email: string
  nationality: string
  created_at: string
  updated_at: string
  discarded_at: any
}
