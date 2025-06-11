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

    <!-- Loading indicator -->
    <div v-if="loading" class="mb-4">
      <p :class="darkMode ? 'text-white' : 'text-black'">Učitava zadatke...</p>
    </div>

    <!-- Tasks Statistics -->
    <div class="w-full max-w-2xl space-y-8">
      <!-- Current Tasks -->
      <div :class="darkMode ? 'bg-gray-800' : 'bg-white'" class="rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-bold mb-4">Zadaci u tijeku:</h2>
        <div v-if="trenutniZadaci.length > 0">
          <div 
            v-for="(zadatak, index) in trenutniZadaci" 
            :key="'current-'+index"
            class="mb-3 p-3 rounded-lg flex items-start gap-3"
            :class="darkMode ? 'bg-gray-700' : 'bg-gray-100'"
          >
            <input
              type="checkbox"
              v-model="zadatak.completed"
              @change="completeTask(zadatak, index)"
              class="mt-1 h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
            >
            <div class="flex-1">
              <p class="font-semibold">{{ zadatak.opis }}</p>
              <p class="text-sm mt-1">Broj volontera potreban: {{ zadatak.broj }}</p>
              <p class="text-xs mt-2">Događaj: {{ zadatak.dogadajNaziv }} ({{ zadatak.dogadajDatum }})</p>
              <p class="text-xs">Lokacija: {{ zadatak.dogadajLokacija }}</p>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500 italic">Trenutno nemate zadataka u tijeku</p>
      </div>

      <!-- Completed Tasks -->
      <div :class="darkMode ? 'bg-gray-800' : 'bg-white'" class="rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-bold mb-4">Završeni zadaci:</h2>
        <div v-if="zavrseniZadaci.length > 0">
          <div 
            v-for="(zadatak, index) in zavrseniZadaci" 
            :key="'completed-'+index"
            class="mb-3 p-3 rounded-lg flex items-start gap-3"
            :class="darkMode ? 'bg-gray-700' : 'bg-gray-100'"
          >
            <input
              type="checkbox"
              v-model="zadatak.completed"
              @change="uncompleteTask(zadatak, index)"
              checked
              class="mt-1 h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
            >
            <div class="flex-1">
              <p class="font-semibold">{{ zadatak.opis }}</p>
              <p class="text-sm mt-1">Broj volontera potreban: {{ zadatak.broj }}</p>
              <p class="text-xs mt-2">Događaj: {{ zadatak.dogadajNaziv }} ({{ zadatak.dogadajDatum }})</p>
              <p class="text-xs">Lokacija: {{ zadatak.dogadajLokacija }}</p>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500 italic">Još niste završili nijedan zadatak</p>
      </div>

      <!-- Completion Rate -->
      <div :class="darkMode ? 'bg-gray-800' : 'bg-white'" class="rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-bold mb-4">Postotak riješenosti:</h2>
        <div class="w-full bg-gray-200 rounded-full h-4 mb-2" :class="darkMode ? 'bg-gray-600' : 'bg-gray-200'">
          <div 
            class="bg-pink-500 h-4 rounded-full transition-all duration-300" 
            :style="{ width: postotakRijesenosti + '%' }"
          ></div>
        </div>
        <p class="text-center font-bold">{{ postotakRijesenosti }}%</p>
      </div>
    </div>

    <!-- Logout -->
    <br>
    <div class="mt-auto mb-6">
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
import { useRouter } from 'vue-router'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { auth, db, collection, onSnapshot, doc, updateDoc, getDoc } from '@/firebase'

const router = useRouter()

const trenutniZadaci = ref([])
const zavrseniZadaci = ref([])
const loading = ref(true)
const darkMode = ref(false)
let unsubscribe = null

onMounted(async () => {
  try {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode) {
      darkMode.value = JSON.parse(savedDarkMode)
    }

    const user = auth.currentUser
    if (!user) {
      await router.push('/prijava')
      return
    }
    
    // Praćenje događaja u realnom vremenu
    unsubscribe = onSnapshot(collection(db, 'dogadaji'), (snapshot) => {
      const sviZadaci = []
      
      snapshot.docs.forEach(doc => {
        const dogadaj = doc.data()
        
        if (dogadaj.zadaci && Array.isArray(dogadaj.zadaci)) {
          dogadaj.zadaci.forEach((zadatak, index) => {
            // Provjeriti je li zadatak pripisan trenutnom korisniku
            if (zadatak.volonterId === user.uid) {
              sviZadaci.push({
                ...zadatak,
                dogadajId: doc.id,
                dogadajNaziv: dogadaj.naziv,
                dogadajDatum: dogadaj.datum,
                dogadajLokacija: dogadaj.lokacija,
                zadatakIndex: index,
                completed: zadatak.completed || false
              })
            }
          })
        }
      })
      
      // Razdvojiti trenutne i završene zadatke
      trenutniZadaci.value = sviZadaci.filter(zadatak => !zadatak.completed)
      zavrseniZadaci.value = sviZadaci.filter(zadatak => zadatak.completed)
      
      loading.value = false
    }, (error) => {
      console.error('Greška pri dohvaćanju zadataka:', error)
      loading.value = false
    })
    
  } catch (error) {
    console.error('Greška pri inicijalizaciji:', error)
    loading.value = false
  }
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const postotakRijesenosti = computed(() => {
  const totalTasks = trenutniZadaci.value.length + zavrseniZadaci.value.length
  return totalTasks > 0 
    ? Math.round((zavrseniZadaci.value.length / totalTasks) * 100) 
    : 0
})

function toggleDarkMode() {
  darkMode.value = !darkMode.value
  localStorage.setItem('darkMode', JSON.stringify(darkMode.value))
}

async function completeTask(zadatak, index) {
  try {
    loading.value = true
    
    // Dohvati događaj iz baze
    const dogadajRef = doc(db, 'dogadaji', zadatak.dogadajId)
    const dogadajSnapshot = await getDoc(dogadajRef)
    
    if (!dogadajSnapshot.exists()) {
      throw new Error('Događaj nije pronađen')
    }
    
    const dogadajData = dogadajSnapshot.data()
    const updatedZadaci = [...dogadajData.zadaci]
    
    // Ažuriraj zadatak kao završen
    updatedZadaci[zadatak.zadatakIndex] = {
      ...updatedZadaci[zadatak.zadatakIndex],
      completed: true,
      completedAt: new Date().toISOString()
    }
    
    // Spremi u bazu
    await updateDoc(dogadajRef, {
      zadaci: updatedZadaci
    })
    
  } catch (error) {
    console.error('Greška pri označavanju zadatka kao završenog:', error)
    alert('Greška pri ažuriranju zadatka')
  } finally {
    loading.value = false
  }
}

async function uncompleteTask(zadatak, index) {
  try {
    loading.value = true
    
    // Dohvati događaj iz baze
    const dogadajRef = doc(db, 'dogadaji', zadatak.dogadajId)
    const dogadajSnapshot = await getDoc(dogadajRef)
    
    if (!dogadajSnapshot.exists()) {
      throw new Error('Događaj nije pronađen')
    }
    
    const dogadajData = dogadajSnapshot.data()
    const updatedZadaci = [...dogadajData.zadaci]
    
    // Ažuriraj zadatak kao nezavršen
    updatedZadaci[zadatak.zadatakIndex] = {
      ...updatedZadaci[zadatak.zadatakIndex],
      completed: false,
      completedAt: null
    }
    
    // Spremi u bazu
    await updateDoc(dogadajRef, {
      zadaci: updatedZadaci
    })
    
  } catch (error) {
    console.error('Greška pri označavanju zadatka kao nezavršenog:', error)
    alert('Greška pri ažuriranju zadatka')
  } finally {
    loading.value = false
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