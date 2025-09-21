import { transcribeAudio } from '../src/services/whisperService.js'

jest.mock('../src/services/whisperService.js')

describe('Audio Moderation', () => {
  test('should transcribe audio', async () => {
    // Mock audio buffer
    const mockAudioBuffer = Buffer.from('mock audio data')
    
    const transcription = await transcribeAudio(mockAudioBuffer)
    
    expect(typeof transcription).toBe('string')
    expect(transcription.length).toBeGreaterThan(0)
  })
})