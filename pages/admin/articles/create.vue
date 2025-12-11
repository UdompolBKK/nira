<template>
  <div class="min-h-screen bg-gray-50">
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
              <h1 class="text-xl font-bold text-gray-900">สร้างบทความใหม่</h1>
              <p class="text-sm text-gray-500">เขียนบทความสำหรับผู้ใช้</p>
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
              เผยแพร่
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
              @input="generateSlug"
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
            <p v-if="slugError" class="text-xs text-red-500 mt-1">{{ slugError }}</p>
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

          <!-- SEO Preview -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6">
            <label class="block text-sm font-medium text-gray-700 mb-3">ตัวอย่าง SEO</label>
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p class="text-blue-600 text-lg font-medium truncate">
                {{ form.title || 'หัวข้อบทความ' }}
              </p>
              <p class="text-green-700 text-sm">
                บันทึกนิรนาม.com/articles/{{ form.slug || 'article-slug' }}
              </p>
              <p class="text-gray-600 text-sm line-clamp-2 mt-1">
                {{ form.excerpt || 'คำอธิบายบทความจะแสดงที่นี่...' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Media Picker Modal -->
    <AdminMediaPicker
      v-model="showMediaPicker"
      @select="handleMediaSelect"
    />

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
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { getIdToken } = useAuth()
const router = useRouter()

const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  tags: [] as string[]
})

const saving = ref(false)
const publishing = ref(false)
const showMediaPicker = ref(false)
const newTag = ref('')
const slugError = ref('')

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

// Auto-generate slug from title
const generateSlug = () => {
  if (!form.value.title) {
    form.value.slug = ''
    return
  }

  // Convert Thai to transliteration or just use simple slug
  form.value.slug = form.value.title
    .toLowerCase()
    .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, '') // Keep Thai, English, numbers
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100)
}

// Cover image from MediaPicker
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

    const response = await $fetch('/api/articles', {
      method: 'POST',
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

    showToast('success', isPublished ? 'เผยแพร่บทความเรียบร้อยแล้ว' : 'บันทึกแบบร่างเรียบร้อยแล้ว')

    // Redirect to articles list
    setTimeout(() => {
      router.push('/admin/articles')
    }, 1500)
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
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
