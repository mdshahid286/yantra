import React from 'react';
import { FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/MarketDecision.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MarketDecision = () => {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Wheat Price (₹/Quintal)',
                data: [2100, 2150, 2200, 2180, 2250, 2300],
                borderColor: '#2E7D32',
                backgroundColor: 'rgba(46, 125, 50, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: '6 Month Price Trend' },
        },
    };

    return (
        <div className="container market-page">
            <div className="page-header text-center">
                <h2><FaChartLine /> Market Intelligence</h2>
                <p>Analyze trends and decide the best time to sell.</p>
            </div>

            <div className="market-layout">
                <div className="card chart-container">
                    <Line options={options} data={data} />
                </div>

                <div className="card decision-panel">
                    <h3>Sell or Hold?</h3>
                    <div className="recommendation hold">
                        <span className="rec-text">Suggestion: <strong>HOLD</strong></span>
                        <p>Prices are expected to rise by 5% in the next 2 weeks due to increased demand.</p>
                    </div>

                    <div className="market-stats">
                        <div className="stat-item">
                            <span>Current Price</span>
                            <strong>₹2,300</strong>
                        </div>
                        <div className="stat-item">
                            <span>Forecast (2 Weeks)</span>
                            <strong className="text-success">₹2,415 <FaArrowUp /></strong>
                        </div>
                    </div>

                    <button className="btn btn-primary btn-block mt-lg">Set Price Alert</button>
                </div>
            </div>
        </div>
    );
};

export default MarketDecision;
