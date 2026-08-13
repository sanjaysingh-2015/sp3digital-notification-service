const Industry = require('./Industry');
const LeadMessage = require('./LeadMessage');
const SocialAnalysis = require('./SocialAnalysis');

// Define Associations here after all models are required
Industry.hasMany(LeadMessage, { foreignKey: 'industry_id' });
LeadMessage.belongsTo(Industry, { foreignKey: 'industry_id' });

module.exports = {
  Industry,
  LeadMessage,
  SocialAnalysis,
};