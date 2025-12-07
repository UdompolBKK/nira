// composables/useComments.ts
// Comments system for posts - Using API with Firebase Admin SDK

export interface Comment {
  id: string
  postId: string
  userId: string
  authorName: string
  authorPhoto?: string
  content: string
  isPriority: boolean
  createdAt: Date
  updatedAt: Date
}

export const useComments = () => {
  const { user } = useAuth()

  const comments = ref<Comment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get Firebase auth token
  const getAuthToken = async (): Promise<string> => {
    const firebaseUser = user.value?._firebaseUser
    if (!firebaseUser) {
      throw new Error('กรุณาเข้าสู่ระบบก่อน')
    }
    const token = await firebaseUser.getIdToken()
    return token
  }

  // Get comments for a post
  const getComments = async (postId: string, limitCount = 50): Promise<Comment[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ comments: Comment[] }>(`/api/comments/post/${postId}`, {
        query: { limit: limitCount }
      })

      comments.value = response.comments.map(c => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt)
      }))

      return comments.value
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'เกิดข้อผิดพลาด'
      return []
    } finally {
      loading.value = false
    }
  }

  // Add comment
  const addComment = async (postId: string, content: string): Promise<string | null> => {
    if (!user.value) {
      error.value = 'กรุณาเข้าสู่ระบบก่อน'
      return null
    }

    if (!content.trim()) {
      error.value = 'กรุณากรอกความคิดเห็น'
      return null
    }

    loading.value = true
    error.value = null

    try {
      const token = await getAuthToken()
      const response = await $fetch<{ success: boolean; commentId: string; comment: Comment }>('/api/comments', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { postId, content }
      })

      // Add to local state
      if (response.comment) {
        comments.value.push({
          ...response.comment,
          createdAt: new Date(response.comment.createdAt),
          updatedAt: new Date(response.comment.updatedAt)
        })
      }

      return response.commentId
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'เกิดข้อผิดพลาด'
      return null
    } finally {
      loading.value = false
    }
  }

  // Update comment
  const updateComment = async (commentId: string, content: string): Promise<boolean> => {
    if (!user.value) {
      error.value = 'กรุณาเข้าสู่ระบบก่อน'
      return false
    }

    loading.value = true
    error.value = null

    try {
      const token = await getAuthToken()
      await $fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: { content }
      })

      // Update local state
      const index = comments.value.findIndex(c => c.id === commentId)
      if (index !== -1) {
        comments.value[index].content = content.trim()
        comments.value[index].updatedAt = new Date()
      }

      return true
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'เกิดข้อผิดพลาด'
      return false
    } finally {
      loading.value = false
    }
  }

  // Delete comment
  const deleteComment = async (commentId: string, postId: string): Promise<boolean> => {
    if (!user.value) {
      error.value = 'กรุณาเข้าสู่ระบบก่อน'
      return false
    }

    loading.value = true
    error.value = null

    try {
      const token = await getAuthToken()
      await $fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        query: { postId }
      })

      // Remove from local state
      comments.value = comments.value.filter(c => c.id !== commentId)

      return true
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'เกิดข้อผิดพลาด'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    comments,
    loading,
    error,
    getComments,
    addComment,
    updateComment,
    deleteComment
  }
}
