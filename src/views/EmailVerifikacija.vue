<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
    <div class="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
      <div v-if="verifikacijaUspjesna" class="space-y-4">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
          <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Email uspješno potvrđen!</h1>
        <p class="text-gray-600 dark:text-gray-300">Vaša email adresa je sada verificirana. Možete se prijaviti u svoj račun.</p>
        <button 
          @click="router.push('/prijava')"
          class="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-md transition"
        >
          Prijavi se
        </button>
      </div>

      <div v-else class="space-y-4">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
          <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Greška pri verifikaciji</h1>
        <p class="text-gray-600 dark:text-gray-300">{{ errorMessage }}</p>
        <button 
          @click="router.push('/')"
          class="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition"
        >
          Početna stranica
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth, applyActionCode } from '@/firebase'

const route = useRoute()
const router = useRouter()
const verifikacijaUspjesna = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const { oobCode } = route.query
    if (!oobCode) throw new Error('Nedostaje verifikacijski kod')
    
    await applyActionCode(auth, oobCode)
    verifikacijaUspjesna.value = true
  } catch (error) {
    console.error('Verifikacija error:', error)
    errorMessage.value = 'Link za verifikaciju je nevažeći ili je istekao. Molimo zatražite novi verifikacijski email.'
  }
})
</script>