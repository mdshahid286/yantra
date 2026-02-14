import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaHome, FaLeaf, FaRobot, FaChartLine, FaUniversity,
    FaCalculator, FaCoins, FaSignOutAlt, FaBars, FaTimes
} from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    const menuItems = [
        { path: '/app', name: 'Dashboard', icon: <FaHome /> },
        { path: '/voice', name: 'Voice Assistant', icon: <FaRobot /> },
        { path: '/disease', name: 'Disease Detect', icon: <FaLeaf /> },
        { path: '/crop-recommend', name: 'Crop Suggestion', icon: <FaLeaf /> },
        { path: '/market', name: 'Market Prices', icon: <FaChartLine /> },
        { path: '/schemes', name: 'Govt Schemes', icon: <FaUniversity /> },
        { path: '/fertilizer', name: 'Fertilizer Calc', icon: <FaCalculator /> },
        { path: '/expenses', name: 'Expenses', icon: <FaCoins /> },
        { path: '/profit', name: 'Profit Predictor', icon: <FaChartLine /> },
    ];

    return (
        <>
            <div className="mobile-menu-icon" onClick={toggleSidebar}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </div>

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <FaLeaf className="logo-icon" />
                    <span className="logo-text">AgriSmart AI</span>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                            onClick={closeSidebar}
                        >
                            <span className="icon">{item.icon}</span>
                            <span className="text">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={() => navigate('/login')}>
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && <div className="overlay" onClick={closeSidebar}></div>}
        </>
    );
};

export default Sidebar;
