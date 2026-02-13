import React, { useState } from 'react';
import { FaCamera, FaUpload, FaLeaf, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import '../styles/DiseaseDetection.css';

const DiseaseDetection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setResult(null);
        }
    };

    const handleAnalyze = () => {
        if (!selectedImage) return;
        setAnalyzing(true);
        // Simulate AI Analysis
        setTimeout(() => {
            setAnalyzing(false);
            setResult({
                diseaseName: "Wheat Rust",
                confidence: "92%",
                severity: "Moderate",
                treatment: "Apply Propiconazole 25% EC @ 1ml/liter of water. Ensure proper drainage.",
                healthy: false
            });
        }, 2500);
    };

    return (
        <div className="container disease-page">
            <div className="page-header text-center">
                <h2><FaLeaf /> Crop Disease Detection</h2>
                <p>Upload a photo of the affected leaf for instant diagnosis</p>
            </div>

            <div className="detection-layout">
                <div className="upload-section card">
                    {selectedImage ? (
                        <div className="image-preview">
                            <img src={selectedImage} alt="Crop Leaf" />
                            <button className="btn-close" onClick={() => { setSelectedImage(null); setResult(null); }}>×</button>
                        </div>
                    ) : (
                        <div className="upload-placeholder">
                            <label htmlFor="file-upload" className="upload-label">
                                <FaUpload className="upload-icon" />
                                <span>Click to Upload or Drag & Drop</span>
                            </label>
                            <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} hidden />
                            <div className="divider">OR</div>
                            <button className="btn btn-secondary"><FaCamera /> Open Camera</button>
                        </div>
                    )}

                    {selectedImage && !result && (
                        <button
                            className="btn btn-primary btn-block mt-lg"
                            onClick={handleAnalyze}
                            disabled={analyzing}
                        >
                            {analyzing ? "Analyzing..." : "Detect Disease"}
                        </button>
                    )}
                </div>

                {result && (
                    <div className="result-section card fade-in">
                        <h3 className={result.healthy ? "text-success" : "text-danger"}>
                            {result.healthy ? <FaCheckCircle /> : <FaExclamationTriangle />}
                            {result.diseaseName}
                        </h3>

                        <div className="result-details">
                            <div className="detail-item">
                                <span className="label">Confidence:</span>
                                <span className="value">{result.confidence}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Severity:</span>
                                <span className="value">{result.severity}</span>
                            </div>
                        </div>

                        <div className="treatment-box">
                            <h4>Suggested Treatment</h4>
                            <p>{result.treatment}</p>
                        </div>

                        <button className="btn btn-secondary btn-block mt-lg">Save Report</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiseaseDetection;
