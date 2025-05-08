import React, { createContext, useContext, useEffect, useState } from 'react'
import { IonToast } from '@ionic/react'
import { useNetworkStatus } from '@/utils/networkService'
import {
  preloadDataForOffline,
  syncOfflineRequests
} from '@/utils/axiosOffline'

interface NetworkContextProps {
  isOnline: boolean
  isSyncing: boolean
  lastSyncTime: Date | null
  preloadOfflineData: () => Promise<boolean>
}

const NetworkContext = createContext<NetworkContextProps>({
  isOnline: true,
  isSyncing: false,
  lastSyncTime: null,
  preloadOfflineData: async () => false
})

export const useNetwork = () => useContext(NetworkContext)

interface NetworkStatusProviderProps {
  children: React.ReactNode
}

export const NetworkStatusProvider: React.FC<NetworkStatusProviderProps> = ({
  children
}) => {
  const isOnline = useNetworkStatus()
  const [isSyncing, setIsSyncing] = useState(false)
  const [showOfflineToast, setShowOfflineToast] = useState(false)
  const [showOnlineToast, setShowOnlineToast] = useState(false)
  const [syncMessage, setSyncMessage] = useState('')
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [previousOnlineState, setPreviousOnlineState] = useState(isOnline)
  const [isPreloading, setIsPreloading] = useState(false)

  // Preload data for offline use
  const preloadOfflineData = async (): Promise<boolean> => {
    if (!isOnline || isPreloading) return false

    setIsPreloading(true)
    try {
      const result = await preloadDataForOffline()
      if (result) {
        setSyncMessage('Datos precargados para uso sin conexión')
      }
      return result
    } catch (error) {
      console.error('Error preloading data:', error)
      return false
    } finally {
      setIsPreloading(false)
    }
  }

  // Handle network status changes
  useEffect(() => {
    // If we've just gone offline
    if (previousOnlineState && !isOnline) {
      setShowOfflineToast(true)
    }

    // If we've just come back online
    if (!previousOnlineState && isOnline) {
      setShowOnlineToast(true)
      syncOfflineData()
    }

    // Update previous state
    setPreviousOnlineState(isOnline)
  }, [isOnline, previousOnlineState])

  // Preload data when component mounts and online
  useEffect(() => {
    if (isOnline) {
      preloadOfflineData()
    }
  }, [])

  // Sync offline data when coming back online
  const syncOfflineData = async () => {
    if (!isOnline) return

    setIsSyncing(true)
    try {
      const result = await syncOfflineRequests()

      if (result.success) {
        if (result.syncedCount > 0) {
          setSyncMessage(
            `Sincronizados ${result.syncedCount} datos pendientes.`
          )
        } else {
          setSyncMessage('No hay datos pendientes para sincronizar.')
        }
      } else {
        setSyncMessage(
          'Error al sincronizar. Se intentará nuevamente más tarde.'
        )
      }

      setLastSyncTime(new Date())

      // After syncing, preload fresh data
      if (result.success) {
        preloadOfflineData()
      }
    } catch (error) {
      setSyncMessage('Error al sincronizar. Se intentará nuevamente más tarde.')
      console.error('Sync error:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        isSyncing,
        lastSyncTime,
        preloadOfflineData
      }}
    >
      {children}

      {/* Offline toast */}
      <IonToast
        isOpen={showOfflineToast}
        onDidDismiss={() => setShowOfflineToast(false)}
        message="Sin conexión a internet. La aplicación está operando en modo fuera de línea."
        duration={3000}
        position="top"
        color="warning"
      />

      {/* Online toast */}
      <IonToast
        isOpen={showOnlineToast}
        onDidDismiss={() => setShowOnlineToast(false)}
        message="Conexión a internet restaurada."
        duration={2000}
        position="top"
        color="success"
      />

      {/* Sync toast */}
      <IonToast
        isOpen={!!syncMessage}
        onDidDismiss={() => setSyncMessage('')}
        message={syncMessage}
        duration={3000}
        position="top"
        color="primary"
      />
    </NetworkContext.Provider>
  )
}
