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
  // Mock response for development
  return {
    flagged: Math.random() > 0.7,
    severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
    categories: {
      explicit_content: Math.random() * 0.3,
      violence: Math.random() * 0.2,
      hate_symbols: Math.random() * 0.1,
      drugs: Math.random() * 0.4,
      weapons: Math.random() * 0.5,
      nudity: Math.random() * 0.6
    },
    scores: {
      explicit_content: Math.random() * 0.3,
      violence: Math.random() * 0.2,
      hate_symbols: Math.random() * 0.1,
      drugs: Math.random() * 0.4,
      weapons: Math.random() * 0.5,
      nudity: Math.random() * 0.6
    },
    description: "A sample image description for development purposes."
  }
}