import { Shield, MessageCircle, Mic, Image, BarChart3 } from 'lucide-react'

const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'image', label: 'Image', icon: Image },
    { id: 'moderator', label: 'Dashboard', icon: BarChart3 }
  ]

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Shield className="text-blue-600" size={32} />
            <span className="text-xl font-bold text-gray-800">AI Moderation</span>
          </div>
          
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} className="mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar