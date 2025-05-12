<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const lozinka = ref('')

const isValid = computed(() => {
  return email.value.trim() !== '' && lozinka.value.trim() !== ''
})

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
        class="bg-pink-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-pink-600 transition"
      >
        {{ darkMode ? 'SVIJETLI NAČIN' : 'TAMNI NAČIN' }}
      </button>
    </div>

    <h1 class="text-5xl font-extrabold text-pink-500 mb-2 tracking-wide italic">VolontIT</h1>
    <p class="mb-8 text-center text-lg">Prijavite se u svoj račun.</p>

    <div class="w-full max-w-md space-y-5 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
      <div>
        <label
          for="email"
          :class="darkMode ? 'text-black' : 'text-gray-700'"
          class="block mb-1 text-sm font-medium"
        >
          Email<span class="text-pink-500">*</span>
        </label>
        <input
          v-model="email"
          id="email"
          type="email"
          placeholder="Email..."
          :class="['w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-pink-400', darkMode ? 'text-black' : 'text-black']"
        />
      </div>

      <div>
        <label
          for="lozinka"
          :class="darkMode ? 'text-black' : 'text-gray-700'"
          class="block mb-1 text-sm font-medium"
        >
          Lozinka<span class="text-pink-500">*</span>
        </label>
        <input
          v-model="lozinka"
          id="lozinka"
          type="password"
          placeholder="Lozinka..."
          :class="['w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-pink-400', darkMode ? 'text-black' : 'text-black']"
        />
      </div>

      <button
        :class="isValid ? 'bg-pink-500 hover:bg-pink-600' : 'bg-gray-400 cursor-not-allowed'"
        class="w-full text-white py-3 rounded-full font-semibold shadow transition"
        :disabled="!isValid"
      >
        PRIJAVI SE
      </button>
    </div>

    <p class="mt-6 text-center text-sm">
      Nemate račun?
      <span class="font-bold text-yellow-400 hover:underline cursor-pointer" @click="router.push('/registracija')">
        Registrirajte se
      </span>
    </p>
    <p
      class="mt-2 cursor-pointer text-sm font-medium transition"
      :class="[darkMode ? 'text-white hover:text-blue-400' : 'text-black hover:text-blue-600']"
      @click="router.push('/')"
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