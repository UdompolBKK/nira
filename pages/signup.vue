<template>
  <div class="min-h-screen flex items-center justify-center bg-primary-50 px-4 py-20">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <h1 class="mb-4 text-2xl font-bold text-primary-900">สมัครสมาชิก</h1>
      <p class="mb-6 text-sm text-primary-600">สร้างบัญชีด้วยอีเมลและรหัสผ่าน</p>

      <div class="space-y-4">
        <button
          class="w-full rounded-lg border-2 border-gray-800 bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center google-btn"
          @click="onGoogleSignUp"
          :disabled="loading"
        >
          <svg class="mr-3 h-5 w-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          สมัครสมาชิกด้วย Google
        </button>

        <div class="flex items-center justify-center text-sm text-gray-400">หรือ</div>

        <form @submit.prevent="submit">
          <div class="mb-3">
            <label class="mb-1 block text-sm font-medium text-primary-700">อีเมล</label>
            <input v-model="email" type="email" required class="w-full rounded-lg border border-gray-200 px-3 py-2" />
          </div>

          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-primary-700">รหัสผ่าน</label>
            <input v-model="password" type="password" required class="w-full rounded-lg border border-gray-200 px-3 py-2" />
          </div>

          <div class="flex items-center justify-between">
            <button type="submit" class="rounded-lg bg-gray-800 px-6 py-2 font-semibold text-white hover:bg-gray-900 transition-colors" :disabled="loading">สร้างบัญชี</button>
            <NuxtLink to="/login" class="text-sm text-gray-700 hover:underline">กลับไปเข้าสู่ระบบ</NuxtLink>
          </div>

          <div v-if="error" class="rounded border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 mt-4">{{ error }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
const { user, signUpWithEmail, signInWithGoogle, loading, error } = useAuth()

const email = ref('')
const password = ref('')

// Redirect to home if already logged in
watchEffect(() => {
  if (user.value) {
    navigateTo('/')
  }
})

const submit = async () => {
  const cred = await signUpWithEmail(email.value, password.value)
  if (cred) {
    navigateTo('/editor')
  }
}


const onGoogleSignUp = async () => {
  const cred = await signInWithGoogle()
  if (cred) {
    navigateTo('/editor')
  }
}
</script>
<style scoped>
.google-btn {
  border: 2px solid #27272a !important;
}
</style>
