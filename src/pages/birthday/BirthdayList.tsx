import { useState, useMemo } from 'react'
import { getBirthdays } from '../../api/Birthday'
import type { Birthday } from '../../types'
import Search from '@mui/icons-material/Search'
import Cake from '@mui/icons-material/Cake'
import FilterList from '@mui/icons-material/FilterList'
import Person from '@mui/icons-material/Person'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'

const ITEMS_PER_PAGE = 8

export default function BirthdayList() {
  const [data, setData] = useState<Birthday[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('days')
  const [currentPage, setCurrentPage] = useState(1)

  useMemo(() => {
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

  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, sortBy])

  const filteredData = useMemo(() => {
    let result = [...data]

    if (searchTerm) {
      const lower = searchTerm.toLowerCase()
      result = result.filter((item) => item.name.toLowerCase().includes(lower))
    }

    result.sort((a, b) => {
      if (sortBy === 'days') {
        return a.daysUntilBirthday - b.daysUntilBirthday
      } else {
        return a.name.localeCompare(b.name)
      }
    })

    return result
  }, [data, searchTerm, sortBy])

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const SkeletonCard = () => (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-1/2 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )

  return (
    <section className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto flex flex-col min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Cake className="text-pink-500" />
            Cumpleaños
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona y visualiza los próximos festejos del equipo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuario..."
              className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <FilterList className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              className="w-full sm:w-auto pl-9 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all outline-none appearance-none cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="days">Próximos</option>
              <option value="name">Nombre (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      <div className="flex-1">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200 h-full flex flex-col justify-center items-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <Person className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No se encontraron usuarios</p>
            <p className="text-gray-400 text-sm">Intenta con otra búsqueda o filtro</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 content-start">
            {paginatedData.map((item) => (
              <article
                key={item.id}
                className="group relative rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm
                      ${item.daysUntilBirthday === 0 ? 'bg-gradient-to-br from-pink-500 to-rose-500 animate-bounce' : 'bg-gradient-to-br from-blue-400 to-blue-600'}
                    `}>
                      {getInitials(item.name)}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        ID: {item.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                      Fecha
                    </span>
                    <span className="text-sm text-gray-700 font-medium">
                      {new Date(item.birthdate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                      Faltan
                    </span>
                    <span className={`text-sm font-bold ${
                      item.daysUntilBirthday <= 7 ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {item.daysUntilBirthday === 0 ? '¡Hoy!' : `${item.daysUntilBirthday} días`}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {!loading && filteredData.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
          <div className="text-sm text-gray-500">
            Mostrando <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}</span> de <span className="font-medium">{filteredData.length}</span> resultados
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="hidden sm:flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

