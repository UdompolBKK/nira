<template>
  <div class="min-h-screen bg-white">
    <!-- AI Companion Widget -->
    <AICompanion :editor-content="content" />

    <main class="max-w-2xl mx-auto px-4 py-6">
      <!-- User Info Section -->
      <div v-if="!profileLoading && userProfile" class="mb-8 text-center">
        <div class="flex flex-col items-center gap-3">
          <img
            :src="userProfile.photoURL || '/images/default-avatar.png'"
            :alt="userProfile.displayName || 'User'"
            class="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
          />
          <div class="text-lg font-semibold text-gray-900">
            {{ userProfile.displayName || 'ผู้ใช้นิรนาม' }}
          </div>
        </div>
      </div>

      <h2 style="text-align: center;" class="text-2xl font-bold text-gray-900 mb-8">
          เริ่มต้นตั้งแต่ฉันจำความได้
        </h2>
      <!-- Timeline container -->
      <div class="relative">
        <!-- Timeline line - thin and subtle -->
        <div class="absolute left-[11px] top-0 bottom-0 w-px bg-gray-200" />
        <!-- User's previous posts (sorted oldest to newest) -->
        <TransitionGroup name="post" tag="div">
          <template v-for="(post, index) in posts" :key="post.id">
            <!-- Insert button before post (except first) -->
            <div
              v-if="index > 0"
              class="relative pl-10 py-1 group"
            >
              <button
                @click="openInsertEditor(index)"
                class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Icon name="lucide:plus" class="w-3.5 h-3.5" />
                <span>แทรก</span>
              </button>
            </div>

            <div class="relative pl-10 pb-3">
              <!-- Timeline dot - smaller for cleaner look -->
              <div
                class="absolute left-2 w-2 h-2 rounded-full bg-gray-300 ring-2 ring-white transition-all duration-500"
                :class="{ 'bg-gray-700 scale-125': index === posts.length - 1 && justPosted }"
              />

              <!-- Inline editor for this post (when editing) -->
              <div v-if="editingPostId === post.id" class="mb-4">
                <div class="bg-white border-2 border-gray-900 rounded-2xl overflow-hidden shadow-lg">
                  <div
                    ref="editContentRef"
                    contenteditable="true"
                    class="min-h-[100px] p-4 text-gray-900 leading-relaxed focus:outline-none"
                    @input="handleEditInput"
                    @paste="handlePaste"
                    v-html="editContent"
                  />

                  <div class="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
                    <!-- Mood selector -->
                    <div class="flex flex-wrap gap-1.5">
                      <button
                        v-for="(mood, key) in MOOD_CATEGORIES"
                        :key="key"
                        @click="editMood = key"
                        class="px-2.5 py-1 rounded-full text-xs border transition-all duration-200"
                        :class="[
                          editMood === key
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        ]"
                      >
                        {{ mood.emoji }}
                      </button>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-2">
                      <button
                        @click="saveEdit"
                        :disabled="saving"
                        class="flex-1 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all"
                      >
                        {{ saving ? 'กำลังบันทึก...' : 'บันทึก' }}
                      </button>
                      <button
                        @click="cancelEdit"
                        class="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-all"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Post card (hidden when editing this post) -->
              <div
                v-else
                class="group/post transition-all duration-500"
                :class="{ 'bg-gray-50 rounded-xl px-3 py-2 -mx-3': index === posts.length - 1 && justPosted }"
              >
                <!-- Content - flows naturally like autobiography text -->
                <div
                  class="text-gray-800 leading-relaxed prose prose-sm max-w-none"
                  v-html="post.content"
                />

                <!-- Actions & Date - show on hover (desktop) or always show for owner (mobile) -->
                <div
                  class="flex items-center gap-3 mt-2 transition-opacity duration-200"
                  :class="[
                    'md:opacity-0 md:group-hover/post:opacity-100',
                    isMobile ? 'opacity-100' : ''
                  ]"
                >
                  <!-- Date (hidden until hover) -->
                  <span class="text-xs text-gray-400">
                    {{ formatDate(post.createdAt) }}
                  </span>
                  <span
                    class="text-xs opacity-70"
                    :title="MOOD_CATEGORIES[post.moodCategory]?.label"
                  >
                    {{ MOOD_CATEGORIES[post.moodCategory]?.emoji }}
                  </span>
                  <NuxtLink
                    :to="`/posts/${post.id}`"
                    class="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors text-xs"
                  >
                    <Icon name="lucide:message-circle" class="w-3.5 h-3.5" />
                    <span>{{ post.commentCount || 0 }}</span>
                  </NuxtLink>
                  <span class="flex items-center gap-1 text-gray-400 text-xs">
                    <Icon name="lucide:heart" class="w-3.5 h-3.5" />
                    <span>{{ post.likeCount || 0 }}</span>
                  </span>
                  <div class="flex-1" />
                  <button
                    @click="startEdit(post)"
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                    title="แก้ไข"
                  >
                    <Icon name="lucide:pencil" class="w-3.5 h-3.5" />
                  </button>
                  <button
                    @click="handleDelete(post.id)"
                    class="text-gray-400 hover:text-red-500 transition-colors"
                    title="ลบ"
                  >
                    <Icon name="lucide:trash-2" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </template>
        </TransitionGroup>

        <!-- Insert editor (when inserting between posts) -->
        <Transition name="fade">
          <div
            v-if="insertAtIndex !== null"
            class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            @click.self="closeInsertEditor"
          >
            <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
              <div class="p-4 border-b border-gray-100">
                <h3 class="font-medium text-gray-900">แทรกเรื่องราว</h3>
                <p class="text-xs text-gray-500 mt-1">
                  เพิ่มเรื่องราวระหว่างโพสที่ {{ insertAtIndex }} และ {{ insertAtIndex + 1 }}
                </p>
              </div>

              <div
                ref="insertEditorRef"
                contenteditable="true"
                class="min-h-[120px] p-4 text-gray-900 leading-relaxed focus:outline-none"
                @input="handleInsertInput"
                @paste="handlePaste"
                :data-placeholder="placeholder"
              />

              <div class="border-t border-gray-100 p-4 space-y-3 bg-gray-50">
                <!-- Mood selector -->
                <div>
                  <p class="text-xs text-gray-500 mb-2">ช่วงเวลานี้เป็นอย่างไร?</p>
                  <div class="flex flex-wrap gap-1.5">
                    <button
                      v-for="(mood, key) in MOOD_CATEGORIES"
                      :key="key"
                      @click="insertMood = key"
                      class="px-2.5 py-1 rounded-full text-xs border transition-all duration-200"
                      :class="[
                        insertMood === key
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      ]"
                    >
                      {{ mood.emoji }} {{ mood.label }}
                    </button>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-2">
                  <button
                    @click="saveInsert"
                    :disabled="!insertContent.trim() || saving"
                    class="flex-1 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all"
                  >
                    {{ saving ? 'กำลังบันทึก...' : 'แทรกเรื่องราว' }}
                  </button>
                  <button
                    @click="closeInsertEditor"
                    class="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm rounded-xl hover:bg-gray-200 transition-all"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Editor section -->
        <div class="relative pl-10 pb-8">
          <!-- Timeline dot for editor -->
          <div
            class="absolute left-2 w-2 h-2 rounded-full transition-all duration-300"
            :class="isEditing ? 'bg-gray-700 scale-150' : 'bg-gray-300'"
          />

          <!-- Editor card -->
          <div
            class="bg-white border-2 rounded-2xl overflow-hidden transition-all duration-300"
            :class="isEditing ? 'border-gray-900 shadow-lg' : 'border-gray-200'"
          >
            <!-- Editor content -->
            <div
              ref="editorRef"
              contenteditable="true"
              class="min-h-[100px] p-4 text-gray-900 leading-relaxed focus:outline-none"
              @input="handleInput"
              @focus="isEditing = true"
              @paste="handlePaste"
              @keydown="handleKeydown"
              :data-placeholder="placeholder"
            />

            <!-- Editor footer -->
            <div
              class="border-t border-gray-100 p-4 space-y-4 transition-all duration-300"
              :class="{ 'bg-gray-50': isEditing }"
            >
              <!-- Character count -->
              <div class="text-right">
                <span class="text-xs text-gray-400">{{ characterCount }} ตัวอักษร</span>
              </div>

              <!-- Mood selector -->
              <div>
                <p class="text-xs text-gray-500 mb-2">ช่วงเวลานี้ของคุณเป็นอย่างไร?</p>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="(mood, key) in MOOD_CATEGORIES"
                    :key="key"
                    @click="selectedMood = key"
                    class="px-3 py-1.5 rounded-full text-xs border transition-all duration-200"
                    :class="[
                      selectedMood === key
                        ? 'bg-gray-900 text-white border-gray-900 scale-105'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    ]"
                  >
                    <span class="mr-1">{{ mood.emoji }}</span>
                    <span>{{ mood.label }}</span>
                  </button>
                </div>
              </div>

              <!-- Critical warning -->
              <Transition name="fade">
                <div
                  v-if="selectedMood === 'critical'"
                  class="p-3 bg-gray-100 rounded-lg text-xs"
                >
                  <p class="text-gray-700 mb-1.5">
                    <strong>หากคุณกำลังมีความคิดทำร้ายตัวเอง กรุณาติดต่อ:</strong>
                  </p>
                  <ul class="text-gray-600 space-y-0.5">
                    <li>สายด่วนสุขภาพจิต: <a href="tel:1323" class="underline font-medium">1323</a></li>
                    <li>สมาคมสะมาริตันส์: <a href="tel:022713793" class="underline font-medium">02-271-3793</a></li>
                  </ul>
                </div>
              </Transition>

              <!-- Lock toggle -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Icon name="lucide:lock" class="w-4 h-4 text-gray-400" />
                  <span class="text-xs text-gray-600">ล็อกโพสต์นี้</span>
                </div>
                <button
                  @click="isLocked = !isLocked"
                  class="relative w-10 h-5 rounded-full transition-colors duration-200"
                  :class="isLocked ? 'bg-gray-900' : 'bg-gray-200'"
                >
                  <span
                    class="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 shadow-sm"
                    :class="isLocked ? 'left-5' : 'left-0.5'"
                  />
                </button>
              </div>

              <!-- Save button -->
              <button
                @click="savePost"
                :disabled="!canSave || saving"
                class="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <span v-if="saving" class="flex items-center justify-center gap-2">
                  <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                  กำลังบันทึก...
                </span>
                <span v-else>บันทึก</span>
              </button>
            </div>
          </div>
        </div>


        <!-- Empty state -->
        <div v-if="!loading && posts.length === 0 && !isEditing" class="relative pl-10 py-8">
          <div class="text-center text-gray-400">
            <Icon name="lucide:book-open" class="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p class="text-sm">เริ่มเขียนบันทึกแรกของคุณ</p>
          </div>
        </div>
      </div>

      <!-- Error toast -->
      <Transition name="slide-up">
        <div
          v-if="error"
          class="fixed bottom-20 left-4 right-4 max-w-md mx-auto p-4 bg-red-50 text-red-700 text-sm rounded-xl shadow-lg"
        >
          {{ error }}
        </div>
      </Transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { MOOD_CATEGORIES, type MoodCategory, type Post } from '~/composables/usePosts'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'เขียนบันทึก - Nira'
})

const { user } = useAuth()
const { posts, loading, hasMore, createPost, updatePost, deletePost, getUserPosts, createInsertedPost, error } = usePosts()

// User profile for anonymous name and photo
const userProfile = ref<{ displayName: string | null; photoURL: string | null } | null>(null)
const profileLoading = ref(true)

// Editor state
const content = ref('')
const selectedMood = ref<MoodCategory>('normal')
const isLocked = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editorRef = ref<HTMLElement | null>(null)
const justPosted = ref(false)
const loadingMore = ref(false)

// Mobile detection
const isMobile = ref(false)
const checkMobile = () => {
  if (import.meta.client) {
    isMobile.value = window.innerWidth < 768
  }
}

// Edit state
const editingPostId = ref<string | null>(null)
const editContent = ref('')
const editMood = ref<MoodCategory>('normal')
const editContentRef = ref<HTMLElement | null>(null)

// Insert state
const insertAtIndex = ref<number | null>(null)
const insertContent = ref('')
const insertMood = ref<MoodCategory>('normal')
const insertEditorRef = ref<HTMLElement | null>(null)

const placeholder = 'เขียนเรื่องราวของคุณที่นี่...'

// Character count
const characterCount = computed(() => {
  return content.value.replace(/<[^>]*>/g, '').length
})

// Can save check
const canSave = computed(() => {
  return content.value.replace(/<[^>]*>/g, '').trim().length > 0
})

// Handle input
const handleInput = (e: Event) => {
  const target = e.target as HTMLElement
  content.value = target.innerHTML
}

// Handle paste - strip formatting
const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') || ''
  document.execCommand('insertText', false, text)
}

// Handle keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault()
    document.execCommand('bold')
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
    e.preventDefault()
    document.execCommand('italic')
  }
}

// Save post
const savePost = async () => {
  if (!canSave.value || saving.value) return

  saving.value = true

  const postId = await createPost({
    content: content.value,
    visibility: 'public',
    isLocked: isLocked.value,
    tags: [],
    moodCategory: selectedMood.value,
    postType: 'vent' // Editor creates vent posts
  })

  saving.value = false

  if (postId) {
    // Clear editor
    content.value = ''
    if (editorRef.value) {
      editorRef.value.innerHTML = ''
    }
    selectedMood.value = 'normal'
    isLocked.value = false
    isEditing.value = false

    // Show animation
    justPosted.value = true
    setTimeout(() => {
      justPosted.value = false
    }, 2000)

    // Reload posts
    if (user.value) {
      await getUserPosts(user.value.uid, 10)
    }
  }
}

// Delete post
const handleDelete = async (id: string) => {
  if (!confirm('ต้องการลบบันทึกนี้?')) return
  await deletePost(id)
}

// === Edit Functions ===
const startEdit = (post: Post) => {
  editingPostId.value = post.id
  editContent.value = post.content
  editMood.value = post.moodCategory
}

const handleEditInput = (e: Event) => {
  const target = e.target as HTMLElement
  editContent.value = target.innerHTML
}

const saveEdit = async () => {
  if (!editingPostId.value || saving.value) return

  saving.value = true
  const success = await updatePost(editingPostId.value, {
    content: editContent.value,
    moodCategory: editMood.value
  })
  saving.value = false

  if (success) {
    editingPostId.value = null
    editContent.value = ''
    // Reload posts to show updated content
    if (user.value) {
      await getUserPosts(user.value.uid, 10)
    }
  }
}

const cancelEdit = () => {
  editingPostId.value = null
  editContent.value = ''
  editMood.value = 'normal'
}

// === Insert Functions ===
const openInsertEditor = (index: number) => {
  insertAtIndex.value = index
  insertContent.value = ''
  insertMood.value = 'normal'
  // Focus editor after modal opens
  nextTick(() => {
    insertEditorRef.value?.focus()
  })
}

const handleInsertInput = (e: Event) => {
  const target = e.target as HTMLElement
  insertContent.value = target.innerHTML
}

const closeInsertEditor = () => {
  insertAtIndex.value = null
  insertContent.value = ''
  insertMood.value = 'normal'
}

const saveInsert = async () => {
  if (insertAtIndex.value === null || !insertContent.value.trim() || saving.value) return

  const index = insertAtIndex.value
  const beforePost = posts.value[index]
  const afterPost = posts.value[index - 1]

  if (!beforePost || !afterPost) return

  saving.value = true
  const postId = await createInsertedPost(
    {
      content: insertContent.value,
      visibility: 'public',
      isLocked: false,
      tags: [],
      moodCategory: insertMood.value
    },
    afterPost.createdAt,
    beforePost.createdAt
  )
  saving.value = false

  if (postId) {
    closeInsertEditor()
    // Reload posts to show inserted content
    if (user.value) {
      await getUserPosts(user.value.uid, 10)
    }
  }
}

// Load more posts
const loadMore = async () => {
  if (loadingMore.value || !hasMore.value || !user.value) return
  loadingMore.value = true
  await getUserPosts(user.value.uid, 10, true)
  loadingMore.value = false
}

// Format date
const formatDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'เมื่อสักครู่'
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`
  if (days < 7) return `${days} วันที่แล้ว`

  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Load user profile
const loadUserProfile = async () => {
  if (!user.value?._firebaseUser) {
    profileLoading.value = false
    return
  }

  try {
    const token = await user.value._firebaseUser.getIdToken()
    const response = await $fetch<{ profile: any; exists: boolean }>('/api/user/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.exists && response.profile) {
      userProfile.value = {
        displayName: response.profile.displayName || 'ผู้ใช้นิรนาม',
        photoURL: response.profile.photoURL || '/images/default-avatar.png'
      }
    } else {
      userProfile.value = {
        displayName: 'ผู้ใช้นิรนาม',
        photoURL: '/images/default-avatar.png'
      }
    }
  } catch (err) {
    console.error('Error loading profile:', err)
    userProfile.value = {
      displayName: 'ผู้ใช้นิรนาม',
      photoURL: '/images/default-avatar.png'
    }
  } finally {
    profileLoading.value = false
  }
}

// Load user's posts on mount
onMounted(async () => {
  // Check mobile on mount and resize
  checkMobile()
  window.addEventListener('resize', checkMobile)

  if (user.value) {
    await Promise.all([
      getUserPosts(user.value.uid, 10),
      loadUserProfile()
    ])
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
[contenteditable]:empty:before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}

[contenteditable]:focus:empty:before {
  content: '';
}

/* Post list animation */
.post-enter-active {
  animation: slide-down 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.post-leave-active {
  animation: fade-out 0.3s ease-out;
}

.post-move {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide up transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
