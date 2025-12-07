<template>
  <div class="w-full">
    <!-- Hero Banner Section -->
    <section class="relative h-screen w-full overflow-hidden">
      <!-- Background Slideshow -->
      <div class="absolute inset-0 w-full h-full">
        <div
          v-for="(img, idx) in images"
          v-show="currentImage === idx"
          :key="img"
          class="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          :style="{ backgroundImage: `url(${img})` }"
        >
          <div class="absolute inset-0 bg-black/10"></div>
        </div>
      </div>

      <!-- Hero Content -->
      <div class="relative flex h-full flex-col items-center justify-center px-4 text-center">
        <!-- Hero Text -->
        <h1 class="mb-4 text-5xl font-bold text-white drop-shadow-lg md:text-6xl lg:text-7xl">
          การเขียนบันทึกคือเครื่องมือแห่งการเยียวยา
        </h1>

        <!-- Hero Description -->
        <p class="mb-12 max-w-2xl text-xl text-gray-100 drop-shadow-md md:text-2xl">
          เขียนบันททึกเรื่องราวของคุณอย่างอิสระแบบปกปิดตัวตน
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col gap-4 sm:flex-row">
          <NuxtLink
            to="/browse"
            class="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-50"
          >
            อ่านบันทึก
          </NuxtLink>

          <NuxtLink
            to="/editor"
            class="inline-flex items-center justify-center rounded-lg bg-primary-700 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
           style="color:#fff; background: #000;">
            เริ่มต้นบันทึก
          </NuxtLink>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            class="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>

    <!-- Overlapping Features Section -->
    <section class="relative -mt-20 bg-white px-4 py-20 md:px-8">
      <div class="mx-auto max-w-6xl">
        <!-- Section Title -->
        <div class="mb-16 text-center">
          <h2 class="mb-4 text-4xl font-bold text-gray-900">
            ทำไมต้อง บันทึกนิรนาม?
          </h2>
          <div class="mx-auto h-1 w-24 bg-primary-300"></div>
        </div>

        <!-- Features Grid -->
        <div class="grid gap-8 md:grid-cols-3">
          <!-- Feature 1 -->
          <div
            class="rounded-xl bg-primary-50 p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            <div class="mb-4 text-4xl">🔐</div>
            <h3 class="mb-3 text-xl font-bold text-gray-900">ปกปิดตัวตน</h3>
            <p class="text-gray-700">
              เขียนอย่างอิสระโดยไม่เปิดเผยตัวตน ความเป็นส่วนตัวของคุณถูกปกป้อง
            </p>
          </div>

          <!-- Feature 2 -->
          <div
            class="rounded-xl bg-primary-50 p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            <div class="mb-4 text-4xl">🤖</div>
            <h3 class="mb-3 text-xl font-bold text-gray-900">AI Companion</h3>
            <p class="text-gray-700">
              คุยกับ AI ที่เข้าใจและเห็นอกเห็นใจ 24/7 พร้อมช่วยเหลือ
            </p>
          </div>

          <!-- Feature 3 -->
          <div
            class="rounded-xl bg-primary-50 p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            <div class="mb-4 text-4xl">👥</div>
            <h3 class="mb-3 text-xl font-bold text-gray-900">ชุมชนที่ปลอดภัย</h3>
            <p class="text-gray-700">
              เชื่อมต่อกับคนอื่นที่มีประสบการณ์คล้ายกัน แบ่งปันและรับการสนับสนุน
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Additional Info Section -->
    <section class="bg-gray-50 px-4 py-20 md:px-8">
      <div class="mx-auto max-w-4xl">
        <div class="grid gap-12 md:grid-cols-2">
          <!-- Left Content -->
          <div class="flex flex-col justify-center">
            <h2 class="mb-4 text-3xl font-bold text-gray-900">
              สำหรับทุกคน ไม่ว่าใคร
            </h2>
            <p class="mb-4 text-gray-700">
              ไม่ว่าคุณจะกำลังเผชิญหน้ากับความท้อแท้ ความเครียด หรือต้องการพื้นที่สำหรับความคิดของตัวเอง
              บันทึกนิรนาม คือที่ที่คุณสามารถแสดงออกได้อย่างสมบูรณ์
            </p>
            <ul class="space-y-3 text-gray-700">
              <li class="flex items-center">
                <span class="mr-3 text-xl">✓</span>
                เขียนได้ทุกเรื่องที่คุณต้องการ
              </li>
              <li class="flex items-center">
                <span class="mr-3 text-xl">✓</span>
                จัดแบ่งปันได้กับเพื่อนหรือเก็บไว้ส่วนตัว
              </li>
              <li class="flex items-center">
                <span class="mr-3 text-xl">✓</span>
                วิเคราะห์อารมณ์ของคุณด้วย AI
              </li>
              <li class="flex items-center">
                <span class="mr-3 text-xl">✓</span>
                ดาวน์โหลดและส่งออกบันทึกของคุณ
              </li>
            </ul>
          </div>

          <!-- Right Content - Stats -->
          <div class="space-y-8">
            <div class="rounded-lg bg-white p-8 shadow-md">
              <div class="text-4xl font-bold text-gray-900">50K+</div>
              <p class="mt-2 text-gray-700">ผู้ใช้ที่ไว้ใจ</p>
            </div>

            <div class="rounded-lg bg-white p-8 shadow-md">
              <div class="text-4xl font-bold text-gray-900">500K+</div>
              <p class="mt-2 text-gray-700">บันทึกที่ถูกสร้างขึ้น</p>
            </div>

            <div class="rounded-lg bg-white p-8 shadow-md">
              <div class="text-4xl font-bold text-gray-900">24/7</div>
              <p class="mt-2 text-gray-700">AI Companion พร้อมช่วยเหลือ</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final Section -->
    <section class="bg-primary-800 px-4 py-20 md:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="mb-4 text-4xl font-bold text-white">
          เริ่มต้นการเขียนวันนี้
        </h2>
        <p class="mb-8 text-lg text-gray-500">
          ไม่ต้องเตรียมตัว ไม่ต้องบอกชื่อ แค่เขียนและปล่อยให้มันไหล
        </p>

        <NuxtLink
          to="/editor"
          class="inline-flex items-center rounded-lg bg-white px-10 py-4 font-bold text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <span class="mr-2">✍️</span>
          เริ่มต้นบันทึก
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// Optional: Add head metadata
useHead({
  title: 'บันทึกนิรนาม - ที่พักปลอดภัยสำหรับความคิดของคุณ',
  meta: [
    {
      name: 'description',
      content: 'บันทึกนิรนาม - เขียนบันทึกปกปิดตัวตน คุยกับ AI companion และเชื่อมต่อกับชุมชน'
    },
    {
      name: 'og:image',
      content: 'https://images.unsplash.com/photo-1507238691740-e6d7c3b2b698?w=1200&h=630&fit=crop'
    }
  ]
})

import { ref, onMounted, onBeforeUnmount } from 'vue'
const images = [
  'https://images.unsplash.com/photo-1507238691740-e6d7c3b2b698?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=1200&h=800&fit=crop'
]
const currentImage = ref(0)
let timer = null
onMounted(() => {
  timer = setInterval(() => {
    currentImage.value = (currentImage.value + 1) % images.length
  }, 4000)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
</style>
