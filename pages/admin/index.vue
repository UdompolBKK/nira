<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

// Redirect to dashboard
navigateTo('/admin/dashboard')
</script>
