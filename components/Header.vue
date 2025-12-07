<template>
  <header class="sticky top-0 z-50 bg-white shadow-sm">
    <nav class="mx-auto max-w-full px-4 py-4 md:px-8">
      <div class="flex items-center justify-between">
        <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 text-2xl font-bold">
            <span class="text-2xl">📔</span>
          </NuxtLink>

        <!-- Navigation Links -->
        <div class="hidden gap-6 md:flex">
        </div>

        <!-- Auth Buttons -->
        <div class="flex gap-3 items-center relative">
          <!-- If logged in: show account menu -->
          <div v-if="user" class="relative">
            <button
              @click="accountMenuOpen = !accountMenuOpen"
              class="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-0"
            >
              <img v-if="profile?.photoURL" :src="profile.photoURL" alt="avatar" class="h-7 w-7 rounded-full object-cover" />
              <div v-else class="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">P</div>
              <span class="text-sm font-medium">{{ displayName }}</span>
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown menu -->
            <div
              v-if="accountMenuOpen"
              class="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200"
            >
              <NuxtLink
                to="/account"
                class="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 rounded-t-lg"
                @click="accountMenuOpen = false"
              >
                ⚙️ จัดการบัญชี
              </NuxtLink>
              <NuxtLink
                to="/editor"
                class="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
                @click="accountMenuOpen = false"
              >
                ✍️ เขียนบันทึก
              </NuxtLink>
              <NuxtLink
                to="/chat"
                class="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
                @click="accountMenuOpen = false"
              >
                🤖 คุยกับ AI
              </NuxtLink>
              <!-- Admin Menu (Super Admin only) -->
              <NuxtLink
                v-if="isSuperAdmin"
                to="/admin"
                class="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 border-t border-gray-100"
                @click="accountMenuOpen = false"
              >
                🛠️ AI Bot Admin
              </NuxtLink>
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-b-lg"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>

          <!-- If not logged in: show login/signup (but only after auth loading is complete) -->
          <template v-else-if="!authLoading">
            <NuxtLink
              to="/signup"
              class="rounded-lg border-2 border-gray-900 px-6 py-2 font-medium text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-0"
            >
              สมัครสมาชิก
            </NuxtLink>

            <NuxtLink
              to="/login"
              class="rounded-lg bg-black px-6 py-2 font-medium text-white hover:bg-gray-900 transition-colors focus:outline-none focus:ring-0"
              style="color: #fff"
            >
              เข้าสู่ระบบ
            </NuxtLink>
          </template>

          <!-- Loading state while auth initializes -->
          <div v-else class="h-9 w-32 bg-gray-100 rounded-lg animate-pulse"></div>

          <!-- Mobile Menu Button -->
          <button
            class="inline-flex items-center justify-center rounded-lg bg-gray-100 p-2 text-gray-700 md:hidden"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="mobileMenuOpen"
        class="mt-4 space-y-3 border-t pt-4 md:hidden"
      >
        <template v-if="user">
          <NuxtLink
            to="/editor"
            class="block rounded-lg px-6 py-2 font-medium text-gray-900 hover:bg-gray-50 transition-colors"
            @click="mobileMenuOpen = false"
          >
            ✍️ เขียนบันทึก
          </NuxtLink>
          <button
            @click="handleLogout"
            class="w-full text-left rounded-lg px-6 py-2 font-medium text-red-600 hover:bg-gray-50 transition-colors"
          >
            ออกจากระบบ
          </button>
        </template>
        <template v-else>
          <NuxtLink
            to="/signup"
            class="block rounded-lg border-2 border-gray-900 px-6 py-2 font-medium text-gray-900 hover:bg-gray-50 transition-colors text-center focus:outline-none focus:ring-0"
            @click="mobileMenuOpen = false"
          >
            สมัครสมาชิก
          </NuxtLink>
          <NuxtLink
            to="/login"
            class="block rounded-lg bg-black px-6 py-2 font-medium text-white hover:bg-gray-900 transition-colors text-center focus:outline-none focus:ring-0"
            @click="mobileMenuOpen = false"
          >
            เข้าสู่ระบบ
          </NuxtLink>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const mobileMenuOpen = ref(false)
const accountMenuOpen = ref(false)
const { user, logout, isSuperAdmin, loading: authLoading } = useAuth()

// Profile state - reactive to user changes
const profile = ref<{ displayName?: string; photoURL?: string } | null>(null)

// Load profile when user changes
watch(() => user.value?.uid, async (uid) => {
  if (!uid) {
    profile.value = null
    return
  }

  try {
    const { firestore } = useFirebase()
    const { doc, onSnapshot } = await import('firebase/firestore')
    const docRef = doc(firestore, 'users', uid)

    // Use realtime listener for instant updates
    onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        profile.value = snap.data() as any
      } else {
        profile.value = null
      }
    })
  } catch (err) {
    console.error('Error loading profile:', err)
  }
}, { immediate: true })

// Display name: prefer displayName from profile, fallback to email
const displayName = computed(() => {
  if (profile.value?.displayName) {
    return profile.value.displayName
  }
  // Fallback: show first part of email or 'ผู้ใช้'
  const email = user.value?.email
  if (email) {
    return email.split('@')[0]
  }
  return 'ผู้ใช้'
})

const handleLogout = async () => {
  await logout()
  accountMenuOpen.value = false
  mobileMenuOpen.value = false
  profile.value = null
  navigateTo('/login')
}
</script>
