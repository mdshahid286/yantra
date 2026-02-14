import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaLeaf, FaRobot, FaChartLine, FaShieldAlt,
    FaQuoteLeft, FaHandHoldingHeart, FaLightbulb, FaCheckCircle
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="landing-page">
            <nav className="landing-nav container">
                <div className="logo">
                    <FaLeaf className="logo-icon" />
                    <span>Yantara AI</span>
                </div>
                <div className="nav-links">
                    <button className="btn btn-secondary" onClick={() => navigate('/login')}>Login</button>
                    <button className="btn btn-primary" onClick={() => navigate('/login')}>Join Now</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-content"
                >
                    <div className="badge-modern">Agricultural Revolution 2.0</div>
                    <h1 className="hero-title">
                        Empowering <span className="highlight">Farmers</span> with Precision Intelligence
                    </h1>
                    <p className="hero-subtitle">
                        Overcome agricultural challenges with AI-driven diagnostics, market forecasting,
                        and personalized advisory. The future of farming is here.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>Launch Dashboard</button>
                        <button className="btn btn-secondary btn-lg">Watch Demo</button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="hero-visual"
                >
                    <div className="glass-card hero-stats-card">
                        <div className="stat-item">
                            <span className="stat-value">95%</span>
                            <span className="stat-label">Accuracy</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-value">10k+</span>
                            <span className="stat-label">Farmers</span>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Problem Section */}
            <section className="problem-section container section-padding">
                <div className="section-header text-center">
                    <h2 className="section-title">The Struggle is Real</h2>
                    <p className="section-subtitle">Why traditional farming is becoming harder every day</p>
                </div>
                <div className="problem-grid">
                    <div className="problem-card">
                        <div className="p-icon"><FaShieldAlt /></div>
                        <h4>Undiagnosed Diseases</h4>
                        <p>Crop failures due to late detection of pests and fungal infections cost billions.</p>
                    </div>
                    <div className="problem-card">
                        <div className="p-icon"><FaChartLine /></div>
                        <h4>Market Volatility</h4>
                        <p>Farmers lose money because they don't know the right time to sell their harvest.</p>
                    </div>
                    <div className="problem-card">
                        <div className="p-icon"><FaLightbulb /></div>
                        <h4>Generic Advice</h4>
                        <p>Standardized methods don't account for local soil health or specific weather patterns.</p>
                    </div>
                </div>
            </section>

            {/* Proposed Solution */}
            <section className="solution-section">
                <div className="container solution-content">
                    <div className="solution-text">
                        <h2 className="section-title white">The Yantara Solution</h2>
                        <p>We bridge the gap between technology and the field. Yantara AI uses satellite data,
                            computer vision, and real-time mandi insights to give you a competitive edge.</p>
                        <ul className="solution-list">
                            <li><FaCheckCircle className="check-icon" /> 24/7 AI-Powered Field Advisory</li>
                            <li><FaCheckCircle className="check-icon" /> Real-time Mandi Price Forecasting</li>
                            <li><FaCheckCircle className="check-icon" /> Instant Visual Disease Diagnostics</li>
                        </ul>
                    </div>
                    <div className="solution-image-placeholder glass-card">
                        <div className="ai-scanner-overlay"></div>
                        <p>AI Neural Processing Visualization</p>
                    </div>
                </div>
            </section>

            {/* Features Detail */}
            <section className="features-section container section-padding">
                <h2 className="section-title text-center">Powerful Features</h2>
                <div className="features-grid">
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="feature-card-modern glass-card"
                    >
                        <div className="f-icon green"><FaRobot /></div>
                        <h3>Voice Assistant</h3>
                        <p>Talk to Yantara in your local language. Get answers about soil, seeds, and subsidies instantly.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -10 }}
                        className="feature-card-modern glass-card"
                    >
                        <div className="f-icon orange"><FaShieldAlt /></div>
                        <h3>Vision Scan</h3>
                        <p>Upload a photo of your leaf. Our neural network identifies 40+ common crop diseases in seconds.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -10 }}
                        className="feature-card-modern glass-card"
                    >
                        <div className="f-icon blue"><FaChartLine /></div>
                        <h3>Market Intelligence</h3>
                        <p>Predictive analytics for crops. Know when to hold and when to gold (sell).</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -10 }}
                        className="feature-card-modern glass-card"
                    >
                        <div className="f-icon purple"><FaHandHoldingHeart /></div>
                        <h3>Soil Health (N-P-K)</h3>
                        <p>Upload your lab reports and get personalized fertilizer and crop rotation plans.</p>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section section-padding">
                <div className="container">
                    <h2 className="section-title text-center">Words From the Field</h2>
                    <div className="testimonials-grid">
                        <div className="testimonial-card glass-card">
                            <FaQuoteLeft className="quote-icon" />
                            <p>"Yantara helped me save my whole tomato crop. The disease detection was spot on and suggested a remedy I didn't know."</p>
                            <div className="t-author">
                                <strong>Rajesh Kumar</strong>
                                <span>Farmer, Haryana</span>
                            </div>
                        </div>
                        <div className="testimonial-card glass-card">
                            <FaQuoteLeft className="quote-icon" />
                            <p>"The market trends feature is a game changer. I waited for 3 extra days as advised by AI and made 15% more profit."</p>
                            <div className="t-author">
                                <strong>Sandeep Singh</strong>
                                <span>Grain Merchant, Punjab</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="cta-section text-center">
                <div className="container">
                    <h2>Ready to Transform Your Farm?</h2>
                    <p>Join thousands of farmers making smarter decisions every day.</p>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>Get Started for Free</button>
                </div>
            </section>

            <footer className="landing-footer text-center">
                <p>© {new Date().getFullYear()} Yantara AI. Built with ❤️ for Indian Farmers.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
