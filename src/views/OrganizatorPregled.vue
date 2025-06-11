<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase'
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'

const router = useRouter()
const dogadaji = ref([])
const loading = ref(true)

const { darkMode, toggleDarkMode } = inject('darkMode')

async function ucitajDogadaje() {
  try {
    loading.value = true
    const user = auth.currentUser
    if (!user) {
      router.push('/organizator/prijava')
      return
    }

    const q = query(
      collection(db, 'dogadaji'), 
      where('organizatorId', '==', user.uid)
    )
    const querySnapshot = await getDocs(q)
    
    dogadaji.value = []
    querySnapshot.forEach((doc) => {
      dogadaji.value.push({
        id: doc.id,
        ...doc.data()
      })
    })
  } catch (error) {
    console.error('Greška pri učitavanju događaja:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  ucitajDogadaje()
})

function formatDatum(datumString) {
  if (!datumString) return ''
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(datumString).toLocaleDateString('hr-HR', options)
}

function urediZadatke(dogadajId) {
  router.push(`/organizator/unos-zadatka/${dogadajId}`)
}

async function obrisiDogadaj(dogadajId) {
  if (confirm('Jeste li sigurni da želite obrisati ovaj događaj i sve njegove zadatke?')) {
    try {
      await deleteDoc(doc(db, 'dogadaji', dogadajId))
      await ucitajDogadaje()
    } catch (error) {
      console.error('Greška pri brisanju događaja:', error)
      alert('Došlo je do greške pri brisanju događaja')
    }
  }
}

async function odjava() {
  try {
    await signOut(auth)
    router.push('/')
  } catch (error) {
    console.error('Greška pri odjavi:', error)
  }
}
</script>

<template>
  <div
    :class="darkMode ? 'bg-dark text-white' : 'bg-light text-dark'"
    class="min-h-screen flex flex-col items-center justify-start py-6 px-6 transition-colors duration-500"
  >
    <div class="w-full flex justify-end mb-4">
      <button
        @click="toggleDarkMode"
        class="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold py-2 px-4 rounded-full shadow"
      >
        {{ darkMode ? 'SVIJETLI NAČIN' : 'TAMNI NAČIN' }}
      </button>
    </div>

    <div class="text-center">
      <h1 class="text-pink-500 text-5xl font-bold italic mb-8">VolontIT</h1>

      <div class="flex flex-wrap gap-4 justify-center mb-8">
        <button
          @click="router.push('/organizator/unos-dogadaja')"
          class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow"
        >
          UNOS DOGAĐAJA
        </button>
        <button
          @click="router.push('/organizator/unos-zadatka')"
          class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow"
        >
          UNOS ZADATKA
        </button>
        <button
          @click="router.push('/organizator/pregled')"
          class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow"
        >
          PREGLED
        </button>
      </div>
    </div>

    <div class="w-full max-w-4xl px-4">
      <h2 class="text-2xl font-semibold mb-6 text-center" :class="darkMode ? 'text-white' : 'text-gray-800'">
        Pregled Kreiranih Događaja
      </h2>
      
      <div v-if="loading" class="text-center py-10">
        <p :class="darkMode ? 'text-gray-400' : 'text-gray-600'">Učitavanje događaja...</p>
      </div>
      
      <div v-else-if="dogadaji.length === 0" class="text-center py-10">
        <p :class="darkMode ? 'text-gray-400' : 'text-gray-600'">Nema kreiranih događaja.</p>
        <button
          @click="router.push('/organizator/unos-dogadaja')"
          class="mt-4 bg-green-500 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-full shadow"
        >
          Kreiraj prvi događaj
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="dogadaj in dogadaji"
          :key="dogadaj.id"
          :class="darkMode ? 'bg-gray-800' : 'bg-white'"
          class="rounded-xl shadow-lg p-6 flex flex-col justify-between"
        >
          <div>
            <h3 class="font-bold text-lg mb-2" :class="darkMode ? 'text-pink-400' : 'text-pink-600'">{{ dogadaj.naziv }}</h3>
            <p class="text-sm mb-1"><span class="font-semibold">Lokacija:</span> {{ dogadaj.lokacija }}</p>
            <p class="text-sm mb-3"><span class="font-semibold">Datum:</span> {{ formatDatum(dogadaj.datum) }}</p>
            <p class="text-sm mb-3"><span class="font-semibold">Broj zadataka:</span> {{ dogadaj.zadaci ? dogadaj.zadaci.length : 0 }}</p>
          </div>
          <div class="mt-4 flex flex-col space-y-2">
            <button
              @click="urediZadatke(dogadaj.id)"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full shadow text-sm"
            >
              Uredi Zadatke
            </button>
            <button
              @click="obrisiDogadaj(dogadaj.id)"
              class="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full shadow text-sm"
            >
              Obriši Događaj
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12 mb-6 text-center">
      <button
        class="text-sm font-medium hover:underline"
        @click="odjava"
        :class="darkMode ? 'text-white hover:text-blue-400' : 'text-black hover:text-blue-600'"
      >
        ⬅️ ODJAVA
      </button>
    </div>
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