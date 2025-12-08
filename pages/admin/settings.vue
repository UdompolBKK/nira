<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">ตั้งค่าระบบ</h1>
      <p class="text-gray-600 mt-2">จัดการการตั้งค่าต่างๆ ของระบบ</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- General Settings -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="lucide:settings" class="w-5 h-5" />
          การตั้งค่าทั่วไป
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อเว็บไซต์</label>
            <input
              v-model="settings.siteName"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nira"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">คำอธิบายเว็บไซต์</label>
            <textarea
              v-model="settings.siteDescription"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="แพลตฟอร์มบันทึกความรู้สึกนิรนาม"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">อีเมลติดต่อ</label>
            <input
              v-model="settings.contactEmail"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="contact@nira.com"
            />
          </div>
        </div>
      </div>

      <!-- Features Settings -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="lucide:toggle-left" class="w-5 h-5" />
          การตั้งค่าฟีเจอร์
        </h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">เปิดใช้งานระบบ AI Bot</p>
              <p class="text-xs text-gray-500">อนุญาตให้ผู้ใช้แชทกับ AI Companion</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="settings.enableAIBot"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">เปิดใช้งานการสมัคร Premium</p>
              <p class="text-xs text-gray-500">อนุญาตให้ผู้ใช้สมัคร Premium</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="settings.enablePremium"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">เปิดใช้งานระบบแจ้งเตือน</p>
              <p class="text-xs text-gray-500">ส่งการแจ้งเตือนให้ผู้ใช้</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="settings.enableNotifications"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">เปิดใช้งานโหมดบำรุงรักษา</p>
              <p class="text-xs text-gray-500">ปิดเว็บไซต์ชั่วคราวเพื่อบำรุงรักษา</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="settings.maintenanceMode"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Pricing Settings -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="lucide:dollar-sign" class="w-5 h-5" />
          การตั้งค่าราคา
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Premium รายเดือน (บาท)</label>
            <input
              v-model.number="settings.monthlyPrice"
              type="number"
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="79"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Premium รายปี (บาท)</label>
            <input
              v-model.number="settings.yearlyPrice"
              type="number"
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="699"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ราคาคอร์ส CBT (บาท)</label>
            <input
              v-model.number="settings.coursePrice"
              type="number"
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="499"
            />
          </div>
        </div>
      </div>

      <!-- API Settings -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="lucide:key" class="w-5 h-5" />
          API Keys
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Grok API Key</label>
            <input
              v-model="settings.grokApiKey"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="sk-..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Stripe API Key</label>
            <input
              v-model="settings.stripeApiKey"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="sk_..."
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="mt-8 flex justify-end">
      <button
        @click="saveSettings"
        :disabled="saving"
        class="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="saving" class="flex items-center gap-2">
          <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
          กำลังบันทึก...
        </span>
        <span v-else class="flex items-center gap-2">
          <Icon name="lucide:save" class="w-5 h-5" />
          บันทึกการตั้งค่า
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

useHead({
  title: 'ตั้งค่าระบบ - Admin'
})

const settings = ref({
  siteName: 'Nira',
  siteDescription: 'แพลตฟอร์มบันทึกความรู้สึกนิรนาม',
  contactEmail: 'contact@nira.com',
  enableAIBot: true,
  enablePremium: true,
  enableNotifications: true,
  maintenanceMode: false,
  monthlyPrice: 79,
  yearlyPrice: 699,
  coursePrice: 499,
  grokApiKey: '',
  stripeApiKey: ''
})

const saving = ref(false)

const saveSettings = async () => {
  saving.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // TODO: Save to Firestore or API
    alert('บันทึกการตั้งค่าสำเร็จ!')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('เกิดข้อผิดพลาดในการบันทึก')
  } finally {
    saving.value = false
  }
}
</script>
