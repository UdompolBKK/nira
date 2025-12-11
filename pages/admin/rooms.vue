<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">จัดการห้อง</h1>
        <p class="text-gray-600">จัดการห้องสำหรับหมวดหมู่ปัญหา</p>
      </div>
      <button
        @click="openCreateModal"
        class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
      >
        <Icon name="lucide:plus" class="w-5 h-5" />
        <span>สร้างห้องใหม่</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-2" class="w-10 h-10 text-pink-500 animate-spin" />
    </div>

    <!-- Rooms Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="room in rooms"
        :key="room.id"
        class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
      >
        <!-- Room Image -->
        <div
          class="h-40 bg-gradient-to-br flex items-center justify-center"
          :style="{ background: room.image ? `url(${room.image}) center/cover` : `linear-gradient(135deg, ${room.color}40, ${room.color}80)` }"
        >
          <Icon
            v-if="!room.image"
            :name="room.icon || 'lucide:message-circle'"
            class="w-16 h-16"
            :style="{ color: room.color }"
          />
        </div>

        <!-- Room Info -->
        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ room.name }}</h3>
              <p class="text-sm text-gray-500">{{ room.postCount || 0 }} โพสต์</p>
            </div>
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                room.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              ]"
            >
              {{ room.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}
            </span>
          </div>
          <p class="text-gray-600 text-sm line-clamp-2 mb-4">
            {{ room.description || 'ไม่มีคำอธิบาย' }}
          </p>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              @click="editRoom(room)"
              class="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-1"
            >
              <Icon name="lucide:pencil" class="w-4 h-4" />
              แก้ไข
            </button>
            <button
              @click="confirmDelete(room)"
              class="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Icon name="lucide:trash-2" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="rooms.length === 0"
        class="col-span-full bg-white rounded-2xl border border-gray-200 p-12 text-center"
      >
        <Icon name="lucide:door-open" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p class="text-lg font-medium text-gray-900 mb-2">ยังไม่มีห้อง</p>
        <p class="text-gray-600 mb-4">สร้างห้องแรกเพื่อจัดหมวดหมู่ปัญหา</p>
        <button
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
        >
          <Icon name="lucide:plus" class="w-5 h-5" />
          สร้างห้องใหม่
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          @click="closeModal"
        >
          <div
            @click.stop
            class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <h3 class="text-xl font-bold text-gray-900 mb-6">
              {{ editingRoom ? 'แก้ไขห้อง' : 'สร้างห้องใหม่' }}
            </h3>

            <div class="space-y-4">
              <!-- Room Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อห้อง *</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="เช่น ความรัก, การงาน, ครอบครัว"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="อธิบายเกี่ยวกับห้องนี้..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                ></textarea>
              </div>

              <!-- Room Image -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">รูปภาพห้อง</label>
                <div
                  v-if="!form.image"
                  @click="showMediaPicker = true"
                  class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all"
                >
                  <Icon name="lucide:image-plus" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p class="text-sm text-gray-600">คลิกเพื่อเลือกรูปภาพ</p>
                </div>
                <div v-else class="relative">
                  <img :src="form.image" alt="Room" class="w-full h-32 object-cover rounded-xl" />
                  <button
                    @click="form.image = ''"
                    class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <Icon name="lucide:x" class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Color -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">สีประจำห้อง</label>
                <div class="flex items-center gap-3">
                  <input
                    v-model="form.color"
                    type="color"
                    class="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <input
                    v-model="form.color"
                    type="text"
                    placeholder="#6B7280"
                    class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <!-- Icon -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ไอคอน</label>
                <div class="grid grid-cols-6 gap-2">
                  <button
                    v-for="icon in availableIcons"
                    :key="icon"
                    @click="form.icon = icon"
                    :class="[
                      'p-3 rounded-lg border transition-all',
                      form.icon === icon
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <Icon :name="icon" class="w-5 h-5 mx-auto" :style="{ color: form.color }" />
                  </button>
                </div>
              </div>

              <!-- Order -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ลำดับการแสดง</label>
                <input
                  v-model.number="form.order"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <!-- Active Status -->
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">เปิดใช้งาน</span>
                <button
                  @click="form.isActive = !form.isActive"
                  :class="[
                    'relative w-12 h-6 rounded-full transition-colors',
                    form.isActive ? 'bg-pink-500' : 'bg-gray-300'
                  ]"
                >
                  <span
                    :class="[
                      'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                      form.isActive ? 'right-1' : 'left-1'
                    ]"
                  ></span>
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3 mt-6 pt-4 border-t">
              <button
                @click="closeModal"
                class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                @click="saveRoom"
                :disabled="saving || !form.name.trim()"
                class="flex-1 px-4 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Icon v-if="saving" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
                {{ editingRoom ? 'บันทึก' : 'สร้าง' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="roomToDelete"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          @click="roomToDelete = null"
        >
          <div
            @click.stop
            class="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
          >
            <div class="text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="lucide:trash-2" class="w-8 h-8 text-red-500" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">ยืนยันการลบห้อง</h3>
              <p class="text-gray-600 mb-6">
                คุณแน่ใจหรือไม่ว่าต้องการลบห้อง<br />
                <strong>"{{ roomToDelete.name }}"</strong>?
              </p>
              <div class="flex items-center gap-3">
                <button
                  @click="roomToDelete = null"
                  class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  @click="deleteRoom"
                  :disabled="deleting"
                  class="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Icon v-if="deleting" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
                  ลบห้อง
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Media Picker -->
    <AdminMediaPicker v-model="showMediaPicker" @select="handleMediaSelect" />

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

interface Room {
  id: string
  name: string
  slug: string
  description: string
  image: string | null
  color: string
  icon: string
  isActive: boolean
  order: number
  postCount: number
}

const { getIdToken } = useAuth()

const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const showModal = ref(false)
const showMediaPicker = ref(false)
const editingRoom = ref<Room | null>(null)
const roomToDelete = ref<Room | null>(null)
const rooms = ref<Room[]>([])

const form = ref({
  name: '',
  description: '',
  image: '',
  color: '#6B7280',
  icon: 'lucide:message-circle',
  isActive: true,
  order: 0
})

const toast = ref({
  show: false,
  type: 'success' as 'success' | 'error',
  message: ''
})

const availableIcons = [
  'lucide:heart',
  'lucide:briefcase',
  'lucide:home',
  'lucide:users',
  'lucide:graduation-cap',
  'lucide:wallet',
  'lucide:brain',
  'lucide:smile',
  'lucide:frown',
  'lucide:message-circle',
  'lucide:moon',
  'lucide:sun'
]

const loadRooms = async () => {
  loading.value = true

  try {
    const response = await $fetch<{ success: boolean; rooms: Room[] }>('/api/rooms', {
      query: { includeHidden: 'true' }
    })
    rooms.value = response.rooms
  } catch (error) {
    console.error('Failed to load rooms:', error)
    showToast('error', 'ไม่สามารถโหลดข้อมูลได้')
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingRoom.value = null
  form.value = {
    name: '',
    description: '',
    image: '',
    color: '#6B7280',
    icon: 'lucide:message-circle',
    isActive: true,
    order: rooms.value.length
  }
  showModal.value = true
}

const editRoom = (room: Room) => {
  editingRoom.value = room
  form.value = {
    name: room.name,
    description: room.description,
    image: room.image || '',
    color: room.color,
    icon: room.icon,
    isActive: room.isActive,
    order: room.order
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingRoom.value = null
}

const handleMediaSelect = (file: { url: string }) => {
  form.value.image = file.url
}

const saveRoom = async () => {
  if (!form.value.name.trim()) return

  saving.value = true

  try {
    const token = await getIdToken()

    if (editingRoom.value) {
      // Update existing room
      await $fetch(`/api/rooms/${editingRoom.value.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: form.value
      })
      showToast('success', 'อัปเดตห้องเรียบร้อยแล้ว')
    } else {
      // Create new room
      await $fetch('/api/rooms', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form.value
      })
      showToast('success', 'สร้างห้องเรียบร้อยแล้ว')
    }

    closeModal()
    await loadRooms()
  } catch (error: any) {
    console.error('Save room error:', error)
    showToast('error', error.data?.message || 'เกิดข้อผิดพลาด')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (room: Room) => {
  roomToDelete.value = room
}

const deleteRoom = async () => {
  if (!roomToDelete.value) return

  deleting.value = true

  try {
    const token = await getIdToken()
    await $fetch(`/api/rooms/${roomToDelete.value.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    showToast('success', 'ลบห้องเรียบร้อยแล้ว')
    roomToDelete.value = null
    await loadRooms()
  } catch (error: any) {
    console.error('Delete room error:', error)
    showToast('error', error.data?.message || 'เกิดข้อผิดพลาด')
  } finally {
    deleting.value = false
  }
}

const showToast = (type: 'success' | 'error', message: string) => {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

onMounted(() => {
  loadRooms()
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
