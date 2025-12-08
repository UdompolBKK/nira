<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">จัดการ Subscriptions</h1>
      <p class="text-gray-600 mt-2">ดูและจัดการ subscription ของผู้ใช้</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:check-circle" class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">Active</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeSubscriptionsCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:x-circle" class="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">Canceled</p>
            <p class="text-2xl font-bold text-gray-900">{{ canceledSubscriptionsCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:dollar-sign" class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">รายได้รวม</p>
            <p class="text-2xl font-bold text-gray-900">฿{{ totalRevenue.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Subscriptions List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">รายการ Subscriptions</h2>
      </div>

      <div v-if="loading" class="p-12 text-center">
        <Icon name="lucide:loader-2" class="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
        <p class="text-gray-500">กำลังโหลด...</p>
      </div>

      <div v-else-if="subscriptions.length === 0" class="p-12 text-center">
        <Icon name="lucide:credit-card" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">ยังไม่มี subscription ในระบบ</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้ใช้</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">แพ็กเกจ</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ราคา</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่เริ่ม</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันหมดอายุ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="sub in subscriptions" :key="sub.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ sub.userName || 'ผู้ใช้' }}</div>
                <div class="text-sm text-gray-500">{{ sub.userEmail || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ sub.plan || 'Premium' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ฿{{ sub.amount?.toLocaleString() || '0' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  sub.status === 'active' ? 'bg-green-100 text-green-700' :
                  sub.status === 'canceled' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                ]">
                  {{ sub.status || 'unknown' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(sub.startDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(sub.endDate) }}
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
  title: 'จัดการ Subscriptions - Admin'
})

interface Subscription {
  id: string
  userId: string
  userName?: string
  userEmail?: string
  plan?: string
  amount?: number
  status?: string
  startDate: Timestamp | Date
  endDate: Timestamp | Date
  createdAt: Timestamp | Date
}

const { firestore } = useFirestore()
const subscriptions = ref<Subscription[]>([])
const loading = ref(true)

const activeSubscriptionsCount = computed(() => subscriptions.value.filter(s => s.status === 'active').length)
const canceledSubscriptionsCount = computed(() => subscriptions.value.filter(s => s.status === 'canceled').length)
const totalRevenue = computed(() => subscriptions.value.reduce((sum, sub) => sum + (sub.amount || 0), 0))

const formatDate = (timestamp: any) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadSubscriptions = async () => {
  if (!firestore) return

  loading.value = true
  try {
    const subsRef = collection(firestore, 'subscriptions')
    const q = query(subsRef, orderBy('createdAt', 'desc'), limit(100))
    const snapshot = await getDocs(q)

    subscriptions.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Subscription[]
  } catch (error) {
    console.error('Error loading subscriptions:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSubscriptions()
})
</script>
