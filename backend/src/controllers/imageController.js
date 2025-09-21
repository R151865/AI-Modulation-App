import { moderateImageContent } from '../services/imageModerationService.js'
import Incident from '../models/Incident.js'
import { emitNewIncident } from '../sockets/incidentSocket.js'

export const moderateImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' })
    }

    // Moderate image content
    const moderationResult = await moderateImageContent(req.file.buffer)

    // Save incident if flagged
    if (moderationResult.flagged) {
      const incident = new Incident({
        content: moderationResult.description || 'Image content',
        type: 'image',
        severity: moderationResult.severity,
        categories: moderationResult.categories,
        scores: moderationResult.scores,
        metadata: {
          imageSize: req.file.size,
          imageType: req.file.mimetype,
          timestamp: new Date(),
          imageUrl: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
        }
      })

      await incident.save()
      emitNewIncident(incident)
    }

    res.json(moderationResult)
  } catch (error) {
    next(error)
  }
}