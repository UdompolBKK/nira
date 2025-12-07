<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="mx-auto max-w-full px-4 py-12 md:px-8">
      <div class="grid gap-8 md:grid-cols-4">
        <!-- Brand -->
        <div>
          <div class="mb-4 flex items-center gap-2 text-lg font-bold text-white">
            <span class="text-xl">📔</span>
            บันทึกนิรนาม
          </div>
          <p class="text-sm text-gray-400">
            พื้นที่ปลอดภัยเพื่อแบ่งปันความคิดและความรู้สึก
          </p>
        </div>

        <!-- Links -->
        <div>
          <h4 class="mb-4 font-semibold text-white">ลิงก์</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink to="/" class="hover:text-white">หน้าแรก</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/browse" class="hover:text-white">อ่านบันทึก</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="hover:text-white">เกี่ยวกับเรา</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="mb-4 font-semibold text-white">สนับสนุน</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="mailto:support@anonymous-diary.app" class="hover:text-white">ติดต่อเรา</a>
            </li>
            <li>
              <NuxtLink to="/privacy" class="hover:text-white">นโยบายความเป็นส่วนตัว</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/terms" class="hover:text-white">เงื่อนไขการใช้บริการ</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Social -->
        <div>
          <h4 class="mb-4 font-semibold text-white">ติดตามเรา</h4>
          <div class="flex gap-4">
            <a href="#" class="hover:text-white">Twitter</a>
            <a href="#" class="hover:text-white">Facebook</a>
            <a href="#" class="hover:text-white">Instagram</a>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
        <p>&copy; 2025 บันทึกนิรนาม. สงวนลิขสิทธิ์</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component
</script>
