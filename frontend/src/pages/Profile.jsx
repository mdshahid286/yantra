import React from 'react';
import { FaUserCircle, FaLanguage, FaBell } from 'react-icons/fa';

const Profile = () => {
    return (
        <div className="container">
            <h1 className="mb-md">Farmer Profile</h1>

            <div className="profile-grid" style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* User Details */}
                <div className="card glass-card">
                    <div className="flex-center" style={{ flexDirection: 'column', padding: '20px' }}>
                        <FaUserCircle size={80} color="var(--color-primary)" />
                        <h2 style={{ marginTop: '10px' }}>Kisan User</h2>
                        <p style={{ color: '#666' }}>+91 98765 43210</p>
                        <span className="badge" style={{ background: 'var(--color-accent)', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', marginTop: '10px' }}>
                            Premium Member
                        </span>
                    </div>
                </div>

                {/* Settings */}
                <div className="card glass-card">
                    <h3>Settings</h3>

                    <div style={{ marginTop: '20px' }}>
                        <div className="setting-item" style={settingItemStyle}>
                            <div className="flex-center" style={{ gap: '10px' }}>
                                <FaLanguage size={20} color="var(--color-primary)" />
                                <span>App Language</span>
                            </div>
                            <select style={selectStyle} defaultValue="en">
                                <option value="en">English</option>
                                <option value="hi">हिंदी</option>
                                <option value="te">తెలుగు</option>
                            </select>
                        </div>

                        <div className="setting-item" style={settingItemStyle}>
                            <div className="flex-center" style={{ gap: '10px' }}>
                                <FaBell size={20} color="var(--color-primary)" />
                                <span>Notifications</span>
                            </div>
                            <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const settingItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 0',
    borderBottom: '1px solid rgba(0,0,0,0.1)'
};

const selectStyle = {
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #ccc'
};

export default Profile;
