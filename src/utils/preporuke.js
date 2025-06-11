import { zadaci } from '../data/zadaci'

// Primi unos korisnika i vrati preporučene zadatke
export function preporuciZadatke(unos) {
  const kljucneRijeci = unos.toLowerCase().split(' ')
  
  return zadaci.filter(zadatak =>
    zadatak.kategorije.some(kat =>
      kljucneRijeci.includes(kat.toLowerCase())
    )
  )
}
