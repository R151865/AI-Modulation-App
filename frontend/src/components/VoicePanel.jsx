import { useState, useRef } from 'react'
import { Mic, Square, Play, AlertTriangle } from 'lucide-react'
import { uploadAudio, checkAudio } from '../services/api'

const VoicePanel = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [moderationResult, setModerationResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        
        // Send for moderation
        setIsLoading(true)
        try {
          const formData = new FormData()
          formData.append('audio', audioBlob, 'recording.webm')
          const result = await uploadAudio(formData)
          setModerationResult(result)
        } catch (error) {
          console.error('Error uploading audio:', error)
        } finally {
          setIsLoading(false)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Voice Moderation</h2>
      
      <div className="flex flex-col items-center space-y-6">
        <div className="flex gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 flex items-center"
            >
              <Mic size={24} />
              <span className="ml-2">Start Recording</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-danger-500 text-white p-4 rounded-full hover:bg-danger-600 flex items-center"
            >
              <Square size={24} />
              <span className="ml-2">Stop Recording</span>
            </button>
          )}
        </div>

        {audioUrl && (
          <div className="w-full">
            <div className="flex items-center justify-center mb-4">
              <audio controls src={audioUrl} className="w-64">
                Your browser does not support the audio element.
              </audio>
            </div>

            {isLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Analyzing audio...</p>
              </div>
            )}

            {moderationResult && !isLoading && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Moderation Results:</h3>
                {moderationResult.transcription && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">Transcription:</p>
                    <p className="bg-white p-3 rounded border">{moderationResult.transcription}</p>
                  </div>
                )}
                
                {moderationResult.flagged && (
                  <div className="flex items-center text-danger-500 mb-2">
                    <AlertTriangle size={16} className="mr-1" />
                    <span>Content Flagged</span>
                  </div>
                )}
                
                {moderationResult.categories && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Detected categories:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(moderationResult.categories).map(([category, score]) => (
                        <span
                          key={category}
                          className={`px-2 py-1 rounded text-xs ${
                            score > 0.7 ? 'bg-danger-100 text-danger-800' :
                            score > 0.4 ? 'bg-warning-100 text-warning-800' :
                            'bg-success-100 text-success-800'
                          }`}
                        >
                          {category}: {(score * 100).toFixed(1)}%
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default VoicePanel