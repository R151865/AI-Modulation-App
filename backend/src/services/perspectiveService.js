import axios from 'axios'
import config from '../config/env.js'

const PERSPECTIVE_API_URL = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze'

export const moderateTextContent = async (text) => {
  if (!config.perspectiveApiKey) {
    console.warn('Perspective API key not configured, using mock data')
    return mockModeration(text)
  }

  try {
    const response = await axios.post(
      `${PERSPECTIVE_API_URL}?key=${config.perspectiveApiKey}`,
      {
        comment: { text },
        languages: ['en'],
        requestedAttributes: {
          TOXICITY: {},
          SEVERE_TOXICITY: {},
          IDENTITY_ATTACK: {},
          INSULT: {},
          PROFANITY: {},
          THREAT: {},
          SEXUALLY_EXPLICIT: {},
          FLIRTATION: {}
        },
        doNotStore: true
      }
    )

    const attributes = response.data.attributeScores
    const categories = {}
    const scores = {}
    let maxScore = 0

    for (const [key, value] of Object.entries(attributes)) {
      const score = value.summaryScore.value
      categories[key] = score
      scores[key] = score
      if (score > maxScore) maxScore = score
    }

    return {
      flagged: maxScore > 0.4,
      severity: maxScore > 0.7 ? 'high' : maxScore > 0.4 ? 'medium' : 'low',
      categories,
      scores,
      highlights: generateHighlights(text, attributes)
    }
  } catch (error) {
    console.error('Perspective API error:', error.response?.data || error.message)
    return mockModeration(text)
  }
}

function generateHighlights(text, attributes) {
  // This is a simplified version - Perspective API doesn't provide exact highlights
  // In a real implementation, you might use a different approach
  const highlights = []
  const words = text.split(/\s+/)
  
  // Simple heuristic: highlight words that might be problematic
  const problematicWords = ['bad', 'hate', 'stupid', 'idiot', 'kill', 'attack', 'sex']
  
  let currentPosition = 0
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '').toLowerCase()
    if (problematicWords.includes(cleanWord)) {
      const start = text.indexOf(word, currentPosition)
      const end = start + word.length
      highlights.push({
        start,
        end,
        severity: 'medium',
        reason: 'Potential offensive term'
      })
      currentPosition = end
    } else {
      currentPosition += word.length + 1 // +1 for the space
    }
  })
  
  return highlights
}

function mockModeration(text) {
  // Enhanced mock for development - more likely to flag content for testing
  const hasBadWords = /bad|hate|stupid|idiot|kill|attack|sex|damn|hell|crap/i.test(text)
  const hasLongText = text.length > 20
  const shouldFlag = hasBadWords || (hasLongText && Math.random() > 0.4)
  const score = shouldFlag ? (hasBadWords ? 0.8 : 0.6) : 0.1
  
  return {
    flagged: shouldFlag,
    severity: shouldFlag ? (hasBadWords ? 'high' : 'medium') : 'low',
    categories: {
      TOXICITY: score,
      SEVERE_TOXICITY: score * 0.8,
      IDENTITY_ATTACK: score * 0.6
    },
    scores: {
      TOXICITY: score,
      SEVERE_TOXICITY: score * 0.8,
      IDENTITY_ATTACK: score * 0.6
    },
    highlights: shouldFlag ? generateHighlights(text) : []
  }
}