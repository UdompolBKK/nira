<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Top Navigation Bar -->
    <header class="bg-white shadow-sm fixed top-0 left-0 right-0 z-40 h-16">
      <div class="flex items-center justify-between h-full px-4">
        <!-- Mobile Menu Button & Logo -->
        <div class="flex items-center space-x-4">
          <button
            @click="toggleSidebar"
            class="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <NuxtLink to="/admin" class="flex items-center space-x-2">
            <img src="/nira.png" alt="Nira" class="h-8 w-auto" />
            <span class="text-xl font-bold text-gray-900">Admin</span>
          </NuxtLink>
        </div>

        <!-- User Menu -->
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
          >
            <img
              :src="user?.photoURL || '/images/default-avatar.png'"
              :alt="user?.displayName || 'Admin'"
              class="w-8 h-8 rounded-full"
            />
            <span class="hidden md:block text-sm font-medium text-gray-700">
              {{ user?.displayName || user?.email }}
            </span>
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <!-- User Dropdown -->
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
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
            >
              <NuxtLink
                to="/"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                @click="closeUserMenu"
              >
                ดูหน้าเว็บไซต์
              </NuxtLink>
              <NuxtLink
                to="/profile"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                @click="closeUserMenu"
              >
                โปรไฟล์
              </NuxtLink>
              <hr class="my-2" />
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                ออกจากระบบ
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-16 left-0 bottom-0 w-64 bg-white shadow-lg transition-transform duration-300 z-30',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <nav class="p-4 space-y-1 overflow-y-auto h-full">
        <!-- Dashboard -->
        <NuxtLink
          to="/admin"
          exact
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors text-gray-700"
          active-class="bg-purple-100 text-purple-700 font-semibold"
          @click="closeSidebar"
        >
          <Icon name="lucide:layout-dashboard" class="w-5 h-5" />
          <span>แดชบอร์ด</span>
        </NuxtLink>

        <!-- Bots Management -->
        <NuxtLink
          to="/admin/bots"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors text-gray-700"
          active-class="bg-purple-100 text-purple-700 font-semibold"
          @click="closeSidebar"
        >
          <Icon name="lucide:bot" class="w-5 h-5" />
          <span>จัดการ AI Bots</span>
        </NuxtLink>

        <!-- Posts -->
        <NuxtLink
          to="/admin/posts"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors text-gray-700"
          active-class="bg-purple-100 text-purple-700 font-semibold"
          @click="closeSidebar"
        >
          <Icon name="lucide:file-text" class="w-5 h-5" />
          <span>จัดการโพสต์</span>
        </NuxtLink>

        <!-- Users -->
        <NuxtLink
          to="/admin/users"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors text-gray-700"
          active-class="bg-purple-100 text-purple-700 font-semibold"
          @click="closeSidebar"
        >
          <Icon name="lucide:users" class="w-5 h-5" />
          <span>จัดการผู้ใช้</span>
        </NuxtLink>

        <!-- Subscriptions -->
        <NuxtLink
          to="/admin/subscriptions"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors text-gray-700"
          active-class="bg-purple-100 text-purple-700 font-semibold"
          @click="closeSidebar"
        >
          <Icon name="lucide:credit-card" class="w-5 h-5" />
          <span>Subscriptions</span>
        </NuxtLink>

        <!-- Listener Lessons -->
        <NuxtLink
          to="/admin/lessons"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors text-gray-700"
          active-class="bg-purple-100 text-purple-700 font-semibold"
          @click="closeSidebar"
        >
          <Icon name="lucide:book-open" class="w-5 h-5" />
          <span>จัดการบทเรียนนักรับฟัง</span>
        </NuxtLink>

        <!-- Articles -->
        <NuxtLink
          to="/admin/articles"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors text-gray-700"
          active-class="bg-purple-100 text-purple-700 font-semibold"
          @click="closeSidebar"
        >
          <Icon name="lucide:newspaper" class="w-5 h-5" />
          <span>จัดการบทความ</span>
        </NuxtLink>

        <!-- About -->
        <NuxtLink
          to="/admin/about"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors text-gray-700"
          active-class="bg-purple-100 text-purple-700 font-semibold"
          @click="closeSidebar"
        >
          <Icon name="lucide:info" class="w-5 h-5" />
          <span>จัดการหน้าเกี่ยวกับเรา</span>
        </NuxtLink>

        <!-- Hero Banner Images -->
        <NuxtLink
          to="/admin/hero-images"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors text-gray-700"
          active-class="bg-purple-100 text-purple-700 font-semibold"
          @click="closeSidebar"
        >
          <Icon name="lucide:image" class="w-5 h-5" />
          <span>จัดการ Hero Banner</span>
        </NuxtLink>

        <!-- Divider -->
        <div class="border-t border-gray-200 my-4"></div>

        <!-- Settings -->
        <NuxtLink
          to="/admin/settings"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors text-gray-700"
          active-class="bg-purple-100 text-purple-700 font-semibold"
          @click="closeSidebar"
        >
          <Icon name="lucide:settings" class="w-5 h-5" />
          <span>ตั้งค่า</span>
        </NuxtLink>
      </nav>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="isSidebarOpen"
      @click="closeSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
    ></div>

    <!-- Main Content -->
    <main class="lg:ml-64 mt-16 p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()

const isSidebarOpen = ref(false)
const isUserMenuOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
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
    navigateTo('/admin/login')
  }
}

// Close menus when clicking outside
onMounted(() => {
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      isUserMenuOpen.value = false
    }
  })
})
</script>
