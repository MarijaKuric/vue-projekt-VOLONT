<script setup>
defineProps(['darkMode']);
</script>

<template>
    <div class="text-center mt-6 w-full max-w-lg mx-auto">
    
      <div class="flex items-center justify-center text-5xl md:text-6xl font-extrabold">
        <span class="text-pink-500">Volont</span><span class="italic text-pink-500">IT</span>
      </div>
  
      
      <p class="mt-3 italic" :class="{'text-gray-300': darkMode, 'text-gray-700': !darkMode}">
        Dobrodošli u web aplikaciju VolontIT!
      </p>
  
      
      <div class="p-6 rounded-2xl shadow-lg mt-8 max-w-md mx-auto text-base md:text-lg text-center" 
           :class="{'bg-white text-dark': darkMode, 'bg-gray-100 text-gray-800': !darkMode}">
        <p class="text-pink-600 font-medium">
          Ovdje se možete prijaviti, pratiti i analizirati svoje volonterske aktivnosti uz pomoć intuitivnih alata i personaliziranih preporuka. 
          Ostavite bolji uvid u svoj doprinos i unaprijedite svoje volontersko iskustvo.
        </p>
      </div>
    </div>
</template>
  