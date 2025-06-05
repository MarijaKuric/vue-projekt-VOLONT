<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db, collection, addDoc, serverTimestamp } from '@/firebase'

const router = useRouter()
const noviDogadaj = ref({
  naziv: '',
  lokacija: '',
  datum: '',
  organizatorId: '',
  zadaci: []
})

const isFormValid = computed(() => {
  return noviDogadaj.value.naziv.trim() !== '' && 
         noviDogadaj.value.lokacija.trim() !== '' && 
         noviDogadaj.value.datum !== ''
})

const isLoading = ref(false)
const error = ref('')

async function kreirajDogadaj() {
  if (!isFormValid.value || isLoading.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    const user = auth.currentUser
    if (!user) throw new Error('Niste prijavljeni')
    
    const dogadajData = {
      ...noviDogadaj.value,
      organizatorId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    const docRef = await addDoc(collection(db, 'dogadaji'), dogadajData)
    
    // Reset form
    noviDogadaj.value = {
      naziv: '',
      lokacija: '',
      datum: '',
      organizatorId: '',
      zadaci: []
    }
    
    // Navigate to task creation
    await router.push(`/organizator/unos-zadatka/${docRef.id}`)
  } catch (err) {
    console.error('Greška pri kreiranju događaja:', err)
    error.value = 'Došlo je do greške pri kreiranju događaja'
  } finally {
    isLoading.value = false
  }
}
</script>