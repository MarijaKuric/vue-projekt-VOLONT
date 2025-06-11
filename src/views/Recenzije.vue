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

    <!-- Success/Error Messages -->
    <div v-if="message" class="w-full max-w-2xl mb-4">
      <div 
        :class="messageType === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'"
        class="border px-4 py-3 rounded"
      >
        {{ message }}
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="isLoading" class="w-full max-w-2xl mb-4 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      <p class="mt-2" :class="darkMode ? 'text-white' : 'text-black'">Učitavanje...</p>
    </div>

    <!-- Review Form -->
    <div :class="darkMode ? 'bg-gray-800' : 'bg-white'" class="w-full max-w-2xl rounded-xl shadow-lg p-6 mb-8">
      <h2 class="text-xl font-bold mb-4" :class="darkMode ? 'text-white' : 'text-black'">Ostavite recenziju na događaj</h2>
      <form @submit.prevent="submitReview">
        <div class="mb-4">
          <label class="block mb-2 font-medium" :class="darkMode ? 'text-white' : 'text-black'">Događaj:</label>
          <select
            v-model="newReview.dogadjaj"
            required
            :class="darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'"
            class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Odaberite događaj</option>
            <option v-for="event in availableEvents" :key="event.id" :value="event.naziv || event.naslov || event.title">
              {{ event.naziv || event.naslov || event.title }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium" :class="darkMode ? 'text-white' : 'text-black'">Vaše ime:</label>
          <input
            v-model="newReview.ime"
            type="text"
            required
            :class="darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'"
            class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Vaše ime"
          >
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium" :class="darkMode ? 'text-white' : 'text-black'">Ocjena (1-5):</label>
          <div class="flex items-center space-x-2">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              @click="newReview.ocjena = n"
              class="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              :class="{
                'bg-pink-500 text-white hover:bg-pink-600': n <= newReview.ocjena,
                'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500': n > newReview.ocjena
              }"
            >
              {{ n }}
            </button>
          </div>
          <p class="text-sm mt-2" :class="darkMode ? 'text-gray-300' : 'text-gray-600'">
            Trenutna ocjena: {{ newReview.ocjena || 'Nije odabrana' }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium" :class="darkMode ? 'text-white' : 'text-black'">Komentar:</label>
          <textarea
            v-model="newReview.komentar"
            required
            rows="4"
            maxlength="500"
            :class="darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'"
            class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Opišite svoje iskustvo s događajem..."
          ></textarea>
          <p class="text-sm mt-1 text-right" :class="darkMode ? 'text-gray-300' : 'text-gray-600'">
            {{ newReview.komentar.length }}/500
          </p>
        </div>

        <button
          type="submit"
          :disabled="newReview.ocjena === 0 || isSubmitting"
          class="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow transition-colors"
        >
          {{ isSubmitting ? 'UNOSIM...' : 'UNESI RECENZIJU' }}
        </button>
      </form>
    </div>

    <!-- Filter and Sort Options -->
    <div class="w-full max-w-2xl mb-4">
      <div class="flex flex-wrap gap-4 items-center justify-between">
        <select
          v-model="filterEvent"
          :class="darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'"
          class="p-2 rounded border"
        >
          <option value="">Svi događaji</option>
          <option v-for="event in uniqueEvents" :key="event" :value="event">
            {{ event }}
          </option>
        </select>
        
        <select
          v-model="sortOrder"
          :class="darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'"
          class="p-2 rounded border"
        >
          <option value="newest">Najnovije</option>
          <option value="oldest">Najstarije</option>
          <option value="highest">Najveća ocjena</option>
          <option value="lowest">Najmanja ocjena</option>
        </select>
      </div>
    </div>

    <!-- Reviews List -->
    <div class="w-full max-w-2xl space-y-6">
      <h2 class="text-xl font-bold mb-4" :class="darkMode ? 'text-white' : 'text-black'">
        Recenzije volontera ({{ filteredReviews.length }})
      </h2>

      <div 
        v-for="recenzija in filteredReviews"
        :key="recenzija.id"
        :class="darkMode ? 'bg-gray-800' : 'bg-white'"
        class="rounded-xl shadow-lg p-6 transition-all hover:shadow-xl"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="font-bold text-lg" :class="darkMode ? 'text-white' : 'text-black'">{{ recenzija.ime }}</h3>
            <p class="text-sm" :class="darkMode ? 'text-gray-300' : 'text-gray-600'">
              {{ formatDate(recenzija.datum) }}
            </p>
            <p class="text-sm italic font-medium" :class="darkMode ? 'text-pink-400' : 'text-pink-600'">
              Događaj: {{ recenzija.dogadjaj }}
            </p>
          </div>
          <div class="flex items-center bg-pink-50 dark:bg-pink-900 px-3 py-1 rounded-full">
            <span class="text-sm font-bold mr-2" :class="darkMode ? 'text-white' : 'text-black'">
              {{ recenzija.ocjena }}/5
            </span>
            <div class="flex">
              <span
                v-for="n in 5"
                :key="n"
                class="text-lg"
                :class="n <= recenzija.ocjena ? 'text-pink-500' : 'text-gray-300 dark:text-gray-600'"
              >
                ★
              </span>
            </div>
          </div>
        </div>
        <p class="font-medium leading-relaxed" :class="darkMode ? 'text-gray-200' : 'text-gray-700'">
          {{ recenzija.komentar }}
        </p>
      </div>

      <p
        v-if="filteredReviews.length === 0 && !isLoading"
        class="text-center italic py-8"
        :class="darkMode ? 'text-gray-400' : 'text-gray-500'"
      >
        {{ filterEvent ? 'Nema recenzija za odabrani događaj.' : 'Još nema recenzija. Budite prvi koji će ostaviti dojam!' }}
      </p>
    </div>

    <!-- Logout -->
    <br>
    <div class="mt-auto mb-6">
      <button
        class="text-sm font-medium hover:underline transition-colors"
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
import { ref, onMounted, computed } from 'vue'
import { auth, db } from '@/firebase'
import { 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp, 
  query, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore'

const router = useRouter()
const navigateTo = (path) => {
  router.push(path).catch(err => console.error('Navigation error:', err))
}

defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function
})

// State variables
const recenzije = ref([])
const availableEvents = ref([])
const isSubmitting = ref(false)
const isLoading = ref(true)
const message = ref('')
const messageType = ref('success')
const filterEvent = ref('')
const sortOrder = ref('newest')

const newReview = ref({
  ime: '',
  dogadjaj: '',
  ocjena: 0,
  komentar: ''
})

// Computed properties
const uniqueEvents = computed(() => {
  const events = [...new Set(recenzije.value.map(r => r.dogadjaj))]
  return events.filter(event => event)
})

const filteredReviews = computed(() => {
  let filtered = recenzije.value

  // Filter by event
  if (filterEvent.value) {
    filtered = filtered.filter(review => review.dogadjaj === filterEvent.value)
  }

  // Sort reviews
  filtered.sort((a, b) => {
    switch (sortOrder.value) {
      case 'newest':
        return new Date(b.datum?.toDate?.() || b.datum) - new Date(a.datum?.toDate?.() || a.datum)
      case 'oldest':
        return new Date(a.datum?.toDate?.() || a.datum) - new Date(b.datum?.toDate?.() || b.datum)
      case 'highest':
        return b.ocjena - a.ocjena
      case 'lowest':
        return a.ocjena - b.ocjena
      default:
        return 0
    }
  })

  return filtered
})

// Methods
const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

const loadReviews = async () => {
  try {
    isLoading.value = true
    
    // Set up real-time listener for reviews
    const reviewsQuery = query(collection(db, 'recenzije'), orderBy('datum', 'desc'))
    
    onSnapshot(reviewsQuery, (snapshot) => {
      recenzije.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      isLoading.value = false
    }, (error) => {
      console.error('Error listening to reviews:', error)
      showMessage('Greška pri dohvaćanju recenzija.', 'error')
      isLoading.value = false
    })
    
  } catch (error) {
    console.error('Error setting up reviews listener:', error)
    showMessage('Greška pri povezivanju s bazom podataka.', 'error')
    isLoading.value = false
  }
}

const loadEvents = async () => {
  try {
    const eventsSnapshot = await getDocs(collection(db, 'dogadaji'))
    availableEvents.value = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching events:', error)
    showMessage('Greška pri dohvaćanju događaja.', 'error')
  }
}

onMounted(async () => {
  await Promise.all([
    loadEvents(),
    loadReviews()
  ])
})

const submitReview = async () => {
  if (newReview.value.ocjena === 0) {
    showMessage('Molimo odaberite ocjenu prije unosa.', 'error')
    return
  }

  if (newReview.value.komentar.length < 10) {
    showMessage('Komentar mora imati najmanje 10 znakova.', 'error')
    return
  }

  if (!newReview.value.ime.trim()) {
    showMessage('Molimo unesite vaše ime.', 'error')
    return
  }

  if (!newReview.value.dogadjaj) {
    showMessage('Molimo odaberite događaj.', 'error')
    return
  }

  try {
    isSubmitting.value = true
    
    // Create review object for Firestore
    const reviewData = {
      ime: newReview.value.ime.trim(),
      dogadjaj: newReview.value.dogadjaj,
      ocjena: newReview.value.ocjena,
      komentar: newReview.value.komentar.trim(),
      datum: serverTimestamp(), // Firestore server timestamp
      korisnikId: auth.currentUser?.uid || null // Optional: track user if logged in
    }
    
    // Add to Firestore
    await addDoc(collection(db, 'recenzije'), reviewData)
    
    // Reset form
    newReview.value = {
      ime: '',
      dogadjaj: '',
      ocjena: 0,
      komentar: ''
    }

    showMessage('Recenzija je uspješno unesena!', 'success')
    
  } catch (error) {
    console.error('Error adding review:', error)
    showMessage('Greška pri unosu recenzije. Pokušajte ponovo.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Nepoznat datum'
  
  try {
    let date
    
    // Handle Firestore Timestamp
    if (timestamp?.toDate) {
      date = timestamp.toDate()
    } 
    // Handle regular Date object or ISO string
    else {
      date = new Date(timestamp)
    }
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    
    return date.toLocaleDateString('hr-HR', options)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Nepoznat datum'
  }
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