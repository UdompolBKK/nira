<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Minimal Header -->
    <div class="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div class="max-w-2xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-lg font-semibold text-gray-900">ระบายความรู้สึก</h1>
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <Icon name="lucide:shield-check" class="w-4 h-4" />
            <span>นิรนาม</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-2xl mx-auto px-4 py-6">
      <!-- Create Post Card - Minimal Design -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
        <!-- Editing Badge -->
        <div v-if="editingPostId" class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div class="flex items-center gap-2 text-sm font-medium text-gray-700">
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

        <!-- Textarea -->
        <textarea
          v-model="newPost"
          :placeholder="selectedBot?.greeting || 'คุณรู้สึกอย่างไรวันนี้...'"
          class="w-full min-h-[120px] p-0 border-0 focus:outline-none focus:ring-0 resize-none text-gray-900 placeholder-gray-400 text-base leading-relaxed"
          maxlength="2500"
        ></textarea>

        <!-- Divider -->
        <div class="border-t border-gray-100 my-4"></div>

        <!-- Options Row -->
        <div class="space-y-4">
          <!-- Room Selector -->
          <div v-if="rooms.length > 0" class="flex items-center gap-3">
            <Icon name="lucide:hash" class="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div class="flex flex-wrap gap-2">
              <button
                v-for="room in rooms"
                :key="room.id"
                @click="selectedRoom = room.id"
                :class="[
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5',
                  selectedRoom === room.id
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
                :style="selectedRoom === room.id ? { backgroundColor: room.color } : {}"
              >
                <Icon :name="room.icon" class="w-3.5 h-3.5" />
                {{ room.name }}
              </button>
            </div>
          </div>

          <!-- Mood Selector -->
          <div class="flex items-center gap-3">
            <Icon name="lucide:smile" class="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div class="flex flex-wrap gap-2">
              <button
                v-for="mood in moods"
                :key="mood.value"
                @click="selectedMood = mood.value"
                :class="[
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  selectedMood === mood.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                {{ mood.emoji }} {{ mood.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <span :class="['text-xs', newPost.length > 2250 ? 'text-red-500' : 'text-gray-400']">
            {{ newPost.length }}/2500
          </span>
          <button
            @click="handlePost"
            :disabled="!newPost.trim() || isPosting"
            :class="[
              'px-5 py-2 rounded-full text-sm font-medium transition-all',
              !newPost.trim() || isPosting
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
            ]"
          >
            <span v-if="isPosting" class="flex items-center gap-2">
              <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <span>{{ editingPostId ? 'บันทึก...' : 'โพสต์...' }}</span>
            </span>
            <span v-else>{{ editingPostId ? 'บันทึก' : 'โพสต์' }}</span>
          </button>
        </div>
      </div>

      <!-- Section Title -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-medium text-gray-500">โพสต์ล่าสุด</h2>
      </div>

      <!-- Posts Feed -->
      <div v-if="loading" class="text-center py-16">
        <Icon name="lucide:loader-2" class="w-8 h-8 text-gray-400 animate-spin mx-auto" />
      </div>

      <div v-else-if="posts.length === 0" class="text-center py-16">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:message-square" class="w-8 h-8 text-gray-400" />
        </div>
        <p class="text-gray-500 text-sm">ยังไม่มีโพสต์</p>
        <p class="text-gray-400 text-xs mt-1">เป็นคนแรกที่แชร์ความรู้สึก</p>
      </div>

      <!-- Posts List -->
      <div class="space-y-4">
        <TransitionGroup name="list">
          <div
            v-for="post in posts"
            :key="post.id"
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
const selectedRoom = ref('')
const userProfile = ref<{ photoURL?: string; displayName?: string; slug?: string } | null>(null)
const showSuccessModal = ref(false)
const editingPostId = ref<string | null>(null)
const showDeleteConfirm = ref(false)
const deletingPostId = ref<string | null>(null)

// Rooms
interface Room {
  id: string
  name: string
  description?: string
  icon: string
  color: string
  imageURL?: string
  isActive: boolean
}
const rooms = ref<Room[]>([])

interface VentPost {
  id: string
  content: string
  authorId: string
  authorInitial: string
  authorPhotoURL?: string | null
  mood: string
  roomId?: string
  roomName?: string
  roomIcon?: string
  roomColor?: string
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
  const postRoomId = selectedRoom.value || null

  try {
    if (editingPostId.value) {
      // แก้ไขโพสต์เดิม
      const postRef = doc(firestore, 'ventPosts', editingPostId.value)
      await updateDoc(postRef, {
        content: postContent,
        mood: postMood,
        roomId: postRoomId,
        editedAt: serverTimestamp()
      })

      // Clear form
      newPost.value = ''
      selectedMood.value = 'neutral'
      selectedRoom.value = rooms.value.length > 0 ? rooms.value[0].id : ''
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
        roomId: postRoomId,
        createdAt: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0,
        likes: [],
        viewCount: 0
      })

      // Clear form
      newPost.value = ''
      selectedMood.value = 'neutral'
      selectedRoom.value = rooms.value.length > 0 ? rooms.value[0].id : ''

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
  selectedRoom.value = post.roomId || (rooms.value.length > 0 ? rooms.value[0].id : '')
  post.showMenu = false

  // Scroll ไปที่ textarea
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEdit = () => {
  editingPostId.value = null
  newPost.value = ''
  selectedMood.value = 'neutral'
  selectedRoom.value = rooms.value.length > 0 ? rooms.value[0].id : ''
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

// Load rooms
const loadRooms = async () => {
  try {
    const response = await $fetch<{ rooms: Room[] }>('/api/rooms')
    rooms.value = response.rooms.filter(r => r.isActive)
    // Select first room by default if none selected
    if (rooms.value.length > 0 && !selectedRoom.value) {
      selectedRoom.value = rooms.value[0].id
    }
  } catch (error) {
    console.error('Error loading rooms:', error)
  }
}

// Real-time data fetching
onMounted(() => {
  // Load user profile
  loadUserProfile()

  // Load rooms
  loadRooms()

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

        // Get room info if roomId exists
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
          id: docSnapshot.id,
          content: data.content,
          authorId: data.authorId,
          authorInitial,
          authorPhotoURL,
          mood: data.mood,
          roomId: data.roomId || null,
          roomName,
          roomIcon,
          roomColor,
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
/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease;
}
</style>
