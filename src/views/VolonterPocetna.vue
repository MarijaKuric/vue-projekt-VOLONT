<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, signOut, onAuthStateChanged } from '@/firebase'

const router = useRouter()
const isLoading = ref(true)
const currentUser = ref(null)

onMounted(() => {
  // Slušaj promjene stanja autentifikacije
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
      currentUser.value = user
      isLoading.value = false
    } else {
      // Ako nema korisnika ili email nije verificiran, preusmjeri na prijavu
      router.replace('/prijava')
    }
  })

  // Cleanup listener when component is unmounted
  return () => unsubscribe()
})

const handleSignOut = async () => {
  try {
    await signOut(auth)
    router.replace('/')
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
    <!-- Loading spinner -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
    </div>

    <!-- Main content -->
    <div v-else class="w-full">
      <div class="w-full flex justify-between items-center mb-4">
        <div>
          <p class="text-sm" :class="darkMode ? 'text-gray-300' : 'text-gray-600'">
            Dobrodošli, {{ currentUser?.displayName || currentUser?.email }}!
          </p>
        </div>
        <button
          @click="toggleDarkMode"
          class="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold py-2 px-4 rounded-full shadow"
        >
          {{ darkMode ? 'SVIJETLI NAČIN' : 'TAMNI NAČIN' }}
        </button>
      </div>

      <div class="text-center">
        <h1 class="text-pink-500 text-5xl font-bold italic mb-8">VolontIT</h1>
        <p class="mb-8 text-lg" :class="darkMode ? 'text-gray-300' : 'text-gray-600'">
          Vaš portal za volontiranje
        </p>

        <div class="flex flex-wrap gap-4 justify-center">
          <button 
            @click="router.push('/ai')"
            class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow transition"
          >
            AI ALAT
          </button>
          <button 
            @click="router.push('/volonter-dogadaji')"
            class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow transition"
          >
            DOGAĐAJI
          </button>
          <button 
            @click="router.push('/moji-zadaci')"
            class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow transition"
          >
            MOJI ZADACI
          </button>
          <button 
            @click="router.push('/recenzije')"
            class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow transition"
          >
            RECENZIJE
          </button>
        </div>
      </div>

      <div class="mt-auto mb-6 text-center">
        <button
          @click="handleSignOut"
          class="text-sm font-medium hover:underline transition"
          :class="darkMode ? 'text-white hover:text-red-400' : 'text-black hover:text-red-600'"
        >
          ⬅️ ODJAVA
        </button>
      </div>
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