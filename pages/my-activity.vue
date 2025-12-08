<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-20 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          คุณต้องการเขียนอะไร?
        </h1>
        <p class="text-lg text-gray-600">
          เลือกกิจกรรมที่เหมาะกับความรู้สึกของคุณในตอนนี้
        </p>
      </div>

      <!-- Options Grid -->
      <div class="grid md:grid-cols-3 gap-6 mb-12">
        <!-- Option 1: เรื่องราวชีวิตของฉัน -->
        <NuxtLink
          to="/editor"
          class="group bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 cursor-pointer"
        >
          <div class="mb-6 flex justify-center">
            <div class="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon name="lucide:book-open" class="w-12 h-12 text-purple-600" />
            </div>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3 text-center">
            เรื่องราวชีวิตของฉัน
          </h3>
          <p class="text-gray-600 text-sm text-center leading-relaxed">
            เขียนเรื่องราวตั้งแต่แรกเริ่มของคุณ จนถึงปัจจุบัน เริ่มต้นเรียนรู้ปมของตัวเองไปทีละเรื่องและคลายมันออกทีละนิด
          </p>
          <div class="mt-6 flex justify-center">
            <div class="flex items-center gap-2 text-purple-600 font-medium text-sm group-hover:gap-3 transition-all">
              <span>เริ่มเขียนบันทึก</span>
              <Icon name="lucide:arrow-right" class="w-4 h-4" />
            </div>
          </div>
        </NuxtLink>

        <!-- Option 2: ความไม่สบายใจในตอนนี้ -->
        <NuxtLink
          to="/my-problem"
          class="group bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-pink-200 cursor-pointer"
        >
          <div class="mb-6 flex justify-center">
            <div class="w-24 h-24 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon name="lucide:heart-handshake" class="w-12 h-12 text-pink-600" />
            </div>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3 text-center">
            ความไม่สบายใจในตอนนี้
          </h3>
          <p class="text-gray-600 text-sm text-center leading-relaxed">
            แชร์ความรู้สึกที่ไม่สบายใจหรือเครียดในตอนนี้ รับกำลังใจจากคนอื่นในชุมชน
          </p>
          <div class="mt-6 flex justify-center">
            <div class="flex items-center gap-2 text-pink-600 font-medium text-sm group-hover:gap-3 transition-all">
              <span>ระบายความรู้สึก</span>
              <Icon name="lucide:arrow-right" class="w-4 h-4" />
            </div>
          </div>
        </NuxtLink>

        <!-- Option 3: ฝึกเป็นนักรับฟัง -->
        <NuxtLink
          to="/listener-training"
          class="group bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 cursor-pointer"
        >
          <div class="mb-6 flex justify-center">
            <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon name="lucide:ear" class="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3 text-center">
            ฝึกเป็นนักรับฟัง
          </h3>
          <p class="text-gray-600 text-sm text-center leading-relaxed">
            เรียนรู้ทักษะการรับฟังอย่างมีประสิทธิภาพ เพื่อช่วยเหลือตัวเองและคนรอบข้าง
          </p>
          <div class="mt-6 flex justify-center">
            <div class="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
              <span>เริ่มเรียนรู้</span>
              <Icon name="lucide:arrow-right" class="w-4 h-4" />
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Bottom Info -->
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="lucide:lightbulb" class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">เคล็ดลับสำหรับการเขียนบันทึก</h4>
            <p class="text-sm text-gray-600 leading-relaxed">
              การเขียนบันทึกเป็นประจำช่วยให้คุณเข้าใจตัวเองมากขึ้น ลดความเครียด และสร้างความสงบให้กับจิตใจ ไม่ต้องกังวลเรื่องการเขียนให้สมบูรณ์แบบ เพียงแค่เขียนออกมาตามความรู้สึกจริงของคุณ
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'กิจกรรมของฉัน - Nira',
  meta: [
    {
      name: 'description',
      content: 'เลือกกิจกรรมที่เหมาะกับคุณ - เขียนบันทึก แชร์ความรู้สึก หรือเรียนรู้การเป็นนักรับฟัง'
    }
  ]
})
</script>
