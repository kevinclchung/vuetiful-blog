<template>
  <v-container
    class="d-flex align-center justify-center fill-height"
  >
    <v-card max-width="500">
      <v-card-text>
        <v-container>
          <v-row class="justify-center mb-4">
            <v-icon
              icon="mdi-alert"
              size="x-large"
            />
          </v-row>
          <v-row class="justify-center text-h6">
            No entries to show.
          </v-row>
          <v-container
            v-if="!store.loggedInUser" 
            class="mt-4 text-center"
          >
            To add a blog entry, you must log in first.
            Use the Log In button at the top right.
            <v-icon icon="mdi-login" />
          </v-container>
          <v-container
            v-else
            class="mt-4 text-center"
          >
            Add a blog entry, using the Add New button at the bottom right.
            <v-icon icon="mdi-pencil" />
          </v-container>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/stores/app'

  const store = useAppStore()
</script>
