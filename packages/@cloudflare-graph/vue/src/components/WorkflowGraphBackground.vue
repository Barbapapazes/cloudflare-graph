<script lang="ts" setup>
defineProps<{
  patternId: string
}>()
</script>

<template>
  <div class="absolute inset-0 text-neutral-300 dark:text-neutral-800" aria-hidden="true">
    <svg width="100%" height="100%">
      <defs>
        <pattern :id="patternId" viewBox="-8 -8 16 16" patternUnits="userSpaceOnUse" width="16" height="16">
          <circle cx="0" cy="0" r="1" fill="currentColor" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" :fill="`url(#${patternId})`" />
    </svg>
  </div>
</template>
