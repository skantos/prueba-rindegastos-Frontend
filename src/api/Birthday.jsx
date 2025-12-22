const API_URL = import.meta.env.VITE_API_URL

export async function getBirthdays() {
  const baseUrl = import.meta.env.DEV ? '/api' : API_URL

  if (!baseUrl) {
    throw new Error('VITE_API_URL no está configurada')
  }

  const res = await fetch(`${baseUrl}/birthday`)
  if (!res.ok) {
    throw new Error(`Error HTTP ${res.status}`)
  }

  return res.json()
}

export async function createBirthday({ name, birthdate }) {
  const baseUrl = import.meta.env.DEV ? '/api' : API_URL

  if (!baseUrl) {
    throw new Error('VITE_API_URL no está configurada')
  }

  const res = await fetch(`${baseUrl}/birthday`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, birthdate }),
  })

  if (!res.ok) {
    throw new Error(`Error HTTP ${res.status}`)
  }

  return res.json()
}

