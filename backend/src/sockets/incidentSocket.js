let ioInstance = null

export const setupSocketHandlers = (io) => {
  ioInstance = io
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })
}

export const emitNewIncident = (incident) => {
  if (ioInstance) {
    ioInstance.emit('new-incident', incident)
  }
}