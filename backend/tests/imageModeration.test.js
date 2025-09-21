import { moderateImageContent } from '../src/services/imageModerationService.js'

jest.mock('../src/services/imageModerationService.js')

describe('Image Moderation', () => {
  test('should analyze image content', async () => {
    // Mock image buffer
    const mockImageBuffer = Buffer.from('mock image data')
    
    const result = await moderateImageContent(mockImageBuffer)
    
    expect(result).toHaveProperty('flagged')
    expect(result).toHaveProperty('severity')
    expect(result).toHaveProperty('categories')
  })
})