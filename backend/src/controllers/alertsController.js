import Incident from '../models/Incident.js'

export const getIncidents = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const incidents = await Incident.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    res.json(incidents)
  } catch (error) {
    next(error)
  }
}

export const getStats = async (req, res, next) => {
  try {
    const totalIncidents = await Incident.countDocuments()
    const highRisk = await Incident.countDocuments({ severity: 'high' })
    const mediumRisk = await Incident.countDocuments({ severity: 'medium' })
    
    // Today's incidents
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const todayIncidents = await Incident.countDocuments({
      timestamp: { $gte: startOfToday }
    })

    res.json({
      totalIncidents,
      highRisk,
      mediumRisk,
      todayIncidents
    })
  } catch (error) {
    next(error)
  }
}