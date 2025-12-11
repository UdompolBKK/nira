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

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl md:text-2xl font-semibold text-gray-900">ปัญหาที่ได้รับการระบาย</h1>
            <p class="text-xs md:text-sm text-gray-500 mt-1">บันทึกการระบายความรู้สึกทั้งหมดจากผู้ใช้ในชุมชน</p>
          </div>

          <!-- Share Problem Button -->
          <button
            @click="handleShareProblem"
            class="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all hover:shadow-lg"
          >
            <Icon name="lucide:plus" class="w-5 h-5" />
            <span class="hidden md:inline">แชร์ปัญหา</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <!-- Room Filter -->
      <div v-if="rooms.length > 0" class="mb-6">
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectRoom('')"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2',
              !selectedRoom
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <Icon name="lucide:layout-grid" class="w-4 h-4" />
            ทั้งหมด
          </button>
          <button
            v-for="room in rooms"
            :key="room.id"
            @click="selectRoom(room.id)"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2',
              selectedRoom === room.id
                ? 'text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            :style="selectedRoom === room.id ? { backgroundColor: room.color } : {}"
          >
            <Icon :name="room.icon" class="w-4 h-4" />
            {{ room.name }}
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <Icon name="lucide:loader-2" class="w-10 h-10 text-gray-400 animate-spin mb-4" />
        <p class="text-sm text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Posts grid -->
      <Transition name="fade-in">
        <div
          v-if="!loading && posts.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <VentCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
            variant="compact"
          />
        </div>
      </Transition>

      <!-- Empty state -->
      <div
        v-if="!loading && posts.length === 0"
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
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'เรื่องราวทั้งหมด - Nira'
})

const { user } = useAuth()

interface Room {
  id: string
  name: string
  description?: string
  icon: string
  color: string
  imageURL?: string
  isActive: boolean
}

interface VentPost {
  id: string
  content: string
  excerpt?: string
  authorName: string
  authorSlug?: string
  authorPhoto?: string | null
  userId: string
  moodCategory?: string
  roomId?: string
  roomName?: string
  roomIcon?: string
  roomColor?: string
  likeCount?: number
  commentCount?: number
  viewCount?: number
  createdAt: Date
}

const rooms = ref<Room[]>([])
const selectedRoom = ref('')
const posts = ref<VentPost[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const hasMore = ref(true)
const lastTimestamp = ref<string>('')

// Load rooms
const loadRooms = async () => {
  try {
    const response = await $fetch<{ rooms: Room[] }>('/api/rooms')
    rooms.value = response.rooms.filter(r => r.isActive)
  } catch (error) {
    console.error('Error loading rooms:', error)
  }
}

// Select room and reload posts
const selectRoom = (roomId: string) => {
  selectedRoom.value = roomId
  lastTimestamp.value = ''
  loadPosts()
}

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

    // Add room filter
    if (selectedRoom.value) {
      params.roomId = selectedRoom.value
    }

    const response = await $fetch<{ vents: any[]; hasMore: boolean }>('/api/vents', {
      params
    })

    // Get room info for each post
    const newPosts = response.vents.map((data: any) => {
      // Find room info if roomId exists
      let roomName = ''
      let roomIcon = ''
      let roomColor = ''
      if (data.roomId) {
        const room = rooms.value.find(r => r.id === data.roomId)
        if (room) {
          roomName = room.name
          roomIcon = room.icon
          roomColor = room.color
        }
      }

      return {
        id: data.id,
        userId: data.userId,
        authorName: data.authorName || 'ไม่ระบุชื่อ',
        authorSlug: data.authorSlug,
        authorPhoto: data.authorPhoto,
        content: data.content,
        excerpt: data.excerpt || data.content?.replace(/<[^>]*>/g, '').substring(0, 150),
        moodCategory: data.moodCategory || 'normal',
        roomId: data.roomId,
        roomName,
        roomIcon,
        roomColor,
        likeCount: typeof data.likeCount === 'number' ? data.likeCount : 0,
        commentCount: typeof data.commentCount === 'number' ? data.commentCount : 0,
        viewCount: typeof data.viewCount === 'number' ? data.viewCount : 0,
        createdAt: new Date(data.createdAt)
      }
    })

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

// Handle share problem button click
const handleShareProblem = () => {
  if (!user.value) {
    // Redirect to login if not authenticated
    navigateTo('/login')
    return
  }
  // Redirect to my-problem page
  navigateTo('/my-problem')
}

// Load more posts
const loadMore = () => {
  loadPosts(true)
}

onMounted(async () => {
  await loadRooms()
  loadPosts()
})

// Reload data when navigating back to this page
onActivated(async () => {
  await loadRooms()
  loadPosts()
})
</script>

<style scoped>
/* Fade-in transition for content */
.fade-in-enter-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-in-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
