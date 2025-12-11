# Nira (บันทึกนิรนาม) - Project Context for Claude

## ภาพรวมโปรเจค
**Nira** คือแพลตฟอร์ม Anonymous Diary สำหรับเขียนไดอารี่และระบายความรู้สึก พร้อม AI Bot Companion (ใช้ Grok API)

> "การเขียนบันทึกเป็นวิธีที่ทำให้เราเข้าใจตัวเองได้"

## Business Model
- **Freemium:** ฟีเจอร์พื้นฐานฟรี (จำกัด 100 posts)
- **Premium:** 79฿/เดือน หรือ 699฿/ปี
- **CBT Courses:** 499฿/คอร์ส
- **Therapy Referral:** Commission 400฿/session

## Revenue Funnel
```
Free Diary → AI Bot → Premium (25%) → Therapy (30%) → LTV 2,500฿
```

## Tech Stack
- **Frontend:** Nuxt 3 + Vue 3 + TypeScript
- **Database:** Firebase Firestore (Client SDK)
- **Auth:** Firebase Authentication (Anonymous, Email, Google)
- **Storage:** Firebase Storage
- **AI Bot:** Grok API
- **Payment:** Stripe
- **Styling:** Tailwind CSS + SCSS + @nuxt/ui
- **Deployment:** Vercel (region: sin1)

## โครงสร้างหลัก
```
pages/           # หน้าหลัก
├── index.vue    # Landing page + Featured posts
├── browse.vue   # Browse posts timeline
├── editor.vue   # Rich text editor (deprecated - ใช้ my-story แทน)
├── my-story.vue # เขียนไดอารี่/เรื่องราว
├── my-problem/  # ระบายความรู้สึก/ปัญหา
├── users/[slug].vue  # หน้าโปรไฟล์ผู้ใช้ (ใช้งานหลัก - ไม่ใช่ /profile)
├── account.vue  # จัดการบัญชี (3 tabs: ข้อมูล, เพื่อน, ประวัติ)
├── login.vue    # Login
├── signup.vue   # Registration
├── pricing.vue  # Subscription plans
└── about.vue    # About page

components/      # Vue components
composables/     # 12 composables
├── useAuth.ts           # Firebase Auth + Role system
├── useProfile.ts        # User profile management
├── useFirebase.ts       # Firebase initialization
├── useFirestore.ts      # Firestore CRUD
├── useFirebaseStorage.ts
├── useFileUpload.ts
├── useSEO.ts
├── useImageOptimization.ts
├── useLazyLoad.ts
├── usePageView.ts
├── useGlobalSearch.ts
└── useStorage.ts

middleware/      # 3 middleware
├── auth.ts      # Requires login
├── admin.ts     # Requires admin role
└── superadmin.ts

layouts/         # 3 layouts
├── default.vue
├── admin.vue
└── backend.vue
```

## Feature List (57 Features)

### FREE TIER (10)
1. Anonymous Registration - Firebase Auth anonymous UID
2. Diary Timeline - โพสต์เรียงเวลา Infinite scroll
3. New Post Editor - Rich text, Emoji picker, Character counter
4. Post Lock Toggle - ล็อกเฉพาะเจ้าของ/approved friends
5. Post Visibility - Public, Friends only, Locked
6. Real-time Emotions - Like, Sad, Happy (Firestore counter)
7. Comments System - Real-time comments + Emotion reactions
8. Featured Posts - Landing page popular posts (likes ≥50)
9. Search Posts - ค้นหา keyword โพสต์ public
10. Daily Streak - บันทึกต่อเนื่อง + Gamification badges

### FRIEND SYSTEM (6)
11. Friend Discovery - ดู users ที่ comment โพสต์คุณบ่อย
12. Send Friend Request - กดเพิ่มเพื่อนใน profile
13. Friend Requests Page - รอ approve/reject
14. Friend List - แสดงเพื่อน + Online status (RTDB presence)
15. Friend Posts Feed - Timeline แยกเพื่อน filter locked posts
16. Unfriend - ลบเพื่อน ถอนสิทธิ์ locked posts

### AI BOT COMPANION (7)
17. Bot Chat Window - แชทข้าง diary editor real-time
18. 4 Bot Skins - พระสงฆ์ หลวงพี่ปัญญา, คุณย่า, นักจิตวิทยา, GenZ
19. Client-side Encryption - AES-256 CryptoJS
20. Bot Memory - จำ conversation 10 ครั้ง (Firestore)
21. Risk Detection - Grok API risk score 0-1
22. Therapy Upsell - Risk ≥0.7 Modal ปรึกษาจิตแพทย์ 500฿
23. RAG Knowledge Base - พุทธธรรม CBT Vector DB

### PREMIUM (10) - 79฿/เดือน
24. AI Mood Analysis - แผนภูมิ trends 7/30/90 วัน
25. Mood Insights Report - "เครียดวันจันทร์ 20% สูงกว่าปกติ"
26. Unlimited Storage - ฟรีจำกัด 100 posts
27. Export PDF/Excel - ดาวน์โหลด diary ทั้งหมด
28. Private PIN Folder - โฟลเดอร์ลับ PIN 4 หลัก
29. Custom Themes - 20 themes + Dark mode
30. Priority Comments - Comment พิเศษ pin to top
31. Achievement Certificates - บันทึกนิรนาม 1 ปี PDF
32. Offline Mode - บันทึกออฟไลน์ sync ออนไลน์
33. Advanced Search - Filter date, emotion, friends

### MONETIZATION (5)
34. Stripe Subscription - 79฿/เดือน, 699฿/ปี
35. CBT Courses - 499฿/คอร์ส 30วันปลดล็อก
36. Therapy Referral - คอม 400฿/session
37. Donation Button - สนับสนุนบันทึกนิรนาม
38. Non-intrusive Ads - Premium no ads

### SOCIAL COMMUNITY (5)
39. Post Sharing - Share link ไม่เปิด content
40. Follow System - Follow public creators
41. Trending Posts - Top likes 24 ชม.
42. Hashtags - #เครียดงาน #สุขภาพจิต #ระบายใจ
43. Notifications - New comment, friend request (FCM)

### ADMIN ANALYTICS (4)
44. Admin Dashboard - Revenue, User stats
45. Therapy Affiliate Stats - คลินิก convert สูงสุด
46. Bot Performance - Risk accuracy, feedback
47. A/B Testing - Upsell modal variants

### TECHNICAL (6)
48. Cross-platform Sync - Web, iOS, Android (Firebase)
49. PWA Support - Install home screen
50. Push Notifications - Daily reminder
51. Rate Limiting - Bot 50 messages/วัน (ฟรี)
52. PDPA Compliance - Consent, Data deletion
53. SEO Optimization - SSR, Meta tags

### GAMIFICATION (4)
54. Daily Login Streak - 7/30/90 วัน badges
55. Post Milestone - 100/500/1000 posts certs
56. Friend Milestone - 10/50/100 เพื่อน
57. Therapy Success - จบคอร์ส CBT badge

## Firebase Collections
- `users` - ข้อมูล user + isPremium + role (Single Source of Truth)
- `storyPosts` - บันทึกไดอารี่ (my-story page)
- `ventPosts` - โพสต์ระบายความรู้สึก (my-problem page)
- `comments` - ความคิดเห็น
- `emotions` - reactions (like, sad, happy)
- `friends` - ความสัมพันธ์เพื่อน (Relational: userId + friendId)
- `friendRequests` - คำขอเป็นเพื่อน (Relational: senderId + receiverId)
- `subscriptions` - Premium subscriptions
- `botChats` - ประวัติแชท AI Bot (เข้ารหัส AES-256)
- `botConfigs` - AI Bot configurations and skins
- `userBotPreferences` - User's selected bot preferences
- `notifications` - การแจ้งเตือน (Relational: userId + senderId)
- `reports` - รายงานโพสต์/ผู้ใช้มีปัญหา
- `pageviews` - Analytics
- `userConsents` - บันทึก Cookie Consent (PDPA: เก็บ 5 ปี)

## ระบบ Role
- `super-admin` - สิทธิ์เต็มระบบ
- `admin` - จัดการ content และ moderation
- `user` - ใช้งานทั่วไป

## Architecture: API + Firebase Admin SDK (แนวทางหลัก)
ใช้ **Server-side API endpoints** พร้อม **Firebase Admin SDK**:
```
Client (Vue) → Nuxt API Routes → Firebase Admin SDK → Firestore
```

- ✅ ใช้ API endpoints ใน `/server/api/*` เป็นหลัก
- ✅ ใช้ Firebase Admin SDK สำหรับการเข้าถึง Firestore
- ✅ Auth token verification ด้วย `adminAuth().verifyIdToken()`
- ✅ Secure: ตรวจสอบสิทธิ์ฝั่ง server
- ⚠️ Client SDK ใช้เฉพาะ Auth และ realtime features ที่จำเป็น (เช่น onSnapshot)

## 🔥 Relational Data Model Policy (CRITICAL)

**หลักการสำคัญ: ห้ามบันทึกข้อมูล User แยกต่างหาก - ใช้ UID อย่างเดียว**

### นโยบายบังคับ
1. **ห้ามบันทึก** `displayName`, `photoURL`, `anonymousName`, `slug` แยกในคอลเลกชันอื่น
2. **บันทึกเฉพาะ UID** เช่น `userId`, `senderId`, `receiverId`, `authorId`, `friendId`
3. **ดึงข้อมูล User แบบ Dynamic** จาก `users` collection ทุกครั้งที่แสดงผล
4. **Single Source of Truth** - `users` collection เป็นแหล่งข้อมูลเดียวสำหรับข้อมูล user

### ตัวอย่างที่ถูกต้อง ✅

```typescript
// ❌ WRONG - ห้ามทำแบบนี้
await db.collection('notifications').add({
  userId: receiverId,
  senderName: 'John Doe',           // ❌ ห้ามบันทึกชื่อแยก
  senderPhoto: 'https://...',       // ❌ ห้ามบันทึกรูปแยก
  type: 'friend_request'
})

// ✅ CORRECT - บันทึกเฉพาะ UID
await db.collection('notifications').add({
  userId: receiverId,
  senderId: currentUserId,           // ✅ บันทึกแค่ UID
  type: 'friend_request',
  status: 'pending',
  createdAt: new Date()
})

// ✅ CORRECT - ดึงข้อมูลแบบ Dynamic เวลาแสดงผล
const notifications = await Promise.all(
  notificationsSnapshot.docs.map(async (doc) => {
    const data = doc.data()

    // Fetch user data from users collection
    const senderDoc = await db.collection('users').doc(data.senderId).get()
    const senderData = senderDoc.data()

    return {
      id: doc.id,
      ...data,
      senderName: senderData?.displayName || 'ผู้ใช้',    // ✅ ดึงตอนแสดงผล
      senderPhoto: senderData?.photoURL || null          // ✅ ดึงตอนแสดงผล
    }
  })
)
```

### ประโยชน์ของ Relational Model
1. **ข้อมูลอัพเดทอัตโนมัติ** - เมื่อ user เปลี่ยนชื่อ/รูป ทุกที่จะอัพเดททันที
2. **ไม่มีข้อมูลซ้ำซ้อน** - ประหยัด storage และลด bugs
3. **ง่ายต่อการ maintain** - แก้ที่เดียว ใช้ได้ทุกที่
4. **Scalable** - เมื่อมี user เยอะขึ้น ไม่ต้องไป sync ข้อมูลทุกที่

### Collections ที่ปรับใช้ Relational Model แล้ว
- ✅ `friendRequests` - เก็บเฉพาะ `senderId`, `receiverId`
- ✅ `friends` - เก็บเฉพาะ `userId`, `friendId`
- ✅ `notifications` - เก็บเฉพาะ `userId`, `senderId`
- ✅ `comments` (POST API) - เก็บเฉพาะ `userId`
- ✅ `storyPosts/comments` subcollection - เก็บเฉพาะ `authorId`

### Collections ที่ต้องตรวจสอบ
- ⚠️ `storyPosts` - ต้องตรวจสอบว่าเก็บเฉพาะ `userId` หรือไม่
- ⚠️ `ventPosts` - ต้องตรวจสอบว่าเก็บเฉพาะ `userId` หรือไม่
- ⚠️ `emotions` - ต้องตรวจสอบว่าเก็บเฉพาะ `userId` หรือไม่

### ข้อควรระวัง
- ใช้ `Promise.all()` สำหรับ parallel fetching เพื่อลด latency
- Cache user data ชั่วคราวใน memory เมื่อ loop หลายๆ records
- ตรวจสอบ `null`/`undefined` ก่อนแสดงผล
- ใช้ default values เช่น `'ผู้ใช้'`, `'ไม่ระบุชื่อ'` เมื่อหา user ไม่เจอ

## 🛡️ PDPA Compliance (พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562)

### ภาพรวม
เราปฏิบัติตาม PDPA อย่างเคร่งครัดเพื่อคุ้มครองสิทธิความเป็นส่วนตัวของผู้ใช้

### เอกสารและนโยบาย
1. **Privacy Policy** (`/pages/privacy.vue`) - นโยบายความเป็นส่วนตัวครบถ้วน 12 หัวข้อ
2. **Terms of Service** (`/pages/terms.vue`) - ข้อกำหนดการใช้บริการ 13 หัวข้อ
3. **Cookie Consent Banner** (`/components/CookieConsent.vue`) - ระบบยินยอม Cookies แบบ Granular

### สิทธิของเจ้าของข้อมูล (Data Subject Rights)
- ✅ Right to Access - ดูข้อมูลที่เก็บไว้
- ✅ Right to Rectification - แก้ไขข้อมูลที่ผิด
- ✅ Right to Erasure - ลบบัญชีและข้อมูล (Account page)
- ✅ Right to Restriction - ระงับการใช้ข้อมูล
- ✅ Right to Data Portability - Export PDF/Excel (Premium)
- ✅ Right to Object - คัดค้านการประมวลผล
- ✅ Right to Withdraw Consent - ถอนความยินยอมได้ทุกเมื่อ

### Cookie Consent Management
**ระบบ:** `/components/CookieConsent.vue`

**ประเภท Cookies:**
1. **Necessary** - จำเป็น (ไม่สามารถปิดได้): Auth, Session, CSRF Protection
2. **Functional** - การทำงาน (เปิด/ปิดได้): Theme, Language, AI Bot Skin
3. **Analytics** - วิเคราะห์ (เปิด/ปิดได้): Google Analytics 4
4. **Marketing** - การตลาด (ยังไม่ได้ใช้): Ads (Future)

**การบันทึก Consent:**
- เก็บใน `localStorage` (ฝั่ง client)
- เก็บใน `userConsents` collection (ฝั่ง server) เป็นเวลา 5 ปี (ตาม PDPA)
- API: `/server/api/consent/save.post.ts`

### Data Retention (ระยะเวลาเก็บข้อมูล)
- **ข้อมูลบัญชี:** จนกว่าจะลบบัญชี + 5 ปี
- **โพสต์/ความคิดเห็น:** จนกว่าจะลบ
- **ประวัติ AI Chat:** 10 ข้อความล่าสุด (ลบอัตโนมัติ)
- **การชำระเงิน:** 7 ปี (กฎหมายภาษี)
- **User Consent Records:** 5 ปี (PDPA)
- **Analytics:** 26 เดือน (Google Analytics policy)

### Data Security (ความปลอดภัย)
- 🔒 **Encryption in Transit:** HTTPS/TLS
- 🔒 **Encryption at Rest:** AES-256 สำหรับ AI Chat
- 🔒 **Password Hashing:** bcrypt + salt
- 🔒 **Firebase Security Rules:** UID-based access control
- 🔒 **API Token Verification:** Firebase ID Token
- 🔒 **Rate Limiting:** ป้องกัน DDoS

### Data Breach Notification
- แจ้ง PDPC ภายใน 72 ชั่วโมง (ตาม PDPA มาตรา 37)
- แจ้งผู้ใช้ที่ได้รับผลกระทบทันที

### Cross-Border Data Transfer (โอนข้อมูลข้ามประเทศ)
ข้อมูลอาจถูกโอนไปยัง:
- **Firebase (Singapore)** - asia-southeast1
- **Vercel (Singapore)** - CDN region sin1
- **Stripe (USA)** - Payment processing
- **xAI Grok API (USA)** - AI Chatbot

**มาตรการคุ้มครอง:**
- Standard Contractual Clauses (SCCs)
- Data Processing Agreements (DPA)
- ตาม PDPA มาตรา 28

### Contact Information
- **Data Protection Officer:** dpo@บันทึกนิรนาม.com
- **Privacy Concerns:** privacy@บันทึกนิรนาม.com
- **PDPC (Thailand):** www.pdpc.or.th, โทร 02-141-6993

### Compliance Checklist
- ✅ Privacy Policy ครบถ้วน
- ✅ Terms of Service ครบถ้วน
- ✅ Cookie Consent Banner (Opt-in)
- ✅ Granular Cookie Controls
- ✅ Consent Records (5 years)
- ✅ Data Subject Rights implementation
- ✅ Data Retention Policy
- ✅ Data Breach Notification Plan
- ✅ Cross-Border Transfer Safeguards
- ✅ Security Measures (Encryption, Access Control)

## คำสั่งที่ใช้บ่อย
```bash
pnpm dev          # รัน development server
pnpm build        # build สำหรับ production
pnpm install      # ติดตั้ง dependencies
```

## หมายเหตุสำคัญ
- ภาษา UI เป็นภาษาไทย
- ใช้ Font: Prompt
- Primary color: #737373 (Grayscale theme)
- Firebase Project ID: `nira-c8ee1`
- AI Bot ใช้ Grok API

## Coding Priority
1. Diary (Posts, Timeline, Editor)
2. Bot (Chat, Skins, Memory)
3. Friends (Request, List, Feed)
4. Premium (Subscription, Features)
5. Courses (CBT, Therapy Referral)

---
*อัปเดตไฟล์นี้เมื่อมีการเปลี่ยนแปลงสำคัญในโปรเจค*
