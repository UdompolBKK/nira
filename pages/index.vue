<template>
  <div class="w-full">
    <!-- Hero Section with Background Image -->
    <section class="relative h-screen w-full overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 w-full h-full">
        <div
          v-for="(img, idx) in images"
          v-show="currentImage === idx"
          :key="img"
          class="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          :style="{ backgroundImage: `url(${img})` }"
        >
          <div class="absolute inset-0 bg-black/40"></div>
        </div>
      </div>

      <!-- Hero Content -->
      <div style="position: relative !important" class="relative flex h-full flex-col items-center justify-center px-4 text-center">
        <!-- Welcome Modal -->
        <div style="z-index: 1000 !important" class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl mx-auto mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            การเขียนบันทึกคือเครื่องมือแห่งการเยียวยา
          </h2>
          <p class="text-gray-700 leading-relaxed mb-8">
            บันทึกนิรนาม คือพื้นที่ปลอดภัยที่ให้คุณได้พูดคุยกับตัวเองอย่างแท้จริง คุณสามารถปลดปล่อยความรู้สึกทั้งหมด ไม่ว่าจะเป็นความเจ็บปวด ความหวัง หรือความฝันที่เก็บไว้ลึก การเขียนแบบไม่เปิดเผยตัวตนช่วยสร้างความสงบและความเข้าใจในตัวเอง บันทึกนิรนามไม่ใช่แค่การเขียน แต่เป็นการเยียวยาจิตใจที่เงียบสงัด เป็นที่ที่คุณได้เป็นตัวเองอย่างแท้จริง
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              @click="showModal = false"
              class="px-8 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              style="border: 2px #000 solid;"
            >
              อ่านเรื่องราวของคนอื่น
            </button>
            <NuxtLink
              to="/my-activity"
              class="px-8 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-colors"
              style="color:#fff;"
            >
              เริ่มบันทึกบันทึกของคุณเอง
            </NuxtLink>
          </div>
        </div>
        <img src="/fadebot.png" style="position: absolute; bottom: 0; width: 100%; height: 200px; z-index: 900; margin-bottom: -2px;" alt="Fade Bottom" />
      </div>
    </section>

    <!-- Why Let Others Read Section -->
    <section class="py-20 px-4 md:px-8 bg-white">
      <div class="mx-auto max-w-6xl">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Left: Image -->
          <div class="order-2 md:order-1">
            <img
              src="/mockimage.jpg"
              alt="Writing diary"
              class="w-full rounded-2xl shadow-lg"
            />
          </div>

          <!-- Right: Content -->
          <div class="order-1 md:order-2">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              ทำไมต้องให้ผู้อื่นได้อ่านบันทึกของเรา?
            </h2>
            <p class="text-gray-700 text-base md:text-lg leading-relaxed">
              บันทึกนิรนาม คือพื้นที่ปลอดภัยที่ให้คุณได้พูดคุยกับตัวเองอย่างแท้จริง คุณสามารถปลดปล่อยความรู้สึกทั้งหมด ไม่ว่าจะเป็นความเจ็บปวด ความหวัง หรือความฝันที่เก็บไว้ลึก การเขียนแบบไม่เปิดเผยตัวตนช่วยสร้างความสงบและความเข้าใจในตัวเอง บันทึกนิรนามไม่ใช่แค่การเขียน แต่เป็นการเยียวยาจิตใจที่เงียบสงัด เป็นที่ที่คุณได้เป็นตัวเองอย่างแท้จริง
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tools Section -->
    <section class="py-20 px-4 md:px-8 bg-gray-50">
      <div class="mx-auto max-w-6xl">
        <!-- Section Title -->
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            เครื่องมือที่ทำให้คุณสบายใจ
          </h2>
        </div>

        <!-- Features Grid -->
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1: การบันทึกแบบนิรนาม -->
          <div class="text-center bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="mb-6 flex justify-center">
              <img src="/niraicon1.png" alt="Anonymous diary" class="w-24 h-24 object-contain" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              การบันทึกแบบนิรนาม
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              การบันทึกของคุณจะถูกซ่อนตัวตน และไม่แสดงข้อมูลส่วนตัวให้สาธารณะได้รู้
            </p>
          </div>

          <!-- Feature 2: AI ผู้ช่วยชีวยใจ -->
          <div class="text-center bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="mb-6 flex justify-center">
              <img src="/niraicon2.png" alt="AI companion" class="w-24 h-24 object-contain" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              AI ผู้ช่วยรับฟัง
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              ระบบ AI ที่ถูกฝึกให้เป็นผู้รับฟังที่ดี คอยรับฟังระหว่างคุณเขียนบันทึก คุณจะไม่เหงาเมื่อต้องระบายเรื่องราวของคุณ
            </p>
          </div>

          <!-- Feature 3: Community ที่ปลอดภัย -->
          <div class="text-center bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="mb-6 flex justify-center">
              <img src="/niraicon3.png" alt="Safe community" class="w-24 h-24 object-contain" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              Community ที่ปลอดภัย
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              เรามีระบบการ comment ให้กำลังใจในแต่ละ Section เรื่องราวของคุณ และ คุณสามารถ lock บางเรื่องราวที่ sensitive ของคุณได้
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Posts Section -->
    <section class="py-20 px-4 md:px-8 bg-white">
      <div class="mx-auto max-w-6xl">
        <!-- Section Title -->
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            เรื่องราวใหม่
          </h2>
        </div>

        <!-- Posts Carousel -->
        <div class="relative px-12">
          <!-- Navigation Buttons -->
          <button
            @click="previousPost"
            class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <Icon name="lucide:chevron-left" class="w-5 h-5 text-gray-600" />
          </button>

          <button
            @click="nextPost"
            class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <Icon name="lucide:chevron-right" class="w-5 h-5 text-gray-600" />
          </button>

          <!-- Posts Grid -->
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Post Card 1 -->
            <div class="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div class="flex items-start gap-3 mb-4">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Memome" alt="Avatar" class="w-12 h-12 rounded-full bg-gray-100" />
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">Memome</h4>
                  <p class="text-xs text-gray-500">@memome</p>
                </div>
              </div>
              <p class="text-gray-700 text-sm mb-4 leading-relaxed">
                "คนที่คุณควบคุมเสมอกว่าอาจไม่ใช่คนที่ช่วยเหลือคุณได้จริง บางครั้งการปล่อยวางบันทึกของคุณจริงมีค่า"
              </p>
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <div class="flex items-center gap-1">
                  <Icon name="lucide:message-circle" class="w-4 h-4" />
                  <span>25</span>
                </div>
                <div class="flex items-center gap-1">
                  <Icon name="lucide:heart" class="w-4 h-4 text-red-400" />
                  <span>123</span>
                </div>
                <span class="ml-auto">Last Update 25 minute ago</span>
              </div>
            </div>

            <!-- Post Card 2 -->
            <div class="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div class="flex items-start gap-3 mb-4">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Memome2" alt="Avatar" class="w-12 h-12 rounded-full bg-gray-100" />
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">Memome</h4>
                  <p class="text-xs text-gray-500">@memome</p>
                </div>
              </div>
              <p class="text-gray-700 text-sm mb-4 leading-relaxed">
                "คนที่คุณควบคุมเสมอกว่าอาจไม่ใช่คนที่ช่วยเหลือคุณได้จริง บางครั้งการปล่อยวางบันทึกของคุณจริงมีค่า"
              </p>
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <div class="flex items-center gap-1">
                  <Icon name="lucide:message-circle" class="w-4 h-4" />
                  <span>25</span>
                </div>
                <div class="flex items-center gap-1">
                  <Icon name="lucide:heart" class="w-4 h-4 text-red-400" />
                  <span>123</span>
                </div>
                <span class="ml-auto">Last Update 25 minute ago</span>
              </div>
            </div>
          </div>
        </div>

        <!-- View All Button -->
        <div class="text-center mt-12">
          <NuxtLink
            to="/browse"
            class="inline-flex items-center justify-center rounded-full border-2 border-gray-900 px-10 py-3 font-medium text-gray-900 hover:bg-gray-50 transition-colors"
          >
            อ่านเรื่องราวของคนอื่น
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'บันทึกนิรนาม - ที่พักปลอดภัยสำหรับความคิดของคุณ',
  meta: [
    {
      name: 'description',
      content: 'บันทึกนิรนาม - เขียนบันทึกปกปิดตัวตน คุยกับ AI companion และเชื่อมต่อกับชุมชน'
    }
  ]
})

const images = [
  'https://images.unsplash.com/photo-1507238691740-e6d7c3b2b698?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=1200&h=800&fit=crop'
]

const currentImage = ref(0)
const currentPostSet = ref(0)
const showModal = ref(true)

let imageTimer: NodeJS.Timeout | null = null

onMounted(() => {
  imageTimer = setInterval(() => {
    currentImage.value = (currentImage.value + 1) % images.length
  }, 4000)
})

onBeforeUnmount(() => {
  if (imageTimer) clearInterval(imageTimer)
})

const nextPost = () => {
  currentPostSet.value = (currentPostSet.value + 1) % 3
}

const previousPost = () => {
  currentPostSet.value = currentPostSet.value === 0 ? 2 : currentPostSet.value - 1
}
</script>

<style scoped>
/* Custom animations can be added here if needed */
</style>
