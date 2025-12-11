<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pb-24">
    <!-- Hero Section - Mobile Optimized -->
    <div class="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-12 md:py-16">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 md:mb-6 animate-pulse">
          <Icon name="lucide:heart-handshake" class="w-8 h-8 md:w-10 md:h-10" />
        </div>
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
          ระบายความรู้สึก
        </h1>
        <p class="text-base md:text-xl text-white/90 max-w-2xl mx-auto px-4">
          พื้นที่ปลอดภัยสำหรับการแชร์ความรู้สึกและรับกำลังใจจากเพื่อนในชุมชน
        </p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-3 md:px-4 -mt-6 md:-mt-8 pb-12">
      <!-- Create Post Card - Mobile Optimized -->
      <div class="bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-6 mb-6 md:mb-8 border-2 border-pink-200">
        <!-- Avatar & Textarea Stack on Mobile -->
        <div class="flex flex-col gap-4">
          <!-- Avatar Row -->
          <div class="flex items-center gap-3">
            <img
              v-if="userProfile?.photoURL"
              :src="userProfile.photoURL"
              alt="Profile"
              class="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover flex-shrink-0 shadow-lg border-2 border-pink-200"
            />
            <div
              v-else
              class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-base md:text-lg flex-shrink-0 shadow-lg"
            >
              {{ userInitial }}
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-700">{{ displayName }}</p>
              <p class="text-xs text-gray-500">{{ userProfile?.slug || 'ผู้ใช้นิรนาม' }}</p>
            </div>
          </div>

          <!-- Editing Badge -->
          <div v-if="editingPostId" class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2 text-sm font-medium text-blue-600">
              <Icon name="lucide:edit-3" class="w-4 h-4" />
              <span>กำลังแก้ไขโพสต์</span>
            </div>
            <button
              @click="cancelEdit"
              class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ยกเลิก
            </button>
          </div>

          <!-- Textarea Full Width -->
          <textarea
            v-model="newPost"
            :placeholder="selectedBot?.greeting || 'แชร์ความรู้สึกของคุณ... ไม่ว่าจะเป็นความเครียด ความกังวล หรือสิ่งที่อยากระบาย 💭'"
            :class="[
              'w-full min-h-32 md:min-h-28 p-4 border-2 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent resize-none text-gray-900 placeholder-gray-400 text-base',
              editingPostId
                ? 'border-blue-300 focus:ring-blue-500'
                : 'border-gray-200 focus:ring-pink-500'
            ]"
            maxlength="2500"
          ></textarea>

          <!-- Mood Selector - Wrap to Multiple Lines -->
          <div class="flex flex-col gap-2">
            <span class="text-sm font-medium text-gray-600">อารมณ์:</span>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="mood in moods"
                :key="mood.value"
                @click="selectedMood = mood.value"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  selectedMood === mood.value
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                ]"
              >
                {{ mood.emoji }} {{ mood.label }}
              </button>
            </div>
          </div>

          <!-- Character Count & Post Button -->
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 md:gap-3">
              <span :class="['text-xs md:text-sm font-medium', newPost.length > 2250 ? 'text-red-500' : 'text-gray-500']">
                {{ newPost.length }}/2500
              </span>
              <div v-if="newPost.length > 0" class="hidden sm:flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <Icon name="lucide:lock" class="w-3 h-3 md:w-4 md:h-4" />
                <span>โพสต์นิรนาม</span>
              </div>
            </div>
            <button
              @click="handlePost"
              :disabled="!newPost.trim() || isPosting"
              :class="[
                'px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold transition-all shadow-lg text-sm md:text-base',
                !newPost.trim() || isPosting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : editingPostId
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl active:scale-95'
                    : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-xl active:scale-95'
              ]"
            >
              <span v-if="isPosting" class="flex items-center gap-2">
                <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                <span class="hidden sm:inline">{{ editingPostId ? 'กำลังบันทึก...' : 'กำลังโพสต์...' }}</span>
              </span>
              <span v-else>{{ editingPostId ? 'บันทึกการแก้ไข' : 'แชร์ความรู้สึก' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Posts Feed -->
      <div v-if="loading" class="text-center py-12">
        <Icon name="lucide:loader-2" class="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
        <p class="text-gray-500">กำลังโหลด...</p>
      </div>

      <div v-else-if="posts.length === 0" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full mb-6">
          <Icon name="lucide:inbox" class="w-12 h-12 text-pink-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">ยังไม่มีโพสต์</h3>
        <p class="text-gray-500">เป็นคนแรกที่แชร์ความรู้สึกของคุณ</p>
      </div>

      <!-- Masonry Grid - Pinterest style -->
      <div class="masonry-container">
        <TransitionGroup name="list">
          <div
            v-for="post in posts"
            :key="post.id"
            class="masonry-item"
          >
            <VentCard
              :post="post"
              variant="full"
              @like="toggleLike"
              @toggle-comments="toggleComments"
              @add-comment="addComment"
              @update-comment="updateComment"
              @toggle-menu="toggleMenu"
              @edit="startEditPost"
              @delete="confirmDeletePost"
            />
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- AI Companion -->
    <AICompanion :editor-content="newPost" />

    <!-- Success Modal -->
    <SuccessModal
      v-model="showSuccessModal"
      type="success"
      title="โพสต์สำเร็จแล้ว! 🎉"
      message="ขอบคุณที่กล้าแชร์ความรู้สึกของคุณ<br />การระบายออกมาคือก้าวแรกของการเยียวยา"
      confirm-text="เข้าใจแล้ว"
    />

    <!-- Delete Confirmation Modal -->
    <SuccessModal
      v-model="showDeleteConfirm"
      type="warning"
      title="ยืนยันการลบโพสต์?"
      message="คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์นี้?<br />การกระทำนี้ไม่สามารถย้อนกลับได้"
      confirm-text="ลบโพสต์"
      cancel-text="ยกเลิก"
      :show-cancel="true"
      @confirm="deletePost"
      @cancel="showDeleteConfirm = false; deletingPostId = null"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useFirestore } from '~/composables/useFirestore'
import { useNotifications } from '~/composables/useNotifications'
import { collection, addDoc, query, orderBy, limit, onSnapshot, updateDoc, doc, getDoc, increment, arrayUnion, arrayRemove, serverTimestamp, type Timestamp } from 'firebase/firestore'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'ระบายความรู้สึก - Nira',
  meta: [
    {
      name: 'description',
      content: 'แชร์ความไม่สบายใจและรับกำลังใจจากชุมชน Nira'
    }
  ]
})

const { user } = useAuth()
const { firestore } = useFirestore()
const { createNotification } = useNotifications()
const { selectedBot, initializeSelectedBot } = useBotConfig()

const newPost = ref('')
const isPosting = ref(false)
const loading = ref(true)
const selectedMood = ref('neutral')
const userProfile = ref<{ photoURL?: string; displayName?: string; slug?: string } | null>(null)
const showSuccessModal = ref(false)
const editingPostId = ref<string | null>(null)
const showDeleteConfirm = ref(false)
const deletingPostId = ref<string | null>(null)

interface VentPost {
  id: string
  content: string
  authorId: string
  authorInitial: string
  authorPhotoURL?: string | null
  mood: string
  createdAt: any
  editedAt?: any
  likesCount: number
  commentsCount: number
  likes: string[]
  comments: VentComment[]
  isLiked?: boolean
  isOwner?: boolean
  showComments?: boolean
  showMenu?: boolean
  newComment?: string
}

interface VentComment {
  id: string
  content: string
  authorId: string
  authorName: string
  authorInitial: string
  createdAt: any
}

const posts = ref<VentPost[]>([])

const moods = [
  { value: 'sad', label: 'เศร้า', emoji: '😢' },
  { value: 'stressed', label: 'เครียด', emoji: '😰' },
  { value: 'anxious', label: 'กังวล', emoji: '😟' },
  { value: 'angry', label: 'โกรธ', emoji: '😠' },
  { value: 'neutral', label: 'ปกติ', emoji: '😐' }
]

const userInitial = computed(() => {
  // Use profile displayName first, fallback to email
  if (userProfile.value?.displayName) {
    return userProfile.value.displayName.charAt(0).toUpperCase()
  }
  if (user.value?.email) {
    return user.value.email.charAt(0).toUpperCase()
  }
  return 'U'
})

const displayName = computed(() => {
  // Use profile displayName or slug, fallback to email username
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

  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
}

// No need for onPostInput - AICompanion watches newPost directly via editor-content prop

const handlePost = async () => {
  if (!newPost.value.trim() || isPosting.value || !user.value) return

  isPosting.value = true
  const postContent = newPost.value.trim()
  const postMood = selectedMood.value

  try {
    if (editingPostId.value) {
      // แก้ไขโพสต์เดิม
      const postRef = doc(firestore, 'ventPosts', editingPostId.value)
      await updateDoc(postRef, {
        content: postContent,
        mood: postMood,
        editedAt: serverTimestamp()
      })

      // Clear form
      newPost.value = ''
      selectedMood.value = 'neutral'
      editingPostId.value = null

      // Show success modal
      showSuccessModal.value = true
      setTimeout(() => {
        showSuccessModal.value = false
      }, 3000)
    } else {
      // สร้างโพสต์ใหม่
      const ventPostsRef = collection(firestore, 'ventPosts')

      await addDoc(ventPostsRef, {
        content: postContent,
        authorId: user.value.uid,
        mood: postMood,
        createdAt: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0,
        likes: [],
        viewCount: 0
      })

      // Clear form
      newPost.value = ''
      selectedMood.value = 'neutral'

      // Show success modal
      showSuccessModal.value = true
      setTimeout(() => {
        showSuccessModal.value = false
      }, 3000)
    }
  } catch (error) {
    console.error('Error posting:', error)
    alert('เกิดข้อผิดพลาดในการโพสต์ กรุณาลองใหม่อีกครั้ง')
  } finally {
    isPosting.value = false
  }
}

const toggleLike = async (postId: string) => {
  if (!user.value) return

  const post = posts.value.find(p => p.id === postId)
  if (!post) return

  const postRef = doc(firestore, 'ventPosts', postId)
  const isLiked = post.likes?.includes(user.value.uid)

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
      // Relational Model: Store only UID, name/photo fetched dynamically from users collection
      if (post.authorId !== user.value.uid) {
        await createNotification({
          userId: post.authorId,
          type: 'like',
          actionUrl: '/my-problem',
          senderId: user.value.uid, // Only store UID
          postId: postId
        })
      }
    }
  } catch (error) {
    console.error('Error toggling like:', error)
  }
}

const toggleComments = (postId: string) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.showComments = !post.showComments
  }
}

const updateComment = (postId: string, value: string) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.newComment = value
  }
}

const toggleMenu = (postId: string) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.showMenu = !post.showMenu
  }
}

const startEditPost = (postId: string) => {
  const post = posts.value.find(p => p.id === postId)
  if (!post) return

  // ตั้งค่าฟอร์มให้เป็นโหมดแก้ไข
  editingPostId.value = postId
  newPost.value = post.content
  selectedMood.value = post.mood
  post.showMenu = false

  // Scroll ไปที่ textarea
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEdit = () => {
  editingPostId.value = null
  newPost.value = ''
  selectedMood.value = 'neutral'
}

const confirmDeletePost = (postId: string) => {
  deletingPostId.value = postId
  showDeleteConfirm.value = true
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.showMenu = false
  }
}

const deletePost = async () => {
  if (!deletingPostId.value || !firestore) return

  try {
    // ลบโพสต์จาก Firestore
    const postRef = doc(firestore, 'ventPosts', deletingPostId.value)
    await updateDoc(postRef, {
      content: '[โพสต์นี้ถูกลบโดยเจ้าของ]',
      mood: 'neutral',
      editedAt: serverTimestamp()
    })

    showDeleteConfirm.value = false
    deletingPostId.value = null
  } catch (error) {
    console.error('Error deleting post:', error)
    alert('เกิดข้อผิดพลาดในการลบโพสต์')
  }
}

const addComment = async (postId: string) => {
  const post = posts.value.find(p => p.id === postId)
  if (!post || !post.newComment?.trim() || !user.value) return

  const postRef = doc(firestore, 'ventPosts', postId)
  const commentsRef = collection(postRef, 'comments')
  const commentContent = post.newComment.trim()

  try {
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
    // Relational Model: Store only UID, name/photo fetched dynamically from users collection
    if (post.authorId !== user.value.uid) {
      await createNotification({
        userId: post.authorId,
        type: 'comment',
        actionUrl: '/my-problem',
        senderId: user.value.uid, // Only store UID
        postId: postId
      })
    }

    post.newComment = ''
  } catch (error) {
    console.error('Error adding comment:', error)
  }
}

// Load user profile
const loadUserProfile = async () => {
  if (!user.value?.uid) return

  try {
    // Get auth token
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) return

    const token = await firebaseUser.getIdToken()

    const response = await $fetch<{ profile: { photoURL?: string; displayName?: string } }>('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    userProfile.value = response.profile
  } catch (error) {
    console.error('Error loading profile:', error)
  }
}

// Real-time data fetching
onMounted(() => {
  // Load user profile
  loadUserProfile()

  // Initialize selected bot
  initializeSelectedBot()

  if (!firestore) {
    console.error('Firestore not initialized')
    loading.value = false
    return
  }

  const ventPostsRef = collection(firestore, 'ventPosts')
  const q = query(ventPostsRef, orderBy('createdAt', 'desc'), limit(50))

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    // Map posts และดึง profile สำหรับแต่ละ post
    const postsWithProfiles = await Promise.all(
      snapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data()

        // ดึง profile จาก users collection
        let authorInitial = 'U'
        let authorPhotoURL = null

        try {
          const userDoc = await getDoc(doc(firestore, 'users', data.authorId))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            const authorName = userData.displayName || userData.slug || 'ผู้ใช้นิรนาม'
            authorInitial = authorName.charAt(0).toUpperCase()
            authorPhotoURL = userData.photoURL || null
          }
        } catch (err) {
          console.error('Error loading user profile for post:', err)
        }

        return {
          id: docSnapshot.id,
          content: data.content,
          authorId: data.authorId,
          authorInitial,
          authorPhotoURL,
          mood: data.mood,
          createdAt: data.createdAt,
          editedAt: data.editedAt,
          likesCount: data.likesCount || 0,
          commentsCount: data.commentsCount || 0,
          likes: data.likes || [],
          isLiked: data.likes?.includes(user.value?.uid),
          isOwner: data.authorId === user.value?.uid,
          showComments: false,
          showMenu: false,
          newComment: '',
          comments: []
        } as VentPost
      })
    )

    posts.value = postsWithProfiles
    loading.value = false

    // Load comments for each post
    posts.value.forEach(post => {
      const postRef = doc(firestore, 'ventPosts', post.id)
      const commentsRef = collection(postRef, 'comments')
      const commentsQuery = query(commentsRef, orderBy('createdAt', 'asc'))

      onSnapshot(commentsQuery, (commentsSnapshot) => {
        post.comments = commentsSnapshot.docs.map(commentDoc => ({
          id: commentDoc.id,
          ...commentDoc.data()
        } as VentComment))
      })
    })
  }, (error) => {
    console.error('Error fetching posts:', error)
    loading.value = false
  })

  onBeforeUnmount(() => {
    unsubscribe()
  })
})
</script>

<style scoped>
/* Masonry Layout - Pinterest Style */
.masonry-container {
  column-count: 1;
  column-gap: 1.5rem;
}

@media (min-width: 768px) {
  .masonry-container {
    column-count: 2;
  }
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1.5rem;
  display: inline-block;
  width: 100%;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease;
}
</style>
