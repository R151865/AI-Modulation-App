import express from 'express'
import { moderateText } from '../controllers/textController.js'

const router = express.Router()

router.post('/', moderateText)

export default router