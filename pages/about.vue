<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-24">
      <Icon name="lucide:loader-2" class="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
      <p class="text-gray-500">กำลังโหลด...</p>
    </div>

    <!-- About Content -->
    <div v-else>
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-16">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 animate-pulse">
            <Icon name="lucide:heart" class="w-10 h-10" />
          </div>
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            {{ aboutContent?.title || 'เกี่ยวกับเรา' }}
          </h1>
          <p class="text-xl text-white/90 max-w-2xl mx-auto">
            {{ aboutContent?.subtitle || 'พื้นที่ปลอดภัยสำหรับการดูแลสุขภาพจิต' }}
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-4xl mx-auto px-4 -mt-8 pb-12">
        <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <!-- Cover Image -->
          <div v-if="aboutContent?.coverImage" class="mb-8 -mx-8 -mt-8 md:-mx-12 md:-mt-12 mb-8">
            <img
              :src="aboutContent.coverImage"
              alt="About Cover"
              class="w-full h-64 object-cover rounded-t-3xl"
            />
          </div>

          <!-- Rich Content -->
          <div
            v-if="aboutContent?.content"
            class="prose prose-lg max-w-none
                   prose-headings:font-bold prose-headings:text-gray-900
                   prose-p:text-gray-700 prose-p:leading-relaxed
                   prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline
                   prose-strong:text-gray-900 prose-strong:font-bold
                   prose-ul:list-disc prose-ol:list-decimal
                   prose-img:rounded-2xl prose-img:shadow-lg"
            v-html="aboutContent.content"
          ></div>

          <!-- Default Content if no data -->
          <div v-else class="space-y-8">
            <div>
              <h2 class="mb-3 text-2xl font-bold text-gray-900">ภารกิจของเรา</h2>
              <p class="text-gray-700">
                บันทึกนิรนาม สร้างขึ้นเพื่อให้คนทั่วโลกมีพื้นที่ปลอดภัยในการแสดงออก
                โดยไม่ต้องกังวลเกี่ยวกับความเป็นตัวตนหรือการตัดสินของคนอื่น
              </p>
            </div>

            <div>
              <h2 class="mb-3 text-2xl font-bold text-gray-900">วิสัยทัศน์</h2>
              <p class="text-gray-700">
                ชุมชนที่เปิดใจและรองรับซึ่งผู้คนสามารถแบ่งปันประสบการณ์ของตนเองได้อย่างปลอดภัย
                และเรียนรู้จากการเล่าเรื่องของคนอื่น
              </p>
            </div>

            <div>
              <h2 class="mb-3 text-2xl font-bold text-gray-900">ค่านิยม</h2>
              <ul class="space-y-2 text-gray-700">
                <li>🔒 ความเป็นส่วนตัว - ข้อมูลของคุณเป็นสิ่งที่ศักดิ์สิทธิ์</li>
                <li>🤝 เอกภาพ - ทุกคนมีคณค่า ไม่ว่าพื้นหลังของพวกเขาจะเป็นอย่างไร</li>
                <li>🌱 การเติบโต - เรารองรับการเรียนรู้และการพัฒนาตัวเอง</li>
                <li>💪 การเสริมสร้างอำนาจ - การให้ผู้คนควบคุมเรื่องราวของตนเอง</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFirestore } from '~/composables/useFirestore'
import { collection, query, where, limit, getDocs, type Timestamp } from 'firebase/firestore'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'เกี่ยวกับเรา - Nira',
  meta: [
    {
      name: 'description',
      content: 'เรียนรู้เพิ่มเติมเกี่ยวกับ Nira - แพลตฟอร์มดูแลสุขภาพจิตและบันทึกความรู้สึกนิรนาม'
    }
  ]
})

interface AboutContent {
  id: string
  title: string
  subtitle: string
  content: string
  coverImage?: string
  updatedAt: Timestamp | Date
  isPublished: boolean
}

const { firestore } = useFirestore()
const aboutContent = ref<AboutContent | null>(null)
const loading = ref(true)

onMounted(async () => {
  if (!firestore) {
    console.error('Firestore not initialized')
    loading.value = false
    return
  }

  try {
    const aboutRef = collection(firestore, 'about')
    const q = query(
      aboutRef,
      where('isPublished', '==', true),
      limit(1)
    )

    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      const docSnapshot = snapshot.docs[0]
      aboutContent.value = {
        id: docSnapshot.id,
        ...docSnapshot.data()
      } as AboutContent
    }
  } catch (error) {
    console.error('Error fetching about content:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style>
/* Prose styles for rich content */
.prose img {
  max-width: 100%;
  height: auto;
}

.prose h1 {
  font-size: 2.25rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h2 {
  font-size: 1.875rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h3 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose p {
  margin-bottom: 1.25rem;
}

.prose ul,
.prose ol {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose blockquote {
  border-left: 4px solid #ec4899;
  padding-left: 1rem;
  font-style: italic;
  color: #6b7280;
  margin: 1.5rem 0;
}
</style>
