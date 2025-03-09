<template>
  <v-bottom-sheet
    v-model="store.editEntryFormShown"
    persistent
    height="80vh"
  >
    <template #activator>
      <v-fab
        class="mt-n4 mx-4"
        absolute
        location="bottom right"
        icon
        color="primary"
        @click="store.openEditEntrySheet()"
      >
        <v-icon icon="mdi-pencil" />
        <v-tooltip
          activator="parent"
          text="Add New"
        />
      </v-fab>
    </template>
    <template #default>
      <v-card>
        <v-container max-width="900">
          <!-- If validateion is required, <v-form> would wrap around this <v-container>. -->
          <v-card-title>
            {{ store.entryToEdit.id === null ? 'New' : 'Edit' }} 
            Entry
            <v-btn
              class="float-right"
              icon="mdi-close"
              variant="tonal"
              size="small"
              @click="closeEditEntryDialog"
            />
          </v-card-title>
          <v-spacer />
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="store.entryToEdit.title"
                  label="Title"
                  variant="outlined"
                  hint="Required"
                />
              </v-col>
            </v-row>
            <v-row :class="!smAndUp ? 'flex-column' : ''">
              <v-col>
                <v-select
                  v-model="store.entryToEdit.author"
                  label="Author"
                  variant="outlined"
                  :items="store.sortedUsers()"
                  :item-props="(user) => ({
                    title: user.name,
                    subtitle: user.username,
                  })"
                  item-value="username"
                />
              </v-col>
              <v-col>
                <v-date-input
                  v-model="date"
                  label="Date"
                  variant="outlined"
                  hint="Required"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                  @update:model-value="updateDate"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-textarea
                  v-model="store.entryToEdit.text"
                  variant="outlined"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  class="mr-4"
                  icon="mdi-karate"
                  variant="tonal"
                  :loading="chuckJokeLoading"
                  @click="insertChuckJoke"
                />
              </v-col>
              <v-col class="d-flex justify-end align-center">
                <v-btn
                  class="ml-4"
                  text="Reset"
                  :disabled="!entryEdited()"
                  @click="resetEntry"
                />
                <v-btn
                  class="ml-4"
                  text="Cancel"
                  @click="closeEditEntryDialog"
                />
                <v-btn
                  class="ml-4"
                  text="Save"
                  color="primary"
                  :disabled="!entryEdited()"
                  @click="saveEntry"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-container>
      </v-card>
    </template>
  </v-bottom-sheet>
  <v-dialog
    v-model="closeWarningShown"
    width="400"
  >
    <v-alert 
      type="warning"
      title="Discard Changes?"
    >
      <template #text>
        <v-row>
          <v-col>
            Your changes will be lost. Are you sure?
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-end">
            <v-btn
              text="Cancel"
              @click="closeWarningShown = false"
            />
            <v-btn
              class="ml-4"
              text="Discard"
              @click="store.editEntryFormShown = false; closeWarningShown = false"
            />
          </v-col>
        </v-row>
      </template>
    </v-alert>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { useDate, useDisplay } from 'vuetify'
  import { type EntryType, getLocalISODate, useAppStore } from '@/stores/app'
  
  const store = useAppStore()
  const { smAndUp } = useDisplay()
  const startingEntry = ref(<EntryType>store.entryToEdit)
  const startingEntryDate = useDate().parseISO(startingEntry.value.date)
  const date = ref(startingEntryDate)
  const closeWarningShown = ref(false)
  const chuckJokeLoading = ref(false)

  async function insertChuckJoke() {
    chuckJokeLoading.value = true
    const jokeFetch = await fetch('https://api.chucknorris.io/jokes/random')
    if (jokeFetch.ok) {
      const joke = await jokeFetch.json()
      store.entryToEdit.text = joke.value
    }
    chuckJokeLoading.value = false
  }
  function resetEntry() {
    date.value = startingEntryDate
    store.entryToEdit = { ...startingEntry.value }
  }
  function updateDate(date: string) {
    const dateObject = new Date(date)
    store.entryToEdit.date = getLocalISODate(dateObject)
  }
  function generateRandomHexString(length: number): string {
    const hexChars = '0123456789abcdef'
    let result = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * hexChars.length)
      result += hexChars[randomIndex]
    }
    return result
  }
  function getNewEntryId() {
    let newId
    while (true) {
      newId = generateRandomHexString(16)
      if (!store.entries.has(newId)) break
    }
    return newId
  }
  function saveEntry() {
    const id = store.entryToEdit.id === null ? getNewEntryId() : store.entryToEdit.id
    // if (store.entryToEdit.id === null) {
    //   const newEntryId = getNewEntryId()
    //   console.log(newEntryId)
    // }
    const newEntry = {
      ...store.entryToEdit,
      id
    }
    store.entries.set(id, newEntry)
    localStorage.setItem(id, JSON.stringify(newEntry))
    store.entryList.add(id)
    store.editEntryFormShown = false
    store.updateEntryList()
      /** If this called a CREATE or UPDATE to an external source (DB), the this should
       * be called after a successful call. If failed, an error should be shown instead.
       */
  }
  function entryEdited(): boolean {
    /** Why not watch() for changes? I wanted the user to be able to change the entry back. */
    return JSON.stringify(startingEntry.value) !== JSON.stringify(store.entryToEdit)
  }
  function closeEditEntryDialog() {
    if (entryEdited()) {
      /** show warning */
      closeWarningShown.value = true;
    } else {
      store.editEntryFormShown = false
    }
  }

  watch(() => store.editEntryFormShown, (newValue) => {
    if (newValue) { /** sheet opened */
      startingEntry.value = { ...store.entryToEdit }
    }
  })
</script>
