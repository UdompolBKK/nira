// composables/usePosts.ts - Using API with Firebase Admin SDK
import { ref } from 'vue'

// Mood categories for diary entries
export type MoodCategory = 'good' | 'normal' | 'bad' | 'worst' | 'critical'

export const MOOD_CATEGORIES = {
  good: { label: 'ช่วงชีวิตที่ดี', emoji: '😊', color: 'bg-gray-100' },
  normal: { label: 'ช่วงเวลาทั่วไป', emoji: '😐', color: 'bg-gray-100' },
  bad: { label: 'ช่วงที่แย่', emoji: '😢', color: 'bg-gray-200' },
  worst: { label: 'ช่วงที่เลวร้ายที่สุด', emoji: '😰', color: 'bg-gray-300' },
  critical: { label: 'วิกฤต (ต้องการความช่วยเหลือ)', emoji: '🆘', color: 'bg-gray-900 text-white' }
} as const

export interface Post {
  id: string
  userId: string
  authorName: string
  authorSlug?: string
  authorPhoto?: string
  content: string
  excerpt?: string
  visibility: 'public' | 'friends' | 'private'
  isLocked: boolean
  tags: string[]
  moodCategory: MoodCategory
  postType?: 'vent' | 'story'
  likeCount: number
  sadCount: number
  happyCount: number
  commentCount: number
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface CreatePostData {
  content: string
  visibility: 'public' | 'friends' | 'private'
  isLocked: boolean
  tags: string[]
  moodCategory: MoodCategory
  postType?: 'vent' | 'story'
}

export const usePosts = () => {
  const { user } = useAuth()

  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasMore = ref(true)
  const lastPostDate = ref<string | null>(null)

  // Get auth token for API calls
  const getAuthToken = async (): Promise<string | null> => {
    const firebaseUser = user.value?._firebaseUser
    if (!firebaseUser) return null
    try {
      return await firebaseUser.getIdToken()
    } catch {
      return null
    }
  }

  // Convert API response to Post
  const convertPost = (data: any): Post => ({
    id: data.id,
    userId: data.userId,
    authorName: data.authorName || 'ไม่ระบุชื่อ',
    authorSlug: data.authorSlug,
    authorPhoto: data.authorPhoto,
    content: data.content,
    excerpt: data.excerpt || data.content?.replace(/<[^>]*>/g, '').substring(0, 150),
    visibility: data.visibility || 'public',
    isLocked: data.isLocked || false,
    tags: data.tags || [],
    moodCategory: data.moodCategory || 'normal',
    likeCount: data.likeCount || 0,
    sadCount: data.sadCount || 0,
    happyCount: data.happyCount || 0,
    commentCount: data.commentCount || 0,
    viewCount: data.viewCount || 0,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt)
  })

  // Get public posts (for browse page)
  const getPublicPosts = async (limitCount = 10, loadMore = false) => {
    loading.value = true
    error.value = null

    try {
      const params: Record<string, string> = { limit: String(limitCount) }
      if (loadMore && lastPostDate.value) {
        params.startAfter = lastPostDate.value
      }

      const response = await $fetch<{ posts: any[], hasMore: boolean }>('/api/posts', { params })
      const newPosts = response.posts.map(convertPost)

      if (loadMore) {
        posts.value = [...posts.value, ...newPosts]
      } else {
        posts.value = newPosts
      }

      if (newPosts.length > 0) {
        lastPostDate.value = newPosts[newPosts.length - 1].createdAt.toISOString()
      }
      hasMore.value = response.hasMore

      return newPosts
    } catch (err: any) {
      error.value = err.data?.message || err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // Get featured posts (likes >= 50) - simplified for now
  const getFeaturedPosts = async (limitCount = 5) => {
    try {
      const response = await $fetch<{ posts: any[] }>('/api/posts', {
        params: { limit: String(limitCount) }
      })
      return response.posts.map(convertPost).filter(p => p.likeCount >= 50)
    } catch (err: any) {
      console.error('Error getting featured posts:', err)
      return []
    }
  }

  // Get trending posts (simplified)
  const getTrendingPosts = async (limitCount = 10) => {
    try {
      const response = await $fetch<{ posts: any[] }>('/api/posts', {
        params: { limit: String(limitCount * 2) }
      })
      return response.posts.map(convertPost)
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, limitCount)
    } catch (err: any) {
      console.error('Error getting trending posts:', err)
      return []
    }
  }

  // Get user's own posts
  const getMyPosts = async (limitCount = 20) => {
    if (!user.value) return []

    loading.value = true
    try {
      const token = await getAuthToken()
      if (!token) {
        error.value = 'กรุณาเข้าสู่ระบบ'
        return []
      }

      const response = await $fetch<{ posts: any[] }>('/api/posts/my', {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: String(limitCount) }
      })

      posts.value = response.posts.map(convertPost)
      return posts.value
    } catch (err: any) {
      error.value = err.data?.message || err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // Get single post by ID
  const getPost = async (postId: string): Promise<Post | null> => {
    try {
      const response = await $fetch<{ post: any }>(`/api/posts/${postId}`)
      return convertPost(response.post)
    } catch (err: any) {
      error.value = err.data?.message || err.message
      return null
    }
  }

  // Create new post
  const createPost = async (data: CreatePostData): Promise<string | null> => {
    if (!user.value) {
      error.value = 'กรุณาเข้าสู่ระบบก่อน'
      return null
    }

    loading.value = true
    try {
      const token = await getAuthToken()
      if (!token) {
        error.value = 'กรุณาเข้าสู่ระบบ'
        return null
      }

      const response = await $fetch<{ success: boolean, id: string }>('/api/posts', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      })

      return response.id
    } catch (err: any) {
      error.value = err.data?.message || err.message
      return null
    } finally {
      loading.value = false
    }
  }

  // Update post
  const updatePost = async (postId: string, data: Partial<CreatePostData>): Promise<boolean> => {
    if (!user.value) {
      error.value = 'กรุณาเข้าสู่ระบบก่อน'
      return false
    }

    loading.value = true
    try {
      const token = await getAuthToken()
      if (!token) {
        error.value = 'กรุณาเข้าสู่ระบบ'
        return false
      }

      await $fetch(`/api/posts/${postId}`, {
        method: 'PUT' as const,
        headers: { Authorization: `Bearer ${token}` },
        body: data
      })

      return true
    } catch (err: any) {
      error.value = err.data?.message || err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Delete post
  const deletePost = async (postId: string): Promise<boolean> => {
    if (!user.value) {
      error.value = 'กรุณาเข้าสู่ระบบก่อน'
      return false
    }

    loading.value = true
    try {
      const token = await getAuthToken()
      if (!token) {
        error.value = 'กรุณาเข้าสู่ระบบ'
        return false
      }

      await $fetch(`/api/posts/${postId}`, {
        method: 'DELETE' as const,
        headers: { Authorization: `Bearer ${token}` }
      })

      posts.value = posts.value.filter(p => p.id !== postId)
      return true
    } catch (err: any) {
      error.value = err.data?.message || err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Increment view count
  const incrementView = async (postId: string) => {
    try {
      await $fetch(`/api/posts/${postId}/view`, { method: 'POST' })
    } catch (err) {
      console.error('Error incrementing view:', err)
    }
  }

  // Search posts by keyword
  const searchPosts = async (keyword: string, limitCount = 20): Promise<Post[]> => {
    if (!keyword.trim()) return []

    try {
      const response = await $fetch<{ posts: any[] }>('/api/posts/search', {
        params: { q: keyword, limit: String(limitCount) }
      })
      return response.posts.map(convertPost)
    } catch (err: any) {
      error.value = err.data?.message || err.message
      return []
    }
  }

  // Get posts by tag
  const getPostsByTag = async (tag: string, limitCount = 20): Promise<Post[]> => {
    try {
      const response = await $fetch<{ posts: any[] }>(`/api/posts/tag/${encodeURIComponent(tag)}`, {
        params: { limit: String(limitCount) }
      })
      return response.posts.map(convertPost)
    } catch (err: any) {
      error.value = err.data?.message || err.message
      return []
    }
  }

  // Get posts by specific user ID
  const getUserPosts = async (userId: string, limitCount = 10, loadMore = false) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ posts: any[] }>(`/api/posts/user/${userId}`, {
        params: { limit: String(limitCount), order: 'asc' }
      })

      const newPosts = response.posts.map(convertPost)

      if (loadMore) {
        posts.value = [...posts.value, ...newPosts]
      } else {
        posts.value = newPosts
      }

      return newPosts
    } catch (err: any) {
      error.value = err.data?.message || err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // Create post with custom createdAt (for inserting between posts)
  const createInsertedPost = async (
    data: CreatePostData,
    insertAfterDate: Date,
    insertBeforeDate: Date
  ): Promise<string | null> => {
    // For now, just create a normal post
    return await createPost(data)
  }

  // Reset pagination
  const resetPagination = () => {
    posts.value = []
    lastPostDate.value = null
    hasMore.value = true
  }

  return {
    posts,
    loading,
    error,
    hasMore,
    getPublicPosts,
    getFeaturedPosts,
    getTrendingPosts,
    getMyPosts,
    getUserPosts,
    getPost,
    createPost,
    createInsertedPost,
    updatePost,
    deletePost,
    incrementView,
    searchPosts,
    getPostsByTag,
    resetPagination
  }
}
