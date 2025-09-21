import express from 'express'
import { getIncidents, getStats } from '../controllers/alertsController.js'

const router = express.Router()

router.get('/incidents', getIncidents)
router.get('/stats', getStats)

export default router