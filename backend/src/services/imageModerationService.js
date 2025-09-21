import axios from 'axios'
import config from '../config/env.js'

const OPENAI_VISION_API_URL = 'https://api.openai.com/v1/chat/completions'

export const moderateImageContent = async (imageBuffer) => {
  if (!config.openaiApiKey) {
    console.warn('OpenAI API key not configured, using mock image moderation')
    return mockImageModeration()
  }

  try {
    const base64Image = imageBuffer.toString('base64')
    
    const response = await axios.post(
      OPENAI_VISION_API_URL,
      {
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: `Analyze this image for inappropriate content. Return a JSON object with:
            - flagged: boolean
            - severity: 'high', 'medium', or 'low'
            - categories: object with category names and confidence scores (0-1)
            - description: string describing the image content
            - scores: same as categories but with numerical scores
            
            Categories to check: explicit_content, violence, hate_symbols, drugs, weapons, nudity`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image for inappropriate content and return only JSON.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
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
      console.error('Failed to parse OpenAI vision response:', resultText)
      return mockImageModeration()
    }
  } catch (error) {
    console.error('OpenAI Vision API error:', error.response?.data || error.message)
    return mockImageModeration()
  }
}

function mockImageModeration() {
  // Enhanced mock response for development - more likely to flag content for testing
  const shouldFlag = Math.random() > 0.3 // 70% chance to flag for testing
  const severityRand = Math.random()
  const severity = shouldFlag ? (severityRand > 0.6 ? 'high' : severityRand > 0.3 ? 'medium' : 'low') : 'low'
  
  const baseScore = shouldFlag ? 0.6 : 0.1
  
  return {
    flagged: shouldFlag,
    severity: severity,
    categories: {
      explicit_content: shouldFlag ? Math.random() * 0.7 + 0.3 : Math.random() * 0.2,
      violence: shouldFlag ? Math.random() * 0.6 + 0.2 : Math.random() * 0.1,
      hate_symbols: shouldFlag ? Math.random() * 0.5 + 0.1 : Math.random() * 0.1,
      drugs: shouldFlag ? Math.random() * 0.6 + 0.4 : Math.random() * 0.2,
      weapons: shouldFlag ? Math.random() * 0.7 + 0.3 : Math.random() * 0.2,
      nudity: shouldFlag ? Math.random() * 0.8 + 0.2 : Math.random() * 0.2
    },
    scores: {
      explicit_content: shouldFlag ? Math.random() * 0.7 + 0.3 : Math.random() * 0.2,
      violence: shouldFlag ? Math.random() * 0.6 + 0.2 : Math.random() * 0.1,
      hate_symbols: shouldFlag ? Math.random() * 0.5 + 0.1 : Math.random() * 0.1,
      drugs: shouldFlag ? Math.random() * 0.6 + 0.4 : Math.random() * 0.2,
      weapons: shouldFlag ? Math.random() * 0.7 + 0.3 : Math.random() * 0.2,
      nudity: shouldFlag ? Math.random() * 0.8 + 0.2 : Math.random() * 0.2
    },
    description: shouldFlag ? "Potentially inappropriate content detected for testing purposes." : "A sample image description for development purposes."
  }
}