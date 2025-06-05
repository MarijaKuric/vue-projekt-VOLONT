<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  updateProfile
} from 'firebase/auth'
import { auth, db } from '@/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'  // dodano

const router = useRouter()
const ime = ref('')
const email = ref('')
const lozinka = ref('')
const potvrdaLozinke = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

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
  successMessage.value = ''

  try {
    // Kreiraj korisnika
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      lozinka.value
    )
    const user = userCredential.user

    // Pošalji email za verifikaciju
    await sendEmailVerification(user)
    
    // Ažuriraj profil s imenom
    await updateProfile(user, {
      displayName: ime.value
    })

    // Spremi dodatne podatke u Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name: ime.value,
      email: email.value,
      role: 'volonter',
      emailVerified: user.emailVerified,  // ovdje koristimo stvarnu vrijednost
      createdAt: serverTimestamp()
    })

    successMessage.value = `Poslali smo vam email za verifikaciju na ${email.value}. Molimo potvrdite svoj email prije prijave.`
    
    // Reset forme
    ime.value = ''
    email.value = ''
    lozinka.value = ''
    potvrdaLozinke.value = ''

  } catch (error) {
    console.error('Registration error:', error)
    errorMessage.value = getErrorMessage(error.code)
  } finally {
    isLoading.value = false
  }
}

function getErrorMessage(code) {
  switch(code) {
    case 'auth/email-already-in-use':
      return 'Email je već u upotrebi'
    case 'auth/invalid-email':
      return 'Nevažeća email adresa'
    case 'auth/weak-password':
      return 'Lozinka mora imati najmanje 6 znakova'
    default:
      return 'Došlo je do greške prilikom registracije'
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
    <p class="mb-8 text-center text-lg" :class="darkMode ? 'text-gray-300' : 'text-gray-600'">Registrirajte se</p>

    <!-- Success message -->
    <div 
      v-if="successMessage" 
      class="w-full max-w-md mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-center"
    >
      {{ successMessage }}
    </div>

    <!-- Error message -->
    <div 
      v-if="errorMessage" 
      class="w-full max-w-md mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-center"
    >
      {{ errorMessage }}
    </div>

    <div class="w-full max-w-md space-y-5 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
      <div>
        <label
          for="ime"
          class="block mb-1 text-sm font-medium"
          :class="darkMode ? 'text-gray-300' : 'text-gray-700'"
        >
          Ime i prezime<span class="text-pink-500">*</span>
        </label>
        <input
          v-model="ime"
          id="ime"
          type="text"
          placeholder="Vaše ime i prezime"
          :class="[
            'w-full p-3 rounded-lg border focus:outline-none focus:ring-2',
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-pink-500 placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 focus:ring-pink-500 placeholder-gray-500'
          ]"
          :disabled="isLoading"
        />
      </div>

      <div>
        <label
          for="email"
          class="block mb-1 text-sm font-medium"
          :class="darkMode ? 'text-gray-300' : 'text-gray-700'"
        >
          Email<span class="text-pink-500">*</span>
        </label>
        <input
          v-model="email"
          id="email"
          type="email"
          placeholder="Vaša email adresa"
          :class="[
            'w-full p-3 rounded-lg border focus:outline-none focus:ring-2',
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-pink-500 placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 focus:ring-pink-500 placeholder-gray-500'
          ]"
          :disabled="isLoading"
        />
      </div>

      <div>
        <label
          for="lozinka"
          class="block mb-1 text-sm font-medium"
          :class="darkMode ? 'text-gray-300' : 'text-gray-700'"
        >
          Lozinka<span class="text-pink-500">*</span>
        </label>
        <input
          v-model="lozinka"
          id="lozinka"
          type="password"
          placeholder="Lozinka (min 6 znakova)"
          :class="[
            'w-full p-3 rounded-lg border focus:outline-none focus:ring-2',
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-pink-500 placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 focus:ring-pink-500 placeholder-gray-500'
          ]"
          :disabled="isLoading"
        />
      </div>

      <div>
        <label
          for="potvrda"
          class="block mb-1 text-sm font-medium"
          :class="darkMode ? 'text-gray-300' : 'text-gray-700'"
        >
          Potvrda lozinke<span class="text-pink-500">*</span>
        </label>
        <input
          v-model="potvrdaLozinke"
          id="potvrda"
          type="password"
          placeholder="Ponovite lozinku"
          :class="[
            'w-full p-3 rounded-lg border focus:outline-none focus:ring-2',
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-pink-500 placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 focus:ring-pink-500 placeholder-gray-500'
          ]"
          :disabled="isLoading"
        />
      </div>

      <button
        @click="handleSubmit"
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
        {{ isLoading ? 'REGISTRACIJA U TIJEKU...' : 'REGISTRIRAJ SE' }}
      </button>
    </div>

    <p class="mt-6 text-center text-sm" :class="darkMode ? 'text-gray-400' : 'text-gray-600'">
      Već imate račun?
      <span
        class="font-semibold hover:underline cursor-pointer"
        :class="darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-700'"
        @click="!isLoading && router.push('/prijava')"
      >
        Prijavite se
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