import { useState, useEffect } from 'react'
import { axiosOffline } from '@/utils/axiosOffline'
import { useNetwork } from '@/components/NetworkStatusProvider/NetworkStatusProvider'

interface UseOfflineDataProps<T> {
  url: string
  params?: Record<string, any>
  dataTransform?: (data: any) => T
  initialData?: T
}

/**
 * Hook para obtener y almacenar datos para uso offline
 * @param url - URL a la que hacer la petición
 * @param params - Parámetros de la petición
 * @param dataTransform - Función para transformar los datos
 * @param initialData - Datos iniciales
 */
export function useOfflineData<T>({
  url,
  params = {},
  dataTransform = (data) => data as T,
  initialData
}: UseOfflineDataProps<T>) {
  const { isOnline } = useNetwork()
  const [data, setData] = useState<T | undefined>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Función para cargar datos
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    console.log('fetchData')
    try {
      const response = await axiosOffline.get(url, { params })
      console.log('response', response)
      const transformedData = dataTransform(response.data)
      setData(transformedData)
    } catch (err) {
      console.error(`Error fetching data from ${url}:`, err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData()
  }, [url, JSON.stringify(params)])

  // Refrescar datos cuando se recupere la conexión
  const refreshData = () => {
    if (isOnline) {
      fetchData()
    }
  }

  return { data, loading, error, refreshData }
}
