<script setup>
import { ref, computed } from 'vue'

const email = ref('')
const lozinka = ref('')

const isValid = computed(() => {
  return email.value.trim() !== '' && lozinka.value.trim() !== ''
})

defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function,
  goToHomePage: Function,
  goToRegistracija: Function
})
</script>

<template>
  <div
    :class="darkMode ? 'bg-dark text-white' : 'bg-light text-dark'"
    class="min-h-screen flex flex-col items-center justify-center px-6 py-12 font-sans transition-colors duration-500 relative"
  >
    <!-- Dark mode gumb -->
    <div class="absolute top-4 right-4">
      <button
        @click="toggleDarkMode"
        class="bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition"
      >
        {{ darkMode ? 'SVIJETLI NAČIN' : 'TAMNI NAČIN' }}
      </button>
    </div>

    <!-- Naslov -->
    <h1 class="text-5xl font-extrabold text-blue-600 mb-2 tracking-wide italic">VolontIT</h1>
    <p class="mb-8 text-center text-lg">Prijava organizatora.</p>

    <!-- Forma -->
    <div class="w-full max-w-md space-y-5 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
      <div>
        <label
          for="email"
          :class="darkMode ? 'text-black' : 'text-gray-700'"
          class="block mb-1 text-sm font-medium"
        >
          Email<span class="text-blue-600">*</span>
        </label>
        <input
          v-model="email"
          id="email"
          type="email"
          placeholder="Email..."
          :class="['w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500', darkMode ? 'text-black' : 'text-black']"
        />
      </div>

      <div>
        <label
          for="lozinka"
          :class="darkMode ? 'text-black' : 'text-gray-700'"
          class="block mb-1 text-sm font-medium"
        >
          Lozinka<span class="text-blue-600">*</span>
        </label>
        <input
          v-model="lozinka"
          id="lozinka"
          type="password"
          placeholder="Lozinka..."
          :class="['w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500', darkMode ? 'text-black' : 'text-black']"
        />
      </div>

      <!-- Gumb -->
      <button
        :class="isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'"
        class="w-full text-white py-3 rounded-full font-semibold shadow transition"
        :disabled="!isValid"
      >
        PRIJAVI SE
      </button>
    </div>

    <!-- Linkovi -->
    <p class="mt-6 text-center text-sm">
      Nemate račun?
      <span class="font-bold text-blue-400 hover:underline cursor-pointer" @click="goToRegistracija">
        Registrirajte se
      </span>
    </p>
    <p
      class="mt-2 cursor-pointer text-sm font-medium transition"
      :class="[darkMode ? 'text-white hover:text-blue-400' : 'text-black hover:text-blue-600']"
      @click="goToHomePage"
    >
      ⬅️ Početna
    </p>
  </div>
</template>

<style>
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
