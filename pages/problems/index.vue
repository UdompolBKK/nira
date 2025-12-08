<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <NuxtLink to="/" class="hover:text-gray-900 transition-colors">หน้าหลัก</NuxtLink>
          <Icon name="lucide:chevron-right" class="w-4 h-4" />
          <span class="text-gray-900 font-medium">เรื่องราวทั้งหมด</span>
        </nav>

        <div>
          <h1 class="text-xl md:text-2xl font-semibold text-gray-900">ปัญหาที่ได้รับการระบาย</h1>
          <p class="text-xs md:text-sm text-gray-500 mt-1">บันทึกการระบายความรู้สึกทั้งหมดจากผู้ใช้ในชุมชน</p>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <!-- Loading state -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="i in 9"
          :key="i"
          class="bg-white rounded-2xl p-6 animate-pulse"
        >
          <div class="flex items-start gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-gray-200" />
            <div class="flex-1">
              <div class="h-3 w-24 bg-gray-200 rounded mb-2" />
              <div class="h-2 w-16 bg-gray-200 rounded" />
            </div>
            <div class="w-12 h-6 bg-gray-200 rounded-full" />
          </div>
          <div class="h-2 w-full bg-gray-200 rounded mb-2" />
          <div class="h-2 w-3/4 bg-gray-200 rounded mb-2" />
          <div class="h-2 w-1/2 bg-gray-200 rounded" />
        </div>
      </div>

      <!-- Posts grid -->
      <div
        v-else-if="posts.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <VentCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          variant="compact"
        />
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="text-center py-20"
      >
        <Icon name="lucide:file-text" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">ยังไม่มีเรื่องราว</h3>
        <p class="text-sm text-gray-500">ยังไม่มีบันทึกการระบายความรู้สึก</p>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore && !loading" class="text-center mt-8">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loadingMore" class="flex items-center gap-2">
            <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            กำลังโหลด...
          </span>
          <span v-else>โหลดเพิ่มเติม</span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'เรื่องราวทั้งหมด - Nira'
})

interface VentPost {
  id: string
  content: string
  excerpt?: string
  authorName: string
  authorSlug?: string
  authorPhoto?: string | null
  userId: string
  moodCategory?: string
  likeCount?: number
  commentCount?: number
  viewCount?: number
  createdAt: Date
}

const posts = ref<VentPost[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const hasMore = ref(true)
const lastTimestamp = ref<string>('')

// Load posts from API
const loadPosts = async (loadMoreMode = false) => {
  if (loadMoreMode) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const params: any = {
      limit: '30'
    }

    if (loadMoreMode && lastTimestamp.value) {
      params.startAfter = lastTimestamp.value
    }

    const response = await $fetch<{ vents: any[]; hasMore: boolean }>('/api/vents', {
      params
    })

    const newPosts = response.vents.map((data: any) => ({
      id: data.id,
      userId: data.userId,
      authorName: data.authorName || 'ไม่ระบุชื่อ',
      authorSlug: data.authorSlug,
      authorPhoto: data.authorPhoto,
      content: data.content,
      excerpt: data.excerpt || data.content?.replace(/<[^>]*>/g, '').substring(0, 150),
      moodCategory: data.moodCategory || 'normal',
      likeCount: typeof data.likeCount === 'number' ? data.likeCount : 0,
      commentCount: typeof data.commentCount === 'number' ? data.commentCount : 0,
      viewCount: typeof data.viewCount === 'number' ? data.viewCount : 0,
      createdAt: new Date(data.createdAt)
    }))

    if (loadMoreMode) {
      posts.value = [...posts.value, ...newPosts]
    } else {
      posts.value = newPosts
    }

    // Update last timestamp for pagination
    if (newPosts.length > 0) {
      lastTimestamp.value = newPosts[newPosts.length - 1].createdAt.toISOString()
    }

    hasMore.value = response.hasMore || false
  } catch (error) {
    console.error('Error loading posts:', error)
    posts.value = []
    hasMore.value = false
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// Load more posts
const loadMore = () => {
  loadPosts(true)
}

onMounted(() => {
  loadPosts()
})

// Reload data when navigating back to this page
onActivated(() => {
  loadPosts()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
