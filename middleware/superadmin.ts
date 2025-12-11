export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client-side
  if (import.meta.server) return

  const { user, isAuthenticated, isSuperAdmin, loading } = useAuth()

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

  // Check if user is Super Admin
  if (!isSuperAdmin.value) {
    // ถ้าไม่ใช่ Super Admin ให้ redirect กลับหน้าแรก
    return navigateTo('/')
  }
})
