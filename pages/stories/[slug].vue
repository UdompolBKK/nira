<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <Icon name="lucide:loader-2" class="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
        <p class="text-gray-500">กำลังโหลดเรื่องราว...</p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!userProfile" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <Icon name="lucide:user-x" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">ไม่พบผู้ใช้</h3>
        <p class="text-gray-500 mb-6">ไม่พบผู้ใช้ที่คุณค้นหา</p>
        <NuxtLink
          to="/stories"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          กลับไปหน้าเรื่องราวชีวิต
        </NuxtLink>
      </div>
    </div>

    <!-- User Stories -->
    <div v-else class="min-h-screen bg-white">
      <!-- User Profile Header (centered) -->
      <div class="max-w-2xl mx-auto px-4 md:px-8 py-12 text-center">
        <img
          v-if="userProfile.photoURL"
          :src="userProfile.photoURL"
          :alt="userProfile.displayName"
          class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mx-auto mb-6 ring-4 ring-gray-100"
        />
        <div
          v-else
          class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6 ring-4 ring-gray-100"
        >
          {{ getInitial(userProfile.displayName) }}
        </div>

        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {{ userProfile.displayName || 'ผู้ใช้นิรนาม' }}
        </h1>
        <p class="text-gray-500">@{{ userProfile.slug }}</p>
      </div>

      <!-- Main Content -->
      <main class="max-w-2xl mx-auto px-4 md:px-8 pb-12">
        <!-- Empty State -->
        <div v-if="posts.length === 0" class="text-center py-20">
          <Icon name="lucide:file-text" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">ยังไม่มีเรื่องราว</h3>
          <p class="text-sm text-gray-500">ผู้ใช้ยังไม่ได้แชร์เรื่องราวชีวิต</p>
        </div>

        <!-- Posts Timeline (Read-only) -->
        <div v-else class="relative pl-10">
          <!-- Timeline line - thin and subtle -->
          <div class="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />

          <!-- Timeline posts -->
          <div
            v-for="post in posts"
            :key="post.id"
            class="relative mb-6 group/post"
          >
            <!-- Timeline dot -->
            <div class="absolute left-1 top-2 w-2 h-2 rounded-full bg-gray-300 ring-2 ring-white" style="margin-left: -39px;" />

            <!-- Post content - flows naturally like autobiography text -->
            <div
              class="text-gray-800 leading-relaxed prose prose-sm max-w-none"
              v-html="post.content"
            />

            <!-- Actions - show on hover -->
            <div
              class="flex items-center gap-3 mt-2 transition-opacity duration-200 opacity-0 group-hover/post:opacity-100"
            >
              <!-- Mood emoji -->
              <span
                v-if="post.moodCategory"
                class="text-xs opacity-70"
                :title="getMoodLabel(post.moodCategory)"
              >
                {{ getMoodEmoji(post.moodCategory) }}
              </span>
              <!-- Comments Button -->
              <button
                @click="openCommentsModal(post.id)"
                class="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors text-xs"
              >
                <Icon name="lucide:message-circle" class="w-3.5 h-3.5" />
                <span>{{ post.commentsCount || 0 }}</span>
              </button>
              <!-- Likes -->
              <span class="flex items-center gap-1 text-gray-400 text-xs">
                <Icon name="lucide:heart" class="w-3.5 h-3.5" />
                <span>{{ post.likesCount || 0 }}</span>
              </span>
              <!-- Views -->
              <span class="flex items-center gap-1 text-gray-400 text-xs">
                <Icon name="lucide:eye" class="w-3.5 h-3.5" />
                <span>{{ post.viewCount || 0 }}</span>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Comments Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showCommentsModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          @click.self="closeCommentsModal"
        >
          <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 class="text-lg font-bold text-gray-900">ความคิดเห็น</h3>
              <button
                @click="closeCommentsModal"
                class="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Icon name="lucide:x" class="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <!-- Comments List -->
            <div class="flex-1 overflow-y-auto p-6">
              <!-- Loading State -->
              <div v-if="loadingComments" class="text-center py-12">
                <Icon name="lucide:loader-2" class="w-12 h-12 text-gray-300 mx-auto mb-3 animate-spin" />
                <p class="text-sm text-gray-500">กำลังโหลดความคิดเห็น...</p>
              </div>

              <!-- Empty State -->
              <div v-else-if="modalComments.length === 0" class="text-center py-12">
                <Icon name="lucide:message-square-off" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p class="text-sm text-gray-500">ยังไม่มีความคิดเห็น</p>
              </div>

              <!-- Comments List -->
              <div v-else class="space-y-4">
                <div
                  v-for="comment in modalComments"
                  :key="comment.id"
                  class="flex gap-3"
                >
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {{ getInitial(comment.authorName) }}
                  </div>
                  <div class="flex-1 bg-gray-50 rounded-lg p-3">
                    <p class="text-sm font-semibold text-gray-900 mb-1">{{ comment.authorName }}</p>
                    <p class="text-sm text-gray-700">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Comment Input -->
            <div class="border-t border-gray-200 p-6">
              <div class="flex gap-3">
                <input
                  v-model="newComment"
                  type="text"
                  placeholder="เขียนความคิดเห็น..."
                  class="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                  @keyup.enter="submitComment"
                />
                <button
                  @click="submitComment"
                  :disabled="!newComment.trim() || submittingComment"
                  class="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Icon v-if="submittingComment" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                  <span>{{ submittingComment ? 'กำลังส่ง...' : 'ส่ง' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useFirestore } from '~/composables/useFirestore'
import { useAuth } from '~/composables/useAuth'
import { collection, query, where, orderBy, limit, getDocs, type Timestamp } from 'firebase/firestore'
import { MOOD_CATEGORIES } from '~/composables/usePosts'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

interface UserProfile {
  userId: string
  displayName?: string
  photoURL?: string
  slug: string
}

interface Post {
  id: string
  userId: string
  content: string
  excerpt?: string
  moodCategory?: string
  likesCount?: number
  commentsCount?: number
  viewCount?: number
  createdAt: Timestamp | Date
  visibility: string
}

interface Comment {
  id: string
  content: string
  authorName: string
  authorId: string
  createdAt: Timestamp | Date
}

const route = useRoute()
const slug = route.params.slug as string

// Debug
console.log('[stories/slug] Slug from URL:', slug)

const { firestore } = useFirestore()
const { user } = useAuth()
const userProfile = ref<UserProfile | null>(null)
const posts = ref<Post[]>([])
const loading = ref(true)
const totalLikes = computed(() => {
  return posts.value.reduce((sum, post) => sum + (post.likesCount || 0), 0)
})

// Modal state
const showCommentsModal = ref(false)
const currentPostId = ref<string | null>(null)
const modalComments = ref<Comment[]>([])
const newComment = ref('')
const loadingComments = ref(false)
const submittingComment = ref(false)

// Get initial for avatar
const getInitial = (name?: string) => {
  if (!name) return 'U'
  return name.charAt(0).toUpperCase()
}

// Format date (short format for timeline)
const formatDate = (date: Timestamp | Date) => {
  const d = date instanceof Date ? date : date.toDate()
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays === 0) return 'วันนี้'
  if (diffDays === 1) return 'เมื่อวาน'
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`

  return d.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

// Get mood emoji and label
const getMoodEmoji = (mood?: string) => {
  return MOOD_CATEGORIES[mood || 'normal']?.emoji || '😐'
}

const getMoodLabel = (mood?: string) => {
  return MOOD_CATEGORIES[mood || 'normal']?.label || 'ปกติ'
}

// Open comments modal
const openCommentsModal = async (postId: string) => {
  currentPostId.value = postId
  showCommentsModal.value = true
  modalComments.value = []

  loadingComments.value = true
  try {
    // Load comments from API
    const response = await $fetch(`/api/posts/${postId}/comments`)
    modalComments.value = response.comments
  } catch (error) {
    console.error('Error loading comments:', error)
  } finally {
    loadingComments.value = false
  }
}

// Close comments modal
const closeCommentsModal = () => {
  showCommentsModal.value = false
  currentPostId.value = null
  modalComments.value = []
  newComment.value = ''
}

// Submit comment
const submitComment = async () => {
  if (!currentPostId.value || !newComment.value.trim() || !user.value) return

  submittingComment.value = true
  try {
    // Submit comment via API
    const response = await $fetch(`/api/posts/${currentPostId.value}/comments`, {
      method: 'POST',
      body: {
        content: newComment.value,
        authorId: user.value.uid
      }
    })

    // Add to local state for immediate UI update
    modalComments.value.push(response.comment)

    // Update the post's comment count in local state
    const postIndex = posts.value.findIndex(p => p.id === currentPostId.value)
    if (postIndex !== -1) {
      posts.value[postIndex].commentsCount = (posts.value[postIndex].commentsCount || 0) + 1
    }

    // Clear input
    newComment.value = ''
  } catch (error) {
    console.error('Error submitting comment:', error)
    alert('เกิดข้อผิดพลาดในการส่งความคิดเห็น')
  } finally {
    submittingComment.value = false
  }
}

// Load user profile and posts
const loadUserStories = async () => {
  if (!firestore) return

  loading.value = true
  try {
    console.log('[stories/slug] Searching for user with slug:', slug)

    // Find user by slug
    const usersRef = collection(firestore, 'users')
    const userQuery = query(usersRef, where('slug', '==', slug), limit(1))
    const userSnapshot = await getDocs(userQuery)

    console.log('[stories/slug] User query result:', userSnapshot.empty ? 'empty' : 'found', userSnapshot.docs.length)

    if (userSnapshot.empty) {
      console.log('[stories/slug] No user found with slug:', slug)
      userProfile.value = null
      loading.value = false
      return
    }

    const userData = userSnapshot.docs[0].data()
    const userId = userSnapshot.docs[0].id

    console.log('[stories/slug] User found:', {
      userId,
      slug: userData.slug,
      displayName: userData.displayName,
      anonymousName: userData.anonymousName
    })

    userProfile.value = {
      userId,
      displayName: userData.anonymousName || userData.displayName || 'ผู้ใช้นิรนาม',
      photoURL: userData.photoURL,
      slug: userData.slug
    }

    // Set page title
    useHead({
      title: `${userProfile.value.displayName} - เรื่องราวชีวิต | Nira`
    })

    // Load user's public posts (sorted oldest to newest like editor)
    const postsRef = collection(firestore, 'posts')
    const postsQuery = query(
      postsRef,
      where('userId', '==', userId),
      where('visibility', '==', 'public'),
      orderBy('createdAt', 'asc'),
      limit(50)
    )
    const postsSnapshot = await getDocs(postsQuery)

    posts.value = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[]

  } catch (error) {
    console.error('Error loading user stories:', error)
    userProfile.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUserStories()
})
</script>

<style scoped>
/* Timeline prose styles */
.prose {
  @apply text-gray-700 leading-relaxed;
}

.prose :deep(p) {
  @apply mb-2 text-sm;
}

.prose :deep(strong) {
  @apply font-semibold text-gray-900;
}

.prose :deep(em) {
  @apply italic;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>
