<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          กลับหน้าหลัก
        </NuxtLink>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">ข้อกำหนดและเงื่อนไขการใช้บริการ</h1>
        <p class="text-sm text-gray-500">อัปเดตล่าสุด: 11 ธันวาคม 2568</p>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 prose prose-gray max-w-none">
        <p class="lead text-lg text-gray-700 mb-6">
          ยินดีต้อนรับสู่ บันทึกนิรนาม ("เว็บไซต์" "บริการ" "เรา" "พวกเรา")
          กรุณาอ่านข้อกำหนดและเงื่อนไขนี้อย่างละเอียดก่อนใช้บริการ
          การใช้บริการของเราถือว่าคุณยอมรับข้อกำหนดเหล่านี้
        </p>

        <!-- Section 1 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">1. การยอมรับข้อกำหนด</h2>
          <p class="text-gray-700">
            เมื่อคุณเข้าถึงหรือใช้บริการบันทึกนิรนาม คุณตกลงที่จะปฏิบัติตามข้อกำหนดการใช้บริการนี้
            และนโยบายความเป็นส่วนตัวของเรา หากคุณไม่ยอมรับข้อกำหนดเหล่านี้
            กรุณาหยุดใช้บริการทันที
          </p>
          <p class="text-gray-700 mt-4">
            เราขอสงวนสิทธิ์ในการแก้ไข ปรับปรุง หรือเปลี่ยนแปลงข้อกำหนดนี้ได้ทุกเมื่อโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
            คุณควรตรวจสอบข้อกำหนดนี้เป็นประจำ
          </p>
        </section>

        <!-- Section 2 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">2. คำนิยาม</h2>
          <ul class="list-disc pl-6 text-gray-700">
            <li><strong>"บริการ"</strong> หมายถึง แพลตฟอร์มบันทึกนิรนาม (Nira) และบริการทั้งหมดที่เกี่ยวข้อง</li>
            <li><strong>"ผู้ใช้" / "คุณ"</strong> หมายถึง บุคคลที่ใช้บริการ</li>
            <li><strong>"เนื้อหา"</strong> หมายถึง ข้อความ รูปภาพ วิดีโอ หรือข้อมูลใดๆ ที่ผู้ใช้โพสต์</li>
            <li><strong>"AI Bot"</strong> หมายถึง ระบบ AI Chatbot Companion ที่ให้คำปรึกษาและสนทนา</li>
            <li><strong>"Premium"</strong> หมายถึง บริการแบบชำระเงิน (79฿/เดือน หรือ 699฿/ปี)</li>
          </ul>
        </section>

        <!-- Section 3 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">3. การสมัครสมาชิกและบัญชีผู้ใช้</h2>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">3.1 คุณสมบัติของผู้ใช้</h3>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li>ต้องมีอายุอย่างน้อย 13 ปีบริบูรณ์</li>
            <li>ผู้ใช้อายุต่ำกว่า 20 ปี ต้องได้รับความยินยอมจากผู้ปกครอง (ตาม PDPA มาตรา 9)</li>
            <li>ต้องใช้ชื่อปลอม (Anonymous Name) ไม่ใช่ชื่อจริง เพื่อปกป้องความเป็นส่วนตัว</li>
            <li>ต้องใช้รูปโปรไฟล์ที่ไม่เปิดเผยตัวตน</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">3.2 ความรับผิดชอบของผู้ใช้</h3>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li>ต้องรักษาความปลอดภัยของรหัสผ่าน และไม่เปิดเผยให้ผู้อื่น</li>
            <li>รับผิดชอบต่อกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของคุณ</li>
            <li>ต้องแจ้งเราทันทีหากพบการใช้บัญชีโดยไม่ได้รับอนุญาต</li>
            <li>ห้ามสร้างบัญชีมากกว่า 1 บัญชีต่อ 1 อีเมล (ยกเว้นบัญชี Anonymous)</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">3.3 การลบบัญชี</h3>
          <p class="text-gray-700">
            คุณสามารถลบบัญชีได้ทุกเมื่อผ่านหน้า Account เมื่อลบบัญชี:
          </p>
          <ul class="list-disc pl-6 text-gray-700 mt-2">
            <li>ข้อมูลส่วนบุคคลจะถูกลบภายใน 30 วัน</li>
            <li>โพสต์สาธารณะอาจยังคงอยู่ (แบบไม่ระบุตัวตน)</li>
            <li>ข้อมูลทางการเงินจะเก็บไว้ 7 ปี ตามกฎหมายภาษี</li>
          </ul>
        </section>

        <!-- Section 4 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">4. การใช้บริการและห้ามกระทำ</h2>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">4.1 การใช้บริการที่อนุญาต</h3>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li>เขียนไดอารี่ส่วนตัว ระบายความรู้สึก</li>
            <li>แชทกับ AI Bot เพื่อขอคำปรึกษา</li>
            <li>แบ่งปันโพสต์กับเพื่อนหรือสาธารณะ</li>
            <li>แสดงความคิดเห็น (Comments) และ Emotions (Like, Sad, Happy)</li>
            <li>เพิ่มเพื่อน และจัดการความเป็นส่วนตัว</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">4.2 พฤติกรรมที่ห้ามกระทำ</h3>
          <div class="bg-red-50 border border-red-200 p-4 rounded-xl mb-4">
            <p class="font-semibold text-red-900 mb-2">คุณตกลงว่าจะไม่:</p>
            <ul class="list-disc pl-6 text-red-800 text-sm">
              <li>โพสต์เนื้อหาที่ผิดกฎหมาย หมิ่นประมาท ล่วงละเมิด ยุยงให้เกิดความเกลียดชัง</li>
              <li>แชร์ข้อมูลส่วนตัวของผู้อื่นโดยไม่ได้รับอนุญาต (Doxxing)</li>
              <li>ล่อลวง กลั่นแกล้ง หรือคุกคามผู้อื่น (Bullying, Harassment)</li>
              <li>โพสต์เนื้อหาลามกอนาจาร หรือไม่เหมาะสม (NSFW)</li>
              <li>ส่งสแปม โฆษณาเชิงพาณิชย์ หรือ Multi-level Marketing (MLM)</li>
              <li>แอบอ้างเป็นบุคคลอื่น หรือหลอกลวง</li>
              <li>ใช้บอท สคริปต์ หรือระบบอัตโนมัติเพื่อใช้บริการโดยไม่ได้รับอนุญาต</li>
              <li>แฮ็ก โจมตี หรือทำลายระบบ (DDoS, SQL Injection, XSS, etc.)</li>
              <li>ใช้ชื่อจริงหรือข้อมูลที่เปิดเผยตัวตน (เพื่อความปลอดภัยของคุณเอง)</li>
              <li>ละเมิดทรัพย์สินทางปัญญา ลิขสิทธิ์ เครื่องหมายการค้า</li>
            </ul>
          </div>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">4.3 บทลงโทษสำหรับการฝ่าฝืน</h3>
          <p class="text-gray-700 mb-2">หากคุณฝ่าฝืนข้อกำหนด เราอาจ:</p>
          <ul class="list-disc pl-6 text-gray-700">
            <li>ลบเนื้อหาที่ฝ่าฝืน</li>
            <li>ระงับบัญชีชั่วคราว (7-30 วัน)</li>
            <li>ลบบัญชีถาวร (Permanent Ban)</li>
            <li>แจ้งความดำเนินคดีตามกฎหมาย (กรณีร้ายแรง)</li>
          </ul>
        </section>

        <!-- Section 5 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">5. ทรัพย์สินทางปัญญาและสิทธิ์ในเนื้อหา</h2>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">5.1 สิทธิ์ในเนื้อหาของคุณ</h3>
          <p class="text-gray-700 mb-4">
            คุณเป็นเจ้าของเนื้อหาทั้งหมดที่คุณสร้าง (โพสต์, ความคิดเห็น, รูปภาพ)
            เมื่อคุณโพสต์เนื้อหา คุณให้สิทธิ์แก่เราในการ:
          </p>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li>จัดเก็บและแสดงเนื้อหาของคุณตามการตั้งค่าความเป็นส่วนตัว</li>
            <li>ใช้เนื้อหาในการปรับปรุงบริการ (เช่น AI Training - เฉพาะข้อมูลที่ไม่ระบุตัวตน)</li>
            <li>แสดงเนื้อหาสาธารณะบน Featured Posts, Trending, Search Results</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">5.2 สิทธิ์ในเนื้อหาของเรา</h3>
          <p class="text-gray-700">
            เว็บไซต์ โลโก้ ชื่อ "บันทึกนิรนาม" และ "Nira" ดีไซน์ โค้ด AI Bot
            เป็นทรัพย์สินทางปัญญาของเรา ห้ามคัดลอก ดัดแปลง หรือนำไปใช้โดยไม่ได้รับอนุญาต
          </p>
        </section>

        <!-- Section 6 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">6. AI Bot และคำปรึกษา</h2>

          <div class="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-4">
            <div class="flex gap-3">
              <Icon name="lucide:alert-triangle" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <p class="font-semibold text-amber-900 mb-2">คำเตือนสำคัญ</p>
                <ul class="text-sm text-amber-800 space-y-1">
                  <li>• AI Bot ไม่ใช่แพทย์ นักจิตวิทยา หรือผู้เชี่ยวชาญด้านสุขภาพจิต</li>
                  <li>• คำแนะนำจาก AI เป็นเพียงข้อมูลทั่วไป ไม่ใช่คำวินิจฉัยทางการแพทย์</li>
                  <li>• หากคุณมีปัญหาสุขภาพจิตร้ายแรง กรุณาปรึกษาจิตแพทย์หรือนักจิตวิทยาที่มีใบอนุญาต</li>
                  <li>• หากมีความคิดทำร้ายตัวเอง โทร สายด่วนสุขภาพจิต 1323 ทันที</li>
                </ul>
              </div>
            </div>
          </div>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">6.1 การใช้ AI Bot</h3>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li>AI Bot มี 4 สกิน: พระสงฆ์, หลวงพี่ปัญญา, คุณย่า, นักจิตวิทยา, GenZ</li>
            <li>การสนทนาเข้ารหัสด้วย AES-256 เพื่อความปลอดภัย</li>
            <li>เราเก็บประวัติแชท 10 ข้อความล่าสุด เพื่อให้ AI จำบริบท</li>
            <li>ผู้ใช้ฟรีจำกัด 50 ข้อความ/วัน, Premium ไม่จำกัด</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">6.2 Risk Detection และการแนะนำจิตแพทย์</h3>
          <p class="text-gray-700 mb-2">
            AI จะประเมิน Risk Score (0-1) จากการสนทนา หากมี Risk ≥0.7 เราจะ:
          </p>
          <ul class="list-disc pl-6 text-gray-700">
            <li>แสดง Modal แนะนำให้ปรึกษาจิตแพทย์</li>
            <li>ไม่บังคับให้ใช้บริการ (คุณเลือกได้)</li>
            <li>หากคุณเลือกใช้บริการ เราจะได้ค่าคอมมิชชั่น 400฿/session</li>
          </ul>
        </section>

        <!-- Section 7 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">7. Premium Subscription</h2>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">7.1 แผนการชำระเงิน</h3>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li><strong>Monthly Plan:</strong> 79 บาท/เดือน (ต่ออายุอัตโนมัติ)</li>
            <li><strong>Yearly Plan:</strong> 699 บาท/ปี (ประหยัด 11%)</li>
            <li>ชำระผ่าน Stripe (บัตรเครดิต/เดบิต)</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">7.2 ฟีเจอร์ Premium</h3>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li>AI Mood Analysis - แผนภูมิอารมณ์ 7/30/90 วัน</li>
            <li>Unlimited Storage (ฟรีจำกัด 100 posts)</li>
            <li>Export PDF/Excel</li>
            <li>Private PIN Folder</li>
            <li>Custom Themes (20 themes + Dark mode)</li>
            <li>Priority Comments</li>
            <li>Offline Mode</li>
            <li>No Ads</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">7.3 การยกเลิกและคืนเงิน</h3>
          <ul class="list-disc pl-6 text-gray-700">
            <li>คุณสามารถยกเลิกได้ทุกเมื่อผ่าน Account Settings</li>
            <li>การยกเลิกจะมีผลในรอบบิลถัดไป (ไม่คืนเงินย้อนหลัง)</li>
            <li>หากยกเลิกกลางเดือน ยังใช้ Premium ได้จนครบรอบบิล</li>
            <li><strong>นโยบายคืนเงิน:</strong> ไม่คืนเงินทุกกรณี ยกเว้น:
              <ul class="list-circle pl-6 mt-2">
                <li>ระบบขัดข้องไม่สามารถใช้งานได้เกิน 7 วัน (คืนเงินเต็มจำนวน)</li>
                <li>ถูกตัดเงินซ้ำโดยผิดพลาด (คืนเงินส่วนซ้ำ)</li>
              </ul>
            </li>
          </ul>
        </section>

        <!-- Section 8 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">8. CBT Courses และบริการจิตแพทย์</h2>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">8.1 CBT Courses</h3>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li>ราคา 499 บาท/คอร์ส (ใช้งานได้ 30 วัน)</li>
            <li>เนื้อหาจากนักจิตวิทยาที่มีใบอนุญาต</li>
            <li>ไม่คืนเงินหลังซื้อแล้ว (Digital Product)</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">8.2 Therapy Referral</h3>
          <p class="text-gray-700">
            เราเป็นเพียงตัวกลางเชื่อมต่อกับคลินิกจิตแพทย์พันธมิตร
            คุณภาพการบริการและความรับผิดชอบอยู่ที่คลินิกเหล่านั้น ไม่ใช่ของเรา
            เราจะได้รับค่าคอมมิชชั่น 400 บาท/session
          </p>
        </section>

        <!-- Section 9 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">9. การจำกัดความรับผิด</h2>

          <div class="bg-gray-50 border border-gray-200 p-4 rounded-xl">
            <p class="font-semibold text-gray-900 mb-3">เราไม่รับผิดชอบต่อ:</p>
            <ul class="list-disc pl-6 text-gray-700 text-sm space-y-2">
              <li>ความเสียหายจากการสูญเสียข้อมูล แม้เราจะมีระบบ Backup</li>
              <li>ความเสียหายจากการใช้คำแนะนำของ AI Bot</li>
              <li>การกระทำของผู้ใช้คนอื่น (Bullying, Harassment, etc.)</li>
              <li>ความเสียหายจากบริการของบุคคลที่สาม (Stripe, Firebase, Grok API)</li>
              <li>การถูกแฮ็กหากเกิดจากความประมาทของคุณ (เช่น รหัสผ่านง่ายเกินไป)</li>
              <li>การหยุดให้บริการชั่วคราวเพื่อบำรุงรักษาระบบ</li>
            </ul>
            <p class="text-gray-700 mt-4 text-sm">
              <strong>ความรับผิดสูงสุด:</strong> จำกัดไม่เกินค่าบริการที่คุณชำระในรอบ 3 เดือนล่าสุด
            </p>
          </div>
        </section>

        <!-- Section 10 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">10. การระงับหรือยกเลิกบริการ</h2>
          <p class="text-gray-700 mb-4">เราขอสงวนสิทธิ์ในการ:</p>
          <ul class="list-disc pl-6 text-gray-700">
            <li>ระงับหรือยกเลิกบัญชีของคุณหากคุณฝ่าฝืนข้อกำหนด</li>
            <li>ปิดบริการถาวร โดยแจ้งให้ทราบล่วงหน้า 30 วัน</li>
            <li>ปฏิเสธการให้บริการแก่บุคคลใดก็ได้โดยไม่ต้องให้เหตุผล</li>
          </ul>
          <p class="text-gray-700 mt-4">
            หากเราปิดบริการ เราจะคืนเงิน Premium ส่วนที่ยังไม่ได้ใช้ (Pro-rated)
          </p>
        </section>

        <!-- Section 11 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">11. กฎหมายที่ใช้บังคับและการระงับข้อพิพาท</h2>
          <ul class="list-disc pl-6 text-gray-700">
            <li>ข้อกำหนดนี้อยู่ภายใต้กฎหมายไทย</li>
            <li>ข้อพิพาทใดๆ จะอยู่ในเขตอำนาจศาลไทย (ศาลแพ่งกรุงเทพมหานคร)</li>
            <li>คุณตกลงใช้วิธีไกล่เกลี่ยก่อนฟ้องศาล</li>
          </ul>
        </section>

        <!-- Section 12 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">12. เบ็ดเตล็ด</h2>
          <ul class="list-disc pl-6 text-gray-700">
            <li><strong>การแจ้งเตือน:</strong> เราจะส่งการแจ้งเตือนผ่านอีเมลที่คุณลงทะเบียน</li>
            <li><strong>Force Majeure:</strong> เราไม่รับผิดชอบต่อเหตุสุดวิสัย (ภัยธรรมชาติ, สงคราม, โรคระบาด)</li>
            <li><strong>ภาษา:</strong> ฉบับภาษาไทยเป็นฉบับทางการ</li>
            <li><strong>ความสมบูรณ์:</strong> ข้อกำหนดนี้เป็นข้อตกลงทั้งหมดระหว่างเรากับคุณ</li>
          </ul>
        </section>

        <!-- Section 13 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">13. ข้อมูลติดต่อ</h2>
          <div class="bg-gray-50 p-6 rounded-xl">
            <p class="text-gray-700">
              หากคุณมีคำถามเกี่ยวกับข้อกำหนดนี้ กรุณาติดต่อ:<br>
              <strong>อีเมล:</strong> <a href="mailto:support@บันทึกนิรนาม.com" class="text-purple-600 hover:underline">support@บันทึกนิรนาม.com</a><br>
              <strong>Legal:</strong> <a href="mailto:legal@บันทึกนิรนาม.com" class="text-purple-600 hover:underline">legal@บันทึกนิรนาม.com</a>
            </p>
          </div>
        </section>

        <!-- Effective Date -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">วันที่มีผลบังคับใช้</h2>
          <p class="text-gray-700">ข้อกำหนดนี้มีผลบังคับใช้ตั้งแต่วันที่ 11 ธันวาคม พ.ศ. 2568</p>
        </section>

        <!-- Acceptance Notice -->
        <div class="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <div class="flex gap-3">
            <Icon name="lucide:check-circle" class="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <p class="font-semibold text-blue-900 mb-2">การยอมรับข้อกำหนด</p>
              <p class="text-sm text-blue-800 leading-relaxed">
                การใช้บริการบันทึกนิรนาม ถือว่าคุณได้อ่านและยอมรับข้อกำหนดและเงื่อนไขนี้แล้ว
                หากคุณไม่ยอมรับ กรุณาหยุดใช้บริการทันที
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
  title: 'ข้อกำหนดและเงื่อนไขการใช้บริการ - Nira',
  meta: [
    { name: 'description', content: 'ข้อกำหนดและเงื่อนไขการใช้บริการบันทึกนิรนาม - กรุณาอ่านก่อนใช้บริการ' },
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
