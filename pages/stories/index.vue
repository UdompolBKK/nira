<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <NuxtLink to="/" class="hover:text-gray-900 transition-colors">หน้าหลัก</NuxtLink>
          <Icon name="lucide:chevron-right" class="w-4 h-4" />
          <span class="text-gray-900 font-medium">เรื่องราวชีวิต</span>
        </nav>

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl md:text-2xl font-semibold text-gray-900">เรื่องราวชีวิต</h1>
            <p class="text-xs md:text-sm text-gray-500 mt-1">ผู้ใช้ที่กำลังแชร์ประสบการณ์ชีวิต</p>
          </div>

          <!-- Write Story Button -->
          <button
            @click="handleWriteStory"
            class="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all hover:shadow-lg"
          >
            <Icon name="lucide:plus" class="w-5 h-5" />
            <span class="hidden md:inline">เขียนเรื่องราว</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <!-- Loading state -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <Icon name="lucide:loader-2" class="w-10 h-10 text-gray-400 animate-spin mb-4" />
        <p class="text-sm text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Users grid -->
      <Transition name="fade-in">
        <div
          v-if="!loading && users.length > 0"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <div
            v-for="user in users"
            :key="user.userId"
            @click="navigateToUserProfile(user.slug)"
            class="bg-white hover:bg-gray-50 rounded-xl p-4 md:p-5 transition-all cursor-pointer group text-center border border-gray-100 hover:border-gray-200 hover:shadow-md"
          >
          <!-- User avatar -->
          <img
            v-if="user.photoURL"
            :src="user.photoURL"
            :alt="user.displayName"
            class="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-3 object-cover ring-2 ring-gray-100 group-hover:ring-gray-200 transition-all"
          />
          <div
            v-else
            class="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-3 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl ring-2 ring-gray-100 group-hover:ring-gray-200 transition-all"
          >
            {{ getInitial(user.displayName) }}
          </div>

          <!-- User info -->
          <h3 class="font-semibold text-gray-900 text-sm mb-1 truncate">
            {{ user.displayName || 'ผู้ใช้นิรนาม' }}
          </h3>
          <p class="text-xs text-gray-500 mb-3 truncate">@{{ user.slug || 'user' }}</p>

          <!-- User stats -->
          <div class="flex items-center justify-center gap-3 text-xs text-gray-600">
            <div class="flex flex-col">
              <span class="font-semibold text-gray-900">{{ user.postCount || 0 }}</span>
              <span class="text-gray-500">บันทึก</span>
            </div>
            <div class="flex flex-col">
              <span class="font-semibold text-gray-900">{{ user.totalLikes || 0 }}</span>
              <span class="text-gray-500">ถูกใจ</span>
            </div>
          </div>
        </div>
      </div>
      </Transition>

      <!-- Empty state -->
      <div
        v-if="!loading && users.length === 0"
        class="text-center py-20"
      >
        <Icon name="lucide:users" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">ยังไม่มีผู้ใช้</h3>
        <p class="text-sm text-gray-500">ยังไม่มีผู้ใช้ที่โพสเรื่องราวในชุมชน</p>
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
import { useFirestore } from '~/composables/useFirestore'
import { useAuth } from '~/composables/useAuth'
import { collection, query, where, orderBy, limit, getDocs, type Timestamp } from 'firebase/firestore'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'เรื่องราวชีวิต - Nira'
})

const { user } = useAuth()

interface ActiveUser {
  userId: string
  displayName?: string
  photoURL?: string
  slug: string
  postCount: number
  totalLikes: number
  lastPostAt: Timestamp | Date
}

const { firestore } = useFirestore()
const users = ref<ActiveUser[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const hasMore = ref(true)
const pageSize = 50

// Get initial for avatar
const getInitial = (name?: string) => {
  if (!name) return 'U'
  return name.charAt(0).toUpperCase()
}

// Navigate to user stories
const navigateToUserProfile = (slug: string) => {
  console.log('[stories/index] Navigating to:', slug)
  navigateTo(`/stories/${slug}`)
}

// Load users
const loadUsers = async () => {
  if (!firestore) return

  loading.value = true
  try {
    // Get recent posts
    const postsRef = collection(firestore, 'storyPosts')
    const q = query(
      postsRef,
      where('visibility', '==', 'public'),
      orderBy('createdAt', 'desc'),
      limit(100)
    )
    const snapshot = await getDocs(q)

    // Aggregate user stats by userId
    const userStatsMap = new Map<string, {
      userId: string
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
          postCount: 0,
          totalLikes: 0,
          lastPostAt: data.createdAt
        })
      }

      const userStats = userStatsMap.get(userId)!
      userStats.postCount++
      userStats.totalLikes += (data.likesCount || 0)
    })

    // Get unique user IDs
    const userIds = Array.from(userStatsMap.keys())

    // Fetch user profiles from users collection
    const usersRef = collection(firestore, 'users')
    const usersData: ActiveUser[] = []

    for (const userId of userIds) {
      try {
        const userDoc = await getDocs(query(usersRef, where('__name__', '==', userId), limit(1)))
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data()
          const stats = userStatsMap.get(userId)!

          usersData.push({
            userId,
            displayName: userData.anonymousName || userData.displayName || 'ไม่ระบุชื่อ',
            photoURL: userData.photoURL,
            slug: userData.slug || 'user',
            postCount: stats.postCount,
            totalLikes: stats.totalLikes,
            lastPostAt: stats.lastPostAt
          })
        }
      } catch (err) {
        console.error('Error fetching user:', userId, err)
      }
    }

    // Sort by post count
    users.value = usersData.sort((a, b) => b.postCount - a.postCount)
    hasMore.value = users.value.length >= pageSize
  } catch (error) {
    console.error('Error loading users:', error)
  } finally {
    loading.value = false
  }
}

// Handle write story button click
const handleWriteStory = () => {
  if (!user.value) {
    // Redirect to login if not authenticated
    navigateTo('/login')
    return
  }
  // Redirect to my-story page
  navigateTo('/my-story')
}

// Load more users
const loadMore = () => {
  // For now, just disable load more
  hasMore.value = false
}

onMounted(() => {
  loadUsers()
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
