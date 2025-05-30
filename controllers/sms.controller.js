import { SMSProviderFactory } from '../services/sms.service.js';
import SMS from '../models/sms.model.js';
import { body, validationResult } from 'express-validator';

export const validateSMS = [
  body('to')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Invalid phone number format'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 1000 })
    .withMessage('Message too long'),
  body('provider')
    .optional()
    .isString()
    .withMessage('Provider must be a string'),
  body('config')
    .optional()
    .isObject()
    .withMessage('Config must be an object')
];

export const sendSMS = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { to, message, provider = 'msg91', config = {} } = req.body;

    // If using MSG91 as default provider, use environment variables
    if (provider === 'msg91' && !config.authKey) {
      config.authKey = process.env.MSG91_AUTH_KEY;
      config.senderId = process.env.MSG91_SENDER_ID;
      config.route = process.env.MSG91_ROUTE;
    }

    // Get the appropriate provider instance
    const smsProvider = SMSProviderFactory.getProvider(provider, config);

    // Create SMS record
    const sms = await SMS.create({
      to,
      message,
      provider,
      status: 'pending'
    });

    // Send SMS
    const result = await smsProvider.sendSMS(to, message);

    // Update SMS record
    await sms.update({
      status: result.success ? 'sent' : 'failed',
      providerResponse: result.response || result.error,
      metadata: { config: { ...config, authKey: undefined } }
    });

    return res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: {
        id: sms.id,
        status: sms.status,
        ...result
      }
    });

  } catch (error) {
    console.error('SMS sending error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const getSMSStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const sms = await SMS.findByPk(id);

    if (!sms) {
      return res.status(404).json({
        success: false,
        message: 'SMS not found'
      });
    }

    return res.json({
      success: true,
      data: sms
    });

  } catch (error) {
    console.error('Get SMS status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}; 