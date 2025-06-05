<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const router = useRouter()

const nazivOrganizacije = ref('')
const email = ref('')
const lozinka = ref('')
const prijavaError = ref('')

const isValid = computed(() => {
  return nazivOrganizacije.value.trim() !== '' &&
         email.value.trim() !== '' &&
         lozinka.value.trim() !== ''
})

const handleLogin = async () => {
  prijavaError.value = ''
  
  if (!isValid.value) {
    prijavaError.value = 'Molimo popunite sva obavezna polja.'
    return
  }

  try {
    // Prvo pokušaj autentifikaciju
    const userCredential = await signInWithEmailAndPassword(auth, email.value, lozinka.value)
    const user = userCredential.user
    
    // Proveri da li je email organizatora
    if (email.value !== 'marijaa.kuric@gmail.com') {
      prijavaError.value = 'Samo ovlašteni organizator može pristupiti ovom dijelu.'
      return
    }

    // Proverava da li je naziv organizacije tačan
    if (nazivOrganizacije.value.trim() !== 'Organizacijska udruga') {
      prijavaError.value = 'Neispravan naziv organizacije.'
      return
    }
    
    // Check if user document exists in Firestore
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)
    
    if (!userDoc.exists()) {
      // Ako dokument ne postoji, kreiraj ga sa ulogom organizatora
      await setDoc(userDocRef, {
        email: user.email,
        role: 'organizator',
        nazivOrganizacije: nazivOrganizacije.value.trim(),
        createdAt: new Date().toISOString()
      })
      console.log('Kreiran novi dokument za organizatora')
    } else {
      // Ako dokument postoji, proveri ulogu
      const userData = userDoc.data()
      if (userData.role !== 'organizator') {
        // Ažuriraj ulogu na organizator
        await setDoc(userDocRef, {
          ...userData,
          role: 'organizator',
          nazivOrganizacije: nazivOrganizacije.value.trim(),
          updatedAt: new Date().toISOString()
        }, { merge: true })
        console.log('Ažurirana uloga korisnika na organizator')
      }
    }
    
    // Successful login, redirect to organizer dashboard
    router.push('/organizator/pregled')
    
  } catch (error) {
    console.error('Organizer login error:', error)
    
    if (error.code === 'auth/user-not-found') {
      prijavaError.value = 'Korisnik sa ovim email-om ne postoji.'
    } else if (error.code === 'auth/wrong-password') {
      prijavaError.value = 'Neispravna lozinka.'
    } else if (error.code === 'auth/invalid-email') {
      prijavaError.value = 'Neispravna email adresa.'
    } else if (error.code === 'auth/too-many-requests') {
      prijavaError.value = 'Previše neuspešnih pokušaja. Pokušajte ponovo kasnije.'
    } else {
      prijavaError.value = 'Došlo je do greške prilikom prijave. Pokušajte ponovo.'
    }
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
    class="min-h-screen flex flex-col items-center justify-center px-6 py-12 font-sans transition-colors duration-500 relative"
  >
    <div class="absolute top-4 right-4">
      <button
        @click="toggleDarkMode"
        class="bg-pink-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-pink-700 transition text-xs font-bold"
      >
        {{ darkMode ? 'SVIJETLI NAČIN' : 'TAMNI NAČIN' }}
      </button>
    </div>

    <h1 class="text-5xl font-extrabold text-pink-500 mb-2 tracking-wide italic">VolontIT</h1>
    <p class="mb-8 text-center text-lg" :class="darkMode ? 'text-gray-300' : 'text-gray-600'">Prijava organizatora</p>

    <div class="w-full max-w-md space-y-5 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
      <div>
        <label
          for="nazivOrganizacije"
          :class="darkMode ? 'text-black' : 'text-gray-700'"
          class="block mb-1 text-sm font-medium"
        >
          Naziv organizacije<span class="text-blue-500">*</span>
        </label>
        <input
          v-model="nazivOrganizacije"
          id="nazivOrganizacije"
          type="text"
          placeholder="Organizacijska udruga"
          :class="['w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500']"
        />
      </div>

      <div>
        <label
          for="email"
          :class="darkMode ? 'text-black' : 'text-gray-700'"
          class="block mb-1 text-sm font-medium"
        >
          Email<span class="text-blue-500">*</span>
        </label>
        <input
          v-model="email"
          id="email"
          type="email"
          placeholder="marijaa.kuric@gmail.com"
          :class="['w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500']"
        />
      </div>

      <div>
        <label
          for="lozinka"
          :class="darkMode ? 'text-black' : 'text-gray-700'"
          class="block mb-1 text-sm font-medium"
        >
          Lozinka<span class="text-blue-500">*</span>
        </label>
        <input
          v-model="lozinka"
          id="lozinka"
          type="password"
          placeholder="Unesite vašu lozinku"
          :class="['w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500']"
        />
      </div>

       <div v-if="prijavaError" class="text-red-500 text-sm text-center">
        {{ prijavaError }}
      </div>

      <button
        @click="handleLogin"
        :class="isValid ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-400 cursor-not-allowed'"
        class="w-full text-white py-3 rounded-full font-semibold shadow-md transition"
        :disabled="!isValid"
      >
        PRIJAVI SE
      </button>
    </div>
    <br>
    <br>
    <p
      class="mt-2 cursor-pointer text-sm font-medium transition"
      :class="[darkMode ? 'text-gray-300 hover:text-pink-400' : 'text-gray-700 hover:text-pink-600']"
      @click="router.push('/')"
    >
      ⬅️ POČETNA STRANICA
    </p>
  </div>
</template>

<style>
.bg-dark {
  background-color: #0d1321; /* Tamna pozadina */
}
.bg-light {
  background-color: #f9fafb; /* Svijetla pozadina */
}
.text-dark {
  color: #0d1321; /* Tamni tekst za svijetlu pozadinu */
}
/* Stil za placeholder tekst u input poljima */
input.text-black::placeholder {
  color: #6b7280; /* Gray-500 */
}
</style>