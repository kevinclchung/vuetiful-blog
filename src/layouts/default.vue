<template>
  <v-main>
    <v-app-bar 
      class="justify-space-between"
      color="primary"
      :elevation="2"
    >
      <v-app-bar-title>
        <v-icon icon="mdi-notebook-multiple" />
        {{ store.blogTitle }}
      </v-app-bar-title>
      <log-in-dialog v-if="!store.loggedInUser" />
      <v-menu
        v-else
      >
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            class="mr-4"
            icon
          >
            <v-avatar
              :text="store.userInitials(store.loggedInUser)"
              :image="store.loggedInUser?.img ? `/demo-avatars/${store.loggedInUser.img}` : ''"
              color="secondary"
            />
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            title="Log Out"
            @click="logOut"
          />
        </v-list>
      </v-menu>
    </v-app-bar>
    <router-view />
    <edit-entry-form v-if="store.loggedInUser" />
  </v-main>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/stores/app'

  const store = useAppStore()

  function logOut() {
    store.loggedInUser = null
    localStorage.removeItem('loggedInUser') /** Like stopping a session */
  }
</script>
