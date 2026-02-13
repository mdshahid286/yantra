import React, { useState } from 'react';
import { FaChartPie, FaCalculator } from 'react-icons/fa';
import '../styles/ProfitPrediction.css';

const ProfitPrediction = () => {
    const [inputs, setInputs] = useState({
        yield: '', // Quintals
        price: '', // Per Quintal
        expense: 5000 // Default Mock Total Expense
    });
    const [profit, setProfit] = useState(null);

    const calculateProfit = (e) => {
        e.preventDefault();
        const totalIncome = parseFloat(inputs.yield) * parseFloat(inputs.price);
        const estimatedProfit = totalIncome - inputs.expense;
        setProfit({
            income: totalIncome,
            net: estimatedProfit,
            margin: ((estimatedProfit / totalIncome) * 100).toFixed(1)
        });
    };

    return (
        <div className="container profit-page">
            <div className="page-header text-center">
                <h2><FaChartPie /> ROI & Profit Predictor</h2>
                <p>Estimate your seasonal returns before harvesting.</p>
            </div>

            <div className="profit-layout">
                <form onSubmit={calculateProfit} className="card profit-form">
                    <div className="form-group">
                        <label>Expected Yield (Quintals)</label>
                        <input
                            type="number"
                            placeholder="Ex: 50"
                            value={inputs.yield}
                            onChange={(e) => setInputs({ ...inputs, yield: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Expected Market Price (₹/Quintal)</label>
                        <input
                            type="number"
                            placeholder="Ex: 2200"
                            value={inputs.price}
                            onChange={(e) => setInputs({ ...inputs, price: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Total Expense (₹)</label>
                        <input
                            type="number"
                            value={inputs.expense}
                            onChange={(e) => setInputs({ ...inputs, expense: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mt-lg">
                        <FaCalculator /> Calculate Profit
                    </button>
                </form>

                {profit && (
                    <div className="card profit-result fade-in">
                        <div className="result-row">
                            <span>Total Income</span>
                            <span className="val income">₹{profit.income.toLocaleString()}</span>
                        </div>
                        <div className="result-row">
                            <span>Total Expense</span>
                            <span className="val expense">- ₹{inputs.expense.toLocaleString()}</span>
                        </div>
                        <div className="divider"></div>
                        <div className={`result-row net-profit ${profit.net >= 0 ? 'positive' : 'negative'}`}>
                            <span>Net Profit</span>
                            <span className="val">₹{profit.net.toLocaleString()}</span>
                        </div>

                        <div className="margin-badge">
                            Profit Margin: {profit.margin}%
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfitPrediction;
