import { useEffect, useState } from 'react'
import { getBirthdays } from '../../api/Birthday'

export default function BirthdayList() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const birthdays = await getBirthdays()
        setData(birthdays)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-gray-600">Listado de cumpleaños desde la API.</p>
      </div>

      {loading && <p className="text-gray-700">Cargando...</p>}
      {error && (
        <p className="text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 inline-block">
          Hubo un problema: {error}
        </p>
      )}

      {!loading && !error && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full">
                  {item.daysUntilBirthday} días
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Nació el {new Date(item.birthdate).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">ID: {item.id}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

