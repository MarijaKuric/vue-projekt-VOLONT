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
        <button @click="router.push('/ai')" class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow">
          AI ALAT
        </button>
        <button @click="router.push('/volonter-dogadaji')" class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow">
          DOGAĐAJI
        </button>
        <button @click="router.push('/moji-zadaci')" class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow">
          MOJI ZADACI
        </button>
        <button @click="router.push('/recenzije')" class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow">
          RECENZIJE
        </button>
      </div>
    </div>

    <!-- Events grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
      <div
        v-for="(dogadaj, index) in dogadaji"
        :key="index"
        :class="darkMode ? 'bg-gray-800' : 'bg-white'"
        class="rounded-xl shadow-lg p-6 transition-transform hover:scale-105"
      >
        <p class="font-bold text-lg mb-2">
          <span :class="darkMode ? 'text-white' : 'text-black'">Naziv:</span> {{ dogadaj.naziv }}
        </p>
        <p class="mb-1"><span :class="darkMode ? 'text-white' : 'text-black'">Lokacija:</span> {{ dogadaj.lokacija }}</p>
        <p class="mb-4"><span :class="darkMode ? 'text-white' : 'text-black'">Datum:</span> {{ dogadaj.datum }}</p>

        <button
          @click="dogadaj.prikaziZadatke = !dogadaj.prikaziZadatke"
          class="w-full bg-indigo-600 hover:bg-indigo-800 text-white font-semibold py-2 rounded-full shadow"
        >
          {{ dogadaj.prikaziZadatke ? 'SAKRIJ ZADATKE' : 'PRIKAŽI ZADATKE' }}
        </button>

        <div v-if="dogadaj.prikaziZadatke" class="mt-4 space-y-3">
          <div
            v-for="(zadatak, i) in dogadaj.zadaci"
            :key="i"
            :class="darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-dark'"
            class="p-3 rounded-lg shadow"
          >
            <p class="font-bold text-indigo-500 mb-1">{{ i + 1 }}. ZADATAK</p>
            <p class="text-sm"><span class="font-semibold">Broj volontera:</span> {{ zadatak.broj }}</p>
            <p class="text-sm mb-2"><span class="font-semibold">Opis:</span> {{ zadatak.opis }}</p>
            <button
              @click="toggleZadatak(dogadaj.id, i)"
              :disabled="zadatak.zauzeto && !isMyTask(zadatak)"
              :class="getButtonClass(zadatak)"
              class="w-full py-1 rounded-full text-white font-semibold text-sm"
            >
              {{ getButtonText(zadatak) }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="mt-4">
      <p :class="darkMode ? 'text-white' : 'text-black'">Učitava...</p>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db, collection, doc, updateDoc, onSnapshot, getDoc } from '@/firebase'

const router = useRouter()
const dogadaji = ref([])
const loading = ref(false)
const darkMode = ref(false)
let unsubscribe = null

onMounted(async () => {
  try {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode) {
      darkMode.value = JSON.parse(savedDarkMode)
    }

    unsubscribe = onSnapshot(collection(db, 'dogadaji'), (snapshot) => {
      dogadaji.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        prikaziZadatke: false
      }))
    })
  } catch (error) {
    console.error('Greška pri dohvaćanju događaja:', error)
    alert('Greška pri učitavanju događaja')
  }
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

function toggleDarkMode() {
  darkMode.value = !darkMode.value
  localStorage.setItem('darkMode', JSON.stringify(darkMode.value))
}

function isMyTask(zadatak) {
  const user = auth.currentUser
  return user && zadatak.volonterId === user.uid
}

function getButtonClass(zadatak) {
  if (!zadatak.zauzeto) {
    return 'bg-green-400 hover:bg-green-700'
  } else if (isMyTask(zadatak)) {
    return 'bg-orange-500 hover:bg-orange-700'
  } else {
    return 'bg-red-500 cursor-not-allowed'
  }
}

function getButtonText(zadatak) {
  if (!zadatak.zauzeto) {
    return 'PRIJAVI SE'
  } else if (isMyTask(zadatak)) {
    return 'ODUSTANI'
  } else {
    return 'ZAUZETO: ' + (zadatak.ime || 'Nepoznato')
  }
}

async function toggleZadatak(dogadajId, zadatakIndex) {
  const user = auth.currentUser
  if (!user) {
    await router.push('/prijava')
    return
  }

  if (loading.value) return
  loading.value = true

  try {
    // Dohvati najnovije podatke o događaju
    const dogadajRef = doc(db, 'dogadaji', dogadajId)
    const dogadajSnapshot = await getDoc(dogadajRef)
    
    if (!dogadajSnapshot.exists()) {
      throw new Error('Događaj nije pronađen')
    }
    
    const dogadajData = dogadajSnapshot.data()
    if (!dogadajData.zadaci || !dogadajData.zadaci[zadatakIndex]) {
      throw new Error('Zadatak nije pronađen')
    }

    const zadatak = dogadajData.zadaci[zadatakIndex]
    
    // Kreiraj kopiju cijelog zadaci niza
    const updatedZadaci = [...dogadajData.zadaci]

    if (!zadatak.zauzeto) {
      // Prijavi se na zadatak
      updatedZadaci[zadatakIndex] = {
        ...zadatak,
        zauzeto: true,
        volonterId: user.uid,
        ime: user.displayName || user.email || 'Volonter',
        prijavljenoAt: new Date().toISOString(),
        completed: false // Dodano za praćenje stanja
      }
    } else if (isMyTask(zadatak)) {
      // Odustani od zadatka
      updatedZadaci[zadatakIndex] = {
        ...zadatak,
        zauzeto: false,
        volonterId: null,
        ime: null,
        prijavljenoAt: null,
        odustaoAt: new Date().toISOString(),
        completed: false
      }
    } else {
      // Ne smije ažurirati tuđe zadatke
      return
    }

    // Debug ispis
    console.log('Ažuriram dogadaj:', dogadajId)
    console.log('Korisnik:', user.uid)
    console.log('Originalni zadaci:', dogadajData.zadaci)
    console.log('Novi zadaci:', updatedZadaci)
    
    // Ažuriraj cijeli zadaci niz
    await updateDoc(dogadajRef, {
      zadaci: updatedZadaci
    })

  } catch (error) {
    console.error('Greška pri upravljanju zadatkom:', error)
    alert(`Greška: ${error.message || 'Nepoznata greška'}`)
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