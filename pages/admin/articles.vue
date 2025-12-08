<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">จัดการบทความ</h1>
          <p class="text-gray-600 mt-1">สร้างและแก้ไขบทความสำหรับผู้ใช้</p>
        </div>
        <button
          @click="openCreateModal"
          class="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Icon name="lucide:plus" class="w-5 h-5" />
          สร้างบทความใหม่
        </button>
      </div>

      <!-- Articles List -->
      <div v-if="loading" class="text-center py-12">
        <Icon name="lucide:loader-2" class="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
        <p class="text-gray-500">กำลังโหลด...</p>
      </div>

      <div v-else-if="articles.length === 0" class="text-center py-12 bg-white rounded-2xl shadow">
        <Icon name="lucide:file-text" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">ยังไม่มีบทความ</p>
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
              </div>

              <div class="flex items-center gap-2">
                <button
                  @click="editArticle(article)"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
                >
                  <Icon name="lucide:edit-3" class="w-4 h-4" />
                  แก้ไข
                </button>
                <button
                  @click="togglePublish(article)"
                  class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm"
                >
                  <Icon :name="article.isPublished ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4" />
                  {{ article.isPublished ? 'ซ่อน' : 'เผยแพร่' }}
                </button>
                <button
                  @click="confirmDelete(article.id)"
                  class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm"
                >
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                  ลบ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit/Create Modal -->
      <Teleport to="body">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          @click.self="closeModal"
        >
          <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900">
                {{ editingArticle ? 'แก้ไขบทความ' : 'สร้างบทความใหม่' }}
              </h2>
              <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Icon name="lucide:x" class="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form @submit.prevent="saveArticle" class="space-y-6">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">หัวข้อ</label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="หัวข้อบทความ"
                />
              </div>

              <!-- Slug -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                <input
                  v-model="form.slug"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="article-slug"
                />
                <p class="text-xs text-gray-500 mt-1">ใช้สำหรับ URL: /articles/{{ form.slug }}</p>
              </div>

              <!-- Excerpt -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">คำอธิบายสั้น</label>
                <textarea
                  v-model="form.excerpt"
                  rows="3"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                  placeholder="คำอธิบายสั้นๆ สำหรับแสดงในหน้ารายการ"
                ></textarea>
              </div>

              <!-- Cover Image URL -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">URL รูปภาพหน้าปก</label>
                <input
                  v-model="form.coverImage"
                  type="url"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <!-- Content (Rich Text) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">เนื้อหา (HTML)</label>
                <textarea
                  v-model="form.content"
                  rows="15"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none font-mono text-sm"
                  placeholder="<h2>หัวข้อ</h2><p>เนื้อหา...</p>"
                ></textarea>
                <p class="text-xs text-gray-500 mt-1">
                  รองรับ HTML tags: h1, h2, h3, p, strong, em, ul, ol, li, blockquote, img
                </p>
              </div>

              <!-- Published Checkbox -->
              <div class="flex items-center gap-2">
                <input
                  v-model="form.isPublished"
                  type="checkbox"
                  id="isPublished"
                  class="w-5 h-5 text-pink-600 rounded focus:ring-2 focus:ring-pink-500"
                />
                <label for="isPublished" class="text-sm font-medium text-gray-700">เผยแพร่บทความนี้</label>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  :disabled="saving"
                  class="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="saving" class="flex items-center justify-center gap-2">
                    <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
                    กำลังบันทึก...
                  </span>
                  <span v-else>บันทึก</span>
                </button>
                <button
                  type="button"
                  @click="closeModal"
                  class="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFirestore } from '~/composables/useFirestore'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, serverTimestamp, type Timestamp } from 'firebase/firestore'

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
  publishedAt?: Timestamp | Date
  createdAt: Timestamp | Date
  views?: number
  isPublished: boolean
}

const { firestore } = useFirestore()
const articles = ref<Article[]>([])
const loading = ref(true)
const showModal = ref(false)
const saving = ref(false)
const editingArticle = ref<Article | null>(null)

const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  isPublished: false
})

const formatDate = (timestamp: any) => {
  if (!timestamp) return 'ไม่ระบุ'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadArticles = async () => {
  if (!firestore) return

  loading.value = true
  try {
    const articlesRef = collection(firestore, 'articles')
    const q = query(articlesRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    articles.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Article[]
  } catch (error) {
    console.error('Error loading articles:', error)
    alert('เกิดข้อผิดพลาดในการโหลดบทความ')
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingArticle.value = null
  form.value = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    isPublished: false
  }
  showModal.value = true
}

const editArticle = (article: Article) => {
  editingArticle.value = article
  form.value = {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    coverImage: article.coverImage || '',
    isPublished: article.isPublished
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingArticle.value = null
}

const saveArticle = async () => {
  if (!firestore) return

  saving.value = true
  try {
    const articleData = {
      title: form.value.title,
      slug: form.value.slug,
      excerpt: form.value.excerpt,
      content: form.value.content,
      coverImage: form.value.coverImage || null,
      isPublished: form.value.isPublished,
      ...(form.value.isPublished && !editingArticle.value ? { publishedAt: serverTimestamp() } : {})
    }

    if (editingArticle.value) {
      // Update existing
      const articleRef = doc(firestore, 'articles', editingArticle.value.id)
      await updateDoc(articleRef, {
        ...articleData,
        updatedAt: serverTimestamp()
      })
    } else {
      // Create new
      await addDoc(collection(firestore, 'articles'), {
        ...articleData,
        createdAt: serverTimestamp(),
        views: 0
      })
    }

    await loadArticles()
    closeModal()
  } catch (error) {
    console.error('Error saving article:', error)
    alert('เกิดข้อผิดพลาดในการบันทึก')
  } finally {
    saving.value = false
  }
}

const togglePublish = async (article: Article) => {
  if (!firestore) return

  try {
    const articleRef = doc(firestore, 'articles', article.id)
    await updateDoc(articleRef, {
      isPublished: !article.isPublished,
      ...((!article.isPublished) ? { publishedAt: serverTimestamp() } : {})
    })

    await loadArticles()
  } catch (error) {
    console.error('Error toggling publish:', error)
    alert('เกิดข้อผิดพลาด')
  }
}

const confirmDelete = async (id: string) => {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้?')) return

  if (!firestore) return

  try {
    await deleteDoc(doc(firestore, 'articles', id))
    await loadArticles()
  } catch (error) {
    console.error('Error deleting article:', error)
    alert('เกิดข้อผิดพลาดในการลบ')
  }
}

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
</style>
