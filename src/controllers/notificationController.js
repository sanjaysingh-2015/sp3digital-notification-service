const messagingService = require('../services/messagingService');

exports.dispatchNotification = async (req, res) => {
  const { channel, recipient, subject, content } = req.body;

  try {
    let response;
    switch (channel.toLowerCase()) {
      case 'email':
        response = await messagingService.sendEmail({ to: recipient, subject, body: content });
        break;
      case 'whatsapp':
        response = await messagingService.sendWhatsApp({ to: recipient, body: content });
        break;
      case 'linkedin':
        response = await messagingService.postToLinkedIn({ text: content });
        break;
      default:
        return res.status(400).json({ error: 'Unsupported channel. Choose email, whatsapp, or linkedin.' });
    }

    res.status(200).json({ success: true, channel, response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};