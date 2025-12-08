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

      <!-- Loading state -->
      <div v-if="loading" class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-400 mx-auto" />
        <p class="text-sm text-gray-500 mt-3">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Profile Form -->
      <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
            <p class="text-xs text-gray-400 mt-1">ชื่อนี้จะแสดงให้คนอื่นเห็น</p>
          </div>

          <!-- Slug -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              <Icon name="lucide:at-sign" class="w-4 h-4 inline mr-1" />
              Handle
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

      <!-- Danger Zone -->
      <div class="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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

// Profile state
const profile = ref<{ displayName?: string; slug?: string; photoURL?: string } | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Form state
const displayName = ref('')
const slug = ref('')
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

// Firebase
const { firestore, storage } = useFirebase()

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
      const { collection, query, where, getDocs } = await import('firebase/firestore')
      const usersCol = collection(firestore, 'users')
      const q = query(usersCol, where('slug', '==', sanitized))
      const snaps = await getDocs(q)

      if (!snaps.empty) {
        // Check if it belongs to current user
        const isOwnSlug = snaps.docs.some(doc => doc.id === user.value?.uid)
        if (isOwnSlug) {
          slugAvailable.value = true
        } else {
          slugError.value = '@' + sanitized + ' ถูกใช้แล้ว'
        }
      } else {
        slugAvailable.value = true
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

    // Upload image if selected
    if (file.value) {
      const { ref: storageRef, uploadBytes, getDownloadURL } = await import('firebase/storage')
      const path = `profiles/${user.value.uid}/avatar-${Date.now()}`
      const sRef = storageRef(storage, path)
      await uploadBytes(sRef, file.value)
      photoURL = await getDownloadURL(sRef)
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
        photoURL
      }
    })

    message.value = 'บันทึกเรียบร้อย!'
    file.value = null

    // Reload profile to update display
    await loadProfile()

    // If this was a required setup, redirect to editor
    if (isSetupRequired.value) {
      setTimeout(() => {
        router.push('/editor')
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
