<script setup>
import { ref, computed, watch, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth, db } from '@/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'

const { darkMode, toggleDarkMode } = inject('darkMode')

const router = useRouter()
const route = useRoute()

const dogadajId = ref(null)
const dogadaj = ref(null)
const prikaziFormu = ref(false)
const urediIndex = ref(null)
const isLoading = ref(false)
const error = ref('')

const noviZadatak = ref({
  brojVolontera: null,
  opis: ''
})

const isFormValid = computed(() => {
  return noviZadatak.value.brojVolontera && noviZadatak.value.brojVolontera > 0 &&
         noviZadatak.value.opis.trim() !== ''
})

watch(
  () => route.params.id,
  async (newId) => {
    dogadajId.value = newId ? newId : null
    if (dogadajId.value) {
      await ucitajDogadaj()
    } else {
      dogadaj.value = null
    }
    prikaziFormu.value = false
    urediIndex.value = null
    noviZadatak.value = { brojVolontera: null, opis: '' }
  },
  { immediate: true }
)

async function ucitajDogadaj() {
  if (!dogadajId.value) {
    dogadaj.value = null
    return
  }
  
  try {
    error.value = ''
    const docSnap = await getDoc(doc(db, 'dogadaji', dogadajId.value))
    if (docSnap.exists()) {
      dogadaj.value = { id: docSnap.id, ...docSnap.data() }
      // Ensure zadaci array exists
      if (!dogadaj.value.zadaci) {
        dogadaj.value.zadaci = []
      }
    } else {
      error.value = `Događaj s ID ${dogadajId.value} nije pronađen.`
      setTimeout(() => {
        router.push('/organizator/pregled')
      }, 2000)
    }
  } catch (err) {
    console.error('Error loading event:', err)
    error.value = 'Greška pri učitavanju događaja'
  }
}

async function dodajZadatak() {
  if (!isFormValid.value || !dogadaj.value || isLoading.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    const noviZadatakData = {
      brojVolontera: noviZadatak.value.brojVolontera,
      opis: noviZadatak.value.opis.trim(),
      zauzeto: false,
      ime: '',
      createdAt: new Date().toISOString()
    }
    
    const azuriraniZadaci = [...(dogadaj.value.zadaci || []), noviZadatakData]
    
    await updateDoc(doc(db, 'dogadaji', dogadaj.value.id), {
      zadaci: azuriraniZadaci,
      updatedAt: new Date().toISOString()
    })
    
    noviZadatak.value = { brojVolontera: null, opis: '' }
    await ucitajDogadaj()
    prikaziFormu.value = false
  } catch (err) {
    console.error('Error adding task:', err)
    error.value = 'Greška pri dodavanju zadatka'
  } finally {
    isLoading.value = false
  }
}

async function obrisiZadatak(zadatakIndex) {
  if (!dogadaj.value || !confirm('Jeste li sigurni da želite obrisati ovaj zadatak?')) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    const azuriraniZadaci = dogadaj.value.zadaci.filter((_, index) => index !== zadatakIndex)
    
    await updateDoc(doc(db, 'dogadaji', dogadaj.value.id), {
      zadaci: azuriraniZadaci,
      updatedAt: new Date().toISOString()
    })
    
    await ucitajDogadaj()
  } catch (err) {
    console.error('Error deleting task:', err)
    error.value = 'Greška pri brisanju zadatka'
  } finally {
    isLoading.value = false
  }
}

async function azurirajZadatak() {
  if (!isFormValid.value || urediIndex.value === null || !dogadaj.value || isLoading.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    const azuriraniZadaci = [...dogadaj.value.zadaci]
    azuriraniZadaci[urediIndex.value] = {
      ...azuriraniZadaci[urediIndex.value],
      brojVolontera: noviZadatak.value.brojVolontera,
      opis: noviZadatak.value.opis.trim(),
      updatedAt: new Date().toISOString()
    }
    
    await updateDoc(doc(db, 'dogadaji', dogadaj.value.id), {
      zadaci: azuriraniZadaci,
      updatedAt: new Date().toISOString()
    })
    
    ponistiUredivanje()
    await ucitajDogadaj()
  } catch (err) {
    console.error('Error updating task:', err)
    error.value = 'Greška pri ažuriranju zadatka'
  } finally {
    isLoading.value = false
  }
}

function urediZadatak(zadatakIndex) {
  if (dogadaj.value && dogadaj.value.zadaci && dogadaj.value.zadaci[zadatakIndex]) {
    urediIndex.value = zadatakIndex
    noviZadatak.value = {
      brojVolontera: dogadaj.value.zadaci[zadatakIndex].brojVolontera,
      opis: dogadaj.value.zadaci[zadatakIndex].opis
    }
    prikaziFormu.value = true
  }
}

function ponistiUredivanje() {
  urediIndex.value = null
  noviZadatak.value = { brojVolontera: null, opis: '' }
  prikaziFormu.value = false
}

function navigateToUnosZadatka() {
  router.push('/organizator/unos-zadatka')
}

function formatDatum(datumString) {
  if (!datumString) return ''
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(datumString).toLocaleDateString('hr-HR', options)
}

async function odjava() {
  try {
    await signOut(auth)
    router.push('/')
  } catch (error) {
    console.error('Greška pri odjavi:', error)
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
          @click="navigateToUnosZadatka"
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

    <div
      v-if="dogadaj"
      :class="darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'"
      class="w-full max-w-md rounded-xl shadow-lg p-6 mb-6"
    >
      <p class="font-bold text-lg mb-2">
        <span :class="darkMode ? 'text-white' : 'text-gray-700'">Naziv:</span> {{ dogadaj.naziv }}
      </p>
      <p class="mb-1"><span :class="darkMode ? 'text-white' : 'text-gray-600'">Lokacija:</span> {{ dogadaj.lokacija }}</p>
      <p class="mb-4"><span :class="darkMode ? 'text-white' : 'text-gray-600'">Datum:</span> {{ formatDatum(dogadaj.datum) }}</p>

      <div v-if="dogadaj.zadaci && dogadaj.zadaci.length > 0" class="mt-4 space-y-3">
        <h4 class="text-md font-semibold mb-2" :class="darkMode ? 'text-white' : 'text-gray-600'">Postojeći zadaci:</h4>
        <div
          v-for="(zadatak, i) in dogadaj.zadaci"
          :key="i"
          :class="darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-dark'"
          class="p-3 rounded-lg shadow relative"
        >
          <button
            @click.stop="obrisiZadatak(i)"
            class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-medium py-1 px-2 rounded-md bg-white dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            OBRIŠI
          </button>

          <p class="font-bold text-indigo-500 dark:text-indigo-400 mb-1">
            {{ i + 1 }}. ZADATAK
          </p>
          <p class="text-sm"><span class="font-semibold">Broj volontera:</span> {{ zadatak.brojVolontera }}</p>
          <p class="text-sm mb-2"><span class="font-semibold">Opis:</span> {{ zadatak.opis }}</p>

          <button
            @click.stop="urediZadatak(i)"
            class="absolute bottom-2 right-2 text-blue-500 hover:text-blue-700 text-xs font-medium py-1 px-2 rounded-md bg-white dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            UREDI
          </button>
        </div>
      </div>
       <div v-else class="mt-4">
        <p :class="darkMode ? 'text-gray-400' : 'text-gray-500'">Trenutno nema unesenih zadataka za ovaj događaj.</p>
      </div>

      <button
        @click="prikaziFormu = !prikaziFormu"
        class="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-full shadow"
      >
        {{ prikaziFormu ? (urediIndex !== null ? 'ZATVORI UREĐIVANJE' : 'ZATVORI UNOS') : (dogadaj.zadaci && dogadaj.zadaci.length > 0 ? 'DODAJ NOVI ZADATAK' : 'UNESI PRVI ZADATAK') }}
      </button>
    </div>

    <div v-else class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6 text-center">
      <p :class="darkMode ? 'text-black' : 'text-black'">Molimo odaberite događaj za koji želite dodati ili urediti zadatke.</p>
      <p :class="darkMode ? 'text-gray-600' : 'text-gray-600'" class="text-sm mt-2">Možete odabrati događaj iz pregleda.</p>
      <button
        @click="router.push('/organizator/pregled')"
        class="mt-4 bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-2 px-4 rounded-full shadow"
      >
        Idi na Pregled događaja
      </button>
    </div>

    <div
      v-if="prikaziFormu && dogadaj"
      class="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg mb-8"
    >
      <h3 class="text-lg font-bold mb-4" :class="darkMode ? 'text-black' : 'text-gray-700'">
        {{ urediIndex !== null ? 'Uređivanje zadatka' : 'Unos novog zadatka' }}
      </h3>

      <div class="mb-4">
        <label
          for="brojVolontera"
          :class="darkMode ? 'text-black' : 'text-gray-700'"
          class="block mb-1 text-sm font-medium"
        >
          Broj potrebnih volontera<span class="text-blue-600">*</span>
        </label>
        <input
          v-model.number="noviZadatak.brojVolontera"
          id="brojVolontera"
          type="number"
          min="1"
          placeholder="Unesite broj..."
          :class="['w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500']"
        />
      </div>

      <div class="mb-6">
        <label
          for="opisZadatka"
          :class="darkMode ? 'text-black' : 'text-gray-700'"
          class="block mb-1 text-sm font-medium"
        >
          Opis zadatka<span class="text-blue-600">*</span>
        </label>
        <textarea
          v-model="noviZadatak.opis"
          id="opisZadatka"
          rows="3"
          placeholder="Detaljan opis zadatka..."
          :class="['w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500']"
        ></textarea>
      </div>

      <button
        @click="urediIndex !== null ? azurirajZadatak() : dodajZadatak()"
        :class="isFormValid ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-400 cursor-not-allowed'"
        class="w-full text-white py-3 rounded-full font-semibold shadow transition"
        :disabled="!isFormValid || isLoading"
      >
        {{ isLoading ? 'UČITAVANJE...' : (urediIndex !== null ? 'SPREMI PROMJENE' : 'DODAJ ZADATAK') }}
      </button>

      <button
        v-if="urediIndex !== null"
        @click="ponistiUredivanje"
        class="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-full font-semibold shadow transition"
      >
        ODUSTANI OD UREĐIVANJA
      </button>
    </div>

    <div v-if="error" class="w-full max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <div class="mt-auto mb-6">
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
input.text-black::placeholder, textarea.text-black::placeholder {
  color: #6b7280;
}
</style>