import './styles/globals.css'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { WalletProvider }     from './context/WalletContext'
import { EscrowProvider }     from './context/EscrowContext'
import AnimatedBackground     from './components/ui/AnimatedBackground'
import Navbar                 from './components/ui/Navbar'
import NotificationToast      from './components/ui/NotificationToast'
import LoadingScreen          from './components/ui/LoadingScreen'
import Landing                from './pages/Landing'
import ClientDashboard        from './pages/ClientDashboard'
import CreatorDashboard       from './pages/CreatorDashboard'
import TokenPage              from './pages/TokenPage'

export default function App() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1300)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <AnimatePresence>
        {!ready && <LoadingScreen key="loader" />}
      </AnimatePresence>
      {ready && (
        <WalletProvider>
          <EscrowProvider>
            <BrowserRouter>
              <AnimatedBackground />
              <Navbar />
              <NotificationToast />
              <Routes>
                <Route path="/"        element={<Landing />} />
                <Route path="/client"  element={<ClientDashboard />} />
                <Route path="/creator" element={<CreatorDashboard />} />
                <Route path="/token"   element={<TokenPage />} />
              </Routes>
            </BrowserRouter>
          </EscrowProvider>
        </WalletProvider>
      )}
    </>
  )
}
