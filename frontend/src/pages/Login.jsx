import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaLock, FaSeedling } from 'react-icons/fa';
import axios from 'axios';
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
            const response = await axios.post('http://localhost:5000/api/auth/login', { mobile: mobile.trim() });

            if (response.data.success) {
                const userData = {
                    token: response.data.token,
                    ...response.data.user,
                };
                localStorage.setItem('user', JSON.stringify(userData));

                // Check if profile is completed
                if (response.data.user.profileCompleted) {
                    navigate('/app');
                } else {
                    navigate('/profile-completion');
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert(error.response?.data?.message || 'Login failed. Please try again.');
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
