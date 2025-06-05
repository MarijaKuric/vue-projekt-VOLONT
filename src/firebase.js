import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  applyActionCode,
  signOut,
  onAuthStateChanged,
  updateProfile,
  reload
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCXta8yhWKLb6je2ybtEm1Cq_0Ixlj9FXQ",
  authDomain: "volontiraj1.firebaseapp.com",
  projectId: "volontiraj1",
  storageBucket: "volontiraj1.appspot.com",
  messagingSenderId: "801638075484",
  appId: "1:801638075484:web:8670a5ecbab44bb7096a99"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

/**
 * Dohvaća ulogu korisnika iz Firestore
 * @param {string} userId - ID korisnika
 * @returns {Promise<string|null>} - Uloga korisnika ili null ako ne postoji
 */
const getUserRole = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      // Provjeravamo da li korisnik ima role polje, ako ne - svi su volonteri po defaultu
      return userData.role || 'volonter'
    }
    return 'volonter' // Default uloga
  } catch (error) {
    console.error('Error getting user role:', error)
    return 'volonter' // Default uloga u slučaju greške
  }
}

/**
 * Kreira korisnički dokument u Firestore
 * @param {string} userId - ID korisnika
 * @param {Object} userData - Podaci o korisniku
 * @returns {Promise<void>}
 */
const createUserDocument = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      role: userData.role || 'volonter', // Default uloga volontjer
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error creating user document:', error)
    throw error
  }
}

/**
 * Provjerava je li email verifikiran
 * @param {Object} user - Firebase korisnički objekt
 * @returns {Promise<boolean>}
 */
const checkEmailVerified = async (user) => {
  try {
    await reload(user)
    return user.emailVerified
  } catch (error) {
    console.error('Error checking email verification:', error)
    return false
  }
}

/**
 * Šalje email za verifikaciju
 * @param {Object} user - Firebase korisnički objekt
 * @returns {Promise<void>}
 */
const sendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user)
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}

/**
 * Dohvaća korisničke podatke iz Firestore
 * @param {string} userId - ID korisnika
 * @returns {Promise<Object|null>} - Podaci o korisniku ili null
 */
const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    return userDoc.exists() ? userDoc.data() : null
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

export {
  auth,
  db,
  
  // Auth funkcije
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  applyActionCode,
  reload,
  
  // Firestore funkcije
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  
  // Pomoćne funkcije
  getUserRole,
  createUserDocument,
  checkEmailVerified,
  sendVerificationEmail,
  getUserData
}