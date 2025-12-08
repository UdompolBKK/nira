<script setup lang="ts">
definePageMeta({
  middleware: 'superadmin'
})

// Redirect to dashboard
navigateTo('/admin/dashboard')
</script>
