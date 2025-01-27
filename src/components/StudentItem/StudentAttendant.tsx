import './StudentAttendant.css';
import { IonSelect, IonSelectOption, useIonAlert } from "@ionic/react";

type Props = {
  id: number;
  name: string;
  image: string;
  onChange: (id: number, value: 'presente' | 'tarde' | 'falta') => void;
}

const StudentAttendant = ({id, name, image, onChange}: Props) => {
  
  const handleOnChange = (event: any) => {
    onChange(id, event.detail.value);
  }

  return (
    <div className="student-attendants">
      <img src={image} alt="Imagen de perfil" />
      <h1>{name}</h1>
      <IonSelect 
        interface="action-sheet"
        onChange={(event) => handleOnChange(event)} 
        value='falta' 
        mode='md'
      >
        <IonSelectOption value="presente">Presente</IonSelectOption>
        <IonSelectOption value="tarde">Tarde</IonSelectOption>
        <IonSelectOption value="falta">Falta</IonSelectOption>
      </IonSelect>
    </div>
  )
}

export default StudentAttendant