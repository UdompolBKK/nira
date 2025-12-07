<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
        <button
          @click="router.back()"
          class="p-2 -ml-2 text-gray-600 hover:text-gray-900"
        >
          <Icon name="lucide:arrow-left" class="w-6 h-6" />
        </button>

        <!-- Bot Selector -->
        <button
          @click="showSkinSelector = true"
          class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <span class="text-lg">{{ currentBotInfo.emoji }}</span>
          <span class="text-sm font-medium text-gray-700">{{ currentBotInfo.name }}</span>
          <Icon name="lucide:chevron-down" class="w-4 h-4 text-gray-500" />
        </button>

        <button
          @click="showMenu = !showMenu"
          class="p-2 -mr-2 text-gray-600 hover:text-gray-900"
        >
          <Icon name="lucide:more-vertical" class="w-6 h-6" />
        </button>
      </div>

      <!-- Menu Dropdown -->
      <Transition name="fade">
        <div
          v-if="showMenu"
          class="absolute right-4 top-14 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[150px] z-50"
        >
          <button
            @click="handleClearChat"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            ล้างประวัติแชท
          </button>
          <NuxtLink
            to="/chat/history"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            @click="showMenu = false"
          >
            ประวัติแชท
          </NuxtLink>
        </div>
      </Transition>
    </header>

    <!-- Chat Messages -->
    <main ref="chatContainer" class="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full">
      <!-- Empty State -->
      <div v-if="messages.length === 0 && !loading" class="flex flex-col items-center justify-center h-full text-center py-12">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <span class="text-4xl">{{ currentBotInfo.emoji }}</span>
        </div>
        <h2 class="text-lg font-medium text-gray-900 mb-2">{{ currentBotInfo.name }}</h2>
        <p class="text-gray-500 text-sm mb-6 max-w-xs">{{ currentBotInfo.description }}</p>

        <!-- Quick Prompts -->
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="prompt in quickPrompts"
            :key="prompt"
            @click="sendQuickPrompt(prompt)"
            class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            {{ prompt }}
          </button>
        </div>
      </div>

      <!-- Messages -->
      <TransitionGroup name="message" tag="div" class="space-y-4">
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex"
          :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <!-- Bot Avatar -->
          <div
            v-if="message.role === 'assistant'"
            class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 flex-shrink-0"
          >
            <span class="text-sm">{{ currentBotInfo.emoji }}</span>
          </div>

          <!-- Message Bubble -->
          <div
            class="max-w-[80%] px-4 py-3 rounded-2xl"
            :class="[
              message.role === 'user'
                ? 'bg-gray-900 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-900 rounded-bl-md'
            ]"
          >
            <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.content }}</p>
            <p
              class="text-xs mt-1 opacity-60"
              :class="message.role === 'user' ? 'text-right' : 'text-left'"
            >
              {{ formatTime(message.createdAt) }}
            </p>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="loading" key="typing" class="flex justify-start">
          <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
            <span class="text-sm">{{ currentBotInfo.emoji }}</span>
          </div>
          <div class="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
            <div class="flex gap-1">
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms" />
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms" />
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms" />
            </div>
          </div>
        </div>
      </TransitionGroup>
    </main>

    <!-- Risk Warning -->
    <Transition name="slide-up">
      <div
        v-if="shouldShowTherapyUpsell"
        class="bg-gray-900 text-white px-4 py-3 text-center"
      >
        <p class="text-sm mb-2">เราห่วงใยคุณ หากต้องการพูดคุยกับผู้เชี่ยวชาญ</p>
        <button
          @click="showTherapyModal = true"
          class="px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-full"
        >
          ปรึกษานักจิตวิทยา
        </button>
      </div>
    </Transition>

    <!-- Input Area -->
    <div class="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3">
      <div class="max-w-2xl mx-auto flex items-end gap-2">
        <div class="flex-1 relative">
          <textarea
            ref="inputRef"
            v-model="inputMessage"
            @keydown="handleKeydown"
            placeholder="พิมพ์ข้อความ..."
            rows="1"
            class="w-full px-4 py-3 pr-12 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
            :class="{ 'opacity-50': loading }"
            :disabled="loading"
          />
        </div>
        <button
          @click="handleSend"
          :disabled="!canSend || loading"
          class="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          <Icon v-if="loading" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
          <Icon v-else name="lucide:send" class="w-5 h-5" />
        </button>
      </div>
      <p class="text-xs text-gray-400 text-center mt-2">
        AI อาจให้คำตอบไม่ถูกต้อง กรุณาปรึกษาผู้เชี่ยวชาญสำหรับปัญหาสุขภาพจิต
      </p>
    </div>

    <!-- Skin Selector Modal -->
    <Transition name="fade">
      <div
        v-if="showSkinSelector"
        class="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
        @click.self="showSkinSelector = false"
      >
        <Transition name="slide-up">
          <div
            v-if="showSkinSelector"
            class="bg-white w-full max-w-lg rounded-t-3xl p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-gray-900">เลือกตัวละคร</h3>
              <button
                @click="showSkinSelector = false"
                class="p-2 text-gray-500 hover:text-gray-700"
              >
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="(skin, key) in BOT_SKINS"
                :key="key"
                @click="selectSkin(key as BotSkin)"
                class="p-4 rounded-2xl border-2 transition-all text-left"
                :class="[
                  currentSkin === key
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <span class="text-3xl mb-2 block">{{ skin.emoji }}</span>
                <p class="font-medium text-gray-900">{{ skin.name }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ skin.description }}</p>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Therapy Modal -->
    <Transition name="fade">
      <div
        v-if="showTherapyModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="showTherapyModal = false"
      >
        <div class="bg-white w-full max-w-md rounded-2xl p-6 text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="lucide:heart-handshake" class="w-8 h-8 text-gray-600" />
          </div>
          <h3 class="text-xl font-medium text-gray-900 mb-2">คุณไม่ได้อยู่คนเดียว</h3>
          <p class="text-gray-500 text-sm mb-6">
            การพูดคุยกับผู้เชี่ยวชาญด้านสุขภาพจิตสามารถช่วยได้ เราพร้อมเชื่อมต่อคุณกับนักจิตวิทยาที่ได้รับการรับรอง
          </p>

          <div class="space-y-3">
            <a
              href="tel:1323"
              class="block w-full py-3 bg-gray-900 text-white font-medium rounded-xl"
            >
              โทรสายด่วนสุขภาพจิต 1323
            </a>
            <button
              @click="showTherapyModal = false"
              class="w-full py-3 text-gray-600 font-medium"
            >
              ไว้ทีหลัง
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { BOT_SKINS, type BotSkin } from '~/composables/useAIBot'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'แชทกับ AI - Nira'
})

const router = useRouter()
const {
  messages,
  loading,
  currentSkin,
  shouldShowTherapyUpsell,
  initChat,
  sendMessage,
  changeSkin,
  clearChat
} = useAIBot()

const inputMessage = ref('')
const showSkinSelector = ref(false)
const showTherapyModal = ref(false)
const showMenu = ref(false)
const chatContainer = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)

// Current bot info
const currentBotInfo = computed(() => BOT_SKINS[currentSkin.value])

// Can send message
const canSend = computed(() => inputMessage.value.trim().length > 0)

// Quick prompts
const quickPrompts = [
  'วันนี้รู้สึกเครียด',
  'อยากระบาย',
  'ช่วยให้กำลังใจหน่อย',
  'ไม่รู้จะทำยังไงดี'
]

// Initialize chat on mount
onMounted(async () => {
  await initChat()
  scrollToBottom()
})

// Handle send message
const handleSend = async () => {
  if (!canSend.value || loading.value) return

  const message = inputMessage.value.trim()
  inputMessage.value = ''

  await sendMessage(message)
  scrollToBottom()
}

// Handle quick prompt
const sendQuickPrompt = async (prompt: string) => {
  inputMessage.value = prompt
  await handleSend()
}

// Handle keyboard
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

// Select skin
const selectSkin = async (skin: BotSkin) => {
  showSkinSelector.value = false
  await changeSkin(skin)
  scrollToBottom()
}

// Clear chat
const handleClearChat = () => {
  if (confirm('ต้องการล้างประวัติแชท?')) {
    clearChat()
    initChat()
    showMenu.value = false
  }
}

// Scroll to bottom
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// Format time
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Watch messages for auto-scroll
watch(messages, () => {
  scrollToBottom()
}, { deep: true })

// Close menu on click outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (showMenu.value) {
      showMenu.value = false
    }
  })
})
</script>

<style scoped>
textarea {
  max-height: 120px;
  overflow-y: auto;
}

/* Message animation */
.message-enter-active {
  animation: message-in 0.3s ease-out;
}

.message-leave-active {
  animation: message-out 0.2s ease-out;
}

@keyframes message-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes message-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide up */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
