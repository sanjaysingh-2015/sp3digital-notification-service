const nodemailer = require("nodemailer");
const axios = require("axios");
const { Industry, LeadMessage } = require("../models");

function parseFormBody(bodyText) {
  const getField = (label) => {
    const regex = new RegExp(`${label}\\s*:\\s*(.*)`, "i");
    const match = bodyText.match(regex);
    return match ? match[1].trim() : "";
  };

  const fullName = getField("Name");
  const nameParts = fullName.split(" ");

  return {
    name: getField("Name"),
    email: getField("Email"),
    phone: getField("Phone"),
    industry: getField("Industry"),
    company: getField("Company"),
    timeline: getField("Timeline"),
    challenge: getField("Current Challenge"),
    additionalInfo: getField("Additional Info"),
  };
}

class MessagingService {
  constructor() {
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Handles Industry resolution, duplicate checking, and saving the lead to MySQL.
   */
  async saveLeadToDatabase(parsed, fallbackBody) {
    let industryId = null;

    // 1. Resolve or Create Industry
    if (parsed.industry) {
      const code = parsed.industry
        .toUpperCase()
        .replace(/\s+/g, "_")
        .substring(0, 20);

      const [industryRecord] = await Industry.findOrCreate({
        where: { name: parsed.industry },
        defaults: {
          code,
          name: parsed.industry,
          status: "ACTIVE",
          created_by: "WEBSITE_CONTACT_FORM",
        },
      });
      industryId = industryRecord.id;
    }

    // 2. Check for Duplicate Lead (e.g., same email exists in the system)
    let leadStatus = "NEW";
    if (parsed.email) {
      const existingLead = await LeadMessage.findOne({
        where: { email: parsed.email, industry_id: industryId, company: parsed.company },
      });

      if (existingLead) {
        leadStatus = "DUPLICATE";
      }
    }

    // 3. Insert Lead Record
    const lead = await LeadMessage.create({
      industry_id: industryId,
      company: parsed.company,
      name: parsed.name,
      email: parsed.email,
      phone_number: parsed.phone,
      current_challenge: parsed.challenge,
      expected_timeline: parsed.timeline,
      additional_info: parsed.additionalInfo || fallbackBody,
      status: leadStatus,
      created_by: "WEBSITE_CONTACT_FORM",
    });

    console.log(
      `Lead message saved via Sequelize with ID: ${lead.id} [Status: ${leadStatus}]`,
    );
    return lead;
  }

  /**
   * Main Email Dispatch Method
   */
  async sendEmail({ to, subject, body }) {
    // 1. Parse fields from incoming body text
    const parsed = parseFormBody(body);

    // 2. Save Lead into Database (with Duplicate Check)
    const lead = await this.saveLeadToDatabase(parsed, body);

    // 3. Generate HTML Content
    const htmlContent = await this.generateFormattedEmailHtml(parsed);

    // 4. Send Email via Nodemailer
    const mailInfo = await this.emailTransporter.sendMail({
      from: `"SP3 Digital" <${process.env.SMTP_USER}>`,
      to,
      subject:
        subject || `New Lead Submission - ${parsed.name || "Website Inquiry"}`,
      html: htmlContent,
    });

    return {
      leadId: lead.id,
      leadStatus: lead.status,
      mailInfo,
    };
  }

  // Meta WhatsApp Cloud API
  //   async sendWhatsApp({ to, body }) {
  //     const phoneNumberId = process.env.META_WA_PHONE_NUMBER_ID;
  //     const token = process.env.META_WA_ACCESS_TOKEN;

  //     const cleanNumber = to.replace(/[^0-9]/g, '');
  //     const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

  //     const response = await axios.post(
  //       url,
  //       {
  //         messaging_product: 'whatsapp',
  //         recipient_type: 'individual',
  //         to: cleanNumber,
  //         type: 'text',
  //         text: { body },
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     return { messageId: response.data.messages[0].id, to: cleanNumber, status: 'SENT' };
  //   }

  // LinkedIn Post
//   async postToLinkedIn({ text }) {
//     const url = "https://api.linkedin.com/v2/ugcPosts";
//     const response = await axios.post(
//       url,
//       {
//         author: process.env.LINKEDIN_AUTHOR_URN,
//         lifecycleState: "PUBLISHED",
//         specificContent: {
//           "com.linkedin.ugc.ShareContent": {
//             shareCommentary: { text },
//             shareMediaCategory: "NONE",
//           },
//         },
//         visibility: { "com.linkedin.ugc.ShareVisibility": "PUBLIC" },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
//           "X-Restli-Protocol-Version": "2.0.0",
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     return response.data;
//   }

  //Email content
  
  async generateFormattedEmailHtml(parsed) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; color: #333333; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
          .header { background-color: #0f172a; color: #ffffff; padding: 24px; text-align: center; }
          .header h2 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px; }
          .content { padding: 28px; }
          .section-title { font-size: 14px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
          .grid { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .grid td { padding: 8px 0; vertical-align: top; }
          .label { width: 35%; font-weight: 600; color: #475569; }
          .value { width: 65%; color: #0f172a; }
          .box { background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 14px; margin-bottom: 20px; border-radius: 0 4px 4px 0; }
          .footer { background-color: #f1f5f9; text-align: center; padding: 16px; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Website Lead Notification</h2>
          </div>
          <div class="content">
            <div class="section-title">Contact Information</div>
            <table class="grid">
              <tr><td class="label">Full Name:</td><td class="value">${parsed.name || "N/A"}</td></tr>
              <tr><td class="label">Email Address:</td><td class="value"><a href="mailto:${parsed.email}">${parsed.email || "N/A"}</a></td></tr>
              <tr><td class="label">Phone Number:</td><td class="value">${parsed.phone || "N/A"}</td></tr>
            </table>

            <div class="section-title">Company Overview</div>
            <table class="grid">
              <tr><td class="label">Company Name:</td><td class="value">${parsed.company || "N/A"}</td></tr>
              <tr><td class="label">Industry:</td><td class="value">${parsed.industry || "N/A"}</td></tr>
              <tr><td class="label">Expected Timeline:</td><td class="value">${parsed.timeline || "N/A"}</td></tr>
            </table>

            ${
              parsed.challenge
                ? `
              <div class="section-title">Current Challenge</div>
              <div class="box">${parsed.challenge}</div>
            `
                : ""
            }

            ${
              parsed.additionalInfo
                ? `
              <div class="section-title">Additional Details</div>
              <div class="box">${parsed.additionalInfo}</div>
            `
                : ""
            }
          </div>
          <div class="footer">
            Sent automatically via SP3 Digital Website Lead System
          </div>
        </div>
      </body>
    </html>
  `;
  }
}

module.exports = new MessagingService();
