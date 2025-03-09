<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
  import { useTheme } from 'vuetify'
  import { type UserType, blankEntry, useAppStore } from '@/stores/app'
  import demoData from '@/assets/demo-data.json'

  const theme = useTheme()
  const store = useAppStore()

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  function updateTheme() {
    theme.global.name.value = getSystemTheme()
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    updateTheme()
  })
  updateTheme()
  /** if this data was loaded from externeal sources (http observables making 
   * RESTful API calls or retriving auth sessions), this action should be done
   * synchronously. Populating this.loggedInUser depends on this.users. Populating 
   * this.entries depends on entryList.
   */
  store.users = new Map<string, UserType>(demoData.users.map((user) =>
    [ user.username, user ]
  ))
  const loggedInUser = localStorage.getItem('loggedInUser')
  const user = loggedInUser ? store.users.get(loggedInUser) : null
  store.loggedInUser = user ? user : null
  const entryListStr = localStorage.getItem('entryList')
  store.entryList = entryListStr ? new Set(JSON.parse(entryListStr)) : new Set()
  for (const entryId of store.entryList) {
    const entryStr = localStorage.getItem(<string>entryId)
    const entry = entryStr ? JSON.parse(entryStr) : null
    store.entries.set('entry', entry ? entry : blankEntry)
  }
</script>
