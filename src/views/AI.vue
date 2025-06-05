<template>
  <div
    :class="darkMode ? 'bg-dark text-white' : 'bg-light text-dark'"
    class="min-h-screen flex flex-col items-center justify-start py-6 px-6 transition-colors duration-500"
  >
    <!-- Dark/Light mode toggle button -->
    <div class="w-full flex justify-end mb-4">
      <button
        @click="toggleDarkMode"
        class="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold py-2 px-4 rounded-full shadow"
      >
        {{ darkMode ? 'SVIJETLI NAČIN' : 'TAMNI NAČIN' }}
      </button>
    </div>

    <!-- Title -->
    <div class="text-center">
      <h1 class="text-pink-500 text-5xl font-bold italic mb-8">VolontIT</h1>

      <!-- Navigation -->
      <div class="flex flex-wrap gap-4 justify-center mb-8">
        <button 
          @click="router.push('/ai')"
          class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow"
        >
          AI ALAT
        </button>
        <button 
          @click="router.push('/volonter-dogadaji')"
          class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow"
        >
          DOGAĐAJI
        </button>
        <button 
          @click="router.push('/moji-zadaci')"
          class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow"
        >
          MOJI ZADACI
        </button>
        <button 
          @click="router.push('/recenzije')"
          class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow"
        >
          RECENZIJE
        </button>
      </div>
    </div>

    <!-- AI Content -->
    <div class="flex-grow flex items-center justify-center w-full">
      <div
        class="w-full max-w-2xl bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow-md p-6 space-y-4"
      >
        <p class="text-base">
          Dobrodošao/la! Ovdje ćeš uskoro moći postaviti pitanja i saznati koja volonterska pozicija najbolje odgovara tvojim vještinama, interesima i dostupnosti.
        </p>

        <div
          class="border border-gray-300 dark:border-gray-600 rounded-md h-64 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-700"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400 italic">
            ⌛ AI chat okvir – ovdje će se prikazivati odgovori i komunikacija s AI asistentom...
          </p>
        </div>

        <div class="flex mt-4">
          <input
            type="text"
            placeholder="Postavi pitanje..."
            class="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none dark:bg-gray-700 dark:text-white"
          />
          <button class="bg-pink-600 hover:bg-blue-500 text-white font-semibold px-4 rounded-r-md">
            ➤
          </button>
        </div>
      </div>
    </div>

    <!-- Logout -->
     <br>
    <div class="mt-auto mb-6">
      <button
        class="text-sm font-medium hover:underline"
        @click="router.push('/')"
        :class="darkMode ? 'text-white hover:text-blue-400' : 'text-black hover:text-blue-600'"
      >
        ⬅️ ODJAVA
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function
})
</script>

<style scoped>
.bg-dark {
  background-color: #0d1321;
}
.bg-light {
  background-color: #f9fafb;
}
.text-dark {
  color: #0d1321;
}
</style>