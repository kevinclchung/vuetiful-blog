// Utilities
import { defineStore } from 'pinia'
import staticData from '@/assets/static-data.json'
// import demoData from '@/assets/demo-data.json'

export type UserType = {
  username: string,
  name: string,
  img: string|null,
}

export type EntryType = {
  id: string|null, /** 16-character HexDec string */
  title: string,
  text: string,
  author: string|null, /** UserType > username */
  date: string, /** YYYY-mm-dd formatted */
}

export function getLocalISODate(date?: Date) {
  const dateObject = date ? date : new Date()
  const month = String(dateObject.getMonth() + 1).padStart(2, '0')
  const day = String(dateObject.getDate()).padStart(2, '0')
  return `${dateObject.getFullYear()}-${month}-${day}`
}

export const blankEntry = <EntryType>{
  id: null,
  title: '',
  text: '',
  author: null,
  date: getLocalISODate(),
}

export const useAppStore = defineStore('app', {
  state: () => ({
    blogTitle: staticData.title,
    /** Loaded Data */
    users: new Map<string, UserType>(),
    loggedInUser: <UserType|null>null, /** string > users key, null => not logged in */
    entryList: new Set(),
    entries: new Map<string, EntryType>(),
    /** App Runtime Data
     * Although the instructions said that application state must persist through
     * refresh, the data below will _not_ persist. I believe that this is consistent
     * with UX web standards.
     */
    editEntryFormShown: false,
    entryToEdit: blankEntry,
    search: {
      shown: false,
      title: <string|null>null,
      author: null,
      text: <string|null>null,
      dateRange: <string[]>[],
    },
  }),
  getters: {
    userInitials: () => (user: UserType|null): string => {
      const initialsRegex =  /\b\w/g
      const name = user?.name
      const intials = name?.match(initialsRegex)
      return intials ? intials.join('') : ''
    },
    sortedUsers: (state) => (customSortFn?: (a: UserType, b: UserType) => number) => {
      const sortFn = typeof customSortFn !== 'undefined'
        ? customSortFn
        : (a: UserType, b: UserType) => a.name < b.name ? -1 : 1
      return Array.from(state.users.values()).sort(sortFn)
    },
    sortedEntries(state) {
      return Array.from(state.entries.values())
        .sort((a: EntryType, b: EntryType) => a.date > b.date ? -1 : 1)
        .filter((entry) =>
          state.search.title === null
          || entry.title.toLowerCase().includes(state.search.title.toLowerCase().trim())
        )
        .filter((entry) => 
          state.search.author === ''
          || state.search.author === null
          || entry.author === state.search.author
        )
        .filter((entry) =>
          state.search.dateRange.length === 0
          || state.search.dateRange.includes(entry.date)
        )
        .filter((entry) =>
          state.search.text === null
          || entry.text.toLowerCase().includes(state.search.text.toLowerCase().trim()))
    },
  },
  actions: {
    openEditEntrySheet(id?: string) {
      if (!id) { /** New Entry */
        this.entryToEdit = {
          ...blankEntry,
          author: this.loggedInUser ? this.loggedInUser.username : null,
        }
      } else {
        const existingEntry = this.entries.get(id)
        if (existingEntry) {
          this.entryToEdit = existingEntry
        }
      }
      this.editEntryFormShown = true
    },
    updateEntryList() {
      localStorage.setItem('entryList', JSON.stringify(Array.from(this.entryList)))
    },
  },
})
