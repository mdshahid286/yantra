import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaChartPie, FaCalculator, FaRocket, FaMoneyBillWave,
    FaExclamationCircle, FaCheckCircle, FaChartLine, FaUndo
} from 'react-icons/fa';
import '../styles/ProfitPrediction.css';

const ProfitPrediction = () => {
    const [inputs, setInputs] = useState({
        yield: '',
        price: '',
        expense: ''
    });
    const [profit, setProfit] = useState(null);
    const [loading, setLoading] = useState(false);

    const calculateProfit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const income = parseFloat(inputs.yield) * parseFloat(inputs.price);
            const net = income - parseFloat(inputs.expense);
            setProfit({
                income,
                net,
                margin: ((net / income) * 100).toFixed(1),
                roi: ((net / parseFloat(inputs.expense)) * 100).toFixed(0),
                breakEvenPrice: (parseFloat(inputs.expense) / parseFloat(inputs.yield)).toFixed(2)
            });
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="profit-container">
            <header className="page-header-modern">
                <h1>ROI & Profit Predictor</h1>
                <p>Forecasting harvesting returns with advanced margin analysis</p>
            </header>

            <div className="profit-grid">
                {/* Inputs Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="calc-input-card glass-card"
                >
                    <div className="card-header-pro">
                        <FaCalculator />
                        <h3>Economic Parameters</h3>
                    </div>

                    <form onSubmit={calculateProfit} className="profit-form">
                        <div className="input-group-pro">
                            <label>Estimated Harvest Yield (Quintals)</label>
                            <input
                                type="number"
                                placeholder="e.g. 120"
                                value={inputs.yield}
                                onChange={(e) => setInputs({ ...inputs, yield: e.target.value })}
                                required
                            />
                        </div>

                        <div className="input-group-pro">
                            <label>Estimated Market Price (₹ / Qntl)</label>
                            <input
                                type="number"
                                placeholder="e.g. 2450"
                                value={inputs.price}
                                onChange={(e) => setInputs({ ...inputs, price: e.target.value })}
                                required
                            />
                        </div>

                        <div className="input-group-pro">
                            <label>Total Input Investment (₹)</label>
                            <input
                                type="number"
                                placeholder="Total Seeds + Fert + Labor"
                                value={inputs.expense}
                                onChange={(e) => setInputs({ ...inputs, expense: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary btn-block solve-btn ${loading ? 'loading' : ''}`}
                            disabled={loading || !inputs.yield}
                        >
                            {loading ? "Running Simulations..." : "Calculate ROAS & Profit"}
                        </button>
                    </form>
                </motion.div>

                {/* Results Card */}
                <AnimatePresence>
                    {profit ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="profit-result-card glass-card"
                        >
                            <div className="result-header-pro">
                                <div className="title">
                                    <FaRocket />
                                    <h3>Financial Projection</h3>
                                </div>
                                <button className="reset-mini" onClick={() => setProfit(null)}><FaUndo /></button>
                            </div>

                            <div className="metrics-showcase">
                                <div className="main-metric">
                                    <span className="label">Estimated Net Profit</span>
                                    <div className={`value ${profit.net >= 0 ? 'text-success' : 'text-danger'}`}>
                                        ₹{profit.net.toLocaleString()}
                                    </div>
                                </div>
                                <div className="side-metric">
                                    <span className="label">ROI Percentage</span>
                                    <div className="value">{profit.roi}%</div>
                                </div>
                            </div>

                            <div className="financial-bars">
                                <div className="f-item">
                                    <div className="f-label"><span>Gross Income</span> <span>₹{profit.income.toLocaleString()}</span></div>
                                    <div className="f-progress"><div className="bg-success" style={{ width: '100%' }}></div></div>
                                </div>
                                <div className="f-item">
                                    <div className="f-label"><span>Infrastructure Cost</span> <span>₹{parseFloat(inputs.expense).toLocaleString()}</span></div>
                                    <div className="f-progress"><div className="bg-danger" style={{ width: `${(inputs.expense / profit.income * 100).toFixed(0)}%` }}></div></div>
                                </div>
                            </div>

                            <div className="insight-box">
                                <div className="i-item">
                                    <FaChartLine />
                                    <div>
                                        <strong>Break-even Price: ₹{profit.breakEvenPrice}/Qntl</strong>
                                        <p>You need at least this price to cover costs.</p>
                                    </div>
                                </div>
                                <div className="i-item">
                                    {profit.margin > 20 ? <FaCheckCircle className="text-success" /> : <FaExclamationCircle className="text-warning" />}
                                    <div>
                                        <strong>Profit Margin: {profit.margin}%</strong>
                                        <p>{profit.margin > 20 ? 'Solid performance' : 'High input costs detected'}</p>
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-secondary btn-block"><FaMoneyBillWave /> Compare with Seasonal Averages</button>
                        </motion.div>
                    ) : (
                        <div className="profit-placeholder glass-card">
                            <FaChartPie className="p-icon" />
                            <h3>ROI Discovery</h3>
                            <p>Calculate your expected returns and margins by entering your harvest targets.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProfitPrediction;
