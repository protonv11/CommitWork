import './styles/globals.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnimatedBackground from './components/ui/AnimatedBackground';
import Navbar from './components/ui/Navbar';
import Landing from './pages/Landing';
import ClientDashboard from './pages/ClientDashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import TokenPage from './pages/TokenPage';

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedBackground />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/creator" element={<CreatorDashboard />} />
        <Route path="/token" element={<TokenPage />} />
      </Routes>
    </BrowserRouter>
  );
}
