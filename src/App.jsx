import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import TestSupabase from './pages/TestSupabase';
import GeneralLayout from './components/GeneralLayout';
import { SupabaseProvider } from './contexts/SupabaseContext';
import './App.css';

function App() {
  return (
    <SupabaseProvider>
      <Router>
        {/* Contenedor de fondo fijo con destellos naranjas intermitentes */}
        <div className="background-container">
          <div className="sparkle-1"></div>
          <div className="sparkle-2"></div>
        </div>
        <div className="App">
          <Navbar />
          <div className="app-content">
            <GeneralLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/test" element={<TestSupabase />} />
              </Routes>
            </GeneralLayout>
          </div>
        </div>
      </Router>
    </SupabaseProvider>
  );
}

export default App;