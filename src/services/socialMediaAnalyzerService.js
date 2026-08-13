const { pool } = require('../config/db');

class SocialMediaAnalyzerService {
  analyzeMessage(text) {
    const lower = text.toLowerCase();
    
    let sentiment = 'NEUTRAL';
    if (lower.includes('great') || lower.includes('excellent') || lower.includes('interested') || lower.includes('awesome')) {
      sentiment = 'POSITIVE';
    } else if (lower.includes('bad') || lower.includes('issue') || lower.includes('error') || lower.includes('unhappy')) {
      sentiment = 'NEGATIVE';
    }

    const techKeywords = ['ai', 'cloud', 'migration', 'react', 'node', 'healthcare', 'modernization', 'consulting'];
    const foundKeywords = techKeywords.filter(kw => lower.includes(kw));

    return {
      sentiment,
      keywords: foundKeywords.join(', ') || 'general_inquiry'
    };
  }

  async processAndStoreMessages(platform, messages) {
    const results = [];

    for (const msg of messages) {
      const { sentiment, keywords } = this.analyzeMessage(msg.content);

      // MySQL prepared statement execution
      await pool.execute(
        `INSERT INTO social_analyses (platform, message_id, sender, content, sentiment, keywords)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [platform, msg.id, msg.sender, msg.content, sentiment, keywords]
      );

      results.push({
        id: msg.id,
        platform,
        sender: msg.sender,
        sentiment,
        keywords
      });
    }

    return results;
  }
}

module.exports = new SocialMediaAnalyzerService();