<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <Icon name="lucide:loader-2" class="w-12 h-12 text-purple-500 animate-spin" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen px-4">
      <Icon name="lucide:user-x" class="w-24 h-24 text-gray-300 mb-4" />
      <h1 class="text-2xl font-bold text-gray-900 mb-2">ไม่พบผู้ใช้</h1>
      <p class="text-gray-600 mb-6">ผู้ใช้ที่คุณกำลังมองหาอาจไม่มีอยู่ในระบบ</p>
      <NuxtLink
        to="/browse"
        class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition-all"
      >
        กลับหน้าหลัก
      </NuxtLink>
    </div>

    <!-- Profile content -->
    <div v-else-if="userProfile" class="max-w-5xl mx-auto px-4 py-8">
      <!-- Header with back button -->
      <NuxtLink
        to="/browse"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <Icon name="lucide:arrow-left" class="w-5 h-5" />
        กลับ
      </NuxtLink>

      <!-- Profile Card -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-8">
        <!-- Cover gradient -->
        <div class="h-32 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500"></div>

        <!-- Profile info -->
        <div class="px-8 pb-8">
          <!-- Avatar -->
          <div class="relative -mt-16 mb-4">
            <img
              v-if="userProfile.photoURL"
              :src="userProfile.photoURL"
              :alt="userProfile.displayName"
              class="w-32 h-32 rounded-full border-8 border-white shadow-xl object-cover"
            />
            <div
              v-else
              class="w-32 h-32 rounded-full border-8 border-white shadow-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-4xl"
            >
              {{ getInitial(userProfile.displayName) }}
            </div>
          </div>

          <!-- User details -->
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ userProfile.displayName || 'ผู้ใช้นิรนาม' }}</h1>
            <p class="text-gray-600 text-lg">@{{ userProfile.slug || 'user' }}</p>
            <p v-if="userProfile.bio" class="text-gray-700 mt-4">{{ userProfile.bio }}</p>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-purple-50 rounded-2xl p-4 text-center">
              <p class="text-3xl font-bold text-purple-600">{{ userPosts.length }}</p>
              <p class="text-sm text-gray-600 mt-1">บันทึก</p>
            </div>
            <div class="bg-pink-50 rounded-2xl p-4 text-center">
              <p class="text-3xl font-bold text-pink-600">{{ totalLikes }}</p>
              <p class="text-sm text-gray-600 mt-1">ถูกใจ</p>
            </div>
            <div class="bg-blue-50 rounded-2xl p-4 text-center">
              <p class="text-3xl font-bold text-blue-600">{{ totalComments }}</p>
              <p class="text-sm text-gray-600 mt-1">ความคิดเห็น</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Posts section -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Icon name="lucide:book-open" class="w-7 h-7 text-purple-600" />
          บันทึกของ {{ userProfile.displayName || 'ผู้ใช้' }}
        </h2>

        <!-- Loading posts -->
        <div v-if="loadingPosts" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="i in 4"
            :key="i"
            class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse"
          >
            <div class="h-4 w-24 bg-gray-200 rounded mb-3" />
            <div class="h-3 w-full bg-gray-100 rounded mb-2" />
            <div class="h-3 w-3/4 bg-gray-100 rounded" />
          </div>
        </div>

        <!-- Posts grid -->
        <div
          v-else-if="userPosts.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div
            v-for="post in userPosts"
            :key="post.id"
            @click="navigateToPost(post.id)"
            class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-purple-300 transition-all cursor-pointer group"
          >
            <!-- Post header -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <Icon name="lucide:clock" class="w-4 h-4" />
                {{ formatDate(post.createdAt) }}
              </div>
              <div
                v-if="post.mood"
                class="px-2 py-1 bg-purple-50 rounded-full text-xs flex items-center gap-1"
              >
                <span>{{ getMoodEmoji(post.mood) }}</span>
                <span>{{ getMoodLabel(post.mood) }}</span>
              </div>
            </div>

            <!-- Post content -->
            <p class="text-gray-700 line-clamp-4 mb-4 group-hover:text-gray-900 transition-colors">
              {{ post.content }}
            </p>

            <!-- Post stats -->
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <div class="flex items-center gap-1">
                <Icon name="lucide:heart" class="w-4 h-4" />
                <span>{{ post.likesCount || 0 }}</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon name="lucide:message-circle" class="w-4 h-4" />
                <span>{{ post.commentsCount || 0 }}</span>
              </div>
              <div class="ml-auto">
                <span
                  class="px-2 py-1 bg-gray-100 rounded-full text-xs"
                  :class="{
                    'bg-green-100 text-green-700': post.visibility === 'public',
                    'bg-gray-100 text-gray-700': post.visibility !== 'public'
                  }"
                >
                  {{ post.visibility === 'public' ? 'สาธารณะ' : 'ส่วนตัว' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty posts -->
        <div
          v-else
          class="text-center py-16 bg-white rounded-2xl border border-gray-200"
        >
          <Icon name="lucide:book-open" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p class="text-gray-500">ยังไม่มีบันทึกสาธารณะ</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFirestore } from '~/composables/useFirestore'
import { collection, query, where, getDocs, orderBy, limit, type Timestamp } from 'firebase/firestore'
import { MOOD_CATEGORIES } from '~/composables/usePosts'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

interface UserProfile {
  id: string
  displayName?: string
  photoURL?: string
  slug?: string
  bio?: string
  createdAt: Timestamp | Date
}

interface Post {
  id: string
  content: string
  mood?: string
  visibility: string
  likesCount?: number
  commentsCount?: number
  createdAt: Timestamp | Date
}

const route = useRoute()
const { firestore } = useFirestore()

const slug = computed(() => route.params.slug as string)
const userProfile = ref<UserProfile | null>(null)
const userPosts = ref<Post[]>([])
const loading = ref(true)
const loadingPosts = ref(true)
const error = ref(false)

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

// Navigate to post
const navigateToPost = (postId: string) => {
  navigateTo(`/my-problem/${postId}`)
}

// Calculate total likes and comments
const totalLikes = computed(() => {
  return userPosts.value.reduce((sum, post) => sum + (post.likesCount || 0), 0)
})

const totalComments = computed(() => {
  return userPosts.value.reduce((sum, post) => sum + (post.commentsCount || 0), 0)
})

// Load user profile by slug
const loadUserProfile = async () => {
  if (!firestore) return

  loading.value = true
  error.value = false

  try {
    const usersRef = collection(firestore, 'users')
    const q = query(usersRef, where('slug', '==', slug.value), limit(1))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      error.value = true
      return
    }

    const doc = snapshot.docs[0]
    userProfile.value = {
      id: doc.id,
      ...doc.data()
    } as UserProfile

    // Set page title and meta tags
    useHead({
      title: `${userProfile.value.displayName || 'ผู้ใช้'} - บันทึกนิรนาม.com`,
      meta: [
        {
          name: 'description',
          content: `ดูโปรไฟล์และบันทึกของ ${userProfile.value.displayName || 'ผู้ใช้'} - ${userPosts.value.length} บันทึก`
        },
        {
          property: 'og:title',
          content: `${userProfile.value.displayName || 'ผู้ใช้'} - บันทึกนิรนาม`
        },
        {
          property: 'og:description',
          content: `ดูบันทึกและเรื่องราวจาก ${userProfile.value.displayName}`
        },
        {
          property: 'og:image',
          content: userProfile.value.photoURL || 'https://banthukniranan.com/og-default.jpg'
        },
        {
          property: 'og:type',
          content: 'profile'
        },
        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:title',
          content: `${userProfile.value.displayName || 'ผู้ใช้'} - บันทึกนิรนาม`
        },
        {
          name: 'twitter:description',
          content: `ดูบันทึกและเรื่องราวจาก ${userProfile.value.displayName}`
        },
        {
          name: 'twitter:image',
          content: userProfile.value.photoURL || 'https://banthukniranan.com/og-default.jpg'
        }
      ]
    })

    // Load user posts
    await loadUserPosts(doc.id)
  } catch (err) {
    console.error('Error loading user profile:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// Load user posts
const loadUserPosts = async (userId: string) => {
  if (!firestore) return

  loadingPosts.value = true
  try {
    const postsRef = collection(firestore, 'posts')
    const q = query(
      postsRef,
      where('userId', '==', userId),
      where('visibility', '==', 'public'),
      orderBy('createdAt', 'desc'),
      limit(20)
    )
    const snapshot = await getDocs(q)

    userPosts.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[]
  } catch (err) {
    console.error('Error loading user posts:', err)
  } finally {
    loadingPosts.value = false
  }
}

onMounted(() => {
  loadUserProfile()
})
</script>

<style scoped>
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
