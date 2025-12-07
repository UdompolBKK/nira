<template>
  <button
    @click="handleClick"
    class="flex items-center gap-1.5 px-3 py-2 rounded-full border transition-all"
    :class="[
      isActive
        ? 'bg-gray-900 text-white border-gray-900'
        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
    ]"
    :disabled="loading"
  >
    <span class="text-lg">{{ emoji }}</span>
    <span class="text-sm font-medium">{{ count }}</span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: 'like' | 'sad' | 'happy'
  count: number
  isActive: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const emoji = computed(() => {
  const emojis = {
    like: '❤️',
    sad: '😢',
    happy: '😊'
  }
  return emojis[props.type]
})

const handleClick = () => {
  emit('click')
}
</script>
