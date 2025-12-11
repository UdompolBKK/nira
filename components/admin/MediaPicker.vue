<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="close"
      >
        <div
          @click.stop
          class="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-xl flex flex-col"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b">
            <h3 class="text-xl font-bold text-gray-900">เลือกรูปภาพ</h3>
            <button
              @click="close"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="lucide:x" class="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <!-- Toolbar -->
          <div class="p-4 border-b bg-gray-50">
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <!-- Upload Button -->
                <button
                  @click="triggerFileUpload"
                  :disabled="uploading"
                  class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Icon v-if="uploading" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
                  <Icon v-else name="lucide:upload" class="w-5 h-5" />
                  <span>Upload</span>
                </button>
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  class="hidden"
                  @change="handleFileUpload"
                />

                <!-- Add Folder Button -->
                <button
                  @click="showCreateFolderModal = true"
                  class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Icon name="lucide:folder-plus" class="w-5 h-5" />
                  <span>Add Folder</span>
                </button>
              </div>

              <!-- Search -->
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="ค้นหาไฟล์..."
                  class="w-64 px-4 py-2 pl-10 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <Icon name="lucide:search" class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- Breadcrumb -->
          <div class="px-4 py-2 bg-gray-50 border-b flex items-center gap-2 text-sm">
            <button
              @click="navigateToFolder('')"
              class="text-pink-600 hover:text-pink-700 transition-colors font-medium"
            >
              Library
            </button>
            <template v-for="(part, index) in breadcrumbParts" :key="index">
              <Icon name="lucide:chevron-right" class="w-4 h-4 text-gray-400" />
              <button
                @click="navigateToFolder(breadcrumbParts.slice(0, index + 1).join('/'))"
                :class="[
                  'transition-colors font-medium',
                  index === breadcrumbParts.length - 1 ? 'text-gray-900' : 'text-pink-600 hover:text-pink-700'
                ]"
              >
                {{ part }}
              </button>
            </template>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-4">
            <!-- Loading -->
            <div v-if="loading" class="flex items-center justify-center py-12">
              <Icon name="lucide:loader-2" class="w-10 h-10 text-pink-500 animate-spin" />
            </div>

            <!-- Grid -->
            <div v-else class="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
              <!-- Go Up -->
              <div
                v-if="currentFolder"
                @click="navigateToFolder(getParentFolder())"
                class="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-pink-300 cursor-pointer transition-all aspect-square flex flex-col items-center justify-center"
              >
                <Icon name="lucide:arrow-left" class="w-10 h-10 text-gray-400 mb-2" />
                <span class="text-gray-600 text-xs">Go up</span>
              </div>

              <!-- Folders -->
              <div
                v-for="folder in filteredFolders"
                :key="folder.path"
                @click="navigateToFolder(folder.path)"
                class="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-pink-300 cursor-pointer transition-all aspect-square flex flex-col items-center justify-center"
              >
                <Icon name="lucide:folder" class="w-12 h-12 text-pink-500 mb-2" />
                <span class="text-gray-900 text-xs text-center truncate w-full">{{ folder.name }}</span>
              </div>

              <!-- Files -->
              <div
                v-for="file in filteredFiles"
                :key="file.path"
                @click="selectImage(file)"
                :class="[
                  'border rounded-xl overflow-hidden cursor-pointer transition-all aspect-square relative group',
                  selectedImage?.path === file.path
                    ? 'border-pink-500 ring-2 ring-pink-500'
                    : 'border-gray-200 hover:border-pink-300'
                ]"
              >
                <img
                  :src="file.url"
                  :alt="file.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />

                <!-- Selected overlay -->
                <div
                  v-if="selectedImage?.path === file.path"
                  class="absolute inset-0 bg-pink-500/20 flex items-center justify-center"
                >
                  <div class="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                    <Icon name="lucide:check" class="w-5 h-5 text-white" />
                  </div>
                </div>

                <!-- Filename tooltip -->
                <div class="absolute bottom-0 left-0 right-0 bg-black/60 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p class="text-white text-xs truncate">{{ file.name }}</p>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-if="!loading && filteredFiles.length === 0 && filteredFolders.length === 0"
              class="text-center py-12"
            >
              <Icon name="lucide:image" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p class="text-gray-600">ไม่พบรูปภาพ</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 border-t bg-gray-50 flex items-center justify-between">
            <div class="text-sm text-gray-600">
              <span v-if="selectedImage">
                เลือก: <strong>{{ selectedImage.name }}</strong>
              </span>
              <span v-else>ยังไม่ได้เลือกรูปภาพ</span>
            </div>
            <div class="flex items-center gap-3">
              <button
                @click="close"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                @click="confirm"
                :disabled="!selectedImage"
                class="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                เลือกรูปนี้
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Create Folder Modal -->
    <Transition name="modal">
      <div
        v-if="showCreateFolderModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
        @click="showCreateFolderModal = false"
      >
        <div
          @click.stop
          class="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
        >
          <h3 class="text-xl font-bold text-gray-900 mb-4">สร้างโฟลเดอร์ใหม่</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อโฟลเดอร์</label>
              <input
                v-model="newFolderName"
                type="text"
                placeholder="ชื่อโฟลเดอร์"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                @keydown.enter="createFolder"
              />
            </div>

            <div class="flex items-center gap-3">
              <button
                @click="showCreateFolderModal = false"
                class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                @click="createFolder"
                :disabled="!newFolderName.trim() || creatingFolder"
                class="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Icon v-if="creatingFolder" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                สร้าง
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

interface MediaFile {
  name: string
  path: string
  url: string
  size: number
  contentType: string
}

interface MediaFolder {
  name: string
  path: string
  isFolder: boolean
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'select', file: MediaFile): void
}>()

const { getIdToken } = useAuth()

const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const uploading = ref(false)
const searchQuery = ref('')
const currentFolder = ref('')

const files = ref<MediaFile[]>([])
const folders = ref<MediaFolder[]>([])
const selectedImage = ref<MediaFile | null>(null)

// Create folder modal
const showCreateFolderModal = ref(false)
const newFolderName = ref('')
const creatingFolder = ref(false)

const breadcrumbParts = computed(() => {
  if (!currentFolder.value) return []
  return currentFolder.value.split('/').filter(Boolean)
})

const filteredFiles = computed(() => {
  const imageFiles = files.value.filter(f => f.contentType?.startsWith('image/'))
  if (!searchQuery.value) return imageFiles
  return imageFiles.filter(f =>
    f.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredFolders = computed(() => {
  if (!searchQuery.value) return folders.value
  return folders.value.filter(f =>
    f.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const loadMedia = async () => {
  loading.value = true

  try {
    const token = await getIdToken()
    const response = await $fetch<{
      success: boolean
      data: { files: MediaFile[]; folders: MediaFolder[] }
    }>('/api/media', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      query: { folder: currentFolder.value }
    })

    files.value = response.data.files || []
    folders.value = response.data.folders || []
  } catch (error) {
    console.error('Failed to load media:', error)
  } finally {
    loading.value = false
  }
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const uploadFiles = target.files

  if (!uploadFiles || uploadFiles.length === 0) return

  uploading.value = true

  try {
    const token = await getIdToken()
    const formData = new FormData()
    formData.append('folder', currentFolder.value)

    for (let i = 0; i < uploadFiles.length; i++) {
      formData.append('files', uploadFiles[i])
    }

    const response = await $fetch<{
      success: boolean
      data: MediaFile[]
    }>('/api/media/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    await loadMedia()

    // Auto-select the first uploaded file
    if (response.data && response.data.length > 0) {
      const uploadedFile = files.value.find(f => f.path === response.data[0].path)
      if (uploadedFile) {
        selectedImage.value = uploadedFile
      }
    }

    target.value = ''
  } catch (error) {
    console.error('Upload failed:', error)
    alert('อัปโหลดไม่สำเร็จ')
  } finally {
    uploading.value = false
  }
}

const createFolder = async () => {
  if (!newFolderName.value.trim()) return

  creatingFolder.value = true

  try {
    const token = await getIdToken()
    await $fetch('/api/media/folder', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        name: newFolderName.value.trim(),
        parentFolder: currentFolder.value
      }
    })

    await loadMedia()
    showCreateFolderModal.value = false
    newFolderName.value = ''
  } catch (error: any) {
    console.error('Create folder failed:', error)
    alert(error.data?.message || 'สร้างโฟลเดอร์ไม่สำเร็จ')
  } finally {
    creatingFolder.value = false
  }
}

const navigateToFolder = (path: string) => {
  currentFolder.value = path
  loadMedia()
}

const getParentFolder = () => {
  const parts = currentFolder.value.split('/')
  parts.pop()
  return parts.join('/')
}

const selectImage = (file: MediaFile) => {
  selectedImage.value = file
}

const confirm = () => {
  if (selectedImage.value) {
    emit('select', selectedImage.value)
    close()
  }
}

const close = () => {
  emit('update:modelValue', false)
  selectedImage.value = null
}

// Load media when modal opens
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    loadMedia()
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
