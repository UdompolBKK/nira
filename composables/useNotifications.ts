// useNotifications.ts - Notification system composable
import { useAuth } from '~/composables/useAuth'
import { useFirestore } from '~/composables/useFirestore'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  type Timestamp
} from 'firebase/firestore'

export interface Notification {
  id: string
  userId: string // recipient
  type: 'like' | 'comment' | 'friend_request' | 'friend_accepted' | 'system'
  message?: string
  read: boolean
  status?: 'pending' | 'accepted' | 'rejected'
  actionUrl?: string // URL to navigate when clicked
  createdAt: Timestamp | Date
  // Relational Model: Only store UIDs, fetch user data dynamically from users collection
  senderId?: string // UID of user who triggered this notification
  postId?: string // related post
  requestId?: string // friend request ID
  // These fields are populated by API/composable by fetching from users collection:
  senderName?: string // Fetched from users.displayName or users.anonymousName
  senderPhoto?: string // Fetched from users.photoURL
}

export const useNotifications = () => {
  const { user } = useAuth()
  const { firestore } = useFirestore()

  const notifications = ref<Notification[]>([])
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  const loading = ref(true)

  // Fetch notifications via API (includes sender info)
  const fetchNotificationsFromAPI = async () => {
    if (!user.value?.uid) {
      loading.value = false
      return
    }

    try {
      const firebaseUser = user.value._firebaseUser
      if (!firebaseUser) {
        loading.value = false
        return
      }

      const token = await firebaseUser.getIdToken()
      const response = await $fetch<{ success: boolean; notifications: Notification[] }>('/api/notifications/list', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.success) {
        notifications.value = response.notifications
      }
    } catch (error) {
      console.error('[Notifications] Error fetching from API:', error)
    } finally {
      loading.value = false
    }
  }

  // Subscribe to user's notifications (real-time updates + fetch full data from API)
  const subscribeToNotifications = () => {
    if (!user.value?.uid || !firestore) {
      loading.value = false
      return null
    }

    // Initial fetch from API to get sender info
    fetchNotificationsFromAPI()

    const notificationsRef = collection(firestore, 'notifications')
    const q = query(
      notificationsRef,
      where('userId', '==', user.value.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    )

    // Listen for real-time changes, then re-fetch from API to get sender info
    return onSnapshot(q, async () => {
      // Re-fetch from API when data changes to get updated sender info
      await fetchNotificationsFromAPI()
    }, (error) => {
      console.error('[Notifications] Error in snapshot listener:', error)
      loading.value = false
    })
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    if (!firestore) return

    try {
      const notifRef = doc(firestore, 'notifications', notificationId)
      await updateDoc(notifRef, {
        read: true
      })
    } catch (error) {
      console.error('[Notifications] Error marking as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    if (!firestore) return

    try {
      const unreadNotifs = notifications.value.filter(n => !n.read)
      await Promise.all(
        unreadNotifs.map(notif =>
          updateDoc(doc(firestore, 'notifications', notif.id), { read: true })
        )
      )
    } catch (error) {
      console.error('[Notifications] Error marking all as read:', error)
    }
  }

  // Create notification (helper function for other parts of app)
  const createNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    if (!firestore) return

    try {
      await addDoc(collection(firestore, 'notifications'), {
        ...notification,
        read: false,
        createdAt: serverTimestamp()
      })
    } catch (error) {
      console.error('[Notifications] Error creating notification:', error)
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    subscribeToNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    fetchNotificationsFromAPI
  }
}
