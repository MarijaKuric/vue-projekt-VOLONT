<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const ime = ref('')
const email = ref('')
const lozinka = ref('')
const potvrdaLozinke = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const isValid = computed(() => {
  return (
    ime.value.trim() !== '' &&
    email.value.trim() !== '' &&
    lozinka.value.trim() !== '' &&
    potvrdaLozinke.value.trim() !== '' &&
    lozinka.value === potvrdaLozinke.value
  )
})

const handleSubmit = async () => {
  if (!isValid.value) return
  
  isLoading.value = true
  errorMessage.value = ''

  try {
    // Simulacija API poziva za registraciju
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulacija slanja emaila
    console.log(`Email poslan na: ${email.value}`)
    
    // Preusmjeravanje na uspješnu stranicu
    router.push({
      path: '/registracija/uspjesno',
      query: { email: email.value }
    })
  } catch (error) {
    errorMessage.value = 'Došlo je do greške prilikom registracije. Pokušajte ponovno.'
    console.error('Registration error:', error)
  } finally {
    isLoading.value = false
  }
}

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
        :disabled="isLoading"
      >
        {{ darkMode ? 'SVIJETLI NAČIN' : 'TAMNI NAČIN' }}
      </button>
    </div>

    <h1 class="text-5xl font-extrabold text-pink-500 mb-2 tracking-wide italic">VolontIT</h1>
    <p class="mb-8 text-center text-lg">Stvorite račun da bi imali svoj profil.</p>

    <div class="w-full max-w-md space-y-5 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
      <!-- Error message -->
      <div v-if="errorMessage" class="text-red-500 text-sm text-center p-2 bg-red-50 rounded">
        {{ errorMessage }}
      </div>

      <div>
        <label
          for="ime"
          :class="darkMode ? 'text-black' : 'text-gray-700'"
          class="block mb-1 text-sm font-medium"
        >
          Ime i prezime<span class="text-pink-500">*</span>
        </label>
        <input
          v-model="ime"
          id="ime"
          type="text"
          placeholder="Ime i prezime..."
          :class="['w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-pink-400', darkMode ? 'text-black' : 'text-black']"
          :disabled="isLoading"
        />
      </div>

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
          :disabled="isLoading"
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
          :disabled="isLoading"
        />
      </div>

      <div>
        <label
          for="potvrda"
          :class="darkMode ? 'text-black' : 'text-gray-700'"
          class="block mb-1 text-sm font-medium"
        >
          Potvrda lozinke<span class="text-pink-500">*</span>
        </label>
        <input
          v-model="potvrdaLozinke"
          id="potvrda"
          type="password"
          placeholder="Potvrda lozinke..."
          :class="['w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-pink-400', darkMode ? 'text-black' : 'text-black']"
          :disabled="isLoading"
        />
      </div>

      <button
        @click="handleSubmit"
        :class="isValid && !isLoading ? 'bg-pink-500 hover:bg-pink-600' : 'bg-gray-400 cursor-not-allowed'"
        class="w-full text-white py-3 rounded-full font-semibold shadow transition flex justify-center items-center"
        :disabled="!isValid || isLoading"
      >
        <span v-if="isLoading" class="inline-block mr-2">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
        {{ isLoading ? 'REGISTRACIJA U TIJEKU...' : 'REGISTRIRAJ SE' }}
      </button>
    </div>

    <p class="mt-6 text-center text-sm">
      Već ste stvorili račun?
      <span
        class="font-bold text-yellow-400 hover:underline cursor-pointer"
        @click="!isLoading && router.push('/prijava')"
      >
        Prijavite se
      </span>
    </p>
    <p
      class="mt-2 cursor-pointer text-sm font-medium transition"
      :class="[darkMode ? 'text-white hover:text-blue-400' : 'text-black hover:text-blue-600']"
      @click="!isLoading && router.push('/')"
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