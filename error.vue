<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-lg w-full text-center">
      <!-- Loading State - กำลังค้นหาหน้าที่ใกล้เคียง -->
      <div v-if="isSearching" class="py-16">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p class="text-gray-600">กำลังค้นหาหน้าที่ใกล้เคียง...</p>
      </div>

      <!-- 404 Content - แสดงเมื่อค้นหาเสร็จแล้วไม่เจอ หรือ error อื่นๆ -->
      <div v-else>
        <!-- Error Icon -->
        <div class="mb-8">
          <div class="w-32 h-32 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
            <svg class="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>

        <!-- Error Code -->
        <h1 class="text-6xl font-bold text-gray-900 mb-4">
          {{ error?.statusCode || 404 }}
        </h1>

        <!-- Error Message -->
        <h2 class="text-2xl font-bold text-gray-800 mb-4">
          {{ errorTitle }}
        </h2>

        <p class="text-gray-600 mb-8">
          {{ errorMessage }}
        </p>

        <!-- Suggestions -->
        <div v-if="suggestions.length > 0" class="mb-8">
          <p class="text-sm text-gray-500 mb-4">หน้าที่คุณอาจกำลังหา:</p>
          <div class="space-y-2">
            <NuxtLink
              v-for="suggestion in suggestions"
              :key="suggestion.url"
              :to="suggestion.url"
              class="block p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <span class="font-medium text-gray-900">{{ suggestion.title }}</span>
              <span class="text-sm text-gray-500 block">{{ suggestion.url }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="goBack"
            class="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← ย้อนกลับ
          </button>
          <NuxtLink
            to="/"
            class="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            กลับหน้าหลัก
          </NuxtLink>
        </div>

        <!-- Search Box -->
        <div class="mt-12 p-6 bg-white rounded-lg shadow-sm">
          <p class="text-sm text-gray-600 mb-4">หรือค้นหาที่พักที่คุณต้องการ:</p>
          <form @submit.prevent="handleSearch" class="flex gap-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ค้นหาที่พัก, จังหวัด..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              class="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              ค้นหา
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ErrorProps {
  error: {
    statusCode?: number
    message?: string
    url?: string
  }
}

const props = defineProps<ErrorProps>()
const router = useRouter()
const route = useRoute()

const isSearching = ref(true)
const searchQuery = ref('')
const suggestions = ref<{ url: string; title: string }[]>([])

// Error messages based on status code
const errorTitle = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return 'ไม่พบหน้าที่คุณต้องการ'
    case 500:
      return 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์'
    case 403:
      return 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้'
    default:
      return 'เกิดข้อผิดพลาด'
  }
})

const errorMessage = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return 'หน้าที่คุณกำลังหาอาจถูกย้าย ลบ หรือไม่เคยมีอยู่'
    case 500:
      return 'กรุณาลองใหม่อีกครั้งในภายหลัง'
    case 403:
      return 'กรุณาเข้าสู่ระบบหรือติดต่อผู้ดูแลระบบ'
    default:
      return props.error?.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
  }
})

// ค้นหาหน้าที่ใกล้เคียงและ redirect อัตโนมัติ
const findAndRedirect = async () => {
  // เฉพาะ 404 เท่านั้นที่จะ fuzzy search
  if (props.error?.statusCode !== 404) {
    isSearching.value = false
    return
  }

  try {
    const currentPath = route.fullPath || props.error?.url || ''

    const response = await $fetch<{
      redirect: string
      type: string
      confidence: number
      statusCode: number
    }>('/api/search/fuzzy', {
      params: { path: currentPath }
    })

    if (response.redirect && response.redirect !== '/' && response.confidence > 0.5) {
      // Redirect ไปหน้าที่ใกล้เคียง
      // ใช้ replace เพื่อไม่ให้ user กด back กลับมาหน้า 404
      await navigateTo(response.redirect, {
        replace: true,
        redirectCode: response.statusCode as 301 | 302
      })
      return
    }

    // ถ้าหาไม่เจอ หรือ confidence ต่ำ ให้แสดงหน้า 404
    // แต่เพิ่ม suggestions
    if (response.redirect && response.redirect !== '/') {
      suggestions.value = [{
        url: response.redirect,
        title: `${response.type === 'hotel' ? 'โรงแรม' : response.type === 'province' ? 'จังหวัด' : 'บทความ'}ที่ใกล้เคียง`
      }]
    }

  } catch (error) {
    console.error('Fuzzy search failed:', error)
  } finally {
    isSearching.value = false
  }
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    navigateTo('/')
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo({
      path: '/search',
      query: { keyword: searchQuery.value }
    })
  }
}

// เริ่มค้นหาเมื่อ component mount
onMounted(() => {
  findAndRedirect()
})
</script>

<style scoped>
/* Primary color จาก Tailwind config */
</style>
