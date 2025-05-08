import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import {
  isNetworkConnected,
  storeOfflineRequest,
  getOfflineData,
  storeOfflineData,
  removeOfflineData,
  OfflineRequest
} from './networkService'
import { getUser } from './userUtils'

const BASE_URL = 'https://api.airtraningcenter.com'

// Cache keys for different types of requests
const CACHE_KEYS = {
  STUDENTS: 'cached_students_',
  FEEDBACKS: 'cached_feedback_',
  ATTENDANCES: 'cached_attendances_'
}

// Create axios instance
export const axiosOffline = axios.create({
  baseURL: BASE_URL
})

// Add token to requests
axiosOffline.interceptors.request.use(async (config) => {
  const user = await getUser()

  if (user) {
    config.headers.Authorization = user.token
  }

  return config
})

// Handle offline GET requests by returning cached data
// Handle offline POST/PUT/PATCH/DELETE by storing for later sync
axiosOffline.interceptors.request.use(
  async (config) => {
    const isOnline = await isNetworkConnected()

    // Handle GET requests when offline by returning cached data
    if (!isOnline && config.method?.toLowerCase() === 'get') {
      // Generate cache key based on URL and params
      const cacheKey = `${config.url}_${JSON.stringify(config.params || {})}`

      // Try to get cached data
      const cachedData = await getOfflineData(cacheKey)

      if (cachedData) {
        // Create a canceled request with cached data
        return Promise.reject({
          isOffline: true,
          cachedData,
          config
        })
      }
    }

    // For non-GET requests when offline, store for later sync
    if (!isOnline && config.method?.toLowerCase() !== 'get') {
      // Only store feedback and attendance related requests
      if (shouldStoreOfflineRequest(config)) {
        await storeOfflineRequestForLater(config)

        // Return a success response to simulate successful operation
        return Promise.reject({
          isOffline: true,
          offlineStored: true,
          config
        })
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to cache successful GET responses
axiosOffline.interceptors.response.use(
  async (response) => {
    if (response.config.method?.toLowerCase() === 'get') {
      // Cache GET responses for offline use
      const cacheKey = `${response.config.url}_${JSON.stringify(
        response.config.params || {}
      )}`
      await storeOfflineData(cacheKey, response.data)
    }

    return response
  },
  async (error: AxiosError | any) => {
    // Handle offline responses
    if (error.isOffline) {
      if (error.cachedData) {
        // Return cached data for GET requests
        return {
          data: error.cachedData,
          status: 200,
          statusText: 'OK (Offline)',
          headers: {},
          config: error.config,
          offlineData: true
        } as AxiosResponse
      } else if (error.offlineStored) {
        // For offline stored requests, return a success response
        return {
          data: { success: true, offlineStored: true },
          status: 200,
          statusText: 'OK (Offline - Will sync when online)',
          headers: {},
          config: error.config,
          offlineData: true
        } as AxiosResponse
      }
    }

    return Promise.reject(error)
  }
)

// Check if the request should be stored for offline sync
const shouldStoreOfflineRequest = (config: AxiosRequestConfig): boolean => {
  const url = config.url || ''

  // Include all API endpoints that should be stored offline
  return (
    url.includes('feedbacks') ||
    url.includes('student_attendances') ||
    url.includes('teacher/courses') ||
    url.includes('course_schedule')
  )
}

// Store request for later synchronization
const storeOfflineRequestForLater = async (
  config: AxiosRequestConfig
): Promise<void> => {
  const offlineRequest: OfflineRequest = {
    id: uuidv4(),
    method: (config.method?.toLowerCase() || 'get') as
      | 'get'
      | 'post'
      | 'put'
      | 'patch'
      | 'delete',
    url: config.url || '',
    data: config.data,
    params: config.params,
    timestamp: Date.now()
  }

  await storeOfflineRequest(offlineRequest)
}

// Synchronize offline requests when back online
export const syncOfflineRequests = async (): Promise<{
  success: boolean
  syncedCount: number
}> => {
  const { getOfflineRequests, clearOfflineRequest } = await import(
    './networkService'
  )

  try {
    const offlineRequests = await getOfflineRequests()
    let syncedCount = 0

    // Process each stored request
    for (const request of offlineRequests) {
      try {
        // Skip if it's a GET request (shouldn't be stored anyway)
        if (request.method === 'get') continue

        // Send the request
        await axios({
          method: request.method,
          url: `${BASE_URL}${request.url}`,
          data: request.data,
          params: request.params,
          headers: {
            ...(await getAuthHeader())
          }
        })

        // If successful, remove the request from storage
        await clearOfflineRequest(request.id)
        syncedCount++
      } catch (err) {
        console.error(`Failed to sync request ${request.id}:`, err)
        // Keep the request in storage to try again later
      }
    }

    return { success: true, syncedCount }
  } catch (error) {
    console.error('Failed to sync offline requests:', error)
    return { success: false, syncedCount: 0 }
  }
}

// Get auth header for sync requests
const getAuthHeader = async () => {
  const user = await getUser()
  return user ? { Authorization: user.token } : {}
}

// Preload important data for offline use
export const preloadDataForOffline = async (): Promise<boolean> => {
  try {
    // Fetch and cache courses data
    await axiosOffline.get('/teacher/courses')

    // You can add more endpoints to preload here

    return true
  } catch (error) {
    console.error('Error preloading data for offline use:', error)
    return false
  }
}
