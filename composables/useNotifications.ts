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
  type: 'like' | 'comment' | 'friend_request' | 'friend_accept' | 'system'
  title: string
  message: string
  read: boolean
  actionUrl?: string // URL to navigate when clicked
  createdAt: Timestamp | Date
  // Metadata
  fromUserId?: string // who triggered this notification
  fromUserName?: string
  fromUserPhoto?: string
  postId?: string // related post
}

export const useNotifications = () => {
  const { user } = useAuth()
  const { firestore } = useFirestore()

  const notifications = ref<Notification[]>([])
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  const loading = ref(true)

  // Subscribe to user's notifications
  const subscribeToNotifications = () => {
    if (!user.value?.uid || !firestore) {
      loading.value = false
      return null
    }

    const notificationsRef = collection(firestore, 'notifications')
    const q = query(
      notificationsRef,
      where('userId', '==', user.value.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    )

    return onSnapshot(q, (snapshot) => {
      notifications.value = snapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data()
      })) as Notification[]
      loading.value = false
    }, (error) => {
      console.error('[Notifications] Error fetching notifications:', error)
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
    createNotification
  }
}
