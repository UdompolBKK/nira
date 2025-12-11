export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client-side
  if (import.meta.server) return

  // Pages that don't require email verification
  const publicPages = ['/login', '/signup', '/verify-email', '/terms', '/privacy', '/about', '/']
  const isPublicPage = publicPages.includes(to.path) || to.path.startsWith('/api/')

  // Skip for public pages
  if (isPublicPage) return

  const { user, loading } = useAuth()
  const { isEmailVerified, profileLoading } = useUserProfile()

  // Wait for auth to initialize (with timeout)
  if (loading.value) {
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        resolve()
      }, 5000)

      const unwatch = watch(loading, (newValue) => {
        if (!newValue) {
          clearTimeout(timeout)
          unwatch()
          resolve()
        }
      }, { immediate: true })
    })
  }

  // If not logged in, let other middleware handle it
  if (!user.value) return

  // Wait for profile to load (with timeout)
  if (profileLoading.value) {
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        resolve()
      }, 3000)

      const unwatch = watch(profileLoading, (newValue) => {
        if (!newValue) {
          clearTimeout(timeout)
          unwatch()
          resolve()
        }
      }, { immediate: true })
    })
  }

  // Check if user is Google user (always verified)
  const isGoogleUser = user.value.providerData?.some(p => p.providerId === 'google.com')

  // If email is not verified and not a Google user, redirect to verify-email
  if (!isGoogleUser && !isEmailVerified.value) {
    return navigateTo('/verify-email')
  }
})
