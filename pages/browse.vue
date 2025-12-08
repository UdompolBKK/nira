<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <h1 class="text-2xl font-semibold text-gray-900">เรื่องราวของคนอื่น</h1>
        <p class="text-sm text-gray-500 mt-1">ค้นพบเรื่องราวและความรู้สึกจากคนในชุมชน</p>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-6 py-8 space-y-16">
      <!-- Section 1: Latest Vented Stories -->
      <section>
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">เรื่องราวที่ได้รับการระบายล่าสุด</h2>
            <p class="text-sm text-gray-500 mt-1">บันทึกที่ผู้คนกำลังระบายความรู้สึก</p>
          </div>
          <NuxtLink
            to="/browse/all-vents"
            class="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 group"
          >
            ดูทั้งหมด
            <Icon name="lucide:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
        </div>

        <!-- Loading state -->
        <div v-if="loadingVents" class="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
          <div
            v-for="i in 5"
            :key="i"
            class="flex-shrink-0 w-80 bg-gray-50 rounded-xl p-5 animate-pulse"
          >
            <div class="h-3 w-20 bg-gray-200 rounded mb-3" />
            <div class="h-2 w-full bg-gray-200 rounded mb-2" />
            <div class="h-2 w-3/4 bg-gray-200 rounded mb-2" />
            <div class="h-2 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>

        <!-- Vented stories slider -->
        <div
          v-else-if="ventedStories.length > 0"
          class="flex gap-3 overflow-x-auto pb-4 hide-scrollbar"
        >
          <div
            v-for="story in ventedStories"
            :key="story.id"
            @click="navigateToStory(story.id)"
            class="flex-shrink-0 w-80 bg-gray-50 hover:bg-gray-100 rounded-xl p-5 transition-all cursor-pointer group"
          >
            <!-- Story header -->
            <div class="flex items-center gap-3 mb-3">
              <img
                v-if="story.authorPhotoURL"
                :src="story.authorPhotoURL"
                :alt="story.authorName"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div
                v-else
                class="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-sm flex-shrink-0"
              >
                {{ getInitial(story.authorName) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 text-sm truncate">{{ story.authorName || 'ผู้ใช้นิรนาม' }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(story.createdAt) }}</p>
              </div>
            </div>

            <!-- Story content preview -->
            <p class="text-sm text-gray-700 line-clamp-3 mb-3 leading-relaxed">
              {{ story.content }}
            </p>

            <!-- Story stats -->
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <div class="flex items-center gap-1">
                <Icon name="lucide:heart" class="w-3.5 h-3.5" />
                <span>{{ story.likesCount || 0 }}</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon name="lucide:message-circle" class="w-3.5 h-3.5" />
                <span>{{ story.commentsCount || 0 }}</span>
              </div>
              <div
                v-if="story.mood"
                class="flex items-center gap-1 ml-auto"
              >
                <span class="text-sm">{{ getMoodEmoji(story.mood) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-else
          class="text-center py-12 text-gray-400 text-sm"
        >
          ยังไม่มีเรื่องราวที่ได้รับการระบาย
        </div>
      </section>

      <!-- Section 2: Active Users -->
      <section>
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">ผู้ใช้ที่โพสเรื่องราวชีวิตล่าสุด</h2>
            <p class="text-sm text-gray-500 mt-1">ผู้ใช้ที่กำลังแชร์ประสบการณ์ชีวิต</p>
          </div>
          <NuxtLink
            to="/browse/all-users"
            class="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 group"
          >
            ดูทั้งหมด
            <Icon name="lucide:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
        </div>

        <!-- Loading state -->
        <div v-if="loadingUsers" class="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
          <div
            v-for="i in 5"
            :key="i"
            class="flex-shrink-0 w-48 bg-gray-50 rounded-xl p-5 animate-pulse text-center"
          >
            <div class="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3" />
            <div class="h-3 w-20 bg-gray-200 rounded mx-auto mb-2" />
            <div class="h-2 w-12 bg-gray-200 rounded mx-auto" />
          </div>
        </div>

        <!-- Active users slider -->
        <div
          v-else-if="activeUsers.length > 0"
          class="flex gap-3 overflow-x-auto pb-4 hide-scrollbar"
        >
          <div
            v-for="user in activeUsers"
            :key="user.userId"
            @click="navigateToUserProfile(user.slug)"
            class="flex-shrink-0 w-48 bg-gray-50 hover:bg-gray-100 rounded-xl p-5 transition-all cursor-pointer group text-center"
          >
            <!-- User avatar -->
            <img
              v-if="user.photoURL"
              :src="user.photoURL"
              :alt="user.displayName"
              class="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
            />
            <div
              v-else
              class="w-16 h-16 rounded-full mx-auto mb-3 bg-gray-900 flex items-center justify-center text-white font-medium text-lg"
            >
              {{ getInitial(user.displayName) }}
            </div>

            <!-- User info -->
            <h3 class="font-medium text-gray-900 text-sm mb-1 truncate">
              {{ user.displayName || 'ผู้ใช้นิรนาม' }}
            </h3>
            <p class="text-xs text-gray-500 mb-3 truncate">@{{ user.slug || 'user' }}</p>

            <!-- User stats -->
            <div class="flex items-center justify-center gap-3 text-xs text-gray-600">
              <div>
                <span class="font-medium text-gray-900">{{ user.postCount || 0 }}</span> บันทึก
              </div>
              <div>
                <span class="font-medium text-gray-900">{{ user.totalLikes || 0 }}</span> ถูกใจ
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
      to="/editor"
      class="fixed bottom-6 right-6 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors z-50 shadow-lg"
    >
      <Icon name="lucide:plus" class="w-5 h-5" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useFirestore } from '~/composables/useFirestore'
import { collection, query, where, orderBy, limit, getDocs, type Timestamp } from 'firebase/firestore'
import { MOOD_CATEGORIES } from '~/composables/usePosts'

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
  authorName?: string
  authorSlug?: string
  authorPhotoURL?: string
  userId: string
  mood?: string
  likesCount?: number
  commentsCount?: number
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

// Load vented stories (posts with comments)
const loadVentedStories = async () => {
  if (!firestore) return

  loadingVents.value = true
  try {
    const postsRef = collection(firestore, 'posts')
    const q = query(
      postsRef,
      where('visibility', '==', 'public'),
      orderBy('createdAt', 'desc'),
      limit(10)
    )
    const snapshot = await getDocs(q)

    // Get posts data
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as VentedStory[]

    // Get unique user IDs
    const userIds = [...new Set(posts.map(p => p.userId))]

    // Fetch user profiles
    const usersRef = collection(firestore, 'users')
    const userProfilesMap = new Map<string, { displayName?: string; slug?: string; photoURL?: string }>()

    for (const userId of userIds) {
      try {
        const userDoc = await getDocs(query(usersRef, where('__name__', '==', userId), limit(1)))
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data()
          userProfilesMap.set(userId, {
            displayName: userData.displayName,
            slug: userData.slug,
            photoURL: userData.photoURL
          })
        }
      } catch (err) {
        console.error('Error fetching user:', userId, err)
      }
    }

    // Merge user data with posts
    ventedStories.value = posts.map(post => ({
      ...post,
      authorName: userProfilesMap.get(post.userId)?.displayName || 'ผู้ใช้นิรนาม',
      authorSlug: userProfilesMap.get(post.userId)?.slug || 'user',
      authorPhotoURL: userProfilesMap.get(post.userId)?.photoURL
    }))
  } catch (error) {
    console.error('Error loading vented stories:', error)
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
    const postsRef = collection(firestore, 'posts')
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
            displayName: userData.displayName,
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
</style>
