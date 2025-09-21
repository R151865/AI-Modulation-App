import { useState } from 'react'
import { Send, AlertTriangle } from 'lucide-react'
import { sendMessage, checkText } from '../services/api'
import HighlightedText from './HighlightedText'

const ChatPanel = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    setIsLoading(true)
    try {
      // Check message for moderation
      const moderationResult = await checkText(message)
      
      console.log('Moderation result:', moderationResult)

      const newMessage = {
        id: Date.now(),
        text: message,
        timestamp: new Date(),
        moderation: moderationResult
      }

      setMessages(prev => [...prev, newMessage])
      
      // Send to backend for processing
      const response = await sendMessage(newMessage)
      console.log(response, "response eree")
      
      setMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Chat Moderation</h2>
      
      <div className="mb-6 h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No messages yet. Start a conversation!</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="mb-3 p-3 rounded-lg bg-white border">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-500">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
                {msg.moderation && msg.moderation.flagged && (
                  <span className="flex items-center text-danger-500">
                    <AlertTriangle size={16} className="mr-1" />
                    Flagged
                  </span>
                )}
              </div>
              <HighlightedText 
                text={msg.text} 
                highlights={msg.moderation?.highlights || []} 
              />
              {msg.moderation && (
                <div className="mt-2 text-sm">
                  <span className={`moderation-badge ${
                    msg.moderation.severity === 'high' ? 'badge-high' :
                    msg.moderation.severity === 'medium' ? 'badge-medium' : 'badge-low'
                  }`}>
                    {msg.moderation.severity} risk
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}

export default ChatPanel