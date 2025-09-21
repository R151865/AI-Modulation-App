import { useState, useEffect } from 'react'
import { AlertTriangle, Shield, Activity, Users } from 'lucide-react'
import { getIncidents, getStats } from '../services/api'
import { setupSocket } from '../utils/socket'

const ModeratorPanel = () => {
  const [incidents, setIncidents] = useState([])
  const [stats, setStats] = useState({
    totalIncidents: 0,
    highRisk: 0,
    mediumRisk: 0,
    todayIncidents: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
    
    // Setup WebSocket for real-time updates
    const socket = setupSocket()
    socket.on('new-incident', (incident) => {
      setIncidents(prev => [incident, ...prev.slice(0, 9)])
      setStats(prev => ({
        ...prev,
        totalIncidents: prev.totalIncidents + 1,
        todayIncidents: prev.todayIncidents + 1,
        highRisk: incident.severity === 'high' ? prev.highRisk + 1 : prev.highRisk,
        mediumRisk: incident.severity === 'medium' ? prev.mediumRisk + 1 : prev.mediumRisk
      }))
    })

    return () => socket.disconnect()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [incidentsData, statsData] = await Promise.all([
        getIncidents(),
        getStats()
      ])
      setIncidents(incidentsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Incidents</p>
              <p className="text-2xl font-bold">{stats.totalIncidents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-danger-100 rounded-lg">
              <AlertTriangle className="text-danger-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-danger-600">{stats.highRisk}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-lg">
              <Shield className="text-warning-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Medium Risk</p>
              <p className="text-2xl font-bold text-warning-600">{stats.mediumRisk}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-lg">
              <Users className="text-success-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Today's Incidents</p>
              <p className="text-2xl font-bold">{stats.todayIncidents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Incidents</h2>
        
        {incidents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No incidents reported yet.</p>
        ) : (
          <div className="space-y-4">
            {incidents.map(incident => (
              <div key={incident._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">
                    {new Date(incident.timestamp).toLocaleString()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    incident.severity === 'high' ? 'bg-danger-100 text-danger-800' :
                    incident.severity === 'medium' ? 'bg-warning-100 text-warning-800' :
                    'bg-success-100 text-success-800'
                  }`}>
                    {incident.severity} risk
                  </span>
                </div>
                
                <p className="mb-2">{incident.content}</p>
                
                {incident.type === 'image' && incident.metadata?.imageUrl && (
                  <img
                    src={incident.metadata.imageUrl}
                    alt="Moderated content"
                    className="w-32 h-32 object-cover rounded border"
                  />
                )}
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(incident.categories || {}).map(([category, score]) => (
                    <span
                      key={category}
                      className="px-2 py-1 bg-gray-100 rounded text-xs"
                    >
                      {category}: {(score * 100).toFixed(1)}%
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ModeratorPanel