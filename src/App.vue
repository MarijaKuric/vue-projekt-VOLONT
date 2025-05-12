<script setup>
import { ref } from 'vue'

const darkMode = ref(true)

function toggleDarkMode() {
  darkMode.value = !darkMode.value
}
</script>

<template>
  <div :class="{'bg-dark text-white': darkMode, 'bg-white text-dark': !darkMode}">
    <router-view 
      :darkMode="darkMode" 
      :toggleDarkMode="toggleDarkMode" 
    />
  </div>
</template>

<style>

* {
  transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
}

.bg-dark { background-color: #0d1321; }
.bg-light { background-color: #f9fafb; }
.text-dark { color: #0d1321; }
</style>