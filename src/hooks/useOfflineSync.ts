import { useState, useEffect } from 'react'
import { useNetwork } from '@/components/NetworkStatusProvider/NetworkStatusProvider'
import { syncOfflineRequests } from '@/utils/axiosOffline'

interface UseOfflineSyncProps {
  syncOnMount?: boolean
}

interface UseOfflineSyncReturn {
  syncData: () => Promise<boolean>
  isSyncing: boolean
  lastSyncTime: Date | null
}

/**
 * Hook to sync offline data when network is restored
 */
export const useOfflineSync = ({
  syncOnMount = false
}: UseOfflineSyncProps = {}): UseOfflineSyncReturn => {
  const { isOnline } = useNetwork()
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [previousNetworkState, setPreviousNetworkState] = useState(isOnline)

  // Sync data method
  const syncData = async (): Promise<boolean> => {
    if (!isOnline) return false

    setIsSyncing(true)
    try {
      const result = await syncOfflineRequests()
      setLastSyncTime(new Date())
      return result.success
    } catch (error) {
      console.error('Error syncing offline data:', error)
      return false
    } finally {
      setIsSyncing(false)
    }
  }

  // Effect to watch for network changes
  useEffect(() => {
    // If network was previously offline and is now online, sync data
    if (!previousNetworkState && isOnline) {
      syncData()
    }

    // Update previous network state
    setPreviousNetworkState(isOnline)
  }, [isOnline, previousNetworkState])

  // If syncOnMount is true, sync data when component mounts
  useEffect(() => {
    if (syncOnMount && isOnline) {
      syncData()
    }
  }, [])

  return {
    syncData,
    isSyncing,
    lastSyncTime
  }
}
