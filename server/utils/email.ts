import nodemailer from 'nodemailer'

let transporter: nodemailer.Transporter | null = null

export const getEmailTransporter = () => {
  if (transporter) return transporter

  const config = useRuntimeConfig()

  console.log('SMTP Config:', {
    host: config.smtpHost,
    port: config.smtpPort,
    user: config.smtpUser,
    hasPass: !!config.smtpPass
  })

  transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: true,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass
    },
    tls: {
      // Allow self-signed certificates (common with Hostatom)
      rejectUnauthorized: false
    }
  })

  return transporter
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export const sendEmail = async (options: EmailOptions) => {
  const config = useRuntimeConfig()
  const transporter = getEmailTransporter()

  const mailOptions = {
    from: `"PetCanGo" <${config.smtpUser}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text || ''
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email error:', error)
    throw error
  }
}

export const emailTemplates = {
  hotelApproved: (hotelName: string, hotelSlug: string) => ({
    subject: `ยินดีด้วย! ที่พัก "${hotelName}" ได้รับการอนุมัติแล้ว`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF8E00, #FF6B00); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background: #fff; padding: 30px; border: 1px solid #eee; }
          .success-icon { font-size: 48px; text-align: center; margin-bottom: 20px; }
          .btn { display: inline-block; background: #FF8E00; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐾 PetCanGo</h1>
          </div>
          <div class="content">
            <div class="success-icon">✅</div>
            <h2 style="text-align: center; color: #22c55e;">ที่พักของคุณได้รับการอนุมัติแล้ว!</h2>
            <p>สวัสดีครับ/ค่ะ,</p>
            <p>เรายินดีที่จะแจ้งให้ทราบว่าที่พัก <strong>"${hotelName}"</strong> ได้ผ่านการตรวจสอบและเผยแพร่บนเว็บไซต์ PetCanGo เรียบร้อยแล้ว</p>
            <p>ตอนนี้ลูกค้าสามารถค้นหาและดูข้อมูลที่พักของคุณได้แล้ว</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="https://petcango.com/hotels/${hotelSlug}" class="btn">ดูที่พักของคุณ</a>
            </p>
            <p>ขอบคุณที่ร่วมเป็นส่วนหนึ่งของ PetCanGo!</p>
            <p>ทีมงาน PetCanGo</p>
          </div>
          <div class="footer">
            <p>© 2025 PetCanGo. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  hotelRejected: (hotelName: string, reason: string) => ({
    subject: `แจ้งเตือน: ที่พัก "${hotelName}" ไม่ผ่านการอนุมัติ`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF8E00, #FF6B00); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background: #fff; padding: 30px; border: 1px solid #eee; }
          .warning-icon { font-size: 48px; text-align: center; margin-bottom: 20px; }
          .reason-box { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .btn { display: inline-block; background: #FF8E00; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐾 PetCanGo</h1>
          </div>
          <div class="content">
            <div class="warning-icon">⚠️</div>
            <h2 style="text-align: center; color: #ef4444;">ที่พักไม่ผ่านการอนุมัติ</h2>
            <p>สวัสดีครับ/ค่ะ,</p>
            <p>เราเสียใจที่ต้องแจ้งให้ทราบว่าที่พัก <strong>"${hotelName}"</strong> ไม่ผ่านการตรวจสอบ</p>
            <div class="reason-box">
              <strong>เหตุผล:</strong>
              <p>${reason}</p>
            </div>
            <p>คุณสามารถแก้ไขข้อมูลและส่งเพื่อตรวจสอบใหม่ได้</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="https://petcango.com/my-hotels" class="btn">แก้ไขที่พัก</a>
            </p>
            <p>ทีมงาน PetCanGo</p>
          </div>
          <div class="footer">
            <p>© 2025 PetCanGo. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
}

// Helper functions for sending specific emails
interface HotelApprovalEmailOptions {
  hotelName: string
  ownerEmail: string
  hotelUrl?: string
}

export const sendHotelApprovalEmail = async (options: HotelApprovalEmailOptions) => {
  const { hotelName, ownerEmail, hotelUrl } = options
  const slug = hotelUrl || 'my-hotels'
  const template = emailTemplates.hotelApproved(hotelName, slug)

  try {
    return await sendEmail({
      to: ownerEmail,
      subject: template.subject,
      html: template.html
    })
  } catch (error) {
    console.error('Failed to send approval email:', error)
    // Don't throw - email failure shouldn't block the approval
    return { success: false, error }
  }
}

interface HotelRejectionEmailOptions {
  hotelName: string
  ownerEmail: string
  reason: string
}

export const sendHotelRejectionEmail = async (options: HotelRejectionEmailOptions) => {
  const { hotelName, ownerEmail, reason } = options
  const template = emailTemplates.hotelRejected(hotelName, reason)

  try {
    return await sendEmail({
      to: ownerEmail,
      subject: template.subject,
      html: template.html
    })
  } catch (error) {
    console.error('Failed to send rejection email:', error)
    // Don't throw - email failure shouldn't block the rejection
    return { success: false, error }
  }
}
