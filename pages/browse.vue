<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        <h1 class="text-xl md:text-2xl font-semibold text-gray-900">เรื่องราวของคนอื่น</h1>
        <p class="text-xs md:text-sm text-gray-500 mt-1">ค้นพบเรื่องราวและความรู้สึกจากคนในชุมชน</p>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-10 md:space-y-16">
      <!-- Section 1: Latest Vented Stories -->
      <section>
        <div class="flex items-center justify-between mb-6 md:mb-8">
          <div class="flex-1 min-w-0">
            <h2 class="text-lg md:text-xl font-semibold text-gray-900 truncate">เรื่องราวที่ได้รับการระบายล่าสุด</h2>
            <p class="text-xs md:text-sm text-gray-500 mt-1 hidden sm:block">บันทึกที่ผู้คนกำลังระบายความรู้สึก</p>
          </div>
          <NuxtLink
            to="/problems"
            class="text-xs md:text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 group whitespace-nowrap ml-4"
          >
            ดูทั้งหมด
            <Icon name="lucide:arrow-right" class="w-3.5 md:w-4 h-3.5 md:h-4 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
        </div>

        <!-- Loading state -->
        <div v-if="loadingVents" class="flex gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <div
            v-for="i in 5"
            :key="i"
            class="flex-shrink-0 w-72 md:w-80 bg-gray-50 rounded-xl p-4 md:p-5 animate-pulse"
          >
            <div class="h-3 w-20 bg-gray-200 rounded mb-3" />
            <div class="h-2 w-full bg-gray-200 rounded mb-2" />
            <div class="h-2 w-3/4 bg-gray-200 rounded mb-2" />
            <div class="h-2 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>

        <!-- Vented stories slider with Splide (Client-side only) -->
        <ClientOnly v-if="ventedStories.length > 0">
          <div class="vent-stories-slider">
            <Splide :options="splideOptions" class="vent-splide">
              <SplideSlide v-for="story in ventedStories" :key="story.id">
                <div style="padding-bottom: 20px;">
                  <VentCard :post="story" variant="compact" />
                </div>
              </SplideSlide>
            </Splide>
          </div>
          <template #fallback>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <VentCard v-for="story in ventedStories.slice(0, 3)" :key="story.id" :post="story" variant="compact" />
            </div>
          </template>
        </ClientOnly>

        <!-- Empty state -->
        <div
          v-if="!loadingVents && ventedStories.length === 0"
          class="text-center py-12 text-gray-400 text-sm"
        >
          ยังไม่มีเรื่องราวที่ได้รับการระบาย
        </div>
      </section>

      <!-- Section 2: Active Users -->
      <section>
        <div class="flex items-center justify-between mb-6 md:mb-8">
          <div class="flex-1 min-w-0">
            <h2 class="text-lg md:text-xl font-semibold text-gray-900 truncate">ผู้ใช้ที่โพสเรื่องราวชีวิตล่าสุด</h2>
            <p class="text-xs md:text-sm text-gray-500 mt-1 hidden sm:block">ผู้ใช้ที่กำลังแชร์ประสบการณ์ชีวิต</p>
          </div>
          <NuxtLink
            to="/stories"
            class="text-xs md:text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 group whitespace-nowrap ml-4"
          >
            ดูทั้งหมด
            <Icon name="lucide:arrow-right" class="w-3.5 md:w-4 h-3.5 md:h-4 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
        </div>

        <!-- Loading state -->
        <div v-if="loadingUsers" class="flex gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <div
            v-for="i in 5"
            :key="i"
            class="flex-shrink-0 w-40 md:w-48 bg-gray-50 rounded-xl p-4 md:p-5 animate-pulse text-center"
          >
            <div class="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-200 mx-auto mb-3" />
            <div class="h-3 w-20 bg-gray-200 rounded mx-auto mb-2" />
            <div class="h-2 w-12 bg-gray-200 rounded mx-auto" />
          </div>
        </div>

        <!-- Active users slider -->
        <div
          v-else-if="activeUsers.length > 0"
          class="flex gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
        >
          <div
            v-for="user in activeUsers"
            :key="user.userId"
            @click="navigateToUserProfile(user.slug)"
            class="flex-shrink-0 w-40 md:w-48 bg-gray-50 hover:bg-gray-100 rounded-xl p-4 md:p-5 transition-all cursor-pointer group text-center"
          >
            <!-- User avatar -->
            <img
              v-if="user.photoURL"
              :src="user.photoURL"
              :alt="user.displayName"
              class="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto mb-2 md:mb-3 object-cover"
            />
            <div
              v-else
              class="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto mb-2 md:mb-3 bg-gray-900 flex items-center justify-center text-white font-medium text-base md:text-lg"
            >
              {{ getInitial(user.displayName) }}
            </div>

            <!-- User info -->
            <h3 class="font-medium text-gray-900 text-xs md:text-sm mb-1 truncate px-1">
              {{ user.displayName || 'ผู้ใช้นิรนาม' }}
            </h3>
            <p class="text-xs text-gray-500 mb-2 md:mb-3 truncate px-1">@{{ user.slug || 'user' }}</p>

            <!-- User stats -->
            <div class="flex items-center justify-center gap-2 md:gap-3 text-xs text-gray-600">
              <div class="flex flex-col md:flex-row md:gap-1">
                <span class="font-medium text-gray-900">{{ user.postCount || 0 }}</span> <span class="hidden md:inline">บันทึก</span>
              </div>
              <div class="flex flex-col md:flex-row md:gap-1">
                <span class="font-medium text-gray-900">{{ user.totalLikes || 0 }}</span> <span class="hidden md:inline">ถูกใจ</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-else
          class="text-center py-12 text-gray-400 text-sm"
        >
          ยังไม่มีผู้ใช้ที่โพสเรื่องราวล่าสุด
        </div>
      </section>
    </main>

    <!-- FAB - Write button -->
    <NuxtLink
      to="/my-story"
      class="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 md:w-12 md:h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors z-50 shadow-lg active:scale-95"
    >
      <Icon name="lucide:plus" class="w-6 h-6 md:w-5 md:h-5" />
    </NuxtLink>
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
  title: 'อ่านบันทึก - Nira'
})

interface VentedStory {
  id: string
  content: string
  authorName: string
  authorSlug?: string
  authorPhoto?: string | null
  authorPhotoURL?: string | null
  userId: string
  mood?: string
  moodCategory?: string
  likeCount?: number
  likesCount?: number
  commentCount?: number
  commentsCount?: number
  viewCount?: number
  excerpt?: string
  createdAt: Timestamp | Date
}

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
const ventedStories = ref<VentedStory[]>([])
const activeUsers = ref<ActiveUser[]>([])
const loadingVents = ref(true)
const loadingUsers = ref(true)

// Splide Carousel Settings
const splideOptions = {
  type: 'loop',
  perPage: 3,
  perMove: 1,
  gap: '1rem',
  padding: '3rem',
  arrows: true,
  pagination: false,
  breakpoints: {
    1024: {
      perPage: 2,
    },
    640: {
      perPage: 1,
      padding: '1rem',
    }
  }
}

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

// Get mood emoji and label
const getMoodEmoji = (mood: string) => {
  return MOOD_CATEGORIES[mood as keyof typeof MOOD_CATEGORIES]?.emoji || '😊'
}

const getMoodLabel = (mood: string) => {
  return MOOD_CATEGORIES[mood as keyof typeof MOOD_CATEGORIES]?.label || ''
}

// Navigate to story detail
const navigateToStory = (storyId: string) => {
  navigateTo(`/my-problem/${storyId}`)
}

// Navigate to user profile
const navigateToUserProfile = (slug: string) => {
  navigateTo(`/profile/${slug}`)
}

// Load vented stories using API
const loadVentedStories = async () => {
  loadingVents.value = true
  try {
    const response = await $fetch<{ vents: any[] }>('/api/vents', {
      params: {
        limit: '10'
      }
    })

    ventedStories.value = response.vents.map((data: any) => ({
      id: data.id,
      userId: data.userId,
      authorName: data.authorName || 'ไม่ระบุชื่อ',
      authorSlug: data.authorSlug,
      authorPhoto: data.authorPhoto,
      authorPhotoURL: data.authorPhoto,
      content: data.content,
      excerpt: data.excerpt || data.content?.replace(/<[^>]*>/g, '').substring(0, 150),
      moodCategory: data.moodCategory || 'normal',
      likeCount: typeof data.likeCount === 'number' ? data.likeCount : 0,
      commentCount: typeof data.commentCount === 'number' ? data.commentCount : 0,
      viewCount: typeof data.viewCount === 'number' ? data.viewCount : 0,
      createdAt: new Date(data.createdAt)
    }))
  } catch (error) {
    console.error('Error loading vented stories:', error)
    ventedStories.value = []
  } finally {
    loadingVents.value = false
  }
}

// Load active users
const loadActiveUsers = async () => {
  if (!firestore) return

  loadingUsers.value = true
  try {
    // Get recent posts
    const postsRef = collection(firestore, 'storyPosts')
    const q = query(
      postsRef,
      where('visibility', '==', 'public'),
      orderBy('createdAt', 'desc'),
      limit(50)
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

    // Sort by post count and take top 10
    activeUsers.value = usersData
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 10)
  } catch (error) {
    console.error('Error loading active users:', error)
  } finally {
    loadingUsers.value = false
  }
}

onMounted(() => {
  loadVentedStories()
  loadActiveUsers()
})
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Splide Carousel Styles */
.vent-splide {
  padding-bottom: 2rem;
}

.vent-splide :deep(.splide__arrow) {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  opacity: 1;
  transition: all 0.2s ease;
}

.vent-splide :deep(.splide__arrow:hover) {
  background: #f9fafb;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.vent-splide :deep(.splide__arrow--prev) {
  left: -1.5rem;
}

.vent-splide :deep(.splide__arrow--next) {
  right: -1.5rem;
}

.vent-splide :deep(.splide__arrow svg) {
  fill: #374151;
}

.vent-splide :deep(.splide__arrow:disabled) {
  opacity: 0.3;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .vent-splide :deep(.splide__arrow) {
    width: 40px;
    height: 40px;
  }

  .vent-splide :deep(.splide__arrow--prev) {
    left: -0.5rem;
  }

  .vent-splide :deep(.splide__arrow--next) {
    right: -0.5rem;
  }
}
</style>
