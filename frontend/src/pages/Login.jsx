import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaLock, FaSeedling } from 'react-icons/fa';
import '../styles/Login.css';

const Login = () => {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Mobile, 2: OTP
    const navigate = useNavigate();

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (mobile.length === 10) {
            setStep(2);
            // Simulate API call
        } else {
            alert('Please enter a valid 10-digit mobile number');
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otp === '1234') { // Mock OTP
            navigate('/');
        } else {
            alert('Invalid OTP. Try 1234');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <FaSeedling className="login-logo" />
                    <h2>Welcome Farmer</h2>
                    <p>Login to access your personalized advisory</p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="login-form">
                        <div className="input-group">
                            <FaPhoneAlt className="input-icon" />
                            <input
                                type="tel"
                                placeholder="Enter Mobile Number"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                maxLength="10"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">
                            Send OTP
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="login-form">
                        <div className="input-group">
                            <FaLock className="input-icon" />
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="4"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">
                            Verify & Login
                        </button>
                        <button
                            type="button"
                            className="btn-link"
                            onClick={() => setStep(1)}
                        >
                            Change Mobile Number
                        </button>
                    </form>
                )}

                <div className="language-select">
                    <select defaultValue="en">
                        <option value="en">English</option>
                        <option value="hi">हिंदी (Hindi)</option>
                        <option value="te">తెలుగు (Telugu)</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Login;
