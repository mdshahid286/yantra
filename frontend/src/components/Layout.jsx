import React from 'react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
    const location = useLocation();
    // Don't show Sidebar on Landing Page or Login (handled in App.jsx mostly, but good safeguard)
    const isAuthPage = location.pathname === '/login' || location.pathname === '/landing';

    if (isAuthPage) return <>{children}</>;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-content">
                <div className="content-wrapper">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
