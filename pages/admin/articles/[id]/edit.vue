<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <Icon name="lucide:loader-2" class="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
        <p class="text-gray-500">กำลังโหลดบทความ...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <Icon name="lucide:alert-circle" class="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h2>
        <p class="text-gray-500 mb-4">{{ loadError }}</p>
        <NuxtLink
          to="/admin/articles"
          class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          กลับหน้ารายการ
        </NuxtLink>
      </div>
    </div>

    <!-- Editor -->
    <template v-else>
      <!-- Header -->
      <div class="bg-white border-b sticky top-0 z-10">
        <div class="max-w-5xl mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <NuxtLink
                to="/admin/articles"
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="lucide:arrow-left" class="w-5 h-5 text-gray-600" />
              </NuxtLink>
              <div>
                <h1 class="text-xl font-bold text-gray-900">แก้ไขบทความ</h1>
                <p class="text-sm text-gray-500">แก้ไขเนื้อหาบทความ</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button
                @click="saveDraft"
                :disabled="saving"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Icon v-if="saving && !publishing" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                <Icon v-else name="lucide:save" class="w-4 h-4" />
                บันทึกแบบร่าง
              </button>
              <button
                @click="publishArticle"
                :disabled="saving || !canPublish"
                class="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Icon v-if="saving && publishing" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                <Icon v-else name="lucide:send" class="w-4 h-4" />
                {{ form.isPublished ? 'อัปเดต' : 'เผยแพร่' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-5xl mx-auto px-6 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Editor -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Title -->
            <div>
              <input
                v-model="form.title"
                type="text"
                placeholder="หัวข้อบทความ"
                class="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 bg-transparent border-0 focus:outline-none focus:ring-0"
              />
            </div>

            <!-- Content Editor -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">เนื้อหา</label>
              <ClientOnly>
                <AdminTiptapEditor
                  v-model="form.content"
                  placeholder="เริ่มเขียนเนื้อหาบทความ..."
                />
                <template #fallback>
                  <div class="border border-gray-200 rounded-xl bg-white p-6 min-h-[400px] flex items-center justify-center">
                    <Icon name="lucide:loader-2" class="w-8 h-8 text-gray-400 animate-spin" />
                  </div>
                </template>
              </ClientOnly>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Status Badge -->
            <div class="bg-white rounded-2xl border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">สถานะ</span>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    form.isPublished
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  ]"
                >
                  {{ form.isPublished ? 'เผยแพร่แล้ว' : 'แบบร่าง' }}
                </span>
              </div>
            </div>

            <!-- Cover Image -->
            <div class="bg-white rounded-2xl border border-gray-200 p-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">รูปภาพหน้าปก</label>

              <div
                v-if="!form.coverImage"
                @click="showMediaPicker = true"
                class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all border-gray-300 hover:border-pink-400 hover:bg-pink-50"
              >
                <Icon name="lucide:image-plus" class="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p class="text-sm text-gray-600">คลิกเพื่อเลือกรูปภาพ</p>
                <p class="text-xs text-gray-400 mt-1">จาก Media Library</p>
              </div>

              <div v-else class="relative">
                <img :src="form.coverImage" alt="Cover" class="w-full h-48 object-cover rounded-xl" />
                <div class="absolute top-2 right-2 flex gap-2">
                  <button
                    @click="showMediaPicker = true"
                    class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    title="เปลี่ยนรูป"
                  >
                    <Icon name="lucide:refresh-cw" class="w-4 h-4" />
                  </button>
                  <button
                    @click="removeCoverImage"
                    class="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="ลบรูป"
                  >
                    <Icon name="lucide:trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Slug -->
            <div class="bg-white rounded-2xl border border-gray-200 p-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500">/articles/</span>
                <input
                  v-model="form.slug"
                  type="text"
                  placeholder="article-slug"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
              </div>
            </div>

            <!-- Excerpt -->
            <div class="bg-white rounded-2xl border border-gray-200 p-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">คำอธิบายสั้น</label>
              <textarea
                v-model="form.excerpt"
                rows="4"
                placeholder="คำอธิบายสั้นๆ สำหรับแสดงในหน้ารายการ..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm resize-none"
              ></textarea>
              <p class="text-xs text-gray-400 mt-1">{{ form.excerpt.length }}/200 ตัวอักษร</p>
            </div>

            <!-- Tags -->
            <div class="bg-white rounded-2xl border border-gray-200 p-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">แท็ก</label>
              <div class="flex flex-wrap gap-2 mb-3">
                <span
                  v-for="(tag, index) in form.tags"
                  :key="index"
                  class="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                >
                  {{ tag }}
                  <button @click="removeTag(index)" class="hover:text-pink-900">
                    <Icon name="lucide:x" class="w-3 h-3" />
                  </button>
                </span>
              </div>
              <div class="flex items-center gap-2">
                <input
                  v-model="newTag"
                  type="text"
                  placeholder="เพิ่มแท็ก..."
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  @keydown.enter.prevent="addTag"
                />
                <button
                  @click="addTag"
                  :disabled="!newTag.trim()"
                  class="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors"
                >
                  <Icon name="lucide:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Success/Error Toast -->
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

    <!-- Media Picker Modal -->
    <AdminMediaPicker v-model="showMediaPicker" @select="handleMediaSelect" />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const route = useRoute()
const { getIdToken } = useAuth()

const articleId = computed(() => route.params.id as string)

const loading = ref(true)
const loadError = ref<string | null>(null)
const saving = ref(false)
const publishing = ref(false)
const showMediaPicker = ref(false)
const newTag = ref('')

const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  tags: [] as string[],
  isPublished: false
})

const toast = ref({
  show: false,
  type: 'success' as 'success' | 'error',
  message: ''
})

const canPublish = computed(() => {
  return form.value.title.trim() &&
         form.value.slug.trim() &&
         form.value.excerpt.trim() &&
         form.value.content.trim() &&
         form.value.content !== '<p></p>'
})

// Load article data
const loadArticle = async () => {
  loading.value = true
  loadError.value = null

  try {
    const response = await $fetch<{ success: boolean; article: any }>(`/api/articles/${articleId.value}`)

    if (response.success && response.article) {
      const article = response.article
      form.value = {
        title: article.title || '',
        slug: article.slug || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        coverImage: article.coverImage || '',
        tags: article.tags || [],
        isPublished: article.isPublished || false
      }
    }
  } catch (error: any) {
    console.error('Error loading article:', error)
    loadError.value = error.data?.message || 'ไม่สามารถโหลดบทความได้'
  } finally {
    loading.value = false
  }
}

// Media Picker handlers
const handleMediaSelect = (file: { url: string }) => {
  form.value.coverImage = file.url
}

const removeCoverImage = () => {
  form.value.coverImage = ''
}

// Tags
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
  }
  newTag.value = ''
}

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1)
}

// Save/Publish
const saveDraft = async () => {
  publishing.value = false
  await saveArticle(false)
}

const publishArticle = async () => {
  publishing.value = true
  await saveArticle(true)
}

const saveArticle = async (isPublished: boolean) => {
  if (!form.value.title.trim()) {
    showToast('error', 'กรุณาใส่หัวข้อบทความ')
    return
  }

  if (!form.value.slug.trim()) {
    showToast('error', 'กรุณาใส่ Slug (URL)')
    return
  }

  saving.value = true

  try {
    const token = await getIdToken()

    await $fetch(`/api/articles/${articleId.value}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        title: form.value.title,
        slug: form.value.slug,
        excerpt: form.value.excerpt,
        content: form.value.content,
        coverImage: form.value.coverImage || null,
        tags: form.value.tags,
        isPublished
      }
    })

    form.value.isPublished = isPublished
    showToast('success', isPublished ? 'อัปเดตและเผยแพร่เรียบร้อยแล้ว' : 'บันทึกแบบร่างเรียบร้อยแล้ว')
  } catch (error: any) {
    console.error('Error saving article:', error)
    showToast('error', error.data?.message || 'เกิดข้อผิดพลาดในการบันทึก')
  } finally {
    saving.value = false
  }
}

const showToast = (type: 'success' | 'error', message: string) => {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
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
