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
        <button @click="navigateTo('/ai')" class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow">
          AI ALAT
        </button>
        <button @click="navigateTo('/volonter-dogadaji')" class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow">
          DOGAĐAJI
        </button>
        <button @click="navigateTo('/moji-zadaci')" class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow">
          MOJI ZADACI
        </button>
        <button @click="navigateTo('/recenzije')" class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow">
          RECENZIJE
        </button>
      </div>
    </div>

    <!-- Review Form -->
    <div :class="darkMode ? 'bg-gray-800' : 'bg-white'" class="w-full max-w-2xl rounded-xl shadow-lg p-6 mb-8">
      <h2 class="text-xl font-bold mb-4" :class="darkMode ? 'text-white' : 'text-black'">Ostavite recenziju na događaj</h2>
      <form @submit.prevent="submitReview">
        <div class="mb-4">
          <label class="block mb-2 font-medium" :class="darkMode ? 'text-white' : 'text-black'">Događaj:</label>
          <input
            v-model="newReview.dogadjaj"
            type="text"
            required
            :class="darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'"
            class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Unesite naziv događaja"
          >
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium" :class="darkMode ? 'text-white' : 'text-black'">Vaše ime:</label>
          <input
            v-model="newReview.ime"
            type="text"
            required
            :class="darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'"
            class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium" :class="darkMode ? 'text-white' : 'text-black'">Ocjena:</label>
          <div class="flex items-center space-x-2">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              @click="newReview.ocjena = n"
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="{
                'bg-pink-500 text-white': n <= newReview.ocjena,
                'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300': n > newReview.ocjena
              }"
            >
              {{ n }}
            </button>
          </div>
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium" :class="darkMode ? 'text-white' : 'text-black'">Komentar:</label>
          <textarea
            v-model="newReview.komentar"
            required
            rows="4"
            :class="darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'"
            class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg shadow"
        >
          POŠALJI RECENZIJU
        </button>
      </form>
    </div>

    <!-- Reviews List -->
    <div class="w-full max-w-2xl space-y-6">
      <h2 class="text-xl font-bold mb-4" :class="darkMode ? 'text-white' : 'text-black'">Recenzije volontera</h2>

      <div 
        v-for="(recenzija, index) in recenzije"
        :key="index"
        :class="darkMode ? 'bg-gray-800' : 'bg-white'"
        class="rounded-xl shadow-lg p-6"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="font-bold text-lg" :class="darkMode ? 'text-white' : 'text-black'">{{ recenzija.ime }}</h3>
            <p class="text-sm" :class="darkMode ? 'text-white' : 'text-black'">
              {{ formatDate(recenzija.datum) }}
            </p>
            <p class="text-sm italic" :class="darkMode ? 'text-white' : 'text-black'">
              Događaj: {{ recenzija.dogadjaj }}
            </p>
          </div>
          <div class="flex items-center">
            <span
              v-for="n in 5"
              :key="n"
              class="text-xl"
              :class="n <= recenzija.ocjena ? 'text-pink-500' : 'text-gray-300 dark:text-gray-600'"
            >
              ★
            </span>
          </div>
        </div>
        <p class="font-semibold" :class="darkMode ? 'text-white' : 'text-black'">{{ recenzija.komentar }}</p>
      </div>

      <p
        v-if="recenzije.length === 0"
        class="text-center italic"
        :class="darkMode ? 'text-white' : 'text-black'"
      >
        Još nema recenzija. Budite prvi koji će ostaviti dojam!
      </p>
    </div>

    <!-- Logout -->
    <br>
    <div class="mt-auto mb-6">
      <button
        class="text-sm font-medium hover:underline"
        @click="navigateTo('/')"
        :class="darkMode ? 'text-white hover:text-blue-400' : 'text-black hover:text-blue-600'"
      >
        ⬅️ ODJAVA
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { auth, db } from '@/firebase'
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore'

const router = useRouter()
const navigateTo = (path) => {
  router.push(path).catch(err => console.error('Navigation error:', err))
}

defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function
})

const recenzije = ref([])
const newReview = ref({
  ime: '',
  dogadjaj: '',
  ocjena: 0,
  komentar: '',
  datum: new Date().toISOString()
})

onMounted(async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'recenzije'))
    recenzije.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching reviews:', error)
  }
})

const submitReview = async () => {
  try {
    const user = auth.currentUser
    if (!user) {
      router.push('/prijava')
      return
    }
    
    const reviewData = {
      ...newReview.value,
      userId: user.uid,
      ime: user.displayName || newReview.value.ime,
      datum: serverTimestamp()
    }
    
    const docRef = await addDoc(collection(db, 'recenzije'), reviewData)
    recenzije.value.unshift({ id: docRef.id, ...reviewData })
    
    // Reset form
    newReview.value = {
      ime: '',
      dogadjaj: '',
      ocjena: 0,
      komentar: '',
      datum: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error submitting review:', error)
  }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('hr-HR', options)
}
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