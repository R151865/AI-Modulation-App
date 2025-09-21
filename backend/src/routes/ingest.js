import express from 'express'
import { ingestText } from '../controllers/ingestController.js'

const router = express.Router()

router.post('/text', ingestText)

export default router