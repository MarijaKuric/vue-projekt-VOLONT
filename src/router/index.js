import { createRouter, createWebHistory } from 'vue-router'
import Pocetna from '@/views/Pocetna.vue' 
import Gost from '@/views/Gost.vue'
import Registracija from '@/views/Registracija.vue'
import Prijava from '@/views/Prijava.vue'
import OrganizatorPrijava from '@/views/OrganizatorPrijava.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Pocetna
  },
  {
    path: '/gost',
    name: 'gost',
    component: Gost
  },
  {
    path: '/registracija',
    name: 'registracija',
    component: Registracija
  },
  {
    path: '/prijava',
    name: 'prijava',
    component: Prijava
  },
  {
    path: '/organizator',
    name: 'organizator',
    component: OrganizatorPrijava
  },
  {
    path: '/registracija/uspjesno',
    name: 'registracijaUspjesna',
    component: () => import('@/views/RegistracijaUspjesna.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router