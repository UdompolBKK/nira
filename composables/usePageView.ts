import {
  doc,
  collection,
  addDoc,
  updateDoc,
  increment,
  query,
  where,
  getDocs,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore'

/**
 * Composable สำหรับจัดการ Page View
 *
 * โครงสร้าง Firestore:
 * - pageviews (collection): เก็บ raw pageview data
 *   - pageType: 'hotel' | 'blog'
 *   - pageId: string (document ID ของ hotel/blog)
 *   - ip: string (hashed IP for privacy)
 *   - userAgent: string
 *   - createdAt: timestamp
 *
 * - hotels/{id}.viewCount: number (aggregated count)
 * - blogs/{id}.viewCount: number (aggregated count)
 */
export const usePageView = () => {
  const { firestore } = useFirebase()

  /**
   * Hash IP address เพื่อความเป็นส่วนตัว
   */
  const hashIP = async (ip: string): Promise<string> => {
    if (typeof window === 'undefined') return ip

    const encoder = new TextEncoder()
    const data = encoder.encode(ip + 'petcango-salt')
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16)
  }

  /**
   * ดึง IP address ของ user (ผ่าน API)
   */
  const getClientIP = async (): Promise<string> => {
    try {
      // ใช้ server API เพื่อดึง IP
      const response = await fetch('/api/client-ip')
      const data = await response.json()
      return data.ip || 'unknown'
    } catch {
      return 'unknown'
    }
  }

  /**
   * สร้าง unique key สำหรับเช็ค duplicate (IP + pageId + วันนี้)
   */
  const getTodayKey = (hashedIP: string, pageType: string, pageId: string): string => {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    return `${hashedIP}-${pageType}-${pageId}-${today}`
  }

  /**
   * เช็คว่า IP นี้เคย view หน้านี้วันนี้หรือยัง
   */
  const hasViewedToday = async (pageType: string, pageId: string, hashedIP: string): Promise<boolean> => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const pageviewsRef = collection(firestore, 'pageviews')
      const q = query(
        pageviewsRef,
        where('pageType', '==', pageType),
        where('pageId', '==', pageId),
        where('hashedIP', '==', hashedIP),
        where('createdAt', '>=', Timestamp.fromDate(today))
      )

      const snapshot = await getDocs(q)
      return !snapshot.empty
    } catch (err) {
      console.error('Error checking pageview:', err)
      return false // ถ้า error ให้นับได้
    }
  }

  /**
   * บันทึก Page View
   * - บันทึกลง pageviews collection
   * - Increment viewCount ใน hotels/blogs
   * - ป้องกัน duplicate count (1 IP = 1 count ต่อวัน)
   */
  const trackPageView = async (
    pageType: 'hotel' | 'blog',
    pageId: string,
    options?: {
      forceCount?: boolean // บังคับนับแม้ IP ซ้ำ
    }
  ): Promise<boolean> => {
    try {
      // ดึง IP และ hash
      const clientIP = await getClientIP()
      const hashedIP = await hashIP(clientIP)

      // เช็ค duplicate (ถ้าไม่ force)
      if (!options?.forceCount) {
        const alreadyViewed = await hasViewedToday(pageType, pageId, hashedIP)
        if (alreadyViewed) {
          console.log('Already viewed today, skipping count')
          return false
        }
      }

      // บันทึก raw pageview (ตัด userAgent ออกเพื่อประหยัด storage)
      const pageviewData = {
        pageType,
        pageId,
        hashedIP,
        createdAt: serverTimestamp(),
        date: new Date().toISOString().split('T')[0] // สำหรับ query ง่าย
      }

      await addDoc(collection(firestore, 'pageviews'), pageviewData)

      // Increment viewCount ใน document หลัก
      const collectionName = pageType === 'hotel' ? 'hotels' : 'blogs'
      const docRef = doc(firestore, collectionName, pageId)

      await updateDoc(docRef, {
        viewCount: increment(1),
        lastViewedAt: serverTimestamp()
      })

      console.log(`Page view recorded: ${pageType}/${pageId}`)
      return true

    } catch (err) {
      console.error('Error tracking pageview:', err)
      return false
    }
  }

  /**
   * ดึงจำนวน viewCount ของ page
   */
  const getViewCount = async (pageType: 'hotel' | 'blog', pageId: string): Promise<number> => {
    try {
      const { getDocument } = useFirestore()
      const collectionName = pageType === 'hotel' ? 'hotels' : 'blogs'
      const doc = await getDocument(collectionName, pageId)
      return doc?.viewCount || 0
    } catch {
      return 0
    }
  }

  /**
   * ดึงสถิติ pageview รายวัน (สำหรับ dashboard)
   */
  const getDailyStats = async (
    pageType: 'hotel' | 'blog',
    pageId: string,
    days: number = 7
  ): Promise<{ date: string; count: number }[]> => {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      startDate.setHours(0, 0, 0, 0)

      const pageviewsRef = collection(firestore, 'pageviews')
      const q = query(
        pageviewsRef,
        where('pageType', '==', pageType),
        where('pageId', '==', pageId),
        where('createdAt', '>=', Timestamp.fromDate(startDate))
      )

      const snapshot = await getDocs(q)

      // Group by date
      const dailyCounts: Record<string, number> = {}
      snapshot.forEach(doc => {
        const date = doc.data().date
        dailyCounts[date] = (dailyCounts[date] || 0) + 1
      })

      // Convert to array และเรียงตามวันที่
      return Object.entries(dailyCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))

    } catch (err) {
      console.error('Error getting daily stats:', err)
      return []
    }
  }

  return {
    trackPageView,
    getViewCount,
    getDailyStats,
    getClientIP,
    hashIP
  }
}
