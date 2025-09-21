import express from 'express'
import multer from 'multer'
import { moderateImage } from '../controllers/imageController.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/', upload.single('image'), moderateImage)

export default router