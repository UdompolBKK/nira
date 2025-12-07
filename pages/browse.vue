<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div class="max-w-2xl mx-auto px-4 py-3">
        <!-- Search bar -->
        <div class="relative">
          <Icon
            name="lucide:search"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          />
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="ค้นหาบันทึก..."
            class="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <!-- Filter tabs -->
        <div class="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          <button
            @click="activeFilter = 'all'"
            class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all"
            :class="[
              activeFilter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            ทั้งหมด
          </button>
          <button
            @click="activeFilter = 'trending'"
            class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all"
            :class="[
              activeFilter === 'trending'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            กำลังฮิต
          </button>
          <button
            v-for="(mood, key) in MOOD_CATEGORIES"
            :key="key"
            @click="activeFilter = key"
            class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all"
            :class="[
              activeFilter === key
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ mood.emoji }} {{ mood.label }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-2xl mx-auto px-4 py-4">
      <!-- Loading state -->
      <div v-if="loading && posts.length === 0" class="space-y-4">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-gray-200" />
            <div class="flex-1">
              <div class="h-4 w-24 bg-gray-200 rounded mb-1" />
              <div class="h-3 w-16 bg-gray-100 rounded" />
            </div>
          </div>
          <div class="h-4 w-full bg-gray-200 rounded mb-2" />
          <div class="h-4 w-3/4 bg-gray-100 rounded mb-2" />
          <div class="h-4 w-1/2 bg-gray-100 rounded" />
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!loading && posts.length === 0"
        class="text-center py-16"
      >
        <Icon name="lucide:book-open" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">ยังไม่มีบันทึก</h3>
        <p class="text-gray-500 mb-6">เป็นคนแรกที่เขียนบันทึกในชุมชนนี้</p>
        <NuxtLink
          to="/editor"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800"
        >
          <Icon name="lucide:plus" class="w-5 h-5" />
          เขียนบันทึก
        </NuxtLink>
      </div>

      <!-- Posts list -->
      <div v-else class="space-y-4">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />

        <!-- Load more -->
        <div
          v-if="hasMore"
          ref="loadMoreRef"
          class="text-center py-8"
        >
          <button
            v-if="!loading"
            @click="loadMore"
            class="px-6 py-3 text-gray-600 hover:text-gray-900"
          >
            โหลดเพิ่มเติม
          </button>
          <Icon
            v-else
            name="lucide:loader-2"
            class="w-6 h-6 animate-spin text-gray-400 mx-auto"
          />
        </div>
      </div>
    </main>

    <!-- FAB - Write button -->
    <NuxtLink
      to="/editor"
      class="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-50"
    >
      <Icon name="lucide:plus" class="w-6 h-6" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { MOOD_CATEGORIES, type MoodCategory } from '~/composables/usePosts'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'อ่านบันทึก - Nira'
})

const { posts, loading, hasMore, getPublicPosts, getTrendingPosts, searchPosts, resetPagination } = usePosts()

const searchQuery = ref('')
const activeFilter = ref<'all' | 'trending' | MoodCategory>('all')
const loadMoreRef = ref<HTMLElement | null>(null)

// Debounce search
let searchTimeout: NodeJS.Timeout | null = null

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    if (searchQuery.value.trim()) {
      const results = await searchPosts(searchQuery.value)
      posts.value = results
    } else {
      await loadPosts()
    }
  }, 300)
}

// Load posts based on filter
const loadPosts = async () => {
  resetPagination()

  if (activeFilter.value === 'trending') {
    const trendingPosts = await getTrendingPosts(20)
    posts.value = trendingPosts
  } else {
    await getPublicPosts(10)
  }
}

// Load more posts
const loadMore = async () => {
  if (activeFilter.value === 'all') {
    await getPublicPosts(10, true)
  }
}

// Watch filter changes
watch(activeFilter, async () => {
  searchQuery.value = ''
  await loadPosts()
})

// Intersection observer for infinite scroll
onMounted(async () => {
  await loadPosts()

  // Setup intersection observer
  if (loadMoreRef.value) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore.value && !loading.value) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(loadMoreRef.value)
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
