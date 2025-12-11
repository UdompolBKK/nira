<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Media Library</h1>
      <p class="text-gray-600">จัดการไฟล์และรูปภาพในระบบ</p>
    </div>

    <!-- Toolbar -->
    <div class="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
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

          <!-- View Toggle -->
          <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'p-2 rounded transition-colors',
                viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <Icon name="lucide:grid-3x3" class="w-5 h-5" />
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'p-2 rounded transition-colors',
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <Icon name="lucide:list" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Search -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหาไฟล์..."
            class="w-full md:w-64 px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <Icon name="lucide:search" class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="mb-4 flex items-center gap-2 text-sm">
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

    <!-- Loading State -->
    <div v-if="loading" class="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
      <Icon name="lucide:loader-2" class="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
      <p class="text-gray-600">กำลังโหลด...</p>
    </div>

    <!-- Grid View -->
    <div
      v-else-if="viewMode === 'grid'"
      class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
    >
      <!-- Go Up -->
      <div
        v-if="currentFolder"
        @click="navigateToFolder(getParentFolder())"
        class="bg-white border border-gray-200 rounded-xl p-4 hover:border-pink-300 hover:shadow-md cursor-pointer transition-all aspect-square flex flex-col items-center justify-center"
      >
        <Icon name="lucide:arrow-left" class="w-12 h-12 text-gray-400 mb-2" />
        <span class="text-gray-600 text-sm">Go up</span>
      </div>

      <!-- Folders -->
      <div
        v-for="folder in filteredFolders"
        :key="folder.path"
        @click="navigateToFolder(folder.path)"
        class="bg-white border border-gray-200 rounded-xl p-4 hover:border-pink-300 hover:shadow-md cursor-pointer transition-all aspect-square flex flex-col items-center justify-center"
      >
        <Icon name="lucide:folder" class="w-16 h-16 text-pink-500 mb-2" />
        <span class="text-gray-900 text-sm text-center truncate w-full px-2 font-medium">{{ folder.name }}</span>
      </div>

      <!-- Files -->
      <div
        v-for="file in filteredFiles"
        :key="file.path"
        @click="selectFile(file)"
        class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-pink-300 hover:shadow-md cursor-pointer transition-all group relative"
      >
        <div class="aspect-square relative">
          <img
            v-if="file.contentType?.startsWith('image/')"
            :src="file.url"
            :alt="file.name"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
            <Icon name="lucide:file" class="w-12 h-12 text-gray-400" />
          </div>

          <!-- Actions Overlay -->
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              @click.stop="copyUrl(file.url)"
              class="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
              title="Copy URL"
            >
              <Icon name="lucide:copy" class="w-5 h-5 text-gray-700" />
            </button>
            <button
              @click.stop="confirmDeleteFile(file)"
              class="p-2 bg-red-500/90 hover:bg-red-500 rounded-lg transition-colors"
              title="Delete"
            >
              <Icon name="lucide:trash-2" class="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        <div class="p-2 bg-white">
          <p class="text-gray-900 text-xs truncate font-medium">{{ file.name }}</p>
          <p class="text-gray-500 text-xs">{{ formatFileSize(file.size) }}</p>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div
      v-else
      class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
    >
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell">Size</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <!-- Go Up -->
          <tr
            v-if="currentFolder"
            @click="navigateToFolder(getParentFolder())"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td colspan="4" class="px-6 py-4">
              <div class="flex items-center gap-3">
                <Icon name="lucide:arrow-left" class="w-6 h-6 text-gray-400" />
                <span class="text-gray-600">..</span>
              </div>
            </td>
          </tr>

          <!-- Folders -->
          <tr
            v-for="folder in filteredFolders"
            :key="folder.path"
            @click="navigateToFolder(folder.path)"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <Icon name="lucide:folder" class="w-6 h-6 text-pink-500" />
                <span class="text-gray-900 font-medium">{{ folder.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600 hidden md:table-cell">Folder</td>
            <td class="px-6 py-4 text-gray-600 hidden md:table-cell">-</td>
            <td class="px-6 py-4"></td>
          </tr>

          <!-- Files -->
          <tr
            v-for="file in filteredFiles"
            :key="file.path"
            @click="selectFile(file)"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <img
                  v-if="file.contentType?.startsWith('image/')"
                  :src="file.url"
                  :alt="file.name"
                  class="w-10 h-10 rounded object-cover border border-gray-200"
                  loading="lazy"
                />
                <Icon v-else name="lucide:file" class="w-10 h-10 text-gray-400" />
                <span class="text-gray-900 font-medium truncate max-w-xs">{{ file.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600 hidden md:table-cell">{{ file.contentType }}</td>
            <td class="px-6 py-4 text-gray-600 hidden md:table-cell">{{ formatFileSize(file.size) }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <button
                  @click.stop="copyUrl(file.url)"
                  class="text-pink-600 hover:text-pink-700 text-sm font-medium"
                >
                  Copy URL
                </button>
                <button
                  @click.stop="confirmDeleteFile(file)"
                  class="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && filteredFiles.length === 0 && filteredFolders.length === 0 && !currentFolder"
      class="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm"
    >
      <Icon name="lucide:image" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <p class="text-lg font-medium text-gray-900 mb-2">ยังไม่มีไฟล์</p>
      <p class="text-gray-600 mb-4">เริ่มอัปโหลดรูปภาพเพื่อใช้งาน</p>
      <button
        @click="triggerFileUpload"
        class="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
      >
        <Icon name="lucide:upload" class="w-5 h-5" />
        Upload ไฟล์แรก
      </button>
    </div>

    <!-- File Details Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedFile"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          @click="selectedFile = null"
        >
          <div
            @click.stop
            class="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900">รายละเอียดไฟล์</h3>
              <button
                @click="selectedFile = null"
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="lucide:x" class="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div class="space-y-4">
              <img
                v-if="selectedFile.contentType?.startsWith('image/')"
                :src="selectedFile.url"
                :alt="selectedFile.name"
                class="w-full rounded-xl border border-gray-200"
              />

              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 mb-1 font-medium">ชื่อไฟล์</label>
                  <p class="text-gray-900">{{ selectedFile.name }}</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1 font-medium">URL</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="text"
                      :value="selectedFile.url"
                      readonly
                      class="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm"
                    />
                    <button
                      @click="copyUrl(selectedFile.url)"
                      class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm text-gray-600 mb-1 font-medium">Type</label>
                    <p class="text-gray-900">{{ selectedFile.contentType }}</p>
                  </div>
                  <div>
                    <label class="block text-sm text-gray-600 mb-1 font-medium">Size</label>
                    <p class="text-gray-900">{{ formatFileSize(selectedFile.size) }}</p>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3 pt-4 border-t">
                <button
                  @click="selectedFile = null"
                  class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  ปิด
                </button>
                <button
                  @click="confirmDeleteFile(selectedFile); selectedFile = null"
                  class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                  ลบไฟล์
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Create Folder Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showCreateFolderModal"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="fileToDelete"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          @click="fileToDelete = null"
        >
          <div
            @click.stop
            class="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
          >
            <div class="text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="lucide:trash-2" class="w-8 h-8 text-red-500" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">ยืนยันการลบไฟล์</h3>
              <p class="text-gray-600 mb-6">
                คุณแน่ใจหรือไม่ว่าต้องการลบ<br />
                <strong>"{{ fileToDelete.name }}"</strong>?
              </p>
              <div class="flex items-center gap-3">
                <button
                  @click="fileToDelete = null"
                  class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  @click="deleteFile"
                  :disabled="deleting"
                  class="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Icon v-if="deleting" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
                  ลบไฟล์
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

interface MediaFile {
  name: string
  path: string
  url: string
  size: number
  contentType: string
  updated?: string
  folder?: string
}

interface MediaFolder {
  name: string
  path: string
  isFolder: boolean
}

const { getIdToken } = useAuth()

const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(true)
const uploading = ref(false)
const deleting = ref(false)
const creatingFolder = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const currentFolder = ref('')
const showCreateFolderModal = ref(false)
const newFolderName = ref('')

const files = ref<MediaFile[]>([])
const folders = ref<MediaFolder[]>([])
const selectedFile = ref<MediaFile | null>(null)
const fileToDelete = ref<MediaFile | null>(null)

const toast = ref({
  show: false,
  type: 'success' as 'success' | 'error',
  message: ''
})

const breadcrumbParts = computed(() => {
  if (!currentFolder.value) return []
  return currentFolder.value.split('/').filter(Boolean)
})

const filteredFiles = computed(() => {
  if (!searchQuery.value) return files.value
  return files.value.filter(f =>
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
    showToast('error', 'ไม่สามารถโหลดไฟล์ได้')
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

    await $fetch('/api/media/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    await loadMedia()
    showToast('success', `อัปโหลดสำเร็จ ${uploadFiles.length} ไฟล์`)
    target.value = ''
  } catch (error: any) {
    console.error('Upload failed:', error)
    showToast('error', error.data?.message || 'อัปโหลดไม่สำเร็จ')
  } finally {
    uploading.value = false
  }
}

const confirmDeleteFile = (file: MediaFile) => {
  fileToDelete.value = file
}

const deleteFile = async () => {
  if (!fileToDelete.value) return

  deleting.value = true

  try {
    const token = await getIdToken()
    await $fetch('/api/media/delete', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: { path: fileToDelete.value.path }
    })

    await loadMedia()
    showToast('success', 'ลบไฟล์เรียบร้อยแล้ว')
  } catch (error: any) {
    console.error('Delete failed:', error)
    showToast('error', error.data?.message || 'ลบไฟล์ไม่สำเร็จ')
  } finally {
    deleting.value = false
    fileToDelete.value = null
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
    showToast('success', 'สร้างโฟลเดอร์เรียบร้อยแล้ว')
    showCreateFolderModal.value = false
    newFolderName.value = ''
  } catch (error: any) {
    console.error('Create folder failed:', error)
    showToast('error', error.data?.message || 'สร้างโฟลเดอร์ไม่สำเร็จ')
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

const selectFile = (file: MediaFile) => {
  selectedFile.value = file
}

const copyUrl = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url)
    showToast('success', 'คัดลอก URL แล้ว')
  } catch {
    showToast('error', 'ไม่สามารถคัดลอกได้')
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const showToast = (type: 'success' | 'error', message: string) => {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

onMounted(() => {
  loadMedia()
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
