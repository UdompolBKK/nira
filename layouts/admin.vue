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
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          active-class="bg-gray-100 text-gray-700"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="font-medium">แดชบอร์ด</span>
        </NuxtLink>

        <!-- Hotels -->
        <NuxtLink
          to="/admin/hotels"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          active-class="bg-gray-100 text-gray-700"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <span class="font-medium">จัดการที่พัก</span>
        </NuxtLink>

        <!-- Provinces -->
        <NuxtLink
          to="/admin/provinces"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          active-class="bg-gray-100 text-gray-700"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
          </svg>
          <span class="font-medium">จัดการจังหวัด</span>
        </NuxtLink>

        <!-- Blogs -->
        <NuxtLink
          to="/admin/blogs"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          active-class="bg-gray-100 text-gray-700"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
          </svg>
          <span class="font-medium">จัดการบทความ</span>
        </NuxtLink>

        <!-- Facilities -->
        <NuxtLink
          to="/admin/facilities"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          active-class="bg-gray-100 text-gray-700"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
          </svg>
          <span class="font-medium">สิ่งอำนวยความสะดวก</span>
        </NuxtLink>

        <!-- Features/Tags -->
        <NuxtLink
          to="/admin/features"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          active-class="bg-gray-100 text-gray-700"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </svg>
          <span class="font-medium">สถานที่ท่องเที่ยว</span>
        </NuxtLink>

        <!-- Users -->
        <NuxtLink
          to="/admin/users"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          active-class="bg-gray-100 text-gray-700"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <span class="font-medium">จัดการผู้ใช้</span>
        </NuxtLink>

        <!-- Reviews -->
        <NuxtLink
          to="/admin/reviews"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          active-class="bg-gray-100 text-gray-700"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
          <span class="font-medium">รีวิวที่พัก</span>
        </NuxtLink>

        <!-- Form Data -->
        <NuxtLink
          to="/admin/form-data"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          active-class="bg-gray-100 text-gray-700"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span class="font-medium">ข้อมูลติดต่อ</span>
        </NuxtLink>

        <!-- Settings -->
        <NuxtLink
          to="/admin/settings"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          active-class="bg-gray-100 text-gray-700"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span class="font-medium">ตั้งค่า</span>
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
