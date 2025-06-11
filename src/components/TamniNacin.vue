<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({ darkMode: Boolean })
const emit = defineEmits(['toggle'])

function onClick() {
  emit('toggle')
}
</script>

<template>
  <button
    @click="onClick"
    class="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full text-sm shadow-md cursor-pointer"
  >
    {{ props.darkMode ? 'SVIJETLI NAČIN' : 'TAMNI NAČIN' }}
  </button>
</template>
