import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import Sidebar from './components/Sidebar'

const Home = lazy(() => import('./pages/home/Home'))
const BirthdayList = lazy(() => import('./pages/birthday/BirthdayList'))
const BirthdayUser = lazy(() => import('./pages/birthday/BirthdayUser'))
const Exchange = lazy(() => import('./pages/exchange/Exchange'))
const Numbers = lazy(() => import('./pages/numbers/Numbers'))

const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center p-10">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
  </div>
)

function Layout() {
  const location = useLocation()
  useEffect(() => {
    const idle = 'requestIdleCallback' in window ? window.requestIdleCallback : (fn: () => void) => setTimeout(fn, 500)
    const cancelIdle =
      'cancelIdleCallback' in window
        ? (id: number) => (window as any).cancelIdleCallback(id)
        : (id: number) => clearTimeout(id)

    const id = idle(() => {
      import('./pages/exchange/Exchange')
      import('./pages/numbers/Numbers')
      import('./pages/birthday/BirthdayList')
      import('./pages/birthday/BirthdayUser')
    })

    return () => cancelIdle(id as any)
  }, [])

  const current = (() => {
    const path = location.pathname
    if (path.startsWith('/usuarios')) return 'usuarios'
    if (path.startsWith('/ingresar')) return 'ingresar'
    if (path.startsWith('/exchange')) return 'exchange'
    if (path.startsWith('/numbers')) return 'numbers'
    return ''
  })()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar selected={current} />
      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/usuarios" element={<BirthdayList />} />
            <Route path="/ingresar" element={<BirthdayUser />} />
            <Route path="/exchange" element={<Exchange />} />
            <Route path="/numbers" element={<Numbers />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
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

