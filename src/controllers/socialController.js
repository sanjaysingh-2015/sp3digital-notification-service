const analyzerService = require('../services/socialMediaAnalyzerService');
const { pool } = require('../config/db');

exports.analyzeAndStore = async (req, res) => {
  const { platform, messages } = req.body;

  if (!platform || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid payload. Provide platform and messages array.' });
  }

  try {
    const processed = await analyzerService.processAndStoreMessages(platform, messages);
    res.status(200).json({ success: true, count: processed.length, data: processed });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAnalyzedMessages = async (req, res) => {
  try {
    // Destructure MySQL query results array [rows, fields]
    const [rows] = await pool.query('SELECT * FROM social_analyses ORDER BY analyzed_at DESC');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};