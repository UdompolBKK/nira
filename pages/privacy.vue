<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          กลับหน้าหลัก
        </NuxtLink>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">นโยบายความเป็นส่วนตัว</h1>
        <p class="text-sm text-gray-500">อัปเดตล่าสุด: 11 ธันวาคม 2568</p>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 prose prose-gray max-w-none">
        <p class="lead text-lg text-gray-700 mb-6">
          บันทึกนิรนาม ("เว็บไซต์" "เรา" "พวกเรา") ให้ความสำคัญกับความเป็นส่วนตัวของคุณ
          นโยบายความเป็นส่วนตัวฉบับนี้อธิบายว่าเราเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของคุณอย่างไร
          เมื่อคุณใช้บริการของเรา ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
        </p>

        <!-- Section 1 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">1. ข้อมูลที่เราเก็บรวบรวม</h2>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">1.1 ข้อมูลที่คุณให้แก่เรา</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-700">
            <li><strong>ข้อมูลบัญชี:</strong> ชื่อปลอม (Anonymous Name), อีเมล, รหัสผ่าน (เข้ารหัสแล้ว), รูปโปรไฟล์</li>
            <li><strong>เนื้อหาที่สร้าง:</strong> โพสต์ไดอารี่, ความคิดเห็น, Emotions (Like, Sad, Happy)</li>
            <li><strong>การสนทนากับ AI Bot:</strong> ข้อความแชทที่เข้ารหัสด้วย AES-256 (เก็บไว้ 10 ข้อความล่าสุด)</li>
            <li><strong>ข้อมูลการชำระเงิน:</strong> ข้อมูลการชำระเงินผ่าน Stripe (เราไม่เก็บข้อมูลบัตรเครดิต)</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">1.2 ข้อมูลที่เก็บอัตโนมัติ</h3>
          <ul class="list-disc pl-6 mb-4 text-gray-700">
            <li><strong>ข้อมูลการใช้งาน:</strong> หน้าที่เข้าชม, เวลาที่ใช้, การกระทำต่างๆ</li>
            <li><strong>ข้อมูลอุปกรณ์:</strong> IP Address, ประเภทเบราว์เซอร์, ระบบปฏิบัติการ</li>
            <li><strong>Cookies:</strong> เพื่อปรับปรุงประสบการณ์การใช้งาน (ดูรายละเอียดในส่วน Cookies)</li>
            <li><strong>Analytics:</strong> Google Analytics 4 เพื่อวิเคราะห์การใช้งาน</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">1.3 ข้อมูลจากบุคคลที่สาม</h3>
          <ul class="list-disc pl-6 text-gray-700">
            <li><strong>Google Sign-In:</strong> ชื่อ, อีเมล, รูปโปรไฟล์ (หากคุณเลือกเข้าสู่ระบบด้วย Google)</li>
            <li><strong>Firebase Authentication:</strong> UID สำหรับระบุตัวตน</li>
          </ul>
        </section>

        <!-- Section 2 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">2. วัตถุประสงค์ในการใช้ข้อมูล</h2>
          <p class="mb-4 text-gray-700">เราใช้ข้อมูลส่วนบุคคลของคุณเพื่อ:</p>
          <ul class="list-disc pl-6 text-gray-700">
            <li><strong>การให้บริการ:</strong> สร้างบัญชี, บันทึกไดอารี่, แชทกับ AI Bot, ระบบเพื่อน</li>
            <li><strong>การปรับปรุงบริการ:</strong> วิเคราะห์การใช้งาน, ปรับปรุงฟีเจอร์</li>
            <li><strong>ความปลอดภัย:</strong> ตรวจจับและป้องกันการใช้งานที่ผิดกฎหมาย</li>
            <li><strong>การสื่อสาร:</strong> ส่งการแจ้งเตือน, อัปเดตบริการ (ผ่าน email หรือ push notification)</li>
            <li><strong>การดูแลสุขภาพจิต:</strong> AI Risk Detection และแนะนำบริการจิตแพทย์ (เฉพาะเมื่อมี Risk Score ≥0.7)</li>
            <li><strong>การชำระเงิน:</strong> ประมวลผลการสมัคร Premium และคอร์ส CBT</li>
            <li><strong>การปฏิบัติตามกฎหมาย:</strong> ปฏิบัติตามคำสั่งศาล, กฎหมาย, ระเบียบราชการ</li>
          </ul>
        </section>

        <!-- Section 3 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">3. ฐานทางกฎหมายในการประมวลผล</h2>
          <p class="mb-4 text-gray-700">เราประมวลผลข้อมูลของคุณตามฐานกฎหมายดังนี้:</p>
          <ul class="list-disc pl-6 text-gray-700">
            <li><strong>ความยินยอม (Consent):</strong> คุณให้ความยินยอมในการเก็บและใช้ข้อมูล</li>
            <li><strong>การปฏิบัติตามสัญญา (Contract):</strong> เพื่อให้บริการตาม Terms of Service</li>
            <li><strong>ผลประโยชน์อันชอบธรรม (Legitimate Interest):</strong> ปรับปรุงบริการ, ความปลอดภัย</li>
            <li><strong>การปฏิบัติตามกฎหมาย (Legal Obligation):</strong> เมื่อกฎหมายกำหนด</li>
          </ul>
        </section>

        <!-- Section 4 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">4. การเปิดเผยข้อมูลแก่บุคคลที่สาม</h2>
          <p class="mb-4 text-gray-700">เราอาจเปิดเผยข้อมูลของคุณแก่:</p>
          <ul class="list-disc pl-6 text-gray-700">
            <li><strong>ผู้ให้บริการ (Service Providers):</strong>
              <ul class="list-circle pl-6 mt-2">
                <li>Firebase / Google Cloud - โฮสติ้งและฐานข้อมูล</li>
                <li>Vercel - การ deploy เว็บไซต์</li>
                <li>Stripe - ประมวลผลการชำระเงิน</li>
                <li>xAI (Grok API) - AI Chatbot (ข้อความเข้ารหัส)</li>
                <li>Google Analytics - วิเคราะห์การใช้งาน</li>
              </ul>
            </li>
            <li><strong>คลินิกจิตแพทย์พันธมิตร:</strong> เฉพาะเมื่อคุณเลือกใช้บริการปรึกษาจิตแพทย์</li>
            <li><strong>เจ้าหน้าที่รัฐ:</strong> เมื่อมีคำสั่งศาล หรือกฎหมายกำหนด</li>
            <li><strong>ผู้ใช้งานอื่น:</strong> โพสต์ที่เป็น Public และ Comments (ตามการตั้งค่าความเป็นส่วนตัว)</li>
          </ul>
          <p class="mt-4 text-gray-700">
            <strong>หมายเหตุ:</strong> เราไม่ขายข้อมูลส่วนบุคคลของคุณให้บุคคลที่สาม
          </p>
        </section>

        <!-- Section 5 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">5. การโอนข้อมูลข้ามประเทศ</h2>
          <p class="mb-4 text-gray-700">
            ข้อมูลของคุณอาจถูกโอนและจัดเก็บบนเซิร์ฟเวอร์นอกประเทศไทย เช่น:
          </p>
          <ul class="list-disc pl-6 text-gray-700">
            <li><strong>Firebase Firestore:</strong> เซิร์ฟเวอร์ใน Singapore (asia-southeast1)</li>
            <li><strong>Vercel:</strong> CDN region sin1 (Singapore)</li>
            <li><strong>Stripe:</strong> สหรัฐอเมริกา</li>
            <li><strong>xAI Grok API:</strong> สหรัฐอเมริกา</li>
          </ul>
          <p class="mt-4 text-gray-700">
            เราดำเนินการโอนข้อมูลภายใต้มาตรการคุ้มครองที่เหมาะสม เช่น Standard Contractual Clauses (SCCs)
            และ Data Processing Agreements ตาม PDPA มาตรา 28
          </p>
        </section>

        <!-- Section 6 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">6. ระยะเวลาการเก็บรักษาข้อมูล</h2>
          <ul class="list-disc pl-6 text-gray-700">
            <li><strong>ข้อมูลบัญชี:</strong> จนกว่าคุณจะลบบัญชี + 5 ปี (ตามกฎหมาย PDPA)</li>
            <li><strong>โพสต์และความคิดเห็น:</strong> จนกว่าคุณจะลบ หรือลบบัญชี</li>
            <li><strong>ประวัติการแชท AI:</strong> 10 ข้อความล่าสุด (ลบอัตโนมัติเมื่อเกิน)</li>
            <li><strong>การชำระเงิน:</strong> 7 ปี (ตามกฎหมายภาษีและบัญชี)</li>
            <li><strong>User Consent Records:</strong> 5 ปี (ตามกฎหมาย PDPA)</li>
            <li><strong>Analytics:</strong> 26 เดือน (ตามนโยบาย Google Analytics)</li>
          </ul>
        </section>

        <!-- Section 7 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">7. สิทธิของเจ้าของข้อมูล (ตาม PDPA)</h2>
          <p class="mb-4 text-gray-700">คุณมีสิทธิต่อไปนี้:</p>
          <ul class="list-disc pl-6 text-gray-700">
            <li><strong>สิทธิในการเข้าถึงข้อมูล (Right to Access):</strong> ขอดูข้อมูลส่วนบุคคลที่เราเก็บไว้</li>
            <li><strong>สิทธิในการแก้ไข (Right to Rectification):</strong> แก้ไขข้อมูลที่ไม่ถูกต้อง</li>
            <li><strong>สิทธิในการลบข้อมูล (Right to Erasure):</strong> ขอลบข้อมูลของคุณ</li>
            <li><strong>สิทธิในการระงับการใช้ (Right to Restriction):</strong> ขอระงับการใช้ข้อมูลชั่วคราว</li>
            <li><strong>สิทธิในการโอนย้ายข้อมูล (Right to Data Portability):</strong> ขอรับข้อมูลในรูปแบบ PDF/Excel</li>
            <li><strong>สิทธิในการคัดค้าน (Right to Object):</strong> คัดค้านการประมวลผลข้อมูล</li>
            <li><strong>สิทธิในการถอนความยินยอม (Right to Withdraw Consent):</strong> ถอนความยินยอมได้ตลอดเวลา</li>
          </ul>
          <p class="mt-4 text-gray-700">
            <strong>วิธีใช้สิทธิ:</strong> ติดต่อเราที่ <a href="mailto:privacy@บันทึกนิรนาม.com" class="text-purple-600 hover:underline">privacy@บันทึกนิรนาม.com</a>
            หรือใช้ฟอร์ม Data Subject Access Request (DSAR) ในหน้า Account
          </p>
        </section>

        <!-- Section 8 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">8. Cookies และเทคโนโลยีติดตาม</h2>
          <p class="mb-4 text-gray-700">เราใช้ Cookies เพื่อ:</p>
          <ul class="list-disc pl-6 text-gray-700">
            <li><strong>Cookies ที่จำเป็น (Necessary):</strong> Authentication, Session management</li>
            <li><strong>Cookies เพื่อการทำงาน (Functional):</strong> จำการตั้งค่าของคุณ (ธีม, ภาษา)</li>
            <li><strong>Cookies เพื่อวิเคราะห์ (Analytics):</strong> Google Analytics - วิเคราะห์การใช้งาน</li>
            <li><strong>Cookies เพื่อการตลาด (Marketing):</strong> ยังไม่ได้ใช้งาน</li>
          </ul>
          <p class="mt-4 text-gray-700">
            คุณสามารถจัดการ Cookies ได้ผ่านการตั้งค่าเบราว์เซอร์ หรือ Cookie Consent Banner
            (ปุ่มตั้งค่า Cookies ที่มุมล่างซ้าย)
          </p>
        </section>

        <!-- Section 9 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">9. ความปลอดภัยของข้อมูล</h2>
          <p class="mb-4 text-gray-700">เราใช้มาตรการความปลอดภัยดังนี้:</p>
          <ul class="list-disc pl-6 text-gray-700">
            <li><strong>การเข้ารหัส:</strong> HTTPS/TLS สำหรับการส่งข้อมูล, AES-256 สำหรับการแชท AI</li>
            <li><strong>Firebase Security Rules:</strong> จำกัดการเข้าถึงข้อมูลตาม User UID</li>
            <li><strong>Password Hashing:</strong> bcrypt กับ salt rounds</li>
            <li><strong>API Token Verification:</strong> ตรวจสอบ Firebase ID Token ทุกครั้ง</li>
            <li><strong>Rate Limiting:</strong> จำกัดจำนวน requests เพื่อป้องกัน DDoS</li>
            <li><strong>Backup:</strong> สำรองข้อมูลอัตโนมัติทุกวัน</li>
          </ul>
          <p class="mt-4 text-gray-700">
            <strong>การแจ้งเหตุละเมิดข้อมูล:</strong> หากเกิดการละเมิดข้อมูลส่วนบุคคล เราจะแจ้งคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (PDPC)
            ภายใน 72 ชั่วโมง และแจ้งคุณโดยทันที (ตาม PDPA มาตรา 37)
          </p>
        </section>

        <!-- Section 10 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">10. เด็กและผู้เยาว์</h2>
          <p class="text-gray-700">
            บริการของเราเหมาะสำหรับผู้ใช้อายุ 13 ปีขึ้นไป สำหรับผู้ใช้อายุต่ำกว่า 20 ปี
            ต้องได้รับความยินยอมจากผู้ปกครองตาม PDPA มาตรา 9
            หากเราพบว่ามีการเก็บข้อมูลเด็กโดยไม่ได้รับความยินยอม จะลบข้อมูลทันที
          </p>
        </section>

        <!-- Section 11 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">11. การเปลี่ยนแปลงนโยบาย</h2>
          <p class="text-gray-700">
            เราอาจปรับปรุงนโยบายนี้เป็นครั้งคราว การเปลี่ยนแปลงจะมีผลทันทีเมื่อโพสต์บนเว็บไซต์
            เราจะแจ้งให้คุณทราบผ่านอีเมล หรือ notification หากมีการเปลี่ยนแปลงสำคัญ
            คุณควรตรวจสอบนโยบายนี้เป็นประจำ
          </p>
        </section>

        <!-- Section 12 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">12. ข้อมูลติดต่อ</h2>
          <div class="bg-gray-50 p-6 rounded-xl">
            <p class="font-semibold text-gray-900 mb-2">ผู้ควบคุมข้อมูลส่วนบุคคล (Data Controller):</p>
            <p class="text-gray-700">บันทึกนิรนาม (Nira)</p>
            <p class="text-gray-700 mt-4">
              <strong>อีเมล:</strong> <a href="mailto:privacy@บันทึกนิรนาม.com" class="text-purple-600 hover:underline">privacy@บันทึกนิรนาม.com</a><br>
              <strong>Data Protection Officer (DPO):</strong> <a href="mailto:dpo@บันทึกนิรนาม.com" class="text-purple-600 hover:underline">dpo@บันทึกนิรนาม.com</a>
            </p>
            <p class="text-gray-700 mt-4">
              <strong>หากคุณไม่พอใจกับการจัดการข้อมูลของเรา คุณสามารถร้องเรียนไปยัง:</strong><br>
              คณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (PDPC)<br>
              เว็บไซต์: <a href="https://www.pdpc.or.th" target="_blank" rel="noopener" class="text-purple-600 hover:underline">www.pdpc.or.th</a><br>
              โทร: 02-141-6993
            </p>
          </div>
        </section>

        <!-- Effective Date -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">วันที่มีผลบังคับใช้</h2>
          <p class="text-gray-700">นโยบายนี้มีผลบังคับใช้ตั้งแต่วันที่ 11 ธันวาคม พ.ศ. 2568</p>
        </section>

        <!-- PDPA Compliance Notice -->
        <div class="mt-8 p-6 bg-purple-50 border border-purple-200 rounded-xl">
          <div class="flex gap-3">
            <Icon name="lucide:shield-check" class="w-6 h-6 text-purple-600 flex-shrink-0" />
            <div>
              <p class="font-semibold text-purple-900 mb-2">PDPA Compliance</p>
              <p class="text-sm text-purple-800 leading-relaxed">
                นโยบายนี้จัดทำตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
                และมาตรฐานสากล เช่น GDPR เพื่อคุ้มครองสิทธิความเป็นส่วนตัวของคุณอย่างเต็มที่
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'นโยบายความเป็นส่วนตัว - Nira',
  meta: [
    { name: 'description', content: 'นโยบายความเป็นส่วนตัวของบันทึกนิรนาม - เราให้ความสำคัญกับความเป็นส่วนตัวของคุณตาม PDPA' },
    { name: 'robots', content: 'index, follow' }
  ]
})
</script>

<style scoped>
.prose {
  @apply text-gray-700;
}

.prose h2 {
  @apply border-b border-gray-200 pb-2;
}

.prose a {
  @apply text-purple-600 hover:text-purple-700 hover:underline;
}

.prose ul ul {
  @apply mt-2;
}

.list-circle {
  list-style-type: circle;
}
</style>
