<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">จัดการผู้ใช้</h1>
      <p class="text-gray-600 mt-2">ดูและจัดการผู้ใช้ทั้งหมดในระบบ</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:users" class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">ผู้ใช้ทั้งหมด</p>
            <p class="text-2xl font-bold text-gray-900">{{ users.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:crown" class="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">Premium</p>
            <p class="text-2xl font-bold text-gray-900">{{ premiumUsersCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:shield" class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">Admins</p>
            <p class="text-2xl font-bold text-gray-900">{{ adminUsersCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:user-check" class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">ผู้ใช้ฟรี</p>
            <p class="text-2xl font-bold text-gray-900">{{ freeUsersCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Users List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">รายการผู้ใช้</h2>
      </div>

      <div v-if="loading" class="p-12 text-center">
        <Icon name="lucide:loader-2" class="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
        <p class="text-gray-500">กำลังโหลด...</p>
      </div>

      <div v-else-if="users.length === 0" class="p-12 text-center">
        <Icon name="lucide:users" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">ยังไม่มีผู้ใช้ในระบบ</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้ใช้</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">อีเมล</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Premium</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่สมัคร</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <img
                    v-if="user.photoURL"
                    :src="user.photoURL"
                    :alt="user.displayName"
                    class="w-10 h-10 rounded-full"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold"
                  >
                    {{ (user.displayName || user.email || 'U').charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ user.displayName || 'ไม่ระบุชื่อ' }}</div>
                    <div class="text-sm text-gray-500">@{{ user.slug || 'user' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.email || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  user.role === 'admin' || user.role === 'super-admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                ]">
                  {{ user.role || 'user' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  user.isPremium ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                ]">
                  {{ user.isPremium ? 'Premium' : 'Free' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFirestore } from '~/composables/useFirestore'
import { collection, query, orderBy, limit, getDocs, type Timestamp } from 'firebase/firestore'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

useHead({
  title: 'จัดการผู้ใช้ - Admin'
})

interface User {
  id: string
  email?: string
  displayName?: string
  photoURL?: string
  slug?: string
  role?: string
  isPremium?: boolean
  createdAt: Timestamp | Date
}

const { firestore } = useFirestore()
const users = ref<User[]>([])
const loading = ref(true)

const premiumUsersCount = computed(() => users.value.filter(u => u.isPremium).length)
const adminUsersCount = computed(() => users.value.filter(u => u.role === 'admin' || u.role === 'super-admin').length)
const freeUsersCount = computed(() => users.value.filter(u => !u.isPremium && u.role !== 'admin' && u.role !== 'super-admin').length)

const formatDate = (timestamp: any) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadUsers = async () => {
  if (!firestore) return

  loading.value = true
  try {
    const usersRef = collection(firestore, 'users')
    const q = query(usersRef, orderBy('createdAt', 'desc'), limit(100))
    const snapshot = await getDocs(q)

    users.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[]
  } catch (error) {
    console.error('Error loading users:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>
