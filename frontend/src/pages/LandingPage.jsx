import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLeaf, FaRobot, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import '../styles/LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <nav className="landing-nav container">
                <div className="logo">
                    <FaLeaf className="logo-icon" />
                    <span>AgriSmart AI</span>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate('/login')}>Login</button>
            </nav>

            <header className="hero-section text-center">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Farming Meets <span className="highlight">Artificial Intelligence</span>
                    </h1>
                    <p className="hero-subtitle">
                        Get personalized crop advice, disease detection, and market insights powered by advanced AI.
                        Empowering farmers to make smarter decisions.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>Get Started</button>
                        <button className="btn btn-secondary btn-lg">Learn More</button>
                    </div>
                </div>

                {/* Abstract Background Elements */}
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
            </header>

            <section className="features-section container">
                <h2 className="section-title text-center">Everything You Need to Grow</h2>
                <div className="features-grid">
                    <div className="feature-card glass-card">
                        <div className="icon-box"><FaRobot /></div>
                        <h3>AI Advisory</h3>
                        <p>24/7 personalized farming assistant in your local language.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="icon-box"><FaShieldAlt /></div>
                        <h3>Disease Detection</h3>
                        <p>Snap a photo to instantly identify crop diseases and get remedies.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="icon-box"><FaChartLine /></div>
                        <h3>Market Insights</h3>
                        <p>Real-time price trends and profit prediction logic.</p>
                    </div>
                </div>
            </section>

            <footer className="landing-footer text-center">
                <p>© {new Date().getFullYear()} AgriSmart AI. Built for the Future of Farming.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
