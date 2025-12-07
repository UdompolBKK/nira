export default defineNuxtRouteMiddleware((to, from) => {
  const { user, isAuthenticated, isSuperAdmin, loading } = useAuth()

  // Wait for auth to initialize
  if (loading.value) {
    return
  }

  // Check if user is authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  // Check if user is Super Admin
  if (!isSuperAdmin.value) {
    // ถ้าไม่ใช่ Super Admin ให้ redirect กลับหน้า backend
    return navigateTo('/backend')
  }
})
