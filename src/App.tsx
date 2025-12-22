// @ts-nocheck
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import BirthdayList from './pages/birthday/BirthdayList.jsx'
import BirthdayUser from './pages/birthday/BirthdayUser.jsx'
import Exchange from './pages/exchange/Exchange.jsx'

const Home = () => (
  <section className="space-y-2">
    <h1 className="text-2xl font-bold text-gray-900">Bienvenido</h1>
    <p className="text-gray-600">Selecciona una sección en la navegación.</p>
  </section>
)

function Layout() {
  const navigate = useNavigate()

  const handleSelect = (nodeId: string) => {
    if (nodeId === 'usuarios') {
      navigate('/usuarios')
    } else if (nodeId === 'ingresar') {
      navigate('/ingresar')
    } else if (nodeId === 'exchange') {
      navigate('/exchange')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onSelect={handleSelect} />
      <main className="flex-1 px-8 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usuarios" element={<BirthdayList />} />
          <Route path="/ingresar" element={<BirthdayUser />} />
          <Route path="/exchange" element={<Exchange />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App
