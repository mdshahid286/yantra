import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VoiceAssistant from './pages/VoiceAssistant';
import DiseaseDetection from './pages/DiseaseDetection';
import CropRecommendation from './pages/CropRecommendation';
import MarketDecision from './pages/MarketDecision';
import GovernmentSchemes from './pages/GovernmentSchemes';
import FertilizerCalculator from './pages/FertilizerCalculator';
import ExpenseTracker from './pages/ExpenseTracker';
import ProfitPrediction from './pages/ProfitPrediction';
import Community from './pages/Community';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './components/Layout.css';

// Wrapper to conditionally apply layout
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  // Sidebar Layout should only show for authenticated pages (starting with /app or feature pages)
  // Simple check: if path is / or /login, no layout.
  // Also exclude 404 page if it wraps everything, but for now getting layout on 404 inside app is fine.
  const isPublicPage = location.pathname === '/' || location.pathname === '/login';

  if (isPublicPage) {
    return children;
  }
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Main App Routes */}
          <Route path="/app" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/voice" element={<VoiceAssistant />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/crop-recommend" element={<CropRecommendation />} />
          <Route path="/market" element={<MarketDecision />} />
          <Route path="/schemes" element={<GovernmentSchemes />} />
          <Route path="/fertilizer" element={<FertilizerCalculator />} />
          <Route path="/expenses" element={<ExpenseTracker />} />
          <Route path="/profit" element={<ProfitPrediction />} />
          <Route path="/community" element={<Community />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
