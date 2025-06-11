<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { db, collection, onSnapshot } from '@/firebase' // import Firebase funkcija
import TamniNacin from '@/components/TamniNacin.vue'

const router = useRouter()

defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function
})

const dogadaji = ref([])
let unsubscribe = null

onMounted(() => {
  try {
    unsubscribe = onSnapshot(collection(db, 'dogadaji'), (snapshot) => {
      dogadaji.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        prikaziZadatke: false
      }))
    })
  } catch (error) {
    console.error('Greška pri dohvaćanju događaja:', error)
  }
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

function prijaviSeGost() {
  router.push('/prijava')  // Gosta vodi na login stranicu
}
</script>

<template>
  <div
    :class="darkMode ? 'bg-dark text-white' : 'bg-white text-dark'"
    class="flex flex-col min-h-screen p-6 overflow-hidden transition-colors"
  >
    <div class="absolute top-4 right-4">
      <TamniNacin
        :darkMode="darkMode"
        @toggle="toggleDarkMode"
      />
    </div>

    <h1 class="text-3xl md:text-4xl font-bold text-pink-600 text-center mt-12 mb-8">
      VolontIT (Gost)
    </h1>

    <!-- Događaji i zadaci -->
<div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
  <div
    v-for="(dogadaj, index) in dogadaji"
    :key="dogadaj.id"
    :class="darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'"
    class="rounded-2xl p-6 shadow-lg"
  >
    <h2 class="text-xl md:text-2xl font-semibold mb-4 text-center">{{ dogadaj.naziv }}</h2>
    <p class="mb-1"><strong>Lokacija:</strong> {{ dogadaj.lokacija }}</p>
    <p class="mb-4"><strong>Datum:</strong> {{ dogadaj.datum }}</p>

    <button
      @click="dogadaj.prikaziZadatke = !dogadaj.prikaziZadatke"
      class="w-full bg-indigo-600 hover:bg-indigo-800 text-white font-semibold py-2 rounded-full shadow mb-4"
    >
      {{ dogadaj.prikaziZadatke ? 'SAKRIJ ZADATKE' : 'PRIKAŽI ZADATKE' }}
    </button>

    <div v-if="dogadaj.prikaziZadatke" class="space-y-3">
      <div
        v-for="(zadatak, i) in dogadaj.zadaci"
        :key="i"
        :class="darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-dark'"
        class="p-3 rounded-lg shadow"
      >
        <p class="font-bold text-indigo-500 mb-1">{{ i + 1 }}. ZADATAK</p>
        <p class="text-sm"><strong>Broj volontera:</strong> {{ zadatak.broj }}</p>
        <p class="text-sm mb-2"><strong>Opis:</strong> {{ zadatak.opis }}</p>
        <button
          @click="prijaviSeGost"
          :disabled="zadatak.zauzeto"
          :class="[
            'w-full py-1 rounded-full text-white font-semibold text-sm',
            zadatak.zauzeto ? 'bg-red-500 cursor-not-allowed' : 'bg-green-400 hover:bg-green-700'
          ]"
        >
          {{ zadatak.zauzeto ? 'ZAUZETO' : 'PRIJAVI SE' }}
        </button>
      </div>
    </div>
  </div>
</div>


    <div class="mt-auto flex justify-center mb-6">
      <button
        @click="router.push('/')"
        class="text-lg font-semibold transition transform hover:scale-105 cursor-pointer"
        :class="darkMode
          ? 'text-white hover:text-blue-500'
          : 'text-gray-700 hover:text-blue-500'"
      >
        ⬅️ POČETNA
      </button>
    </div>
  </div>
</template>

<style>
.bg-dark { background-color: #0d1321; }
.text-dark { color: #0d1321; }
</style>
