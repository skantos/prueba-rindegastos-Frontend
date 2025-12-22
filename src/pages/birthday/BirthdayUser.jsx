import { useMemo, useState } from 'react'
import { createBirthday } from '../../api/Birthday'
import { CalendarDays, UserPlus, Cake, ChevronLeft, ChevronRight, Target } from 'lucide-react'

const BRAND = '#3498DB'

function buildMonthCalendar(year, month) {
    const firstDay = new Date(year, month, 1)
    const startWeekday = firstDay.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []
    for (let i = 0; i < startWeekday; i += 1) {
        days.push(null)
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
        days.push(new Date(year, month, d))
    }
    return days
}

function nextBirthdayDate(birthdate) {
    if (!birthdate) return null
    const today = new Date()
    const bd = new Date(birthdate)
    const next = new Date(today.getFullYear(), bd.getMonth(), bd.getDate())
    if (next < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        next.setFullYear(today.getFullYear() + 1)
    }
    return next
}

function getDaysUntilDate(targetDate) {
    if (!targetDate) return []
    const today = new Date()
    const daysList = []

    // Crear una copia de hoy para no modificar la fecha original
    const current = new Date(today)

    // Mientras la fecha actual sea menor que la fecha objetivo
    while (current < targetDate) {
        // Agregar una copia de la fecha actual a la lista
        daysList.push(new Date(current))
        // Avanzar un día
        current.setDate(current.getDate() + 1)
    }

    return daysList
}

function isDateInList(date, dateList) {
    if (!date || !dateList.length) return false
    return dateList.some(d =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    )
}

export default function BirthdayUser() {
    const [name, setName] = useState('')
    const [birthdate, setBirthdate] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [result, setResult] = useState(null)

    const today = useMemo(() => new Date(), [])
    const nextDate = useMemo(() => nextBirthdayDate(result?.birthdate), [result])
    const daysUntilBirthday = useMemo(() => getDaysUntilDate(nextDate), [nextDate])
    const initialYear = useMemo(() => (nextDate || today).getFullYear(), [nextDate, today])
    const [calendarYear, setCalendarYear] = useState(initialYear)

    const year = calendarYear
    const months = useMemo(
        () =>
            Array.from({ length: 12 }, (_, idx) => {
                const label = new Date(year, idx, 1).toLocaleDateString(undefined, {
                    month: 'long',
                })
                return {
                    label,
                    month: idx,
                    days: buildMonthCalendar(year, idx),
                }
            }),
        [year],
    )

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setResult(null)

        if (!name.trim()) {
            setError('Por favor, ingresa un nombre válido')
            return
        }

        if (!birthdate) {
            setError('Por favor, selecciona una fecha de nacimiento')
            return
        }

        const birthDateObj = new Date(birthdate)
        if (birthDateObj > new Date()) {
            setError('La fecha de nacimiento no puede ser futura')
            return
        }

        setLoading(true)
        try {
            const created = await createBirthday({ name, birthdate })
            setResult(created)
            setName('')
            setBirthdate('')
            if (created?.birthdate) {
                const next = nextBirthdayDate(created.birthdate)
                if (next) setCalendarYear(next.getFullYear())
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Ocurrió un error al guardar. Por favor, inténtalo de nuevo.'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const isMarkedDay = (day) => {
        if (!day || !nextDate) return false
        return day.getTime() === nextDate.getTime()
    }

    const isTodayDay = (day) => {
        if (!day) return false
        return (
            day.getFullYear() === today.getFullYear() &&
            day.getMonth() === today.getMonth() &&
            day.getDate() === today.getDate()
        )
    }

    const isFutureDay = (day) => {
        if (!day) return false
        return isDateInList(day, daysUntilBirthday)
    }

    return (
        <div className="">
            <div className=" mx-auto flex flex-col">

                <div className="grid lg:grid-cols-2 gap-5 flex-1 min-h-0  overflow-hidden">

                    <div className="space-y-4 min-h-0">


                        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 border border-gray-100 h-full overflow-auto">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: BRAND }}>
                                    <Cake className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Cumpleaños de nuestros Rindegastinos</h1>
                            </div>
                            <br />
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-blue-50">
                                    <UserPlus className="w-5 h-5" style={{ color: BRAND }} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Registrar Nuevo Colaborador</h2>
                                    <p className="text-sm text-gray-500">Completa los datos para agregar un nuevo cumpleaños</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre completo
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-11 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all duration-200"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Ej: María González"
                                                required
                                            />
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                <UserPlus className="w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fecha de nacimiento
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-11 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all duration-200"
                                                value={birthdate}
                                                onChange={(e) => setBirthdate(e.target.value)}
                                                required
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                <CalendarDays className="w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Selecciona la fecha de nacimiento del colaborador
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    style={{ backgroundColor: BRAND }}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Registrando...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4" />
                                            Registrar Cumpleaños
                                        </>
                                    )}
                                </button>
                            </form>

                            {error && (
                                <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 animate-fadeIn">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                                                <span className="text-red-600 text-xs font-bold">!</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-red-800">Error al registrar</p>
                                            <p className="text-sm text-red-600 mt-1">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {result && (
                                <div className="mt-6 p-5 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 animate-fadeIn">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                <Cake className="w-5 h-5 text-green-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-green-800">¡Cumpleaños registrado exitosamente!</p>
                                            <p className="text-xs text-green-600 mt-1">Los datos han sido guardados en el sistema</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500">Nombre</p>
                                            <p className="font-medium text-gray-900">{result.name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500">Fecha</p>
                                            <p className="font-medium text-gray-900">
                                                {new Date(result.birthdate).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="space-y-1 col-span-2">
                                            <p className="text-xs text-gray-500">Días hasta el próximo cumpleaños</p>
                                            <div className="flex items-center gap-2">
                                                <div className="px-3 py-1.5 rounded-lg bg-white border border-green-200">
                                                    <span className="text-xl font-bold" style={{ color: BRAND }}>
                                                        {result.daysUntilBirthday}
                                                    </span>
                                                    <span className="text-gray-600 ml-1">días</span>
                                                </div>
                                                <Target className="w-4 h-4" style={{ color: BRAND }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Calendario Derecho */}
                    <div className="space-y-4 min-h-0 max-h-[90vh]">
                        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 border border-gray-100 h-full overflow-auto">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-50">
                                        <CalendarDays className="w-5 h-5" style={{ color: BRAND }} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Calendario {year}</h2>
                                    </div>
                                </div>

                                {nextDate && result && (
                                    <div className="hidden lg:block">
                                        <div className="px-4 py-2 rounded-full shadow-sm" style={{ backgroundColor: BRAND }}>
                                            <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                                                <Target className="w-3 h-3" />
                                                {daysUntilBirthday.length} días restantes
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCalendarYear((y) => y - 1)}
                                        className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <span className="text-lg font-semibold text-gray-900 px-3">{year}</span>
                                    <button
                                        type="button"
                                        onClick={() => setCalendarYear((y) => y + 1)}
                                        className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setCalendarYear((nextDate || today).getFullYear())}
                                    className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                                >
                                    Hoy
                                </button>
                            </div>

                            {nextDate && result && (
                                <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-100 lg:hidden">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Próximo cumpleaños</p>
                                            <p className="text-xs text-gray-600">{result.name}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: BRAND }} />
                                            <span className="text-sm font-bold" style={{ color: BRAND }}>
                                                {daysUntilBirthday.length} días
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Grid de meses organizado sin scroll */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                                {months.map(({ label, days }) => (
                                    <div
                                        key={label}
                                        className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 hover:bg-gray-50/70 transition-colors h-fit"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-gray-900 capitalize">
                                                {label}
                                            </h3>
                                            <span className="text-xs text-gray-500 font-medium">
                                                {days.filter(day => day !== null).length} días
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-7 gap-1 mb-1 text-center">
                                            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day) => (
                                                <div key={day} className="text-xs font-medium text-gray-400">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-7 gap-[6px]">
                                            {days.map((day, idx) => {
                                                if (!day) return <div key={idx} className="h-7" />

                                                const marked = isMarkedDay(day)
                                                const todayMarked = isTodayDay(day)
                                                const futureDay = isFutureDay(day)

                                                return (
                                                    <div
                                                        key={idx}
                                                        className="relative h-6.5"
                                                    >
                                                        <div
                                                            className={`
                                w-full h-full flex items-center justify-center rounded-lg text-xs
                                ${marked ? 'text-white font-bold' : todayMarked ? 'font-bold text-gray-900' : 'font-medium'}
                                ${futureDay ? 'bg-blue-50 text-blue-600' : ''}
                                transition-all duration-200
                              `}
                                                            style={{
                                                                backgroundColor: marked ? BRAND : 'transparent',
                                                                border: todayMarked ? `2px solid ${BRAND}` : '1px solid transparent',
                                                                borderColor: futureDay ? '#93c5fd' : 'transparent',
                                                                boxShadow: marked ? `0 2px 4px ${BRAND}40` : 'none'
                                                            }}
                                                        >
                                                            {day.getDate()}

                                                            {/* Indicador para días futuros */}
                                                            {futureDay && !marked && day.getDate() <= 7 && (
                                                                <div
                                                                    className="absolute top-0 right-0 w-1 h-1 rounded-full"
                                                                    style={{ backgroundColor: BRAND }}
                                                                />
                                                            )}
                                                        </div>

                                                        {/* Punto animado para el día del cumpleaños */}
                                                        {marked && (
                                                            <div className="absolute -top-1 -right-1">
                                                                <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: BRAND }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Leyenda */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded border-2" style={{ borderColor: BRAND }} />
                                        <span className="text-gray-600">Hoy</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded" style={{ backgroundColor: BRAND }} />
                                        <span className="text-gray-600">Día del cumpleaños</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded border" style={{ borderColor: '#93c5fd', backgroundColor: '#dbeafe' }} />
                                        <span className="text-gray-600">Días que faltan</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}