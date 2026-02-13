import React, { useState } from 'react';
import { FaUniversity, FaSearch, FaCheck, FaExternalLinkAlt } from 'react-icons/fa';
import '../styles/GovernmentSchemes.css';

const schemesData = [
    {
        id: 1,
        name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        description: "Crop insurance scheme to provide financial support to farmers suffering crop loss/damage.",
        benefits: ["Risk coverage against non-preventable natural risks", "Stabilize income"],
        eligibility: "All farmers growing notified crops",
        deadline: "31st July 2026"
    },
    {
        id: 2,
        name: "PM-KISAN Samman Nidhi",
        description: "Income support of ₹6,000 per year to all landholding farmer families.",
        benefits: ["Direct cash transfer", "Financial support for inputs"],
        eligibility: "Small and marginal farmers",
        deadline: "Open all year"
    },
    {
        id: 3,
        name: "Soil Health Card Scheme",
        description: "Government issues soil health cards to farmers with crop-wise recommendations of nutrients.",
        benefits: ["Soil testing", "Fertilizer recommendations"],
        eligibility: "All farmers",
        deadline: "Ongoing"
    }
];

const GovernmentSchemes = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSchemes = schemesData.filter(scheme =>
        scheme.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container schemes-page">
            <div className="page-header text-center">
                <h2><FaUniversity /> Government Schemes</h2>
                <p>Find and apply for government agricultural schemes suited for you.</p>
            </div>

            <div className="search-bar-container">
                <div className="search-input-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search schemes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="schemes-list">
                {filteredSchemes.map(scheme => (
                    <div key={scheme.id} className="card scheme-card">
                        <div className="scheme-priority"></div>
                        <h3>{scheme.name}</h3>
                        <p className="description">{scheme.description}</p>

                        <div className="scheme-details">
                            <div className="detail-row">
                                <strong>Eligibility:</strong> {scheme.eligibility}
                            </div>
                            <div className="detail-row">
                                <strong>Deadline:</strong> <span className="text-danger">{scheme.deadline}</span>
                            </div>
                        </div>

                        <div className="benefits-list">
                            <h4>Benefits:</h4>
                            <ul>
                                {scheme.benefits.map((benefit, idx) => (
                                    <li key={idx}><FaCheck className="check-icon" /> {benefit}</li>
                                ))}
                            </ul>
                        </div>

                        <button className="btn btn-primary btn-block mt-lg">
                            Check Eligibility & Apply <FaExternalLinkAlt style={{ marginLeft: '8px', fontSize: '0.8rem' }} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GovernmentSchemes;
