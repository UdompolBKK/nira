<template>
  <article
    class="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-all cursor-pointer"
    @click="navigateToPost"
  >
    <!-- Author info -->
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
        <img
          v-if="post.authorPhoto"
          :src="post.authorPhoto"
          :alt="post.authorName"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
          <Icon name="lucide:user" class="w-5 h-5" />
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-medium text-gray-900 truncate">{{ post.authorName }}</p>
        <p class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</p>
      </div>
      <div v-if="post.moodCategory" class="flex-shrink-0">
        <span class="text-xl">{{ getMoodEmoji(post.moodCategory) }}</span>
      </div>
    </div>

    <!-- Excerpt -->
    <p class="text-gray-600 text-sm mb-3 line-clamp-3">
      {{ stripHtml(post.excerpt || post.content) }}
    </p>

    <!-- Stats -->
    <div class="flex items-center gap-4 pt-3 border-t border-gray-100">
      <button
        @click.stop="handleEmotion('like')"
        class="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors"
        :class="{ 'text-gray-900': userEmotion === 'like' }"
      >
        <Icon
          name="lucide:heart"
          class="w-4 h-4"
          :class="{ 'fill-current': userEmotion === 'like' }"
        />
        <span class="text-sm">{{ post.likeCount || 0 }}</span>
      </button>

      <button
        @click.stop="handleEmotion('sad')"
        class="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors"
        :class="{ 'text-gray-900': userEmotion === 'sad' }"
      >
        <Icon name="lucide:frown" class="w-4 h-4" />
        <span class="text-sm">{{ post.sadCount || 0 }}</span>
      </button>

      <button
        @click.stop="handleEmotion('happy')"
        class="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors"
        :class="{ 'text-gray-900': userEmotion === 'happy' }"
      >
        <Icon name="lucide:smile" class="w-4 h-4" />
        <span class="text-sm">{{ post.happyCount || 0 }}</span>
      </button>

      <div class="flex items-center gap-1.5 text-gray-400 ml-auto">
        <Icon name="lucide:message-circle" class="w-4 h-4" />
        <span class="text-sm">{{ post.commentCount || 0 }}</span>
      </div>

      <div class="flex items-center gap-1.5 text-gray-400">
        <Icon name="lucide:eye" class="w-4 h-4" />
        <span class="text-sm">{{ post.viewCount || 0 }}</span>
      </div>
    </div>

    <!-- Visibility indicator -->
    <div v-if="post.visibility !== 'public'" class="mt-3 flex items-center gap-1.5 text-gray-400 text-xs">
      <Icon
        :name="post.visibility === 'private' ? 'lucide:lock' : 'lucide:users'"
        class="w-3 h-3"
      />
      <span>{{ post.visibility === 'private' ? 'ส่วนตัว' : 'เพื่อนเท่านั้น' }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { MOOD_CATEGORIES, type Post, type MoodCategory } from '~/composables/usePosts'
import type { EmotionType } from '~/composables/useEmotions'

const props = defineProps<{
  post: Post
}>()

const router = useRouter()
const { user } = useAuth()
const { toggleEmotion, getUserEmotion } = useEmotions()

const userEmotion = ref<EmotionType | null>(null)

// Load user's emotion
onMounted(async () => {
  if (user.value) {
    userEmotion.value = await getUserEmotion(props.post.id)
  }
})

// Navigate to post detail
const navigateToPost = () => {
  router.push(`/posts/${props.post.id}`)
}

// Handle emotion click
const handleEmotion = async (type: EmotionType) => {
  if (!user.value) {
    router.push('/login')
    return
  }

  const success = await toggleEmotion(props.post.id, type)
  if (success) {
    if (userEmotion.value === type) {
      userEmotion.value = null
    } else {
      userEmotion.value = type
    }
  }
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
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Get mood emoji
const getMoodEmoji = (moodCategory: MoodCategory) => {
  return MOOD_CATEGORIES[moodCategory]?.emoji || '😐'
}

// Strip HTML tags
const stripHtml = (html: string) => {
  return html?.replace(/<[^>]*>/g, '') || ''
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
