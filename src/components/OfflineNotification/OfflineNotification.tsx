import React, { useState } from 'react'
import { IonButton, IonIcon, IonSpinner } from '@ionic/react'
import { cloudOfflineOutline, syncOutline, saveOutline } from 'ionicons/icons'
import { useNetwork } from '@/components/NetworkStatusProvider/NetworkStatusProvider'
import { useOfflineSync } from '@/hooks/useOfflineSync'
import './OfflineNotification.css'

interface OfflineNotificationProps {
  showSyncButton?: boolean
}

const OfflineNotification: React.FC<OfflineNotificationProps> = ({
  showSyncButton = false
}) => {
  const { isOnline, preloadOfflineData } = useNetwork()
  const { syncData, isSyncing } = useOfflineSync()
  const [isPreloading, setIsPreloading] = useState(false)

  const handlePreloadData = async () => {
    setIsPreloading(true)
    try {
      await preloadOfflineData()
    } finally {
      setIsPreloading(false)
    }
  }

  if (isOnline) {
    return (
      <div className="offline-container online">
        {showSyncButton && (
          <div className="action-buttons">
            <IonButton
              size="small"
              fill="clear"
              onClick={syncData}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <IonSpinner name="dots" />
              ) : (
                <>
                  <IonIcon icon={syncOutline} slot="start" />
                  Sincronizar
                </>
              )}
            </IonButton>

            <IonButton
              size="small"
              fill="clear"
              onClick={handlePreloadData}
              disabled={isPreloading}
            >
              {isPreloading ? (
                <IonSpinner name="dots" />
              ) : (
                <>
                  <IonIcon icon={saveOutline} slot="start" />
                  Guardar datos
                </>
              )}
            </IonButton>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="offline-container">
      <IonIcon icon={cloudOfflineOutline} />
      <span>Sin conexión - Modo offline</span>
    </div>
  )
}

export default OfflineNotification
