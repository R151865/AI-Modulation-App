import axios from 'axios'
import config from '../config/env.js'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

export const moderateWithOpenAI = async (text) => {
  if (!config.openaiApiKey) {
    console.warn('OpenAI API key not configured, using mock data')
    return mockOpenAIModeration(text)
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Analyze the following text for harmful content. Return a JSON object with:
            - flagged: boolean
            - severity: 'high', 'medium', or 'low'
            - categories: object with category names and confidence scores (0-1)
            - highlights: array of objects with start, end, severity, and reason
            - scores: same as categories but with numerical scores
            
            Categories to check: toxicity, hate_speech, sexual_content, violence, harassment, self_harm`
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 500,
        temperature: 0.1
      },
      {
        headers: {
          'Authorization': `Bearer ${config.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const resultText = response.data.choices[0].message.content
    try {
      // Try to parse the JSON response
      const result = JSON.parse(resultText.replace(/```json\n?|\n?```/g, ''))
      return result
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', resultText)
      return mockOpenAIModeration(text)
    }
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message)
    return mockOpenAIModeration(text)
  }
}

function mockOpenAIModeration(text) {
  // Enhanced mock response for development - more likely to flag content for testing
  const hasBadWords = /bad|hate|stupid|idiot|kill|attack|sex|damn|hell|crap/i.test(text)
  const hasLongText = text.length > 15
  const hasConcerns = hasBadWords || (hasLongText && Math.random() > 0.5)
  const score = hasConcerns ? (hasBadWords ? 0.7 : 0.5) : 0.1

  return {
    flagged: hasConcerns,
    severity: hasConcerns ? (hasBadWords ? 'high' : 'medium') : 'low',
    categories: {
      toxicity: score,
      hate_speech: score * 0.6,
      sexual_content: score * 0.4
    },
    scores: {
      toxicity: score,
      hate_speech: score * 0.6,
      sexual_content: score * 0.4
    },
    highlights: hasConcerns ? [
      {
        start: text.indexOf('bad'),
        end: text.indexOf('bad') + 3,
        severity: 'medium',
        reason: 'Potentially toxic language'
      }
    ] : []
  }
}