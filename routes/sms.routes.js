import { Router } from 'express';
import { sendSMS, getSMSStatus, validateSMS } from '../controllers/sms.controller.js';

const router = Router();

// Send SMS
router.post('/send', validateSMS, sendSMS);

// Get SMS status
router.get('/:id', getSMSStatus);

export default router; 