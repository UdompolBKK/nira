<template>
  <div class="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
    <!-- Speech Bubble - Always show when there's a message and bot is enabled -->
    <Transition name="bubble">
      <div
        v-if="showBubble && currentResponse && isBotEnabled && !showSkinSelector"
        class="relative max-w-[220px] px-4 py-3 bg-white rounded-2xl shadow-lg border border-gray-100"
      >
        <!-- Bubble tail -->
        <div class="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45" />

        <!-- Message -->
        <p class="text-sm text-gray-700 relative z-10">
          {{ currentResponse.message }}
        </p>
      </div>
    </Transition>

    <!-- Character Container - Always visible -->
    <div class="relative group">
      <!-- Bot Avatar Wrapper - Moves up on hover -->
      <div
        class="transition-all duration-300 group-hover:-translate-y-10"
        :class="{ 'animate-bounce-gentle': isIdle }"
      >
        <!-- Settings Button (Gear Icon) - Always visible -->
        <button
          @click="showSkinSelector = true"
          class="absolute -top-1 -left-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transition-all z-20 hover:bg-gray-50 hover:scale-110"
          title="เลือก AI Skin"
        >
          <Icon name="lucide:settings" class="w-3.5 h-3.5 text-gray-500" />
        </button>

        <!-- Listening indicator (typing) -->
        <Transition name="fade">
          <div
            v-if="isTyping"
            class="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse z-10"
          />
        </Transition>

        <!-- Character Avatar -->
        <div
          @click="showSkinSelector = true"
          class="w-20 h-20 flex items-center justify-center cursor-pointer transition-all"
          :class="{
            'drop-shadow-lg': selectedBot?.avatar,
            'grayscale opacity-40': !isBotEnabled
          }"
        >
        <!-- Bot Avatar Image (if selected bot has avatar) - transparent PNG support -->
        <img
          v-if="selectedBot?.avatar"
          :src="selectedBot.avatar"
          :alt="selectedBot.name"
          class="w-full h-full object-contain"
        />
        <!-- Default Character Face (if no avatar) -->
        <div v-else class="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shadow-lg ring-4 ring-purple-300 ring-opacity-50">
          <div class="relative w-12 h-12">
            <!-- Face base -->
            <div class="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full" />

            <!-- Eyes -->
            <div class="absolute top-3 left-2 w-2 h-2 bg-gray-800 rounded-full"
              :class="{ 'animate-blink': !isTyping }"
            />
            <div class="absolute top-3 right-2 w-2 h-2 bg-gray-800 rounded-full"
              :class="{ 'animate-blink': !isTyping }"
            />

            <!-- Blush -->
            <div class="absolute top-5 left-0.5 w-2.5 h-1.5 bg-pink-300 rounded-full opacity-60" />
            <div class="absolute top-5 right-0.5 w-2.5 h-1.5 bg-pink-300 rounded-full opacity-60" />

            <!-- Mouth - changes based on emotion -->
            <div
              class="absolute bottom-2 left-1/2 transform -translate-x-1/2"
              :class="mouthClass"
            />

            <!-- Stethoscope/Doctor element -->
            <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-purple-400 rounded-full" />
          </div>
        </div>
      </div>
      </div>

      <!-- Enable/Disable Bot Toggle - Show at bottom on hover -->
      <div
        class="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
      >
        <button
          @click="toggleBot"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200"
          :title="isBotEnabled ? 'ปิดบอท' : 'เปิดบอท'"
        >
          <div class="relative w-9 h-5 rounded-full transition-colors"
            :class="isBotEnabled ? 'bg-green-500' : 'bg-gray-300'"
          >
            <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
              :class="isBotEnabled ? 'translate-x-4' : 'translate-x-0'"
            />
          </div>
          <span class="text-sm font-medium"
            :class="isBotEnabled ? 'text-green-600' : 'text-gray-400'"
          >
            {{ isBotEnabled ? 'ON' : 'OFF' }}
          </span>
        </button>
      </div>
    </div>

    <!-- Bot Skin Selector Modal -->
    <Transition name="fade">
      <div
        v-if="showSkinSelector"
        class="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
        @click.self="showSkinSelector = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-sm max-h-[70vh] overflow-hidden shadow-xl">
          <!-- Header -->
          <div class="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-medium text-gray-900">เลือกเพื่อน AI ของคุณ</h3>
            <button @click="showSkinSelector = false" class="p-1 text-gray-400 hover:text-gray-600">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <!-- Bot List -->
          <div class="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
            <div v-if="loadingBots" class="text-center py-8">
              <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin text-purple-500 mx-auto" />
              <p class="text-sm text-gray-500 mt-2">กำลังโหลด...</p>
            </div>

            <template v-else-if="botList.length > 0">
              <button
                v-for="bot in botList"
                :key="bot.id"
                @click="selectBot(bot)"
                class="w-full p-3 rounded-xl border-2 transition-all flex items-center gap-3 text-left"
                :class="selectedBot?.id === bot.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'"
              >
                <!-- Bot Avatar -->
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    v-if="bot.avatar"
                    :src="bot.avatar"
                    :alt="bot.name"
                    class="w-full h-full object-cover"
                  />
                  <Icon v-else name="lucide:bot" class="w-6 h-6 text-purple-400" />
                </div>

                <!-- Bot Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-900">{{ bot.name }}</span>
                    <span v-if="bot.isDefault" class="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">Default</span>
                  </div>
                  <p class="text-xs text-gray-500 truncate">{{ bot.description || 'AI เพื่อนที่เข้าใจคุณ' }}</p>
                </div>

                <!-- Selected indicator -->
                <div v-if="selectedBot?.id === bot.id" class="flex-shrink-0">
                  <Icon name="lucide:check-circle" class="w-5 h-5 text-purple-500" />
                </div>
              </button>
            </template>

            <div v-else class="text-center py-8 text-gray-500">
              <Icon name="lucide:bot" class="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p class="text-sm">ยังไม่มี Bot ที่พร้อมใช้งาน</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-gray-100 bg-gray-50">
            <p class="text-xs text-center text-gray-500">
              เลือก AI ที่คุณอยากคุยด้วย
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useActiveListener } from '~/composables/useActiveListener'
import { useAuth } from '~/composables/useAuth'

const props = defineProps<{
  editorContent?: string
}>()

const { user } = useAuth()

const {
  currentResponse,
  isListening,
  characterMood,
  isTyping,
  showBubble,
  startListening,
  analyzeText,
  triggerIdleResponse,
  setBotId
} = useActiveListener()

// Bot selection state
interface BotInfo {
  id: string
  name: string
  description: string
  avatar: string | null
  greeting: string
  isDefault: boolean
}

const showSkinSelector = ref(false)
const loadingBots = ref(false)
const botList = ref<BotInfo[]>([])
const selectedBot = ref<BotInfo | null>(null)

// Bot enabled/disabled state
const isBotEnabled = ref(true)

// Toggle bot on/off
const toggleBot = () => {
  isBotEnabled.value = !isBotEnabled.value

  // Save to localStorage
  if (import.meta.client) {
    localStorage.setItem('botEnabled', isBotEnabled.value ? '1' : '0')
  }

  // Hide bubble when disabled
  if (!isBotEnabled.value && showBubble.value) {
    showBubble.value = false
  }
}

// Load bot enabled state from localStorage
const loadBotEnabledState = () => {
  if (import.meta.client) {
    const saved = localStorage.getItem('botEnabled')
    isBotEnabled.value = saved !== '0' // Default to enabled
  }
}

// Load bot list from API
const loadBotList = async () => {
  loadingBots.value = true
  try {
    const response = await $fetch<{ bots: BotInfo[] }>('/api/bot/list')
    botList.value = response.bots

    // Select default bot if not already selected
    if (!selectedBot.value && botList.value.length > 0) {
      const defaultBot = botList.value.find(b => b.isDefault) || botList.value[0]
      selectedBot.value = defaultBot
      // Update the active listener with default bot
      setBotId(defaultBot.id)
    }
  } catch (err) {
    console.error('Error loading bot list:', err)
  } finally {
    loadingBots.value = false
  }
}

// Select a bot
const selectBot = async (bot: BotInfo) => {
  selectedBot.value = bot
  showSkinSelector.value = false

  // Update the active listener with new bot ID
  setBotId(bot.id)

  // Save to database if user is logged in
  await saveBotSelectionToDatabase(bot.id)
}

// Save bot selection to database
const saveBotSelectionToDatabase = async (botId: string) => {
  // Use user ID if logged in, otherwise use a device ID from localStorage
  const userId = user.value?.uid || getDeviceId()

  try {
    await $fetch('/api/user/bot-preference', {
      method: 'POST',
      body: { userId, botId }
    })
    console.log('[AICompanion] Bot preference saved to database:', botId)
  } catch (err) {
    console.error('[AICompanion] Error saving bot preference:', err)
  }
}

// Get or create a device ID for anonymous users
const getDeviceId = (): string => {
  if (!import.meta.client) return 'anonymous'

  let deviceId = localStorage.getItem('deviceId')
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(2, 15)
    localStorage.setItem('deviceId', deviceId)
  }
  return deviceId
}

// Load saved bot selection from database
const loadSavedBotSelection = async () => {
  const userId = user.value?.uid || getDeviceId()

  try {
    const response = await $fetch<{ botId: string | null }>('/api/user/bot-preference', {
      method: 'GET',
      query: { userId }
    })

    if (response.botId && botList.value.length > 0) {
      const savedBot = botList.value.find(b => b.id === response.botId)
      if (savedBot) {
        selectedBot.value = savedBot
        // Also update the active listener
        setBotId(savedBot.id)
        console.log('[AICompanion] Loaded bot preference from database:', savedBot.name)
      }
    }
  } catch (err) {
    console.error('[AICompanion] Error loading bot preference:', err)
  }
}

// Watch for modal open to load bots
watch(showSkinSelector, async (isOpen) => {
  if (isOpen && botList.value.length === 0) {
    await loadBotList()
  }
})

// Watch editor content and analyze automatically
watch(() => props.editorContent, (newContent, oldContent) => {
  // Don't analyze if bot is disabled
  if (!isBotEnabled.value) {
    return
  }

  console.log('[AICompanion] Content changed:', newContent?.substring(0, 30), 'isListening:', isListening.value)
  // Always try to analyze - the analyzeText function will check isListening internally
  if (newContent !== oldContent) {
    analyzeText(newContent || '')
  }
})

// Computed states
const isIdle = computed(() => characterMood.value === 'idle' && isListening.value)

// Mouth expression based on emotion
const mouthClass = computed(() => {
  const emotion = currentResponse.value?.emotion || 'neutral'

  switch (emotion) {
    case 'happy':
      return 'w-3 h-1.5 border-2 border-gray-800 border-t-0 rounded-b-full' // smile
    case 'caring':
      return 'w-2 h-2 bg-pink-400 rounded-full' // small heart-shaped
    case 'thinking':
      return 'w-2 h-0.5 bg-gray-800 rounded-full' // neutral line
    case 'encouraging':
      return 'w-3 h-2 border-2 border-gray-800 border-t-0 rounded-b-full' // big smile
    default:
      return 'w-2 h-1 border border-gray-800 border-t-0 rounded-b-full' // slight smile
  }
})

// Idle animation timer
let idleTimer: NodeJS.Timeout | null = null

onMounted(async () => {
  // Load bot enabled state from localStorage
  loadBotEnabledState()

  // Start listening automatically
  startListening()

  // Load bot list first
  await loadBotList()
  // Then load saved selection from database (will override default if found)
  await loadSavedBotSelection()

  // Trigger idle responses periodically
  idleTimer = setInterval(() => {
    if (isListening.value && !showBubble.value && !isTyping.value) {
      // Random chance to show idle message
      if (Math.random() > 0.7) {
        triggerIdleResponse()
      }
    }
  }, 30000) // Every 30 seconds
})

onUnmounted(() => {
  if (idleTimer) clearInterval(idleTimer)
})
</script>

<style scoped>
/* Bubble animation */
.bubble-enter-active {
  animation: bubble-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bubble-leave-active {
  animation: bubble-out 0.2s ease-out;
}

@keyframes bubble-in {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes bubble-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8) translateY(5px);
  }
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Gentle bounce animation */
@keyframes bounce-gentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce-gentle {
  animation: bounce-gentle 3s ease-in-out infinite;
}

/* Blink animation for eyes */
@keyframes blink {
  0%, 90%, 100% {
    transform: scaleY(1);
  }
  95% {
    transform: scaleY(0.1);
  }
}

.animate-blink {
  animation: blink 4s ease-in-out infinite;
}
</style>
