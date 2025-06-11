<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function
})
</script>

<template>
  <div
    :class="darkMode ? 'bg-dark text-white' : 'bg-light text-dark'"
    class="min-h-screen flex flex-col items-center justify-center px-6 py-12 font-sans transition-colors duration-500 relative"
  >
    <div class="absolute top-4 right-4">
      <button
        @click="toggleDarkMode"
        class="bg-pink-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-pink-700 transition"
      >
        {{ darkMode ? 'SVIJETLI NAČIN' : 'TAMNI NAČIN' }}
      </button>
    </div>

    <div class="w-full max-w-md space-y-8 text-center">
      <!-- Naslov -->
      <h1 class="text-5xl font-bold text-pink-500">
        Volont<span class="italic">IT</span>
      </h1>
      
      <!-- Tekstualna poruka -->
      <p class="text-lg mb-8" :class="darkMode ? 'text-white' : 'text-gray-800'">
        Uspješno ste stvorili svoj račun. Uskoro će Vam stići email potvrda. Hvala!
      </p>

      <!-- Gumbi -->
      <div class="flex flex-col space-y-4">
        <button
          @click="router.push('/prijava')"
          class="bg-pink-600 hover:bg-pink-700 text-white py-3 px-12 rounded-full font-semibold shadow transition mx-auto"
        >
          PRIJAVI SE
        </button>
        
        <button
          @click="router.push('/')"
          class="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition"
        >
          ⬅️ POČETNA
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.bg-dark { background-color: #0d1321; }
.bg-light { background-color: #f9fafb; }
.text-dark { color: #0d1321; }
</style>