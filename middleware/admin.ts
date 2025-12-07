export default defineNuxtRouteMiddleware((to, from) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth()

  // Wait for auth to initialize
  if (loading.value) {
    return
  }

  // Check if user is authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  // Check if user is admin
  if (!isAdmin.value) {
    // ถ้าไม่ใช่ admin ให้ redirect กลับหน้าแรก
    return navigateTo('/')
  }
})
