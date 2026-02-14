import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalculator, FaFlask, FaVial, FaChartPie, FaMoneyBillWave, FaInfoCircle, FaUndo } from 'react-icons/fa';
import '../styles/FertilizerCalculator.css';

const FertilizerCalculator = () => {
    const [inputs, setInputs] = useState({
        crop: 'Wheat',
        landSize: '',
        unit: 'Acres',
        soilType: 'Loamy'
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const calculate = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const size = parseFloat(inputs.landSize);
            setResult({
                urea: (size * 45).toFixed(1),
                dap: (size * 22).toFixed(1),
                mop: (size * 18).toFixed(1),
                totalCost: (size * 1450).toFixed(0),
                breakdown: [
                    { name: 'Nitrogen (N)', value: 45, color: '#1B5E20' },
                    { name: 'Phosphorus (P)', value: 30, color: '#1565C0' },
                    { name: 'Potassium (K)', value: 25, color: '#F9A825' }
                ]
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="fert-container">
            <header className="page-header-modern">
                <h1>Nutrient Optimizer</h1>
                <p>Precision fertilizer calculation for maximum yield & minimum waste</p>
            </header>

            <div className="fert-grid">
                {/* Inputs Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="calc-input-card glass-card"
                >
                    <div className="card-header-pro">
                        <FaCalculator />
                        <h3>Farm Configuration</h3>
                    </div>

                    <form onSubmit={calculate} className="fert-form">
                        <div className="input-group-pro">
                            <label>Primary Crop</label>
                            <select
                                value={inputs.crop}
                                onChange={(e) => setInputs({ ...inputs, crop: e.target.value })}
                            >
                                <option>Wheat</option>
                                <option>Basmati Rice</option>
                                <option>Sugar Cane</option>
                                <option>Cotton</option>
                                <option>Soybean</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="input-group-pro">
                                <label>Land Area</label>
                                <div className="unit-input">
                                    <input
                                        type="number"
                                        placeholder="e.g. 5.0"
                                        value={inputs.landSize}
                                        onChange={(e) => setInputs({ ...inputs, landSize: e.target.value })}
                                        required
                                    />
                                    <select
                                        value={inputs.unit}
                                        onChange={(e) => setInputs({ ...inputs, unit: e.target.value })}
                                    >
                                        <option>Acres</option>
                                        <option>Hectares</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="input-group-pro">
                            <label>Soil Texture</label>
                            <div className="texture-options">
                                {['Sandy', 'Loamy', 'Clay', 'Silty'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        className={`texture-btn ${inputs.soilType === type ? 'active' : ''}`}
                                        onClick={() => setInputs({ ...inputs, soilType: type })}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary btn-block solve-btn ${loading ? 'loading' : ''}`}
                            disabled={loading || !inputs.landSize}
                        >
                            {loading ? "Crunching Soil Data..." : "Calculate Optimal Dosage"}
                        </button>
                    </form>
                </motion.div>

                {/* Results Card */}
                <AnimatePresence>
                    {result ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="calc-result-card glass-card"
                        >
                            <div className="result-header-pro">
                                <div className="title">
                                    <FaFlask />
                                    <h3>N-P-K Recommendation</h3>
                                </div>
                                <button className="reset-mini" onClick={() => setResult(null)}><FaUndo /></button>
                            </div>

                            <div className="dosage-grid">
                                <div className="dose-item urea">
                                    <div className="dose-label">UREA (Nitrogen)</div>
                                    <div className="dose-value">{result.urea} <span>kg</span></div>
                                    <div className="dose-bar"><motion.div initial={{ width: 0 }} animate={{ width: '90%' }} /></div>
                                </div>
                                <div className="dose-item dap">
                                    <div className="dose-label">DAP (Phosphorus)</div>
                                    <div className="dose-value">{result.dap} <span>kg</span></div>
                                    <div className="dose-bar"><motion.div initial={{ width: 0 }} animate={{ width: '65%' }} /></div>
                                </div>
                                <div className="dose-item mop">
                                    <div className="dose-label">MOP (Potassium)</div>
                                    <div className="dose-value">{result.mop} <span>kg</span></div>
                                    <div className="dose-bar"><motion.div initial={{ width: 0 }} animate={{ width: '45%' }} /></div>
                                </div>
                            </div>

                            <div className="economics-box">
                                <div className="econ-item">
                                    <span className="label">Estimated Investment</span>
                                    <span className="value">₹{result.totalCost}</span>
                                </div>
                                <div className="econ-item">
                                    <span className="label">Subsidy Benefit</span>
                                    <span className="value text-success">₹{(result.totalCost * 0.15).toFixed(0)}</span>
                                </div>
                            </div>

                            <div className="pro-tips">
                                <h4><FaInfoCircle /> Application Tips</h4>
                                <ul>
                                    <li>Apply Urea in 3 split doses for better nitrogen efficiency.</li>
                                    <li>Mix DAP with soil before sowing.</li>
                                    <li>Maintain 15% moisture in soil during application.</li>
                                </ul>
                            </div>

                            <button className="btn btn-secondary btn-block">Download Usage Schedule</button>
                        </motion.div>
                    ) : (
                        <div className="calc-placeholder glass-card">
                            <FaVial className="p-icon" />
                            <h3>Ready to optimize?</h3>
                            <p>Fill in your farm details to get a customized nutrition plan for {inputs.crop}.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FertilizerCalculator;
