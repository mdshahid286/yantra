import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaCloudSun, FaChartLine, FaRobot, FaMicrophone, FaLeaf,
    FaCoins, FaUniversity, FaCalculator, FaBell, FaArrowRight,
    FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import API from '../services/api';
import '../styles/Dashboard.css';

const FeatureCard = ({ icon, title, desc, color, onClick, delay }) => (
    <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="feature-card-modern glass-card"
        onClick={onClick}
    >
        <div className="card-top" style={{ backgroundColor: `${color}15` }}>
            <div className="icon-badge" style={{ color: color }}>
                {icon}
            </div>
        </div>
        <div className="card-body">
            <h3>{title}</h3>
            <p>{desc}</p>
            <div className="card-footer">
                <span style={{ color: color }}>Explore</span>
                <FaArrowRight className="arrow-icon" style={{ color: color }} />
            </div>
        </div>
    </motion.button>
);

const MetricWidget = ({ label, value, trend, isUp }) => (
    <div className="metric-widget glass-card">
        <span className="metric-label">{label}</span>
        <div className="metric-main">
            <span className="metric-value">{value}</span>
            <span className={`metric-trend ${isUp ? 'up' : 'down'}`}>
                {isUp ? <FaArrowUp /> : <FaArrowDown />} {trend}
            </span>
        </div>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [weather, setWeather] = React.useState(null);
    const [marketTrends, setMarketTrends] = React.useState([]);

    React.useEffect(() => {
        const fetchMarketTrends = async () => {
            try {
                const response = await API.get('/market/trends');
                if (response.data.success) {
                    setMarketTrends(response.data.data);
                }
            } catch (error) {
                console.error("Market trends error:", error);
            }
        };
        fetchMarketTrends();
        setLoading(false);
    }, []);

    return (
        <div className="dashboard-wrapper">
            <header className="page-header">
                <div className="header-text">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        Regional Command Center
                    </motion.h1>
                    <p className="subtitle">Welcome back, Kisan. Monitoring 12.5 Acres in Pune West.</p>
                </div>
                <div className="header-actions">
                    <div className="notification-bell glass-card">
                        <FaBell />
                        <span className="dot"></span>
                    </div>
                </div>
            </header>

            {/* Hero Insights Section */}
            <section className="insight-grid">
                <div className="weather-featured glass-card">
                    {loading ? (
                        <div className="weather-loading">
                            <span className="loader"></span>
                            Fetching Live Forecast...
                        </div>
                    ) : (
                        <>
                            <div className="weather-header">
                                <FaCloudSun className="w-icon" />
                                <div className="w-text">
                                    <h3>{weather?.weather[0]?.main || "Partly Cloudy"}</h3>
                                    <span>Temp: {Math.round(weather?.main?.temp) || "28"}°C | Humidity: {weather?.main?.humidity || "45"}%</span>
                                </div>
                            </div>
                            <div className="weather-details-row">
                                <div className="w-stat">
                                    <span className="label">Wind</span>
                                    <span className="value">{weather?.wind?.speed || "12"} km/h</span>
                                </div>
                                <div className="w-stat">
                                    <span className="label">Pressure</span>
                                    <span className="value">{weather?.main?.pressure || "1012"} hPa</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="market-preview glass-card">
                    <div className="preview-header">
                        <h3>Live Market Feed</h3>
                        <button className="btn-text" onClick={() => navigate('/market')}>Analyze</button>
                    </div>
                    <div className="market-list-compact">
                        {marketTrends.length > 0 ? (
                            marketTrends.map((m, i) => (
                                <div key={i} className="m-item">
                                    <span className="m-name">{m.commodity}</span>
                                    <span className="m-price">
                                        ₹{m.currentPrice.toLocaleString()}
                                        <span className={`m-diff ${m.trend === 'down' ? 'down' : ''}`}>
                                            {m.trend === 'up' ? '+' : m.trend === 'down' ? '-' : ''}
                                            ₹{Math.abs(m.forecast - m.currentPrice)}
                                        </span>
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="m-item">Loading market data...</div>
                        )}
                    </div>
                </div>
            </section>

            {/* Metrics Row */}
            <section className="metrics-row">
                <MetricWidget label="Total Income" value="₹12.4L" trend="12%" isUp={true} />
                <MetricWidget label="Current Expenses" value="₹4.2L" trend="3%" isUp={false} />
                <MetricWidget label="Profit Margin" value="66%" trend="5%" isUp={true} />
            </section>

            {/* Features Nav */}
            <section className="feature-navigator">
                <div className="section-header">
                    <h2>Agricultural Suite</h2>
                    <p>AI-driven modules to optimize your farm lifecycle</p>
                </div>
                <div className="features-modern-grid">
                    <FeatureCard
                        icon={<FaRobot />}
                        title="Crop Intelligence"
                        desc="AI soil & climate analysis for optimal crop selection"
                        color="#2E7D32"
                        delay={0.1}
                        onClick={() => navigate('/crop-recommend')}
                    />
                    <FeatureCard
                        icon={<FaMicrophone />}
                        title="Voice Assistant"
                        desc="Control your farm via voice commands in local language"
                        color="#9C27B0"
                        delay={0.2}
                        onClick={() => navigate('/voice')}
                    />
                    <FeatureCard
                        icon={<FaLeaf />}
                        title="Disease Guard"
                        desc="Real-time scanning for plant diseases & pests"
                        color="#D32F2F"
                        delay={0.3}
                        onClick={() => navigate('/disease')}
                    />
                    <FeatureCard
                        icon={<FaCalculator />}
                        title="Smart Fertilizer"
                        desc="Custom NPK dosage based on land fertility tests"
                        color="#F9A825"
                        delay={0.4}
                        onClick={() => navigate('/fertilizer')}
                    />
                    <FeatureCard
                        icon={<FaUniversity />}
                        title="Policy Tracker"
                        desc="Latest government schemes & financial support"
                        color="#1976D2"
                        delay={0.5}
                        onClick={() => navigate('/schemes')}
                    />
                    <FeatureCard
                        icon={<FaChartLine />}
                        title="ROI Predictor"
                        desc="End-to-end profit forecasting and market timing"
                        color="#00897B"
                        delay={0.6}
                        onClick={() => navigate('/profit')}
                    />
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
