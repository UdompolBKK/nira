<template>
  <div class="min-h-screen bg-[#0a0a0a]">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed left-0 top-0 h-full bg-[#111111] border-r border-gray-800/50 transition-all duration-300 z-40',
        isSidebarOpen ? 'w-64' : 'w-20'
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center border-b border-gray-800/50 px-4">
        <NuxtLink to="/backend" class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
            <span class="text-xl">🐾</span>
          </div>
          <span v-if="isSidebarOpen" class="text-xl font-bold text-white">PetCanGo</span>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="py-6 px-3">
        <div class="space-y-1">
          <!-- Dashboard -->
          <NuxtLink
            to="/backend"
            class="nav-item"
            :class="{ 'active': $route.path === '/backend' }"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span v-if="isSidebarOpen" class="ml-3">Dashboard</span>
          </NuxtLink>

          <!-- Hotels -->
          <NuxtLink
            to="/backend/hotels"
            class="nav-item"
            :class="{ 'active': $route.path.startsWith('/backend/hotels') }"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <span v-if="isSidebarOpen" class="ml-3">Hotels</span>
          </NuxtLink>

          <!-- Facilities -->
          <NuxtLink
            to="/backend/facilities"
            class="nav-item"
            :class="{ 'active': $route.path.startsWith('/backend/facilities') }"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
            <span v-if="isSidebarOpen" class="ml-3">Facilities</span>
          </NuxtLink>

          <!-- Media -->
          <NuxtLink
            to="/backend/media"
            class="nav-item"
            :class="{ 'active': $route.path.startsWith('/backend/media') }"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span v-if="isSidebarOpen" class="ml-3">Media</span>
          </NuxtLink>

          <!-- Blogs -->
          <NuxtLink
            to="/backend/blogs"
            class="nav-item"
            :class="{ 'active': $route.path.startsWith('/backend/blogs') }"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
            <span v-if="isSidebarOpen" class="ml-3">Blogs</span>
          </NuxtLink>

          <!-- Reviews -->
          <NuxtLink
            to="/backend/reviews"
            class="nav-item"
            :class="{ 'active': $route.path.startsWith('/backend/reviews') }"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span v-if="isSidebarOpen" class="ml-3">Reviews</span>
          </NuxtLink>

          <!-- Contacts -->
          <NuxtLink
            to="/backend/contacts"
            class="nav-item"
            :class="{ 'active': $route.path.startsWith('/backend/contacts') }"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span v-if="isSidebarOpen" class="ml-3">Contacts</span>
          </NuxtLink>

          <!-- Users -->
          <NuxtLink
            to="/backend/users"
            class="nav-item"
            :class="{ 'active': $route.path.startsWith('/backend/users') }"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <span v-if="isSidebarOpen" class="ml-3">Users</span>
          </NuxtLink>

          <!-- Admins (Super Admin only) -->
          <NuxtLink
            v-if="isSuperAdmin"
            to="/backend/admins"
            class="nav-item"
            :class="{ 'active': $route.path.startsWith('/backend/admins') }"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span v-if="isSidebarOpen" class="ml-3">Admins</span>
          </NuxtLink>
        </div>

        <!-- Divider -->
        <div class="my-6 border-t border-gray-800/50"></div>

        <!-- Settings -->
        <div class="space-y-1">
          <NuxtLink
            to="/backend/settings"
            class="nav-item"
            :class="{ 'active': $route.path.startsWith('/backend/settings') }"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span v-if="isSidebarOpen" class="ml-3">Settings</span>
          </NuxtLink>
        </div>
      </nav>

      <!-- Toggle Button -->
      <button
        @click="toggleSidebar"
        class="absolute -right-3 top-20 bg-[#1a1a1a] hover:bg-[#252525] border border-gray-800 text-gray-400 hover:text-white rounded-full p-1.5 shadow-lg transition-all duration-200"
      >
        <svg
          :class="['w-4 h-4 transition-transform duration-200', isSidebarOpen ? '' : 'rotate-180']"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
    </aside>

    <!-- Main Content Area -->
    <div
      :class="[
        'transition-all duration-300',
        isSidebarOpen ? 'ml-64' : 'ml-20'
      ]"
    >
      <!-- Top Header -->
      <header class="h-16 bg-[#111111]/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-30">
        <div class="h-full px-6 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Search Bar -->
            <div class="relative">
              <input
                type="text"
                placeholder="Search..."
                class="bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500/50 focus:ring-1 focus:ring-gray-500/50 w-72 transition-all duration-200"
              />
              <svg class="w-5 h-5 absolute left-3 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>

            <!-- Date Range -->
            <div class="flex items-center space-x-2 text-sm text-gray-400 bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>{{ currentDateRange }}</span>
            </div>
          </div>

          <!-- Right Side -->
          <div class="flex items-center space-x-3">
            <!-- Notifications -->
            <button class="relative p-2.5 bg-[#1a1a1a] hover:bg-[#252525] border border-gray-800 rounded-xl transition-all duration-200">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span class="absolute top-2 right-2 w-2 h-2 bg-gray-500 rounded-full"></span>
            </button>

            <!-- User Menu -->
            <div class="relative">
              <button
                @click="toggleUserMenu"
                class="flex items-center space-x-3 bg-[#1a1a1a] hover:bg-[#252525] border border-gray-800 rounded-xl px-3 py-2 transition-all duration-200"
              >
                <div class="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center">
                  <span class="text-sm font-bold text-white">
                    {{ user?.email?.[0].toUpperCase() || 'A' }}
                  </span>
                </div>
                <div class="text-left hidden sm:block">
                  <p class="text-sm font-medium text-white">{{ user?.displayName || user?.email?.split('@')[0] }}</p>
                  <p class="text-xs text-gray-500">{{ isSuperAdmin ? 'Super Admin' : 'Admin' }}</p>
                </div>
                <svg class="w-4 h-4 text-gray-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- Dropdown -->
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="isUserMenuOpen"
                  class="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl py-2 overflow-hidden"
                >
                  <div class="px-4 py-3 border-b border-gray-800">
                    <p class="text-sm font-medium text-white">{{ user?.displayName || 'Admin' }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
                  </div>
                  <NuxtLink
                    to="/profile"
                    class="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] hover:text-white transition-colors"
                    @click="closeUserMenu"
                  >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    Profile
                  </NuxtLink>
                  <NuxtLink
                    to="/"
                    target="_blank"
                    class="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] hover:text-white transition-colors"
                    @click="closeUserMenu"
                  >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                    View Website
                  </NuxtLink>
                  <hr class="my-2 border-gray-800" />
                  <button
                    @click="handleLogout"
                    class="flex items-center w-full px-4 py-2.5 text-sm text-primary-400 hover:bg-primary-500/10 hover:text-primary-300 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Logout
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { user, isSuperAdmin, logout } = useAuth()

const isSidebarOpen = ref(true)
const isUserMenuOpen = ref(false)

const currentDateRange = computed(() => {
  const start = new Date()
  start.setDate(start.getDate() - 7)
  const end = new Date()

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  return `${formatDate(start)} - ${formatDate(end)}`
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const handleLogout = async () => {
  const success = await logout()
  if (success) {
    navigateTo('/login')
  }
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      isUserMenuOpen.value = false
    }
  })
})
</script>

<style scoped>
.nav-item {
  @apply flex items-center px-4 py-3 text-gray-400 hover:bg-[#1a1a1a] hover:text-white rounded-xl transition-all duration-200;
}

.nav-item.active {
  @apply bg-primary-50 text-primary-600 border border-primary-200;
}
</style>
