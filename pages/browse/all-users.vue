<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <NuxtLink
          to="/browse"
          class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
        >
          <Icon name="lucide:arrow-left" class="w-5 h-5" />
          กลับ
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Icon name="lucide:users" class="w-8 h-8 text-pink-600" />
          ผู้ใช้ที่โพสเรื่องราวชีวิตล่าสุดทั้งหมด
        </h1>
        <p class="text-gray-600">ผู้ใช้ที่กำลังแชร์ประสบการณ์ชีวิต</p>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Sort options -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button
          @click="sortBy = 'posts'"
          class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all"
          :class="[
            sortBy === 'posts'
              ? 'bg-pink-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200'
          ]"
        >
          จำนวนบันทึกมากที่สุด
        </button>
        <button
          @click="sortBy = 'likes'"
          class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all"
          :class="[
            sortBy === 'likes'
              ? 'bg-pink-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200'
          ]"
        >
          ยอดถูกใจมากที่สุด
        </button>
        <button
          @click="sortBy = 'recent'"
          class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all"
          :class="[
            sortBy === 'recent'
              ? 'bg-pink-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200'
          ]"
        >
          โพสล่าสุด
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="i in 12"
          :key="i"
          class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse text-center"
        >
          <div class="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-4" />
          <div class="h-4 w-24 bg-gray-200 rounded mx-auto mb-2" />
          <div class="h-3 w-16 bg-gray-100 rounded mx-auto" />
        </div>
      </div>

      <!-- Users grid -->
      <div
        v-else-if="sortedUsers.length > 0"
        class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <div
          v-for="user in sortedUsers"
          :key="user.userId"
          @click="navigateToUserProfile(user.slug)"
          class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-pink-300 transition-all cursor-pointer group text-center"
        >
          <!-- User avatar -->
          <img
            v-if="user.photoURL"
            :src="user.photoURL"
            :alt="user.displayName"
            class="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-gray-100 group-hover:border-pink-200 transition-all"
          />
          <div
            v-else
            class="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl border-4 border-gray-100 group-hover:border-pink-200 transition-all"
          >
            {{ getInitial(user.displayName) }}
          </div>

          <!-- User info -->
          <h3 class="font-semibold text-gray-900 mb-1 truncate">
            {{ user.displayName || 'ผู้ใช้นิรนาม' }}
          </h3>
          <p class="text-sm text-gray-500 mb-4 truncate">@{{ user.slug || 'user' }}</p>

          <!-- User stats -->
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-purple-50 rounded-lg p-3">
              <p class="text-2xl font-bold text-purple-600">{{ user.postCount || 0 }}</p>
              <p class="text-xs text-gray-600">บันทึก</p>
            </div>
            <div class="bg-pink-50 rounded-lg p-3">
              <p class="text-2xl font-bold text-pink-600">{{ user.totalLikes || 0 }}</p>
              <p class="text-xs text-gray-600">ถูกใจ</p>
            </div>
          </div>

          <!-- Last post date -->
          <div class="mt-3 text-xs text-gray-400">
            โพสล่าสุด: {{ formatDate(user.lastPostAt) }}
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="text-center py-16 bg-white rounded-2xl border border-gray-200"
      >
        <Icon name="lucide:users" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p class="text-gray-500">ไม่พบผู้ใช้ที่โพสเรื่องราวล่าสุด</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useFirestore } from '~/composables/useFirestore'
import { collection, query, where, orderBy, limit, getDocs, type Timestamp } from 'firebase/firestore'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'ผู้ใช้ที่โพสเรื่องราวชีวิตล่าสุดทั้งหมด - Nira',
  meta: [
    {
      name: 'description',
      content: 'พบกับผู้ใช้ที่กำลังแชร์ประสบการณ์ชีวิตและบันทึกนิรนาม - เชื่อมต่อกับชุมชนและเรียนรู้จากเรื่องราวของคนอื่น'
    },
    {
      property: 'og:title',
      content: 'ผู้ใช้ที่โพสเรื่องราวชีวิตล่าสุดทั้งหมด - Nira'
    },
    {
      property: 'og:description',
      content: 'พบกับผู้ใช้ที่กำลังแชร์ประสบการณ์ชีวิตในชุมชนบันทึกนิรนาม'
    }
  ]
})

interface ActiveUser {
  userId: string
  displayName?: string
  photoURL?: string
  slug?: string
  postCount: number
  totalLikes: number
  lastPostAt: Timestamp | Date
}

const { firestore } = useFirestore()
const users = ref<ActiveUser[]>([])
const loading = ref(true)
const sortBy = ref<'posts' | 'likes' | 'recent'>('posts')

// Get initial for avatar
const getInitial = (name?: string) => {
  if (!name) return 'U'
  return name.charAt(0).toUpperCase()
}

// Format date
const formatDate = (timestamp: any) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMins = Math.floor(diffInMs / 60000)
  const diffInHours = Math.floor(diffInMs / 3600000)
  const diffInDays = Math.floor(diffInMs / 86400000)

  if (diffInMins < 1) return 'เมื่อสักครู่'
  if (diffInMins < 60) return `${diffInMins} นาทีที่แล้ว`
  if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`
  if (diffInDays < 7) return `${diffInDays} วันที่แล้ว`

  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Navigate to user profile
const navigateToUserProfile = (slug: string) => {
  navigateTo(`/profile/${slug}`)
}

// Sorted users based on selected sort option
const sortedUsers = computed(() => {
  const usersCopy = [...users.value]

  switch (sortBy.value) {
    case 'posts':
      return usersCopy.sort((a, b) => b.postCount - a.postCount)
    case 'likes':
      return usersCopy.sort((a, b) => b.totalLikes - a.totalLikes)
    case 'recent':
      return usersCopy.sort((a, b) => {
        const dateA = a.lastPostAt instanceof Date ? a.lastPostAt.getTime() : (a.lastPostAt as Timestamp).toDate().getTime()
        const dateB = b.lastPostAt instanceof Date ? b.lastPostAt.getTime() : (b.lastPostAt as Timestamp).toDate().getTime()
        return dateB - dateA
      })
    default:
      return usersCopy
  }
})

// Load active users
const loadActiveUsers = async () => {
  if (!firestore) return

  loading.value = true
  try {
    // Get recent posts (last 100 to get more comprehensive data)
    const postsRef = collection(firestore, 'posts')
    const q = query(
      postsRef,
      where('visibility', '==', 'public'),
      orderBy('createdAt', 'desc'),
      limit(100)
    )
    const snapshot = await getDocs(q)

    // Aggregate user stats
    const userStatsMap = new Map<string, {
      userId: string
      displayName?: string
      photoURL?: string
      slug?: string
      postCount: number
      totalLikes: number
      lastPostAt: Timestamp | Date
    }>()

    snapshot.docs.forEach(doc => {
      const data = doc.data()
      const userId = data.userId

      if (!userStatsMap.has(userId)) {
        userStatsMap.set(userId, {
          userId,
          displayName: data.authorName || data.displayName,
          photoURL: data.authorPhotoURL,
          slug: data.authorSlug,
          postCount: 0,
          totalLikes: 0,
          lastPostAt: data.createdAt
        })
      }

      const userStats = userStatsMap.get(userId)!
      userStats.postCount++
      userStats.totalLikes += (data.likesCount || 0)

      // Update last post date if this post is more recent
      const currentPostDate = data.createdAt instanceof Date
        ? data.createdAt.getTime()
        : (data.createdAt as Timestamp).toDate().getTime()
      const lastPostDate = userStats.lastPostAt instanceof Date
        ? userStats.lastPostAt.getTime()
        : (userStats.lastPostAt as Timestamp).toDate().getTime()

      if (currentPostDate > lastPostDate) {
        userStats.lastPostAt = data.createdAt
      }
    })

    // Convert to array
    users.value = Array.from(userStatsMap.values())
  } catch (error) {
    console.error('Error loading active users:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadActiveUsers()
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
