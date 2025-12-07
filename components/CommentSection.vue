<template>
  <div class="space-y-4">
    <!-- Comment form -->
    <div v-if="user" class="flex gap-3">
      <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
        <img
          v-if="user.photoURL"
          :src="user.photoURL"
          :alt="user.displayName || ''"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
          <Icon name="lucide:user" class="w-5 h-5" />
        </div>
      </div>
      <div class="flex-1">
        <textarea
          v-model="newComment"
          placeholder="เขียนความคิดเห็น..."
          rows="2"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 resize-none text-sm"
          :disabled="loading"
        />
        <div class="flex justify-end mt-2">
          <button
            @click="submitComment"
            :disabled="!newComment.trim() || loading"
            class="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? 'กำลังส่ง...' : 'ส่งความคิดเห็น' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Login prompt -->
    <div v-else class="text-center py-4 border border-gray-200 rounded-lg">
      <p class="text-gray-600 text-sm mb-2">เข้าสู่ระบบเพื่อแสดงความคิดเห็น</p>
      <NuxtLink
        to="/login"
        class="text-gray-900 font-medium text-sm hover:underline"
      >
        เข้าสู่ระบบ
      </NuxtLink>
    </div>

    <!-- Comments list -->
    <div v-if="loadingComments" class="text-center py-8">
      <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400" />
    </div>

    <div v-else-if="comments.length === 0" class="text-center py-8 text-gray-500 text-sm">
      ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็น
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="flex gap-3"
        :class="{ 'bg-gray-50 -mx-4 px-4 py-3 rounded-lg': comment.isPriority }"
      >
        <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          <img
            v-if="comment.authorPhoto"
            :src="comment.authorPhoto"
            :alt="comment.authorName"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
            <Icon name="lucide:user" class="w-5 h-5" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-medium text-gray-900 text-sm">{{ comment.authorName }}</span>
            <span class="text-gray-400 text-xs">{{ formatDate(comment.createdAt) }}</span>
            <span
              v-if="comment.isPriority"
              class="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full"
            >
              Premium
            </span>
          </div>
          <p class="text-gray-700 text-sm whitespace-pre-wrap">{{ comment.content }}</p>

          <!-- Delete button (for own comments) -->
          <button
            v-if="user && comment.userId === user.uid"
            @click="handleDelete(comment.id)"
            class="mt-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ลบความคิดเห็น
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  postId: string
}>()

const { user } = useAuth()
const { comments, loading: loadingComments, addComment, deleteComment, getComments } = useComments()

const newComment = ref('')
const loading = ref(false)

// Load comments
onMounted(async () => {
  await getComments(props.postId)
})

// Submit comment
const submitComment = async () => {
  if (!newComment.value.trim()) return

  loading.value = true
  const success = await addComment(props.postId, newComment.value)
  if (success) {
    newComment.value = ''
    await getComments(props.postId)
  }
  loading.value = false
}

// Delete comment
const handleDelete = async (commentId: string) => {
  if (!confirm('ต้องการลบความคิดเห็นนี้?')) return

  await deleteComment(commentId, props.postId)
}

// Format date
const formatDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'เมื่อสักครู่'
  if (minutes < 60) return `${minutes} นาที`
  if (hours < 24) return `${hours} ชม.`
  if (days < 7) return `${days} วัน`

  return date.toLocaleDateString('th-TH', {
    month: 'short',
    day: 'numeric'
  })
}
</script>
