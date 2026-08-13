const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const socialController = require('../controllers/socialController');

/**
 * @openapi
 * /notifications/send:
 *   post:
 *     summary: Send a notification across supported channels
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - channel
 *               - content
 *             properties:
 *               channel:
 *                 type: string
 *                 enum: [email, sms, whatsapp, linkedin]
 *                 example: email
 *               recipient:
 *                 type: string
 *                 example: client@example.com
 *               subject:
 *                 type: string
 *                 example: Project Proposal - SP3 Digital
 *               content:
 *                 type: string
 *                 example: <h1>Hello</h1><p>Thank you for reaching out!</p>
 *     responses:
 *       200:
 *         description: Message successfully dispatched
 *       400:
 *         description: Unsupported channel or missing fields
 *       500:
 *         description: Internal server error
 */
router.post('/notifications/send', notificationController.dispatchNotification);

/**
 * @openapi
 * /social/analyze:
 *   post:
 *     summary: Analyze sentiment and keywords of incoming social messages and store in MySQL
 *     tags: [Social Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - platform
 *               - messages
 *             properties:
 *               platform:
 *                 type: string
 *                 example: LinkedIn
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - sender
 *                     - content
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: m101
 *                     sender:
 *                       type: string
 *                       example: John Doe
 *                     content:
 *                       type: string
 *                       example: Great article on AI adoption in healthcare!
 *     responses:
 *       200:
 *         description: Messages processed and saved
 *       400:
 *         description: Invalid payload
 */
router.post('/social/analyze', socialController.analyzeAndStore);

/**
 * @openapi
 * /social/messages:
 *   get:
 *     summary: Retrieve all stored social message analyses
 *     tags: [Social Analytics]
 *     responses:
 *       200:
 *         description: List of stored social message records
 */
router.get('/social/messages', socialController.getAnalyzedMessages);

module.exports = router;