<template>
  <div class="w-full">
    <!-- Hero Section with Background Image -->
    <section class="relative h-screen w-full overflow-hidden">
      <!-- Background Images (Cross-fade) -->
      <div class="absolute inset-0 w-full h-full">
        <TransitionGroup name="hero-fade">
          <div
            v-for="(image, index) in heroImages"
            v-show="index === currentImage"
            :key="`hero-${index}`"
            class="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat hero-zoom"
            :style="{ backgroundImage: `url(${image})` }"
          >
            <div class="absolute inset-0 bg-black/40"></div>
          </div>
        </TransitionGroup>
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
              src="/imghome.png"
              alt="Writing diary"
              class="w-full rounded-2xl"
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

    <!-- Recent Vent Posts Section -->
    <section class="py-20 bg-white">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <!-- Section Title -->
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            การระบายปัญหาล่าสุด
          </h2>
          <p class="text-gray-600 text-sm">
            บันทึกการระบายความรู้สึกล่าสุดจากผู้ใช้ในชุมชน
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="postsLoading" class="text-center py-12">
          <Icon name="lucide:loader-2" class="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
          <p class="text-gray-500">กำลังโหลดบันทึก...</p>
        </div>

        <!-- Posts Slider with Splide -->
        <div v-else-if="recentVentPosts.length > 0">
          <Splide :options="splideOptions" class="vent-splide">
            <SplideSlide v-for="post in recentVentPosts" :key="post.id">
              <div style="padding-bottom: 20px;">
              <VentCard :post="post" variant="compact" />
              </div>
            </SplideSlide>
          </Splide>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <Icon name="lucide:file-text" class="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p class="text-gray-500 mb-4">ยังไม่มีบันทึกการระบาย</p>
          <NuxtLink
            to="/my-activity"
            class="inline-flex items-center justify-center rounded-full border-2 border-gray-900 px-8 py-2 font-medium text-gray-900 hover:bg-gray-50 transition-colors text-sm"
          >
            เริ่มเขียนบันทึก
          </NuxtLink>
        </div>

        <!-- View All Button -->
        <div v-if="recentVentPosts.length > 0" class="text-center mt-12">
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
import { MOOD_CATEGORIES, type Post } from '~/composables/usePosts'

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

// Check if user needs to verify email
const { user } = useAuth()
watchEffect(() => {
  if (user.value) {
    // Check if user logged in with email/password (not Google)
    const isGoogleUser = user.value.providerData?.some(p => p.providerId === 'google.com')
    if (!isGoogleUser && !user.value.emailVerified) {
      navigateTo('/verify-email')
    }
  }
})

// Hero Images - Fetched from Firebase
const heroImages = ref<string[]>([])
const currentImage = ref(0)
const showModal = ref(true)

// Recent Vent Posts
const recentVentPosts = ref<Post[]>([])
const postsLoading = ref(false)

let imageTimer: NodeJS.Timeout | null = null

// Splide Carousel Settings
const splideOptions = {
  type: 'loop',
  perPage: 3,
  perMove: 1,
  gap: '1rem',
  padding: '3rem',
  arrows: true,
  pagination: false,
  breakpoints: {
    1024: {
      perPage: 2,
    },
    640: {
      perPage: 1,
      padding: '1rem',
    }
  }
}

// Load hero banner images from API
const loadHeroImages = async () => {
  try {
    const response = await $fetch<{ images: Array<{ id: string; url: string; order: number; isActive: boolean }> }>('/api/hero-images')
    heroImages.value = response.images.map(img => img.url)

    // Fallback to default images if none returned
    if (heroImages.value.length === 0) {
      heroImages.value = [
        'https://images.unsplash.com/photo-1507238691740-e6d7c3b2b698?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=1200&h=800&fit=crop'
      ]
    }
  } catch (error) {
    console.error('[index] Error loading hero images:', error)
    // Use default images on error
    heroImages.value = [
      'https://images.unsplash.com/photo-1507238691740-e6d7c3b2b698?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=1200&h=800&fit=crop'
    ]
  }
}

// Load recent vents (latest 10 vents)
const loadRecentVentPosts = async () => {
  postsLoading.value = true
  try {
    const response = await $fetch<{ vents: any[] }>('/api/vents', {
      params: {
        limit: '10' // Show 10 latest vents
      }
    })

    console.log('[index] Loaded vents:', response.vents.length, response.vents)

    recentVentPosts.value = response.vents.map((data: any) => ({
      id: data.id,
      userId: data.userId,
      authorName: data.authorName || 'ไม่ระบุชื่อ',
      authorSlug: data.authorSlug,
      authorPhoto: data.authorPhoto,
      content: data.content,
      excerpt: data.excerpt || data.content?.replace(/<[^>]*>/g, '').substring(0, 150),
      visibility: data.visibility || 'public',
      isLocked: data.isLocked || false,
      tags: data.tags || [],
      moodCategory: data.moodCategory || 'normal',
      likeCount: typeof data.likeCount === 'number' ? data.likeCount : (Array.isArray(data.likeCount) ? data.likeCount.length : 0),
      sadCount: typeof data.sadCount === 'number' ? data.sadCount : 0,
      happyCount: typeof data.happyCount === 'number' ? data.happyCount : 0,
      commentCount: typeof data.commentCount === 'number' ? data.commentCount : 0,
      viewCount: typeof data.viewCount === 'number' ? data.viewCount : 0,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    }))
  } catch (error) {
    console.error('[index] Error loading recent vent posts:', error)
    recentVentPosts.value = []
  } finally {
    postsLoading.value = false
  }
}

// Format time ago
const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'เมื่อสักครู่'
  if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`
  if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`

  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: diffDays > 365 ? 'numeric' : undefined
  })
}

onMounted(async () => {
  // Load hero images first
  await loadHeroImages()

  // Start hero image carousel
  imageTimer = setInterval(() => {
    currentImage.value = (currentImage.value + 1) % heroImages.value.length
  }, 4000)

  // Load recent vent posts
  await loadRecentVentPosts()
})

onBeforeUnmount(() => {
  if (imageTimer) clearInterval(imageTimer)
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hero image zoom animation */
.hero-zoom {
  animation: zoom-out 15s ease-out forwards;
}

@keyframes zoom-out {
  from {
    transform: scale(1.1);
  }
  to {
    transform: scale(1);
  }
}

/* Cross-fade transition for hero images */
.hero-fade-enter-active {
  transition: opacity 1.5s ease-in-out;
  position: absolute;
  z-index: 1;
}

.hero-fade-leave-active {
  transition: opacity 1.5s ease-in-out;
  position: absolute;
  z-index: 0;
}

.hero-fade-enter-from {
  opacity: 0;
}

.hero-fade-leave-to {
  opacity: 0;
}

.hero-fade-enter-to {
  opacity: 1;
}

.hero-fade-leave-from {
  opacity: 1;
}

/* Splide Carousel custom styles */
.vent-splide {
  padding-bottom: 2rem;
}

.vent-splide :deep(.splide__arrow) {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  opacity: 1;
}

.vent-splide :deep(.splide__arrow:hover) {
  background: #f9fafb;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

.vent-splide :deep(.splide__arrow svg) {
  fill: #374151;
}

.vent-splide :deep(.splide__arrow--prev) {
  left: -24px;
}

.vent-splide :deep(.splide__arrow--next) {
  right: -24px;
}
</style>
