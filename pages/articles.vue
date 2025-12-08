<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-16">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 animate-pulse">
          <Icon name="lucide:book-open" class="w-10 h-10" />
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          บทความ
        </h1>
        <p class="text-xl text-white/90 max-w-2xl mx-auto">
          เรียนรู้เทคนิคการดูแลสุขภาพจิต และเคล็ดลับการใช้ชีวิตที่ดีขึ้น
        </p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 -mt-8 pb-12">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <Icon name="lucide:loader-2" class="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
        <p class="text-gray-500">กำลังโหลดบทความ...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="articles.length === 0" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full mb-6">
          <Icon name="lucide:file-text" class="w-12 h-12 text-pink-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">ยังไม่มีบทความ</h3>
        <p class="text-gray-500">กำลังเตรียมเนื้อหาดีๆ สำหรับคุณ</p>
      </div>

      <!-- Articles Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="article in articles"
          :key="article.id"
          :to="`/articles/${article.slug}`"
          class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
        >
          <!-- Cover Image -->
          <div v-if="article.coverImage" class="relative h-48 overflow-hidden">
            <img
              :src="article.coverImage"
              :alt="article.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div v-else class="relative h-48 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
            <Icon name="lucide:file-text" class="w-16 h-16 text-pink-300" />
          </div>

          <!-- Content -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
              {{ article.title }}
            </h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              {{ article.excerpt }}
            </p>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ formatDate(article.publishedAt) }}</span>
              <div class="flex items-center gap-2">
                <Icon name="lucide:eye" class="w-4 h-4" />
                <span>{{ article.views || 0 }}</span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFirestore } from '~/composables/useFirestore'
import { collection, query, where, orderBy, getDocs, type Timestamp } from 'firebase/firestore'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'บทความ - Nira',
  meta: [
    {
      name: 'description',
      content: 'บทความเกี่ยวกับสุขภาพจิต การดูแลตนเอง และเทคนิคการใช้ชีวิตที่ดีขึ้น'
    }
  ]
})

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  publishedAt: Timestamp | Date
  views?: number
  isPublished: boolean
}

const { firestore } = useFirestore()
const articles = ref<Article[]>([])
const loading = ref(true)

const formatDate = (timestamp: any) => {
  if (!timestamp) return ''

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  if (!firestore) {
    console.error('Firestore not initialized')
    loading.value = false
    return
  }

  try {
    const articlesRef = collection(firestore, 'articles')
    const q = query(
      articlesRef,
      where('isPublished', '==', true),
      orderBy('publishedAt', 'desc')
    )

    const snapshot = await getDocs(q)
    articles.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Article[]
  } catch (error) {
    console.error('Error fetching articles:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
