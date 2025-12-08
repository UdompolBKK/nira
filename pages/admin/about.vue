<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">จัดการหน้าเกี่ยวกับเรา</h1>
        <p class="text-gray-600 mt-1">แก้ไขเนื้อหาหน้า About</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12 bg-white rounded-2xl shadow">
        <Icon name="lucide:loader-2" class="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
        <p class="text-gray-500">กำลังโหลด...</p>
      </div>

      <!-- Form -->
      <div v-else class="bg-white rounded-2xl shadow-lg p-8">
        <form @submit.prevent="saveAbout" class="space-y-6">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">หัวข้อหลัก</label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="เกี่ยวกับเรา"
            />
          </div>

          <!-- Subtitle -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">คำอธิบายย่อย</label>
            <input
              v-model="form.subtitle"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="พื้นที่ปลอดภัยสำหรับการดูแลสุขภาพจิต"
            />
          </div>

          <!-- Cover Image URL -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">URL รูปภาพหน้าปก (ไม่บังคับ)</label>
            <input
              v-model="form.coverImage"
              type="url"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="https://example.com/image.jpg"
            />
            <div v-if="form.coverImage" class="mt-3">
              <img :src="form.coverImage" alt="Preview" class="w-full h-48 object-cover rounded-xl" />
            </div>
          </div>

          <!-- Content (Rich Text HTML) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">เนื้อหา (HTML)</label>
            <textarea
              v-model="form.content"
              rows="20"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none font-mono text-sm"
              placeholder="<h2>ภารกิจของเรา</h2>&#10;<p>เนื้อหา...</p>"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              รองรับ HTML tags: h1, h2, h3, p, strong, em, ul, ol, li, blockquote, img, a
            </p>
          </div>

          <!-- HTML Guide -->
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 class="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Icon name="lucide:info" class="w-5 h-5" />
              คำแนะนำการใช้ HTML
            </h3>
            <div class="text-sm text-blue-800 space-y-1">
              <p><code>&lt;h2&gt;หัวข้อ&lt;/h2&gt;</code> - หัวข้อใหญ่</p>
              <p><code>&lt;h3&gt;หัวข้อย่อย&lt;/h3&gt;</code> - หัวข้อเล็ก</p>
              <p><code>&lt;p&gt;ข้อความ&lt;/p&gt;</code> - ข้อความทั่วไป</p>
              <p><code>&lt;strong&gt;ตัวหนา&lt;/strong&gt;</code> - ตัวหนา</p>
              <p><code>&lt;em&gt;ตัวเอียง&lt;/em&gt;</code> - ตัวเอียง</p>
              <p><code>&lt;ul&gt;&lt;li&gt;รายการ&lt;/li&gt;&lt;/ul&gt;</code> - รายการแบบจุด</p>
              <p><code>&lt;img src="URL" alt="คำอธิบาย" /&gt;</code> - รูปภาพ</p>
              <p><code>&lt;a href="URL"&gt;ลิงก์&lt;/a&gt;</code> - ลิงก์</p>
            </div>
          </div>

          <!-- Preview -->
          <div class="border-t pt-6">
            <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon name="lucide:eye" class="w-5 h-5" />
              ตัวอย่าง
            </h3>
            <div
              class="prose prose-lg max-w-none border border-gray-200 rounded-xl p-6 bg-gray-50
                     prose-headings:font-bold prose-headings:text-gray-900
                     prose-p:text-gray-700 prose-p:leading-relaxed
                     prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline
                     prose-strong:text-gray-900 prose-strong:font-bold
                     prose-ul:list-disc prose-ol:list-decimal
                     prose-img:rounded-xl prose-img:shadow-md"
              v-html="form.content"
            ></div>
          </div>

          <!-- Published Checkbox -->
          <div class="flex items-center gap-2 border-t pt-6">
            <input
              v-model="form.isPublished"
              type="checkbox"
              id="isPublished"
              class="w-5 h-5 text-pink-600 rounded focus:ring-2 focus:ring-pink-500"
            />
            <label for="isPublished" class="text-sm font-medium text-gray-700">
              เผยแพร่หน้าเกี่ยวกับเรา (ปิดเพื่อซ่อนจากผู้ใช้ทั่วไป)
            </label>
          </div>

          <!-- Last Updated -->
          <div v-if="aboutId" class="text-sm text-gray-500 border-t pt-4">
            อัปเดตล่าสุด: {{ formatDate(form.updatedAt) }}
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
              <span v-else class="flex items-center justify-center gap-2">
                <Icon name="lucide:save" class="w-5 h-5" />
                บันทึกการเปลี่ยนแปลง
              </span>
            </button>
            <NuxtLink
              to="/about"
              target="_blank"
              class="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Icon name="lucide:external-link" class="w-5 h-5" />
              ดูหน้าจริง
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFirestore } from '~/composables/useFirestore'
import { collection, addDoc, updateDoc, doc, getDocs, query, where, limit, serverTimestamp, type Timestamp } from 'firebase/firestore'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface AboutContent {
  id: string
  title: string
  subtitle: string
  content: string
  coverImage?: string
  updatedAt?: Timestamp | Date
  isPublished: boolean
}

const { firestore } = useFirestore()
const loading = ref(true)
const saving = ref(false)
const aboutId = ref<string | null>(null)

const form = ref({
  title: 'เกี่ยวกับเรา',
  subtitle: 'พื้นที่ปลอดภัยสำหรับการดูแลสุขภาพจิต',
  content: '',
  coverImage: '',
  isPublished: true,
  updatedAt: null as Timestamp | Date | null
})

const formatDate = (timestamp: any) => {
  if (!timestamp) return 'ไม่ระบุ'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadAbout = async () => {
  if (!firestore) return

  loading.value = true
  try {
    const aboutRef = collection(firestore, 'about')
    const q = query(aboutRef, limit(1))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      const docSnapshot = snapshot.docs[0]
      const data = docSnapshot.data() as AboutContent

      aboutId.value = docSnapshot.id
      form.value = {
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
        coverImage: data.coverImage || '',
        isPublished: data.isPublished,
        updatedAt: data.updatedAt || null
      }
    }
  } catch (error) {
    console.error('Error loading about:', error)
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูล')
  } finally {
    loading.value = false
  }
}

const saveAbout = async () => {
  if (!firestore) return

  saving.value = true
  try {
    const aboutData = {
      title: form.value.title,
      subtitle: form.value.subtitle,
      content: form.value.content,
      coverImage: form.value.coverImage || null,
      isPublished: form.value.isPublished,
      updatedAt: serverTimestamp()
    }

    if (aboutId.value) {
      // Update existing
      const aboutRef = doc(firestore, 'about', aboutId.value)
      await updateDoc(aboutRef, aboutData)
    } else {
      // Create new
      const docRef = await addDoc(collection(firestore, 'about'), {
        ...aboutData,
        createdAt: serverTimestamp()
      })
      aboutId.value = docRef.id
    }

    await loadAbout()
    alert('บันทึกสำเร็จ!')
  } catch (error) {
    console.error('Error saving about:', error)
    alert('เกิดข้อผิดพลาดในการบันทึก')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadAbout()
})
</script>

<style>
.prose img {
  max-width: 100%;
  height: auto;
}

code {
  background: #e0e7ff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.875em;
}
</style>
