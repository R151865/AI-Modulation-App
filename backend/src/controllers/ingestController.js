import Incident from '../models/Incident.js'
import { moderateTextContent } from '../services/perspectiveService.js'
import { moderateWithOpenAI } from '../services/openaiService.js'
import { emitNewIncident } from '../sockets/incidentSocket.js'
import { transcribeAudio } from '../services/whisperService.js'
import { moderateImageContent } from '../services/imageModerationService.js'

export const ingestText = async (req, res, next) => {
  try {
    const { text, timestamp, id } = req.body

    // Moderate content using both services
    const [perspectiveResult, openaiResult] = await Promise.allSettled([
      moderateTextContent(text),
      moderateWithOpenAI(text)
    ])

    const perspectiveData = perspectiveResult.status === 'fulfilled' ? perspectiveResult.value : null
    const openaiData = openaiResult.status === 'fulfilled' ? openaiResult.value : null

    // Combine results
    const combinedResult = combineModerationResults(perspectiveData, openaiData, text)

    // Save incident if flagged
    if (combinedResult.flagged) {
      const incident = new Incident({
        content: text,
        type: 'text',
        severity: combinedResult.severity,
        categories: combinedResult.categories,
        scores: combinedResult.scores,
        metadata: {
          messageId: id,
          timestamp: timestamp || new Date(),
          highlights: combinedResult.highlights
        }
      })

      await incident.save()
      emitNewIncident(incident)
    }

    res.json(combinedResult)
  } catch (error) {
    next(error)
  }
}

export const ingestAudio = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' })
    }

    // Transcribe audio to text
    const transcription = await transcribeAudio(req.file.buffer)
    
    if (!transcription) {
      return res.status(400).json({ error: 'Could not transcribe audio' })
    }

    // Moderate the transcribed text
    const [perspectiveResult, openaiResult] = await Promise.allSettled([
      moderateTextContent(transcription),
      moderateWithOpenAI(transcription)
    ])

    const perspectiveData = perspectiveResult.status === 'fulfilled' ? perspectiveResult.value : null
    const openaiData = openaiResult.status === 'fulfilled' ? openaiResult.value : null

    // Combine results
    const combinedResult = combineModerationResults(perspectiveData, openaiData, transcription)

    // Save incident if flagged
    if (combinedResult.flagged) {
      const incident = new Incident({
        content: transcription,
        type: 'audio',
        severity: combinedResult.severity,
        categories: combinedResult.categories,
        scores: combinedResult.scores,
        metadata: {
          transcription,
          audioLength: req.file.size,
          timestamp: new Date()
        }
      })

      await incident.save()
      emitNewIncident(incident)
    }

    res.json({
      ...combinedResult,
      transcription
    })
  } catch (error) {
    next(error)
  }
}

export const ingestImage = async (req, res, next) => {
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

function combineModerationResults(perspectiveData, openaiData, originalText) {
  // Default result if both services fail
  const defaultResult = {
    flagged: false,
    severity: 'low',
    categories: {},
    scores: {},
    highlights: []
  }

  if (!perspectiveData && !openaiData) {
    return defaultResult
  }

  // Use Perspective API as primary, OpenAI as secondary
  const primaryData = perspectiveData || openaiData
  const secondaryData = perspectiveData ? openaiData : null

  const result = {
    flagged: primaryData.flagged,
    severity: primaryData.severity,
    categories: { ...primaryData.categories },
    scores: { ...primaryData.scores },
    highlights: [...(primaryData.highlights || [])]
  }

  // Merge with secondary data if available
  if (secondaryData) {
    // Combine categories and take highest scores
    for (const [category, score] of Object.entries(secondaryData.categories)) {
      if (!result.categories[category] || score > result.categories[category]) {
        result.categories[category] = score
        result.scores[category] = secondaryData.scores[category]
      }
    }

    // Update severity based on combined scores
    const maxScore = Math.max(...Object.values(result.categories))
    result.severity = maxScore > 0.7 ? 'high' : maxScore > 0.4 ? 'medium' : 'low'
    result.flagged = result.severity !== 'low'
  }

  return result
}