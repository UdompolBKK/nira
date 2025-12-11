<template>
  <div class="min-h-screen flex">
    <!-- Left side - Illustration/Branding -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.4&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      </div>

      <!-- Floating elements -->
      <div class="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-float"></div>
      <div class="absolute bottom-32 left-20 w-48 h-48 bg-white/5 rounded-full blur-xl animate-float-delayed"></div>
      <div class="absolute top-1/2 right-10 w-24 h-24 bg-white/5 rounded-full blur-xl animate-float-slow"></div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center items-center w-full px-12">
        <!-- Logo and Brand -->
        <div class="text-center mb-12">
          <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Icon name="lucide:book-heart" class="w-10 h-10 text-white" />
          </div>
          <h1 class="text-4xl font-bold text-white mb-3">บันทึกนิรนาม</h1>
          <p class="text-gray-400 text-lg">เริ่มต้นการเดินทางของคุณวันนี้</p>
        </div>

        <!-- Illustration - Person writing -->
        <div class="relative w-80 h-72 mb-8">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="relative">
              <!-- Person silhouette -->
              <div class="relative">
                <!-- Desk -->
                <div class="w-64 h-3 bg-white/20 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"></div>

                <!-- Laptop/Book -->
                <div class="absolute bottom-3 left-1/2 -translate-x-1/2">
                  <div class="w-40 h-28 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-xl relative overflow-hidden">
                    <!-- Screen glow -->
                    <div class="absolute inset-2 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded"></div>
                    <!-- Text lines on screen -->
                    <div class="absolute inset-4 space-y-2">
                      <div class="h-1.5 bg-white/30 rounded w-3/4"></div>
                      <div class="h-1.5 bg-white/20 rounded w-full"></div>
                      <div class="h-1.5 bg-white/20 rounded w-5/6"></div>
                      <div class="h-1.5 bg-white/15 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>

                <!-- Stars/sparkles -->
                <div class="absolute -top-8 -right-4 animate-pulse">
                  <Icon name="lucide:sparkles" class="w-6 h-6 text-yellow-400" />
                </div>
                <div class="absolute top-0 -left-8 animate-pulse delay-300">
                  <Icon name="lucide:star" class="w-4 h-4 text-yellow-300" />
                </div>
                <div class="absolute -top-4 left-1/2 animate-pulse delay-500">
                  <Icon name="lucide:heart" class="w-5 h-5 text-pink-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Benefits -->
        <div class="space-y-4 text-gray-300">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Icon name="lucide:pencil" class="w-4 h-4 text-amber-400" />
            </div>
            <span>เขียนบันทึกส่วนตัวได้ไม่จำกัด</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Icon name="lucide:lock" class="w-4 h-4 text-green-400" />
            </div>
            <span>ข้อมูลปลอดภัย เข้ารหัสทุกข้อความ</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Icon name="lucide:heart-handshake" class="w-4 h-4 text-pink-400" />
            </div>
            <span>ชุมชนที่เข้าใจและรับฟัง</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - Registration Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
      <div class="w-full max-w-md">
        <!-- Mobile logo -->
        <div class="lg:hidden text-center mb-8">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-900 flex items-center justify-center">
            <Icon name="lucide:book-heart" class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900">บันทึกนิรนาม</h1>
        </div>

        <!-- Welcome text -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">สร้างบัญชีใหม่</h2>
          <p class="text-gray-500">เริ่มเขียนบันทึกของคุณได้ฟรี</p>
        </div>

        <!-- Registration form card -->
        <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8">
          <form @submit.prevent="submit" class="space-y-5">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">อีเมล</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Icon name="lucide:mail" class="w-5 h-5 text-gray-400" />
                </div>
                <input
                  v-model="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                  :class="{ 'border-red-300 focus:border-red-400': emailError }"
                />
              </div>
              <p v-if="emailError" class="mt-1 text-xs text-red-500">{{ emailError }}</p>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">รหัสผ่าน</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Icon name="lucide:lock" class="w-5 h-5 text-gray-400" />
                </div>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  class="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                  :class="{ 'border-red-300 focus:border-red-400': passwordError }"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-5 h-5" />
                </button>
              </div>
              <!-- Password strength indicator -->
              <div class="mt-2">
                <div class="flex gap-1">
                  <div
                    v-for="i in 4"
                    :key="i"
                    class="h-1 flex-1 rounded-full transition-colors"
                    :class="getPasswordStrengthColor(i)"
                  ></div>
                </div>
                <p class="text-xs mt-1" :class="passwordStrengthTextColor">
                  {{ passwordStrengthText }}
                </p>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">ยืนยันรหัสผ่าน</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Icon name="lucide:lock-keyhole" class="w-5 h-5 text-gray-400" />
                </div>
                <input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  class="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                  :class="{
                    'border-red-300 focus:border-red-400': confirmPasswordError,
                    'border-green-300 focus:border-green-400': confirmPassword && !confirmPasswordError && confirmPassword === password
                  }"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icon :name="showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-5 h-5" />
                </button>
              </div>
              <p v-if="confirmPasswordError" class="mt-1 text-xs text-red-500">{{ confirmPasswordError }}</p>
              <p v-else-if="confirmPassword && confirmPassword === password" class="mt-1 text-xs text-green-500 flex items-center gap-1">
                <Icon name="lucide:check" class="w-3 h-3" />
                รหัสผ่านตรงกัน
              </p>
            </div>

            <!-- Terms agreement -->
            <div class="flex items-start gap-3">
              <input
                v-model="acceptTerms"
                type="checkbox"
                id="terms"
                class="mt-1 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
              />
              <label for="terms" class="text-sm text-gray-600">
                ฉันยอมรับ
                <NuxtLink to="/terms" class="text-gray-900 hover:underline">ข้อกำหนดการใช้งาน</NuxtLink>
                และ
                <NuxtLink to="/privacy" class="text-gray-900 hover:underline">นโยบายความเป็นส่วนตัว</NuxtLink>
              </label>
            </div>

            <!-- Error message -->
            <Transition name="fade">
              <div v-if="localError" class="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100">
                <Icon name="lucide:alert-circle" class="w-5 h-5 text-red-500 flex-shrink-0" />
                <span class="text-sm text-red-600">{{ localError }}</span>
              </div>
            </Transition>

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="isSubmitting || !canSubmit"
              class="w-full py-3.5 px-4 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon v-if="isSubmitting" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
              <span v-else>สร้างบัญชี</span>
            </button>
          </form>

          <!-- Login link -->
          <p class="mt-6 text-center text-gray-500">
            มีบัญชีอยู่แล้ว?
            <NuxtLink to="/login" class="font-semibold text-gray-900 hover:underline">
              เข้าสู่ระบบ
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { signInWithCustomToken } from 'firebase/auth'
import { useAuth } from '~/composables/useAuth'
import { useUserProfile } from '~/composables/useUserProfile'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'สมัครสมาชิก - บันทึกนิรนาม',
  meta: [
    {
      name: 'description',
      content: 'สร้างบัญชีฟรี เริ่มเขียนบันทึกนิรนาม คุยกับ AI companion และเชื่อมต่อกับชุมชนที่ปลอดภัย แพลตฟอร์มบันทึกความรู้สึกส่วนตัว'
    },
    { property: 'og:title', content: 'สมัครสมาชิก - บันทึกนิรนาม' },
    {
      property: 'og:description',
      content: 'สร้างบัญชีฟรี เริ่มเขียนบันทึกนิรนาม คุยกับ AI companion'
    },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'สมัครสมาชิก - บันทึกนิรนาม' },
    { name: 'twitter:description', content: 'สร้างบัญชีฟรี เริ่มเขียนบันทึกนิรนาม' }
  ]
})

const { user } = useAuth()
const { isEmailVerified } = useUserProfile()
const { auth } = useFirebase()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const acceptTerms = ref(false)

// Validation
const emailError = computed(() => {
  if (!email.value) return null
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) return 'รูปแบบอีเมลไม่ถูกต้อง'
  return null
})

const passwordError = computed(() => {
  if (!password.value) return null
  if (password.value.length < 6) return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
  return null
})

const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return null
  if (confirmPassword.value !== password.value) return 'รหัสผ่านไม่ตรงกัน'
  return null
})

// Password strength
const passwordStrength = computed(() => {
  if (!password.value) return 0
  let strength = 0
  if (password.value.length >= 6) strength++
  if (password.value.length >= 8) strength++
  if (/[A-Z]/.test(password.value) && /[a-z]/.test(password.value)) strength++
  if (/[0-9]/.test(password.value) || /[^A-Za-z0-9]/.test(password.value)) strength++
  return strength
})

const getPasswordStrengthColor = (index: number) => {
  if (!password.value) return 'bg-gray-200'
  if (index <= passwordStrength.value) {
    if (passwordStrength.value === 1) return 'bg-red-400'
    if (passwordStrength.value === 2) return 'bg-yellow-400'
    if (passwordStrength.value === 3) return 'bg-blue-400'
    if (passwordStrength.value === 4) return 'bg-green-400'
  }
  return 'bg-gray-200'
}

const passwordStrengthText = computed(() => {
  if (!password.value) return ''
  if (passwordStrength.value === 1) return 'รหัสผ่านอ่อนมาก'
  if (passwordStrength.value === 2) return 'รหัสผ่านปานกลาง'
  if (passwordStrength.value === 3) return 'รหัสผ่านดี'
  if (passwordStrength.value === 4) return 'รหัสผ่านแข็งแรง'
  return ''
})

const passwordStrengthTextColor = computed(() => {
  if (passwordStrength.value === 1) return 'text-red-500'
  if (passwordStrength.value === 2) return 'text-yellow-600'
  if (passwordStrength.value === 3) return 'text-blue-500'
  if (passwordStrength.value === 4) return 'text-green-500'
  return 'text-gray-400'
})

const canSubmit = computed(() => {
  return email.value &&
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value &&
    password.value.length >= 6 &&
    !emailError.value &&
    acceptTerms.value
})

// Redirect to home if already logged in and email verified (client-side only)
// Only redirect if user was already logged in before visiting signup page
onMounted(() => {
  // Check once on mount - if user is already logged in and verified, redirect
  if (user.value && isEmailVerified.value) {
    navigateTo('/')
  }
})

const isSubmitting = ref(false)
const localError = ref<string | null>(null)

const submit = async () => {
  if (!canSubmit.value || isSubmitting.value) return

  isSubmitting.value = true
  localError.value = null

  try {
    // Step 1: Create user via API (creates user in Firebase Auth + Firestore)
    const signupResponse = await $fetch('/api/auth/signup', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    if (!signupResponse.success || !signupResponse.customToken) {
      throw new Error('ไม่สามารถสร้างบัญชีได้')
    }

    // Step 2: Sign in with custom token
    if (!auth) {
      throw new Error('ไม่สามารถเชื่อมต่อระบบได้')
    }

    await signInWithCustomToken(auth, signupResponse.customToken)

    // Step 3: Send verification email via API
    const currentUser = auth.currentUser
    if (currentUser) {
      const idToken = await currentUser.getIdToken()

      try {
        await $fetch('/api/auth/send-verification', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        })
      } catch (emailError) {
        // Don't fail signup if email fails - user can resend from verify page
        console.warn('Failed to send verification email:', emailError)
      }
    }

    // Step 4: Redirect to verify email page
    console.log('Signup success, redirecting to /verify-email...')
    return navigateTo('/verify-email', { replace: true })
  } catch (err: any) {
    console.error('Signup error:', err)
    localError.value = err.data?.message || err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
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

.delay-300 {
  animation-delay: 300ms;
}

.delay-500 {
  animation-delay: 500ms;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
