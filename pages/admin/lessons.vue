<template>
  <div class="p-8">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">จัดการบทเรียนนักรับฟัง</h1>
        <p class="text-gray-600 mt-2">เพิ่ม แก้ไข และจัดการบทเรียนทักษะการรับฟัง</p>
      </div>
      <button
        @click="openLessonModal()"
        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
      >
        <Icon name="lucide:plus" class="w-5 h-5 inline mr-2" />
        เพิ่มบทเรียนใหม่
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:book-open" class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">บทเรียนทั้งหมด</p>
            <p class="text-2xl font-bold text-gray-900">{{ lessons.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:check-circle" class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">บทเรียนที่เปิดใช้งาน</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeLessonsCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:users" class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">ผู้เรียนทั้งหมด</p>
            <p class="text-2xl font-bold text-gray-900">-</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Lessons List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">รายการบทเรียน</h2>
      </div>

      <div v-if="loading" class="p-12 text-center">
        <Icon name="lucide:loader-2" class="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
        <p class="text-gray-500">กำลังโหลด...</p>
      </div>

      <div v-else-if="lessons.length === 0" class="p-12 text-center">
        <Icon name="lucide:book-open" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 mb-4">ยังไม่มีบทเรียน</p>
        <div class="flex gap-3 justify-center">
          <button
            @click="loadSampleLessons"
            :disabled="isLoadingSamples"
            class="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Icon v-if="isLoadingSamples" name="lucide:loader-2" class="w-4 h-4 inline mr-2 animate-spin" />
            <Icon v-else name="lucide:database" class="w-4 h-4 inline mr-2" />
            โหลดข้อมูลเริ่มต้น (5 บทเรียน)
          </button>
          <button
            @click="openLessonModal()"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            เพิ่มบทเรียนเอง
          </button>
        </div>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="lesson in sortedLessons"
          :key="lesson.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-4 flex-1">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {{ lesson.order }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ lesson.title }}</h3>
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      lesson.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    ]"
                  >
                    {{ lesson.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-3">ระยะเวลา: {{ lesson.duration }} นาที</p>
                <div class="space-y-2">
                  <p class="text-sm text-gray-700">
                    <span class="font-medium">เนื้อหา:</span> {{ lesson.content.length }} ย่อหน้า
                  </p>
                  <p class="text-sm text-gray-700">
                    <span class="font-medium">จุดสำคัญ:</span> {{ lesson.keyPoints?.length || 0 }} ข้อ
                  </p>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="openLessonModal(lesson)"
                class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="แก้ไข"
              >
                <Icon name="lucide:edit" class="w-5 h-5" />
              </button>
              <button
                @click="toggleLessonStatus(lesson.id, lesson.isActive)"
                class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                :title="lesson.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'"
              >
                <Icon :name="lesson.isActive ? 'lucide:eye-off' : 'lucide:eye'" class="w-5 h-5" />
              </button>
              <button
                @click="deleteLesson(lesson.id)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="ลบ"
              >
                <Icon name="lucide:trash-2" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lesson Modal -->
    <Transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900">
              {{ editingLesson ? 'แก้ไขบทเรียน' : 'เพิ่มบทเรียนใหม่' }}
            </h2>
          </div>

          <div class="p-6 space-y-6">
            <!-- Order -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ลำดับที่</label>
              <input
                v-model.number="form.order"
                type="number"
                min="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1, 2, 3..."
              />
            </div>

            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อบทเรียน *</label>
              <input
                v-model="form.title"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="เช่น หลักการพื้นฐานของการรับฟัง"
              />
            </div>

            <!-- Duration -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ระยะเวลา (นาที) *</label>
              <input
                v-model.number="form.duration"
                type="number"
                min="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
              />
            </div>

            <!-- Content -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">เนื้อหา (แต่ละบรรทัดจะเป็นย่อหน้า) *</label>
              <textarea
                v-model="contentText"
                rows="8"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="เขียนเนื้อหาบทเรียน แต่ละย่อหน้าขึ้นบรรทัดใหม่..."
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">แต่ละบรรทัดจะแสดงเป็นย่อหน้าแยกกัน</p>
            </div>

            <!-- Key Points -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">จุดสำคัญ (แต่ละบรรทัด 1 ข้อ)</label>
              <textarea
                v-model="keyPointsText"
                rows="5"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="- ตั้งใจฟังด้วยความสนใจ&#10;- ไม่ขัดจังหวะ&#10;- แสดงความเข้าใจ"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">แต่ละบรรทัดจะเป็นจุดสำคัญหนึ่งข้อ</p>
            </div>

            <!-- Is Active -->
            <div class="flex items-center gap-3">
              <input
                v-model="form.isActive"
                type="checkbox"
                id="isActive"
                class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label for="isActive" class="text-sm font-medium text-gray-700">
                เปิดใช้งานบทเรียนนี้
              </label>
            </div>
          </div>

          <div class="p-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              @click="closeModal"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              @click="saveLesson"
              :disabled="!canSave"
              class="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ editingLesson ? 'บันทึกการแก้ไข' : 'เพิ่มบทเรียน' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useFirestore } from '~/composables/useFirestore'
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

useHead({
  title: 'จัดการบทเรียน - Admin'
})

const { firestore } = useFirestore()

interface Lesson {
  id: string
  order: number
  title: string
  duration: number
  content: string[]
  keyPoints: string[]
  isActive: boolean
  createdAt: any
  updatedAt: any
}

const lessons = ref<Lesson[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingLesson = ref<Lesson | null>(null)
const isLoadingSamples = ref(false)

const form = ref({
  order: 1,
  title: '',
  duration: 10,
  isActive: true
})

const contentText = ref('')
const keyPointsText = ref('')

const sortedLessons = computed(() => {
  return [...lessons.value].sort((a, b) => a.order - b.order)
})

const activeLessonsCount = computed(() => {
  return lessons.value.filter(l => l.isActive).length
})

const canSave = computed(() => {
  return form.value.title.trim() && form.value.duration > 0 && contentText.value.trim()
})

const openLessonModal = (lesson?: Lesson) => {
  if (lesson) {
    editingLesson.value = lesson
    form.value = {
      order: lesson.order,
      title: lesson.title,
      duration: lesson.duration,
      isActive: lesson.isActive
    }
    contentText.value = lesson.content.join('\n\n')
    keyPointsText.value = lesson.keyPoints.join('\n')
  } else {
    editingLesson.value = null
    form.value = {
      order: lessons.value.length + 1,
      title: '',
      duration: 10,
      isActive: true
    }
    contentText.value = ''
    keyPointsText.value = ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingLesson.value = null
}

const saveLesson = async () => {
  if (!canSave.value) return

  try {
    const content = contentText.value.split('\n').filter(line => line.trim()).map(line => line.trim())
    const keyPoints = keyPointsText.value.split('\n').filter(line => line.trim()).map(line => line.trim())

    const lessonData = {
      order: form.value.order,
      title: form.value.title.trim(),
      duration: form.value.duration,
      content,
      keyPoints,
      isActive: form.value.isActive,
      updatedAt: serverTimestamp()
    }

    if (editingLesson.value) {
      const lessonRef = doc(firestore, 'listenerLessons', editingLesson.value.id)
      await updateDoc(lessonRef, lessonData)
    } else {
      await addDoc(collection(firestore, 'listenerLessons'), {
        ...lessonData,
        createdAt: serverTimestamp()
      })
    }

    closeModal()
  } catch (error) {
    console.error('Error saving lesson:', error)
    alert('เกิดข้อผิดพลาดในการบันทึก')
  }
}

const toggleLessonStatus = async (lessonId: string, currentStatus: boolean) => {
  try {
    const lessonRef = doc(firestore, 'listenerLessons', lessonId)
    await updateDoc(lessonRef, {
      isActive: !currentStatus,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error toggling lesson status:', error)
  }
}

const deleteLesson = async (lessonId: string) => {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบบทเรียนนี้?')) return

  try {
    await deleteDoc(doc(firestore, 'listenerLessons', lessonId))
  } catch (error) {
    console.error('Error deleting lesson:', error)
    alert('เกิดข้อผิดพลาดในการลบ')
  }
}

const loadSampleLessons = async () => {
  if (!confirm('คุณต้องการโหลดข้อมูลบทเรียนตัวอย่าง 5 บทเรียนใช่หรือไม่?')) return

  isLoadingSamples.value = true

  const sampleLessons = [
    {
      order: 1,
      title: 'การรับฟังอย่างตั้งใจ (Active Listening)',
      duration: 10,
      isActive: true,
      content: [
        'การรับฟังอย่างตั้งใจ คือการให้ความสนใจกับสิ่งที่อีกฝ่ายกำลังพูดอย่างเต็มที่ ไม่ใช่แค่การได้ยินเสียง แต่เป็นการเข้าใจความหมาย อารมณ์ และความรู้สึกที่แฝงอยู่ในคำพูด',
        'การรับฟังที่ดีต้องใช้ทั้งหู ตา และใจ คุณต้องมองที่สายตาของผู้พูด สังเกตภาษากาย และตั้งใจฟังทุกคำพูดโดยไม่ตัดสิน',
        'เมื่อเราตั้งใจฟังจริงๆ อีกฝ่ายจะรู้สึกได้ว่าเราให้ความสำคัญ และนั่นทำให้พวกเขารู้สึกปลอดภัยที่จะเปิดใจมากขึ้น'
      ],
      keyPoints: [
        'มองตาผู้พูด แสดงให้เห็นว่าคุณให้ความสำคัญ',
        'อย่าขัดจังหวะหรือรีบตัดสิน',
        'สังเกตภาษากายและน้ำเสียง',
        'ถามคำถามเพื่อทำความเข้าใจให้ชัดเจน',
        'สรุปสิ่งที่ได้ยินเพื่อยืนยันความเข้าใจ'
      ]
    },
    {
      order: 2,
      title: 'การแสดงความเห็นอกเห็นใจ (Empathy)',
      duration: 12,
      isActive: true,
      content: [
        'ความเห็นอกเห็นใจ คือการสามารถเข้าใจและรู้สึกตามความรู้สึกของอีกฝ่าย ไม่ใช่แค่การรู้ว่าเขารู้สึกอย่างไร แต่คือการสัมผัสถึงความรู้สึกนั้นด้วยตัวเอง',
        'การแสดง empathy ไม่ได้หมายความว่าคุณต้องเห็นด้วยกับทุกสิ่ง แต่หมายความว่าคุณเข้าใจว่าทำไมเขาถึงรู้สึกแบบนั้น',
        'เมื่อผู้อื่นแชร์ปัญหา อย่ารีบให้คำแนะนำ บางครั้งพวกเขาแค่ต้องการคนรับฟังและเข้าใจความรู้สึก'
      ],
      keyPoints: [
        'ลองนึกตัวเองเป็นอีกฝ่าย',
        'พูดว่า "ฉันเข้าใจว่ามันยากนะ" แทนที่จะพูดว่า "ไม่เป็นไรหรอก"',
        'ยอมรับความรู้สึกของเขาว่าเป็นเรื่องจริงและสำคัญ',
        'อย่าเปรียบเทียบกับประสบการณ์ของตัวเอง',
        'ใช้คำพูดที่อ่อนโยนและให้กำลังใจ'
      ]
    },
    {
      order: 3,
      title: 'การถามคำถามที่เปิดกว้าง',
      duration: 8,
      isActive: true,
      content: [
        'คำถามที่เปิดกว้าง คือคำถามที่ไม่สามารถตอบด้วย "ใช่" หรือ "ไม่ใช่" แต่ต้องอธิบาย ทำให้อีกฝ่ายได้คิดและแสดงความรู้สึกออกมามากขึ้น',
        'แทนที่จะถามว่า "เธอโอเคไหม?" ลองถามว่า "เธอรู้สึกยังไงบ้าง?" จะทำให้ได้คำตอบที่มีรายละเอียดมากกว่า',
        'คำถามที่ดีช่วยให้อีกฝ่ายสำรวจความรู้สึกของตัวเอง และบางครั้งก็ช่วยให้พวกเขาเข้าใจตัวเองมากขึ้น'
      ],
      keyPoints: [
        'เริ่มคำถามด้วย "อะไร" "อย่างไร" "ทำไม"',
        'หลีกเลี่ยงคำถามที่นำไปสู่คำตอบ "ใช่/ไม่ใช่"',
        'ถามทีละคำถาม อย่าถามซ้อนกัน',
        'ให้เวลาอีกฝ่ายคิดก่อนตอบ',
        'แสดงความสนใจในคำตอบที่ได้รับ'
      ]
    },
    {
      order: 4,
      title: 'การไม่ตัดสินและการยอมรับ',
      duration: 15,
      isActive: true,
      content: [
        'การไม่ตัดสิน หมายถึงการรับฟังโดยไม่ประเมินหรือวิพากษ์วิจารณ์ความรู้สึกหรือประสบการณ์ของอีกฝ่าย แม้ว่าคุณจะไม่เห็นด้วยก็ตาม',
        'เมื่อผู้คนรู้สึกว่าถูกตัดสิน พวกเขาจะปิดใจและไม่กล้าแชร์อะไรต่อ การสร้างพื้นที่ปลอดภัยเริ่มจากการไม่ตัดสิน',
        'การยอมรับ ไม่ได้หมายความว่าคุณเห็นด้วย แต่หมายความว่าคุณเคารพในความแตกต่างและยอมรับว่าทุกคนมีสิทธิ์รู้สึกในแบบของตัวเอง'
      ],
      keyPoints: [
        'หลีกเลี่ยงการพูดว่า "เธอไม่ควรรู้สึกแบบนั้น"',
        'อย่ารีบให้คำวิจารณ์หรือคำแนะนำทันที',
        'ยอมรับว่าทุกความรู้สึกมีเหตุผล',
        'ใช้ภาษาที่เป็นกลางและไม่มีอคติ',
        'แสดงให้เห็นว่าคุณเคารพในมุมมองของเขา'
      ]
    },
    {
      order: 5,
      title: 'การรู้จักขอบเขตของตัวเอง',
      duration: 10,
      isActive: true,
      content: [
        'การเป็นนักรับฟังที่ดี ไม่ได้หมายความว่าคุณต้องรับปัญหาของคนอื่นมาเป็นของตัวเองทั้งหมด การรู้จักขอบเขตเป็นสิ่งสำคัญ',
        'คุณไม่จำเป็นต้องแก้ปัญหาให้ทุกคน บางครั้งการรับฟังและอยู่เคียงข้างก็เพียงพอแล้ว อย่าให้ภาระหนักจนเกินไปจนทำร้ายสุขภาพจิตของตัวเอง',
        'เมื่อรู้สึกว่าเหนื่อยหรือไม่สามารถรับฟังได้อีก ให้กล้าบอกและขอเวลาพัก นั่นไม่ได้หมายความว่าคุณเป็นนักรับฟังที่ไม่ดี แต่หมายความว่าคุณรู้จักดูแลตัวเอง'
      ],
      keyPoints: [
        'รู้จักว่าเมื่อไหร่ควรพัก',
        'อย่าคิดว่าต้องแก้ปัญหาให้ทุกคน',
        'แนะนำให้ปรึกษาผู้เชี่ยวชาญเมื่อจำเป็น',
        'ดูแลสุขภาพจิตของตัวเองก่อน',
        'บอกอีกฝ่ายอย่างตรงไปตรงมาถ้าไม่พร้อม'
      ]
    }
  ]

  try {
    for (const lesson of sampleLessons) {
      await addDoc(collection(firestore, 'listenerLessons'), {
        ...lesson,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    }
    alert('โหลดข้อมูลบทเรียนตัวอย่างเรียบร้อยแล้ว!')
  } catch (error) {
    console.error('Error loading sample lessons:', error)
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง')
  } finally {
    isLoadingSamples.value = false
  }
}

// Real-time lessons fetching
onMounted(() => {
  const lessonsRef = collection(firestore, 'listenerLessons')
  const q = query(lessonsRef, orderBy('order', 'asc'))

  const unsubscribe = onSnapshot(q, (snapshot) => {
    lessons.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Lesson))

    loading.value = false
  })

  onBeforeUnmount(() => {
    unsubscribe()
  })
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
