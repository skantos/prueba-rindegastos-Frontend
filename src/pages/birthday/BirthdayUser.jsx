import { useState } from 'react'
import { createBirthday } from '../../api/Birthday'

const BRAND = '#3498DB'

export default function BirthdayUser() {
    const [name, setName] = useState('')
    const [birthdate, setBirthdate] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [result, setResult] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setResult(null)

        if (!name.trim()) return setError('Ingresa un nombre válido')
        if (!birthdate) return setError('Selecciona una fecha de nacimiento')
        if (new Date(birthdate) > new Date()) return setError('La fecha no puede ser futura')

        setLoading(true)
        try {
            const created = await createBirthday({ name, birthdate })
            setResult(created)
            setName('')
            setBirthdate('')
        } catch (err) {
            setError(err.message || 'Error al guardar. Intenta de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Registrar cumpleaños</h1>
                <p className="text-gray-600 text-sm">Ingresa el nombre y la fecha de nacimiento.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                            <input
                                className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: María González"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                            <input
                                type="date"
                                className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                                value={birthdate}
                                onChange={(e) => setBirthdate(e.target.value)}
                                required
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded bg-gradient-to-r from-blue-500 to-blue-600 py-2 px-4 text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Guardando...' : 'Registrar'}
                        </button>

                        {error && (
                            <div className="p-2 rounded bg-red-50 border border-red-200 text-xs">
                                <p className="font-medium text-red-800">Error</p>
                                <p className="text-red-600">{error}</p>
                            </div>
                        )}
                    </form>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Último registro</h2>
                    {!result ? (
                        <p className="text-gray-500 text-sm">Aún no has registrado un cumpleaños.</p>
                    ) : (
                        <div className="space-y-2 text-sm">
                            <p className="font-semibold text-gray-900">{result.name}</p>
                            <p className="text-gray-700">
                                Fecha:{' '}
                                {new Date(result.birthdate).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                            <p className="text-gray-700">
                                Días para su próximo cumpleaños:{' '}
                                <span className="font-semibold" style={{ color: BRAND }}>
                                    {result.daysUntilBirthday}
                                </span>
                            </p>
                            <p className="text-gray-500">ID: {result.id}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

