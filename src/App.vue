<script setup>
import { ref } from 'vue'
import Početna from '../views/Početna.vue'
import Gost from '../views/Gost.vue'
import Registracija from '../views/Registracija.vue'
import Prijava from '../views/Prijava.vue'

const darkMode = ref(true)
const showGost = ref(false)
const showRegistracija = ref(false)
const showPrijava = ref(false)

function toggleDarkMode() {
  darkMode.value = !darkMode.value
}

function goToGost() {
  showGost.value = true
  showRegistracija.value = false
  showPrijava.value = false
}

function goToHomePage() {
  showGost.value = false
  showRegistracija.value = false
  showPrijava.value = false
}

function goToRegistracija() {
  showGost.value = false
  showRegistracija.value = true
  showPrijava.value = false
}

function goToPrijava() {
  showGost.value = false
  showRegistracija.value = false
  showPrijava.value = true
}
</script>

<template>
  <div
    :class="darkMode ? 'bg-dark text-white' : 'bg-white text-dark'"
    class="min-h-screen transition-colors"
  >
    <Početna
      v-if="!showGost && !showRegistracija && !showPrijava"
      :darkMode="darkMode"
      :toggleDarkMode="toggleDarkMode"
      :goToGost="goToGost"
      :goToRegistracija="goToRegistracija"
      :goToPrijava="goToPrijava"
    />
    
    <Gost
      v-else-if="showGost"
      :darkMode="darkMode"
      :toggleDarkMode="toggleDarkMode"
      :goToHomePage="goToHomePage"
    />
    
    <Registracija
      v-else-if="showRegistracija"
      :darkMode="darkMode"
      :toggleDarkMode="toggleDarkMode"
      :goToHomePage="goToHomePage"
      :goToPrijava="goToPrijava"
    />
    
    <Prijava
      v-else
      :darkMode="darkMode"
      :toggleDarkMode="toggleDarkMode"
      :goToHomePage="goToHomePage"
      :goToRegistracija="goToRegistracija"
    />
  </div>
</template>

<style>
.bg-dark {
  background-color: #0d1321;
}
.text-dark {
  color: #0d1321;
}
</style>
