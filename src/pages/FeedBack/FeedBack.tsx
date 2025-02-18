import { Layout } from '@/components/Layout'
import { Datum, Students, StudentsFeedback } from '@/types/Courses'
import { axiosClient } from '@/utils/axios'
import {
  IonButton,
  IonIcon,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonSpinner
} from '@ionic/react'
import {
  arrowBackOutline,
  trashOutline,
  chevronDownOutline,
  chevronUpOutline
} from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import './FeedBack.css'
import styles from './list.module.css'
import moment from 'moment'

const CustomToolbar: React.FC<{ courseName: string }> = ({ courseName }) => {
  return (
    <div className="header-detail">
      <div className="image-name">
        <IonIcon src={arrowBackOutline} onClick={() => window.history.back()} />
        <h1>{courseName}</h1>
        <div />
      </div>
      <p>Listado de alumnos para colocar feedbacks</p>
    </div>
  )
}

const FeedBack = () => {
  const [stateResponse, setStateResponse] = useState<
    'loading' | 'error' | 'success'
  >('success')
  const [students, setStudents] = useState<Students[]>([])
  const [feedBackStudent, setFeedBackStudent] = useState<Datum[]>([])
  const [loading, setLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(2)
  const [valueText, setValueText] = useState('')
  const [valueStudent, setValueStudent] = useState<Number>(0)
  const { id: idCourse } = useParams<{ id: string }>()
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  )

  const toggleExpand = (id: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id] // Alternar el estado del ítem específico
    }))
  }

  const getStudents = async () => {
    setStateResponse('loading')
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
    } catch (error) {
      setStateResponse('error')
      console.error(error)
    } finally {
      setStateResponse('success')
    }
  }

  useEffect(() => {
    if (idCourse) {
      getStudents()
    }
  }, [idCourse])

  const getFeedbackStudent = async () => {
    try {
      const { data } = await axiosClient.get<StudentsFeedback>(
        `/feedbacks/student/${valueStudent}`
      )
      setFeedBackStudent(data.data)
      setStateResponse('success')
    } catch (error) {
      setStateResponse('error')
      console.error(error)
    }
  }

  useEffect(() => {
    setStateResponse('loading')
    if (valueStudent !== 0) {
      setValueText('')
      getFeedbackStudent()
    }
  }, [valueStudent])

  const handleOnChange = (e: any) => {
    setValueText(e as string)
  }

  const handleDelete = async (id: number) => {
    try {
      await axiosClient.delete(`/feedbacks/${id}`)
      await getFeedbackStudent()
    } catch (error) {
      console.error(error)
    }
  }

  const handleAdd = async () => {
    setLoading(true)
    try {
      await axiosClient.post('/feedbacks', {
        feedback: {
          detail: valueText,
          student_id: valueStudent
        }
      })
      setValueText('')
      await getFeedbackStudent()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleValue = (id: number) => {
    setValueStudent(id)
  }

  return (
    <Layout
      customToolbar={<CustomToolbar courseName={students?.[0]?.subject} />}
      title={students?.[0]?.subject}
    >
      <div className="container-feedBack">
        {stateResponse === 'loading' && (
          <div className="empty-container">
            <IonSpinner name="crescent" />
          </div>
        )}
        {stateResponse === 'success' && students.length === 0 && (
          <h1 className="centered-content">
            no hay alumnos para colocar feedback
          </h1>
        )}
        {stateResponse === 'success' && students.length > 0 && (
          <div className="feedback">
            <IonList>
              <IonItem>
                <IonSelect
                  interface="popover"
                  placeholder="Seleccione un alumno"
                  onIonChange={(e) => handleValue(e.detail.value)}
                  value={valueStudent}
                >
                  {students.map((item) => (
                    <IonSelectOption
                      value={item.student_id}
                      key={item.student_id}
                    >
                      {item.first_name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonList>
          </div>
        )}
        {stateResponse === 'success' && feedBackStudent.length > 0 && (
          <div className="feedback">
            <div className={styles.container}>
              <ol className={styles.list}>
                {feedBackStudent.length === 0 && (
                  <h1 className="empty-state">
                    El estudiante no tiene feedbak
                  </h1>
                )}
                {feedBackStudent.slice(0, visibleCount).map((item) => {
                  const isExpanded = expandedItems[Number(item.id)]

                  return (
                    <li
                      key={item.id}
                      className={`${styles.item} ${
                        isExpanded ? styles.expandedItem : ''
                      }`}
                    >
                      <label className={styles.label}>
                        <span className={styles.text}>
                          <button
                            className={styles.toggleButton}
                            onClick={() => toggleExpand(Number(item.id))}
                          >
                            <IonIcon
                              src={
                                isExpanded
                                  ? chevronUpOutline
                                  : chevronDownOutline
                              }
                              color="black"
                            />
                          </button>
                          <strong
                            className={
                              isExpanded
                                ? styles.expandedText
                                : styles.truncatedText
                            }
                          >
                            {item.attributes.detail}
                          </strong>
                        </span>
                        <button className={styles.trashButton}>
                          <IonIcon
                            src={trashOutline}
                            onClick={() => handleDelete(Number(item.id))}
                            color="danger"
                          />
                        </button>
                      </label>
                      <span className={styles.date}>
                        <span className={styles.subtitle}>
                          Fecha de feedback:
                        </span>{' '}
                        {moment(item.attributes.created_at).format(
                          'DD/MM/YYYY'
                        )}
                      </span>
                    </li>
                  )
                })}
              </ol>
              <div className="load-more">
                {visibleCount < feedBackStudent.length && (
                  <IonButton
                    className="load-more-button"
                    expand="block"
                    fill="outline"
                    onClick={() => setVisibleCount(visibleCount + 2)}
                  >
                    Ver más
                  </IonButton>
                )}
              </div>
            </div>
            <div className={styles.inputGroup}>
              <textarea
                className={styles.textarea}
                placeholder="Ingresa tu feedback."
                rows={4}
                value={valueText}
                onChange={(e) => handleOnChange(e.target.value)}
              />
            </div>

            <IonButton
              className="login__button"
              expand="block"
              fill="solid"
              type="button"
              onClick={() => {
                handleAdd()
              }}
              disabled={loading || valueText === ''}
            >
              Agregar {loading && <IonSpinner name="crescent" />}
            </IonButton>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default FeedBack
