import { useState } from 'react'
import { Link } from 'react-router-dom'
import Api from '@mui/icons-material/Api'
import StorageIcon from '@mui/icons-material/Storage'
import LinkIcon from '@mui/icons-material/Link'
import CheckCircle from '@mui/icons-material/CheckCircle'
import Security from '@mui/icons-material/Security'
import Speed from '@mui/icons-material/Speed'
import Cloud from '@mui/icons-material/Cloud'
import logo from '../../assets/logo.svg'

const ENDPOINTS = [
  {
    title: 'Conversor de Divisas',
    path: '/exchange',
    url: 'https://prueba-rindegastos-backend.onrender.com/exchange/getConvertedAmount',
    method: 'GET',
    params: '?from=CLP&to=USD&amount=15000&date=YYYY-MM-DD (opcional)',
    description: 'Convierte montos entre monedas usando Open Exchange Rates API',
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  {
    title: 'Gestión de Cumpleaños',
    path: '/birthday',
    url: 'https://prueba-rindegastos-backend.onrender.com/birthday',
    method: 'POST/GET',
    params: 'POST Body: { "name": "Ana", "birthdate": "1990-05-10" }',
    description: 'Registra y consulta cumpleaños con días restantes',
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  {
    title: 'Producto Concatenado',
    path: '/numbers',
    url: 'https://prueba-rindegastos-backend.onrender.com/numbers/getTheNumber',
    method: 'GET',
    params: '?first=192&second=3',
    description: 'Genera el producto concatenado de dos números (primeros 9 dígitos)',
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  }
]

const POSTGRES_INFO = {
  host: 'dpg-d545m4f5r7bs73e7nuk0-a',
  password: '3L7xHR8FJBlVy0TQr6SfvZWn94pjwQ7F',
}

const IMPLEMENTATION_DETAILS = [
  {
    icon: <Security />,
    title: 'Seguridad',
    items: ['Validación de inputs', 'Throttle guards', 'Variables de entorno (.env)']
  },
  {
    icon: <Speed />,
    title: 'Performance',
    items: ['Optimización de consultas', 'Manejo de concurrencia', 'Caché implementado']
  },
  {
    icon: <StorageIcon />,
    title: 'Base de Datos',
    items: ['PostgreSQL en Render', 'Tabla birthdays', 'Conexión pool optimizada']
  },
  {
    icon: <Cloud />,
    title: 'Despliegue',
    items: ['Backend en Render', 'Frontend React', 'PostgreSQL gratuito']
  }
]

export default function Home() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(0)
  const currentEndpoint = ENDPOINTS[selectedEndpoint]

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto mb-10 text-center flex flex-col items-center gap-3 px-2">
        <img src={logo} alt="Rindegastos" className="h-16 w-16 md:h-20 md:w-20" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          Prueba Técnica
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Backend NestJS con 3 endpoints REST + Frontend React + PostgreSQL.
          Sistema completo desplegado en Render.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-12">
        <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <Api className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Endpoints</h2>
          </div>

          <div className="space-y-3 mb-5 flex-1">
            {ENDPOINTS.map((endpoint, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedEndpoint(idx)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedEndpoint === idx
                    ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${endpoint.color}`}>
                      {endpoint.method}
                    </span>
                    <span className="font-semibold text-gray-900">{endpoint.title}</span>
                  </div>
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-5">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">URL Completa</p>
                <div className="p-3 bg-gray-100 rounded text-sm font-mono text-gray-900 break-all">
                  {currentEndpoint.url}
                  <span className="text-blue-600">{currentEndpoint.params}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-medium text-sm">{currentEndpoint.method}</span>
                <Link
                  to={currentEndpoint.path}
                  className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 text-sm"
                >
                  Probar interfaz →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
              <StorageIcon className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Base de Datos</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="font-medium text-green-800">Estado</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Host</p>
                  <div className="p-2 bg-gray-100 rounded text-xs font-mono truncate">{POSTGRES_INFO.host}</div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Password</p>
                  <div className="p-2 bg-gray-100 rounded text-xs font-mono truncate">{POSTGRES_INFO.password}</div>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Schema</p>
                <div className="text-xs font-mono text-gray-900 p-3 bg-gray-50 rounded border overflow-x-auto">
                  CREATE TABLE birthdays (id SERIAL PRIMARY KEY, ...);
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
              <Cloud className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Render</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Backend URL</span>
                <a 
                  href="https://prueba-rindegastos-backend.onrender.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Abrir →
                </a>
              </div>
              <div className="text-xs font-mono text-gray-500 p-2 bg-gray-100 rounded truncate">
                https://prueba-rindegastos-backend.onrender.com
              </div>
              <ul className="pt-3 border-t border-gray-200 space-y-2 text-sm">
                {['Web Service (NestJS)', 'PostgreSQL Database', 'React Frontend'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6 px-2">Implementación</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {IMPLEMENTATION_DETAILS.map((detail, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                {detail.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-3">{detail.title}</h3>
              <ul className="space-y-2">
                {detail.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <footer className="max-w-6xl mx-auto border-t border-gray-300 pt-8 text-center text-gray-600 text-sm">
        <p>Prueba Técnica Rindegastos • Backend NestJS + React + PostgreSQL</p>
      </footer>
    </div>
  )
}





