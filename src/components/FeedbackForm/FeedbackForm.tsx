import { useState } from 'react'
import { IonButton, IonSpinner, IonTextarea } from '@ionic/react'
import './FeedbackForm.css'

interface FeedbackFormProps {
  onSubmit: (text: string) => Promise<void>
  isLoading: boolean
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit, isLoading }) => {
  const [feedbackText, setFeedbackText] = useState('')

  const handleSubmit = async () => {
    if (feedbackText.trim()) {
      await onSubmit(feedbackText)
      setFeedbackText('')
    }
  }

  return (
    <div className="feedback-form">
      <h2 className="feedback-form-title">Nuevo Feedback</h2>

      <div className="feedback-form-content">
        <IonTextarea
          className="feedback-textarea"
          placeholder="Escribe tu feedback aquí..."
          value={feedbackText}
          onIonChange={(e) => setFeedbackText(e.detail.value || '')}
          autoGrow={true}
          rows={4}
          maxlength={500}
          counter={true}
        />

        <IonButton
          className="feedback-submit-btn"
          expand="block"
          onClick={handleSubmit}
          disabled={!feedbackText.trim() || isLoading}
        >
          {isLoading ? <IonSpinner name="crescent" /> : 'Enviar Feedback'}
        </IonButton>
      </div>
    </div>
  )
}

export default FeedbackForm
