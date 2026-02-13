import React, { useState } from 'react';
import { FaCoins, FaMicrophone, FaPlus, FaTrash } from 'react-icons/fa';
import '../styles/ExpenseTracker.css';

const ExpenseTracker = () => {
    const [expenses, setExpenses] = useState([
        { id: 1, category: 'Seeds', amount: 1200, date: '2023-10-15' },
        { id: 2, category: 'Fertilizer', amount: 3500, date: '2023-10-20' },
    ]);
    const [newExpense, setNewExpense] = useState({ category: '', amount: '', date: '' });
    const [isListening, setIsListening] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newExpense.category || !newExpense.amount) return;
        setExpenses([...expenses, { ...newExpense, id: Date.now(), amount: parseFloat(newExpense.amount) }]);
        setNewExpense({ category: '', amount: '', date: '' });
    };

    const handleDelete = (id) => {
        setExpenses(expenses.filter(exp => exp.id !== id));
    };

    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    const handleVoiceInput = () => {
        setIsListening(true);
        setTimeout(() => {
            setIsListening(false);
            // Simulate voice parsing
            setNewExpense({ category: 'Pesticide', amount: '850', date: new Date().toISOString().split('T')[0] });
        }, 2000);
    };

    return (
        <div className="container expense-page">
            <div className="page-header text-center">
                <h2><FaCoins /> Farm Expense Tracker</h2>
                <p>Keep track of every rupee spent on your farm.</p>
            </div>

            <div className="expense-layout">
                <div className="expense-summmary card">
                    <h3>Total Expenditure</h3>
                    <p className="total-amount">₹{totalExpense.toLocaleString()}</p>
                    <div className="chart-placeholder">
                        {/* Chart placeholder */}
                        <div className="bar" style={{ height: '60%' }}></div>
                        <div className="bar" style={{ height: '80%' }}></div>
                        <div className="bar" style={{ height: '40%' }}></div>
                    </div>
                </div>

                <div className="add-expense card">
                    <h3>Add New Expense</h3>
                    <button
                        className={`btn-voice ${isListening ? 'listening' : ''}`}
                        onClick={handleVoiceInput}
                    >
                        <FaMicrophone /> {isListening ? "Listening..." : "Record with Voice"}
                    </button>

                    <div className="divider-text">OR</div>

                    <form onSubmit={handleAdd}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Category (e.g., Seeds)"
                                value={newExpense.category}
                                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                placeholder="Amount (₹)"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="date"
                                value={newExpense.date}
                                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block"><FaPlus /> Add Expense</button>
                    </form>
                </div>

                <div className="expense-list card">
                    <h3>Recent Expenses</h3>
                    <ul>
                        {expenses.map(exp => (
                            <li key={exp.id} className="expense-item">
                                <div className="exp-info">
                                    <span className="exp-cat">{exp.category}</span>
                                    <span className="exp-date">{exp.date}</span>
                                </div>
                                <div className="exp-amount">
                                    ₹{exp.amount}
                                    <button className="btn-delete" onClick={() => handleDelete(exp.id)}><FaTrash /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ExpenseTracker;
