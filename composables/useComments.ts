// composables/useComments.ts
// Comments system for posts

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  Timestamp,
  onSnapshot,
  type Unsubscribe
} from 'firebase/firestore'

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
  const { $firestore } = useNuxtApp()
  const { user } = useAuth()

  const comments = ref<Comment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let unsubscribe: Unsubscribe | null = null

  // Convert Firestore doc to Comment
  const docToComment = (doc: any): Comment => {
    const data = doc.data()
    return {
      id: doc.id,
      postId: data.postId,
      userId: data.userId,
      authorName: data.authorName || 'ไม่ระบุชื่อ',
      authorPhoto: data.authorPhoto,
      content: data.content,
      isPriority: data.isPriority || false,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    }
  }

  // Get comments for a post (real-time)
  const subscribeToComments = (postId: string) => {
    if (!$firestore) return

    // Unsubscribe from previous listener
    if (unsubscribe) {
      unsubscribe()
    }

    loading.value = true
    const commentsRef = collection($firestore, 'comments')
    const q = query(
      commentsRef,
      where('postId', '==', postId),
      orderBy('isPriority', 'desc'),
      orderBy('createdAt', 'asc')
    )

    unsubscribe = onSnapshot(q, (snapshot) => {
      comments.value = snapshot.docs.map(docToComment)
      loading.value = false
    }, (err) => {
      error.value = err.message
      loading.value = false
    })
  }

  // Get comments (non-realtime)
  const getComments = async (postId: string, limitCount = 50): Promise<Comment[]> => {
    if (!$firestore) return []

    loading.value = true
    try {
      const commentsRef = collection($firestore, 'comments')
      const q = query(
        commentsRef,
        where('postId', '==', postId),
        orderBy('isPriority', 'desc'),
        orderBy('createdAt', 'asc'),
        limit(limitCount)
      )

      const snapshot = await getDocs(q)
      comments.value = snapshot.docs.map(docToComment)
      return comments.value
    } catch (err: any) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // Add comment
  const addComment = async (postId: string, content: string): Promise<string | null> => {
    if (!$firestore || !user.value) {
      error.value = 'กรุณาเข้าสู่ระบบก่อน'
      return null
    }

    if (!content.trim()) {
      error.value = 'กรุณากรอกความคิดเห็น'
      return null
    }

    loading.value = true
    try {
      // Get user profile
      const userDoc = await getDoc(doc($firestore, 'users', user.value.uid))
      const userData = userDoc.data()

      const commentData = {
        postId,
        userId: user.value.uid,
        authorName: userData?.displayName || user.value.displayName || 'ไม่ระบุชื่อ',
        authorPhoto: userData?.photoURL || user.value.photoURL,
        content: content.trim(),
        isPriority: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }

      const commentsRef = collection($firestore, 'comments')
      const docRef = await addDoc(commentsRef, commentData)

      // Update comment count on post
      const postRef = doc($firestore, 'posts', postId)
      await updateDoc(postRef, {
        commentCount: increment(1)
      })

      return docRef.id
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  // Update comment
  const updateComment = async (commentId: string, content: string): Promise<boolean> => {
    if (!$firestore || !user.value) {
      error.value = 'กรุณาเข้าสู่ระบบก่อน'
      return false
    }

    loading.value = true
    try {
      const commentRef = doc($firestore, 'comments', commentId)

      // Verify ownership
      const commentDoc = await getDoc(commentRef)
      if (!commentDoc.exists() || commentDoc.data().userId !== user.value.uid) {
        error.value = 'คุณไม่มีสิทธิ์แก้ไขความคิดเห็นนี้'
        return false
      }

      await updateDoc(commentRef, {
        content: content.trim(),
        updatedAt: Timestamp.now()
      })

      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Delete comment
  const deleteComment = async (commentId: string, postId: string): Promise<boolean> => {
    if (!$firestore || !user.value) {
      error.value = 'กรุณาเข้าสู่ระบบก่อน'
      return false
    }

    loading.value = true
    try {
      const commentRef = doc($firestore, 'comments', commentId)

      // Verify ownership
      const commentDoc = await getDoc(commentRef)
      if (!commentDoc.exists() || commentDoc.data().userId !== user.value.uid) {
        error.value = 'คุณไม่มีสิทธิ์ลบความคิดเห็นนี้'
        return false
      }

      await deleteDoc(commentRef)

      // Update comment count on post
      const postRef = doc($firestore, 'posts', postId)
      await updateDoc(postRef, {
        commentCount: increment(-1)
      })

      // Remove from local state
      comments.value = comments.value.filter(c => c.id !== commentId)

      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Cleanup subscription
  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  // Auto cleanup on unmount
  onUnmounted(() => {
    cleanup()
  })

  return {
    comments,
    loading,
    error,
    subscribeToComments,
    getComments,
    addComment,
    updateComment,
    deleteComment,
    cleanup
  }
}
