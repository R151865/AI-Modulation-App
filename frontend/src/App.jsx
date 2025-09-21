import { useState } from 'react'
import Navbar from './components/Navbar'
import ChatPanel from './components/ChatPanel'
import VoicePanel from './components/VoicePanel'
import ImagePanel from './components/ImagePanel'
import ModeratorPanel from './components/ModeratorPanel'

function App() {
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'chat' && <ChatPanel />}
        {activeTab === 'voice' && <VoicePanel />}
        {activeTab === 'image' && <ImagePanel />}
        {activeTab === 'moderator' && <ModeratorPanel />}
      </div>
    </div>
  )
}

export default App