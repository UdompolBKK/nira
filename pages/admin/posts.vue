<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">จัดการโพสต์</h1>
      <p class="text-gray-600 mt-2">ดูและจัดการโพสต์ทั้งหมดในระบบ</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:file-text" class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">โพสต์ทั้งหมด</p>
            <p class="text-2xl font-bold text-gray-900">{{ posts.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:globe" class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">โพสต์สาธารณะ</p>
            <p class="text-2xl font-bold text-gray-900">{{ publicPostsCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:lock" class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">โพสต์ส่วนตัว</p>
            <p class="text-2xl font-bold text-gray-900">{{ privatePostsCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Posts List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">รายการโพสต์</h2>
      </div>

      <div v-if="loading" class="p-12 text-center">
        <Icon name="lucide:loader-2" class="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
        <p class="text-gray-500">กำลังโหลด...</p>
      </div>

      <div v-else-if="posts.length === 0" class="p-12 text-center">
        <Icon name="lucide:file-text" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">ยังไม่มีโพสต์ในระบบ</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้เขียน</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">เนื้อหา</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ประเภท</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">การกระทำ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ post.authorName || 'ผู้ใช้นิรนาม' }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 line-clamp-2 max-w-md">{{ post.content }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  post.visibility === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                ]">
                  {{ post.visibility === 'public' ? 'สาธารณะ' : 'ส่วนตัว' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(post.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="deletePost(post.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  ลบ
                </button>
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
import { collection, query, orderBy, limit, getDocs, deleteDoc, doc, type Timestamp } from 'firebase/firestore'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

useHead({
  title: 'จัดการโพสต์ - Admin'
})

interface Post {
  id: string
  content: string
  userId: string
  authorName?: string
  visibility: string
  createdAt: Timestamp | Date
}

const { firestore } = useFirestore()
const posts = ref<Post[]>([])
const loading = ref(true)

const publicPostsCount = computed(() => posts.value.filter(p => p.visibility === 'public').length)
const privatePostsCount = computed(() => posts.value.filter(p => p.visibility !== 'public').length)

const formatDate = (timestamp: any) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadPosts = async () => {
  if (!firestore) return

  loading.value = true
  try {
    const postsRef = collection(firestore, 'posts')
    const q = query(postsRef, orderBy('createdAt', 'desc'), limit(100))
    const snapshot = await getDocs(q)

    posts.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[]
  } catch (error) {
    console.error('Error loading posts:', error)
  } finally {
    loading.value = false
  }
}

const deletePost = async (postId: string) => {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์นี้?')) return

  if (!firestore) return

  try {
    await deleteDoc(doc(firestore, 'posts', postId))
    await loadPosts()
  } catch (error) {
    console.error('Error deleting post:', error)
    alert('เกิดข้อผิดพลาดในการลบโพสต์')
  }
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
