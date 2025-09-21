import Incident from '../src/models/Incident.js'

// Mock the database model
jest.mock('../src/models/Incident.js')

describe('Alerts System', () => {
  test('should retrieve incidents', async () => {
    const mockIncidents = [
      { content: 'Test incident 1', severity: 'medium' },
      { content: 'Test incident 2', severity: 'high' }
    ]
    
    Incident.find.mockResolvedValue(mockIncidents)
    
    const incidents = await Incident.find()
    
    expect(incidents).toHaveLength(2)
    expect(incidents[0]).toHaveProperty('content')
    expect(incidents[0]).toHaveProperty('severity')
  })
})