import { format, isAfter, parseISO, differenceInCalendarDays } from "date-fns";
import { es } from "date-fns/locale";

type CourseSchedule = {
  schedule_day: string; // Formato YYYY-MM-DD
  start_time: string;   // Formato ISO (e.g., 2000-01-01T19:00:00.000-03:00)
};

// Función para combinar fecha y hora en un objeto de fecha
const combineDateAndTime = (schedule_day: string, start_time: string): Date => {
  const date = parseISO(schedule_day);
  const time = parseISO(start_time);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds()
  );
};

// Filtrar las clases futuras
const filterFutureClasses = (courses: CourseSchedule[], now: Date): CourseSchedule[] => {
  return courses.filter(({ schedule_day, start_time }) => 
    isAfter(combineDateAndTime(schedule_day, start_time), now)
  );
};

// Obtener la clase más cercana
const getClosestClass = (courses: CourseSchedule[]): CourseSchedule | null => {
  return courses.sort((a, b) => 
    combineDateAndTime(a.schedule_day, a.start_time).getTime() - 
    combineDateAndTime(b.schedule_day, b.start_time).getTime()
  )[0] || null;
};

// Función principal
export const getNextClassBySchedules = (courses: CourseSchedule[]): string | undefined => {
  const now = new Date(); // Fecha actual
  const futureClasses = filterFutureClasses(courses, now); // Filtrar clases futuras
  const nextClass = getClosestClass(futureClasses); // Obtener la más cercana

  if (!nextClass) return undefined;

  const nextClassTime = combineDateAndTime(nextClass.schedule_day, nextClass.start_time);

  // Calcular la diferencia en días
  const daysDifference = differenceInCalendarDays(nextClassTime, now);

  // Generar una salida legible según la proximidad
  if (daysDifference === 0) {
    return `La próxima clase es hoy a las ${format(nextClassTime, "HH:mm", { locale: es })}`;
  } else if (daysDifference === 1) {
    return `La próxima clase es mañana a las ${format(nextClassTime, "HH:mm", { locale: es })}`;
  } else if (daysDifference <= 7) {
    return `La próxima clase es este ${format(nextClassTime, "EEEE 'a las' HH:mm", { locale: es })}`;
  } else {
    return `La próxima clase es el ${format(nextClassTime, "EEEE dd 'de' MMMM 'a las' HH:mm", { locale: es })}`;
  }
};