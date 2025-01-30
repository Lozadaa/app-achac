import './Attendants.css'
import { Layout } from '../../components/Layout'
import { useParams } from 'react-router'
import { IonIcon, IonSpinner } from '@ionic/react'
import { arrowBackOutline } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { axiosClient } from '@/utils/axios'
import StudentAttendant from '@/components/StudentItem/StudentAttendant'
import { Students } from '@/types/Courses'

const CustomToolbar: React.FC<{ courseName: string }> = ({ courseName }) => {
  return (
    <div className="header-detail">
      <div className="image-name">
        <IonIcon src={arrowBackOutline} onClick={() => window.history.back()} />
        <h1>{courseName}</h1>
        <div />
      </div>
      <p>Listado de alumnos para el día</p>
    </div>
  )
}

interface StudentAttendance {
  course_schedule_id: string
  student_id?: number
  status: 'present' | 'late' | 'no_present'
}

const Attendants: React.FC = () => {
  const [stateResponse, setStateResponse] = useState<
    'loading' | 'error' | 'success'
  >('success')
  const [students, setStudents] = useState<Students[]>([])
  const [student, setStudent] = useState<Students[]>([])
  const { id: idCourse } = useParams<{ id: string }>()

  useEffect(() => {
    setStateResponse('loading')

    const getStudents = async () => {
      try {
        const { data } = await axiosClient.get<Students[]>(
          '/student/student_attendance/course_schedule',
          {
            params: {
              course_schedule_id: idCourse
            }
          }
        )
        setStudents(data)
        setStateResponse('success')
      } catch (error) {
        setStateResponse('error')
        console.error(error)
      }
    }

    getStudents()
  }, [idCourse])

  const createStudentAttendance = async (data: StudentAttendance) => {
    const dataSend = {
      student_attendance: {
        student_id: data.student_id,
        status: data.status,
        course_schedule_id: data.course_schedule_id
      }
    }
    try {
      const res = await axiosClient.post('/student_attendances', dataSend)
      console.warn('Respuesta del servidor:', res.data)
    } catch (error) {
      console.error('Error en la petición:', error)
    }
  }

  const updateStudentAttendance = async (
    data: StudentAttendance,
    id: number
  ) => {
    const dataSend = {
      student_attendance: {
        status: data.status,
        course_schedule_id: data.course_schedule_id
      }
    }
    try {
      const res = await axiosClient.patch(
        `/student_attendances/${id}`,
        dataSend
      )
      console.warn('Respuesta del servidor:', res.data)
    } catch (error) {
      console.error('Error en la petición:', error)
    }
  }

  const handleOnChange = async (
    id: number,
    value: 'present' | 'late' | 'no_present',
    attendance_id: number | null
  ) => {
    const data = {
      course_schedule_id: idCourse,
      student_id: id,
      status: value
    }
    if (attendance_id === null) {
      await createStudentAttendance(data)
    } else {
      await updateStudentAttendance(data, attendance_id)
    }
  }

  const [searchTerm, setSearchTerm] = useState<string>('')
  useEffect(() => {
    if (searchTerm === '') {
      setStudent(students)
    }
  }, [searchTerm])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    const filteredStudents = students.filter((student) =>
      `${student.first_name} ${student.last_name}`
        .toLowerCase()
        .includes(value.toLowerCase())
    )
    setStudent(filteredStudents)
  }

  return (
    <Layout
      customToolbar={<CustomToolbar courseName={students[0]?.subject} />}
      title={students[0]?.subject}
    >
      <div className="container">
        {stateResponse === 'loading' && (
          <div className="empty-container">
            <IonSpinner name="crescent" />
          </div>
        )}
        {stateResponse === 'success' && students.length === 0 && (
          <h1>No hay alumnos para el día</h1>
        )}

        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar alumno..."
            value={searchTerm}
            onChange={(e) => {
              handleSearchChange(e)
            }}
            className="custom-input"
          />
        </div>

        {stateResponse === 'success' && student.length === 0 && (
          <h1>No hay alumnos para el día</h1>
        )}
        {stateResponse === 'success' &&
          student.map((student: Students) => (
            <StudentAttendant
              key={student.student_id}
              name={`${student.first_name} ${student.last_name}`}
              image={student.photo}
              attendances={student.attendance_status}
              onChange={(value) =>
                handleOnChange(student.student_id, value, student.attendance_id)
              }
            />
          ))}
      </div>
    </Layout>
  )
}

export default Attendants
