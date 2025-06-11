<template>
  <div>
    <input
      v-model="pitanje"
      type="text"
      placeholder="Unesi svoje interese ili vještine..."
      class="w-full p-3 border rounded mb-4"
    />
    <button
      @click="dajPreporuke"
      class="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded"
    >
      Preporuči zadatke
    </button>

    <div v-if="preporuke.length" class="mt-4 space-y-2">
      <h3 class="font-bold">Preporučeni zadaci:</h3>
      <ul class="list-disc pl-5">
        <li v-for="zad in preporuke" :key="zad.id">{{ zad.naziv }}</li>
      </ul>
    </div>

    <div v-else-if="pitanje && !preporuke.length" class="mt-4 italic text-sm text-gray-500">
      Nema zadataka koji odgovaraju tvom unosu.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { preporuciZadatke } from '../utils/preporuke'

const pitanje = ref('')
const preporuke = ref([])

function dajPreporuke() {
  preporuke.value = preporuciZadatke(pitanje.value)
}
</script>
