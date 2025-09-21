import { moderateTextContent } from '../services/perspectiveService.js'
import { moderateWithOpenAI } from '../services/openaiService.js'

export const moderateText = async (req, res, next) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ error: 'Text is required' })
    }

    // Use both services concurrently
    const [perspectiveResult, openaiResult] = await Promise.allSettled([
      moderateTextContent(text),
      moderateWithOpenAI(text)
    ])

    const perspectiveData = perspectiveResult.status === 'fulfilled' ? perspectiveResult.value : null
    const openaiData = openaiResult.status === 'fulfilled' ? openaiResult.value : null

    // Combine results
    const combinedResult = combineModerationResults(perspectiveData, openaiData, text)

    res.json(combinedResult)
  } catch (error) {
    next(error)
  }
}

function combineModerationResults(perspectiveData, openaiData, originalText) {
  // Similar to the function in ingestController but without saving to database
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