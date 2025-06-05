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

    <!-- Events grid - max 3 per row -->
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

        <!-- Tasks -->
        <div v-if="dogadaj.prikaziZadatke" class="mt-4 space-y-3">
          <div
            v-for="(zadatak, i) in dogadaj.zadaci"
            :key="i"
            :class="darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-dark'"
            class="p-3 rounded-lg shadow"
          >
            <p class="font-bold text-indigo-500 mb-1">
              {{ i + 1 }}. ZADATAK
            </p>
            <p class="text-sm"><span class="font-semibold">Broj volontera:</span> {{ zadatak.broj }}</p>
            <p class="text-sm mb-2"><span class="font-semibold">Opis:</span> {{ zadatak.opis }}</p>
            <button
              @click="prijaviSe(dogadaj.id, i)"
              :disabled="zadatak.zauzeto"
              :class="[ 
                'w-full py-1 rounded-full text-white font-semibold text-sm',
                zadatak.zauzeto ? 'bg-red-500 cursor-not-allowed' : 'bg-green-400 hover:bg-green-700'
              ]"
            >
              {{ zadatak.zauzeto ? 'ZAUZETO: ' + zadatak.ime : 'PRIJAVI SE' }}
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
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

const router = useRouter()

defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function
})

// Simulated data with more events for demonstration
const dogadaji = reactive([
  {
    id: 1,
    naziv: 'IT-Konferencija',
    lokacija: 'Pula',
    datum: '05.05.2026.',
    prikaziZadatke: false,
    zadaci: [
      {
        broj: 1,
        opis: 'Davanje uputa posjetiteljima',
        zauzeto: false,
        ime: ''
      },
      {
        broj: 2,
        opis: 'Postavljanje opreme',
        zauzeto: false,
        ime: ''
      }
    ]
  },
  {
    id: 2,
    naziv: 'Web Hackathon',
    lokacija: 'Zagreb',
    datum: '12.06.2026.',
    prikaziZadatke: false,
    zadaci: [
      {
        broj: 1,
        opis: 'Registracija timova',
        zauzeto: false,
        ime: ''
      }
    ]
  },
  {
    id: 3,
    naziv: 'Edukacija za Seniore',
    lokacija: 'Rijeka',
    datum: '20.07.2026.',
    prikaziZadatke: false,
    zadaci: [
      {
        broj: 3,
        opis: 'Pomoć pri korištenju pametnih telefona',
        zauzeto: false,
        ime: ''
      }
    ]
  },
  {
    id: 4,
    naziv: 'Radionica programiranja',
    lokacija: 'Split',
    datum: '15.08.2026.',
    prikaziZadatke: false,
    zadaci: [
      {
        broj: 2,
        opis: 'Pomoć učesnicima radionice',
        zauzeto: false,
        ime: ''
      }
    ]
  }
])

function prijaviSe(dogadajId, zadatakIndex) {
  const dogadaj = dogadaji.find((d) => d.id === dogadajId)
  const zadatak = dogadaj.zadaci[zadatakIndex]
  zadatak.zauzeto = true
  zadatak.ime = 'Ime Prezime' // Will be replaced with real name from auth later
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