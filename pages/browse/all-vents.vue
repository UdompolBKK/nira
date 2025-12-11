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
          <Icon name="lucide:message-circle" class="w-8 h-8 text-purple-600" />
          เรื่องราวที่ได้รับการระบายทั้งหมด
        </h1>
        <p class="text-gray-600">บันทึกที่ผู้คนกำลังระบายความรู้สึก</p>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Filter tabs -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button
          @click="activeFilter = 'all'"
          class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all"
          :class="[
            activeFilter === 'all'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-200'
          ]"
        >
          ทั้งหมด
        </button>
        <button
          v-for="(mood, key) in MOOD_CATEGORIES"
          :key="key"
          @click="activeFilter = key"
          class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all"
          :class="[
            activeFilter === key
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-200'
          ]"
        >
          {{ mood.emoji }} {{ mood.label }}
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="loading && stories.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="i in 9"
          :key="i"
          class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-gray-200" />
            <div class="flex-1">
              <div class="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div class="h-3 w-16 bg-gray-100 rounded" />
            </div>
          </div>
          <div class="h-3 w-full bg-gray-100 rounded mb-2" />
          <div class="h-3 w-3/4 bg-gray-100 rounded mb-2" />
          <div class="h-3 w-1/2 bg-gray-100 rounded" />
        </div>
      </div>

      <!-- Stories grid -->
      <div
        v-else-if="stories.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="story in stories"
          :key="story.id"
          @click="navigateToStory(story.id)"
          class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-purple-300 transition-all cursor-pointer group"
        >
          <!-- Story header -->
          <div class="flex items-center gap-3 mb-4">
            <img
              v-if="story.authorPhotoURL"
              :src="story.authorPhotoURL"
              :alt="story.authorName"
              class="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            <div
              v-else
              class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            >
              {{ getInitial(story.authorName) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900 truncate">{{ story.authorName || 'ผู้ใช้นิรนาม' }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(story.createdAt) }}</p>
            </div>
          </div>

          <!-- Story content preview -->
          <p class="text-gray-700 line-clamp-4 mb-4 group-hover:text-gray-900 transition-colors">
            {{ story.content }}
          </p>

          <!-- Story stats -->
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <div class="flex items-center gap-1">
              <Icon name="lucide:heart" class="w-4 h-4" />
              <span>{{ story.likesCount || 0 }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Icon name="lucide:message-circle" class="w-4 h-4" />
              <span>{{ story.commentsCount || 0 }}</span>
            </div>
            <div
              v-if="story.mood"
              class="flex items-center gap-1 ml-auto px-2 py-1 bg-purple-50 rounded-full"
            >
              <span>{{ getMoodEmoji(story.mood) }}</span>
              <span class="text-xs">{{ getMoodLabel(story.mood) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="text-center py-16 bg-white rounded-2xl border border-gray-200"
      >
        <Icon name="lucide:message-circle" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p class="text-gray-500">ไม่พบเรื่องราวที่ได้รับการระบาย</p>
      </div>

      <!-- Load more button -->
      <div
        v-if="hasMore && stories.length > 0"
        class="text-center mt-8"
      >
        <button
          @click="loadMore"
          :disabled="loading"
          class="px-8 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-full hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center gap-2">
            <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
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
import { collection, query, where, orderBy, limit, getDocs, startAfter, type Timestamp, type QueryDocumentSnapshot } from 'firebase/firestore'
import { MOOD_CATEGORIES, type MoodCategory } from '~/composables/usePosts'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'เรื่องราวที่ได้รับการระบายทั้งหมด - Nira',
  meta: [
    {
      name: 'description',
      content: 'ดูเรื่องราวที่ได้รับการระบายทั้งหมดจากผู้ใช้ในชุมชนบันทึกนิรนาม - แชร์ประสบการณ์ชีวิตและความรู้สึกอย่างนิรนาม'
    },
    {
      property: 'og:title',
      content: 'เรื่องราวที่ได้รับการระบายทั้งหมด - Nira'
    },
    {
      property: 'og:description',
      content: 'ดูเรื่องราวและบันทึกที่ผู้คนกำลังระบายความรู้สึก'
    }
  ]
})

interface VentedStory {
  id: string
  content: string
  authorName?: string
  authorPhotoURL?: string
  userId: string
  mood?: string
  likesCount?: number
  commentsCount?: number
  createdAt: Timestamp | Date
}

const { firestore } = useFirestore()
const stories = ref<VentedStory[]>([])
const loading = ref(true)
const hasMore = ref(true)
const lastDoc = ref<QueryDocumentSnapshot | null>(null)
const activeFilter = ref<'all' | MoodCategory>('all')

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

// Load stories
const loadStories = async (loadMoreMode = false) => {
  if (!firestore) return

  loading.value = true
  try {
    const postsRef = collection(firestore, 'storyPosts')
    let q = query(
      postsRef,
      where('visibility', '==', 'public'),
      orderBy('createdAt', 'desc'),
      limit(12)
    )

    // Apply mood filter
    if (activeFilter.value !== 'all') {
      q = query(
        postsRef,
        where('visibility', '==', 'public'),
        where('mood', '==', activeFilter.value),
        orderBy('createdAt', 'desc'),
        limit(12)
      )
    }

    // Apply pagination
    if (loadMoreMode && lastDoc.value) {
      q = query(
        postsRef,
        where('visibility', '==', 'public'),
        ...(activeFilter.value !== 'all' ? [where('mood', '==', activeFilter.value)] : []),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc.value),
        limit(12)
      )
    }

    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      hasMore.value = false
      return
    }

    // Get posts data
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as VentedStory[]

    // Get unique user IDs
    const userIds = [...new Set(posts.map(p => p.userId))]

    // Fetch user profiles
    const usersRef = collection(firestore, 'users')
    const userProfilesMap = new Map<string, { displayName?: string; photoURL?: string }>()

    for (const userId of userIds) {
      try {
        const userDoc = await getDocs(query(usersRef, where('__name__', '==', userId), limit(1)))
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data()
          userProfilesMap.set(userId, {
            displayName: userData.displayName,
            photoURL: userData.photoURL
          })
        }
      } catch (err) {
        console.error('Error fetching user:', userId, err)
      }
    }

    // Merge user data with posts
    const newStories = posts.map(post => ({
      ...post,
      authorName: userProfilesMap.get(post.userId)?.displayName || 'ผู้ใช้นิรนาม',
      authorPhotoURL: userProfilesMap.get(post.userId)?.photoURL
    }))

    if (loadMoreMode) {
      stories.value = [...stories.value, ...newStories]
    } else {
      stories.value = newStories
    }

    lastDoc.value = snapshot.docs[snapshot.docs.length - 1]
    hasMore.value = snapshot.docs.length === 12
  } catch (error) {
    console.error('Error loading stories:', error)
  } finally {
    loading.value = false
  }
}

// Load more stories
const loadMore = () => {
  loadStories(true)
}

// Watch filter changes
watch(activeFilter, () => {
  lastDoc.value = null
  hasMore.value = true
  loadStories(false)
})

onMounted(() => {
  loadStories(false)
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

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
