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
    const [marketInfo, setMarketInfo] = useState({
        currentPrice: 2450,
        trend: "Stable",
        recommendation: "Hold"
    });

    useEffect(() => {
        const fetchMarket = async () => {
            try {
                const response = await API.post('/market', { crop: 'Wheat' });
                setMarketInfo(response.data);
            } catch (error) {
                console.error('Market data fetch error:', error);
            }
        };
        fetchMarket();
    }, []);

    const data = {
        labels: ['1st Feb', '4th Feb', '7th Feb', '10th Feb', '13th Feb'],
        datasets: [
            {
                label: 'Current Price',
                data: [2200, 2280, 2250, 2350, 2450],
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
            },
            {
                label: 'Previous Year Avg',
                data: [2100, 2150, 2120, 2180, 2200],
                borderColor: '#999',
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0,
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
                bodyColor: '#666',
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
                    <span className="badge glass-card"><FaGlobe /> Global Market: Up 2.4%</span>
                    <span className="badge glass-card"><FaRegClock /> Next Update: 2h 15m</span>
                </div>
            </header>

            <div className="market-grid">
                {/* Analytics Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="analytics-card glass-card"
                >
                    <div className="analytics-header">
                        <div className="asset-info">
                            <h3>Wheat (Grade A)</h3>
                            <p>Mandi: Pune APMC</p>
                        </div>
                        <div className="price-tag">
                            <span className="current-price">₹{marketInfo.currentPrice.toLocaleString()}</span>
                            <span className="price-change positive"><FaArrowUp /> {marketInfo.trend} today</span>
                        </div>
                    </div>

                    <div className="chart-wrapper">
                        <Line options={options} data={data} />
                    </div>
                </motion.div>

                {/* Decision & Info Cards */}
                <div className="side-panels">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="decision-card glass-card"
                    >
                        <div className="badge-modern hold">Recommended</div>
                        <h2>Price Prediction</h2>
                        <div className="rec-box hold">
                            <div className="rec-icon"><FaMoneyBillWave /></div>
                            <div className="rec-content">
                                <strong>Strategic ACTION</strong>
                                <p>{marketInfo.recommendation}</p>
                            </div>
                        </div>

                        <ul className="logic-list">
                            <li>Low arrival rates in Northern Mandis</li>
                            <li>Expected procurement demand increase</li>
                            <li>Favorable moisture levels in current crop</li>
                        </ul>

                        <button className="btn btn-primary btn-block">Set Price Alert @ ₹2,600</button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="news-card glass-card"
                    >
                        <h3>Market News</h3>
                        <div className="news-item">
                            <span className="news-date">10 Mins Ago</span>
                            <p>Govt considers increasing minimum support price (MSP) for next season.</p>
                        </div>
                        <div className="news-item">
                            <span className="news-date">2 Hours Ago</span>
                            <p>New export warehouse facility opened in Mumbai Port.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MarketDecision;
