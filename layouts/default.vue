<template>
  <div class="min-h-screen flex flex-col bg-white">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
    <!-- Cookie Consent Banner (PDPA Compliance) -->
    <CookieConsent />
  </div>
</template>

<script setup lang="ts">
// Default layout with Header and Footer
</script>
