import './StudentAttendant.css'
import { IonSelect, IonSelectOption } from '@ionic/react'
import Logo from '@/assets/logo.png'

type Props = {
  name: string
  image: File | string | undefined
  onChange: (value: 'present' | 'late' | 'no_present') => void
  attendances: string | null
}

const StudentAttendant = ({ name, image, onChange, attendances }: Props) => {
  const handleOnChange = (event: any) => {
    onChange(event.detail.value)
  }

  const getStatusClass = () => {
    switch (attendances) {
      case 'present':
        return 'status-present'
      case 'late':
        return 'status-late'
      case 'no_present':
      default:
        return 'status-no_present'
    }
  }

  return (
    <div className="student-attendants">
      <div className="student-image">
        <img
          src={
            image instanceof File ? URL.createObjectURL(image) : image || Logo
          }
          alt={`Foto de ${name}`}
        />
      </div>
      <div className="student-info">
        <h1>{name}</h1>
      </div>
      <div className="attendance-status">
        <IonSelect
          interface="popover"
          onIonChange={(event) => handleOnChange(event)}
          value={attendances ?? 'no_present'}
          mode="md"
          className={getStatusClass()}
        >
          <IonSelectOption value="present">Presente</IonSelectOption>
          <IonSelectOption value="late">Tarde</IonSelectOption>
          <IonSelectOption value="no_present">Falta</IonSelectOption>
        </IonSelect>
      </div>
    </div>
  )
}

export default StudentAttendant
