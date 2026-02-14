import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaCoins, FaPlus, FaTrash, FaChartBar, FaCalendarAlt, FaTag,
    FaWallet, FaArrowUp, FaArrowDown, FaMicrophone
} from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    Title, Tooltip, Legend
} from 'chart.js';
import API from '../services/api';
import '../styles/ExpenseTracker.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExpenseTracker = () => {
    // Load from localStorage or use sample data
    const [expenses, setExpenses] = useState(() => {
        const saved = localStorage.getItem('yantra_expenses');
        return saved ? JSON.parse(saved) : [
            { _id: '1', category: 'Seeds for Wheat', amount: 4500, date: '2026-02-10', type: 'debit', createdAt: '2026-02-10' },
            { _id: '2', category: 'Wheat Sale (Mandi)', amount: 25000, date: '2026-02-12', type: 'credit', createdAt: '2026-02-12' },
            { _id: '3', category: 'Fertilizers', amount: 3200, date: '2026-02-13', type: 'debit', createdAt: '2026-02-13' },
            { _id: '4', category: 'Borewell Repair', amount: 1500, date: '2026-02-14', type: 'debit', createdAt: '2026-02-14' }
        ];
    });

    const [loading, setLoading] = useState(false);
    const [newExp, setNewExp] = useState({ category: '', amount: '', date: new Date().toISOString().split('T')[0], type: 'debit' });
    const [isListening, setIsListening] = useState(false);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('yantra_expenses', JSON.stringify(expenses));
    }, [expenses]);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newExp.category || !newExp.amount) return;

        const newItem = {
            ...newExp,
            _id: Math.random().toString(36).substr(2, 9),
            amount: parseFloat(newExp.amount),
            createdAt: new Date().toISOString()
        };

        setExpenses([newItem, ...expenses]);
        setNewExp({ category: '', amount: '', date: new Date().toISOString().split('T')[0], type: 'debit' });
    };

    const handleDelete = (id) => {
        setExpenses(expenses.filter(e => e._id !== id));
    };

    const totalDebit = expenses.filter(e => e.type === 'debit').reduce((acc, c) => acc + c.amount, 0);
    const totalCredit = expenses.filter(e => e.type === 'credit').reduce((acc, c) => acc + c.amount, 0);

    const chartData = {
        labels: ['Seeds', 'Fertilizer', 'Labor', 'Others'],
        datasets: [{
            label: 'Spending Breakdown',
            data: [
                expenses.filter(e => e.category.toLowerCase().includes('seed')).reduce((a, b) => a + b.amount, 0) || 4500,
                expenses.filter(e => e.category.toLowerCase().includes('fert')).reduce((a, b) => a + b.amount, 0) || 3200,
                expenses.filter(e => e.category.toLowerCase().includes('labor')).reduce((a, b) => a + b.amount, 0) || 1200,
                expenses.filter(e => !['seed', 'fert', 'labor'].some(k => e.category.toLowerCase().includes(k))).reduce((a, b) => a + b.amount, 0) || 5000
            ],
            backgroundColor: 'rgba(46, 125, 50, 0.6)',
            borderRadius: 8,
        }]
    };

    return (
        <div className="expense-container">
            <header className="page-header-modern">
                <h1>Financial Ledger</h1>
                <p>Comprehensive track of your farm capital and returns</p>
            </header>

            <div className="expense-grid">
                {/* Analytics Section */}
                <div className="analytics-sidebar">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="balance-card glass-card"
                    >
                        <div className="b-header">
                            <FaWallet />
                            <span>Net Profit Flow</span>
                        </div>
                        <div className="val">₹{(totalCredit - totalDebit).toLocaleString()}</div>
                        <div className="b-footer">
                            <div className="item up"><FaArrowUp /> ₹{totalCredit.toLocaleString()}</div>
                            <div className="item down"><FaArrowDown /> ₹{totalDebit.toLocaleString()}</div>
                        </div>
                    </motion.div>

                    <div className="chart-card glass-card">
                        <h3>Usage Breakdown</h3>
                        <div className="chart-h">
                            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                        </div>
                    </div>

                    <div className="voice-log-card glass-card" onClick={() => setIsListening(!isListening)}>
                        <div className={`v-btn ${isListening ? 'active' : ''}`}>
                            <FaMicrophone />
                        </div>
                        <div className="v-text">
                            <h4>Voice Entry</h4>
                            <p>{isListening ? "Listening to amount..." : "Tap to record expense"}</p>
                        </div>
                    </div>
                </div>

                {/* Ledger Section */}
                <div className="ledger-main">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="add-ledger glass-card"
                    >
                        <div className="add-header">
                            <h3><FaPlus /> New Entry</h3>
                            <div className="type-toggle">
                                <button
                                    className={newExp.type === 'debit' ? 'active down' : ''}
                                    onClick={() => setNewExp({ ...newExp, type: 'debit' })}
                                >Expense</button>
                                <button
                                    className={newExp.type === 'credit' ? 'active up' : ''}
                                    onClick={() => setNewExp({ ...newExp, type: 'credit' })}
                                >Income</button>
                            </div>
                        </div>
                        <form onSubmit={handleAdd} className="ledger-form">
                            <div className="i-group">
                                <FaTag />
                                <input
                                    type="text"
                                    placeholder="What was this for?"
                                    value={newExp.category}
                                    onChange={e => setNewExp({ ...newExp, category: e.target.value })}
                                />
                            </div>
                            <div className="i-row">
                                <div className="i-group">
                                    <FaCoins />
                                    <input
                                        type="number"
                                        placeholder="Amount (₹)"
                                        value={newExp.amount}
                                        onChange={e => setNewExp({ ...newExp, amount: e.target.value })}
                                    />
                                </div>
                                <div className="i-group">
                                    <FaCalendarAlt />
                                    <input
                                        type="date"
                                        value={newExp.date}
                                        onChange={e => setNewExp({ ...newExp, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Add Entry</button>
                        </form>
                    </motion.div>

                    <div className="ledger-list glass-card">
                        <div className="l-header">
                            <h3>Recent Transactions</h3>
                            <FaChartBar />
                        </div>
                        <div className="transactions">
                            <AnimatePresence>
                                {expenses.map((exp, idx) => (
                                    <motion.div
                                        key={exp._id || idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="t-item"
                                    >
                                        <div className={`t-icon ${exp.type}`}>
                                            {exp.type === 'credit' ? <FaArrowUp /> : <FaArrowDown />}
                                        </div>
                                        <div className="t-info">
                                            <span className="t-name">{exp.category}</span>
                                            <span className="t-date">{new Date(exp.createdAt || exp.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className={`t-amt ${exp.type}`}>
                                            {exp.type === 'credit' ? '+' : '-'} ₹{exp.amount.toLocaleString()}
                                            <button className="del" onClick={() => handleDelete(exp._id)}><FaTrash /></button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseTracker;
