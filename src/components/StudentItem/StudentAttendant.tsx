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

  return (
    <div className="student-attendants">
      <img
        src={image instanceof File ? URL.createObjectURL(image) : image || Logo}
        alt="Imagen de perfil"
      />
      <h1>{name}</h1>
      <IonSelect
        interface="action-sheet"
        onIonChange={(event) => handleOnChange(event)}
        value={attendances ?? 'no_present'}
        mode="md"
      >
        <IonSelectOption value="present">Presente</IonSelectOption>
        <IonSelectOption value="late">Tarde</IonSelectOption>
        <IonSelectOption value="no_present">Falta</IonSelectOption>
      </IonSelect>
    </div>
  )
}

export default StudentAttendant
