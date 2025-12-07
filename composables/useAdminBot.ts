// composables/useAdminBot.ts
// Admin management for AI Bot - Prompt templates, Knowledge base, Analytics

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
  Timestamp
} from 'firebase/firestore'
import type { BotSkin } from './useAIBot'

// Knowledge Base Entry
export interface KnowledgeEntry {
  id: string
  category: string
  title: string
  content: string
  keywords: string[]
  botSkins: BotSkin[] // Which bots can use this
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Prompt Template
export interface PromptTemplate {
  id: string
  botSkin: BotSkin
  name: string
  systemPrompt: string
  greeting: string
  fallbackResponses: string[]
  isActive: boolean
  version: number
  createdAt: Date
  updatedAt: Date
}

// Chat Analytics
export interface ChatAnalytics {
  totalChats: number
  totalMessages: number
  avgMessagesPerChat: number
  riskDistribution: {
    low: number      // 0-0.3
    medium: number   // 0.4-0.6
    high: number     // 0.7-0.9
    critical: number // 1.0
  }
  popularBotSkins: { skin: BotSkin; count: number }[]
  dailyUsage: { date: string; count: number }[]
}

// Conversation for review
export interface ConversationReview {
  id: string
  chatId: string
  userId: string
  botSkin: BotSkin
  messages: {
    role: 'user' | 'assistant'
    content: string
    riskScore?: number
  }[]
  maxRiskScore: number
  createdAt: Date
  reviewed: boolean
  reviewNotes?: string
}

export const useAdminBot = () => {
  const { firestore } = useFirebase()
  const { user, isSuperAdmin } = useAuth()

  const loading = ref(false)
  const error = ref<string | null>(null)

  // ============ Knowledge Base ============

  const knowledgeEntries = ref<KnowledgeEntry[]>([])

  const getKnowledgeEntries = async () => {
    if (!firestore || !isSuperAdmin.value) return []

    loading.value = true
    try {
      const ref = collection(firestore, 'botKnowledge')
      const q = query(ref, orderBy('category'), orderBy('title'))
      const snapshot = await getDocs(q)

      knowledgeEntries.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as KnowledgeEntry[]

      return knowledgeEntries.value
    } catch (err: any) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  const createKnowledgeEntry = async (data: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!firestore || !isSuperAdmin.value) {
      error.value = 'ไม่มีสิทธิ์'
      return null
    }

    try {
      const ref = collection(firestore, 'botKnowledge')
      const docRef = await addDoc(ref, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
      return docRef.id
    } catch (err: any) {
      error.value = err.message
      return null
    }
  }

  const updateKnowledgeEntry = async (id: string, data: Partial<KnowledgeEntry>) => {
    if (!firestore || !isSuperAdmin.value) {
      error.value = 'ไม่มีสิทธิ์'
      return false
    }

    try {
      const ref = doc(firestore, 'botKnowledge', id)
      await updateDoc(ref, {
        ...data,
        updatedAt: Timestamp.now()
      })
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    }
  }

  const deleteKnowledgeEntry = async (id: string) => {
    if (!firestore || !isSuperAdmin.value) {
      error.value = 'ไม่มีสิทธิ์'
      return false
    }

    try {
      const ref = doc(firestore, 'botKnowledge', id)
      await deleteDoc(ref)
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    }
  }

  // ============ Prompt Templates ============

  const promptTemplates = ref<PromptTemplate[]>([])

  const getPromptTemplates = async () => {
    if (!firestore || !isSuperAdmin.value) return []

    loading.value = true
    try {
      const ref = collection(firestore, 'botPrompts')
      const q = query(ref, orderBy('botSkin'), orderBy('version', 'desc'))
      const snapshot = await getDocs(q)

      promptTemplates.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as PromptTemplate[]

      return promptTemplates.value
    } catch (err: any) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  const getActivePrompt = async (botSkin: BotSkin): Promise<PromptTemplate | null> => {
    if (!firestore) return null

    try {
      const ref = collection(firestore, 'botPrompts')
      const q = query(
        ref,
        where('botSkin', '==', botSkin),
        where('isActive', '==', true),
        orderBy('version', 'desc'),
        limit(1)
      )
      const snapshot = await getDocs(q)

      if (snapshot.empty) return null

      const doc = snapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as PromptTemplate
    } catch (err: any) {
      error.value = err.message
      return null
    }
  }

  const createPromptTemplate = async (data: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!firestore || !isSuperAdmin.value) {
      error.value = 'ไม่มีสิทธิ์'
      return null
    }

    try {
      const ref = collection(firestore, 'botPrompts')
      const docRef = await addDoc(ref, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
      return docRef.id
    } catch (err: any) {
      error.value = err.message
      return null
    }
  }

  const updatePromptTemplate = async (id: string, data: Partial<PromptTemplate>) => {
    if (!firestore || !isSuperAdmin.value) {
      error.value = 'ไม่มีสิทธิ์'
      return false
    }

    try {
      const ref = doc(firestore, 'botPrompts', id)
      await updateDoc(ref, {
        ...data,
        updatedAt: Timestamp.now()
      })
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    }
  }

  // ============ Analytics ============

  const getAnalytics = async (days = 30): Promise<ChatAnalytics | null> => {
    if (!firestore || !isSuperAdmin.value) return null

    loading.value = true
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const chatsRef = collection(firestore, 'botChats')
      const q = query(
        chatsRef,
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)

      let totalMessages = 0
      const riskDistribution = { low: 0, medium: 0, high: 0, critical: 0 }
      const skinCounts: Record<string, number> = {}
      const dailyCounts: Record<string, number> = {}

      snapshot.docs.forEach(doc => {
        const data = doc.data()
        const messages = data.messages || []
        totalMessages += messages.length

        // Risk distribution
        const risk = data.riskScore || 0
        if (risk <= 0.3) riskDistribution.low++
        else if (risk <= 0.6) riskDistribution.medium++
        else if (risk < 1.0) riskDistribution.high++
        else riskDistribution.critical++

        // Skin popularity
        const skin = data.botSkin || 'genz'
        skinCounts[skin] = (skinCounts[skin] || 0) + 1

        // Daily usage
        const date = data.createdAt?.toDate()?.toISOString().split('T')[0] || ''
        if (date) {
          dailyCounts[date] = (dailyCounts[date] || 0) + 1
        }
      })

      const analytics: ChatAnalytics = {
        totalChats: snapshot.docs.length,
        totalMessages,
        avgMessagesPerChat: snapshot.docs.length > 0 ? Math.round(totalMessages / snapshot.docs.length) : 0,
        riskDistribution,
        popularBotSkins: Object.entries(skinCounts)
          .map(([skin, count]) => ({ skin: skin as BotSkin, count }))
          .sort((a, b) => b.count - a.count),
        dailyUsage: Object.entries(dailyCounts)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date))
      }

      return analytics
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  // ============ Conversation Review ============

  const conversations = ref<ConversationReview[]>([])

  const getHighRiskConversations = async (minRisk = 0.7, limitCount = 50) => {
    if (!firestore || !isSuperAdmin.value) return []

    loading.value = true
    try {
      const chatsRef = collection(firestore, 'botChats')
      const q = query(
        chatsRef,
        where('riskScore', '>=', minRisk),
        orderBy('riskScore', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
      const snapshot = await getDocs(q)

      conversations.value = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          chatId: doc.id,
          userId: data.userId,
          botSkin: data.botSkin,
          messages: data.messages || [],
          maxRiskScore: data.riskScore || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          reviewed: data.reviewed || false,
          reviewNotes: data.reviewNotes
        }
      }) as ConversationReview[]

      return conversations.value
    } catch (err: any) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  const markConversationReviewed = async (chatId: string, notes?: string) => {
    if (!firestore || !isSuperAdmin.value) {
      error.value = 'ไม่มีสิทธิ์'
      return false
    }

    try {
      const ref = doc(firestore, 'botChats', chatId)
      await updateDoc(ref, {
        reviewed: true,
        reviewNotes: notes || '',
        reviewedAt: Timestamp.now(),
        reviewedBy: user.value?.email
      })
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    }
  }

  return {
    loading,
    error,
    // Knowledge Base
    knowledgeEntries,
    getKnowledgeEntries,
    createKnowledgeEntry,
    updateKnowledgeEntry,
    deleteKnowledgeEntry,
    // Prompt Templates
    promptTemplates,
    getPromptTemplates,
    getActivePrompt,
    createPromptTemplate,
    updatePromptTemplate,
    // Analytics
    getAnalytics,
    // Conversation Review
    conversations,
    getHighRiskConversations,
    markConversationReviewed
  }
}
