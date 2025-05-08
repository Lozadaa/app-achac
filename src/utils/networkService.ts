import { Capacitor } from '@capacitor/core'
import { Network, NetworkStatus } from '@capacitor/network'
import { Preferences } from '@capacitor/preferences'
import { useEffect, useState } from 'react'

// Network status listener for components
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Initial check
    const checkStatus = async () => {
      const status = await Network.getStatus()
      setIsOnline(status.connected)
    }

    checkStatus()

    // Listen for changes
    let listener: any = null

    Network.addListener('networkStatusChange', (status: NetworkStatus) => {
      setIsOnline(status.connected)
    }).then((networkListener) => {
      listener = networkListener
    })

    return () => {
      if (listener) {
        listener.remove()
      }
    }
  }, [])

  return isOnline
}

// Check if the device is online
export const isNetworkConnected = async (): Promise<boolean> => {
  if (Capacitor.isNativePlatform()) {
    const status = await Network.getStatus()
    return status.connected
  }

  // For web, use the navigator API
  return navigator.onLine
}

// Store offline data
export const storeOfflineData = async (
  key: string,
  data: any
): Promise<void> => {
  await Preferences.set({
    key,
    value: JSON.stringify(data)
  })
}

// Get offline data
export const getOfflineData = async (key: string): Promise<any | null> => {
  const result = await Preferences.get({ key })
  return result.value ? JSON.parse(result.value) : null
}

// Remove offline data
export const removeOfflineData = async (key: string): Promise<void> => {
  await Preferences.remove({ key })
}

// Store API request to be executed when online
export const storeOfflineRequest = async (
  request: OfflineRequest
): Promise<void> => {
  const existingRequests = await getOfflineRequests()
  existingRequests.push(request)
  await Preferences.set({
    key: 'offline_requests',
    value: JSON.stringify(existingRequests)
  })
}

// Get all pending offline requests
export const getOfflineRequests = async (): Promise<OfflineRequest[]> => {
  const result = await Preferences.get({ key: 'offline_requests' })
  return result.value ? JSON.parse(result.value) : []
}

// Clear a specific request after it's processed
export const clearOfflineRequest = async (id: string): Promise<void> => {
  const existingRequests = await getOfflineRequests()
  const updatedRequests = existingRequests.filter((req) => req.id !== id)
  await Preferences.set({
    key: 'offline_requests',
    value: JSON.stringify(updatedRequests)
  })
}

// Clear all offline requests
export const clearAllOfflineRequests = async (): Promise<void> => {
  await Preferences.remove({ key: 'offline_requests' })
}

// Offline request interface
export interface OfflineRequest {
  id: string
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  url: string
  data?: any
  params?: any
  timestamp: number
}
