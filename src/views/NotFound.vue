<script setup>
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <h1 class="text-5xl font-bold text-red-600 mb-4">404</h1>
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
      Stranica nije pronađena
    </h2>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      Oprostite, stranica koju tražite ne postoji ili je premještena.
    </p>
    <router-link
      to="/"
      class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
    >
      Povratak na početnu
    </router-link>
  </div>
</template>

<style scoped>
</style>
