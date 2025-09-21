export const validateTextInput = (req, res, next) => {
  const { text } = req.body
  
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Valid text is required' })
  }
  
  if (text.length > 1000) {
    return res.status(400).json({ error: 'Text must be less than 1000 characters' })
  }
  
  next()
}

export const validateImageInput = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' })
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid image format. Allowed: JPEG, PNG, GIF, WEBP' })
  }
  
  if (req.file.size > 5 * 1024 * 1024) { // 5MB limit
    return res.status(400).json({ error: 'Image must be less than 5MB' })
  }
  
  next()
}

export const validateAudioInput = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Audio file is required' })
  }
  
  const allowedTypes = ['audio/webm', 'audio/mpeg', 'audio/wav', 'audio/ogg']
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid audio format. Allowed: WEBM, MP3, WAV, OGG' })
  }
  
  if (req.file.size > 10 * 1024 * 1024) { // 10MB limit
    return res.status(400).json({ error: 'Audio must be less than 10MB' })
  }
  
  next()
}