<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">จัดการบทความ</h1>
          <p class="text-gray-600 mt-1">สร้างและแก้ไขบทความสำหรับผู้ใช้</p>
        </div>
        <NuxtLink
          to="/admin/articles/create"
          class="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Icon name="lucide:plus" class="w-5 h-5" />
          สร้างบทความใหม่
        </NuxtLink>
      </div>

      <!-- Filter tabs -->
      <div class="mb-6 flex items-center gap-2">
        <button
          @click="filter = 'all'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            filter === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          ]"
        >
          ทั้งหมด ({{ totalCount }})
        </button>
        <button
          @click="filter = 'published'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            filter === 'published'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          ]"
        >
          เผยแพร่แล้ว
        </button>
        <button
          @click="filter = 'draft'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            filter === 'draft'
              ? 'bg-gray-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          ]"
        >
          แบบร่าง
        </button>
      </div>

      <!-- Articles List -->
      <div v-if="loading" class="text-center py-12">
        <Icon name="lucide:loader-2" class="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
        <p class="text-gray-500">กำลังโหลด...</p>
      </div>

      <div v-else-if="articles.length === 0" class="text-center py-12 bg-white rounded-2xl shadow">
        <Icon name="lucide:file-text" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 mb-4">ยังไม่มีบทความ</p>
        <NuxtLink
          to="/admin/articles/create"
          class="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
        >
          <Icon name="lucide:plus" class="w-4 h-4" />
          สร้างบทความแรก
        </NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="article in articles"
          :key="article.id"
          class="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow p-6"
        >
          <div class="flex items-start gap-4">
            <!-- Cover Image Thumbnail -->
            <div v-if="article.coverImage" class="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
              <img :src="article.coverImage" :alt="article.title" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-24 h-24 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0">
              <Icon name="lucide:file-text" class="w-8 h-8 text-pink-400" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-gray-900">{{ article.title }}</h3>
                  <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ article.excerpt }}</p>
                </div>
                <span
                  :class="[
                    'ml-4 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0',
                    article.isPublished
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  ]"
                >
                  {{ article.isPublished ? 'เผยแพร่แล้ว' : 'แบบร่าง' }}
                </span>
              </div>

              <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div class="flex items-center gap-1">
                  <Icon name="lucide:calendar" class="w-4 h-4" />
                  <span>{{ formatDate(article.publishedAt || article.createdAt) }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Icon name="lucide:eye" class="w-4 h-4" />
                  <span>{{ article.views || 0 }} views</span>
                </div>
                <div v-if="article.slug" class="flex items-center gap-1">
                  <Icon name="lucide:link" class="w-4 h-4" />
                  <span class="text-pink-600">/articles/{{ article.slug }}</span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/admin/articles/${article.id}/edit`"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
                >
                  <Icon name="lucide:edit-3" class="w-4 h-4" />
                  แก้ไข
                </NuxtLink>
                <button
                  @click="togglePublish(article)"
                  :disabled="togglingId === article.id"
                  class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  <Icon v-if="togglingId === article.id" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                  <Icon v-else :name="article.isPublished ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4" />
                  {{ article.isPublished ? 'ซ่อน' : 'เผยแพร่' }}
                </button>
                <a
                  v-if="article.isPublished"
                  :href="`/articles/${article.slug}`"
                  target="_blank"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 text-sm"
                >
                  <Icon name="lucide:external-link" class="w-4 h-4" />
                  ดูบทความ
                </a>
                <button
                  @click="confirmDelete(article)"
                  :disabled="deletingId === article.id"
                  class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  <Icon v-if="deletingId === article.id" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                  <Icon v-else name="lucide:trash-2" class="w-4 h-4" />
                  ลบ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-8 flex items-center justify-center gap-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="lucide:chevron-left" class="w-5 h-5" />
        </button>
        <span class="px-4 py-2 text-gray-700">
          หน้า {{ currentPage }} / {{ pagination.totalPages }}
        </span>
        <button
          @click="currentPage++"
          :disabled="currentPage === pagination.totalPages"
          class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="lucide:chevron-right" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          @click.self="showDeleteModal = false"
        >
          <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div class="text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="lucide:trash-2" class="w-8 h-8 text-red-500" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">ยืนยันการลบบทความ</h3>
              <p class="text-gray-600 mb-6">
                คุณแน่ใจหรือไม่ว่าต้องการลบบทความ<br />
                <strong>"{{ articleToDelete?.title }}"</strong>?
              </p>
              <div class="flex items-center gap-3">
                <button
                  @click="showDeleteModal = false"
                  class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  @click="deleteArticle"
                  :disabled="deletingId !== null"
                  class="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Icon v-if="deletingId" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
                  ลบบทความ
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast">
        <div
          v-if="toast.show"
          :class="[
            'fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50',
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          ]"
        >
          <Icon :name="toast.type === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'" class="w-5 h-5" />
          {{ toast.message }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  publishedAt?: Date | string
  createdAt: Date | string
  views?: number
  isPublished: boolean
  tags?: string[]
}

const { getIdToken } = useAuth()

const articles = ref<Article[]>([])
const loading = ref(true)
const filter = ref<'all' | 'published' | 'draft'>('all')
const currentPage = ref(1)
const totalCount = ref(0)
const pagination = ref({
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1
})

const togglingId = ref<string | null>(null)
const deletingId = ref<string | null>(null)
const showDeleteModal = ref(false)
const articleToDelete = ref<Article | null>(null)

const toast = ref({
  show: false,
  type: 'success' as 'success' | 'error',
  message: ''
})

const formatDate = (timestamp: any) => {
  if (!timestamp) return 'ไม่ระบุ'
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadArticles = async () => {
  loading.value = true

  try {
    const params: Record<string, string> = {
      page: currentPage.value.toString(),
      limit: '20'
    }

    if (filter.value === 'published') {
      params.published = 'true'
    } else if (filter.value === 'draft') {
      params.published = 'false'
    }

    const queryString = new URLSearchParams(params).toString()
    const response = await $fetch<{
      success: boolean
      articles: Article[]
      pagination: typeof pagination.value
    }>(`/api/articles?${queryString}`)

    if (response.success) {
      articles.value = response.articles
      pagination.value = response.pagination
      if (filter.value === 'all') {
        totalCount.value = response.pagination.total
      }
    }
  } catch (error) {
    console.error('Error loading articles:', error)
    showToast('error', 'เกิดข้อผิดพลาดในการโหลดบทความ')
  } finally {
    loading.value = false
  }
}

const togglePublish = async (article: Article) => {
  togglingId.value = article.id

  try {
    const token = await getIdToken()

    await $fetch(`/api/articles/${article.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        coverImage: article.coverImage,
        tags: article.tags,
        isPublished: !article.isPublished
      }
    })

    // Update local state
    article.isPublished = !article.isPublished
    showToast('success', article.isPublished ? 'เผยแพร่บทความเรียบร้อยแล้ว' : 'ซ่อนบทความเรียบร้อยแล้ว')
  } catch (error: any) {
    console.error('Error toggling publish:', error)
    showToast('error', error.data?.message || 'เกิดข้อผิดพลาด')
  } finally {
    togglingId.value = null
  }
}

const confirmDelete = (article: Article) => {
  articleToDelete.value = article
  showDeleteModal.value = true
}

const deleteArticle = async () => {
  if (!articleToDelete.value) return

  deletingId.value = articleToDelete.value.id

  try {
    const token = await getIdToken()

    await $fetch(`/api/articles/${articleToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    // Remove from list
    articles.value = articles.value.filter(a => a.id !== articleToDelete.value?.id)
    totalCount.value--

    showToast('success', 'ลบบทความเรียบร้อยแล้ว')
    showDeleteModal.value = false
  } catch (error: any) {
    console.error('Error deleting article:', error)
    showToast('error', error.data?.message || 'เกิดข้อผิดพลาดในการลบ')
  } finally {
    deletingId.value = null
    articleToDelete.value = null
  }
}

const showToast = (type: 'success' | 'error', message: string) => {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Watch for filter/page changes
watch([filter, currentPage], () => {
  loadArticles()
})

onMounted(() => {
  loadArticles()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
