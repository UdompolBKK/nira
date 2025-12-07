<template>
  <div class="min-h-screen bg-primary-50 px-4 py-20">
    <div class="mx-auto max-w-4xl">
      <h1 class="mb-4 text-4xl font-bold text-gray-900">ราคา</h1>
      <p class="mb-12 text-lg text-gray-600">
        เลือกแผนที่เหมาะกับคุณ
      </p>

      <div class="grid gap-8 md:grid-cols-2">
        <!-- Free Plan -->
        <div class="rounded-lg border-2 border-gray-200 bg-white p-8">
          <h2 class="mb-3 text-2xl font-bold text-gray-900">ฟรี</h2>
          <p class="mb-6 text-gray-600">เริ่มต้นทันที</p>

          <div class="mb-6">
            <div class="text-4xl font-bold text-gray-900">0฿</div>
            <p class="text-sm text-gray-600">ตลอดไป</p>
          </div>

          <button
            class="w-full rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300"
          >
            เริ่มต้นตอนนี้
          </button>

          <ul class="mt-6 space-y-3 text-gray-700">
            <li class="flex items-center">
              <span class="mr-3">✓</span> บันทึก 100 รายการ
            </li>
            <li class="flex items-center">
              <span class="mr-3">✓</span> AI Companion พื้นฐาน
            </li>
            <li class="flex items-center">
              <span class="mr-3">✓</span> ใช้งานบนอุปกรณ์เดียว
            </li>
          </ul>
        </div>

        <!-- Premium Plan -->
        <div class="rounded-lg border-4 border-gray-300 bg-white p-8 shadow-lg">
          <div class="mb-3 inline-block rounded-full bg-gray-900 px-3 py-1 text-sm font-semibold text-white">
            ยอดนิยม
          </div>
          <h2 class="mb-3 text-2xl font-bold text-gray-900">Premium</h2>
          <p class="mb-6 text-gray-600">ปลดล็อกทั้งหมด</p>

          <div class="mb-6">
            <div class="text-4xl font-bold text-gray-900">
              79<span class="text-xl">฿/เดือน</span>
            </div>
            <p class="text-sm text-gray-600">หรือ 699฿/ปี</p>
          </div>

          <button
            class="w-full rounded-lg bg-primary-700 px-6 py-3 font-semibold text-white hover:shadow-lg"
          >
            เริ่มใช้งาน Premium
          </button>

          <ul class="mt-6 space-y-3 text-gray-700">
            <li class="flex items-center">
              <span class="mr-3">✓</span> บันทึกไม่จำกัด
            </li>
            <li class="flex items-center">
              <span class="mr-3">✓</span> AI Companion ขั้นสูง
            </li>
            <li class="flex items-center">
              <span class="mr-3">✓</span> ใช้งานหลายอุปกรณ์
            </li>
            <li class="flex items-center">
              <span class="mr-3">✓</span> ดาวน์โหลด PDF
            </li>
            <li class="flex items-center">
              <span class="mr-3">✓</span> วิเคราะห์อารมณ์
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'ราคา - บันทึกนิรนาม'
})
</script>
