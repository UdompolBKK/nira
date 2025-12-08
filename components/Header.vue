<template>
  <header style="z-index: 2000;" class="sticky top-0 z-50 bg-white border-b border-gray-200">
    <nav class="mx-auto max-w-full px-4 py-3 md:px-8">
      <div class="flex items-center justify-between">
        <!-- Mobile: Hamburger Menu Button (Left) -->
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

        <!-- Left: Logo + Navigation (Desktop) / Center: Logo (Mobile) -->
        <div class="flex items-center gap-8 md:flex-1">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 md:mr-0 absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none">
            <img src="/nira.png" alt="Nira" class="h-10 w-auto" />
          </NuxtLink>

          <!-- Navigation Links - Desktop Only -->
          <div class="hidden gap-8 md:flex items-center md:ml-8">
            <NuxtLink
              to="/"
              class="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              หน้าหลัก
            </NuxtLink>
            <NuxtLink
              to="/my-activity"
              class="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              บันทึกของฉัน
            </NuxtLink>
            <NuxtLink
              to="/stories"
              class="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              เรื่องราวชีวิต
            </NuxtLink>
            <NuxtLink
              to="/problems"
              class="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              ปัญหาที่ได้รับการระบาย
            </NuxtLink>
            <NuxtLink
              to="/articles"
              class="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              บทความ
            </NuxtLink>
            <NuxtLink
              to="/about"
              class="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              เกี่ยวกับเรา
            </NuxtLink>
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex gap-4 items-center relative z-10">
          <!-- Notification Bell (when logged in) - Desktop Only -->
          <div v-if="user" class="relative hidden md:block">
            <button
              @click="notificationOpen = !notificationOpen"
              class="relative p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50"
              title="การแจ้งเตือน"
            >
              <img src="/alarm.png" alt="Notifications" class="h-6 w-6 object-contain" />
              <!-- Red notification badge with count -->
              <span
                v-if="unreadCount > 0"
                class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
              >
                {{ unreadCount > 99 ? '99+' : unreadCount }}
              </span>
            </button>

            <!-- Notification Dropdown -->
            <Transition name="dropdown">
              <div
                v-if="notificationOpen"
                class="absolute right-0 mt-2 w-80 md:w-96 rounded-xl bg-white shadow-xl border border-gray-200 max-h-[500px] overflow-hidden z-50"
                @click.stop
              >
                <!-- Header -->
                <div class="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                  <h3 class="font-semibold text-gray-900">การแจ้งเตือน</h3>
                  <button
                    v-if="unreadCount > 0"
                    @click="markAllAsRead"
                    class="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    อ่านทั้งหมด
                  </button>
                </div>

                <!-- Loading State -->
                <div v-if="notificationsLoading" class="p-8 text-center">
                  <Icon name="lucide:loader-2" class="w-8 h-8 mx-auto mb-2 text-gray-400 animate-spin" />
                  <p class="text-sm text-gray-500">กำลังโหลด...</p>
                </div>

                <!-- Notifications List -->
                <div v-else-if="notifications.length > 0" class="divide-y divide-gray-100 overflow-y-auto max-h-[420px]">
                  <NuxtLink
                    v-for="notif in notifications"
                    :key="notif.id"
                    :to="notif.actionUrl || '#'"
                    @click="handleNotificationClick(notif)"
                    :class="[
                      'block p-4 hover:bg-gray-50 transition-colors cursor-pointer',
                      !notif.read ? 'bg-blue-50' : ''
                    ]"
                  >
                    <div class="flex gap-3">
                      <!-- Icon/Avatar -->
                      <div
                        v-if="notif.fromUserPhoto"
                        class="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex-shrink-0 overflow-hidden"
                      >
                        <img :src="notif.fromUserPhoto" :alt="notif.fromUserName" class="w-full h-full object-cover" />
                      </div>
                      <div
                        v-else
                        class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        :class="getNotificationIconClass(notif.type)"
                      >
                        <Icon :name="getNotificationIcon(notif.type)" class="w-5 h-5 text-white" />
                      </div>

                      <!-- Content -->
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-gray-900 font-medium mb-1">{{ notif.title }}</p>
                        <p class="text-sm text-gray-600">{{ notif.message }}</p>
                        <p class="text-xs text-gray-500 mt-1">{{ formatNotificationTime(notif.createdAt) }}</p>
                      </div>

                      <!-- Unread indicator -->
                      <div v-if="!notif.read" class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    </div>
                  </NuxtLink>
                </div>

                <!-- Empty state -->
                <div v-else class="p-12 text-center text-gray-500">
                  <Icon name="lucide:bell-off" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p class="text-sm font-medium text-gray-700">ไม่มีการแจ้งเตือน</p>
                  <p class="text-xs text-gray-500 mt-1">เมื่อมีคนกดไชน์หรือแสดงความคิดเห็น คุณจะได้รับการแจ้งเตือนที่นี่</p>
                </div>
              </div>
            </Transition>
          </div>

          <!-- If logged in: show account menu (Mobile: photo + arrow only, Desktop: photo + name + arrow) -->
          <div v-if="user" class="relative">
            <button
              @click="accountMenuOpen = !accountMenuOpen"
              class="flex items-center gap-2 px-2 md:px-3 py-2 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-0"
            >
              <img v-if="profile?.photoURL" :src="profile.photoURL" alt="avatar" class="h-8 w-8 rounded-full object-cover" />
              <div v-else class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600">
                {{ displayName.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm font-medium hidden md:block">{{ displayName }}</span>
              <Icon name="lucide:chevron-down" class="w-4 h-4 text-gray-500" />
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
                จัดการบัญชี
              </NuxtLink>
              <NuxtLink
                to="/my-activity"
                class="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
                @click="accountMenuOpen = false"
              >
                เขียนบันทึก
              </NuxtLink>
              <!-- Admin Menu (Super Admin only) -->
              <NuxtLink
                v-if="isSuperAdmin"
                to="/admin"
                class="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 border-t border-gray-100"
                @click="accountMenuOpen = false"
              >
                ระบบหลังบ้าน
              </NuxtLink>
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-b-lg border-t border-gray-100"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>

          <!-- If not logged in: show login button on mobile (right side) -->
          <NuxtLink
            v-else-if="!authLoading"
            to="/login"
            class="rounded-lg bg-black px-4 md:px-6 py-2 font-medium text-white hover:bg-gray-900 transition-colors focus:outline-none focus:ring-0 text-sm md:text-base"
            style="color: #fff"
          >
            เข้าสู่ระบบ
          </NuxtLink>

          <!-- Loading state while auth initializes -->
          <div v-else class="h-9 w-20 md:w-32 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="mobileMenuOpen"
        class="mt-4 space-y-3 border-t pt-4 md:hidden"
      >
        <!-- Navigation Links -->
        <NuxtLink
          to="/"
          class="block rounded-lg px-6 py-2 font-medium text-gray-900 hover:bg-gray-50 transition-colors"
          @click="mobileMenuOpen = false"
        >
          หน้าหลัก
        </NuxtLink>
        <NuxtLink
          to="/my-activity"
          class="block rounded-lg px-6 py-2 font-medium text-gray-900 hover:bg-gray-50 transition-colors"
          @click="mobileMenuOpen = false"
        >
          บันทึกของฉัน
        </NuxtLink>
        <NuxtLink
          to="/browse"
          class="block rounded-lg px-6 py-2 font-medium text-gray-900 hover:bg-gray-50 transition-colors"
          @click="mobileMenuOpen = false"
        >
          เรื่องราวของคนอื่น
        </NuxtLink>
        <NuxtLink
          to="/articles"
          class="block rounded-lg px-6 py-2 font-medium text-gray-900 hover:bg-gray-50 transition-colors"
          @click="mobileMenuOpen = false"
        >
          บทความ
        </NuxtLink>
        <NuxtLink
          to="/about"
          class="block rounded-lg px-6 py-2 font-medium text-gray-900 hover:bg-gray-50 transition-colors"
          @click="mobileMenuOpen = false"
        >
          เกี่ยวกับเรา
        </NuxtLink>

        <!-- Auth Section (for logged in users only) -->
        <template v-if="user">
          <!-- Divider -->
          <div class="border-t pt-3"></div>

          <NuxtLink
            to="/account"
            class="block rounded-lg px-6 py-2 font-medium text-gray-900 hover:bg-gray-50 transition-colors"
            @click="mobileMenuOpen = false"
          >
            จัดการบัญชี
          </NuxtLink>
          <button
            @click="handleLogout"
            class="w-full text-left rounded-lg px-6 py-2 font-medium text-red-600 hover:bg-gray-50 transition-colors"
          >
            ออกจากระบบ
          </button>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useNotifications } from '~/composables/useNotifications'

const mobileMenuOpen = ref(false)
const accountMenuOpen = ref(false)
const notificationOpen = ref(false)
const { user, logout, isSuperAdmin, loading: authLoading } = useAuth()
const { notifications, unreadCount, loading: notificationsLoading, subscribeToNotifications, markAsRead, markAllAsRead } = useNotifications()

// Profile state - reactive to user changes
const profile = ref<{ displayName?: string; photoURL?: string; slug?: string } | null>(null)

// Subscribe to notifications when user is logged in
let unsubscribeNotifications: (() => void) | null = null
watch(() => user.value?.uid, (uid) => {
  if (uid) {
    unsubscribeNotifications = subscribeToNotifications()
  } else {
    if (unsubscribeNotifications) {
      unsubscribeNotifications()
      unsubscribeNotifications = null
    }
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (unsubscribeNotifications) {
    unsubscribeNotifications()
  }
})

// Load profile using API
const loadProfile = async () => {
  if (!user.value?.uid) {
    profile.value = null
    return
  }

  try {
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) return

    const token = await firebaseUser.getIdToken()

    const response = await $fetch<{ profile: any; exists: boolean }>('/api/user/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.exists && response.profile) {
      profile.value = response.profile
    } else {
      profile.value = null
    }
  } catch (err) {
    console.error('[Header] Error loading profile:', err)
    profile.value = null
  }
}

// Load profile when user changes
watch(() => user.value?.uid, async (uid) => {
  if (uid) {
    await loadProfile()
  } else {
    profile.value = null
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

// Notification helpers
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'like': return 'lucide:heart'
    case 'comment': return 'lucide:message-circle'
    case 'friend_request': return 'lucide:user-plus'
    case 'friend_accept': return 'lucide:user-check'
    case 'system': return 'lucide:bell'
    default: return 'lucide:bell'
  }
}

const getNotificationIconClass = (type: string) => {
  switch (type) {
    case 'like': return 'bg-gradient-to-br from-pink-400 to-rose-500'
    case 'comment': return 'bg-gradient-to-br from-blue-400 to-indigo-500'
    case 'friend_request': return 'bg-gradient-to-br from-purple-400 to-violet-500'
    case 'friend_accept': return 'bg-gradient-to-br from-green-400 to-emerald-500'
    case 'system': return 'bg-gradient-to-br from-gray-400 to-gray-500'
    default: return 'bg-gradient-to-br from-gray-400 to-gray-500'
  }
}

const formatNotificationTime = (timestamp: any) => {
  if (!timestamp) return 'เมื่อสักครู่'

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
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

const handleNotificationClick = async (notif: any) => {
  notificationOpen.value = false

  // Mark as read
  if (!notif.read) {
    await markAsRead(notif.id)
  }
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
