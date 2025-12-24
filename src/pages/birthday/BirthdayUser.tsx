import { useState, type FormEvent } from 'react'
import { createBirthday } from '../../api/Birthday'
import type { Birthday } from '../../types'
import Cake from '@mui/icons-material/Cake'
import PersonAdd from '@mui/icons-material/PersonAdd'
import CalendarToday from '@mui/icons-material/CalendarToday'
import Celebration from '@mui/icons-material/Celebration'
import CheckCircle from '@mui/icons-material/CheckCircle'

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)
const MONTHS = [
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
  { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i)

export default function BirthdayUser() {
  const [name, setName] = useState('')
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Birthday | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (!name.trim()) return setError('Ingresa un nombre válido')
    if (!day || !month || !year) return setError('Completa la fecha de nacimiento')

    const d = new Date(Number(year), Number(month) - 1, Number(day))

    if (d.getFullYear() !== Number(year) || d.getMonth() !== Number(month) - 1 || d.getDate() !== Number(day)) {
      return setError('La fecha ingresada no es válida')
    }

    if (d > new Date()) return setError('La fecha no puede ser futura')

    const dateStr = `${year}-${month}-${day.toString().padStart(2, '0')}`

    setLoading(true)
    try {
      const created = await createBirthday({ name, birthdate: dateStr })
      setResult(created)
      setName('')
      setDay('')
      setMonth('')
      setYear('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar. Intenta de nuevo.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
          <PersonAdd className="text-blue-500" />
          Nuevo Cumpleaños
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Registra un nuevo usuario para el seguimiento de festejos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-lg shadow-blue-50/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo
              </label>
              <div className="relative group">
                <input
                  className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none border"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Ana María García"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha de Nacimiento
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div className="relative">
                  <select
                    className="w-full rounded-xl border-gray-200 bg-gray-50 px-3 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none border appearance-none"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    required
                  >
                    <option value="">Día</option>
                    {DAYS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    className="w-full rounded-xl border-gray-200 bg-gray-50 px-3 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none border appearance-none"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                  >
                    <option value="">Mes</option>
                    {MONTHS.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    className="w-full rounded-xl border-gray-200 bg-gray-50 px-3 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none border appearance-none"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  >
                    <option value="">Año</option>
                    {YEARS.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <CalendarToday className="w-3 h-3" />
                Selecciona día, mes y año
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <PersonAdd className="w-5 h-5" />
                  Registrar Cumpleaños
                </>
              )}
            </button>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600 flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                {error}
              </div>
            )}
          </form>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl -rotate-6 transform scale-95 opacity-50 z-0" />
          
          <div className="relative z-10 bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xl shadow-gray-200/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="text-green-500 w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Último Registro</h2>
            </div>

            {!result ? (
              <div className="text-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-xl">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cake className="text-gray-300 w-8 h-8" />
                </div>
                <p className="text-gray-500 font-medium">Aún no hay registros</p>
                <p className="text-gray-400 text-xs mt-1">
                  Completa el formulario para agregar un nuevo cumpleaños a la lista.
                </p>
              </div>
            ) : (
              <div className="animate-fade-in-up">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{result.name}</h3>
                      <p className="text-sm text-blue-600 font-medium mt-1">
                        ¡Registro exitoso!
                      </p>
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <Celebration className="text-yellow-500 w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-white/60 p-3 rounded-lg">
                      <CalendarToday className="text-gray-400 w-4 h-4" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Fecha de Nacimiento</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(result.birthdate).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/60 p-3 rounded-lg">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <span className="block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Próximo Festejo</p>
                        <p className="text-sm font-medium text-gray-900">
                          Faltan <span className="text-blue-600 font-bold text-lg">{result.daysUntilBirthday}</span> días
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-blue-100 flex justify-between items-center">
                    <span className="text-xs text-blue-400 font-mono">ID: {result.id}</span>
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      Guardado
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

