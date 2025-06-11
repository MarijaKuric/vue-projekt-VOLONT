import { createRouter, createWebHistory } from 'vue-router'
import { auth, db, doc, getDoc } from '../firebase'

// Statičke komponente
import Pocetna from '@/views/Pocetna.vue'
import Gost from '@/views/Gost.vue'
import Registracija from '@/views/Registracija.vue'
import Prijava from '@/views/Prijava.vue'
import OrganizatorPrijava from '@/views/OrganizatorPrijava.vue'

const routes = [
  { path: '/', name: 'home', component: Pocetna },
  { path: '/gost', name: 'gost', component: Gost },
  { path: '/registracija', name: 'registracija', component: Registracija },
  { path: '/prijava', name: 'prijava', component: Prijava },
  { path: '/organizator', name: 'organizatorPrijava', component: OrganizatorPrijava },
  {
    path: '/registracija/uspjesno',
    name: 'registracijaUspjesna',
    component: () => import('@/views/RegistracijaUspjesna.vue')
  },
  {
    path: '/volonter/pocetna',
    name: 'volonterPocetna',
    component: () => import('@/views/VolonterPocetna.vue'),
    meta: { requiresAuth: true, role: 'volonter' }
  },
  {
    path: '/ai',
    name: 'ai',
    component: () => import('@/views/AI.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/volonter-dogadaji',
    name: 'volonterDogadaji',
    component: () => import('@/views/VolonteriPopisDogadaja.vue'),
    meta: { requiresAuth: true, role: 'volonter' }
  },
  {
    path: '/moji-zadaci',
    name: 'mojiZadaci',
    component: () => import('@/views/MojiZadaci.vue'),
    meta: { requiresAuth: true, role: 'volonter' }
  },
  {
    path: '/recenzije',
    name: 'recenzije',
    component: () => import('@/views/Recenzije.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/organizator/unos-dogadaja',
    name: 'OrganizatorUnosDogadaja',
    component: () => import('@/views/OrganizatorUnosDogadaja.vue'),
    meta: { requiresAuth: true, role: 'organizator' }
  },
  {
    path: '/organizator/unos-zadatka/:id?',
    name: 'OrganizatorUnosZadataka',
    component: () => import('@/views/OrganizatorUnosZadataka.vue'),
    meta: { requiresAuth: true, role: 'organizator' }
  },
  {
    path: '/organizator/pregled',
    name: 'OrganizatorPregled',
    component: () => import('@/views/OrganizatorPregled.vue'),
    meta: { requiresAuth: true, role: 'organizator' }
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')  // Dodaj ovu komponentu
  },
  {
  path: '/verifikacija-emaila',
  name: 'emailVerifikacija',
  component: () => import('@/views/EmailVerifikacija.vue'),
  props: (route) => ({ oobCode: route.query.oobCode })
}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const currentUser = auth.currentUser

  if (requiresAuth && !currentUser) {
    next('/prijava')
  } else if (requiresAuth && currentUser) {
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
    const userRole = userDoc.data()?.role

    if (to.meta.role && to.meta.role !== userRole) {
      if (userRole === 'organizator') {
        next('/organizator/pregled')
      } else {
        next('/volonter/pocetna')
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
