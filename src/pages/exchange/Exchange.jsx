import { useState } from 'react'
import { getConvertedAmount } from '../../api/Exchange'

export default function Exchange() {
  const [from, setFrom] = useState('CLP')
  const [to, setTo] = useState('USD')
  const [amount, setAmount] = useState('15000')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const response = await getConvertedAmount({
        from,
        to,
        amount: amount || '0',
      })
      setResult(response)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Conversor de divisas
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Calcula montos con Open Exchange</h1>
        <p className="text-gray-600">
          Ingresa la moneda de origen, destino y el monto para obtener el valor convertido y la tasa
          utilizada.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Moneda origen</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={from}
              onChange={(e) => setFrom(e.target.value.toUpperCase())}
              placeholder="CLP"
              maxLength={3}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Moneda destino</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={to}
              onChange={(e) => setTo(e.target.value.toUpperCase())}
              placeholder="USD"
              maxLength={3}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Monto</label>
            <input
              type="number"
              min="0"
              step="any"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="15000"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Calculando...' : 'Convertir'}
          </button>

          {error && (
            <p className="text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 inline-block">
              Hubo un problema: {error}
            </p>
          )}
        </form>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Resultado</h2>

          {!result && <p className="text-gray-500 text-sm">Ingresa datos y presiona convertir.</p>}

          {result && (
            <div className="space-y-3">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-sm text-gray-500">Monto convertido</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Number(result.convertedAmount).toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })}{' '}
                  {to}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-sm text-gray-500">Tasa aplicada</p>
                <p className="text-lg font-semibold text-gray-900">{result.rate}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

