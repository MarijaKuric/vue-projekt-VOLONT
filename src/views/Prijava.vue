<script setup>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'

const { darkMode, toggleDarkMode } = inject('darkMode')

const router = useRouter()
const email = ref('')
const lozinka = ref('')
const loginError = ref('')
const isLoading = ref(false)

const isValid = computed(() => {
  return email.value.trim() !== '' && lozinka.value.trim() !== ''
})

async function getUserRole(uid) {
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data().role
  }
  return null
}

async function prijaviSe() {
  if (!isValid.value || isLoading.value) return

  isLoading.value = true
  loginError.value = ''

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, lozinka.value)
    const user = userCredential.user

    await user.reload()

    if (!user.emailVerified) {
      throw new Error('email-not-verified')
    }

    const role = await getUserRole(user.uid)
    if (!role) throw new Error('Korisnik nema dodijeljenu ulogu')

    const redirectPath = role === 'organizator' 
      ? '/organizator/pregled' 
      : '/volonter/pocetna'

    await router.replace(redirectPath)

  } catch (error) {
    console.error('Greška pri prijavi:', error)
    if (error.message === 'email-not-verified') {
      loginError.value = 'Molimo potvrdite svoj email prije prijave.'
    } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      loginError.value = 'Neispravan email ili lozinka'
    } else {
      loginError.value = 'Došlo je do greške prilikom prijave'
    }
  } finally {
    isLoading.value = false
  }
}
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
        :disabled="isLoading"
      >
        {{ darkMode ? 'SVIJETLI NAČIN' : 'TAMNI NAČIN' }}
      </button>
    </div>

    <h1 class="text-5xl font-extrabold text-pink-500 mb-2 tracking-wide italic">VolontIT</h1>
    <p class="mb-8 text-center text-lg" :class="darkMode ? 'text-gray-300' : 'text-gray-600'">Prijavite se u svoj račun</p>

    <div 
      v-if="loginError" 
      class="w-full max-w-md mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-center"
    >
      {{ loginError }}
    </div>

    <div class="w-full max-w-md space-y-5 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
      <div>
        <label for="email" class="block mb-1 text-sm font-medium" :class="darkMode ? 'text-gray-700' : 'text-gray-700'">
          Email<span class="text-pink-500">*</span>
        </label>
        <input
          v-model="email"
          id="email"
          type="email"
          placeholder="Unesite svoj email"
          :class="[
            'w-full p-3 rounded-lg border focus:outline-none focus:ring-2',
            darkMode
              ? 'bg-white border-gray-300 text-gray-900 focus:ring-pink-500 placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 focus:ring-pink-500 placeholder-gray-500'
          ]"
          :disabled="isLoading"
        />
      </div>

      <div>
        <label for="lozinka" class="block mb-1 text-sm font-medium" :class="darkMode ? 'text-gray-700' : 'text-gray-700'">
          Lozinka<span class="text-pink-500">*</span>
        </label>
        <input
          v-model="lozinka"
          id="lozinka"
          type="password"
          placeholder="Unesite lozinku"
          :class="[
            'w-full p-3 rounded-lg border focus:outline-none focus:ring-2',
            darkMode
              ? 'bg-white border-gray-300 text-gray-900 focus:ring-pink-500 placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 focus:ring-pink-500 placeholder-gray-500'
          ]"
          :disabled="isLoading"
        />
      </div>

      <button
        @click="prijaviSe"
        :class="[
          'w-full py-3 rounded-full font-semibold shadow transition flex items-center justify-center',
          isValid && !isLoading 
            ? 'bg-pink-600 hover:bg-pink-700 text-white' 
            : 'bg-gray-400 cursor-not-allowed text-gray-700'
        ]"
        :disabled="!isValid || isLoading"
      >
        <svg
          v-if="isLoading"
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isLoading ? 'PRIJAVA U TIJEKU...' : 'PRIJAVI SE' }}
      </button>
    </div>

    <p class="mt-6 text-center text-sm" :class="darkMode ? 'text-gray-400' : 'text-gray-600'">
      Nemate račun?
      <span
        class="font-semibold hover:underline cursor-pointer"
        :class="darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-700'"
        @click="!isLoading && router.push('/registracija')"
      >
        Registrirajte se
      </span>
    </p>

    <p
      class="mt-4 cursor-pointer text-sm font-medium transition"
      :class="darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'"
      @click="!isLoading && router.push('/')"
    >
      ⬅️ Povratak na početnu stranicu
    </p>
  </div>
</template>

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
