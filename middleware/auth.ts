export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client-side
  if (import.meta.server) return

  const { user, loading } = useAuth()

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

  // Skip profile check if already on account page
  if (to.path === '/account') return

  // Check if user has set up their anonymous profile
  const { firestore } = useFirebase()

  try {
    const { doc, getDoc } = await import('firebase/firestore')
    const userDoc = await getDoc(doc(firestore, 'users', user.value.uid))

    if (userDoc.exists()) {
      const data = userDoc.data()
      // If displayName is not set, redirect to account page
      if (!data.displayName || !data.displayName.trim()) {
        return navigateTo('/account?setup=required')
      }
    } else {
      // No profile document exists, redirect to setup
      return navigateTo('/account?setup=required')
    }
  } catch (err) {
    console.error('Error checking profile:', err)
  }
})
