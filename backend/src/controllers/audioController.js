import { transcribeAudio } from '../services/whisperService.js'
import { moderateTextContent } from '../services/perspectiveService.js'
import { moderateWithOpenAI } from '../services/openaiService.js'
import Incident from '../models/Incident.js'
import { emitNewIncident } from '../sockets/incidentSocket.js'

export const moderateAudio = async (req, res, next) => {
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
      transcription,
      ...combinedResult
    })
  } catch (error) {
    next(error)
  }
}

function combineModerationResults(perspectiveData, openaiData, text) {
  // Same implementation as in textController
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

  const primaryData = perspectiveData || openaiData
  const secondaryData = perspectiveData ? openaiData : null

  const result = {
    flagged: primaryData.flagged,
    severity: primaryData.severity,
    categories: { ...primaryData.categories },
    scores: { ...primaryData.scores },
    highlights: [...(primaryData.highlights || [])]
  }

  if (secondaryData) {
    for (const [category, score] of Object.entries(secondaryData.categories)) {
      if (!result.categories[category] || score > result.categories[category]) {
        result.categories[category] = score
        result.scores[category] = secondaryData.scores[category]
      }
    }

    const maxScore = Math.max(...Object.values(result.categories))
    result.severity = maxScore > 0.7 ? 'high' : maxScore > 0.4 ? 'medium' : 'low'
    result.flagged = result.severity !== 'low'
  }

  return result
}