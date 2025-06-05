<script setup>
import { ref, provide, onMounted } from 'vue'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

const darkMode = ref(true)
const currentUser = ref(null)
const isLoading = ref(true)

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  localStorage.setItem('darkMode', darkMode.value)
}

// Pratimo auth stanje
onMounted(() => {
  const savedMode = localStorage.getItem('darkMode')
  if (savedMode) darkMode.value = savedMode === 'true'
  
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
    isLoading.value = false
  })
})

// Provide global state
provide('darkMode', { darkMode, toggleDarkMode })
provide('auth', { currentUser, isLoading })
</script>

<template>
  <div :class="{'bg-dark text-white': darkMode, 'bg-white text-dark': !darkMode}" class="min-h-screen">
    <router-view v-if="!isLoading" />
    <div v-else class="flex items-center justify-center h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
    </div>
  </div>
</template>

<style>
/* Postojeći stilovi */
</style>