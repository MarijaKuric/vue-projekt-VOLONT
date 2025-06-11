<script setup>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const { darkMode, toggleDarkMode } = inject('darkMode')

const router = useRouter()
const noviDogadaj = ref({
  naziv: '',
  lokacija: '',
  datum: '',
  organizatorId: '',
  zadaci: []
})

const isFormValid = computed(() => {
  return noviDogadaj.value.naziv.trim() !== '' &&
         noviDogadaj.value.lokacija.trim() !== '' &&
         noviDogadaj.value.datum !== ''
})

const isLoading = ref(false)
const error = ref('')

async function kreirajDogadaj() {
  if (!isFormValid.value || isLoading.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    const user = auth.currentUser
    if (!user) throw new Error('Niste prijavljeni')

    const datumISO = new Date(noviDogadaj.value.datum).toISOString()
    
    const dogadajData = {
      naziv: noviDogadaj.value.naziv.trim(),
      lokacija: noviDogadaj.value.lokacija.trim(),
      datum: datumISO,
      organizatorId: user.uid,
      zadaci: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    const docRef = await addDoc(collection(db, 'dogadaji'), dogadajData)

    noviDogadaj.value = {
      naziv: '',
      lokacija: '',
      datum: '',
      organizatorId: '',
      zadaci: []
    }

    await router.push(`/organizator/unos-zadatka/${docRef.id}`)
  } catch (err) {
    console.error('Greška pri kreiranju događaja:', err)
    error.value = err.message || 'Došlo je do greške pri kreiranju događaja'
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
        class="bg-pink-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-pink-700 transition text-xs font-bold"
      >
        {{ darkMode ? 'SVIJETLI NAČIN' : 'TAMNI NAČIN' }}
      </button>
    </div>

    <h1 class="text-5xl font-extrabold text-pink-500 mb-2 tracking-wide italic">VolontIT</h1>
    <p class="mb-8 text-center text-lg" :class="darkMode ? 'text-gray-300' : 'text-gray-600'">Unos novog događaja</p>

    <div class="w-full max-w-md space-y-5 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
      <div>
        <label
          for="naziv"
          :class="darkMode ? 'text-black' : 'text-gray-700'"
          class="block mb-1 text-sm font-medium"
        >
          Naziv događaja<span class="text-blue-500">*</span>
        </label>
        <input
          v-model="noviDogadaj.naziv"
          id="naziv"
          type="text"
          placeholder="Unesite naziv događaja"
          :class="['w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500']"
        />
      </div>

      <div>
        <label
          for="lokacija"
          :class="darkMode ? 'text-black' : 'text-gray-700'"
          class="block mb-1 text-sm font-medium"
        >
          Lokacija<span class="text-blue-500">*</span>
        </label>
        <input
          v-model="noviDogadaj.lokacija"
          id="lokacija"
          type="text"
          placeholder="Unesite lokaciju događaja"
          :class="['w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500']"
        />
      </div>

      <div>
        <label
          for="datum"
          :class="darkMode ? 'text-black' : 'text-gray-700'"
          class="block mb-1 text-sm font-medium"
        >
          Datum događaja<span class="text-blue-500">*</span>
        </label>
        <input
          v-model="noviDogadaj.datum"
          id="datum"
          type="date"
          :class="['w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500']"
        />
      </div>

      <div v-if="error" class="text-red-500 text-sm text-center">
        {{ error }}
      </div>

      <button
        @click="kreirajDogadaj"
        :class="[
          'w-full text-white py-3 rounded-full font-semibold shadow-md transition',
          isFormValid && !isLoading ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-400 cursor-not-allowed'
        ]"
        :disabled="!isFormValid || isLoading"
      >
        {{ isLoading ? 'KREIRANJE...' : 'KREIRAJ DOGAĐAJ' }}
      </button>
    </div>
    <br>
    <br>
    <p
      class="mt-2 cursor-pointer text-sm font-medium transition"
      :class="[darkMode ? 'text-gray-300 hover:text-pink-400' : 'text-gray-700 hover:text-pink-600']"
      @click="router.push('/organizator/pregled')"
    >
      ⬅️ NAZAD NA PREGLED
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
input.text-black::placeholder {
  color: #6b7280;
}
</style>