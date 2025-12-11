<template>
  <div class="min-h-screen flex">
    <!-- Left side - Illustration/Branding -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.4&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      </div>

      <!-- Floating elements -->
      <div class="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-float"></div>
      <div class="absolute bottom-32 right-20 w-48 h-48 bg-white/5 rounded-full blur-xl animate-float-delayed"></div>
      <div class="absolute top-1/2 left-10 w-24 h-24 bg-white/5 rounded-full blur-xl animate-float-slow"></div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center items-center w-full px-12">
        <!-- Logo and Brand -->
        <div class="text-center mb-12">
          <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Icon name="lucide:book-heart" class="w-10 h-10 text-white" />
          </div>
          <h1 class="text-4xl font-bold text-white mb-3">บันทึกนิรนาม</h1>
          <p class="text-gray-400 text-lg">พื้นที่ปลอดภัยสำหรับเรื่องราวของคุณ</p>
        </div>

        <!-- Illustration -->
        <div class="relative w-80 h-80 mb-8">
          <!-- Diary illustration -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="relative">
              <!-- Notebook -->
              <div class="w-48 h-64 bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-2xl transform -rotate-3 relative overflow-hidden">
                <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-pink-300"></div>
                <div class="p-6 pl-8">
                  <div class="space-y-3">
                    <div class="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div class="h-2 bg-gray-200 rounded w-full"></div>
                    <div class="h-2 bg-gray-200 rounded w-5/6"></div>
                    <div class="h-2 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div class="mt-6 space-y-3">
                    <div class="h-2 bg-gray-200 rounded w-full"></div>
                    <div class="h-2 bg-gray-200 rounded w-4/5"></div>
                    <div class="h-2 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
              <!-- Pen -->
              <div class="absolute -right-4 top-1/4 w-3 h-32 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full transform rotate-45 shadow-lg">
                <div class="absolute bottom-0 w-3 h-4 bg-yellow-400 rounded-b-full"></div>
              </div>
              <!-- Heart -->
              <div class="absolute -top-4 -right-8 text-4xl animate-bounce-slow">
                <Icon name="lucide:heart" class="w-8 h-8 text-pink-400 fill-pink-400" />
              </div>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="space-y-4 text-gray-300">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Icon name="lucide:shield-check" class="w-4 h-4 text-green-400" />
            </div>
            <span>ปลอดภัย เป็นส่วนตัว ไร้กังวล</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Icon name="lucide:bot" class="w-4 h-4 text-blue-400" />
            </div>
            <span>AI companion คอยรับฟังคุณ</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Icon name="lucide:users" class="w-4 h-4 text-purple-400" />
            </div>
            <span>ชุมชนนิรนามที่เข้าใจ</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - Login Form -->
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
          <h2 class="text-3xl font-bold text-gray-900 mb-2">ยินดีต้อนรับกลับ</h2>
          <p class="text-gray-500">เข้าสู่ระบบเพื่อบันทึกเรื่องราวของคุณ</p>
        </div>

        <!-- Login form card -->
        <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8">
          <!-- Google Sign In -->
          <button
            class="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group"
            @click="onGoogleSignIn"
            :disabled="loading"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span class="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">เข้าสู่ระบบด้วย Google</span>
          </button>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-400">หรือเข้าสู่ระบบด้วยอีเมล</span>
            </div>
          </div>

          <!-- Email Form -->
          <form @submit.prevent="submitEmail" class="space-y-5">
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
                />
              </div>
            </div>

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
                  placeholder="••••••••"
                  class="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Success message (after email verification) -->
            <Transition name="fade">
              <div v-if="verificationMessage" class="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-100">
                <Icon name="lucide:check-circle" class="w-5 h-5 text-green-500 flex-shrink-0" />
                <span class="text-sm text-green-600">{{ verificationMessage }}</span>
              </div>
            </Transition>

            <!-- Error message -->
            <Transition name="fade">
              <div v-if="error" class="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100">
                <Icon name="lucide:alert-circle" class="w-5 h-5 text-red-500 flex-shrink-0" />
                <span class="text-sm text-red-600">{{ error }}</span>
              </div>
            </Transition>

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3.5 px-4 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon v-if="loading" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
              <span v-else>เข้าสู่ระบบ</span>
            </button>
          </form>

          <!-- Sign up link -->
          <p class="mt-6 text-center text-gray-500">
            ยังไม่มีบัญชี?
            <NuxtLink to="/signup" class="font-semibold text-gray-900 hover:underline">
              สมัครสมาชิก
            </NuxtLink>
          </p>
        </div>

        <!-- Footer -->
        <p class="mt-8 text-center text-sm text-gray-400">
          ด้วยการเข้าสู่ระบบ คุณยอมรับ
          <NuxtLink to="/terms" class="text-gray-600 hover:underline">ข้อกำหนดการใช้งาน</NuxtLink>
          และ
          <NuxtLink to="/privacy" class="text-gray-600 hover:underline">นโยบายความเป็นส่วนตัว</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useFirebase } from '~/composables/useFirebase'
import { collection, query, where, limit, getDocs } from 'firebase/firestore'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'เข้าสู่ระบบ - บันทึกนิรนาม',
  meta: [
    {
      name: 'description',
      content: 'เข้าสู่ระบบเพื่อเขียนบันทึกส่วนตัว คุยกับ AI companion และแชร์เรื่องราวกับชุมชนนิรนาม'
    },
    {
      property: 'og:title',
      content: 'เข้าสู่ระบบ - บันทึกนิรนาม'
    },
    {
      property: 'og:description',
      content: 'เข้าสู่ระบบเพื่อเขียนบันทึกส่วนตัวและคุยกับ AI companion'
    }
  ]
})

const { user, signInWithEmail, signInWithGoogle, sendEmailVerification, loading, error } = useAuth()
const { firestore } = useFirebase()
const route = useRoute()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const verificationMessage = ref('')

// Check if redirected after email verification and handle user redirect (client-side only)
onMounted(() => {
  if (route.query.verified === 'true') {
    verificationMessage.value = 'ยืนยันอีเมลเรียบร้อยแล้ว กรุณาเข้าสู่ระบบ'
  }

  // Watch user state for redirect (client-side only to avoid hydration mismatch)
  watch(user, (newUser) => {
    if (newUser) {
      // Check if user logged in with email/password (not Google)
      const isGoogleUser = newUser.providerData?.some(p => p.providerId === 'google.com')

      if (isGoogleUser || newUser.emailVerified) {
        // Google users or verified email users can proceed
        navigateTo('/')
      } else {
        // Email users who haven't verified - redirect to verify page
        navigateTo('/verify-email')
      }
    }
  }, { immediate: true })
})

// Check if user has any posts
const checkUserHasPosts = async (userId: string): Promise<boolean> => {
  if (!firestore) return false

  try {
    const postsQuery = query(
      collection(firestore, 'storyPosts'),
      where('userId', '==', userId),
      limit(1)
    )
    const snapshot = await getDocs(postsQuery)
    return !snapshot.empty
  } catch (err) {
    console.error('Error checking user posts:', err)
    return false
  }
}

const onGoogleSignIn = async () => {
  const cred = await signInWithGoogle()
  if (cred) {
    // Check if user has posts
    const hasPosts = await checkUserHasPosts(cred.user.uid)

    if (hasPosts) {
      // User has posts, go to home
      navigateTo('/')
    } else {
      // New user, go to my-activity
      navigateTo('/my-activity')
    }
  }
}

const submitEmail = async () => {
  const cred = await signInWithEmail(email.value, password.value)
  if (cred) {
    // Check if email is verified (only for email/password login)
    if (!cred.user.emailVerified) {
      // Send verification email and redirect
      await sendEmailVerification()
      navigateTo('/verify-email')
      return
    }

    // Check if user has posts
    const hasPosts = await checkUserHasPosts(cred.user.uid)

    if (hasPosts) {
      // User has posts, go to home
      navigateTo('/')
    } else {
      // New user, go to my-activity
      navigateTo('/my-activity')
    }
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

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
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

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
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
