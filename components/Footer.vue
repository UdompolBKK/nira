<template>
  <footer class="border-t border-gray-100 bg-white">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Main Footer Content -->
      <div class="grid gap-8 md:grid-cols-12">
        <!-- Brand Section (Left) -->
        <div class="md:col-span-4">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-gray-700 transition-colors">
            <span class="text-2xl">📔</span>
            บันทึกนิรนาม
          </NuxtLink>
          <p class="mt-3 text-sm text-gray-600 leading-relaxed max-w-xs">
            พื้นที่ปลอดภัยสำหรับเขียนไดอารี่และระบายความรู้สึก พร้อม AI Companion ที่เข้าใจคุณ
          </p>
        </div>

        <!-- Navigation Links (Center) -->
        <div class="md:col-span-5 grid grid-cols-2 gap-6">
          <!-- Column 1 -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-3">เมนู</h4>
            <ul class="space-y-2.5 text-sm">
              <li>
                <NuxtLink to="/" class="text-gray-600 hover:text-gray-900 transition-colors">
                  หน้าแรก
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/browse" class="text-gray-600 hover:text-gray-900 transition-colors">
                  อ่านบันทึก
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/my-story" class="text-gray-600 hover:text-gray-900 transition-colors">
                  เขียนบันทึก
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/pricing" class="text-gray-600 hover:text-gray-900 transition-colors">
                  แพ็กเกจ
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/about" class="text-gray-600 hover:text-gray-900 transition-colors">
                  เกี่ยวกับเรา
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Column 2 -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-3">ข้อมูลทางกฎหมาย</h4>
            <ul class="space-y-2.5 text-sm">
              <li>
                <NuxtLink to="/privacy" class="text-gray-600 hover:text-gray-900 transition-colors">
                  นโยบายความเป็นส่วนตัว
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/terms" class="text-gray-600 hover:text-gray-900 transition-colors">
                  เงื่อนไขการใช้งาน
                </NuxtLink>
              </li>
              <li>
                <a href="mailto:support@banthukniranam.com" class="text-gray-600 hover:text-gray-900 transition-colors">
                  ติดต่อเรา
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Social & Contact (Right) -->
        <div class="md:col-span-3">
          <h4 class="text-sm font-semibold text-gray-900 mb-3">ติดตามเรา</h4>
          <div class="flex gap-3">
            <a
              href="https://facebook.com/banthukniranam"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all"
              aria-label="Facebook"
            >
              <Icon name="lucide:facebook" class="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com/banthukniranam"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all"
              aria-label="Twitter"
            >
              <Icon name="lucide:twitter" class="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com/banthukniranam"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all"
              aria-label="Instagram"
            >
              <Icon name="lucide:instagram" class="w-4 h-4" />
            </a>
          </div>
          <p class="mt-4 text-xs text-gray-500">
            ช่องทางการติดต่อ:<br>
            <a href="mailto:support@banthukniranam.com" class="hover:text-gray-900 transition-colors">
              support@banthukniranam.com
            </a>
          </p>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 pt-6 border-t border-gray-100">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p class="text-xs text-gray-500">
            © 2025 บันทึกนิรนาม. สงวนลิขสิทธิ์
          </p>
          <div class="flex items-center gap-4 text-xs text-gray-500">
            <span>Made with ❤️ in Thailand</span>
            <span>•</span>
            <NuxtLink to="/privacy" class="hover:text-gray-900 transition-colors">
              PDPA Compliant
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Modern minimal footer with clean design
</script>
