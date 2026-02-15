import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSeedling, FaMapMarkerAlt, FaVial, FaCloudRain, FaCheckCircle, FaArrowRight, FaArrowLeft, FaUndo, FaDownload } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import { marked } from 'marked';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

    // Sowing Plan State
    const [sowingCrop, setSowingCrop] = useState('');
    const [sowingPlan, setSowingPlan] = useState(null);
    const [sowingLoading, setSowingLoading] = useState(false);

    const fetchSowingPlan = async () => {
        if (!sowingCrop) return;
        setSowingLoading(true);
        setSowingPlan(null);
        try {
            const response = await API.post('/crop/sowing-plan', {
                cropName: sowingCrop,
                location: formData.city,
                soilType: `pH ${formData.ph}, NPK ${formData.nitrogen}-${formData.phosphorus}-${formData.potassium}`
            });
            if (response.data.success) {
                setSowingPlan(response.data.plan);
            } else {
                alert("Failed to generate plan: " + response.data.message);
            }
        } catch (error) {
            console.error("Sowing Plan Error:", error);
            alert("Error generating sowing plan. Please try again.");
        } finally {
            setSowingLoading(false);
        }
    };

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

    const generatePDF = () => {
        const element = document.createElement('div');
        element.style.padding = '20px';
        element.style.fontFamily = 'Arial, sans-serif';
        element.style.color = '#333';

        const date = new Date().toLocaleDateString();

        let sowingContent = '';
        if (sowingPlan) {
            sowingContent = marked.parse(sowingPlan);
        }

        element.innerHTML = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h1 style="text-align: center; color: #2E7D32;">Crop Intelligence Report</h1>
                <p style="text-align: center; font-size: 12px; color: #666;">Generated on: ${date}</p>
                <hr style="margin: 20px 0; border: 1px solid #eee;" />

                <h2 style="color: #2E7D32;">Farm Profile</h2>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p><strong>Location:</strong> ${formData.city}</p>
                    <p><strong>Land Size:</strong> ${formData.landSize} Acres</p>
                    <p><strong>Rainfall:</strong> ${formData.rainfall} mm</p>
                    <p><strong>Soil:</strong> pH ${formData.ph}, NPK ${formData.nitrogen}-${formData.phosphorus}-${formData.potassium}</p>
                </div>

                <h2 style="color: #2E7D32; margin-top: 20px;">Recommended Crops</h2>
                ${recommendations ? recommendations.map(crop => `
                    <div style="margin-bottom: 15px; padding: 10px; border-left: 4px solid ${crop.color || '#2E7D32'}; background: #fff;">
                        <h3 style="margin: 0; color: #1a1a1a;">${crop.name} <span style="font-size: 0.8em; color: #666; font-weight: normal;">(${crop.confidence} Match)</span></h3>
                        <p style="margin: 5px 0;"><strong>Suitability:</strong> ${crop.suitability}</p>
                        <p style="margin: 5px 0; font-size: 0.9em;"><strong>Key Benefits:</strong> ${crop.pros.join(', ')}</p>
                    </div>
                `).join('') : '<p>No recommendations generated yet.</p>'}

                ${sowingPlan ? `
                    <div style="page-break-before: always;">
                        <h2 style="color: #2E7D32; margin-top: 20px;">Sowing Plan: ${sowingCrop}</h2>
                        <div class="sowing-content" style="line-height: 1.6;">
                            ${sowingContent}
                        </div>
                    </div>
                ` : ''}

                <hr style="margin: 20px 0; border: 1px solid #eee;" />
                <p style="text-align:center; font-size: 10px; color: #999;">
                    © ${new Date().getFullYear()} Yantra | AI-Driven Agriculture
                </p>
            </div>
        `;

        const opt = {
            margin: 10,
            filename: `${formData.city}_Crop_Report.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
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
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="btn btn-secondary" onClick={generatePDF} title="Download Report">
                                            <FaDownload /> PDF
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => setStep(1)}><FaUndo /> Recalculate</button>
                                    </div>
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
                                            <button
                                                className="btn btn-primary btn-block"
                                                onClick={() => {
                                                    setSowingCrop(crop.name);
                                                    document.querySelector('.sowing-plan-section')?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                View Sowing Plan
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Sowing Plan Generator Section */}
                                <div className="sowing-plan-section glass-card mt-8">
                                    <div className="card-tag"><FaSeedling /> Sowing Guide</div>
                                    <h2>Generate Custom Sowing Plan</h2>
                                    <p>Get a detailed step-by-step guide for any crop.</p>

                                    <div className="sowing-input-group">
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Enter Crop Name (e.g. Wheat, Tomato)"
                                            value={sowingCrop}
                                            onChange={(e) => setSowingCrop(e.target.value)}
                                        />
                                        <button
                                            className="btn btn-primary"
                                            onClick={fetchSowingPlan}
                                            disabled={!sowingCrop || sowingLoading}
                                        >
                                            {sowingLoading ? "Generating..." : "View Sowing Plan"}
                                        </button>
                                    </div>

                                    {sowingPlan && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="sowing-plan-result"
                                        >
                                            <h3>Sowing Plan for {sowingCrop}</h3>
                                            <div className="plan-content prose prose-sm max-w-none">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {sowingPlan}
                                                </ReactMarkdown>
                                            </div>
                                        </motion.div>
                                    )}
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
