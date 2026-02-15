import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaUpload, FaLeaf, FaExclamationTriangle, FaCheckCircle, FaUndo } from 'react-icons/fa';
import API from '../services/api';
import '../styles/DiseaseDetection.css';
import axios from "axios";
import html2pdf from 'html2pdf.js';

const DiseaseDetection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Effect to handle camera stream attachment when camera mode is activated
    useEffect(() => {
        const initCamera = async () => {
            if (isCameraActive && !cameraStream) {
                console.log("Initializing camera stream...");
                try {
                    const constraints = {
                        video: {
                            facingMode: { ideal: "environment" },
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        }
                    };
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    setCameraStream(stream);
                    console.log("Stream set to state");
                } catch (err) {
                    console.error("Camera stream error:", err);
                    alert("Camera error: " + err.message);
                    setIsCameraActive(false);
                }
            }
        };
        initCamera();

        return () => {
            // Cleanup function: stop stream if camera is no longer active or component unmounts
            // This ensures the camera stream is stopped when isCameraActive becomes false
            // or when the component unmounts.
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
                setCameraStream(null);
            }
        };
    }, [isCameraActive]); // Depend on isCameraActive to trigger stream acquisition/cleanup

    // Effect to attach stream to video element once it's rendered
    useEffect(() => {
        if (isCameraActive && cameraStream && videoRef.current) {
            console.log("Attaching stream to video element");
            videoRef.current.srcObject = cameraStream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play().catch(e => console.error("Video play error:", e));
            };
        }
    }, [isCameraActive, cameraStream]); // Depend on isCameraActive and cameraStream

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setImageFile(file);
            setResult(null);
            setIsCameraActive(false);
        }
    };

    const startCamera = () => {
        setIsCameraActive(true);
        setSelectedImage(null);
        setResult(null);
    };

    const stopCamera = () => {
        setIsCameraActive(false);
        // The useEffect cleanup will handle stopping the stream and setting cameraStream to null
        // when isCameraActive becomes false.
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth || video.clientWidth;
            canvas.height = video.videoHeight || video.clientHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                const file = new File([blob], "captured-leaf.jpg", { type: "image/jpeg" });
                const imageUrl = URL.createObjectURL(blob);
                setSelectedImage(imageUrl);
                setImageFile(file);
                stopCamera(); // Stop camera after capturing
            }, 'image/jpeg');
        }
    };

    const handleAnalyze = async () => {
        if (!imageFile) return;
        setAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append("image", imageFile);

            const response = await axios.post(
                "http://localhost:5000/api/disease",
                formData
            );

            setResult({
                diseaseName: response.data.disease,
                confidence: "Gemini Vision AI",
                severity: response.data.severity,
                treatment: response.data.treatment,
                healthy: response.data.healthy
            });
        } catch (error) {
            console.error(
                "Disease detection error:",
                error.response?.data || error.message
            );
            alert("Failed to analyze image.");
        } finally {
            setAnalyzing(false);
        }
    };

    const generatePDF = () => {
        if (!result || !selectedImage) return;

        const element = document.createElement('div');
        element.style.padding = '20px';
        element.style.fontFamily = 'Arial, sans-serif';
        element.style.color = '#333';
        const date = new Date().toLocaleDateString();

        element.innerHTML = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h1 style="text-align: center; color: #d9534f;">Disease Detection Report</h1>
                <p style="text-align: center; font-size: 12px; color: #666;">Generated on: ${date}</p>
                <hr style="margin: 20px 0; border: 1px solid #eee;" />

                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="${selectedImage}" style="max-width: 300px; max-height: 300px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
                </div>

                <div style="background-color: ${result.healthy ? '#d4edda' : '#f8d7da'}; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid ${result.healthy ? '#c3e6cb' : '#f5c6cb'};">
                    <h2 style="color: ${result.healthy ? '#155724' : '#721c24'}; margin-top: 0;">Diagnosis: ${result.diseaseName}</h2>
                    <p><strong>Confidence:</strong> ${result.confidence}</p>
                    <p><strong>Severity:</strong> ${result.severity}</p>
                    <p><strong>Status:</strong> ${result.healthy ? 'Healthy' : 'Infected'}</p>
                </div>

                ${!result.healthy ? `
                    <h3 style="color: #2E7D32; margin-top: 20px;">Treatment Plan</h3>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #2E7D32;">
                        ${result.treatment.split('\n').map(line => `<p style="margin: 5px 0;">${line}</p>`).join('')}
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
            filename: `Disease_Report_${new Date().getTime()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="disease-container">
            <header className="page-header-modern">
                <h1>Disease Defense Guard</h1>
                <p>Instant AI diagnostics for your crops</p>
            </header>

            <div className="detection-grid">
                {/* Upload Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="upload-card glass-card"
                >
                    {isCameraActive ? (
                        <div className="camera-container">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="camera-preview"
                            />
                            <div className="camera-controls">
                                <button className="btn btn-primary" onClick={capturePhoto}>
                                    Capture Photo
                                </button>
                                <button className="btn btn-secondary" onClick={stopCamera}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : selectedImage ? (
                        <div className="preview-container">
                            <img src={selectedImage} alt="Crop Leaf" className="main-preview" />
                            {analyzing && (
                                <motion.div
                                    initial={{ top: "0%" }}
                                    animate={{ top: "100%" }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="scanner-line"
                                />
                            )}
                            <button className="reset-btn" onClick={() => { setSelectedImage(null); setResult(null); }}>
                                <FaUndo />
                            </button>
                        </div>
                    ) : (
                        <div className="upload-dropzone">
                            <div className="zone-content">
                                <FaUpload className="cloud-icon" />
                                <h3>Upload Plant Photo</h3>
                                <p>Drag leaf photo here or browse files</p>
                                <input type="file" accept="image/*" onChange={handleImageUpload} id="leaf-input" hidden />
                                <label htmlFor="leaf-input" className="btn btn-primary">Choose File</label>
                            </div>
                            <div className="zone-divider">OR</div>
                            <button className="btn btn-secondary" onClick={startCamera}>
                                <FaCamera /> Use Camera
                            </button>
                        </div>
                    )}

                    <canvas ref={canvasRef} style={{ display: 'none' }} />

                    {selectedImage && !result && (
                        <button
                            className={`btn btn-primary btn-block analyze-btn ${analyzing ? 'loading' : ''}`}
                            onClick={handleAnalyze}
                            disabled={analyzing}
                        >
                            {analyzing ? (
                                <>
                                    <span className="loader"></span>
                                    Processing Neural Network...
                                </>
                            ) : "Start AI Diagnosis"}
                        </button>
                    )}
                </motion.div>

                {/* Results Card */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="result-card-modern glass-card"
                        >
                            <div className="result-header">
                                <div className={`status-icon ${result.healthy ? 'healthy' : 'infected'}`}>
                                    {result.healthy ? <FaCheckCircle /> : <FaExclamationTriangle />}
                                </div>
                                <div className="title-area">
                                    <h3>{result.diseaseName}</h3>
                                    <span className="confidence">Confidence: {result.confidence}</span>
                                </div>
                            </div>

                            <div className="stats-strip">
                                <div className="stat">
                                    <span className="label">Infection Status</span>
                                    <span className={`value ${result.healthy ? 'text-success' : 'text-danger'}`}>
                                        {result.healthy ? 'None Detected' : 'Infected'}
                                    </span>
                                </div>
                                <div className="stat">
                                    <span className="label">Severity</span>
                                    <span className="value">{result.severity}</span>
                                </div>
                            </div>

                            <div className="treatment-details">
                                <h4><FaLeaf /> Expert Treatment Plan</h4>
                                <div className="plan-text">
                                    {result.treatment.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            </div>

                            <div className="action-row">
                                <button className="btn btn-primary" onClick={generatePDF}>Generate PDF Report</button>
                                <button className="btn-icon" onClick={() => { setSelectedImage(null); setResult(null); }}><FaUndo /></button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DiseaseDetection;
