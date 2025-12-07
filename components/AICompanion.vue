<template>
  <div class="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
    <!-- Speech Bubble - Always show when there's a message -->
    <Transition name="bubble">
      <div
        v-if="showBubble && currentResponse"
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
    <div
      class="relative"
      :class="{ 'animate-bounce-gentle': isIdle }"
    >
      <!-- Listening indicator (typing) -->
      <Transition name="fade">
        <div
          v-if="isTyping"
          class="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse z-10"
        />
      </Transition>

      <!-- Character Avatar -->
      <div
        class="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shadow-lg overflow-hidden ring-4 ring-purple-300 ring-opacity-50"
        :class="{
          'ring-green-300': isTyping
        }"
      >
        <!-- Character Face -->
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
</template>

<script setup lang="ts">
import { useActiveListener } from '~/composables/useActiveListener'

const props = defineProps<{
  editorContent?: string
}>()

const {
  currentResponse,
  isListening,
  characterMood,
  isTyping,
  showBubble,
  startListening,
  analyzeText,
  triggerIdleResponse
} = useActiveListener()

// Watch editor content and analyze automatically
watch(() => props.editorContent, (newContent, oldContent) => {
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

onMounted(() => {
  // Start listening automatically
  startListening()

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
