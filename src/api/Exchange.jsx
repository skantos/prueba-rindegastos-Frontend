const API_URL = import.meta.env.VITE_API_URL

export async function getConvertedAmount({ from, to, amount }) {
  const baseUrl = import.meta.env.DEV ? '/api' : API_URL
  if (!baseUrl) throw new Error('VITE_API_URL no está configurada')

  const params = new URLSearchParams({
    from,
    to,
    amount: String(amount),
  })

  const res = await fetch(`${baseUrl}/exchange/getConvertedAmount?${params.toString()}`)
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`)
  return res.json()
}
