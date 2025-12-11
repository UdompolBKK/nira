export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client-side
  if (import.meta.server) return

  const { user, loading } = useAuth()
  const { userProfile, profileLoading } = useUserProfile()

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

  // Check if user is authenticated - redirect to login if not
  if (!user.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  // Note: Email verification is handled by email-verify.global.ts middleware

  // Wait for profile to load (with timeout)
  if (profileLoading.value) {
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        resolve()
      }, 3000) // 3 seconds timeout

      const unwatch = watch(profileLoading, (newValue) => {
        if (!newValue) {
          clearTimeout(timeout)
          unwatch()
          resolve()
        }
      }, { immediate: true })
    })
  }

  // Skip profile check if already on account page
  if (to.path === '/account') return

  // Check if user has set up their anonymous profile (using already loaded userProfile)
  if (userProfile.value) {
    // If displayName is not set, redirect to account page
    if (!userProfile.value.displayName || !userProfile.value.displayName.trim()) {
      return navigateTo('/account?setup=required')
    }
  } else {
    // No profile document exists, redirect to setup
    return navigateTo('/account?setup=required')
  }
})
