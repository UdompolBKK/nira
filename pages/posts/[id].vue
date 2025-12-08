<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
        <button
          @click="router.back()"
          class="p-2 -ml-2 text-gray-600 hover:text-gray-900"
        >
          <Icon name="lucide:arrow-left" class="w-6 h-6" />
        </button>

        <span class="text-sm text-gray-500">บันทึก</span>

        <button
          v-if="isOwner"
          @click="showOptions = !showOptions"
          class="p-2 -mr-2 text-gray-600 hover:text-gray-900"
        >
          <Icon name="lucide:more-horizontal" class="w-6 h-6" />
        </button>
        <div v-else class="w-10" />
      </div>

      <!-- Options dropdown -->
      <div
        v-if="showOptions && isOwner"
        class="absolute right-4 top-14 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[150px]"
      >
        <button
          @click="handleEdit"
          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
        >
          แก้ไข
        </button>
        <button
          @click="handleDelete"
          class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
        >
          ลบบันทึก
        </button>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="max-w-2xl mx-auto px-4 py-8">
      <div class="animate-pulse space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-gray-200" />
          <div>
            <div class="h-4 w-24 bg-gray-200 rounded mb-1" />
            <div class="h-3 w-16 bg-gray-100 rounded" />
          </div>
        </div>
        <div class="space-y-2">
          <div class="h-4 w-full bg-gray-200 rounded" />
          <div class="h-4 w-full bg-gray-200 rounded" />
          <div class="h-4 w-3/4 bg-gray-100 rounded" />
        </div>
      </div>
    </div>

    <!-- Not found -->
    <div v-else-if="!post" class="max-w-2xl mx-auto px-4 py-16 text-center">
      <Icon name="lucide:file-question" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h2 class="text-lg font-medium text-gray-900 mb-2">ไม่พบบันทึกนี้</h2>
      <p class="text-gray-500 mb-6">บันทึกอาจถูกลบหรือตั้งค่าเป็นส่วนตัว</p>
      <NuxtLink
        to="/browse"
        class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full"
      >
        กลับไปหน้าบันทึก
      </NuxtLink>
    </div>

    <!-- Post content -->
    <main v-else class="max-w-2xl mx-auto px-4 py-6">
      <!-- Author info -->
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          <img
            v-if="post.authorPhoto"
            :src="post.authorPhoto"
            :alt="post.authorName"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
            <Icon name="lucide:user" class="w-6 h-6" />
          </div>
        </div>
        <div class="flex-1">
          <p class="font-medium text-gray-900">{{ post.authorName }}</p>
          <p class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</p>
        </div>
        <div
          class="px-3 py-1.5 rounded-full text-sm"
          :class="MOOD_CATEGORIES[post.moodCategory]?.color || 'bg-gray-100'"
        >
          {{ MOOD_CATEGORIES[post.moodCategory]?.emoji }}
          {{ MOOD_CATEGORIES[post.moodCategory]?.label }}
        </div>
      </div>

      <!-- Content -->
      <article
        class="prose prose-gray max-w-none mb-8"
        v-html="post.content"
      />

      <!-- Emotions -->
      <div class="flex items-center gap-3 py-4 border-t border-b border-gray-200">
        <EmotionButton
          type="like"
          :count="post.likeCount"
          :is-active="userEmotion === 'like'"
          :loading="emotionLoading"
          @click="handleEmotion('like')"
        />
        <EmotionButton
          type="sad"
          :count="post.sadCount"
          :is-active="userEmotion === 'sad'"
          :loading="emotionLoading"
          @click="handleEmotion('sad')"
        />
        <EmotionButton
          type="happy"
          :count="post.happyCount"
          :is-active="userEmotion === 'happy'"
          :loading="emotionLoading"
          @click="handleEmotion('happy')"
        />

        <div class="flex items-center gap-1.5 text-gray-400 ml-auto">
          <Icon name="lucide:eye" class="w-4 h-4" />
          <span class="text-sm">{{ post.viewCount }}</span>
        </div>
      </div>

      <!-- Visibility indicator -->
      <div v-if="post.visibility !== 'public' || post.isLocked" class="flex items-center gap-2 py-3 text-gray-500 text-sm">
        <Icon
          :name="post.isLocked ? 'lucide:lock' : (post.visibility === 'private' ? 'lucide:lock' : 'lucide:users')"
          class="w-4 h-4"
        />
        <span v-if="post.isLocked">โพสต์นี้ถูกล็อก</span>
        <span v-else-if="post.visibility === 'private'">โพสต์ส่วนตัว</span>
        <span v-else>เฉพาะเพื่อนเท่านั้น</span>
      </div>

      <!-- Comments section -->
      <div class="mt-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          ความคิดเห็น ({{ post.commentCount }})
        </h3>
        <CommentSection :post-id="postId" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { MOOD_CATEGORIES } from '~/composables/usePosts'
import type { EmotionType } from '~/composables/useEmotions'

definePageMeta({
  layout: false,
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const postId = route.params.id as string

const { getPost, incrementView, deletePost, loading } = usePosts()
const { toggleEmotion, getUserEmotion } = useEmotions()
const { user } = useAuth()

const post = ref<any>(null)
const userEmotion = ref<EmotionType | null>(null)
const emotionLoading = ref(false)
const showOptions = ref(false)

// Check if current user is owner
const isOwner = computed(() => {
  return user.value && post.value && user.value.uid === post.value.userId
})

// Load post
onMounted(async () => {
  post.value = await getPost(postId)

  if (post.value) {
    // Set page title and meta tags
    const excerpt = post.value.content?.replace(/<[^>]*>/g, '').substring(0, 160) || 'บันทึก'

    useHead({
      title: `${post.value.excerpt?.substring(0, 50) || 'บันทึก'}... - บันทึกนิรนาม.com`,
      meta: [
        {
          name: 'description',
          content: excerpt
        },
        {
          property: 'og:title',
          content: `บันทึกจาก ${post.value.authorName || 'ผู้ใช้นิรนาม'}`
        },
        {
          property: 'og:description',
          content: excerpt
        },
        {
          property: 'og:image',
          content: post.value.authorPhoto || 'https://banthukniranan.com/og-default.jpg'
        },
        {
          property: 'og:type',
          content: 'article'
        },
        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:title',
          content: `บันทึกจาก ${post.value.authorName || 'ผู้ใช้นิรนาม'}`
        },
        {
          name: 'twitter:description',
          content: excerpt
        },
        {
          name: 'twitter:image',
          content: post.value.authorPhoto || 'https://banthukniranan.com/og-default.jpg'
        }
      ]
    })

    // Increment view
    await incrementView(postId)

    // Get user's emotion
    if (user.value) {
      userEmotion.value = await getUserEmotion(postId)
    }
  }
})

// Handle emotion
const handleEmotion = async (type: EmotionType) => {
  if (!user.value) {
    router.push('/login')
    return
  }

  emotionLoading.value = true
  const success = await toggleEmotion(postId, type)
  emotionLoading.value = false

  if (success) {
    // Update local state
    if (userEmotion.value === type) {
      post.value[`${type}Count`]--
      userEmotion.value = null
    } else {
      if (userEmotion.value) {
        post.value[`${userEmotion.value}Count`]--
      }
      post.value[`${type}Count`]++
      userEmotion.value = type
    }
  }
}

// Handle edit
const handleEdit = () => {
  showOptions.value = false
  router.push(`/editor?edit=${postId}`)
}

// Handle delete
const handleDelete = async () => {
  showOptions.value = false
  if (!confirm('ต้องการลบบันทึกนี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) return

  const success = await deletePost(postId)
  if (success) {
    router.push('/browse')
  }
}

// Format date
const formatDate = (date: Date) => {
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Close options on click outside
onMounted(() => {
  const handleClickOutside = (e: Event) => {
    if (showOptions.value) {
      showOptions.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style>
.prose {
  font-size: 1.125rem;
  line-height: 1.75;
}
.prose p {
  margin-bottom: 1rem;
}
.prose strong {
  font-weight: 600;
}
.prose em {
  font-style: italic;
}
</style>
