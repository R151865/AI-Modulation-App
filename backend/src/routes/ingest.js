import express from 'express'
import multer from 'multer'
import { ingestText, ingestAudio, ingestImage } from '../controllers/ingestController.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Routes
router.post('/text', ingestText)
router.post('/audio', upload.single('audio'), ingestAudio)
router.post('/image', upload.single('image'), ingestImage)

export default router