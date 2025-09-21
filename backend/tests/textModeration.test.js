import { moderateTextContent } from '../src/services/perspectiveService.js'
import { moderateWithOpenAI } from '../src/services/openaiService.js'

// Mock the APIs if keys are not configured
jest.mock('../src/services/perspectiveService.js')
jest.mock('../src/services/openaiService.js')

describe('Text Moderation', () => {
  test('should detect toxic content', async () => {
    const toxicText = "This is a hateful and toxic message"
    
    const perspectiveResult = await moderateTextContent(toxicText)
    const openaiResult = await moderateWithOpenAI(toxicText)
    
    // At least one should flag it
    expect(perspectiveResult.flagged || openaiResult.flagged).toBe(true)
  })
  
  test('should allow harmless content', async () => {
    const harmlessText = "Hello, how are you today? The weather is nice."
    
    const perspectiveResult = await moderateTextContent(harmlessText)
    const openaiResult = await moderateWithOpenAI(harmlessText)
    
    // Neither should flag it
    expect(perspectiveResult.flagged).toBe(false)
    expect(openaiResult.flagged).toBe(false)
  })
})