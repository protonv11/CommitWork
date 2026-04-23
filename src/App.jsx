import './styles/globals.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WalletProvider }     from './context/WalletContext'
import { EscrowProvider }     from './context/EscrowContext'
import AnimatedBackground     from './components/ui/AnimatedBackground'
import Navbar                 from './components/ui/Navbar'
import NotificationToast      from './components/ui/NotificationToast'
import Landing                from './pages/Landing'
import ClientDashboard        from './pages/ClientDashboard'
import CreatorDashboard       from './pages/CreatorDashboard'
import TokenPage              from './pages/TokenPage'

export default function App() {
  return (
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
  )
}
