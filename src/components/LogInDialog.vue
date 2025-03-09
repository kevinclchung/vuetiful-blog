<template>
  <v-dialog
    max-width="300"
    scrollable
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        class="mr-4"
        icon="mdi-login"
        size="small"
        variant="tonal"
      />
    </template>
    <template #default="{ isActive }">
      <v-card>
        <template #title>
          <div class="d-flex align-center justify-space-between">
            Log In
            <v-btn
              icon="mdi-close"
              @click="isActive.value = false"
            />
          </div>
        </template>
        <template #text>
          <v-container>
            <v-row>
              This app has no auth. Just click on a user to log in.
            </v-row>
            <v-row>
              <v-list>
                <v-list-item
                  v-for="[userId, user] in store.users.entries()"
                  :key="userId"
                  :value="userId"
                  :subtitle="userId"
                  :title="user.name"
                  close-on-content-click
                  @click="logIn(user)"
                >
                  <template #prepend>
                    <v-avatar
                      :text="store.userInitials(user)"
                      :image="user.img ? `/demo-avatars/${user.img}` : ''"
                      color="secondary"
                    />
                  </template>
                </v-list-item>
              </v-list>
            </v-row>
          </v-container>
        </template>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { type UserType, useAppStore } from '@/stores/app'

  const store = useAppStore()

  function logIn(user: UserType) {
    store.loggedInUser = user
    localStorage.setItem('loggedInUser', user.username) /** Like starting a session */
  }
</script>
