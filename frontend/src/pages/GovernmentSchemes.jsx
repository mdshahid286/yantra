import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUniversity, FaSearch, FaCheckCircle, FaExternalLinkAlt,
    FaFilter, FaCalendarAlt, FaUserGraduate, FaHandHoldingHeart
} from 'react-icons/fa';
import '../styles/GovernmentSchemes.css';

const schemesData = [
    {
        id: 1,
        category: "Insurance",
        name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        description: "Comprehensive crop insurance scheme protecting against yield losses due to non-preventable risks.",
        benefits: ["Low premium rates (1.5% - 5%)", "Direct claim settlement to bank accounts", "Post-harvest loss coverage"],
        eligibility: "Farmers growing notified crops in notified areas.",
        deadline: "31st July 2026",
        link: "https://pmfby.gov.in/"
    },
    {
        id: 2,
        category: "Direct Support",
        name: "PM-KISAN Samman Nidhi",
        description: "Central Sector scheme with 100% funding from Government of India providing income support.",
        benefits: ["₹6,000 yearly in three installments", "Direct Benefit Transfer (DBT)", "Covers all landholding farmer families"],
        eligibility: "All landholding farmer families (subject to exclusions).",
        deadline: "Continuous Enrollment",
        link: "https://pmkisan.gov.in/"
    },
    {
        id: 3,
        category: "Infrastructure",
        name: "Agriculture Infrastructure Fund",
        description: "A medium-long term debt financing facility for investment in viable projects for post-harvest management.",
        benefits: ["Interest subvention of 3% per annum", "Credit guarantee coverage", "Financial support for cold chains"],
        eligibility: "Primary Agricultural Credit Societies (PACS), FPOs, Agri-entrepreneurs.",
        deadline: "Project Based",
        link: "https://agriinfra.dac.gov.in/"
    },
    {
        id: 4,
        category: "Knowledge",
        name: "Seed Health Card Scheme",
        description: "Providing farmers with scientific information about their soil's health and nutrient level.",
        benefits: ["Free soil testing", "Specific nutrient recommendations", "Reduced fertilizer costs"],
        eligibility: "All operational landholding farmers.",
        deadline: "Ongoing",
        link: "https://soilhealth.dac.gov.in/"
    }
];

const GovernmentSchemes = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Insurance", "Direct Support", "Infrastructure", "Knowledge"];

    const filteredSchemes = schemesData.filter(scheme => {
        const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === "All" || scheme.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="schemes-container">
            <header className="page-header-modern">
                <div className="title-area">
                    <h1>Sarkari Portal</h1>
                    <p>Financial clusters and welfare schemes for the modern agrarian</p>
                </div>
                <div className="header-meta glass-card">
                    <FaHandHoldingHeart className="m-icon" />
                    <span>Total Active Schemes: 42</span>
                </div>
            </header>

            <div className="filter-panel glass-card">
                <div className="search-wrap-pro">
                    <FaSearch className="s-icon" />
                    <input
                        type="text"
                        placeholder="Search by keywords (e.g. 'Insurance', 'Credit')..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="category-scroll">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="schemes-grid-pro">
                <AnimatePresence>
                    {filteredSchemes.map((scheme, idx) => (
                        <motion.div
                            key={scheme.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.1 }}
                            className="scheme-card-modern glass-card"
                        >
                            <div className="s-card-header">
                                <span className="s-category">{scheme.category}</span>
                                <div className="s-institution"><FaUniversity /> GOI</div>
                            </div>

                            <div className="s-card-body">
                                <h3>{scheme.name}</h3>
                                <p className="s-desc">{scheme.description}</p>

                                <div className="s-info-row">
                                    <div className="info-item">
                                        <FaUserGraduate />
                                        <span>{scheme.eligibility}</span>
                                    </div>
                                    <div className="info-item">
                                        <FaCalendarAlt />
                                        <span className="deadline">{scheme.deadline}</span>
                                    </div>
                                </div>

                                <div className="s-benefits">
                                    <h4>Core Benefits</h4>
                                    <ul>
                                        {scheme.benefits.map((b, i) => (
                                            <li key={i}><FaCheckCircle /> {b}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="s-card-footer">
                                <button className="btn btn-primary btn-block">
                                    View Detailed Policy <FaExternalLinkAlt />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GovernmentSchemes;
