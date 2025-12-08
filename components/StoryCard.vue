<template>
  <article class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
    <!-- Article Header -->
    <div class="p-6 md:p-8 border-b border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <time class="text-sm text-gray-500">
          {{ formatDate(post.createdAt) }}
        </time>
        <span
          v-if="post.moodCategory"
          class="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
        >
          {{ getMoodEmoji(post.moodCategory) }} {{ getMoodLabel(post.moodCategory) }}
        </span>
      </div>

      <!-- Title (first line of content or excerpt) -->
      <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
        {{ getPostTitle(post) }}
      </h2>
    </div>

    <!-- Article Content -->
    <div class="p-6 md:p-8">
      <div
        class="prose prose-gray max-w-none"
        v-html="formatContent(post.content)"
      ></div>
    </div>

    <!-- Article Footer -->
    <div class="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-6 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <Icon name="lucide:heart" class="w-4 h-4" />
            <span>{{ post.likesCount || 0 }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon name="lucide:message-circle" class="w-4 h-4" />
            <span>{{ post.commentsCount || 0 }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon name="lucide:eye" class="w-4 h-4" />
            <span>{{ post.viewCount || 0 }}</span>
          </div>
        </div>

        <NuxtLink
          v-if="showReadMore"
          :to="readMoreLink"
          class="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1 group"
        >
          อ่านเพิ่มเติม
          <Icon name="lucide:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { MOOD_CATEGORIES } from '~/composables/usePosts'
import type { Timestamp } from 'firebase/firestore'

interface Post {
  id: string
  userId?: string
  content: string
  excerpt?: string
  moodCategory?: string
  likesCount?: number
  commentsCount?: number
  viewCount?: number
  createdAt: Timestamp | Date
}

interface Props {
  post: Post
  showReadMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showReadMore: true
})

// Computed read more link
const readMoreLink = computed(() => {
  return `/my-activity/${props.post.id}`
})

// Format date
const formatDate = (date: Timestamp | Date) => {
  const d = date instanceof Date ? date : date.toDate()
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Get post title (first 100 chars)
const getPostTitle = (post: Post) => {
  const text = post.excerpt || post.content
  const stripped = text.replace(/<[^>]*>/g, '').trim()
  return stripped.length > 100 ? stripped.substring(0, 100) + '...' : stripped
}

// Format content with proper paragraph breaks
const formatContent = (content: string) => {
  // Convert line breaks to paragraphs
  const paragraphs = content.split(/\n\n+/).map(p => {
    const trimmed = p.trim().replace(/\n/g, '<br>')
    return trimmed ? `<p class="mb-4">${trimmed}</p>` : ''
  }).filter(Boolean)

  return paragraphs.join('')
}

// Get mood emoji and label
const getMoodEmoji = (mood?: string) => {
  return MOOD_CATEGORIES[mood || 'normal']?.emoji || '😐'
}

const getMoodLabel = (mood?: string) => {
  return MOOD_CATEGORIES[mood || 'normal']?.label || 'ปกติ'
}
</script>

<style scoped>
/* Prose styles for article content */
.prose {
  @apply text-gray-700 leading-relaxed;
}

.prose p {
  @apply mb-4 text-base;
}

.prose strong {
  @apply font-semibold text-gray-900;
}

.prose em {
  @apply italic;
}

.prose a {
  @apply text-blue-600 hover:text-blue-700 underline;
}

.prose ul,
.prose ol {
  @apply ml-6 mb-4;
}

.prose li {
  @apply mb-2;
}

.prose blockquote {
  @apply border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4;
}

.prose code {
  @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono;
}

.prose pre {
  @apply bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4;
}
</style>
