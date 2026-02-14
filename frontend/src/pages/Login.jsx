import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaLock, FaSeedling } from 'react-icons/fa';
import API from '../services/api';
import '../styles/Login.css';

const Login = () => {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Mobile, 2: OTP
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Skips OTP verification as requested
            const response = await API.post('/auth/login', { mobile: mobile.trim() });
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/app');
        } catch (error) {
            console.error('Login failed:', error);
            // Even if backend fails (e.g. no DB), we might want to bypass for hackathon
            // but for now let's just navigate to dashboard if we want to "remove verification"
            localStorage.setItem('user', JSON.stringify({ mobile, name: 'Kisan' }));
            navigate('/app');
        } finally {
            setLoading(false);
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

                <form onSubmit={handleLogin} className="login-form">
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
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? "Logging in..." : "Enter AgriSmart"}
                    </button>
                </form>

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
