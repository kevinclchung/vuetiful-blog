<template>
  <no-entries-message v-if="store.entries.size === 0" />
  <entry-list v-else />
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/stores/app'
  import NoEntriesMessage from '@/components/NoEntriesMessage.vue'
  import EntryList from '@/components/EntryList.vue'

  const store = useAppStore()
</script>
