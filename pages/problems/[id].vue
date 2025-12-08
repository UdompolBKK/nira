<template>
  <div class="min-h-screen bg-white">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-24">
      <Icon name="lucide:loader-2" class="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
      <p class="text-gray-500">กำลังโหลดโพสต์...</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!post" class="text-center py-24">
      <Icon name="lucide:file-x" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 mb-2">ไม่พบโพสต์</h3>
      <NuxtLink to="/problems" class="text-gray-600 hover:text-gray-900 text-sm">
        ← กลับไปดูเรื่องราวทั้งหมด
      </NuxtLink>
    </div>

    <!-- Post Content -->
    <div v-else class="min-h-screen bg-white">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <NuxtLink to="/" class="hover:text-gray-900 transition-colors">หน้าหลัก</NuxtLink>
          <Icon name="lucide:chevron-right" class="w-4 h-4" />
          <NuxtLink to="/problems" class="hover:text-gray-900 transition-colors">ปัญหาที่ได้รับการระบาย</NuxtLink>
          <Icon name="lucide:chevron-right" class="w-4 h-4" />
          <span class="text-gray-900">รายละเอียด</span>
        </nav>

        <!-- Post Card -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <!-- Author Header -->
          <div class="p-6 pb-4">
            <div class="flex items-start gap-4 mb-6">
              <img
                v-if="post.authorPhotoURL"
                :src="post.authorPhotoURL"
                alt="Profile"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div
                v-else
                class="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-sm"
              >
                {{ post.authorInitial }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 text-sm">{{ post.authorName }}</p>
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <span>{{ formatTime(post.createdAt) }}</span>
                  <span v-if="post.editedAt" class="text-gray-400">• แก้ไข</span>
                </div>
              </div>

              <!-- Mood Badge -->
              <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100">
                <span class="text-base">{{ getMoodEmoji(post.mood) }}</span>
                <span class="text-xs font-medium text-gray-600 hidden sm:inline">{{ getMoodLabel(post.mood) }}</span>
              </div>
            </div>

            <!-- Post Content -->
            <div class="mb-4">
              <p class="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{{ post.content }}</p>
            </div>

            <!-- Stats & Actions -->
            <div class="flex items-center gap-4 py-3 border-t border-gray-100">
              <button
                @click="toggleLike"
                :disabled="!user"
                :class="[
                  'flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs',
                  post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                ]"
              >
                <Icon
                  name="lucide:heart"
                  :class="['w-4 h-4', post.isLiked ? 'fill-current' : '']"
                />
                <span class="font-medium">{{ post.likesCount || 0 }}</span>
              </button>

              <div class="flex items-center gap-1.5 text-gray-500 text-xs">
                <Icon name="lucide:message-circle" class="w-4 h-4" />
                <span class="font-medium">{{ post.commentsCount || 0 }}</span>
              </div>

              <div class="flex items-center gap-1.5 text-gray-500 ml-auto text-xs">
                <Icon name="lucide:eye" class="w-4 h-4" />
                <span class="font-medium">{{ post.viewCount || 0 }}</span>
              </div>
            </div>
          </div>

        </div>

      <!-- Comments Section -->
      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden mt-4">
        <div class="p-6">
          <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="lucide:message-circle" class="w-4 h-4 text-gray-500" />
            ความคิดเห็น ({{ comments.length }})
          </h3>

          <!-- Add Comment (Authenticated Users Only) -->
          <div v-if="user" class="mb-4">
            <div class="flex gap-2">
              <img
                v-if="userProfile?.photoURL"
                :src="userProfile.photoURL"
                alt="Profile"
                class="w-8 h-8 rounded-full object-cover"
              />
              <div
                v-else
                class="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-xs"
              >
                {{ userInitial }}
              </div>
              <div class="flex-1">
                <textarea
                  v-model="newComment"
                  placeholder="แสดงความคิดเห็น..."
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none text-sm"
                  rows="2"
                  maxlength="500"
                ></textarea>
                <div class="flex items-center justify-between mt-1.5">
                  <span class="text-xs text-gray-400">{{ newComment.length }}/500</span>
                  <button
                    @click="addComment"
                    :disabled="!newComment.trim() || isCommenting"
                    class="px-4 py-1.5 rounded-md bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="isCommenting" class="flex items-center gap-1.5">
                      <Icon name="lucide:loader-2" class="w-3 h-3 animate-spin" />
                      กำลังโพสต์...
                    </span>
                    <span v-else>โพสต์</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Login Prompt for Non-Authenticated Users -->
          <div v-else class="mb-4 p-4 bg-gray-50 rounded-lg text-center">
            <p class="text-xs text-gray-600 mb-2">เข้าสู่ระบบเพื่อแสดงความคิดเห็น</p>
            <NuxtLink
              to="/login"
              class="inline-block px-4 py-1.5 rounded-md bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-all"
            >
              เข้าสู่ระบบ
            </NuxtLink>
          </div>

          <!-- Comments List -->
          <div v-if="comments.length === 0" class="text-center py-6">
            <Icon name="lucide:message-square-off" class="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p class="text-xs text-gray-500">ยังไม่มีความคิดเห็น</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="flex gap-2 p-3 rounded-lg bg-gray-50"
            >
              <div
                class="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-xs flex-shrink-0"
              >
                {{ comment.authorInitial }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 mb-0.5">
                  <p class="text-xs font-medium text-gray-900">{{ comment.authorName }}</p>
                  <span class="text-gray-300">•</span>
                  <p class="text-xs text-gray-500">{{ formatTime(comment.createdAt) }}</p>
                </div>
                <p class="text-xs text-gray-700 leading-relaxed">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useFirestore } from '~/composables/useFirestore'
import { useNotifications } from '~/composables/useNotifications'
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  addDoc,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  type Timestamp
} from 'firebase/firestore'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const { user } = useAuth()
const { firestore } = useFirestore()
const { createNotification } = useNotifications()

interface VentPost {
  id: string
  content: string
  authorId: string
  authorName: string
  authorInitial: string
  authorPhotoURL?: string | null
  isAnonymous: boolean
  mood: string
  createdAt: any
  editedAt?: any
  likesCount: number
  commentsCount: number
  viewCount: number
  likes: string[]
  isLiked?: boolean
}

interface VentComment {
  id: string
  content: string
  authorId: string
  authorName: string
  authorInitial: string
  createdAt: any
}

const post = ref<VentPost | null>(null)
const comments = ref<VentComment[]>([])
const loading = ref(true)
const newComment = ref('')
const isCommenting = ref(false)
const userProfile = ref<{ photoURL?: string; displayName?: string; slug?: string } | null>(null)

const moods = [
  { value: 'sad', label: 'เศร้า', emoji: '😢' },
  { value: 'stressed', label: 'เครียด', emoji: '😰' },
  { value: 'anxious', label: 'กังวล', emoji: '😟' },
  { value: 'angry', label: 'โกรธ', emoji: '😠' },
  { value: 'neutral', label: 'ปกติ', emoji: '😐' }
]

const userInitial = computed(() => {
  if (userProfile.value?.displayName) {
    return userProfile.value.displayName.charAt(0).toUpperCase()
  }
  if (user.value?.email) {
    return user.value.email.charAt(0).toUpperCase()
  }
  return 'U'
})

const displayName = computed(() => {
  if (userProfile.value?.displayName) {
    return userProfile.value.displayName
  }
  if (userProfile.value?.slug) {
    return userProfile.value.slug
  }
  if (user.value?.email) {
    return user.value.email.split('@')[0]
  }
  return 'ผู้ใช้นิรนาม'
})

const getMoodEmoji = (mood: string) => {
  const moodObj = moods.find(m => m.value === mood)
  return moodObj?.emoji || '😐'
}

const getMoodLabel = (mood: string) => {
  const moodObj = moods.find(m => m.value === mood)
  return moodObj?.label || 'ปกติ'
}

const formatTime = (timestamp: any) => {
  if (!timestamp) return 'เมื่อสักครู่'

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'เมื่อสักครู่'
  if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`
  if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`

  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

const toggleLike = async () => {
  if (!user.value || !post.value) return

  const postRef = doc(firestore, 'ventPosts', post.value.id)
  const isLiked = post.value.likes?.includes(user.value.uid)

  try {
    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(user.value.uid),
        likesCount: increment(-1)
      })
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user.value.uid),
        likesCount: increment(1)
      })

      // สร้างการแจ้งเตือนให้เจ้าของโพสต์ (ถ้าไม่ใช่ตัวเอง)
      if (post.value.authorId !== user.value.uid) {
        await createNotification({
          userId: post.value.authorId,
          type: 'like',
          title: 'มีคนกดใจโพสต์ของคุณ',
          message: `${displayName.value} กดใจโพสต์ของคุณ`,
          actionUrl: `/problems/${post.value.id}`,
          fromUserId: user.value.uid,
          fromUserName: displayName.value,
          fromUserPhoto: userProfile.value?.photoURL,
          postId: post.value.id
        })
      }
    }
  } catch (error) {
    console.error('Error toggling like:', error)
  }
}

const addComment = async () => {
  if (!newComment.value.trim() || !user.value || !post.value || isCommenting.value) return

  isCommenting.value = true
  const commentContent = newComment.value.trim()

  try {
    const postRef = doc(firestore, 'ventPosts', post.value.id)
    const commentsRef = collection(postRef, 'comments')

    await addDoc(commentsRef, {
      content: commentContent,
      authorId: user.value.uid,
      authorName: displayName.value,
      authorInitial: userInitial.value,
      createdAt: serverTimestamp()
    })

    await updateDoc(postRef, {
      commentsCount: increment(1)
    })

    // สร้างการแจ้งเตือนให้เจ้าของโพสต์ (ถ้าไม่ใช่ตัวเอง)
    if (post.value.authorId !== user.value.uid) {
      await createNotification({
        userId: post.value.authorId,
        type: 'comment',
        title: 'มีคนแสดงความคิดเห็นในโพสต์ของคุณ',
        message: `${displayName.value}: "${commentContent.substring(0, 50)}${commentContent.length > 50 ? '...' : ''}"`,
        actionUrl: `/my-problem/${post.value.id}`,
        fromUserId: user.value.uid,
        fromUserName: displayName.value,
        fromUserPhoto: userProfile.value?.photoURL,
        postId: post.value.id
      })
    }

    newComment.value = ''
  } catch (error) {
    console.error('Error adding comment:', error)
    alert('เกิดข้อผิดพลาดในการแสดงความคิดเห็น')
  } finally {
    isCommenting.value = false
  }
}

// Load user profile
const loadUserProfile = async () => {
  if (!user.value?.uid) return

  try {
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) return

    const token = await firebaseUser.getIdToken()

    const response = await $fetch<{ profile: { photoURL?: string; displayName?: string; slug?: string } }>('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    userProfile.value = response.profile
  } catch (error) {
    console.error('Error loading profile:', error)
  }
}

onMounted(async () => {
  // Load user profile if logged in
  if (user.value) {
    await loadUserProfile()
  }

  if (!firestore) {
    console.error('Firestore not initialized')
    loading.value = false
    return
  }

  const postId = route.params.id as string

  try {
    // Fetch post
    const postRef = doc(firestore, 'ventPosts', postId)
    const postSnap = await getDoc(postRef)

    if (postSnap.exists()) {
      const data = postSnap.data()

      // ดึง profile ของผู้เขียน
      let authorName = 'ผู้ใช้นิรนาม'
      let authorInitial = 'U'
      let authorPhotoURL = null

      try {
        const userDoc = await getDoc(doc(firestore, 'users', data.authorId))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          authorName = userData.displayName || userData.slug || 'ผู้ใช้นิรนาม'
          authorInitial = authorName.charAt(0).toUpperCase()
          authorPhotoURL = userData.photoURL || null
        }
      } catch (err) {
        console.error('Error loading author profile:', err)
      }

      post.value = {
        id: postSnap.id,
        ...data,
        authorName,
        authorInitial,
        authorPhotoURL,
        isLiked: data.likes?.includes(user.value?.uid)
      } as VentPost

      // Increment view count
      await updateDoc(postRef, {
        viewCount: increment(1)
      })

      // Subscribe to comments
      const commentsRef = collection(postRef, 'comments')
      const commentsQuery = query(commentsRef, orderBy('createdAt', 'asc'))

      onSnapshot(commentsQuery, (snapshot) => {
        comments.value = snapshot.docs.map(commentDoc => ({
          id: commentDoc.id,
          ...commentDoc.data()
        } as VentComment))
      })

      // Subscribe to post updates (for real-time like count updates)
      onSnapshot(postRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data()
          if (post.value) {
            post.value.likesCount = data.likesCount || 0
            post.value.commentsCount = data.commentsCount || 0
            post.value.viewCount = data.viewCount || 0
            post.value.likes = data.likes || []
            post.value.isLiked = data.likes?.includes(user.value?.uid)
          }
        }
      })
    }
  } catch (error) {
    console.error('Error fetching post:', error)
  } finally {
    loading.value = false
  }
})

useHead({
  title: computed(() => post.value ? `${post.value.content.substring(0, 50)}... - ระบายความรู้สึก` : 'ระบายความรู้สึก - Nira'),
  meta: computed(() => [
    {
      name: 'description',
      content: post.value?.content.substring(0, 150) || 'แชร์ความรู้สึกและรับกำลังใจจากชุมชน Nira'
    }
  ])
})
</script>

<style scoped>
.prose p {
  margin-bottom: 1rem;
  line-height: 1.8;
}
</style>
