<template>
  <div class="p-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">แดชบอร์ด</h1>
      <p class="text-gray-600 mt-2">ภาพรวมระบบ Nira</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Users -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:users" class="w-6 h-6 text-purple-600" />
          </div>
          <span class="text-xs text-green-600 font-medium">+12%</span>
        </div>
        <h3 class="text-gray-600 text-sm font-medium">ผู้ใช้ทั้งหมด</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalUsers.toLocaleString() }}</p>
      </div>

      <!-- Total Posts -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:file-text" class="w-6 h-6 text-blue-600" />
          </div>
          <span class="text-xs text-green-600 font-medium">+8%</span>
        </div>
        <h3 class="text-gray-600 text-sm font-medium">โพสต์ทั้งหมด</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalPosts.toLocaleString() }}</p>
      </div>

      <!-- AI Conversations -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:bot" class="w-6 h-6 text-green-600" />
          </div>
          <span class="text-xs text-green-600 font-medium">+24%</span>
        </div>
        <h3 class="text-gray-600 text-sm font-medium">การสนทนา AI</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalChats.toLocaleString() }}</p>
      </div>

      <!-- Premium Subscriptions -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:crown" class="w-6 h-6 text-yellow-600" />
          </div>
          <span class="text-xs text-green-600 font-medium">+15%</span>
        </div>
        <h3 class="text-gray-600 text-sm font-medium">Premium Members</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.premiumUsers.toLocaleString() }}</p>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Revenue Chart -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">รายได้รายเดือน</h3>
        <div class="h-64 flex items-center justify-center text-gray-400">
          <div class="text-center">
            <Icon name="lucide:bar-chart-3" class="w-16 h-16 mx-auto mb-2" />
            <p class="text-sm">Chart will be implemented</p>
          </div>
        </div>
      </div>

      <!-- User Growth Chart -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">การเติบโตของผู้ใช้</h3>
        <div class="h-64 flex items-center justify-center text-gray-400">
          <div class="text-center">
            <Icon name="lucide:trending-up" class="w-16 h-16 mx-auto mb-2" />
            <p class="text-sm">Chart will be implemented</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Posts -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">โพสต์ล่าสุด</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex items-start gap-3">
              <div class="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div class="flex-1">
                <p class="text-sm text-gray-900 font-medium">Anonymous User #{{ i }}</p>
                <p class="text-xs text-gray-500 mt-1">Posted {{ i * 5 }} minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Subscriptions -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Subscription ล่าสุด</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Icon name="lucide:crown" class="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p class="text-sm text-gray-900 font-medium">Premium Plan</p>
                  <p class="text-xs text-gray-500">user{{ i }}@example.com</p>
                </div>
              </div>
              <span class="text-sm font-semibold text-green-600">+79฿</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// Mock stats data - Replace with real Firestore queries
const stats = ref({
  totalUsers: 1247,
  totalPosts: 3856,
  totalChats: 12453,
  premiumUsers: 156
})

// TODO: Implement real-time data fetching from Firestore
// - Count documents in 'users' collection
// - Count documents in 'posts' collection
// - Count documents in 'botChats' collection
// - Count users where isPremium = true
</script>
