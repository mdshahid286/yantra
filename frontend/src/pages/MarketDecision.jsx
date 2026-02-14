import React, { useState, useEffect } from 'react';
import { FaChartLine, FaArrowUp, FaArrowDown, FaRegClock, FaGlobe, FaMoneyBillWave } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { motion } from 'framer-motion';
import API from '../services/api';
import '../styles/MarketDecision.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const MarketDecision = () => {
    const [selectedCrop, setSelectedCrop] = useState('Wheat');
    const [loading, setLoading] = useState(false);
    const [marketInfo, setMarketInfo] = useState({
        currentPrice: 2450,
        trend: "Stable",
        recommendation: "Hold",
        history: [],
        buyingTips: [],
        sellingTips: [],
        insights: []
    });

    const fetchMarket = async (cropName) => {
        setLoading(true);
        console.log(`[Frontend] Fetching 1-Month AI Data for: ${cropName}`);
        try {
            const response = await API.post('/market', { crop: cropName });
            console.log("[Frontend] Deep AI Market Response:", response.data);
            setMarketInfo(response.data);
        } catch (error) {
            console.error('Market data fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarket(selectedCrop);
    }, [selectedCrop]);

    const chartData = {
        labels: marketInfo.history.length > 0 ? marketInfo.history.map(h => h.date) : ['Week 1', 'Week 2', 'Week 3', 'Today'],
        datasets: [
            {
                label: `${selectedCrop} Monthly Trend (INR/Quintal)`,
                data: marketInfo.history.length > 0 ? marketInfo.history.map(h => h.price) : [2200, 2280, 2350, 2450],
                borderColor: '#1B5E20',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(27, 94, 32, 0.3)');
                    gradient.addColorStop(1, 'rgba(27, 94, 32, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#1B5E20',
                bodyColor: '#333',
                titleFont: { weight: 'bold' },
                padding: 12,
                borderColor: '#1B5E20',
                borderWidth: 1,
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { callback: (value) => '₹' + value }
            },
            x: {
                grid: { display: false }
            }
        }
    };

    return (
        <div className="market-container">
            <header className="page-header-modern">
                <div className="title-section">
                    <h1>Market Intelligence Dashboard</h1>
                    <p>30-Day Predictive Analysis & Strategic Commodity Insights</p>
                </div>
                <div className="market-badges">
                    <select
                        value={selectedCrop}
                        onChange={(e) => setSelectedCrop(e.target.value)}
                        className="crop-selector-modern"
                    >
                        <option value="Wheat">Wheat</option>
                        <option value="Rice">Rice</option>
                        <option value="Tomato">Tomato</option>
                        <option value="Onion">Onion</option>
                        <option value="Soybean">Soybean</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Potato">Potato</option>
                        <option value="Maize">Maize</option>
                    </select>
                    <span className="badge glass-card"><FaRegClock /> Monthly Report</span>
                </div>
            </header>

            <div className={`market-grid ${loading ? 'loading-blur' : ''}`}>
                <div className="main-analytics">
                    {/* Price Trend Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={selectedCrop + "-chart"}
                        className="analytics-card glass-card"
                    >
                        <div className="analytics-header">
                            <div className="asset-info">
                                <h3>{selectedCrop} Price Index</h3>
                                <p>Past 30 Days Trend</p>
                            </div>
                            <div className="price-tag">
                                <span className="current-price">₹{marketInfo.currentPrice.toLocaleString()}</span>
                                <span className={`price-change ${marketInfo.trend === 'Decreasing' ? 'negative' : 'positive'}`}>
                                    {marketInfo.trend === 'Decreasing' ? <FaArrowDown /> : <FaArrowUp />} {marketInfo.trend}
                                </span>
                            </div>
                        </div>
                        <div className="chart-wrapper">
                            <Line options={options} data={chartData} />
                        </div>
                    </motion.div>

                    {/* Insights Row */}
                    <div className="insights-row">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="insight-box glass-card"
                        >
                            <h4><FaChartLine /> Market Insights</h4>
                            <ul className="logic-list">
                                {marketInfo.insights.map((ins, i) => <li key={i}>{ins}</li>)}
                                {marketInfo.insights.length === 0 && <li>Analyzing market factors...</li>}
                            </ul>
                        </motion.div>
                    </div>
                </div>

                {/* Strategy Sidebar */}
                <div className="side-panels">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="decision-card glass-card buy-side"
                    >
                        <h3>📥 Buying Tips</h3>
                        <ul className="tips-list">
                            {marketInfo.buyingTips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="decision-card glass-card sell-side"
                    >
                        <h3>📤 Selling Tips</h3>
                        <ul className="tips-list">
                            {marketInfo.sellingTips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                    </motion.div>

                    <motion.div
                        className="rec-card glass-card"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <strong>AI Summary</strong>
                        <p>{marketInfo.recommendation}</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
        </div >
    );
};

export default MarketDecision;
