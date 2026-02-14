import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaLeaf, FaRobot, FaChartLine, FaShieldAlt,
    FaMicrophone, FaQuoteLeft, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa';
import '../styles/LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="container nav-content">
                    <div className="logo" onClick={() => navigate('/')}>
                        <FaLeaf className="logo-icon" />
                        <span>AgriSmart AI</span>
                    </div>
                    <div className="nav-links">
                        <button className="btn btn-secondary" onClick={() => navigate('/login')}>Login</button>
                        <button className="btn btn-primary" onClick={() => navigate('/login')}>Register</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <div className="container hero-content-wrapper">
                    <div className="hero-text">
                        <span className="badge-modern">Revolutionizing Agriculture</span>
                        <h1 className="hero-title">
                            The Future of <span className="highlight">Indian Farming</span> is Here.
                        </h1>
                        <p className="hero-subtitle">
                            Empower your fields with Gemini AI. From instant disease detection to real-time market prediction,
                            Yantra is your digital partner in agricultural success.
                        </p>
                        <div className="hero-buttons">
                            <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>Empower Your Farm</button>
                            <button className="btn btn-secondary btn-lg">Watch Overview</button>
                        </div>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">98%</span>
                                <span className="stat-label">Prediction Accuracy</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">24/7</span>
                                <span className="stat-label">AI Advisory</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-image-placeholder">
                            <img src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop" alt="Smart Farming" />
                            <div className="floating-card ai-status">
                                <FaRobot /> AI System: Active
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Problem Section */}
            <section className="problem-section section-padding">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">The Challenges You Face</h2>
                        <p className="section-subtitle">Real problems require modern solutions. We understand the soil and the toil.</p>
                    </div>
                    <div className="problem-grid">
                        <div className="problem-card">
                            <FaExclamationTriangle className="p-icon" />
                            <h3>Unknown Diseases</h3>
                            <p>Losing crops to mysterious pests and diseases because diagnosis takes too long or is unavailable.</p>
                        </div>
                        <div className="problem-card">
                            <FaChartLine className="p-icon" />
                            <h3>Price Uncertainty</h3>
                            <p>Selling at loss-making rates because you lack visibility into the 30-day Mandi trends and outlook.</p>
                        </div>
                        <div className="problem-card">
                            <FaLeaf className="p-icon" />
                            <h3>Poor Yields</h3>
                            <p>Using the wrong fertilizers or growing weak crops due to lack of advanced soil health data analysis.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Proposed Solution Section */}
            <section className="solution-section section-padding">
                <div className="container solution-wrapper">
                    <div className="solution-image">
                        <img src="https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2068&auto=format&fit=crop" alt="AI Farmer Solution" />
                        <div className="ai-overlay"></div>
                    </div>
                    <div className="solution-content">
                        <h2 className="section-title">Our AI-Powered Solution</h2>
                        <p>Yantra is more than just an app; it's a digital revolution in your pocket. Using Google's Gemini Pro, we've built a logic-driven assistant that speaks your language.</p>
                        <ul className="solution-list">
                            <li><FaCheckCircle className="check-icon" /> <strong>Disease Scanner:</strong> Instant mobile diagnostics for 100+ plant varieties.</li>
                            <li><FaCheckCircle className="check-icon" /> <strong>Mandi Intelligence:</strong> Big-data price forecasting for maximum profit.</li>
                            <li><FaCheckCircle className="check-icon" /> <strong>Voice Guidance:</strong> Just talk to the app while working in the field.</li>
                            <li><FaCheckCircle className="check-icon" /> <strong>Crop Recommendations:</strong> Data-driven soil health optimization.</li>
                        </ul>
                        <button className="btn btn-primary" onClick={() => navigate('/login')}>Start Your Success Story</button>
                    </div>
                </div>
            </section>

            {/* Core Features Grid */}
            <section className="features-showcase section-padding">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">Everything You Need to Thrive</h2>
                        <p className="section-subtitle">A suite of AI tools designed exclusively for Indian Agriculture.</p>
                    </div>
                    <div className="features-grid-modern">
                        <div className="feature-card-modern glass-card">
                            <div className="feature-card-image">
                                <img src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=2070&auto=format&fit=crop" alt="Disease Detection" />
                                <div className="f-icon orange"><FaShieldAlt /></div>
                            </div>
                            <div className="feature-card-content">
                                <h3>Disease Detection</h3>
                                <p>Advanced computer vision identifies 50+ crop diseases in seconds. Get organic and chemical remedies instantly.</p>
                            </div>
                        </div>
                        <div className="feature-card-modern glass-card">
                            <div className="feature-card-image">
                                <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop" alt="AI Advisor" />
                                <div className="f-icon green"><FaRobot /></div>
                            </div>
                            <div className="feature-card-content">
                                <h3>AI Crop Advisor</h3>
                                <p>Upload soil data and get personalized recommendations on the best crops to grow for your specific land.</p>
                            </div>
                        </div>
                        <div className="feature-card-modern glass-card">
                            <div className="feature-card-image">
                                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" alt="Market Intelligence" />
                                <div className="f-icon blue"><FaChartLine /></div>
                            </div>
                            <div className="feature-card-content">
                                <h3>Market Intelligence</h3>
                                <p>30-day historical trends and predictive selling tips to help you negotiate better Mandi prices.</p>
                            </div>
                        </div>
                        <div className="feature-card-modern glass-card">
                            <div className="feature-card-image">
                                <img src="https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=2070&auto=format&fit=crop" alt="Voice Assistant" />
                                <div className="f-icon purple"><FaMicrophone /></div>
                            </div>
                            <div className="feature-card-content">
                                <h3>Voice Assistant</h3>
                                <p>Hands-free assistance. Get answers to farming questions in your local language while you're in the field.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials section-padding">
                <div className="container">
                    <h2 className="section-title text-center">Words from the Field</h2>
                    <div className="testimonials-grid">
                        <div className="testimonial-card glass-card">
                            <FaQuoteLeft className="quote-icon" />
                            <p>"Yantra's market intelligence helped me wait for the right week to sell my wheat. I made 20% more profit this season!"</p>
                            <div className="t-author">
                                <strong>Rajesh Kumar</strong>
                                <span>Wheat Farmer, Punjab</span>
                            </div>
                        </div>
                        <div className="testimonial-card glass-card">
                            <FaQuoteLeft className="quote-icon" />
                            <p>"The disease detection is like magic. I saved my tomato crop after identifying late blight early through the app."</p>
                            <div className="t-author">
                                <strong>Suresh Patil</strong>
                                <span>Vegetable Farm, Maharashtra</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="cta-section text-center">
                <div className="container">
                    <h2>Ready to Smart-Farm?</h2>
                    <p>Join thousands of farmers using AI to increase their yield and income.</p>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>Start Your AI Journey</button>
                </div>
            </section>

            <footer className="landing-footer">
                <div className="container footer-content">
                    <div className="footer-logo">
                        <FaLeaf /> <span>AgriSmart AI</span>
                    </div>
                    <p>© {new Date().getFullYear()} AgriSmart Technologies. Empowering the Roots of India.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
