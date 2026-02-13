import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
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
import './components/Layout.css';

// Wrapper to conditionally apply layout
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return children;
  }
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/voice" element={<VoiceAssistant />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/crop-recommend" element={<CropRecommendation />} />
          <Route path="/market" element={<MarketDecision />} />
          <Route path="/schemes" element={<GovernmentSchemes />} />
          <Route path="/fertilizer" element={<FertilizerCalculator />} />
          <Route path="/expenses" element={<ExpenseTracker />} />
          <Route path="/profit" element={<ProfitPrediction />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
