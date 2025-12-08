<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-24">
      <Icon name="lucide:loader-2" class="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
      <p class="text-gray-500">กำลังโหลดบทความ...</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!article" class="text-center py-24">
      <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full mb-6">
        <Icon name="lucide:file-x" class="w-12 h-12 text-pink-400" />
      </div>
      <h3 class="text-2xl font-semibold text-gray-900 mb-4">ไม่พบบทความ</h3>
      <NuxtLink to="/articles" class="text-pink-600 hover:text-pink-700 font-medium">
        ← กลับไปหน้าบทความ
      </NuxtLink>
    </div>

    <!-- Article Content -->
    <div v-else>
      <!-- Cover Image -->
      <div v-if="article.coverImage" class="relative h-96 overflow-hidden">
        <img
          :src="article.coverImage"
          :alt="article.title"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <!-- Article Header -->
      <div class="max-w-4xl mx-auto px-4 -mt-32 relative z-10">
        <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
          <NuxtLink to="/articles" class="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium mb-6">
            <Icon name="lucide:arrow-left" class="w-4 h-4" />
            กลับไปหน้าบทความ
          </NuxtLink>

          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {{ article.title }}
          </h1>

          <div class="flex items-center gap-6 text-sm text-gray-600 mb-8">
            <div class="flex items-center gap-2">
              <Icon name="lucide:calendar" class="w-4 h-4" />
              <span>{{ formatDate(article.publishedAt) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="lucide:eye" class="w-4 h-4" />
              <span>{{ article.views || 0 }} ครั้ง</span>
            </div>
          </div>

          <!-- Rich Content -->
          <div
            class="prose prose-lg max-w-none
                   prose-headings:font-bold prose-headings:text-gray-900
                   prose-p:text-gray-700 prose-p:leading-relaxed
                   prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline
                   prose-strong:text-gray-900 prose-strong:font-bold
                   prose-ul:list-disc prose-ol:list-decimal
                   prose-img:rounded-2xl prose-img:shadow-lg"
            v-html="article.content"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFirestore } from '~/composables/useFirestore'
import { collection, query, where, getDocs, doc, updateDoc, increment, type Timestamp } from 'firebase/firestore'

definePageMeta({
  layout: 'default'
})

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  publishedAt: Timestamp | Date
  views?: number
  isPublished: boolean
}

const route = useRoute()
const { firestore } = useFirestore()
const article = ref<Article | null>(null)
const loading = ref(true)

useHead({
  title: computed(() => article.value ? `${article.value.title} - บันทึกนิรนาม.com` : 'บทความ - บันทึกนิรนาม.com'),
  meta: computed(() => [
    {
      name: 'description',
      content: article.value?.excerpt || 'บทความเกี่ยวกับสุขภาพจิตและการดูแลตนเอง'
    },
    {
      property: 'og:title',
      content: article.value?.title || 'บทความ'
    },
    {
      property: 'og:description',
      content: article.value?.excerpt || 'บทความเกี่ยวกับสุขภาพจิตและการดูแลตนเอง'
    },
    {
      property: 'og:image',
      content: article.value?.coverImage || 'https://banthukniranan.com/og-default.jpg'
    },
    {
      property: 'og:type',
      content: 'article'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: article.value?.title || 'บทความ'
    },
    {
      name: 'twitter:description',
      content: article.value?.excerpt || 'บทความเกี่ยวกับสุขภาพจิตและการดูแลตนเอง'
    },
    {
      name: 'twitter:image',
      content: article.value?.coverImage || 'https://banthukniranan.com/og-default.jpg'
    }
  ])
})

const formatDate = (timestamp: any) => {
  if (!timestamp) return ''

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  if (!firestore) {
    console.error('Firestore not initialized')
    loading.value = false
    return
  }

  try {
    const articlesRef = collection(firestore, 'articles')
    const q = query(
      articlesRef,
      where('slug', '==', route.params.slug),
      where('isPublished', '==', true)
    )

    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      const docSnapshot = snapshot.docs[0]
      article.value = {
        id: docSnapshot.id,
        ...docSnapshot.data()
      } as Article

      // Increment view count
      const articleRef = doc(firestore, 'articles', docSnapshot.id)
      await updateDoc(articleRef, {
        views: increment(1)
      })
    }
  } catch (error) {
    console.error('Error fetching article:', error)
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
