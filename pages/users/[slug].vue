<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <Icon name="lucide:loader-2" class="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
        <p class="text-gray-500">กำลังโหลดโปรไฟล์...</p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!userProfile" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <Icon name="lucide:user-x" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">ไม่พบผู้ใช้</h3>
        <p class="text-gray-500 mb-6">ไม่พบผู้ใช้ที่คุณค้นหา</p>
        <NuxtLink
          to="/browse"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          กลับไปหน้าหลัก
        </NuxtLink>
      </div>
    </div>

    <!-- User Profile -->
    <div v-else>
      <!-- Header with Breadcrumb -->
      <header class="bg-white border-b border-gray-100">
        <div class="max-w-4xl mx-auto px-4 md:px-6 py-4">
          <nav class="flex items-center gap-2 text-sm text-gray-500">
            <NuxtLink to="/" class="hover:text-gray-900 transition-colors">หน้าหลัก</NuxtLink>
            <Icon name="lucide:chevron-right" class="w-4 h-4" />
            <span class="text-gray-900 font-medium">โปรไฟล์</span>
          </nav>
        </div>
      </header>

      <!-- Profile Section -->
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
            <!-- Avatar -->
            <img
              v-if="userProfile.photoURL"
              :src="userProfile.photoURL"
              :alt="userProfile.displayName"
              class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-gray-100"
            />
            <div
              v-else
              class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-4xl ring-4 ring-gray-100"
            >
              {{ getInitial(userProfile.displayName) }}
            </div>

            <!-- Profile Info -->
            <div class="flex-1 text-center md:text-left">
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {{ userProfile.displayName || 'ผู้ใช้นิรนาม' }}
              </h1>
              <p class="text-gray-500 mb-3">@{{ userProfile.slug }}</p>

              <!-- About Me -->
              <p v-if="userProfile.aboutMe" class="text-gray-600 text-sm mb-4 max-w-md">
                {{ userProfile.aboutMe }}
              </p>

              <!-- Stats -->
              <div class="flex items-center justify-center md:justify-start gap-6 mb-4">
                <div class="text-center">
                  <div class="text-xl font-bold text-gray-900">{{ storiesCount }}</div>
                  <div class="text-xs text-gray-500">เรื่องราวชีวิต</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold text-gray-900">{{ problemsCount }}</div>
                  <div class="text-xs text-gray-500">ปัญหาที่ระบาย</div>
                </div>
              </div>

              <!-- Add Friend Button -->
              <div v-if="canAddFriend">
                <button
                  v-if="friendStatus === 'none'"
                  @click="sendFriendRequest"
                  :disabled="sendingRequest"
                  class="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto md:mx-0"
                >
                  <Icon v-if="sendingRequest" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                  <Icon v-else name="lucide:user-plus" class="w-4 h-4" />
                  {{ sendingRequest ? 'กำลังส่ง...' : 'เพิ่มเพื่อน' }}
                </button>

                <button
                  v-else-if="friendStatus === 'pending'"
                  @click="cancelFriendRequest"
                  :disabled="sendingRequest"
                  class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto md:mx-0"
                >
                  <Icon v-if="sendingRequest" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                  <Icon v-else name="lucide:user-x" class="w-4 h-4" />
                  {{ sendingRequest ? 'กำลังยกเลิก...' : 'ยกเลิกคำขอ' }}
                </button>

                <button
                  v-else-if="friendStatus === 'friends'"
                  @click="unfriend"
                  :disabled="sendingRequest"
                  class="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto md:mx-0"
                >
                  <Icon v-if="sendingRequest" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                  <Icon v-else name="lucide:user-minus" class="w-4 h-4" />
                  {{ sendingRequest ? 'กำลังลบ...' : 'ลบเพื่อน' }}
                </button>
              </div>
              <div v-else-if="!user" class="text-sm text-gray-500">
                <NuxtLink to="/login" class="text-blue-600 hover:underline">เข้าสู่ระบบ</NuxtLink> เพื่อเพิ่มเพื่อน
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div class="max-w-4xl mx-auto px-4 md:px-6">
          <div class="flex gap-8">
            <button
              @click="activeTab = 'stories'"
              :class="[
                'py-4 font-medium transition-colors relative',
                activeTab === 'stories'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              เรื่องราวชีวิต
              <div
                v-if="activeTab === 'stories'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
              />
            </button>
            <button
              @click="activeTab = 'problems'"
              :class="[
                'py-4 font-medium transition-colors relative',
                activeTab === 'problems'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              ปัญหาที่ระบาย
              <div
                v-if="activeTab === 'problems'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <main class="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <!-- Stories Tab -->
        <div v-if="activeTab === 'stories'">
          <!-- Loading -->
          <div v-if="loadingStories" class="text-center py-12">
            <Icon name="lucide:loader-2" class="w-8 h-8 mx-auto mb-3 text-gray-400 animate-spin" />
            <p class="text-sm text-gray-500">กำลังโหลดเรื่องราว...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="stories.length === 0" class="text-center py-20">
            <Icon name="lucide:file-text" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">ยังไม่มีเรื่องราว</h3>
            <p class="text-sm text-gray-500">ผู้ใช้ยังไม่ได้แชร์เรื่องราวชีวิต</p>
          </div>

          <!-- Stories Timeline -->
          <div v-else>
            <div class="relative pl-10">
              <div class="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />
              <div
                v-for="story in stories.slice(0, 3)"
                :key="story.id"
                class="relative mb-6"
              >
                <div class="absolute left-1 top-2 w-2 h-2 rounded-full bg-gray-300 ring-2 ring-white" style="margin-left: -39px;" />

                <!-- Locked Post -->
                <div v-if="story.isLocked" class="relative">
                  <div class="text-gray-800 leading-relaxed prose prose-sm max-w-none blur-sm select-none pointer-events-none">
                    {{ generateFakeText(story.contentLength || 300) }}
                  </div>
                  <div class="absolute inset-0 flex items-center justify-center bg-white/40">
                    <div class="text-center p-4 bg-white/80 rounded-lg shadow-md border border-gray-300">
                      <Icon name="lucide:lock" class="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p class="text-sm text-gray-700 font-semibold">เนื้อหาถูกล็อค</p>
                      <p class="text-xs text-gray-500 mt-1">เพิ่มเพื่อนเพื่ออ่านเนื้อหานี้</p>
                    </div>
                  </div>
                </div>

                <!-- Normal Post -->
                <div v-else>
                  <div class="text-gray-800 leading-relaxed prose prose-sm max-w-none" v-html="story.content" />
                  <p class="text-xs text-gray-400 mt-3">{{ formatDate(story.createdAt) }}</p>
                </div>
              </div>
            </div>

            <!-- View More Button -->
            <div v-if="stories.length > 3" class="text-center mt-8">
              <NuxtLink
                :to="`/stories/${userProfile?.slug}`"
                class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                <span>ดูเพิ่มเติม</span>
                <Icon name="lucide:arrow-right" class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Problems Tab -->
        <div v-if="activeTab === 'problems'">
          <!-- Loading -->
          <div v-if="loadingProblems" class="text-center py-12">
            <Icon name="lucide:loader-2" class="w-8 h-8 mx-auto mb-3 text-gray-400 animate-spin" />
            <p class="text-sm text-gray-500">กำลังโหลดปัญหา...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="problems.length === 0" class="text-center py-20">
            <Icon name="lucide:message-square" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">ยังไม่มีปัญหาที่ระบาย</h3>
            <p class="text-sm text-gray-500">ผู้ใช้ยังไม่ได้แชร์ปัญหาหรือความรู้สึก</p>
          </div>

          <!-- Problems Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VentCard
              v-for="problem in problems"
              :key="problem.id"
              :post="problem"
              variant="compact"
            />
          </div>
        </div>
      </main>
    </div>

    <!-- Success Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showSuccessModal"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          @click="showSuccessModal = false"
        >
          <div
            class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform"
            @click.stop
          >
            <!-- Success Icon -->
            <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="lucide:check" class="w-8 h-8 text-white" />
            </div>

            <!-- Message -->
            <h3 class="text-2xl font-bold text-gray-900 mb-2 text-center">ส่งคำขอเรียบร้อย!</h3>
            <p class="text-gray-600 text-center mb-6">
              คุณได้ส่งคำขอเป็นเพื่อนกับ
              <span class="font-semibold text-gray-900">{{ userProfile?.displayName }}</span>
              แล้ว
            </p>

            <!-- Close Button -->
            <button
              @click="showSuccessModal = false"
              class="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useFirestore } from '~/composables/useFirestore'
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc, addDoc, deleteDoc } from 'firebase/firestore'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const { user } = useAuth()
const { firestore } = useFirestore()

const userProfile = ref<any>(null)
const loading = ref(true)
const activeTab = ref<'stories' | 'problems'>('stories')

const stories = ref<any[]>([])
const problems = ref<any[]>([])
const loadingStories = ref(false)
const loadingProblems = ref(false)

const storiesCount = ref(0)
const problemsCount = ref(0)

const friendStatus = ref<'none' | 'pending' | 'friends'>('none')
const sendingRequest = ref(false)
const showSuccessModal = ref(false)
const friendRequestId = ref<string | null>(null)

const getInitial = (name?: string) => {
  if (!name) return 'U'
  return name.charAt(0).toUpperCase()
}

const canAddFriend = computed(() => {
  return user.value && user.value.uid !== userProfile.value?.userId
})

// Check friend status using API
const checkFriendStatus = async () => {
  if (!user.value || !userProfile.value) return

  try {
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) return

    const token = await firebaseUser.getIdToken()

    const response = await $fetch(`/api/friends/status?targetUserId=${userProfile.value.userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.success) {
      friendStatus.value = response.status
      if (response.requestId) {
        friendRequestId.value = response.requestId
      }
    }
  } catch (err) {
    console.error('Error checking friend status:', err)
  }
}

// Send friend request using API
const sendFriendRequest = async () => {
  if (!user.value || !userProfile.value) return

  sendingRequest.value = true
  try {
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) return

    const token = await firebaseUser.getIdToken()

    const response = await $fetch('/api/friends/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        receiverId: userProfile.value.userId,
        receiverName: userProfile.value.displayName || 'ผู้ใช้'
      }
    })

    if (response.success) {
      friendRequestId.value = response.requestId
      friendStatus.value = 'pending'
      showSuccessModal.value = true
    }
  } catch (err) {
    console.error('Error sending friend request:', err)
    alert('เกิดข้อผิดพลาดในการส่งคำขอ')
  } finally {
    sendingRequest.value = false
  }
}

// Cancel friend request using API
const cancelFriendRequest = async () => {
  if (!user.value || !friendRequestId.value) return

  sendingRequest.value = true
  try {
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) return

    const token = await firebaseUser.getIdToken()

    await $fetch('/api/friends/cancel', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        requestId: friendRequestId.value
      }
    })

    friendStatus.value = 'none'
    friendRequestId.value = null
  } catch (err) {
    console.error('Error canceling friend request:', err)
    alert('เกิดข้อผิดพลาดในการยกเลิกคำขอ')
  } finally {
    sendingRequest.value = false
  }
}

// Unfriend using API
const unfriend = async () => {
  if (!user.value || !userProfile.value) return
  if (!confirm(`คุณต้องการลบ ${userProfile.value.displayName} ออกจากเพื่อนหรือไม่?`)) return

  sendingRequest.value = true
  try {
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) return

    const token = await firebaseUser.getIdToken()

    await $fetch('/api/friends/unfriend', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        friendId: userProfile.value.userId
      }
    })

    friendStatus.value = 'none'
  } catch (err) {
    console.error('Error unfriending:', err)
    alert('เกิดข้อผิดพลาดในการลบเพื่อน')
  } finally {
    sendingRequest.value = false
  }
}


const generateFakeText = (length: number) => {
  const words = ['วันนี้', 'ฉัน', 'รู้สึก', 'มีความสุข', 'เศร้า', 'คิดถึง', 'อยาก', 'ไป', 'มา', 'กับ', 'และ', 'แต่', 'หรือ']
  let text = ''
  while (text.length < length) {
    text += words[Math.floor(Math.random() * words.length)] + ' '
  }
  return text.substring(0, length)
}

const formatDate = (timestamp: any) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadUserProfile = async () => {
  if (!firestore) return

  const slug = route.params.slug as string

  try {
    // Query user by slug
    const usersRef = collection(firestore, 'users')
    const q = query(usersRef, where('slug', '==', slug), limit(1))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0]
      userProfile.value = {
        userId: userDoc.id,
        ...userDoc.data()
      }

      useHead({
        title: `${userProfile.value.displayName || 'ผู้ใช้นิรนาม'} - Nira`
      })

      // Load counts
      await Promise.all([
        loadStoriesCount(),
        loadProblemsCount()
      ])
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
  } finally {
    loading.value = false
  }
}

const loadStoriesCount = async () => {
  if (!firestore || !userProfile.value) return

  try {
    const postsRef = collection(firestore, 'storyPosts')
    const q = query(
      postsRef,
      where('userId', '==', userProfile.value.userId),
      where('visibility', '==', 'public')
    )
    const snapshot = await getDocs(q)
    storiesCount.value = snapshot.size
  } catch (error) {
    console.error('Error loading stories count:', error)
  }
}

const loadProblemsCount = async () => {
  if (!firestore || !userProfile.value) return

  try {
    const ventPostsRef = collection(firestore, 'ventPosts')
    const q = query(
      ventPostsRef,
      where('authorId', '==', userProfile.value.userId)
    )
    const snapshot = await getDocs(q)
    // Count all posts (show all on profile page)
    problemsCount.value = snapshot.size
  } catch (error) {
    console.error('Error loading problems count:', error)
  }
}

const loadStories = async () => {
  if (!firestore || !userProfile.value) return

  loadingStories.value = true
  try {
    const postsRef = collection(firestore, 'storyPosts')
    const q = query(
      postsRef,
      where('userId', '==', userProfile.value.userId),
      where('visibility', '==', 'public'),
      orderBy('createdAt', 'asc'), // Sort from oldest to newest (chronological autobiography)
      limit(50)
    )
    const snapshot = await getDocs(q)

    stories.value = snapshot.docs.map(doc => {
      const data = doc.data()
      // Check if post is locked
      const isLocked = data.visibility === 'friends' || data.isLocked
      const isFriend = false // TODO: Check friend status

      return {
        id: doc.id,
        ...data,
        isLocked: isLocked && !isFriend && user.value?.uid !== userProfile.value.userId,
        contentLength: data.content?.length || 300
      }
    })
  } catch (error) {
    console.error('Error loading stories:', error)
  } finally {
    loadingStories.value = false
  }
}

const loadProblems = async () => {
  if (!firestore || !userProfile.value) {
    console.log('[loadProblems] Missing firestore or userProfile')
    return
  }

  console.log('[loadProblems] Loading problems for user:', userProfile.value.userId)
  loadingProblems.value = true
  try {
    const ventPostsRef = collection(firestore, 'ventPosts')
    // Query all posts by authorId, filter isAnonymous client-side
    const q = query(
      ventPostsRef,
      where('authorId', '==', userProfile.value.userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    )
    const snapshot = await getDocs(q)
    console.log('[loadProblems] Found', snapshot.size, 'total problems (before filter)')

    // Map all posts to component format (show all posts on user profile)
    problems.value = snapshot.docs
      .map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          content: data.content,
          excerpt: data.content?.substring(0, 150),
          authorId: data.authorId,
          authorName: userProfile.value.displayName || 'ผู้ใช้นิรนาม',
          authorSlug: userProfile.value.slug,
          authorPhoto: userProfile.value.photoURL,
          moodCategory: data.mood,
          createdAt: data.createdAt,
          commentCount: data.commentsCount || 0,
          likeCount: data.likesCount || 0,
          viewCount: data.viewCount || 0
        }
      })

    console.log('[loadProblems] Loaded:', problems.value.length, 'problems for profile')
  } catch (error) {
    console.error('[loadProblems] Error loading problems:', error)
  } finally {
    loadingProblems.value = false
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 'stories' && stories.value.length === 0 && !loadingStories.value) {
    loadStories()
  } else if (newTab === 'problems' && problems.value.length === 0 && !loadingProblems.value) {
    loadProblems()
  }
})

onMounted(async () => {
  await loadUserProfile()
  await checkFriendStatus()
  // Load initial tab content
  if (activeTab.value === 'stories') {
    await loadStories()
  } else if (activeTab.value === 'problems') {
    await loadProblems()
  }
})
</script>

<style scoped>
.prose {
  max-width: none;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
  opacity: 0;
}
</style>
