/**
 * Composable สำหรับ Lazy Load Image และ Card
 * ใช้ Intersection Observer API
 */

export const useLazyLoad = () => {
  const isVisible = ref(false)
  const elementRef = ref<HTMLElement | null>(null)

  const observer = ref<IntersectionObserver | null>(null)

  const setupObserver = () => {
    if (typeof window === 'undefined') return

    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            // หยุด observe หลังจากโหลดแล้ว
            observer.value?.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '100px', // โหลดล่วงหน้า 100px
        threshold: 0.1
      }
    )
  }

  const observe = (el: HTMLElement) => {
    if (!observer.value) {
      setupObserver()
    }
    if (el && observer.value) {
      elementRef.value = el
      observer.value.observe(el)
    }
  }

  const unobserve = () => {
    if (elementRef.value && observer.value) {
      observer.value.unobserve(elementRef.value)
    }
  }

  onUnmounted(() => {
    unobserve()
    observer.value?.disconnect()
  })

  return {
    isVisible,
    observe,
    unobserve
  }
}
