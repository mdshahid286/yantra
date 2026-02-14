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
        news: [],
        logic: []
    });

    const fetchMarket = async (cropName) => {
        setLoading(true);
        console.log(`[Frontend] Fetching AI Market Data for: ${cropName}`);
        try {
            const response = await API.post('/market', { crop: cropName });
            console.log("[Frontend] Received AI Data:", response.data);
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
        labels: marketInfo.history.length > 0 ? marketInfo.history.map(h => h.date) : ['1st Feb', '4th Feb', '7th Feb', '10th Feb', '13th Feb'],
        datasets: [
            {
                label: `Current Price (${selectedCrop})`,
                data: marketInfo.history.length > 0 ? marketInfo.history.map(h => h.price) : [2200, 2280, 2250, 2350, 2450],
                borderColor: '#2E7D32',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(46, 125, 50, 0.2)');
                    gradient.addColorStop(1, 'rgba(46, 125, 50, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 3,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'bottom' },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#333',
                RolandBodyColor: '#666',
                borderColor: '#eee',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { font: { size: 12 } }
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
                    <h1>Market Intelligence</h1>
                    <p>Real-time commodity analytics & price forecasting</p>
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
                    </select>
                    <span className="badge glass-card"><FaGlobe /> AI Mandi Index: Global</span>
                </div>
            </header>

            <div className={`market-grid ${loading ? 'loading-blur' : ''}`}>
                {/* Analytics Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={selectedCrop + "-chart"}
                    className="analytics-card glass-card"
                >
                    <div className="analytics-header">
                        <div className="asset-info">
                            <h3>{selectedCrop} (Grade A)</h3>
                            <p>Mandi: Regional Mandi Aggregator</p>
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

                {/* Decision & Info Cards */}
                <div className="side-panels">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={selectedCrop + "-decision"}
                        className="decision-card glass-card"
                    >
                        <div className={`badge-modern ${marketInfo.recommendation.toLowerCase().includes('sell') ? 'sell' : 'hold'}`}>
                            AI Recommended
                        </div>
                        <h2>Price Prediction</h2>
                        <div className={`rec-box ${marketInfo.recommendation.toLowerCase().includes('sell') ? 'sell' : 'hold'}`}>
                            <div className="rec-icon"><FaMoneyBillWave /></div>
                            <div className="rec-content">
                                <strong>Strategic ACTION</strong>
                                <p>{marketInfo.recommendation}</p>
                            </div>
                        </div>

                        <ul className="logic-list">
                            {marketInfo.logic.map((l, i) => <li key={i}>{l}</li>)}
                            {marketInfo.logic.length === 0 && (
                                <>
                                    <li>Analyzing supply-demand curves...</li>
                                    <li>Evaluating weather impact on logistics...</li>
                                    <li>Monitoring export policy shifts...</li>
                                </>
                            )}
                        </ul>

                        <button className="btn btn-primary btn-block">Set Price Alert for {selectedCrop}</button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        key={selectedCrop + "-news"}
                        className="news-card glass-card"
                    >
                        <h3>{selectedCrop} Market News</h3>
                        {marketInfo.news.length > 0 ? (
                            marketInfo.news.map((item, i) => (
                                <div key={i} className="news-item">
                                    <span className="news-date">{item.time}</span>
                                    <p>{item.text}</p>
                                </div>
                            ))
                        ) : (
                            <div className="news-item">
                                <span className="news-date">Just Now</span>
                                <p>Checking live news feeds for {selectedCrop}...</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MarketDecision;
