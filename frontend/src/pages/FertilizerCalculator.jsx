import React, { useState } from 'react';
import { FaCalculator, FaFlask } from 'react-icons/fa';
import '../styles/FertilizerCalculator.css';

const FertilizerCalculator = () => {
    const [inputs, setInputs] = useState({
        crop: 'Wheat',
        landSize: '',
        unit: 'Acres'
    });
    const [result, setResult] = useState(null);

    const calculate = (e) => {
        e.preventDefault();
        // Simple mock calculation logic
        const size = parseFloat(inputs.landSize);
        if (!size) return;

        setResult({
            urea: (size * 50).toFixed(1), // kg
            dap: (size * 25).toFixed(1),  // kg
            mop: (size * 15).toFixed(1),  // kg
            cost: (size * 1200).toFixed(0) // Rupees
        });
    };

    return (
        <div className="container fertilizer-page">
            <div className="page-header text-center">
                <h2><FaCalculator /> Fertilizer Calculator</h2>
                <p>Calculate exact nutrient requirements for your farm to save costs.</p>
            </div>

            <div className="calc-layout">
                <form onSubmit={calculate} className="card calc-form">
                    <div className="form-group">
                        <label>Select Crop</label>
                        <select
                            value={inputs.crop}
                            onChange={(e) => setInputs({ ...inputs, crop: e.target.value })}
                        >
                            <option>Wheat</option>
                            <option>Rice</option>
                            <option>Corn</option>
                            <option>Sugarcane</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Land Size</label>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                placeholder="Ex: 2.5"
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

                    <button type="submit" className="btn btn-primary btn-block mt-lg">Calculate</button>
                </form>

                {result && (
                    <div className="card result-card fade-in">
                        <h3><FaFlask /> Recommended Dosage</h3>
                        <div className="fertilizer-grid">
                            <div className="fert-item">
                                <span className="fert-name">Urea</span>
                                <span className="fert-qty">{result.urea} kg</span>
                            </div>
                            <div className="fert-item">
                                <span className="fert-name">DAP</span>
                                <span className="fert-qty">{result.dap} kg</span>
                            </div>
                            <div className="fert-item">
                                <span className="fert-name">MOP</span>
                                <span className="fert-qty">{result.mop} kg</span>
                            </div>
                        </div>

                        <div className="cost-estimate">
                            <span>Estimated Cost:</span>
                            <span className="cost-value">₹{result.cost}</span>
                        </div>
                        <p className="note">*Estimates based on current market prices.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FertilizerCalculator;
