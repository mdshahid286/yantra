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
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newExp, setNewExp] = useState({ category: '', amount: '', date: '', type: 'debit' });
    const [isListening, setIsListening] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await API.get('/expense');
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newExp.category || !newExp.amount) return;

        try {
            const payload = {
                ...newExp,
                userId: user?._id,
                amount: parseFloat(newExp.amount)
            };
            const response = await API.post('/expense', payload);
            setExpenses([response.data, ...expenses]);
            setNewExp({ category: '', amount: '', date: '', type: 'debit' });
        } catch (error) {
            console.error('Error adding expense:', error);
            alert('Failed to save expense.');
        }
    };

    const totalDebit = expenses.filter(e => e.type === 'debit').reduce((acc, c) => acc + c.amount, 0);
    const totalCredit = expenses.filter(e => e.type === 'credit').reduce((acc, c) => acc + c.amount, 0);

    const handleDelete = async (id) => {
        try {
            await API.delete(`/expense/${id}`);
            setExpenses(expenses.filter(e => e._id !== id));
        } catch (error) {
            console.error('Error deleting expense:', error);
            alert('Failed to delete expense.');
        }
    };

    const chartData = {
        labels: ['Seeds', 'Fertilizer', 'Fuel', 'Labor', 'Others'],
        datasets: [{
            label: 'Monthly Spending',
            data: [15400, 8200, 3100, 12000, 5000],
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
                            <button type="submit" className="btn btn-primary">Sync to Ledger</button>
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
