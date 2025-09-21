import express from 'express'
import multer from 'multer'
import { moderateAudio } from '../controllers/audioController.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/', upload.single('audio'), moderateAudio)

export default router