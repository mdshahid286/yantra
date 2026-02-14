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
        seeds: '',
        fertilizers: '',
        labor: '',
        tractor: '',
        others: ''
    });
    const [profit, setProfit] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSensitivity, setShowSensitivity] = useState(false);

    const calculateProfit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const totalExpense =
                parseFloat(inputs.seeds || 0) +
                parseFloat(inputs.fertilizers || 0) +
                parseFloat(inputs.labor || 0) +
                parseFloat(inputs.tractor || 0) +
                parseFloat(inputs.others || 0);

            const income = parseFloat(inputs.yield) * parseFloat(inputs.price);
            const net = income - totalExpense;

            setProfit({
                income,
                expense: totalExpense,
                net,
                margin: ((net / income) * 100).toFixed(1),
                roi: ((net / totalExpense) * 100).toFixed(0),
                breakEvenPrice: (totalExpense / parseFloat(inputs.yield)).toFixed(2),
                sensitivity: [
                    { label: '-10% Price', val: (income * 0.9 - totalExpense).toFixed(0) },
                    { label: 'Market Price', val: net.toFixed(0) },
                    { label: '+10% Price', val: (income * 1.1 - totalExpense).toFixed(0) }
                ]
            });
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="profit-container">
            <header className="page-header-modern">
                <h1>Financial Forensics</h1>
                <p>Professional itemized crop ROI & price sensitivity analysis</p>
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
                        <h3>Itemized Investment</h3>
                    </div>

                    <form onSubmit={calculateProfit} className="profit-form">
                        <div className="form-row">
                            <div className="input-group-pro">
                                <label>Harvest Yield (Quintals)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 100"
                                    value={inputs.yield}
                                    onChange={(e) => setInputs({ ...inputs, yield: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group-pro">
                                <label>Market Price (₹/Quintal)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 2500"
                                    value={inputs.price}
                                    onChange={(e) => setInputs({ ...inputs, price: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="expense-categories">
                            <label>Expense Itemization (₹)</label>
                            <div className="expense-grid">
                                <div className="ex-field"><span>Seeds</span><input type="number" value={inputs.seeds} onChange={(e) => setInputs({ ...inputs, seeds: e.target.value })} /></div>
                                <div className="ex-field"><span>Fert/Pest</span><input type="number" value={inputs.fertilizers} onChange={(e) => setInputs({ ...inputs, fertilizers: e.target.value })} /></div>
                                <div className="ex-field"><span>Labor</span><input type="number" value={inputs.labor} onChange={(e) => setInputs({ ...inputs, labor: e.target.value })} /></div>
                                <div className="ex-field"><span>Machinery</span><input type="number" value={inputs.tractor} onChange={(e) => setInputs({ ...inputs, tractor: e.target.value })} /></div>
                                <div className="ex-field"><span>Irrigation/Etc</span><input type="number" value={inputs.others} onChange={(e) => setInputs({ ...inputs, others: e.target.value })} /></div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary btn-block solve-btn ${loading ? 'loading' : ''}`}
                            disabled={loading || !inputs.yield}
                        >
                            {loading ? "Analyzing P&L..." : "Calculate Net Profit"}
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
                                    <h3>Performance Report</h3>
                                </div>
                                <button className="reset-mini" onClick={() => setProfit(null)}><FaUndo /></button>
                            </div>

                            <div className="metrics-showcase">
                                <div className="main-metric">
                                    <span className="label">Projected Net Profit</span>
                                    <div className={`value ${profit.net >= 0 ? 'text-success' : 'text-danger'}`}>
                                        ₹{profit.net.toLocaleString()}
                                    </div>
                                </div>
                                <div className="side-metric">
                                    <span className="label">ROI</span>
                                    <div className="value">{profit.roi}%</div>
                                </div>
                            </div>

                            <div className="profit-breakdown">
                                <div className="p-item">
                                    <span>Gross Income</span>
                                    <span>₹{profit.income.toLocaleString()}</span>
                                </div>
                                <div className="p-item">
                                    <span>Total Investment</span>
                                    <span>₹{profit.expense.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="insight-box">
                                <div className="i-item">
                                    <FaChartLine />
                                    <div>
                                        <strong>Break-even: ₹{profit.breakEvenPrice}/Qntl</strong>
                                        <p>Critical price floor to avoid losses.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="sensitivity-section">
                                <button
                                    className="sensitivity-toggle"
                                    onClick={() => setShowSensitivity(!showSensitivity)}
                                >
                                    {showSensitivity ? "Hide Risk Analysis" : "Show Price Sensitivity Analysis"}
                                </button>

                                {showSensitivity && (
                                    <div className="sensitivity-table">
                                        {profit.sensitivity.map((s, i) => (
                                            <div key={i} className="s-row">
                                                <span>{s.label}</span>
                                                <span className={s.val < 0 ? 'text-danger' : 'text-success'}>₹{parseInt(s.val).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button className="btn btn-secondary btn-block"><FaMoneyBillWave /> Download Profit Ledger</button>
                        </motion.div>
                    ) : (
                        <div className="profit-placeholder glass-card">
                            <FaChartPie className="p-icon" />
                            <h3>Financial Foresight</h3>
                            <p>Enter your itemized costs and yield goals to see your agricultural business health.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProfitPrediction;
