const API_URL = import.meta.env.VITE_API_URL

export async function getTheNumber({ first, second }) {
  const baseUrl = import.meta.env.DEV ? '/api' : API_URL
  if (!baseUrl) throw new Error('VITE_API_URL no está configurada')

  const params = new URLSearchParams({
    first: String(first ?? ''),
    second: String(second ?? ''),
  })

  const res = await fetch(`${baseUrl}/numbers/getTheNumber?${params.toString()}`)
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`)
  return res.json()
}

