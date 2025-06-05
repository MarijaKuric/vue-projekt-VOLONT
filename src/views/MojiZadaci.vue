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
          @click="navigateTo('/ai')"
          class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow"
        >
          AI ALAT
        </button>
        <button 
          @click="navigateTo('/volonter-dogadaji')"
          class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow"
        >
          DOGAĐAJI
        </button>
        <button 
          @click="navigateTo('/moji-zadaci')"
          class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow"
        >
          MOJI ZADACI
        </button>
        <button 
          @click="navigateTo('/recenzije')"
          class="bg-pink-500 hover:bg-pink-700 text-white text-sm font-semibold py-3 px-6 rounded-full shadow"
        >
          RECENZIJE
        </button>
      </div>
    </div>

    <!-- Tasks Statistics -->
    <div class="w-full max-w-2xl space-y-8">
      <!-- Current Tasks -->
      <div :class="darkMode ? 'bg-gray-800' : 'bg-white'" class="rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-bold mb-4">Zadaci u tijeku:</h2>
        <div v-if="trenutniZadaci.length > 0">
          <div 
            v-for="(zadatak, index) in trenutniZadaci" 
            :key="index"
            class="mb-3 p-3 rounded-lg flex items-start gap-3"
            :class="darkMode ? 'bg-gray-700' : 'bg-gray-100'"
          >
            <input
              type="checkbox"
              v-model="zadatak.completed"
              @change="completeTask(zadatak, index)"
              class="mt-1 h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
            >
            <div>
              <p class="font-semibold">{{ zadatak.naziv }} ({{ zadatak.datum }})</p>
              <p class="text-sm mt-1">{{ zadatak.opis }}</p>
              <p class="text-xs mt-2">Događaj: {{ zadatak.dogadaj }}</p>
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
            <div>
              <p class="font-semibold">{{ zadatak.naziv }} ({{ zadatak.datum }})</p>
              <p class="text-sm mt-1">{{ zadatak.opis }}</p>
              <p class="text-xs mt-2">Događaj: {{ zadatak.dogadaj }}</p>
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
            class="bg-pink-500 h-4 rounded-full" 
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
        @click="navigateTo('/')"
        :class="darkMode ? 'text-white hover:text-blue-400' : 'text-black hover:text-blue-600'"
      >
        ⬅️ ODJAVA
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import { auth, db } from '../firebase'
import { collection, query, where, getDocs } from '../firebase'

const router = useRouter()

const trenutniZadaci = ref([])
const zavrseniZadaci = ref([])

onMounted(async () => {
  try {
    const user = auth.currentUser
    if (!user) return
    
    // Fetch tasks assigned to current user
    const q = query(
      collection(db, 'zadaci'),
      where('volonterId', '==', user.uid)
    )
    
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      const zadatak = { id: doc.id, ...doc.data() }
      if (zadatak.completed) {
        zavrseniZadaci.value.push(zadatak)
      } else {
        trenutniZadaci.value.push(zadatak)
      }
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
  }
})

const postotakRijesenosti = computed(() => {
  const totalTasks = trenutniZadaci.value.length + zavrseniZadaci.value.length
  return totalTasks > 0 
    ? Math.round((zavrseniZadaci.value.length / totalTasks) * 100) 
    : 0
})

async function completeTask(zadatak, index) {
  try {
    await updateDoc(doc(db, 'zadaci', zadatak.id), {
      completed: true,
      completedAt: new Date()
    })
    
    zadatak.completed = true
    trenutniZadaci.value.splice(index, 1)
    zavrseniZadaci.value.push(zadatak)
  } catch (error) {
    console.error('Error completing task:', error)
  }
}

async function uncompleteTask(zadatak, index) {
  try {
    await updateDoc(doc(db, 'zadaci', zadatak.id), {
      completed: false,
      completedAt: null
    })
    
    zadatak.completed = false
    zavrseniZadaci.value.splice(index, 1)
    trenutniZadaci.value.push(zadatak)
  } catch (error) {
    console.error('Error uncompleting task:', error)
  }
}

defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function
})
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