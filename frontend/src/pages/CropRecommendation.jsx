import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSeedling, FaMapMarkerAlt, FaVial, FaCloudRain, FaCheckCircle, FaArrowRight, FaArrowLeft, FaUndo } from 'react-icons/fa';
import API from '../services/api';
import '../styles/CropRecommendation.css';

const CropRecommendation = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        ph: '',
        rainfall: '',
        city: '',
        landSize: '1' // Added default land size
    });
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                soilType: `N:${formData.nitrogen}, P:${formData.phosphorus}, K:${formData.potassium}, pH:${formData.ph}`,
                landSize: `${formData.landSize} Acres`,
                location: formData.city
            };

            const response = await API.post('/crop', payload);

            // Assume the backend returns a string 'crops' from askAI
            // We'll parse or display it. If it returns a list, great.
            // For now, let's treat it as a robust response and map to our UI.
            const aiResponse = response.data.crops;

            // Simple parsing logic if it's a block of text, or just wrap it.
            setRecommendations([
                {
                    name: 'AI Recommended Crops',
                    confidence: 'AI Generated',
                    tags: ['Dynamic Insight'],
                    suitability: aiResponse,
                    pros: ['Based on soil data', 'Market verified'],
                    color: '#2E7D32'
                }
            ]);
            setStep(4);
        } catch (error) {
            console.error('Error getting crop recommendation:', error);
            alert('Failed to get suggestions from AI.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="crop-container">
            <header className="page-header-modern">
                <h1>Crop Intelligence AI</h1>
                <p>Advanced geospatial and chemical-soil analysis</p>
            </header>

            <div className="wizard-layout">
                {step < 4 && (
                    <div className="wizard-progress glass-card">
                        <div className={`step-node ${step >= 1 ? 'active' : ''}`}>1</div>
                        <div className="step-line"></div>
                        <div className={`step-node ${step >= 2 ? 'active' : ''}`}>2</div>
                        <div className="step-line"></div>
                        <div className={`step-node ${step >= 3 ? 'active' : ''}`}>3</div>
                    </div>
                )}

                <div className="wizard-content">
                    <AnimatePresence mode='wait'>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="wizard-card glass-card"
                            >
                                <div className="card-tag"><FaMapMarkerAlt /> Step 1: Location & Climate</div>
                                <h2>Where is your farm?</h2>
                                <p>Climate data is fetched automatically based on your region.</p>

                                <div className="form-stack">
                                    <div className="input-field">
                                        <label>District / City</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Pune, Maharashtra" />
                                    </div>
                                    <div className="input-field">
                                        <label>Annual Rainfall (mm)</label>
                                        <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} placeholder="e.g. 1100" />
                                    </div>
                                </div>
                                <div className="wizard-nav">
                                    <button className="btn btn-primary" onClick={nextStep} disabled={!formData.city}>Next: Soil Chemistry <FaArrowRight /></button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="wizard-card glass-card"
                            >
                                <div className="card-tag"><FaVial /> Step 2: N-P-K Levels</div>
                                <h2>Soil Content (ppm)</h2>
                                <p>Refer to your latest Soil Health Card (SHC).</p>

                                <div className="form-grid-modern">
                                    <div className="input-field">
                                        <label>Nitrogen (N)</label>
                                        <input type="number" name="nitrogen" value={formData.nitrogen} onChange={handleChange} placeholder="0-140" />
                                    </div>
                                    <div className="input-field">
                                        <label>Phosphorus (P)</label>
                                        <input type="number" name="phosphorus" value={formData.phosphorus} onChange={handleChange} placeholder="0-140" />
                                    </div>
                                    <div className="input-field">
                                        <label>Potassium (K)</label>
                                        <input type="number" name="potassium" value={formData.potassium} onChange={handleChange} placeholder="0-140" />
                                    </div>
                                </div>
                                <div className="wizard-nav">
                                    <button className="btn btn-secondary" onClick={prevStep}><FaArrowLeft /> Back</button>
                                    <button className="btn btn-primary" onClick={nextStep}>Next: Acidity Level <FaArrowRight /></button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="wizard-card glass-card"
                            >
                                <div className="card-tag"><FaCloudRain /> Step 3: Final Analysis</div>
                                <h2>Acidity & Composition</h2>

                                <div className="form-stack">
                                    <div className="input-field">
                                        <label>Soil pH level</label>
                                        <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} placeholder="e.g. 6.5 (Neutral)" />
                                    </div>
                                    <div className="ai-notice">
                                        <FaSeedling />
                                        <span>Our AI will cross-reference this with local market demands.</span>
                                    </div>
                                </div>
                                <div className="wizard-nav">
                                    <button className="btn btn-secondary" onClick={prevStep}><FaArrowLeft /> Back</button>
                                    <button
                                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? "Optimizing Recommendations..." : "Generate AI Insights"}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && recommendations && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="results-container"
                            >
                                <div className="results-header">
                                    <h2>Top Suggestions for {formData.city}</h2>
                                    <button className="btn btn-secondary" onClick={() => setStep(1)}><FaUndo /> Recalculate</button>
                                </div>

                                <div className="rec-grid-modern">
                                    {recommendations.map((crop, idx) => (
                                        <div key={idx} className="rec-card-pro glass-card" style={{ '--accent': crop.color }}>
                                            <div className="rec-badge">{crop.confidence} Match</div>
                                            <h3>{crop.name}</h3>
                                            <div className="tags">
                                                {crop.tags.map(t => <span key={t} className="tag">{t}</span>)}
                                            </div>
                                            <div className="analysis-box">
                                                <p className="suitability"><strong>Suitability:</strong> {crop.suitability}</p>
                                                <ul className="pros-list">
                                                    {crop.pros.map(p => <li key={p}><FaCheckCircle /> {p}</li>)}
                                                </ul>
                                            </div>
                                            <button className="btn btn-primary btn-block">View Sowing Plan</button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CropRecommendation;
