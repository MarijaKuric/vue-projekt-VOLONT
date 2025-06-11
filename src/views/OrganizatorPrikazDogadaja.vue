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

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-10">
      <p :class="darkMode ? 'text-gray-400' : 'text-gray-600'">Učitavanje događaja...</p>
    </div>

    <!-- No events -->
    <div v-else-if="dogadaji.length === 0" class="text-center py-10">
      <p :class="darkMode ? 'text-gray-400' : 'text-gray-600'">Trenutno nema dostupnih događaja.</p>
    </div>

    <!-- Events grid - max 3 per row -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
      <div
        v-for="dogadaj in dogadaji"
        :key="dogadaj.id"
        :class="darkMode ? 'bg-gray-800' : 'bg-white'"
        class="rounded-xl shadow-lg p-6 transition-transform hover:scale-105"
      >
        <p class="font-bold text-lg mb-2">
          <span :class="darkMode ? 'text-white' : 'text-black'">Naziv:</span> {{ dogadaj.naziv }}
        </p>
        <p class="mb-1"><span :class="darkMode ? 'text-white' : 'text-black'">Lokacija:</span> {{ dogadaj.lokacija }}</p>
        <p class="mb-4"><span :class="darkMode ? 'text-white' : 'text-black'">Datum:</span> {{ formatDatum(dogadaj.datum) }}</p>

        <button
          @click="togglePrikazZadataka(dogadaj.id)"
          class="w-full bg-indigo-600 hover:bg-indigo-800 text-white font-semibold py-2 rounded-full shadow"
        >
          {{ dogadajiMap[dogadaj.id]?.prikaziZadatke ? 'SAKRIJ ZADATKE' : 'PRIKAŽI ZADATKE' }}
        </button>

        <!-- Tasks -->
        <div v-if="dogadajiMap[dogadaj.id]?.prikaziZadatke && dogadaj.zadaci" class="mt-4 space-y-3">
          <div
            v-for="(zadatak, i) in dogadaj.zadaci"
            :key="i"
            :class="darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-dark'"
            class="p-3 rounded-lg shadow"
          >
            <p class="font-bold text-indigo-500 mb-1">
              {{ i + 1 }}. ZADATAK
            </p>
            <p class="text-sm"><span class="font-semibold">Broj volontera:</span> {{ zadatak.brojVolontera }}</p>
            <p class="text-sm mb-2"><span class="font-semibold">Opis:</span> {{ zadatak.opis }}</p>
            <button
              @click="prijaviSe(dogadaj.id, i)"
              :disabled="zadatak.zauzeto"
              :class="[ 
                'w-full py-1 rounded-full text-white font-semibold text-sm',
                zadatak.zauzeto ? 'bg-red-500 cursor-not-allowed' : 'bg-green-400 hover:bg-green-700'
              ]"
            >
              {{ zadatak.zauzeto ? 'ZAUZETO: ' + (zadatak.ime || '') : 'PRIJAVI SE' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout -->
    <div class="mt-12 mb-6">
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '@/firebase'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'

const router = useRouter()
const loading = ref(true)
const dogadaji = ref([])
const dogadajiMap = ref({})

// Fetch all events from Firebase
async function ucitajDogadaje() {
  try {
    loading.value = true
    const querySnapshot = await getDocs(collection(db, 'dogadaji'))
    
    dogadaji.value = []
    dogadajiMap.value = {}
    
    querySnapshot.forEach((doc) => {
      const dogadajData = {
        id: doc.id,
        ...doc.data()
      }
      dogadaji.value.push(dogadajData)
      dogadajiMap.value[doc.id] = {
        prikaziZadatke: false
      }
    })
  } catch (error) {
    console.error('Greška pri učitavanju događaja:', error)
  } finally {
    loading.value = false
  }
}

function togglePrikazZadataka(dogadajId) {
  if (dogadajiMap.value[dogadajId]) {
    dogadajiMap.value[dogadajId].prikaziZadatke = !dogadajiMap.value[dogadajId].prikaziZadatke
  }
}

async function prijaviSe(dogadajId, zadatakIndex) {
  try {
    const dogadaj = dogadaji.value.find(d => d.id === dogadajId)
    if (!dogadaj || !dogadaj.zadaci || !dogadaj.zadaci[zadatakIndex]) return
    
    // In a real app, you would get the current user's name here
    const imeVolontera = 'Ime Prezime' // Replace with actual user name
    
    const azuriraniZadaci = [...dogadaj.zadaci]
    azuriraniZadaci[zadatakIndex] = {
      ...azuriraniZadaci[zadatakIndex],
      zauzeto: true,
      ime: imeVolontera
    }
    
    await updateDoc(doc(db, 'dogadaji', dogadajId), {
      zadaci: azuriraniZadaci,
      updatedAt: new Date().toISOString()
    })
    
    // Refresh the data
    await ucitajDogadaje()
  } catch (error) {
    console.error('Greška pri prijavi na zadatak:', error)
  }
}

function formatDatum(datumString) {
  if (!datumString) return ''
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(datumString).toLocaleDateString('hr-HR', options)
}

onMounted(() => {
  ucitajDogadaje()
})

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