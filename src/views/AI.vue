<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const { darkMode, toggleDarkMode } = inject('darkMode')

const zadaci = [
  {
    naziv: 'Registracija sudionika',
    pojmovi: ['registracija', 'prijava', 'info', 'sudionik', 'gost', 'dolazak']
  },
  {
    naziv: 'Tehnička podrška',
    pojmovi: ['tehničar', 'tehnika', 'računalo', 'it', 'oprema', 'spajanje', 'kabel']
  },
  {
    naziv: 'Fotografiranje događaja',
    pojmovi: ['foto', 'kamera', 'slikanje', 'snimanje', 'fotograf']
  },
  {
    naziv: 'Vođenje radionica',
    pojmovi: ['radionica', 'mentorstvo', 'vođenje', 'prezentacija', 'objašnjavanje', 'edukacija']
  },
  {
    naziv: 'Distribucija letaka',
    pojmovi: ['letak', 'letci', 'promocija', 'dijeljenje', 'informiranje', 'obavještavanje']
  }
]

const pitanje = ref('')
const preporuke = ref([])

function stem(word) {
  return word
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/(anje|enje|ivanje|iranje|acija|cija|ija|stvo|izam)$/, '')
    .replace(/(ima|ama|om|em|u|a|e|i|o|u|u)$/g, '')
    .replace(/[^a-zćčđšž]+/g, '')
}

const preporučiZadatke = () => {
  const unos = pitanje.value.trim().toLowerCase()
  if (!unos) {
    preporuke.value = ['⚠️ Unesi interes ili vještinu kako bismo mogli preporučiti zadatke.']
    return
  }

  const riječiUnosa = unos.split(/\s+/).map(stem)

  const rezultati = zadaci
    .map(zadatak => {
      const brojPoklapanja = zadatak.pojmovi.reduce((zbroj, pojam) => {
        const pojamStem = stem(pojam)
        return riječiUnosa.some(r => pojamStem.includes(r) || r.includes(pojamStem)) ? zbroj + 1 : zbroj
      }, 0)
      return { naziv: zadatak.naziv, bodovi: brojPoklapanja }
    })
    .filter(z => z.bodovi > 0)
    .sort((a, b) => b.bodovi - a.bodovi)

  if (rezultati.length > 0) {
    preporuke.value = rezultati.map(r => `✅ ${r.naziv} (${r.bodovi} povezane ključne riječi)`)
  } else {
    preporuke.value = [
      '❌ Nema direktnih podudaranja za unesen pojam.',
      '💡 Pokušaj s riječima poput: "računalo", "mentor", "kamera", "registracija"...'
    ]
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

    <div class="flex-grow flex items-center justify-center w-full">
      <div class="w-full max-w-2xl bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow-md p-6 space-y-4">
        <p class="text-base">
          Dobrodošao/la! Unesi svoj interes ili vještinu i dobit ćeš preporuke volonterskih zadataka temeljene na prepoznavanju ključnih pojmova.
        </p>

        <div class="border border-gray-300 dark:border-gray-600 rounded-md h-64 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-700">
          <ul class="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li v-for="(r, i) in preporuke" :key="i">{{ r }}</li>
            <li v-if="preporuke.length === 0" class="italic text-gray-500 dark:text-gray-400">
              ⌛ AI preporuke će se pojaviti ovdje...
            </li>
          </ul>
        </div>

        <div class="flex mt-4">
          <input
            v-model="pitanje"
            type="text"
            placeholder="Npr. 'tehnička podrška' ili 'fotografija'"
            class="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none dark:bg-gray-700 dark:text-white"
          />
          <button @click="preporučiZadatke" class="bg-pink-600 hover:bg-blue-500 text-white font-semibold px-4 rounded-r-md">
            ➤
          </button>
        </div>
      </div>
    </div>

    <div class="mt-auto mb-6">
      <br>
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

