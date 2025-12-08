<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <div class="max-w-5xl mx-auto px-4 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Icon name="lucide:ear" class="w-8 h-8 text-blue-600" />
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          ฝึกเป็นนักรับฟัง
        </h1>
        <p class="text-gray-600 text-lg">
          เรียนรู้ทักษะการรับฟังที่ดี เพื่อช่วยเหลือตัวเองและคนรอบข้าง
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-gray-700">ความคืบหน้า</span>
          <span class="text-sm font-semibold text-blue-600">{{ completedCount }}/{{ lessons.length }} บท</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div
            class="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <Icon name="lucide:loader-2" class="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <p class="text-gray-500">กำลังโหลดบทเรียน...</p>
      </div>

      <!-- Lessons List -->
      <div v-else class="space-y-6">
        <div
          v-for="lesson in sortedLessons"
          :key="lesson.id"
          class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <!-- Lesson Header -->
          <button
            @click="toggleLesson(lesson.id)"
            class="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-4 flex-1">
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white',
                  isLessonCompleted(lesson.id) ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'
                ]"
              >
                <Icon v-if="isLessonCompleted(lesson.id)" name="lucide:check" class="w-6 h-6" />
                <span v-else>{{ lesson.order }}</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-900 mb-1">
                  {{ lesson.title }}
                </h3>
                <p class="text-sm text-gray-600">{{ lesson.duration }} นาที</p>
              </div>
            </div>
            <Icon
              name="lucide:chevron-down"
              :class="[
                'w-6 h-6 text-gray-400 transition-transform',
                lesson.expanded ? 'rotate-180' : ''
              ]"
            />
          </button>

          <!-- Lesson Content -->
          <Transition name="slide">
            <div v-if="lesson.expanded" class="px-6 pb-6">
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <!-- Content -->
                <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
                  <p v-for="(paragraph, idx) in lesson.content" :key="idx">
                    {{ paragraph }}
                  </p>
                </div>

                <!-- Key Points -->
                <div v-if="lesson.keyPoints && lesson.keyPoints.length > 0" class="mt-6">
                  <h4 class="font-semibold text-gray-900 mb-3">จุดสำคัญ:</h4>
                  <ul class="space-y-2">
                    <li
                      v-for="(point, idx) in lesson.keyPoints"
                      :key="idx"
                      class="flex items-start gap-2"
                    >
                      <Icon name="lucide:check-circle" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span class="text-sm text-gray-700">{{ point }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Complete Button -->
                <div class="mt-6 flex justify-end">
                  <button
                    v-if="!isLessonCompleted(lesson.id)"
                    @click="completeLesson(lesson.id)"
                    class="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                  >
                    ทำเครื่องหมายว่าเสร็จแล้ว
                  </button>
                  <div v-else class="flex items-center gap-2 text-green-600 font-medium">
                    <Icon name="lucide:check-circle" class="w-5 h-5" />
                    <span>เสร็จสิ้นแล้ว</span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && lessons.length === 0" class="text-center py-16">
        <Icon name="lucide:book-open" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">ยังไม่มีบทเรียน</p>
      </div>

      <!-- Certificate -->
      <Transition name="fade">
        <div v-if="isAllCompleted" class="mt-12 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-8 border-2 border-yellow-200 text-center">
          <Icon name="lucide:award" class="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            ยินดีด้วย! คุณผ่านบทเรียนทั้งหมดแล้ว
          </h3>
          <p class="text-gray-600 mb-6">
            คุณได้เรียนรู้ทักษะการรับฟังที่ดีแล้ว พร้อมที่จะช่วยเหลือตัวเองและคนรอบข้าง
          </p>
          <button class="px-8 py-3 bg-yellow-500 text-white rounded-full font-medium hover:bg-yellow-600 transition-colors">
            ดาวน์โหลดใบประกาศ
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useFirestore } from '~/composables/useFirestore'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'ฝึกเป็นนักรับฟัง - Nira',
  meta: [
    {
      name: 'description',
      content: 'เรียนรู้ทักษะการรับฟังอย่างมีประสิทธิภาพเพื่อช่วยเหลือตัวเองและคนรอบข้าง'
    }
  ]
})

const { user } = useAuth()
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
  expanded?: boolean
}

const lessons = ref<Lesson[]>([])
const loading = ref(true)
const completedLessons = ref<string[]>([])

const sortedLessons = computed(() => {
  return [...lessons.value].sort((a, b) => a.order - b.order)
})

const completedCount = computed(() => {
  return completedLessons.value.length
})

const progressPercentage = computed(() => {
  if (lessons.value.length === 0) return 0
  return Math.round((completedCount.value / lessons.value.length) * 100)
})

const isAllCompleted = computed(() => {
  return lessons.value.length > 0 && completedCount.value === lessons.value.length
})

const isLessonCompleted = (lessonId: string) => {
  return completedLessons.value.includes(lessonId)
}

const toggleLesson = (lessonId: string) => {
  const lesson = lessons.value.find(l => l.id === lessonId)
  if (lesson) {
    lesson.expanded = !lesson.expanded
  }
}

const completeLesson = async (lessonId: string) => {
  if (!user.value || completedLessons.value.includes(lessonId)) return

  try {
    const userRef = doc(firestore, 'users', user.value.uid)

    await updateDoc(userRef, {
      completedLessons: arrayUnion(lessonId)
    })

    completedLessons.value.push(lessonId)
  } catch (error) {
    console.error('Error completing lesson:', error)
  }
}

// Load user's completed lessons
const loadUserProgress = async () => {
  if (!user.value) return

  try {
    const userRef = doc(firestore, 'users', user.value.uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()
      completedLessons.value = userData.completedLessons || []
    }
  } catch (error) {
    console.error('Error loading user progress:', error)
  }
}

// Real-time lessons fetching
onMounted(() => {
  const lessonsRef = collection(firestore, 'listenerLessons')
  const q = query(lessonsRef, orderBy('order', 'asc'))

  const unsubscribe = onSnapshot(q, (snapshot) => {
    lessons.value = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        expanded: false
      } as Lesson))
      .filter(lesson => lesson.isActive)

    loading.value = false
  })

  loadUserProgress()

  onBeforeUnmount(() => {
    unsubscribe()
  })
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
