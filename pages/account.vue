<template>
  <div class="min-h-screen bg-gray-50 px-4 py-8">
    <div class="mx-auto max-w-xl">
      <!-- Setup Required Alert -->
      <Transition name="fade">
        <div v-if="isSetupRequired" class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <div class="flex gap-3">
            <div class="flex-shrink-0">
              <Icon name="lucide:shield-alert" class="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 class="font-semibold text-amber-800 mb-1">กรุณาตั้งชื่อปลอมก่อนใช้งาน</h3>
              <p class="text-sm text-amber-700 leading-relaxed">
                เพื่อปกป้องความเป็นส่วนตัวของคุณ Nira ขอให้ใช้ <strong>ชื่อปลอม</strong> และ <strong>รูปที่ไม่เปิดเผยตัวตน</strong>
              </p>
              <p class="text-sm text-amber-700 mt-2 leading-relaxed">
                <strong>ห้ามใช้ชื่อจริง</strong> เพราะบันทึกของคุณอาจถูกแชร์หรือแสดงต่อผู้อื่น การใช้ชื่อปลอมช่วยให้คุณเขียนเรื่องราวได้อย่างอิสระโดยไม่ต้องกังวล
              </p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Header -->
      <div class="mb-6">
        <NuxtLink
          v-if="!isSetupRequired"
          to="/"
          class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          กลับหน้าหลัก
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isSetupRequired ? 'สร้างตัวตนปลอมของคุณ' : 'จัดการบัญชี' }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ isSetupRequired ? 'ตั้งชื่อและรูปที่จะใช้แทนตัวคุณใน Nira' : 'ตั้งค่าโปรไฟล์สาธารณะของคุณ' }}
        </p>
      </div>

      <!-- Tab Menu (only show when not setup required) -->
      <div v-if="!isSetupRequired" class="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="flex border-b border-gray-100">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 py-4 px-4 text-sm font-medium transition-all relative',
              activeTab === tab.id
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <Icon :name="tab.icon" class="w-4 h-4" />
              <span class="hidden sm:inline">{{ tab.label }}</span>
            </div>
            <!-- Active indicator -->
            <div
              v-if="activeTab === tab.id"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
            />
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-400 mx-auto" />
        <p class="text-sm text-gray-500 mt-3">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Tab 1: Profile Form (ข้อมูลทั่วไป) -->
      <div v-else-if="activeTab === 'profile' || isSetupRequired" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Avatar Section -->
        <div class="p-6 border-b border-gray-100 bg-gradient-to-br from-purple-50 to-pink-50">
          <div class="flex flex-col items-center">
            <div class="relative group">
              <div class="w-28 h-28 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg">
                <img
                  v-if="previewUrl || profile?.photoURL"
                  :src="previewUrl || profile?.photoURL"
                  alt="avatar"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Icon name="lucide:user" class="w-12 h-12 text-gray-400" />
                </div>
              </div>

              <!-- Upload overlay -->
              <label class="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                <Icon name="lucide:camera" class="w-6 h-6 text-white" />
                <input
                  type="file"
                  @change="onFileChange"
                  accept="image/*"
                  class="hidden"
                />
              </label>
            </div>

            <p class="text-xs text-gray-500 mt-3">คลิกที่รูปเพื่อเปลี่ยน</p>
            <p class="text-xs text-purple-600 mt-1 max-w-[200px] text-center">
              เพื่อความเป็นส่วนตัว แนะนำให้ใช้รูปและชื่อที่ไม่เปิดเผยตัวตน
            </p>
          </div>
        </div>

        <!-- Form Fields -->
        <div class="p-6 space-y-5">
          <!-- Display Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              <Icon name="lucide:user" class="w-4 h-4 inline mr-1" />
              ชื่อที่แสดง
            </label>
            <input
              v-model="displayName"
              type="text"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              placeholder="เช่น น้องนิรา"
            />
            <p class="text-xs text-gray-400 mt-1">ชื่อนี้จะแสดงให้คนอื่นเห็น ควรใช้เป็นชื่อปลอมทั้งหมด</p>
          </div>

          <!-- Slug -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              <Icon name="lucide:at-sign" class="w-4 h-4 inline mr-1" />
              ชื่อที่ใช้เป็น URL โปรไฟล์
            </label>
            <div class="flex">
              <span class="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-500 text-sm">
                @
              </span>
              <input
                v-model="slug"
                type="text"
                class="flex-1 rounded-r-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="username"
                @input="onSlugInput($event)"
              />
            </div>
            <p v-if="slugError" class="text-xs text-red-500 mt-1">{{ slugError }}</p>
            <p v-else-if="slugChecking" class="text-xs text-gray-400 mt-1">
              <Icon name="lucide:loader-2" class="w-3 h-3 inline animate-spin" />
              กำลังตรวจสอบ...
            </p>
            <p v-else-if="slugAvailable && slug" class="text-xs text-green-500 mt-1">
              <Icon name="lucide:check-circle" class="w-3 h-3 inline" />
              @{{ sanitizedSlug }} ใช้ได้
            </p>
            <p v-else class="text-xs text-gray-400 mt-1">ใช้เป็น URL โปรไฟล์ของคุณ</p>
          </div>

          <!-- About Me -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              <Icon name="lucide:file-text" class="w-4 h-4 inline mr-1" />
              เกี่ยวกับฉัน
            </label>
            <textarea
              v-model="aboutMe"
              rows="3"
              maxlength="300"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              placeholder="บอกเล่าเรื่องราวสั้นๆ เกี่ยวกับตัวคุณ..."
            ></textarea>
            <p class="text-xs text-gray-400 mt-1 flex justify-between">
              <span>ข้อความสั้นๆ ที่แสดงในโปรไฟล์ของคุณ</span>
              <span :class="aboutMe.length >= 280 ? 'text-amber-500' : ''">{{ aboutMe.length }}/300</span>
            </p>
          </div>

          <!-- Email (readonly) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              <Icon name="lucide:mail" class="w-4 h-4 inline mr-1" />
              อีเมล
            </label>
            <input
              :value="user?.email || ''"
              type="email"
              disabled
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-500 bg-gray-50"
            />
            <p class="text-xs text-gray-400 mt-1">อีเมลไม่สามารถเปลี่ยนได้</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="p-6 bg-gray-50 border-t border-gray-100">
          <div class="flex items-center gap-3">
            <button
              @click="save"
              :disabled="saving || !canSave"
              class="flex-1 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <Icon v-if="saving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <span>{{ saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง' }}</span>
            </button>
          </div>

          <!-- Success message -->
          <Transition name="fade">
            <div v-if="message" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 flex items-center gap-2">
              <Icon name="lucide:check-circle" class="w-4 h-4" />
              {{ message }}
            </div>
          </Transition>

          <!-- Error message -->
          <Transition name="fade">
            <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
              <Icon name="lucide:alert-circle" class="w-4 h-4" />
              {{ error }}
            </div>
          </Transition>
        </div>
      </div>

      <!-- Tab 2: Friends (เพื่อนของฉัน) -->
      <div v-else-if="activeTab === 'friends'" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">เพื่อนของฉัน</h3>

          <!-- Friend Requests Section -->
          <div v-if="friendRequests.length > 0" class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Icon name="lucide:user-plus" class="w-4 h-4" />
              คำขอเป็นเพื่อน ({{ friendRequests.length }})
            </h4>
            <div class="space-y-3">
              <div
                v-for="request in friendRequests"
                :key="request.id"
                class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <!-- Sender Photo -->
                <img
                  v-if="request.senderPhoto"
                  :src="request.senderPhoto"
                  :alt="request.senderName"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div
                  v-else
                  class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold"
                >
                  {{ request.senderName?.charAt(0) || 'U' }}
                </div>

                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900">{{ request.senderName || 'ผู้ใช้' }}</p>
                  <p class="text-xs text-gray-500">ขอเป็นเพื่อนกับคุณ</p>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="acceptFriend(request)"
                    :disabled="processingRequest === request.id"
                    class="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-50"
                  >
                    รับ
                  </button>
                  <button
                    @click="rejectFriend(request)"
                    :disabled="processingRequest === request.id"
                    class="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg font-medium hover:bg-gray-300 transition-all disabled:opacity-50"
                  >
                    ปฏิเสธ
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Friends List -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Icon name="lucide:users" class="w-4 h-4" />
              เพื่อนทั้งหมด ({{ friends.length }})
            </h4>
            <div v-if="loadingFriends" class="text-center py-8">
              <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400 mx-auto" />
            </div>
            <div v-else-if="friends.length === 0" class="text-center py-12">
              <Icon name="lucide:user-x" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-sm text-gray-500">ยังไม่มีเพื่อน</p>
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="friend in friends"
                :key="friend.id"
                class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <NuxtLink :to="friend.slug ? `/users/${friend.slug}` : '#'" class="flex-shrink-0">
                  <img
                    v-if="friend.photoURL"
                    :src="friend.photoURL"
                    :alt="friend.displayName"
                    class="w-12 h-12 rounded-full object-cover hover:ring-2 hover:ring-purple-300 transition-all"
                  />
                  <div
                    v-else
                    class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold hover:ring-2 hover:ring-purple-300 transition-all"
                  >
                    {{ friend.displayName?.charAt(0) || 'U' }}
                  </div>
                </NuxtLink>
                <div class="flex-1 min-w-0">
                  <NuxtLink
                    :to="friend.slug ? `/users/${friend.slug}` : '#'"
                    class="font-medium text-gray-900 hover:text-purple-600 transition-colors"
                  >
                    {{ friend.displayName || 'ผู้ใช้' }}
                  </NuxtLink>
                  <NuxtLink
                    v-if="friend.slug"
                    :to="`/users/${friend.slug}`"
                    class="block text-xs text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    @{{ friend.slug }}
                  </NuxtLink>
                  <p v-else class="text-xs text-gray-500">@user</p>
                </div>
                <button
                  @click="unfriend(friend)"
                  :disabled="processingRequest === friend.id"
                  class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                >
                  ลบเพื่อน
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 3: Activity History (ประวัติการใช้งาน) -->
      <div v-else-if="activeTab === 'activity'" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">ประวัติการใช้งาน</h3>

          <div v-if="loadingNotifications" class="text-center py-8">
            <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400 mx-auto" />
          </div>
          <div v-else-if="notifications.length === 0" class="text-center py-12">
            <Icon name="lucide:bell-off" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p class="text-sm text-gray-500">ยังไม่มีประวัติการใช้งาน</p>
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="notif in notifications"
              :key="notif.id"
              class="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <!-- Profile Photo or Icon -->
              <img
                v-if="notif.senderPhoto"
                :src="notif.senderPhoto"
                :alt="notif.senderName"
                class="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div
                v-else
                class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                :class="getNotificationIconClass(notif.type)"
              >
                <Icon :name="getNotificationIcon(notif.type)" class="w-5 h-5 text-white" />
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ notif.senderName || 'ผู้ใช้' }}</p>
                <p class="text-sm text-gray-600">
                  <span v-if="notif.type === 'friend_request'">ขอเป็นเพื่อนกับคุณ</span>
                  <span v-else-if="notif.type === 'friend_accepted'">ยอมรับคำขอเป็นเพื่อนของคุณ</span>
                  <span v-else-if="notif.type === 'comment'">แสดงความคิดเห็นโพสต์ของคุณ</span>
                  <span v-else-if="notif.type === 'like'">ถูกใจโพสต์ของคุณ</span>
                  <span v-else>{{ notif.message }}</span>
                </p>
                <p class="text-xs text-gray-400 mt-1">{{ formatNotificationTime(notif.createdAt) }}</p>
              </div>

              <!-- Accept Friend Button for pending friend requests -->
              <div v-if="notif.type === 'friend_request' && notif.status === 'pending'" class="flex gap-2">
                <button
                  @click="acceptFriendFromNotification(notif)"
                  :disabled="processingRequest === notif.requestId"
                  class="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-50"
                >
                  รับเพื่อน
                </button>
                <button
                  @click="rejectFriendFromNotification(notif)"
                  :disabled="processingRequest === notif.requestId"
                  class="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg font-medium hover:bg-gray-300 transition-all disabled:opacity-50"
                >
                  ปฏิเสธ
                </button>
              </div>
              <div v-else-if="notif.type === 'friend_request' && notif.status === 'accepted'" class="text-xs text-green-600 font-medium">
                ยอมรับแล้ว
              </div>
              <div v-else-if="notif.type === 'friend_request' && notif.status === 'rejected'" class="text-xs text-gray-400">
                ปฏิเสธแล้ว
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div v-if="!isSetupRequired" class="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6">
          <h3 class="text-sm font-medium text-gray-900 mb-1">ออกจากระบบ</h3>
          <p class="text-xs text-gray-500 mb-4">ออกจากระบบจากอุปกรณ์นี้</p>
          <button
            @click="handleLogout"
            class="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()

// Check if this is a required setup (redirected from middleware)
const isSetupRequired = computed(() => route.query.setup === 'required')

useHead({
  title: computed(() => isSetupRequired.value ? 'สร้างตัวตนปลอม - Nira' : 'จัดการบัญชี - Nira')
})

const { user, signOut } = useAuth()

// Tab state
const activeTab = ref<'profile' | 'friends' | 'activity'>('profile')

const tabs = [
  { id: 'profile' as const, label: 'ข้อมูลทั่วไป', icon: 'lucide:user' },
  { id: 'friends' as const, label: 'เพื่อนของฉัน', icon: 'lucide:users' },
  { id: 'activity' as const, label: 'ประวัติการใช้งาน', icon: 'lucide:bell' }
]

// Profile state
const profile = ref<{ displayName?: string; slug?: string; photoURL?: string; aboutMe?: string } | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Friends state
const friends = ref<any[]>([])
const friendRequests = ref<any[]>([])
const loadingFriends = ref(false)
const processingRequest = ref<string | null>(null)

// Notifications state
const notifications = ref<any[]>([])
const loadingNotifications = ref(false)

// Form state
const displayName = ref('')
const slug = ref('')
const aboutMe = ref('')
const file = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const saving = ref(false)
const message = ref('')
const slugError = ref<string | null>(null)
const slugChecking = ref(false)
const slugAvailable = ref(false)

// Debounce timer for slug check
let slugCheckTimer: NodeJS.Timeout | null = null

const sanitizedSlug = computed(() => slug.value.trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_]/g, ''))

const canSave = computed(() => {
  return displayName.value.trim() && sanitizedSlug.value && !slugError.value && !slugChecking.value
})

// Firebase (only storage needed for file upload)
const { storage } = useFirebase()

// Image optimization
const { createProfileImages, formatFileSize } = useImageOptimization()

// Load friends and friend requests
const loadFriends = async () => {
  if (!user.value?.uid) return

  loadingFriends.value = true
  try {
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) return

    const token = await firebaseUser.getIdToken()

    // Load friends from API
    const friendsResponse = await $fetch('/api/friends/list', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    friends.value = friendsResponse.friends || []

    // Load friend requests from API
    const requestsResponse = await $fetch('/api/friends/requests', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    friendRequests.value = requestsResponse.requests || []
  } catch (err) {
    console.error('Error loading friends:', err)
  } finally {
    loadingFriends.value = false
  }
}

// Load notifications
const loadNotifications = async () => {
  if (!user.value?.uid) return

  loadingNotifications.value = true
  try {
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) return

    const token = await firebaseUser.getIdToken()

    const response = await $fetch('/api/notifications/list', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    notifications.value = response.notifications || []
  } catch (err) {
    console.error('Error loading notifications:', err)
  } finally {
    loadingNotifications.value = false
  }
}

// Accept friend request
const acceptFriend = async (request: any) => {
  if (!user.value) return

  processingRequest.value = request.id

  try {
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) return

    const token = await firebaseUser.getIdToken()

    await $fetch('/api/friends/accept', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        requestId: request.id,
        senderId: request.senderId
      }
    })

    // Reload friends and requests
    await loadFriends()
  } catch (err) {
    console.error('Error accepting friend:', err)
    alert('เกิดข้อผิดพลาดในการรับเพื่อน')
  } finally {
    processingRequest.value = null
  }
}

// Reject friend request
const rejectFriend = async (request: any) => {
  if (!user.value) return

  processingRequest.value = request.id

  try {
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) return

    const token = await firebaseUser.getIdToken()

    await $fetch('/api/friends/reject', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        requestId: request.id
      }
    })

    // Reload requests
    await loadFriends()
  } catch (err) {
    console.error('Error rejecting friend:', err)
    alert('เกิดข้อผิดพลาดในการปฏิเสธ')
  } finally {
    processingRequest.value = null
  }
}

// Unfriend
const unfriend = async (friend: any) => {
  if (!user.value) return
  if (!confirm(`คุณต้องการลบ ${friend.displayName} ออกจากเพื่อนหรือไม่?`)) return

  processingRequest.value = friend.id

  try {
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) return

    const token = await firebaseUser.getIdToken()

    await $fetch('/api/friends/unfriend', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        friendId: friend.id
      }
    })

    // Reload friends
    await loadFriends()
  } catch (err) {
    console.error('Error unfriending:', err)
    alert('เกิดข้อผิดพลาดในการลบเพื่อน')
  } finally {
    processingRequest.value = null
  }
}

// Accept friend from notification (activity tab)
const acceptFriendFromNotification = async (notif: any) => {
  if (!user.value) return

  processingRequest.value = notif.requestId

  try {
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) return

    const token = await firebaseUser.getIdToken()

    await $fetch('/api/friends/accept', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        requestId: notif.requestId,
        senderId: notif.senderId
      }
    })

    // Reload notifications to update UI
    await loadNotifications()
  } catch (err) {
    console.error('Error accepting friend:', err)
    alert('เกิดข้อผิดพลาดในการรับเพื่อน')
  } finally {
    processingRequest.value = null
  }
}

// Reject friend from notification (activity tab)
const rejectFriendFromNotification = async (notif: any) => {
  if (!user.value) return

  processingRequest.value = notif.requestId

  try {
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) return

    const token = await firebaseUser.getIdToken()

    await $fetch('/api/friends/reject', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        requestId: notif.requestId
      }
    })

    // Reload notifications to update UI
    await loadNotifications()
  } catch (err) {
    console.error('Error rejecting friend:', err)
    alert('เกิดข้อผิดพลาดในการปฏิเสธ')
  } finally {
    processingRequest.value = null
  }
}

// Notification helpers
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'like': return 'lucide:heart'
    case 'comment': return 'lucide:message-circle'
    case 'friend_request': return 'lucide:user-plus'
    case 'friend_accepted': return 'lucide:user-check'
    default: return 'lucide:bell'
  }
}

const getNotificationIconClass = (type: string) => {
  switch (type) {
    case 'like': return 'bg-gradient-to-br from-pink-400 to-rose-500'
    case 'comment': return 'bg-gradient-to-br from-blue-400 to-indigo-500'
    case 'friend_request': return 'bg-gradient-to-br from-purple-400 to-violet-500'
    case 'friend_accepted': return 'bg-gradient-to-br from-green-400 to-emerald-500'
    default: return 'bg-gradient-to-br from-gray-400 to-gray-500'
  }
}

const formatNotificationTime = (timestamp: any) => {
  if (!timestamp) return 'เมื่อสักครู่'

  let date: Date

  // Handle Firestore Timestamp
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate()
  }
  // Handle Firestore Admin SDK Date object (has _seconds and _nanoseconds)
  else if (timestamp._seconds !== undefined) {
    date = new Date(timestamp._seconds * 1000)
  }
  // Handle regular Date object or timestamp string
  else if (timestamp instanceof Date) {
    date = timestamp
  }
  else {
    date = new Date(timestamp)
  }

  // Validate date
  if (isNaN(date.getTime())) {
    return 'เมื่อสักครู่'
  }

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

// Watch tab changes to load data
watch(activeTab, (tab) => {
  if (tab === 'friends') {
    loadFriends() // Always reload to get latest friend requests
  } else if (tab === 'activity') {
    loadNotifications() // Always reload to get latest notifications
  }
})

// Load profile using API
const loadProfile = async () => {
  if (!user.value?.uid) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) {
      throw new Error('Not authenticated')
    }
    const token = await firebaseUser.getIdToken()

    const response = await $fetch<{ profile: any; exists: boolean }>('/api/user/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.exists && response.profile) {
      profile.value = response.profile
      // Only set form values if they haven't been edited
      if (!displayName.value && response.profile.displayName) {
        displayName.value = response.profile.displayName
      }
      if (!slug.value && response.profile.slug) {
        slug.value = response.profile.slug
        slugAvailable.value = true // Current slug is valid
      }
      if (!aboutMe.value && response.profile.aboutMe) {
        aboutMe.value = response.profile.aboutMe
      }
    }
  } catch (err: any) {
    console.error('Error loading profile:', err)
    error.value = err.data?.message || 'ไม่สามารถโหลดข้อมูลได้'
  } finally {
    loading.value = false
  }
}

// Load profile when user is available
watch(() => user.value?.uid, async (uid) => {
  if (uid) {
    await loadProfile()
  } else {
    loading.value = false
  }
}, { immediate: true })

// Slug input handler with debounce
const onSlugInput = (e?: Event) => {
  // Force lowercase, remove spaces and special chars in real-time
  const input = e?.target as HTMLInputElement
  if (input) {
    const cleaned = input.value
      .toLowerCase()
      .replace(/\s+/g, '') // Remove all spaces
      .replace(/[^a-z0-9_]/g, '') // Keep only lowercase letters, numbers, underscore

    if (input.value !== cleaned) {
      slug.value = cleaned
      input.value = cleaned
      return
    }
  }

  slugError.value = null
  slugAvailable.value = false

  if (slugCheckTimer) {
    clearTimeout(slugCheckTimer)
  }

  const sanitized = sanitizedSlug.value
  if (!sanitized) return

  // Basic validation
  if (sanitized.length < 3) {
    slugError.value = 'ต้องมีอย่างน้อย 3 ตัวอักษร (a-z, 0-9, _)'
    return
  }

  if (sanitized.length > 20) {
    slugError.value = 'ต้องไม่เกิน 20 ตัวอักษร'
    return
  }

  // Check for invalid characters
  if (!/^[a-z0-9_]+$/.test(sanitized)) {
    slugError.value = 'ใช้ได้เฉพาะตัวเล็ก (a-z), ตัวเลข (0-9), และขีดล่าง (_)'
    return
  }

  // If it's the same as current slug, it's available
  if (profile.value?.slug === sanitized) {
    slugAvailable.value = true
    return
  }

  // Debounce the slug check
  slugChecking.value = true
  slugCheckTimer = setTimeout(async () => {
    try {
      if (!user.value?._firebaseUser) return

      const token = await user.value._firebaseUser.getIdToken()

      const response = await $fetch(`/api/user/check-slug?slug=${sanitized}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.available) {
        slugAvailable.value = true
      } else {
        slugError.value = '@' + sanitized + ' ถูกใช้แล้ว'
      }
    } catch (err) {
      console.error('Slug check error:', err)
    } finally {
      slugChecking.value = false
    }
  }, 500)
}

const onFileChange = (e: Event) => {
  const t = e.target as HTMLInputElement
  if (t.files && t.files[0]) {
    const selectedFile = t.files[0]

    // Validate file size (max 2MB)
    if (selectedFile.size > 2 * 1024 * 1024) {
      error.value = 'ไฟล์ต้องไม่เกิน 2MB'
      return
    }

    file.value = selectedFile
    previewUrl.value = URL.createObjectURL(file.value)
  }
}

const save = async () => {
  message.value = ''
  error.value = null

  if (!user.value?.uid) return
  if (!canSave.value) return

  const sanitized = sanitizedSlug.value

  try {
    saving.value = true

    let photoURL = profile.value?.photoURL
    let photoURLThumb = profile.value?.photoURLThumb

    // Upload optimized images if selected
    if (file.value) {
      const { ref: storageRef, uploadBytes, getDownloadURL } = await import('firebase/storage')

      // Create optimized versions (256px full, 64px thumbnail)
      const { full, thumbnail } = await createProfileImages(file.value)

      console.log(`[Profile] Original: ${formatFileSize(file.value.size)} → Full: ${formatFileSize(full.size)}, Thumb: ${formatFileSize(thumbnail.size)}`)

      // Upload both sizes in parallel
      const timestamp = Date.now()
      const fullRef = storageRef(storage, `profiles/${user.value.uid}/avatar-${timestamp}.jpg`)
      const thumbRef = storageRef(storage, `profiles/${user.value.uid}/avatar-${timestamp}-thumb.jpg`)

      const [fullUpload, thumbUpload] = await Promise.all([
        uploadBytes(fullRef, full, { contentType: 'image/jpeg' }),
        uploadBytes(thumbRef, thumbnail, { contentType: 'image/jpeg' })
      ])

      // Get download URLs
      const [fullUrl, thumbUrl] = await Promise.all([
        getDownloadURL(fullUpload.ref),
        getDownloadURL(thumbUpload.ref)
      ])

      photoURL = fullUrl
      photoURLThumb = thumbUrl
    }

    // Get auth token
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) {
      throw new Error('Not authenticated')
    }
    const token = await firebaseUser.getIdToken()

    // Call API to save profile
    await $fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        displayName: displayName.value.trim(),
        slug: sanitized,
        aboutMe: aboutMe.value.trim().substring(0, 300),
        photoURL,
        photoURLThumb
      }
    })

    message.value = 'บันทึกเรียบร้อย!'
    file.value = null

    // Reload profile to update display
    await loadProfile()

    // If this was a required setup, redirect to my-story
    if (isSetupRequired.value) {
      setTimeout(() => {
        router.push('/my-story')
      }, 1000)
    } else {
      // Clear message after 3 seconds
      setTimeout(() => {
        message.value = ''
      }, 3000)
    }
  } catch (err: any) {
    console.error('Save error:', err)
    error.value = err.data?.message || err.message || 'เกิดข้อผิดพลาดในการบันทึก'
  } finally {
    saving.value = false
  }
}

const handleLogout = async () => {
  if (confirm('ต้องการออกจากระบบ?')) {
    await signOut()
    router.push('/')
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
