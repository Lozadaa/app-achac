import { CourseList } from '@/types/Courses'
import { format, isAfter, parseISO, differenceInCalendarDays } from 'date-fns'
import { es } from 'date-fns/locale'
import moment from 'moment'

type CourseSchedule = {
  start_time: string // Formato ISO (e.g., 2000-01-01T19:00:00.000-03:00)
}

// Función para combinar fecha y hora en un objeto de fecha
const combineDateAndTime = (start_time: string): Date => {
  const datetime = parseISO(start_time)
  return new Date(
    datetime.getFullYear(),
    datetime.getMonth(),
    datetime.getDate(),
    datetime.getHours(),
    datetime.getMinutes(),
    datetime.getSeconds()
  )
}

// Filtrar las clases futuras
const filterFutureClasses = (
  courses: CourseSchedule[],
  now: Date
): CourseSchedule[] => {
  return courses.filter(({ start_time }) =>
    isAfter(combineDateAndTime(start_time), now)
  )
}

// Obtener la clase más cercana
const getClosestClass = (courses: CourseSchedule[]): CourseSchedule | null => {
  return (
    courses.sort(
      (a, b) =>
        parseISO(a.start_time).getTime() - parseISO(b.start_time).getTime()
    )[0] || null
  )
}

// Función principal
export const getNextClassBySchedules = (
  courses: CourseSchedule[]
): string | undefined => {
  const now = new Date() // Fecha actual
  const futureClasses = filterFutureClasses(courses, now) // Filtrar clases futuras
  const nextClass = getClosestClass(futureClasses) // Obtener la más cercana

  if (!nextClass) return undefined

  const nextClassTime = parseISO(nextClass.start_time)

  // Calcular la diferencia en días
  const daysDifference = differenceInCalendarDays(nextClassTime, now)

  // Generar una salida legible según la proximidad
  if (daysDifference === 0) {
    return `La próxima clase es hoy a las ${format(nextClassTime, 'HH:mm', {
      locale: es
    })}`
  } else if (daysDifference === 1) {
    return `La próxima clase es mañana a las ${format(nextClassTime, 'HH:mm', {
      locale: es
    })}`
  } else if (daysDifference <= 7) {
    return `La próxima clase es este ${format(
      nextClassTime,
      "EEEE 'a las' HH:mm",
      { locale: es }
    )}`
  } else {
    return `La próxima clase es el ${format(
      nextClassTime,
      "EEEE dd 'de' MMMM 'a las' HH:mm",
      { locale: es }
    )}`
  }
}

type DetailedCourseSchedule = {
  id: string
  type: string
  attributes: {
    id: number
    start_date: string
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

const filterFutureDetailedClasses = (
  courses: DetailedCourseSchedule[],
  now: Date
): DetailedCourseSchedule[] => {
  return courses.filter(({ attributes: { start_date } }) =>
    isAfter(combineDateAndTime(start_date), now)
  )
}

const getClosestDetailedClass = (
  courses: DetailedCourseSchedule[]
): DetailedCourseSchedule | null => {
  return (
    courses.sort(
      (a, b) =>
        parseISO(a.attributes.start_date).getTime() -
        parseISO(b.attributes.start_date).getTime()
    )[0] || null
  )
}

export const getNextDetailedClassBySchedules = (
  courses: DetailedCourseSchedule[]
): string | undefined => {
  const now = new Date() // Fecha actual
  const futureClasses = filterFutureDetailedClasses(courses, now) // Filtrar clases futuras
  const nextClass = getClosestDetailedClass(futureClasses) // Obtener la más cercana

  if (!nextClass) return undefined

  const nextClassTime = parseISO(nextClass.attributes.start_date)

  // Calcular la diferencia en días
  const daysDifference = differenceInCalendarDays(nextClassTime, now)

  // Generar una salida legible según la proximidad
  if (daysDifference === 0) {
    return `La próxima clase es hoy a las ${format(nextClassTime, 'HH:mm', {
      locale: es
    })}`
  } else if (daysDifference === 1) {
    return `La próxima clase es mañana a las ${format(nextClassTime, 'HH:mm', {
      locale: es
    })}`
  } else if (daysDifference <= 7) {
    return `La próxima clase es este ${format(
      nextClassTime,
      "EEEE 'a las' HH:mm",
      { locale: es }
    )}`
  } else {
    return `La próxima clase es el ${format(
      nextClassTime,
      "EEEE dd 'de' MMMM 'a las' HH:mm",
      { locale: es }
    )}`
  }
}

export const getClosestCourses = (data: CourseList | undefined) => {
  const now = moment()
  const courseMap = new Map<string, CourseList[number]>()

  data?.forEach((item) => {
    const { course_name, start_date } = item.attributes
    const courseTime = moment(start_date)
    if (courseTime.isBefore(now)) return

    if (
      !courseMap.has(course_name) ||
      courseTime.isBefore(
        moment(courseMap.get(course_name)?.attributes.start_date)
      )
    ) {
      courseMap.set(course_name, item)
    }
  })
  return Array.from(courseMap.values())
}
