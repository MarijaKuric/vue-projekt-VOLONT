<!-- src/views/Gost.vue -->
<script setup>
import { defineProps } from 'vue'
import TamniNacin from '@/components/TamniNacin.vue'

const props = defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function,
  goToHomePage: Function
})
</script>

<template>
  <div
    :class="props.darkMode ? 'bg-dark text-white' : 'bg-white text-dark'"
    class="flex flex-col min-h-screen p-6 overflow-hidden transition-colors"
  >
    <!-- Tamni/Svijetli način -->
    <div class="absolute top-4 right-4">
      <TamniNacin
        :darkMode="props.darkMode"
        @toggle="props.toggleDarkMode"
      />
    </div>

    <!-- Naslov -->
    <h1 class="text-3xl md:text-4xl font-bold text-pink-600 text-center mt-12 mb-8">
      VolontIT (Gost)
    </h1>

    <!-- Glavni okvir -->
    <div
      class="max-w-2xl mx-auto rounded-2xl p-6 shadow-lg"
      :class="props.darkMode
        ? 'bg-gray-800 text-white'
        : 'bg-white text-gray-800'"
    >
      <h2 class="text-xl md:text-2xl font-semibold mb-4 text-center">
        Dobrodošli, GOST korisniče!
      </h2>
      <p class="text-base md:text-lg text-center mb-2">
        Možete pregledati aktualne događaje i zadatke koje organizatori objave.
      </p>
      <p class="text-sm text-center italic text-gray-500">
        Napomena: Prikaz će biti omogućen nakon što organizator unese sadržaj.
      </p>
    </div>

    <!-- Centrirani POČETNA "text button" pri dnu -->
    <div class="mt-auto flex justify-center mb-6">
      <button
        @click="props.goToHomePage()"
        class="text-lg font-semibold transition transform hover:scale-105 cursor-pointer"
        :class="props.darkMode
          ? 'text-white hover:text-blue-500'
          : 'text-gray-700 hover:text-blue-500'"
      >
        POČETNA
      </button>
    </div>
  </div>
</template>

<style>
.bg-dark { background-color: #0d1321; }
.text-dark { color: #0d1321; }
</style>
