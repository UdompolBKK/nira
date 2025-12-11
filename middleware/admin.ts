export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client-side
  if (import.meta.server) return

  const { user, isAuthenticated, isAdmin, loading } = useAuth()

  // Wait for auth to initialize (with timeout)
  if (loading.value) {
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        resolve()
      }, 5000) // 5 seconds timeout

      const unwatch = watch(loading, (newValue) => {
        if (!newValue) {
          clearTimeout(timeout)
          unwatch()
          resolve()
        }
      }, { immediate: true })
    })
  }

  // Check if user is authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/')
  }

  // Check if user is admin (includes super-admin)
  if (!isAdmin.value) {
    // ถ้าไม่ใช่ admin ให้ redirect กลับหน้าแรก
    return navigateTo('/')
  }
})
