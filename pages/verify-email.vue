<template>
  <div class="min-h-screen flex">
    <!-- Left side - Animation -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.4&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      </div>

      <!-- Floating elements -->
      <div class="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float"></div>
      <div class="absolute bottom-32 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-xl animate-float-delayed"></div>
      <div class="absolute top-1/2 right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl animate-float-slow"></div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center items-center w-full px-12">
        <!-- Email Animation Container -->
        <div class="relative w-80 h-80 mb-8">
          <!-- Envelope -->
          <div class="envelope-container">
            <!-- Main envelope body -->
            <div class="envelope animate-envelope-float">
              <!-- Envelope back -->
              <div class="envelope-back"></div>

              <!-- Letter coming out -->
              <div class="letter animate-letter-slide">
                <div class="letter-content">
                  <div class="letter-lines">
                    <div class="line line-1"></div>
                    <div class="line line-2"></div>
                    <div class="line line-3"></div>
                  </div>
                  <div class="letter-check animate-check-pop">
                    <Icon name="lucide:check" class="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </div>

              <!-- Envelope front body -->
              <div class="envelope-front"></div>
            </div>
          </div>

          <!-- Sparkles around envelope -->
          <div class="absolute top-8 left-16 animate-sparkle-1">
            <Icon name="lucide:sparkles" class="w-6 h-6 text-yellow-400" />
          </div>
          <div class="absolute top-16 right-12 animate-sparkle-2">
            <Icon name="lucide:star" class="w-5 h-5 text-blue-300" />
          </div>
          <div class="absolute bottom-20 left-20 animate-sparkle-3">
            <Icon name="lucide:sparkle" class="w-4 h-4 text-purple-300" />
          </div>
          <div class="absolute bottom-28 right-16 animate-sparkle-4">
            <Icon name="lucide:mail" class="w-5 h-5 text-indigo-300" />
          </div>

          <!-- Flying paper planes -->
          <div class="absolute top-4 right-8 animate-plane-fly-1">
            <Icon name="lucide:send" class="w-4 h-4 text-white/40" />
          </div>
          <div class="absolute bottom-16 left-8 animate-plane-fly-2">
            <Icon name="lucide:send" class="w-3 h-3 text-white/30" />
          </div>
        </div>

        <!-- Text -->
        <div class="text-center">
          <h2 class="text-3xl font-bold text-white mb-3">ตรวจสอบกล่องจดหมาย</h2>
          <p class="text-blue-200 text-lg max-w-xs">เราได้ส่งลิงก์ยืนยันไปยังอีเมลของคุณแล้ว</p>
        </div>

        <!-- Tips -->
        <div class="mt-12 space-y-3 text-blue-200/80">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Icon name="lucide:inbox" class="w-4 h-4 text-blue-300" />
            </div>
            <span class="text-sm">ตรวจสอบโฟลเดอร์ Inbox</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Icon name="lucide:alert-triangle" class="w-4 h-4 text-yellow-300" />
            </div>
            <span class="text-sm">อย่าลืมเช็คโฟลเดอร์ Spam</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - Content -->
    <div class="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
      <div class="w-full max-w-md">
        <!-- Mobile animation -->
        <div class="lg:hidden mb-8">
          <div class="relative w-32 h-32 mx-auto">
            <div class="envelope-mobile animate-envelope-float">
              <div class="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-xl flex items-center justify-center">
                <Icon name="lucide:mail-check" class="w-12 h-12 text-white" />
              </div>
            </div>
            <!-- Mobile sparkles -->
            <div class="absolute -top-2 -right-2 animate-pulse">
              <Icon name="lucide:sparkles" class="w-6 h-6 text-yellow-400" />
            </div>
            <div class="absolute -bottom-1 -left-1 animate-pulse delay-300">
              <Icon name="lucide:star" class="w-4 h-4 text-blue-400" />
            </div>
          </div>
        </div>

        <!-- Title -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-3">ยืนยันอีเมลของคุณ</h1>
          <p class="text-gray-500">เราได้ส่งลิงก์ยืนยันไปยัง</p>
          <p v-if="user?.email" class="font-semibold text-gray-900 mt-1">
            {{ user.email }}
          </p>
        </div>

        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 mb-6">
          <!-- Instructions -->
          <div class="space-y-4 mb-8">
            <div class="flex gap-4 items-start">
              <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span class="text-sm font-bold text-blue-600">1</span>
              </div>
              <div>
                <p class="font-medium text-gray-900">เปิดกล่องจดหมาย</p>
                <p class="text-sm text-gray-500 mt-0.5">ตรวจสอบโฟลเดอร์ Spam หากไม่พบ</p>
              </div>
            </div>

            <div class="flex gap-4 items-start">
              <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <span class="text-sm font-bold text-indigo-600">2</span>
              </div>
              <div>
                <p class="font-medium text-gray-900">คลิกลิงก์ยืนยัน</p>
                <p class="text-sm text-gray-500 mt-0.5">ลิงก์จะหมดอายุใน 24 ชั่วโมง</p>
              </div>
            </div>

            <div class="flex gap-4 items-start">
              <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span class="text-sm font-bold text-purple-600">3</span>
              </div>
              <div>
                <p class="font-medium text-gray-900">กลับมาเข้าสู่ระบบ</p>
                <p class="text-sm text-gray-500 mt-0.5">หลังยืนยันแล้ว คุณสามารถใช้งานได้ทันที</p>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="relative mb-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-400">ไม่ได้รับอีเมล?</span>
            </div>
          </div>

          <!-- Resend button -->
          <button
            @click="resendEmail"
            :disabled="resending || cooldown > 0"
            class="w-full py-3.5 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Icon v-if="resending" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
            <Icon v-else-if="cooldown > 0" name="lucide:clock" class="w-5 h-5" />
            <Icon v-else name="lucide:send" class="w-5 h-5" />
            <span v-if="cooldown > 0">ส่งอีกครั้งใน {{ cooldown }} วินาที</span>
            <span v-else>ส่งอีเมลอีกครั้ง</span>
          </button>

          <!-- Success message -->
          <Transition name="slide-fade">
            <div v-if="resendSuccess" class="mt-4 p-3 rounded-xl bg-green-50 border border-green-100 flex items-center gap-2">
              <Icon name="lucide:check-circle" class="w-5 h-5 text-green-500 flex-shrink-0" />
              <span class="text-sm text-green-600">ส่งอีเมลเรียบร้อยแล้ว กรุณาตรวจสอบกล่องจดหมาย</span>
            </div>
          </Transition>

          <!-- Error message -->
          <Transition name="slide-fade">
            <div v-if="resendError" class="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2">
              <Icon name="lucide:alert-circle" class="w-5 h-5 text-red-500 flex-shrink-0" />
              <span class="text-sm text-red-600">{{ resendError }}</span>
            </div>
          </Transition>
        </div>

        <!-- Logout button -->
        <div class="text-center">
          <button
            @click="handleLogout"
            class="inline-flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm"
          >
            <Icon name="lucide:log-out" class="w-4 h-4" />
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useUserProfile } from '~/composables/useUserProfile'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'ยืนยันอีเมล - บันทึกนิรนาม',
  meta: [
    {
      name: 'description',
      content: 'ยืนยันอีเมลของคุณเพื่อเริ่มใช้งานบันทึกนิรนาม'
    }
  ]
})

const { user, logout } = useAuth()
const { userProfile, isEmailVerified } = useUserProfile()
const { auth } = useFirebase()

// Handle logout
const handleLogout = async () => {
  await logout()
  navigateTo('/login')
}

const resending = ref(false)
const resendSuccess = ref(false)
const resendError = ref<string | null>(null)
const cooldown = ref(0)

// Cooldown timer
let cooldownInterval: ReturnType<typeof setInterval> | null = null

const startCooldown = () => {
  cooldown.value = 60
  cooldownInterval = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) {
      if (cooldownInterval) {
        clearInterval(cooldownInterval)
        cooldownInterval = null
      }
    }
  }, 1000)
}

// Handle redirects (client-side only to avoid hydration mismatch)
onMounted(() => {
  // Redirect if email already verified (check from Firestore)
  watch(isEmailVerified, (verified) => {
    if (verified) {
      navigateTo('/my-activity')
    }
  }, { immediate: true })

  // Redirect if not logged in
  watch(user, (newUser) => {
    if (!newUser) {
      navigateTo('/login')
    }
  }, { immediate: true })
})

const resendEmail = async () => {
  if (resending.value || cooldown.value > 0) return

  resending.value = true
  resendSuccess.value = false
  resendError.value = null

  try {
    // Get current user's ID token
    const currentUser = auth?.currentUser
    if (!currentUser) {
      throw new Error('กรุณาเข้าสู่ระบบใหม่')
    }

    const idToken = await currentUser.getIdToken()

    // Call API to send verification email
    await $fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    })

    resendSuccess.value = true
    startCooldown()

    // Hide success message after 5 seconds
    setTimeout(() => {
      resendSuccess.value = false
    }, 5000)
  } catch (err: any) {
    console.error('Resend email error:', err)
    resendError.value = err.data?.message || err.message || 'ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่'
  } finally {
    resending.value = false
  }
}

// Cleanup on unmount
onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})
</script>

<style scoped>
/* Floating animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-30px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 10s ease-in-out infinite;
}

/* Envelope container */
.envelope-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.envelope {
  position: relative;
  width: 180px;
  height: 120px;
}

/* Envelope float animation */
@keyframes envelope-float {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
}

.animate-envelope-float {
  animation: envelope-float 4s ease-in-out infinite;
}

/* Envelope back */
.envelope-back {
  position: absolute;
  bottom: 0;
  width: 180px;
  height: 100px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
}

/* Envelope front */
.envelope-front {
  position: absolute;
  bottom: 0;
  width: 180px;
  height: 60px;
  background: linear-gradient(180deg, #818cf8 0%, #6366f1 100%);
  border-radius: 0 0 8px 8px;
  z-index: 3;
}

/* Letter */
.letter {
  position: absolute;
  bottom: 10px;
  left: 15px;
  width: 150px;
  height: 100px;
  background: white;
  border-radius: 4px;
  z-index: 1;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

@keyframes letter-slide {
  0%, 20% { transform: translateY(0); }
  40%, 60% { transform: translateY(-50px); }
  80%, 100% { transform: translateY(0); }
}

.animate-letter-slide {
  animation: letter-slide 3s ease-in-out infinite;
}

.letter-content {
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.letter-lines {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.line {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  margin-bottom: 6px;
}

.line-1 { width: 80%; }
.line-2 { width: 100%; }
.line-3 { width: 60%; }

.letter-check {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: #dcfce7;
  border-radius: 50%;
  margin: 0 auto;
}

@keyframes check-pop {
  0%, 40% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  60%, 100% { transform: scale(1); opacity: 1; }
}

.animate-check-pop {
  animation: check-pop 3s ease-in-out infinite;
}

/* Sparkle animations */
@keyframes sparkle-1 {
  0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
}

@keyframes sparkle-2 {
  0%, 100% { opacity: 0; transform: scale(0.5) translateY(0); }
  50% { opacity: 1; transform: scale(1) translateY(-10px); }
}

@keyframes sparkle-3 {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes sparkle-4 {
  0%, 100% { opacity: 0; transform: rotate(-10deg); }
  50% { opacity: 1; transform: rotate(10deg); }
}

.animate-sparkle-1 {
  animation: sparkle-1 2s ease-in-out infinite;
}

.animate-sparkle-2 {
  animation: sparkle-2 2.5s ease-in-out infinite 0.3s;
}

.animate-sparkle-3 {
  animation: sparkle-3 1.5s ease-in-out infinite 0.6s;
}

.animate-sparkle-4 {
  animation: sparkle-4 3s ease-in-out infinite 0.9s;
}

/* Flying paper planes */
@keyframes plane-fly-1 {
  0% { transform: translate(0, 0) rotate(-45deg); opacity: 0; }
  20% { opacity: 0.5; }
  80% { opacity: 0.5; }
  100% { transform: translate(-100px, -60px) rotate(-45deg); opacity: 0; }
}

@keyframes plane-fly-2 {
  0% { transform: translate(0, 0) rotate(-45deg); opacity: 0; }
  20% { opacity: 0.4; }
  80% { opacity: 0.4; }
  100% { transform: translate(80px, -80px) rotate(-45deg); opacity: 0; }
}

.animate-plane-fly-1 {
  animation: plane-fly-1 4s ease-in-out infinite;
}

.animate-plane-fly-2 {
  animation: plane-fly-2 5s ease-in-out infinite 1s;
}

/* Mobile envelope */
.envelope-mobile {
  animation: envelope-float 4s ease-in-out infinite;
}

/* Transition animations */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.delay-300 {
  animation-delay: 300ms;
}
</style>
