<template>
  <Transition name="modal">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click="close"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all"
        @click.stop
      >
        <!-- Icon -->
        <div class="flex justify-center mb-6">
          <div
            class="w-20 h-20 rounded-full flex items-center justify-center animate-scale-in"
            :class="iconBgClass"
          >
            <Icon :name="defaultIcon" class="w-12 h-12 text-white" />
          </div>
        </div>

        <!-- Title -->
        <h3 class="text-2xl font-bold text-center text-gray-900 mb-3">
          {{ title }}
        </h3>

        <!-- Message -->
        <p class="text-center text-gray-600 mb-6" v-html="message"></p>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button
            v-if="showCancel"
            @click="close"
            class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            {{ cancelText }}
          </button>
          <button
            @click="confirm"
            class="py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            :class="[showCancel ? 'flex-1' : 'w-full', confirmButtonClass]"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  type?: 'success' | 'error' | 'warning' | 'info'
  icon?: string
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'success',
  icon: '',
  confirmText: 'เข้าใจแล้ว',
  cancelText: 'ยกเลิก',
  showCancel: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-gradient-to-br from-green-400 to-emerald-500'
    case 'error':
      return 'bg-gradient-to-br from-red-400 to-rose-500'
    case 'warning':
      return 'bg-gradient-to-br from-orange-400 to-amber-500'
    case 'info':
      return 'bg-gradient-to-br from-blue-400 to-indigo-500'
    default:
      return 'bg-gradient-to-br from-gray-400 to-gray-500'
  }
})

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
    case 'error':
      return 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
    case 'warning':
      return 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
    case 'info':
      return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
    default:
      return 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
  }
})

const defaultIcon = computed(() => {
  if (props.icon) return props.icon

  switch (props.type) {
    case 'success':
      return 'lucide:check'
    case 'error':
      return 'lucide:x'
    case 'warning':
      return 'lucide:alert-triangle'
    case 'info':
      return 'lucide:info'
    default:
      return 'lucide:check'
  }
})

const close = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const confirm = () => {
  emit('update:modelValue', false)
  emit('confirm')
}
</script>

<style scoped>
/* Modal Animations */
.modal-enter-active {
  transition: all 0.3s ease;
}

.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9) translateY(20px);
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.5s ease;
}
</style>
