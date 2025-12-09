<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-lg w-full text-center">
      <!-- Error Icon -->
      <div class="mb-8">
        <div class="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          class="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
        >
          กลับหน้าหลัก
        </NuxtLink>
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

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    navigateTo('/')
  }
}
</script>

<style scoped>
/* Primary color จาก Tailwind config */
</style>
