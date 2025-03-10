<template>
  <v-container class="d-flex align-top">
    <v-btn
      class="mr-4"
      icon="mdi-magnify"
      @click="fieldsShown = !fieldsShown"
    />
    <v-container v-if="fieldsShown">
      <v-row>
        <v-col>
          <v-text-field
            v-model="store.search.title"
            label="Title"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
        </v-col>
        <v-col>
          <v-select
            v-model="store.search.author"
            label="Author"
            variant="outlined"
            density="compact"
            clearable
            :items="store.sortedUsers()"
            :item-props="(user) => ({
              title: user.name,
              subtitle: user.username,
            })"
            item-value="username"
            hide-details
          />
        </v-col>
        <v-col>
          <v-date-input
            v-model="date"
            label="Date"
            variant="outlined"
            multiple="range"
            density="compact"
            clearable
            prepend-icon=""
            prepend-inner-icon="$calendar"
            hide-details
            @update:model-value="updateDate"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="store.search.text"
            label="Text"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts" setup>
  // import { useDate } from 'vuetify'
  import { getLocalISODate, useAppStore } from '@/stores/app'

  const store = useAppStore()
  const fieldsShown = ref(false)
  const date = ref([new Date()])

  function updateDate(dates: string) {
    const dateArray = JSON.parse(JSON.stringify(dates))
    store.search.dateRange = dateArray.map((date: string) => getLocalISODate(new Date(date)))
  }
</script>
