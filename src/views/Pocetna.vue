<script setup>
import { useRouter } from 'vue-router'
import TamniNacin from '@/components/TamniNacin.vue'
import PocetnaLogo from '@/components/PocetnaLogo.vue'

const router = useRouter()
const props = defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function
})
</script>

<template>
  <div
    :class="{'bg-dark text-white': props.darkMode, 'bg-light text-dark': !props.darkMode}"
    class="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans font-semibold"
  >
    <div class="absolute inset-0 z-0">
      <div
        :class="props.darkMode
          ? 'bg-gradient-to-br from-[#0d1321] to-[#1a2238]'
          : 'bg-gradient-to-br from-[#f9fafb] to-[#e3e9f0]'"
        class="w-full h-full"
      ></div>
    </div>

    <div class="absolute top-4 right-4 z-10">
      <TamniNacin
        :darkMode="props.darkMode"
        @toggle="props.toggleDarkMode"
      />
    </div>

    <div class="z-10">
      <PocetnaLogo :darkMode="props.darkMode" />
    </div>

    <p class="z-10 mt-6 text-lg text-center">
      Pogledaj događaje i zadatke kao
      <span
        @click="router.push('/gost')"
        class="ml-1 text-green-500 cursor-pointer hover:text-green-400"
      >
        GOST
      </span>
    </p>

    <button
      @click="router.push('/registracija')"
      class="z-10 mt-6 bg-pink-600 hover:bg-pink-700 text-white px-10 py-3 rounded-full text-xl shadow-md focus:outline-none focus:ring-4 focus:ring-pink-400/40"
    >
      REGISTRIRAJ SE
    </button>

    <p class="z-10 mt-4 text-lg text-center">
      Imate račun?
      <span
        @click="router.push('/prijava')"
        class="ml-1 text-yellow-400 font-bold cursor-pointer hover:text-yellow-300"
      >
        Prijavite se
      </span>
    </p>

    <p class="z-10 mt-2 text-lg text-center">
      Prijavite se u sustav kao
      <span
        @click="router.push('/organizator')"
        class="ml-1 text-indigo-400 cursor-pointer hover:text-indigo-300"
      >
        ORGANIZATOR
      </span>
    </p>
  </div>
</template>