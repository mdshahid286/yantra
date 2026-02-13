import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCloudSun, FaChartLine, FaRobot, FaMicrophone, FaLeaf, FaCoins, FaUniversity, FaCalculator } from 'react-icons/fa';
import '../styles/Dashboard.css';

const QuickAction = ({ icon, label, onClick, color }) => (
    <button className="quick-action-card" onClick={onClick} style={{ borderTopColor: color }}>
        <div className="icon-wrapper" style={{ color: color }}>
            {icon}
        </div>
        <span>{label}</span>
    </button>
);

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="container dashboard">
            <header className="dashboard-header">
                <h1>Dashboard</h1>
                <p className="date-display">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </header>

            {/* Weather & Advisory Section */}
            <section className="dashboard-grid">
                <div className="card weather-card">
                    <div className="card-header">
                        <h3><FaCloudSun /> Weather Today</h3>
                    </div>
                    <div className="weather-content">
                        <div className="weather-temp">
                            <span className="temp">28°C</span>
                            <span className="condition">Sunny</span>
                        </div>
                        <div className="weather-details">
                            <p>Humidity: 65%</p>
                            <p>Wind: 12 km/h</p>
                        </div>
                    </div>
                </div>

                <div className="card advisory-card">
                    <div className="card-header">
                        <h3><FaLeaf /> Daily Advisory</h3>
                    </div>
                    <p className="advisory-text">
                        "Ideal weather for wheat irrigation today. Check for rust spots on leaves."
                    </p>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/voice')}>Read More</button>
                </div>

                <div className="card market-card">
                    <div className="card-header">
                        <h3><FaChartLine /> Market Trends</h3>
                    </div>
                    <ul className="market-list">
                        <li className="market-item"><span>Wheat</span> <span className="price-up">₹2,100 (+10)</span></li>
                        <li className="market-item"><span>Rice</span> <span className="price-down">₹1,950 (-5)</span></li>
                    </ul>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="mt-lg">
                <h2>Quick Actions</h2>
                <div className="quick-actions-grid">
                    <QuickAction icon={<FaRobot />} label="Crop Recommend" color="#2196F3" onClick={() => navigate('/crop-recommend')} />
                    <QuickAction icon={<FaMicrophone />} label="Voice Assistant" color="#9C27B0" onClick={() => navigate('/voice')} />
                    <QuickAction icon={<FaLeaf />} label="Disease Detection" color="#F44336" onClick={() => navigate('/disease')} />
                    <QuickAction icon={<FaCoins />} label="Expenses" color="#FF9800" onClick={() => navigate('/expenses')} />
                    <QuickAction icon={<FaUniversity />} label="Schemes" color="#795548" onClick={() => navigate('/schemes')} />
                    <QuickAction icon={<FaCalculator />} label="Fertilizer Calc" color="#4CAF50" onClick={() => navigate('/fertilizer')} />
                    <QuickAction icon={<FaChartLine />} label="Market Decision" color="#607D8B" onClick={() => navigate('/market')} />
                    <QuickAction icon={<FaChartLine />} label="Profit Predict" color="#009688" onClick={() => navigate('/profit')} />
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
