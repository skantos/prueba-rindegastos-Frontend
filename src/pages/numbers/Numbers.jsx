import { useState } from 'react'
import { getTheNumber } from '../../api/Numbers'
import { Functions, Calculate, Numbers as NumbersIcon } from '@mui/icons-material'

export default function Numbers() {
    const [first, setFirst] = useState('192')
    const [second, setSecond] = useState('3')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [result, setResult] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setResult(null)

        const num1 = parseInt(first)
        const num2 = parseInt(second)

        if (num1 <= 0 || num2 <= 0) {
            setError('Los números deben ser mayores a 0')
            return
        }

        if (num2 > 10) {
            setError('El segundo número debe ser ≤ 10 para mejor rendimiento')
            return
        }

        setLoading(true)
        try {
            const data = await getTheNumber({ first, second })
            setResult(data)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al conectar con el servicio'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const getResultValue = () => {
        if (!result) return ''
        return String(
            result.result ||
            result.value ||
            result.number ||
            result.data ||
            ''
        )
    }

    const resultValue = getResultValue()
    const firstNine = resultValue.slice(0, 9)
    const fullLength = resultValue.length

    return (
        <div className="mx-auto p-3 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                        <Functions className="w-4 h-4 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Producto Concatenado</h1>
                </div>
                <p className="text-gray-600 text-sm">
                    Multiplica el primer número por 1 hasta el segundo y concatena los resultados
                </p>
            </div>

            {/* Contenido principal */}
            <div className="grid lg:grid-cols-2 gap-4 mb-6">
                {/* Formulario */}
                <div className="bg-white rounded-lg border border-gray-100 p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Primer número
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                                    value={first}
                                    onChange={(e) => setFirst(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Segundo número
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                                    value={second}
                                    onChange={(e) => setSecond(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                            <p className="font-medium mb-1">Ejemplo: 192 × 3</p>
                            <p>192×1=192 | 192×2=384 | 192×3=576</p>
                            <p>Resultado: 192384576</p>
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
                                    <Calculate className="w-3 h-3" />
                                    Calcular
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
                                <NumbersIcon className="w-4 h-4 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-sm">Ingresa números y calcula</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Primeros 9 dígitos */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded p-3 border border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-medium text-blue-800">PRIMEROS 9 DÍGITOS</p>
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                        Mostrando 9/{fullLength}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold text-gray-900 tracking-wider font-mono">
                                        {firstNine}
                                    </span>
                                </div>
                            </div>

                            {/* Resultado completo */}
                            <div className="bg-gray-50 rounded p-3 border border-gray-100">
                                <p className="text-xs font-medium text-gray-500 mb-2">
                                    RESULTADO COMPLETO ({fullLength} dígitos)
                                </p>
                                <div className="max-h-32 overflow-y-auto">
                                    <p className="text-sm font-mono text-gray-900 break-all leading-relaxed">
                                        {resultValue}
                                    </p>
                                </div>
                            </div>

                            {/* Operación realizada */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 rounded p-2 border border-gray-100">
                                    <p className="text-xs text-gray-500">Operación</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {first} × [1..{second}]
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded p-2 border border-gray-100">
                                    <p className="text-xs text-gray-500">Longitud</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {fullLength} dígitos
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