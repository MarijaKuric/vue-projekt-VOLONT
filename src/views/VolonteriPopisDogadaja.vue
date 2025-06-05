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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db, collection, doc, updateDoc, onSnapshot } from '@/firebase'

const router = useRouter()
const dogadaji = ref([])
let unsubscribe = null

onMounted(async () => {
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

async function prijaviSe(dogadajId, zadatakIndex) {
  try {
    const user = auth.currentUser
    if (!user) {
      await router.push('/prijava')
      return
    }

    const dogadaj = dogadaji.value.find(d => d.id === dogadajId)
    const zadatak = dogadaj.zadaci[zadatakIndex]

    if (zadatak.zauzeto) return

    await updateDoc(doc(db, 'dogadaji', dogadajId), {
      [`zadaci.${zadatakIndex}.zauzeto`]: true,
      [`zadaci.${zadatakIndex}.volonterId`]: user.uid,
      [`zadaci.${zadatakIndex}.ime`]: user.displayName || 'Volonter',
      [`zadaci.${zadatakIndex}.prijavljenoAt`]: new Date().toISOString()
    })

    // Ne trebamo ručno ažurirati lokalno stanje jer će onSnapshot osvježiti
  } catch (error) {
    console.error('Greška prilikom prijave na zadatak:', error)
    alert('Došlo je do greške pri prijavi na zadatak')
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
