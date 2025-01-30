export type CourseInitatedList = CourseInitated[]

export type CourseList = Course[]

export type Course = {
  id: string
  type: string
  attributes: {
    id: number
    start_date: string // Fecha en formato ISO
    end_date: string
    course_id: number
    subject_id: number
    headquarter_id: number
    professor_id: number
    status: string
    course_name: string
    course_color: string
    headquarter_name: string
    professor_name: string
    subject_name: string
  }
}

export interface Students {
  student_id: number
  first_name: string
  last_name: string
  attendance_status: string | null
  photo: string
  attendance_id: number
  subject: string
}
export interface CourseInitated {
  id: number
  headquarter_id: number
  headquarter_name: string
  course_id: number
  course_name: string
  professor_id: number
  status: string
  created_at: string
  updated_at: string
  start_time: string
  end_time: string
}

export interface Headquarter {
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

export interface StudentsFeedback {
  data: Datum[]
}

export interface Datum {
  id: string
  type: string
  attributes: Attributes
}

export interface Attributes {
  id: number
  detail: string
  created_at: Date
  student_id: number
}
