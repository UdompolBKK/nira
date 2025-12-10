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
pages/           # 8 หน้า
├── index.vue    # Landing page + Featured posts
├── browse.vue   # Browse posts timeline
├── editor.vue   # Rich text editor
├── account.vue  # User profile
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
- `users` - ข้อมูล user + isPremium + role
- `storyPosts` - บันทึกไดอารี่ (my-story page)
- `ventPosts` - โพสต์ระบายความรู้สึก (my-problem page)
- `comments` - ความคิดเห็น
- `emotions` - reactions (like, sad, happy)
- `friends` - ความสัมพันธ์เพื่อน
- `friendRequests` - คำขอเป็นเพื่อน
- `subscriptions` - Premium subscriptions
- `botChats` - ประวัติแชท AI Bot
- `botConfigs` - AI Bot configurations and skins
- `userBotPreferences` - User's selected bot preferences
- `notifications` - การแจ้งเตือน
- `reports` - รายงานโพสต์/ผู้ใช้มีปัญหา
- `pageviews` - Analytics

## ระบบ Role
- `super-admin` - สิทธิ์เต็มระบบ
- `admin` - จัดการ content และ moderation
- `user` - ใช้งานทั่วไป

## Architecture: Client-Side Firebase
ใช้ **Firebase Client SDK** โดยตรงจาก Vue components/composables:
```
Client (Vue) → Firebase Client SDK → Firestore
```

- ✅ ใช้ composables เช่น `useFirestore()`, `useAuth()`
- ✅ เรียก Firestore โดยตรงจาก client
- ❌ ไม่ใช้ API endpoints

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
