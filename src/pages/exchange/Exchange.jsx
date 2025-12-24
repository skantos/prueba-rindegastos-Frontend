import { useState } from 'react'
import { getConvertedAmount } from '../../api/Exchange'
import { CurrencyExchange, TrendingUp, Event } from '@mui/icons-material'

const CURRENCY_OPTIONS = [
  { code: 'CLP', name: 'Peso Chileno' },
  { code: 'USD', name: 'Dólar USA' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'Libra Esterlina' },
  { code: 'JPY', name: 'Yen Japonés' },
  { code: 'CNY', name: 'Yuan Chino' },
  { code: 'BRL', name: 'Real Brasileño' },
  { code: 'ARS', name: 'Peso Argentino' },
]

export default function Exchange() {
  const [from, setFrom] = useState('CLP')
  const [to, setTo] = useState('USD')
  const [amount, setAmount] = useState('15000')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [date, setDate] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    // Validaciones front
    if (!from || !to || Number(amount) <= 0) {
      setError('Ingresa monedas válidas y un monto > 0')
      return
    }

    if (from.toUpperCase() === to.toUpperCase()) {
      setError('Las monedas deben ser diferentes')
      return
    }

    if (date) {
      const selected = new Date(date)
      const today = new Date()
      selected.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      if (selected > today) {
        setError('La fecha no puede ser futura')
        return
      }
    }

    setLoading(true)
    try {
      const response = await getConvertedAmount({ from, to, amount, date })
      setResult(response)
    } catch (err) {
      setError(err.message || 'Error en la conexión')
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (value) => {
    return Number(value).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    })
  }

  return (
    <div className="mx-auto p-3 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
            <CurrencyExchange className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Conversor de Divisas</h1>
        </div>
      </div>

      {/* Formulario y Resultado */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        {/* Formulario */}
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">De</label>
                <select
                  className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                >
                  {CURRENCY_OPTIONS.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">A</label>
                <select
                  className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                >
                  {CURRENCY_OPTIONS
                    .filter(currency => currency.code !== from)
                    .map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
              <input
                type="number"
                min="0"
                step="any"
                className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="15000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha (opcional)</label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <Event className="w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {date && (
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() => setDate('')}
                  >
                    Limpiar
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Consulta la tasa para una fecha específica (no futura).
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-gradient-to-r from-blue-500 to-blue-600 py-2 px-4 text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Calculando...
                </>
              ) : (
                <>
                  <CurrencyExchange className="w-3 h-3" />
                  Convertir
                </>
              )}
            </button>

            {error && (
              <div className="p-2 rounded bg-red-50 border border-red-200 text-xs">
                <p className="font-medium text-red-800">Error</p>
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Resultados */}
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Resultado</h2>

          {!result ? (
            <div className="border border-dashed border-gray-200 rounded p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">Ingresa datos y convierte</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded p-3 border border-blue-200">
                <p className="text-xs text-blue-800 mb-1">MONTO CONVERTIDO</p>
                <div className="flex items-end gap-1">
                  <span className="text-xl font-bold text-gray-900">
                    {formatAmount(result.convertedAmount)}
                  </span>
                  <span className="text-sm font-semibold text-blue-600">{to}</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Equivalente a {formatAmount(amount)} {from}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded p-2 border border-gray-100">
                  <p className="text-xs text-gray-500">Tasa</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {parseFloat(result.rate).toFixed(6)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded p-2 border border-gray-100">
                  <p className="text-xs text-gray-500">Original</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatAmount(amount)} {from}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}