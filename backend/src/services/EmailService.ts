import nodemailer, { Transporter } from 'nodemailer';

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  async sendRequestConfirmation(
    email: string,
    name: string,
    requestId: string
  ): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Request Confirmation</h2>
          <p>Dear ${name},</p>
          <p>Thank you for submitting your assistance request to Moksh Sanskar Foundation.</p>
          <p><strong>Your Request ID:</strong> ${requestId}</p>
          <p>We have received your request and our team will review it shortly. You will receive updates via email as your request progresses.</p>
          <p>If you have any urgent questions, please contact us:</p>
          <ul>
            <li>Phone: ${process.env.SUPPORT_PHONE || 'N/A'}</li>
            <li>Email: ${process.env.SENDER_EMAIL}</li>
          </ul>
          <p>With compassion,<br/>Moksh Sanskar Foundation Team</p>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Moksh Sanskar Foundation - Request Confirmation',
      html: htmlContent
    });
  }

  async sendStatusUpdate(
    email: string,
    name: string,
    status: string,
    message: string
  ): Promise<void> {
    const statusLabels: Record<string, string> = {
      pending: 'Pending Review',
      reviewing: 'Under Review',
      approved: 'Approved',
      rejected: 'Request Not Approved',
      completed: 'Assistance Completed'
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Request Status Update</h2>
          <p>Dear ${name},</p>
          <p>Your request status has been updated:</p>
          <p><strong style="color: #8B7355;">Status: ${statusLabels[status] || status}</strong></p>
          <p>${message}</p>
          <p>If you have questions, please reach out to us.</p>
          <p>With compassion,<br/>Moksh Sanskar Foundation Team</p>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `Moksh Sanskar Foundation - Status Update: ${statusLabels[status] || status}`,
      html: htmlContent
    });
  }

  async sendAdminNotification(
    adminEmail: string,
    requestName: string,
    requestId: string,
    urgency: string
  ): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>New Assistance Request</h2>
          <p>A new assistance request requires review:</p>
          <ul>
            <li><strong>Request ID:</strong> ${requestId}</li>
            <li><strong>Requester Name:</strong> ${requestName}</li>
            <li><strong>Urgency:</strong> ${urgency.toUpperCase()}</li>
          </ul>
          <p>Please log in to the admin dashboard to review this request.</p>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: adminEmail,
      subject: `[${urgency.toUpperCase()}] New Assistance Request - ${requestId}`,
      html: htmlContent
    });
  }

  async sendContactNotification(
    adminEmail: string,
    name: string,
    email: string,
    subject: string,
    message: string
  ): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 15px;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            This is an automated message. Please reply directly to ${email}
          </p>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: adminEmail,
      subject: `[Contact Form] ${subject}`,
      html: htmlContent,
      replyTo: email
    });
  }

  async sendContactConfirmation(
    email: string,
    name: string,
    subject: string
  ): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>We Received Your Message</h2>
          <p>Dear ${name},</p>
          <p>Thank you for contacting Moksh Sanskar Foundation. We have received your message regarding:</p>
          <p><strong style="color: #8B7355;">Subject: ${subject}</strong></p>
          <p>Our team will review your message and get back to you as soon as possible.</p>
          <p>If you have any urgent concerns, please feel free to call us at ${process.env.SUPPORT_PHONE || 'N/A'}.</p>
          <p style="margin-top: 30px;">With compassion,<br/>Moksh Sanskar Foundation Team</p>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'We Received Your Message - Moksh Sanskar Foundation',
      html: htmlContent
    });
  }
}

export default new EmailService();
