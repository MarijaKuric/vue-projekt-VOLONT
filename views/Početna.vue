<script setup>
import { defineProps } from 'vue';
import TamniNacin from '@/components/TamniNacin.vue';
import PocetnaLogo from '@/components/PocetnaLogo.vue';

const props = defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function,
  goToGost: Function,
  goToRegistracija: Function,
  goToPrijava: Function,
  goToOrganizatorPrijava: Function
});
</script>

<template>
  <div
    :class="props.darkMode ? 'bg-dark text-white' : 'bg-light text-dark'"
    class="min-h-screen flex flex-col items-center justify-center p-6 text-lg md:text-xl relative overflow-hidden transition-colors duration-500 font-sans font-semibold"
  >
    <!-- Pozadina -->
    <div class="absolute inset-0 z-0">
      <div
        :class="props.darkMode
          ? 'bg-gradient-to-br from-[#0d1321] to-[#1a2238]'
          : 'bg-gradient-to-br from-[#f9fafb] to-[#e3e9f0]'"
        class="w-full h-full"
      ></div>
    </div>

    <!-- Tamni način -->
    <div class="absolute top-4 right-4 z-10">
      <TamniNacin
        :darkMode="props.darkMode"
        @toggle="props.toggleDarkMode"
      />
    </div>

    <!-- Logo -->
    <div class="z-10 animate-fade-in">
      <PocetnaLogo :darkMode="props.darkMode" />
    </div>

    <!-- GOST -->
    <p class="z-10 mt-6 text-lg text-center animate-slide-up">
      Pogledaj događaje i zadatke kao
      <span
        @click="props.goToGost"
        class="ml-1 text-green-500 cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:text-green-400"
      >
        GOST
      </span>
    </p>

    <!-- REGISTRACIJA -->
    <button
      @click="props.goToRegistracija"
      class="z-10 mt-6 bg-pink-600 text-white px-10 py-3 rounded-full text-xl shadow-md hover:bg-pink-700 transition-transform duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-pink-400/40 animate-slide-up delay-75"
    >
      REGISTRIRAJ SE
    </button>

    <!-- Prijava -->
    <p class="z-10 mt-4 text-lg text-center animate-slide-up delay-100">
      Imate račun?
      <span
        @click="props.goToPrijava"
        class="ml-1 text-yellow-400 font-bold cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:text-yellow-300"
      >
        Prijavite se
      </span>
    </p>

    <!-- Organizator -->
    <p class="z-10 mt-2 text-lg text-center animate-slide-up delay-150">
      Prijavite se u sustav kao
      <span
        @click="props.goToOrganizatorPrijava"
        class="ml-1 text-indigo-400 cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:text-indigo-300"
      >
        ORGANIZATOR
      </span>
    </p>
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

/* Animacije */
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out both;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.6s ease-out both;
}
.animate-slide-up.delay-75 { animation-delay: 0.15s; }
.animate-slide-up.delay-100 { animation-delay: 0.}
</style>