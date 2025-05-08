import React from 'react'
import { IonChip, IonIcon } from '@ionic/react'
import { wifi, wifiOutline, cloudOfflineOutline } from 'ionicons/icons'
import { useNetwork } from '../NetworkStatusProvider/NetworkStatusProvider'
import './NetworkStatus.css'

const NetworkStatus: React.FC = () => {
  const { isOnline, isSyncing, lastSyncTime } = useNetwork()

  // Format last sync time
  const formatLastSync = () => {
    if (!lastSyncTime) return 'Nunca'

    // If it's today, show just the time
    const today = new Date()
    const syncDate = new Date(lastSyncTime)

    if (
      today.getDate() === syncDate.getDate() &&
      today.getMonth() === syncDate.getMonth() &&
      today.getFullYear() === syncDate.getFullYear()
    ) {
      return syncDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Otherwise show the date and time
    return syncDate.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="network-status-container">
      <IonChip
        className={`network-status-chip ${isOnline ? 'online' : 'offline'}`}
      >
        <IonIcon icon={isOnline ? wifi : cloudOfflineOutline} />
        <span>
          {isOnline
            ? isSyncing
              ? 'Sincronizando...'
              : 'En línea'
            : 'Sin conexión'}
        </span>
      </IonChip>

      {lastSyncTime && (
        <div className="last-sync">
          Última sincronización: {formatLastSync()}
        </div>
      )}
    </div>
  )
}

export default NetworkStatus
