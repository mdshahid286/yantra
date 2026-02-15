import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalculator, FaFlask, FaVial, FaChartPie, FaMoneyBillWave, FaInfoCircle, FaUndo, FaFileUpload, FaDownload } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import '../styles/FertilizerCalculator.css';

const FertilizerCalculator = () => {
    const [inputs, setInputs] = useState({
        crop: 'Wheat',
        landSize: '',
        unit: 'Acres',
        n: '',
        p: '',
        k: '',
        targetYield: '15' // Default target yield in quintals/acre
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    const handleFileUpload = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setAnalyzing(true);

        const formData = new FormData();
        formData.append('report', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/api/fertilizers/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                const data = response.data.data;
                setResult({
                    urea: data.urea,
                    dap: data.dap,
                    mop: data.mop,
                    totalCost: data.totalCost,
                    aiRecommendation: data.recommendation,
                    isAI: true,
                    breakdown: [
                        { name: 'Nitrogen (N)', value: data.N || 0, color: '#1B5E20' },
                        { name: 'Phosphorus (P)', value: data.P || 0, color: '#1565C0' },
                        { name: 'Potassium (K)', value: data.K || 0, color: '#F9A825' }
                    ]
                });
                if (data.crop) setInputs(prev => ({ ...prev, crop: data.crop }));
            }
        } catch (error) {
            console.error("Analysis failed:", error);
            alert("Failed to analyze soil report. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    const calculate = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const size = parseFloat(inputs.landSize);
            const nVal = parseFloat(inputs.n) || 0;
            const pVal = parseFloat(inputs.p) || 0;
            const kVal = parseFloat(inputs.k) || 0;
            const yieldGoal = parseFloat(inputs.targetYield) || 15;

            // Logic: Nutrient needs increase with target yield
            const reqN = (yieldGoal * 2.5);
            const reqP = (yieldGoal * 1.2);
            const reqK = (yieldGoal * 1.5);

            setResult({
                urea: (size * Math.max(0, reqN - (nVal * 0.2))).toFixed(1),
                dap: (size * Math.max(0, reqP - (pVal * 0.15))).toFixed(1),
                mop: (size * Math.max(0, reqK - (kVal * 0.1))).toFixed(1),
                totalCost: (size * (yieldGoal * 100)).toFixed(0),
                currentNutrients: { N: nVal, P: pVal, K: kVal },
                requiredNutrients: { N: reqN, P: reqP, K: reqK },
                breakdown: [
                    { name: 'Nitrogen (N)', value: nVal, target: reqN, color: '#1B5E20' },
                    { name: 'Phosphorus (P)', value: pVal, target: reqP, color: '#1565C0' },
                    { name: 'Potassium (K)', value: kVal, target: reqK, color: '#F9A825' }
                ]
            });
            setLoading(false);
        }, 1500);
    };

    const generatePDF = () => {
        if (!result) return;

        const element = document.createElement('div');
        element.style.padding = '20px';
        element.style.fontFamily = 'Arial, sans-serif';
        element.style.color = '#333';
        const date = new Date().toLocaleDateString();

        element.innerHTML = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h1 style="text-align: center; color: #2E7D32;">Nutrient Optimization Report</h1>
                <p style="text-align: center; font-size: 12px; color: #666;">Generated on: ${date}</p>
                <hr style="margin: 20px 0; border: 1px solid #eee;" />

                <h2 style="color: #1565C0;">Farm Configuration</h2>
                <div style="background-color: #f0f4f8; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p><strong>Crop:</strong> ${inputs.crop}</p>
                    <p><strong>Land Area:</strong> ${inputs.landSize} ${inputs.unit}</p>
                    <p><strong>Target Yield:</strong> ${inputs.targetYield} Qntls/Acre</p>
                </div>

                <h2 style="color: #2E7D32;">Recommended Application</h2>
                <div style="margin-bottom: 20px;">
                    <div style="margin-bottom: 10px; padding: 10px; border-left: 4px solid #1B5E20; background: #fff;">
                        <h3 style="margin: 0; color: #1B5E20;">UREA</h3>
                        <p style="font-size: 1.2em; font-weight: bold;">${result.urea} kg</p>
                        <p style="font-size: 0.9em; color: #666;">Basal: ${(result.urea * 0.3).toFixed(0)}kg | Top Dressing: ${(result.urea * 0.7).toFixed(0)}kg</p>
                    </div>
                    <div style="margin-bottom: 10px; padding: 10px; border-left: 4px solid #1565C0; background: #fff;">
                        <h3 style="margin: 0; color: #1565C0;">DAP</h3>
                        <p style="font-size: 1.2em; font-weight: bold;">${result.dap} kg</p>
                        <p style="font-size: 0.9em; color: #666;">Apply full dose as basal</p>
                    </div>
                    <div style="margin-bottom: 10px; padding: 10px; border-left: 4px solid #F9A825; background: #fff;">
                        <h3 style="margin: 0; color: #F9A825;">MOP</h3>
                        <p style="font-size: 1.2em; font-weight: bold;">${result.mop} kg</p>
                        <p style="font-size: 0.9em; color: #666;">Apply full dose as basal</p>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; background: #fff3e0; padding: 15px; border-radius: 8px;">
                    <div>
                        <strong>Estimated Cost:</strong> ₹${result.totalCost}
                    </div>
                    <div>
                        <strong>Subsidy Benefit:</strong> <span style="color: green;">₹${(result.totalCost * 0.15).toFixed(0)}</span>
                    </div>
                </div>

                ${result.isAI ? `
                    <h3 style="color: #6a1b9a; margin-top: 20px;">AI Insights</h3>
                    <div style="background-color: #f3e5f5; padding: 15px; border-radius: 8px;">
                        <p>${result.aiRecommendation}</p>
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
            filename: `Fertilizer_Schedule_${inputs.crop}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
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

                    <div className="input-group-pro">
                        <label>AI Soil analysis <span className="ai-badge">NEW</span></label>
                        <div className="upload-box-pro">
                            <input
                                type="file"
                                id="soil-report"
                                hidden
                                onChange={handleFileUpload}
                                accept=".pdf,.doc,.docx"
                            />
                            <label htmlFor="soil-report" className="upload-label">
                                {analyzing ? (
                                    <div className="analyzing-state">
                                        <div className="spinner-mini"></div>
                                        <span>AI is reading your report...</span>
                                    </div>
                                ) : (
                                    <>
                                        <FaFileUpload />
                                        <span>Upload Soil Report (PDF/Word)</span>
                                    </>
                                )}
                            </label>
                            {file && !analyzing && <span className="file-name">{file.name}</span>}
                        </div>
                        <p className="helper-text">Upload your soil test report (PDF or Word) for AI-powered precision recommendations</p>
                    </div>

                    <div className="divider-pro"><span>OR CALCULATE MANUALLY</span></div>

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
                            <div className="input-group-pro">
                                <label>Target Yield (Qntls/Acre)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 20"
                                    value={inputs.targetYield}
                                    onChange={(e) => setInputs({ ...inputs, targetYield: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="input-group-pro">
                            <label>Soil Nutrient Levels (mg/kg)</label>
                            <div className="nutrient-inputs">
                                <div className="nut-field">
                                    <span>N</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={inputs.n}
                                        onChange={(e) => setInputs({ ...inputs, n: e.target.value })}
                                    />
                                </div>
                                <div className="nut-field">
                                    <span>P</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={inputs.p}
                                        onChange={(e) => setInputs({ ...inputs, p: e.target.value })}
                                    />
                                </div>
                                <div className="nut-field">
                                    <span>K</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={inputs.k}
                                        onChange={(e) => setInputs({ ...inputs, k: e.target.value })}
                                    />
                                </div>
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
                                    <h3>{result.isAI ? "AI Soil Analysis Result" : "N-P-K Recommendation"}</h3>
                                </div>
                                <button className="reset-mini" onClick={() => {
                                    setResult(null);
                                    setFile(null);
                                }}><FaUndo /></button>
                            </div>

                            {result.isAI && (
                                <div className="ai-recommendation-box">
                                    <h4><FaInfoCircle /> AI Insights for {inputs.crop}</h4>
                                    <p>{result.aiRecommendation}</p>
                                </div>
                            )}

                            <div className="nutrient-gap-analysis">
                                <h4><FaChartPie /> Soil Health vs Target Requirements</h4>
                                <div className="gap-grid">
                                    {result.breakdown.map((item, idx) => (
                                        <div key={idx} className="gap-item">
                                            <div className="gap-label">
                                                <span>{item.name}</span>
                                                <span className="gap-meta">Available: {item.value} / Target: {item.target?.toFixed(1) || 'N/A'}</span>
                                            </div>
                                            <div className="gap-bar-container">
                                                <motion.div
                                                    className="gap-bar actual"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, (item.value / item.target) * 100)}%` }}
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <div className="gap-marker" style={{ left: '100%' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="dosage-section">
                                <h4>Recommended Application (Dosage Splits)</h4>
                                <div className="dosage-grid">
                                    <div className="dose-item urea">
                                        <div className="dose-label">UREA (Basal + Top)</div>
                                        <div className="dose-value">{result.urea} <span>kg</span></div>
                                        <div className="split-info">
                                            <span>Basal: {(result.urea * 0.3).toFixed(0)}kg</span>
                                            <span>Top: {(result.urea * 0.7).toFixed(0)}kg</span>
                                        </div>
                                    </div>
                                    <div className="dose-item dap">
                                        <div className="dose-label">DAP (Basal)</div>
                                        <div className="dose-value">{result.dap} <span>kg</span></div>
                                        <div className="split-info">Full basal dose required</div>
                                    </div>
                                    <div className="dose-item mop">
                                        <div className="dose-label">MOP (Basal)</div>
                                        <div className="dose-value">{result.mop} <span>kg</span></div>
                                        <div className="split-info">Basal application</div>
                                    </div>
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

                            {!result.isAI && (
                                <div className="pro-tips">
                                    <h4><FaInfoCircle /> Application Tips</h4>
                                    <ul>
                                        <li>Apply Urea in 3 split doses for better nitrogen efficiency.</li>
                                        <li>Mix DAP with soil before sowing.</li>
                                        <li>Maintain 15% moisture in soil during application.</li>
                                    </ul>
                                </div>
                            )}

                            <button className="btn btn-secondary btn-block" onClick={generatePDF}>
                                <FaDownload /> Download Usage Schedule (PDF)
                            </button>
                        </motion.div>
                    ) : (
                        <div className="calc-placeholder glass-card">
                            <FaVial className="p-icon" />
                            <h3>Ready to optimize?</h3>
                            <p>Upload a soil report or fill in your farm details to get a customized nutrition plan.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FertilizerCalculator;
