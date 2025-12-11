<template>
  <!-- Cookie Consent Banner -->
  <Transition name="slide-up">
    <div
      v-if="showBanner"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t border-gray-200"
    >
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
          <!-- Icon and Message -->
          <div class="flex-1">
            <div class="flex items-start gap-3">
              <Icon name="lucide:cookie" class="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">เราใช้ Cookies เพื่อปรับปรุงประสบการณ์ของคุณ</h3>
                <p class="text-sm text-gray-600 leading-relaxed">
                  เราใช้ Cookies ที่จำเป็นสำหรับการทำงานของเว็บไซต์ และ Cookies เพื่อวิเคราะห์การใช้งาน (Google Analytics)
                  ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
                  <NuxtLink to="/privacy" class="text-purple-600 hover:underline">
                    อ่านนโยบายความเป็นส่วนตัว
                  </NuxtLink>
                </p>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button
              @click="openSettings"
              class="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ตั้งค่า Cookies
            </button>
            <button
              @click="rejectAll"
              class="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ปฏิเสธทั้งหมด
            </button>
            <button
              @click="acceptAll"
              class="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg transition-all"
            >
              ยอมรับทั้งหมด
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Cookie Settings Modal -->
  <Transition name="modal">
    <div
      v-if="showSettings"
      class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="showSettings = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900">การตั้งค่า Cookies</h2>
            <button
              @click="showSettings = false"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="lucide:x" class="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 py-6">
          <p class="text-sm text-gray-600 mb-6">
            เราใช้ Cookies เพื่อปรับปรุงประสบการณ์การใช้งาน วิเคราะห์การใช้งาน และรักษาความปลอดภัย
            คุณสามารถเลือกประเภท Cookies ที่ต้องการได้
          </p>

          <!-- Cookie Types -->
          <div class="space-y-4">
            <!-- Necessary Cookies -->
            <div class="border border-gray-200 rounded-xl p-4">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    Cookies ที่จำเป็น
                    <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">จำเป็น</span>
                  </h3>
                  <p class="text-sm text-gray-600">
                    Cookies เหล่านี้จำเป็นสำหรับการทำงานของเว็บไซต์ ไม่สามารถปิดได้
                  </p>
                </div>
                <div class="ml-4">
                  <div class="w-12 h-6 bg-green-600 rounded-full flex items-center justify-end px-1">
                    <div class="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-600">
                  <strong>ตัวอย่าง:</strong> Authentication, Session Management, CSRF Protection, การตั้งค่าภาษา
                </p>
              </div>
            </div>

            <!-- Functional Cookies -->
            <div class="border border-gray-200 rounded-xl p-4">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 mb-1">Cookies เพื่อการทำงาน</h3>
                  <p class="text-sm text-gray-600">
                    จำการตั้งค่าของคุณ เช่น ธีม ภาษา AI Bot ที่เลือก
                  </p>
                </div>
                <div class="ml-4">
                  <button
                    @click="toggleCookie('functional')"
                    :class="[
                      'w-12 h-6 rounded-full flex items-center transition-colors px-1',
                      preferences.functional
                        ? 'bg-purple-600 justify-end'
                        : 'bg-gray-300 justify-start'
                    ]"
                  >
                    <div class="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-600">
                  <strong>ตัวอย่าง:</strong> ธีมที่เลือก (Dark/Light), AI Bot Skin, การตั้งค่าความเป็นส่วนตัว
                </p>
              </div>
            </div>

            <!-- Analytics Cookies -->
            <div class="border border-gray-200 rounded-xl p-4">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 mb-1">Cookies เพื่อวิเคราะห์</h3>
                  <p class="text-sm text-gray-600">
                    ช่วยให้เราเข้าใจว่าคุณใช้งานเว็บไซต์อย่างไร เพื่อปรับปรุงบริการ (Google Analytics 4)
                  </p>
                </div>
                <div class="ml-4">
                  <button
                    @click="toggleCookie('analytics')"
                    :class="[
                      'w-12 h-6 rounded-full flex items-center transition-colors px-1',
                      preferences.analytics
                        ? 'bg-purple-600 justify-end'
                        : 'bg-gray-300 justify-start'
                    ]"
                  >
                    <div class="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-600">
                  <strong>ตัวอย่าง:</strong> Google Analytics (_ga, _gid, _gat) - Page views, User behavior, Traffic sources
                </p>
              </div>
            </div>

            <!-- Marketing Cookies (Currently Not Used) -->
            <div class="border border-gray-200 rounded-xl p-4 opacity-50">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    Cookies เพื่อการตลาด
                    <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">ยังไม่ได้ใช้</span>
                  </h3>
                  <p class="text-sm text-gray-600">
                    สำหรับแสดงโฆษณาที่เกี่ยวข้อง (เรายังไม่มีโฆษณา)
                  </p>
                </div>
                <div class="ml-4">
                  <div class="w-12 h-6 bg-gray-300 rounded-full flex items-center justify-start px-1">
                    <div class="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- PDPA Notice -->
          <div class="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <div class="flex gap-3">
              <Icon name="lucide:shield-check" class="w-5 h-5 text-purple-600 flex-shrink-0" />
              <div>
                <p class="text-sm text-purple-900 font-medium mb-1">PDPA Compliance</p>
                <p class="text-xs text-purple-800 leading-relaxed">
                  การตั้งค่านี้เป็นไปตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
                  คุณสามารถเปลี่ยนแปลงการตั้งค่าได้ทุกเมื่อ และเราจะเก็บบันทึกความยินยอมของคุณไว้ 5 ปี
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div class="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              @click="rejectAll"
              class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ปฏิเสธทั้งหมด
            </button>
            <button
              @click="savePreferences"
              class="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg transition-all"
            >
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Cookie Settings Button (Fixed Bottom Left) -->
  <button
    v-if="!showBanner && consentGiven"
    @click="showSettings = true"
    class="fixed bottom-6 left-6 z-40 p-3 bg-white shadow-lg rounded-full border border-gray-200 hover:shadow-xl transition-all group"
    title="ตั้งค่า Cookies"
  >
    <Icon name="lucide:cookie" class="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
  </button>
</template>

<script setup lang="ts">
const showBanner = ref(false)
const showSettings = ref(false)
const consentGiven = ref(false)

const preferences = ref({
  necessary: true, // Always true, cannot be disabled
  functional: false,
  analytics: false,
  marketing: false
})

// Check if consent was already given
onMounted(() => {
  const consent = localStorage.getItem('cookie-consent')
  if (consent) {
    consentGiven.value = true
    try {
      const savedPreferences = JSON.parse(consent)
      preferences.value = { ...preferences.value, ...savedPreferences }
      applyPreferences()
    } catch (err) {
      console.error('Error parsing cookie consent:', err)
    }
  } else {
    // Show banner after 1 second
    setTimeout(() => {
      showBanner.value = true
    }, 1000)
  }
})

const toggleCookie = (type: 'functional' | 'analytics' | 'marketing') => {
  preferences.value[type] = !preferences.value[type]
}

const acceptAll = async () => {
  preferences.value = {
    necessary: true,
    functional: true,
    analytics: true,
    marketing: false // Not used yet
  }
  await saveConsent()
}

const rejectAll = async () => {
  preferences.value = {
    necessary: true, // Cannot be disabled
    functional: false,
    analytics: false,
    marketing: false
  }
  await saveConsent()
}

const savePreferences = async () => {
  await saveConsent()
  showSettings.value = false
}

const saveConsent = async () => {
  // Save to localStorage
  localStorage.setItem('cookie-consent', JSON.stringify(preferences.value))
  localStorage.setItem('cookie-consent-date', new Date().toISOString())

  // Apply preferences
  applyPreferences()

  // Save to Firestore (for PDPA compliance - keep for 5 years)
  await saveConsentToDatabase()

  // Hide banner
  showBanner.value = false
  consentGiven.value = true
}

const applyPreferences = () => {
  // Apply Analytics (Google Analytics)
  if (preferences.value.analytics) {
    enableGoogleAnalytics()
  } else {
    disableGoogleAnalytics()
  }

  // Apply other cookie types if needed in the future
}

const enableGoogleAnalytics = () => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted'
    })
  }
}

const disableGoogleAnalytics = () => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied'
    })
  }
}

const saveConsentToDatabase = async () => {
  try {
    const { user } = useAuth()

    // Only save to database if user is logged in
    if (!user.value) return

    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) return

    const token = await firebaseUser.getIdToken()

    await $fetch('/api/consent/save', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        preferences: preferences.value,
        userAgent: navigator.userAgent,
        ipAddress: null, // Will be filled by server
        timestamp: new Date().toISOString()
      }
    })
  } catch (err) {
    console.error('Error saving consent to database:', err)
    // Don't block the user if database save fails
  }
}

const openSettings = () => {
  showSettings.value = true
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter-from {
  transform: translateY(100%);
}

.slide-up-leave-to {
  transform: translateY(100%);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-from {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div {
  transform: scale(0.95);
}

.modal-leave-to > div {
  transform: scale(0.95);
}
</style>
