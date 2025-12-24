const API_URL = import.meta.env.VITE_API_URL

export async function getConvertedAmount({ from, to, amount, date }) {
  const baseUrl = import.meta.env.DEV ? '/api' : API_URL
  if (!baseUrl) throw new Error('VITE_API_URL no está configurada')

  if (!from || !to || Number(amount) <= 0) {
    throw new Error('Parámetros inválidos: revisa monedas y monto')
  }

  const params = new URLSearchParams({
    from,
    to,
    amount: String(amount),
  })

  if (date) {
    params.set('date', date)
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch(`${baseUrl}/exchange/getConvertedAmount?${params.toString()}`, {
      signal: controller.signal,
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`)
    return res.json()
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Tiempo de espera agotado (8s). Intenta de nuevo.')
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

