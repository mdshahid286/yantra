import React, { useState } from 'react';
import { FaSeedling, FaListUl } from 'react-icons/fa';
import '../styles/CropRecommendation.css';

const CropRecommendation = () => {
    const [formData, setFormData] = useState({
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        ph: '',
        rainfall: '',
        city: ''
    });
    const [recommendations, setRecommendations] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        setRecommendations([
            { name: 'Rice', confidence: '95%', reason: 'High rainfall and clay soil suited.' },
            { name: 'Jute', confidence: '88%', reason: 'Humid climate matches requirements.' }
        ]);
    };

    return (
        <div className="container crop-page">
            <div className="page-header text-center">
                <h2><FaSeedling /> Crop Suggestion AI</h2>
                <p>Get scientific crop recommendations based on your soil and climate.</p>
            </div>

            <div className="crop-layout">
                <form onSubmit={handleSubmit} className="card crop-form">
                    <h3>Enter Soil Details</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Nitrogen (N)</label>
                            <input type="number" name="nitrogen" placeholder="Example: 90" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Phosphorus (P)</label>
                            <input type="number" name="phosphorus" placeholder="Example: 42" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Potassium (K)</label>
                            <input type="number" name="potassium" placeholder="Example: 43" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Soil pH</label>
                            <input type="number" step="0.1" name="ph" placeholder="Example: 6.5" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Rainfall (mm)</label>
                            <input type="number" name="rainfall" placeholder="Example: 200" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>City/District</label>
                            <input type="text" name="city" placeholder="Example: Pune" onChange={handleChange} required />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mt-lg">Get Recommendation</button>
                </form>

                {recommendations && (
                    <div className="rec-results card">
                        <h3><FaListUl /> Recommended Crops</h3>
                        <div className="rec-list">
                            {recommendations.map((crop, index) => (
                                <div key={index} className="rec-item">
                                    <div className="rec-header">
                                        <h4>{crop.name}</h4>
                                        <span className="badge">{crop.confidence} Match</span>
                                    </div>
                                    <p>{crop.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CropRecommendation;
