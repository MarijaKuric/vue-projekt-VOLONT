<script setup>
import { ref } from 'vue'
import Početna from '../views/Početna.vue'
import Gost from '../views/Gost.vue'
import Registracija from '../views/Registracija.vue'
import Prijava from '../views/Prijava.vue'
import OrganizatorPrijava from '../views/OrganizatorPrijava.vue'

const darkMode = ref(true)
const currentView = ref('početna') // 'početna', 'gost', 'registracija', 'prijava', 'organizator'

function toggleDarkMode() {
  darkMode.value = !darkMode.value
}

function goToGost() {
  currentView.value = 'gost'
}

function goToHomePage() {
  currentView.value = 'početna'
}

function goToRegistracija() {
  currentView.value = 'registracija'
}

function goToPrijava() {
  currentView.value = 'prijava'
}

function goToOrganizatorPrijava() {
  currentView.value = 'organizator'
}
</script>

<template>
  <div
    :class="darkMode ? 'bg-dark text-white' : 'bg-white text-dark'"
    class="min-h-screen transition-colors"
  >
    <Početna
      v-if="currentView === 'početna'"
      :darkMode="darkMode"
      :toggleDarkMode="toggleDarkMode"
      :goToGost="goToGost"
      :goToRegistracija="goToRegistracija"
      :goToPrijava="goToPrijava"
      :goToOrganizatorPrijava="goToOrganizatorPrijava"
    />
    
    <Gost
      v-else-if="currentView === 'gost'"
      :darkMode="darkMode"
      :toggleDarkMode="toggleDarkMode"
      :goToHomePage="goToHomePage"
    />
    
    <Registracija
      v-else-if="currentView === 'registracija'"
      :darkMode="darkMode"
      :toggleDarkMode="toggleDarkMode"
      :goToHomePage="goToHomePage"
      :goToPrijava="goToPrijava"
    />
    
    <Prijava
      v-else-if="currentView === 'prijava'"
      :darkMode="darkMode"
      :toggleDarkMode="toggleDarkMode"
      :goToHomePage="goToHomePage"
      :goToRegistracija="goToRegistracija"
    />

    <OrganizatorPrijava
      v-else-if="currentView === 'organizator'"
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