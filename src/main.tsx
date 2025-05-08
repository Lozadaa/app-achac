import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { defineCustomElements } from '@ionic/pwa-elements/loader'
import { SplashScreen } from '@capacitor/splash-screen'
import { Network } from '@capacitor/network'

// Initialize Capacitor plugins
const initCapacitorPlugins = async () => {
  try {
    // Hide splash screen
    await SplashScreen.hide()

    // Initial network status check
    const status = await Network.getStatus()
    console.log(
      'Network status on init:',
      status.connected ? 'online' : 'offline'
    )
  } catch (error) {
    console.error('Error initializing Capacitor plugins:', error)
  }
}

// Call initCapacitorPlugins
initCapacitorPlugins()

// Call the element loader before the render call
defineCustomElements(window)

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
