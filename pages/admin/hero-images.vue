<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">จัดการ Hero Banner Images</h1>
        <p class="text-gray-600">อัปโหลดและจัดการรูปภาพ hero banner ที่แสดงในหน้าแรก</p>
      </div>

      <!-- Upload Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">อัปโหลดรูปภาพใหม่</h2>

        <div class="space-y-4">
          <!-- File Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เลือกรูปภาพ (JPEG, PNG, WebP)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              @change="handleFileSelect"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
            />
          </div>

          <!-- Preview -->
          <div v-if="previewUrl" class="relative w-full h-64 rounded-lg overflow-hidden">
            <img :src="previewUrl" alt="Preview" class="w-full h-full object-cover" />
          </div>

          <!-- Upload Button -->
          <button
            @click="uploadImage"
            :disabled="!selectedFile || uploading"
            class="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="uploading">กำลังอัปโหลด...</span>
            <span v-else>อัปโหลด</span>
          </button>

          <!-- Upload Status -->
          <div v-if="uploadStatus" class="mt-4">
            <div
              :class="[
                'p-4 rounded-lg',
                uploadStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              ]"
            >
              {{ uploadStatus.message }}
            </div>
          </div>
        </div>
      </div>

      <!-- Current Images -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">รูปภาพปัจจุบัน</h2>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <Icon name="lucide:loader-2" class="w-8 h-8 mx-auto mb-2 text-gray-400 animate-spin" />
          <p class="text-gray-500">กำลังโหลด...</p>
        </div>

        <!-- Images Grid -->
        <div v-else-if="heroImages.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="image in heroImages"
            :key="image.id"
            class="relative group rounded-lg overflow-hidden border border-gray-200"
          >
            <!-- Image -->
            <div class="aspect-video">
              <img :src="image.url" :alt="`Hero ${image.order}`" class="w-full h-full object-cover" />
            </div>

            <!-- Info -->
            <div class="p-4 bg-white">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">ลำดับ: {{ image.order + 1 }}</span>
                <span
                  :class="[
                    'px-2 py-1 text-xs rounded-full',
                    image.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ image.isActive ? 'ใช้งาน' : 'ปิดใช้งาน' }}
                </span>
              </div>
            </div>

            <!-- Delete Button (hide for default images) -->
            <button
              v-if="!image.id.startsWith('default-')"
              @click="deleteImage(image.id, image.filename)"
              class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              title="ลบรูปภาพ"
            >
              <Icon name="lucide:trash-2" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <Icon name="lucide:image-off" class="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p class="text-gray-500">ยังไม่มีรูปภาพ</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface HeroImage {
  id: string
  url: string
  filename: string
  order: number
  isActive: boolean
}

const { user } = useAuth()

const heroImages = ref<HeroImage[]>([])
const loading = ref(false)
const uploading = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const uploadStatus = ref<{ type: 'success' | 'error'; message: string } | null>(null)

// Load hero images
const loadHeroImages = async () => {
  loading.value = true
  try {
    const response = await $fetch<{ images: HeroImage[] }>('/api/hero-images')
    heroImages.value = response.images
  } catch (error) {
    console.error('Error loading hero images:', error)
  } finally {
    loading.value = false
  }
}

// Handle file selection
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    selectedFile.value = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Upload image
const uploadImage = async () => {
  if (!selectedFile.value || !user.value) return

  uploading.value = true
  uploadStatus.value = null

  try {
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) throw new Error('Not authenticated')

    const token = await firebaseUser.getIdToken()

    // Create form data
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    // Upload using fetch (not $fetch because we need FormData)
    const response = await fetch('/api/admin/hero-images', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.statusMessage || 'Upload failed')
    }

    uploadStatus.value = {
      type: 'success',
      message: 'อัปโหลดสำเร็จ!'
    }

    // Reset form
    selectedFile.value = null
    previewUrl.value = null

    // Reload images
    await loadHeroImages()
  } catch (error: any) {
    console.error('Error uploading image:', error)
    uploadStatus.value = {
      type: 'error',
      message: error.message || 'อัปโหลดไม่สำเร็จ'
    }
  } finally {
    uploading.value = false
  }
}

// Delete image
const deleteImage = async (imageId: string, filename: string) => {
  if (!user.value) return
  if (!confirm(`ต้องการลบรูปภาพ "${filename}" หรือไม่?`)) return

  try {
    const firebaseUser = user.value._firebaseUser
    if (!firebaseUser) throw new Error('Not authenticated')

    const token = await firebaseUser.getIdToken()

    await $fetch(`/api/admin/hero-images/${imageId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    // Reload images
    await loadHeroImages()
  } catch (error) {
    console.error('Error deleting image:', error)
    alert('ลบรูปภาพไม่สำเร็จ')
  }
}

// Load images on mount
onMounted(() => {
  loadHeroImages()
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
