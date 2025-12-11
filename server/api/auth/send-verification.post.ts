import nodemailer from 'nodemailer'
import { adminAuth, adminFirestore } from '~/server/utils/firebase-admin'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    // Get Firebase Admin instances
    const auth = adminAuth()
    const db = adminFirestore()

    // Get authorization header
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    const idToken = authHeader.split('Bearer ')[1]

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken)
    const uid = decodedToken.uid

    // Get user from Firestore
    const userDoc = await db.collection('users').doc(uid).get()
    if (!userDoc.exists) {
      throw createError({
        statusCode: 404,
        message: 'ไม่พบผู้ใช้งาน'
      })
    }

    const userData = userDoc.data()!
    const email = userData.email

    if (!email) {
      throw createError({
        statusCode: 400,
        message: 'ไม่พบอีเมลในบัญชีผู้ใช้'
      })
    }

    // Check if already verified
    if (userData.emailVerified === true) {
      throw createError({
        statusCode: 400,
        message: 'อีเมลได้รับการยืนยันแล้ว'
      })
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    const now = new Date()

    // Update token in Firestore
    await db.collection('users').doc(uid).update({
      'emailVerification.token': verificationToken,
      'emailVerification.expiresAt': expiresAt,
      'emailVerification.sentAt': now
    })

    // Get SMTP password from env
    const smtpPassword = process.env.SMTP_PASSWORD
    const isDev = process.env.NODE_ENV === 'development'

    // In development mode, just log the verification URL instead of sending email
    if (isDev) {
      const devUrl = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}&uid=${uid}`
      console.log('\n========================================')
      console.log('📧 DEV MODE: Email verification link:')
      console.log(devUrl)
      console.log('========================================\n')
      return {
        success: true,
        message: 'ส่งอีเมลยืนยันเรียบร้อยแล้ว'
      }
    }

    if (!smtpPassword) {
      console.warn('SMTP_PASSWORD not set in environment variables')
      throw createError({
        statusCode: 500,
        message: 'ระบบส่งอีเมลยังไม่พร้อมใช้งาน'
      })
    }

    // Create transporter with SMTP settings
    const transporter = nodemailer.createTransport({
      host: 'บันทึกนิรนาม.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: 'noreply@บันทึกนิรนาม.com',
        pass: smtpPassword
      },
      tls: {
        rejectUnauthorized: false // Accept self-signed certificates
      },
      connectionTimeout: 10000, // 10 seconds
      socketTimeout: 10000
    })

    // Verification URL
    const baseUrl = process.env.NUXT_PUBLIC_BASE_URL || 'https://บันทึกนิรนาม.com'
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}&uid=${uid}`

    // Send email with beautiful template
    await transporter.sendMail({
      from: '"บันทึกนิรนาม" <noreply@บันทึกนิรนาม.com>',
      to: email,
      subject: '✉️ ยืนยันอีเมลของคุณ - บันทึกนิรนาม',
      html: generateEmailTemplate(verificationUrl, email)
    })

    return {
      success: true,
      message: 'ส่งอีเมลยืนยันเรียบร้อยแล้ว'
    }
  } catch (error: any) {
    console.error('Send verification email error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่'
    })
  }
})

function generateEmailTemplate(verificationUrl: string, email: string): string {
  return `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>ยืนยันอีเมล - บันทึกนิรนาม</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap');
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Prompt', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); overflow: hidden;">

          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%); padding: 48px 40px; text-align: center;">
              <!-- Animated Envelope Icon -->
              <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: rgba(255,255,255,0.15); border-radius: 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">✉️</span>
              </div>
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                ยืนยันอีเมลของคุณ
              </h1>
              <p style="margin: 12px 0 0; font-size: 16px; color: rgba(255,255,255,0.8);">
                เหลืออีกขั้นตอนเดียวเท่านั้น!
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <!-- Greeting -->
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
                สวัสดีครับ/ค่ะ 👋
              </p>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
                ขอบคุณที่สมัครใช้งาน <strong style="color: #4338ca;">บันทึกนิรนาม</strong> พื้นที่ปลอดภัยสำหรับเขียนบันทึกและระบายความรู้สึกของคุณ
              </p>

              <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.7; color: #374151;">
                กรุณาคลิกปุ่มด้านล่างเพื่อยืนยันอีเมล <strong>${email}</strong>
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}"
                       style="display: inline-block; padding: 18px 48px; background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%); color: #ffffff; font-size: 18px; font-weight: 600; text-decoration: none; border-radius: 14px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4); transition: all 0.3s ease;">
                      ✓ ยืนยันอีเมลของฉัน
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Timer Warning -->
              <div style="margin: 32px 0; padding: 16px 20px; background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%); border-radius: 12px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; font-size: 14px; color: #92400e;">
                  ⏰ <strong>ลิงก์นี้จะหมดอายุใน 24 ชั่วโมง</strong><br>
                  กรุณายืนยันอีเมลก่อนหมดเวลา
                </p>
              </div>

              <!-- What's Next -->
              <div style="margin: 32px 0 0;">
                <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #111827;">
                  หลังยืนยันอีเมลแล้ว คุณจะสามารถ:
                </h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 8px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="width: 32px; height: 32px; background: #ede9fe; border-radius: 8px; text-align: center; vertical-align: middle;">
                            <span style="font-size: 16px;">📝</span>
                          </td>
                          <td style="padding-left: 12px; font-size: 14px; color: #4b5563;">
                            เขียนบันทึกส่วนตัวได้ไม่จำกัด
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="width: 32px; height: 32px; background: #dbeafe; border-radius: 8px; text-align: center; vertical-align: middle;">
                            <span style="font-size: 16px;">🤖</span>
                          </td>
                          <td style="padding-left: 12px; font-size: 14px; color: #4b5563;">
                            คุยกับ AI Companion ที่คอยรับฟังคุณ
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="width: 32px; height: 32px; background: #fce7f3; border-radius: 8px; text-align: center; vertical-align: middle;">
                            <span style="font-size: 16px;">💜</span>
                          </td>
                          <td style="padding-left: 12px; font-size: 14px; color: #4b5563;">
                            เชื่อมต่อกับชุมชนที่เข้าใจและรับฟัง
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0 0 24px;">

              <p style="margin: 0 0 8px; font-size: 13px; color: #9ca3af; text-align: center;">
                หากปุ่มไม่ทำงาน กรุณาคัดลอกลิงก์นี้ไปวางในเบราว์เซอร์:
              </p>
              <p style="margin: 0 0 16px; font-size: 12px; text-align: center;">
                <a href="${verificationUrl}" style="color: #6366f1; word-break: break-all;">
                  ${verificationUrl}
                </a>
              </p>

              <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
                หากคุณไม่ได้สมัครใช้งาน กรุณาเพิกเฉยอีเมลนี้
              </p>
            </td>
          </tr>
        </table>

        <!-- Bottom Branding -->
        <table role="presentation" width="100%" style="max-width: 520px; margin-top: 24px;">
          <tr>
            <td align="center">
              <p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #6b7280;">
                📖 บันทึกนิรนาม
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                พื้นที่ปลอดภัยสำหรับเรื่องราวของคุณ
              </p>
              <p style="margin: 16px 0 0; font-size: 11px; color: #d1d5db;">
                © ${new Date().getFullYear()} บันทึกนิรนาม. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
