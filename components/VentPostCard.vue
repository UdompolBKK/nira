<template>
  <div class="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all overflow-hidden" style="margin-bottom: 20px !important;">
    <!-- Post Header -->
    <div class="p-6 pb-4">
      <div class="flex items-start gap-4">
        <!-- Avatar -->
        <NuxtLink
          v-if="post.authorSlug"
          :to="`/users/${post.authorSlug}`"
          class="flex-shrink-0"
        >
          <img
            v-if="post.authorPhotoURL"
            :src="post.authorPhotoURL"
            :alt="post.authorName"
            class="w-12 h-12 rounded-full object-cover shadow-md border-2 border-pink-200 hover:border-pink-300 transition-all"
          />
          <div
            v-else
            class="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg transition-all"
          >
            {{ post.authorInitial }}
          </div>
        </NuxtLink>
        <template v-else>
          <img
            v-if="post.authorPhotoURL"
            :src="post.authorPhotoURL"
            :alt="post.authorName"
            class="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow-md border-2 border-pink-200"
          />
          <div
            v-else
            class="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md"
          >
            {{ post.authorInitial }}
          </div>
        </template>

        <div class="flex-1 min-w-0">
          <!-- Author & Time -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex-1">
              <NuxtLink
                v-if="post.authorSlug"
                :to="`/users/${post.authorSlug}`"
                class="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {{ post.authorName }}
              </NuxtLink>
              <h3 v-else class="font-semibold text-gray-900">{{ post.authorName }}</h3>
              <p class="text-xs text-gray-500">
                {{ formatDate(post.createdAt) }}
                <span v-if="post.editedAt" class="text-gray-400">
                  • แก้ไขเมื่อ {{ formatDate(post.editedAt) }}
                </span>
              </p>
            </div>
            <!-- Mood Badge -->
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium flex-shrink-0',
                getMoodColor(post.mood)
              ]"
            >
              {{ getMoodEmoji(post.mood) }} {{ getMoodLabel(post.mood) }}
            </span>
          </div>

          <!-- Content -->
          <p class="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
            {{ post.content }}
          </p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <!-- Like Button -->
        <button
          @click="$emit('like', post.id)"
          :class="[
            'flex items-center gap-2 transition-all',
            post.isLiked
              ? 'text-pink-600 font-semibold'
              : 'text-gray-600 hover:text-pink-600'
          ]"
        >
          <Icon
            :name="post.isLiked ? 'lucide:heart' : 'lucide:heart'"
            :class="['w-5 h-5', post.isLiked ? 'fill-current' : '']"
          />
          <span class="text-sm">{{ post.likesCount }}</span>
        </button>

        <!-- Comment Button -->
        <button
          @click="$emit('toggle-comments', post.id)"
          class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Icon name="lucide:message-circle" class="w-5 h-5" />
          <span class="text-sm">{{ post.commentsCount }}</span>
        </button>
      </div>

      <!-- Edit/Delete Menu (only for post owner) - มุมขวาล่าง -->
      <div v-if="post.isOwner" class="relative">
        <button
          @click="$emit('toggle-menu', post.id)"
          class="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Icon name="lucide:more-horizontal" class="w-5 h-5 text-gray-500" />
        </button>

        <!-- Dropdown Menu -->
        <Transition name="dropdown">
          <div
            v-if="post.showMenu"
            class="absolute right-0 bottom-full mb-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
          >
            <button
              @click="$emit('edit', post.id)"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Icon name="lucide:edit-3" class="w-4 h-4" />
              แก้ไข
            </button>
            <button
              @click="$emit('delete', post.id)"
              class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Icon name="lucide:trash-2" class="w-4 h-4" />
              ลบ
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Comments Section -->
    <Transition name="slide">
      <div v-if="post.showComments" class="border-t border-gray-100 bg-gray-50">
        <!-- Comments List -->
        <div v-if="post.comments?.length > 0" class="p-4 space-y-3 max-h-64 overflow-y-auto">
          <div
            v-for="comment in post.comments"
            :key="comment.id"
            class="flex items-start gap-3"
          >
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {{ comment.authorInitial }}
            </div>
            <div class="flex-1 bg-white rounded-lg p-3">
              <p class="text-xs font-semibold text-gray-900 mb-1">{{ comment.authorName }}</p>
              <p class="text-sm text-gray-700">{{ comment.content }}</p>
            </div>
          </div>
        </div>

        <!-- Add Comment -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex gap-2">
            <input
              :value="post.newComment"
              @input="$emit('update-comment', post.id, $event.target.value)"
              type="text"
              placeholder="เขียนความคิดเห็น..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              @keyup.enter="$emit('add-comment', post.id)"
            />
            <button
              @click="$emit('add-comment', post.id)"
              :disabled="!post.newComment?.trim()"
              class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ส่ง
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface VentPost {
  id: string
  content: string
  authorId: string
  authorName: string
  authorSlug?: string
  authorInitial: string
  authorPhotoURL?: string | null
  mood: string
  createdAt: any
  editedAt?: any
  likesCount: number
  commentsCount: number
  isLiked?: boolean
  isOwner?: boolean
  showComments?: boolean
  showMenu?: boolean
  newComment?: string
  comments?: VentComment[]
}

interface VentComment {
  id: string
  content: string
  authorId: string
  authorName: string
  authorInitial: string
  createdAt: any
}

interface Props {
  post: VentPost
}

defineProps<Props>()

defineEmits<{
  like: [postId: string]
  'toggle-comments': [postId: string]
  'add-comment': [postId: string]
  'update-comment': [postId: string, value: string]
  'toggle-menu': [postId: string]
  edit: [postId: string]
  delete: [postId: string]
}>()

const moods = [
  { value: 'sad', label: 'เศร้า', emoji: '😢', color: 'bg-blue-100 text-blue-700' },
  { value: 'stressed', label: 'เครียด', emoji: '😰', color: 'bg-orange-100 text-orange-700' },
  { value: 'anxious', label: 'วิตกกังวล', emoji: '😟', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'angry', label: 'โกรธ', emoji: '😠', color: 'bg-red-100 text-red-700' },
  { value: 'neutral', label: 'ปกติ', emoji: '😐', color: 'bg-gray-100 text-gray-700' }
]

const getMoodEmoji = (moodValue: string) => {
  return moods.find(m => m.value === moodValue)?.emoji || '😐'
}

const getMoodLabel = (moodValue: string) => {
  return moods.find(m => m.value === moodValue)?.label || 'ปกติ'
}

const getMoodColor = (moodValue: string) => {
  return moods.find(m => m.value === moodValue)?.color || 'bg-gray-100 text-gray-700'
}

const formatDate = (timestamp: any) => {
  if (!timestamp) return ''

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

  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.95);
}
</style>
