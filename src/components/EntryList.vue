<template>
  <v-container class="d-flex justify-center flex-column align-center">
    <v-card
      v-for="(entry, entryIndex) in store.sortedEntries"
      :key="entryIndex"
      class="pa-2 mt-4 mx-4"
      width="100%"
      max-width="900"
    >
      <v-card-title>
        {{ entry.title }}
      </v-card-title>
      <v-card-subtitle>
        <v-row
          class="justify-space-between"
          :class="!smAndUp ? 'flex-column' : ''"
          :no-gutters="!smAndUp"
        >
          <v-col>
            <v-avatar
              :text="store.userInitials(getUser(entry.author))"
              :image="getUser(entry.author)?.img ? `/demo-avatars/${getUser(entry.author)?.img}` : ''"
              color="secondary"
              size="small"
            />
            {{ getUser(entry.author)?.name }}
          </v-col>
          <v-col :class="smAndUp ? 'text-right' : ''">
            {{ date.format(entry.date, 'fullDateWithWeekday') }}
          </v-col>
        </v-row>
      </v-card-subtitle>
      <v-card-text>
        {{ entry.text }}
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn
          icon="mdi-pencil"
          @click="editEntry(entry.id)"
        />
        <v-btn
          icon="mdi-delete"
          color="red"
          @click="deleteEntry(entry.id)"
        />
      </v-card-actions>
    </v-card>
  </v-container>
  <v-dialog
    v-model="showConfirmDeleteAlert"
    width="400"
  >
    <v-alert 
      type="warning"
      title="Delete Entry"
    >
      <template #text>
        <v-row>
          <v-col>
            This is not undoable.
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-end">
            <v-btn
              text="Cancel"
              @click="showConfirmDeleteAlert = false"
            />
            <v-btn
              class="ml-4"
              text="Delete"
              @click="confirmDelete(entryToDeleteId)"
            />
          </v-col>
        </v-row>
      </template>
    </v-alert>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { useDate, useDisplay } from 'vuetify'
  import { useAppStore } from '@/stores/app'

  const store = useAppStore()
  const date = useDate()
  const { smAndUp } = useDisplay()
  const entryToDeleteId = ref('')
  const showConfirmDeleteAlert = ref(false)

  function getUser(username: string|null) {
    const user = username ? store.users.get(username) : null
    return user ? user : null
  }
  function editEntry(id: string|null) {
    if (id) {
      store.openEditEntrySheet(id)
    }
  }
  function deleteEntry(id: string|null) {
    if (id) {
      entryToDeleteId.value = id
      showConfirmDeleteAlert.value = true
    }
  }
  function confirmDelete(id: string|null) {
    if (id) {
      store.entryList.delete(id)
      store.updateEntryList()
      store.entries.delete(id)
      localStorage.removeItem(id)
    }
  }
</script>
