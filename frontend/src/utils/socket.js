import { io } from 'socket.io-client'

let socket = null

export const setupSocket = () => {
  if (!socket) {
    // For Vercel deployment, WebSockets may not work in serverless functions
    // Use polling as fallback for production
    const socketUrl = import.meta.env.VITE_API_BASE_URL || 
      (import.meta.env.PROD ? window.location.origin : 'http://localhost:3001')
    
    socket = io(socketUrl, {
      transports: import.meta.env.PROD ? ['polling', 'websocket'] : ['websocket'],
      upgrade: true,
      rememberUpgrade: true
    })
    
    socket.on('connect', () => {
      console.log('Connected to server via', socket.io.engine.transport.name)
    })
    
    socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })
    
    // Handle transport upgrades
    socket.io.on('upgrade', () => {
      console.log('Upgraded to', socket.io.engine.transport.name)
    })
  }
  
  return socket
}

export const getSocket = () => {
  return socket
}