import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container text-center">
                <p>&copy; {new Date().getFullYear()} AgriSmart AI. Empowering Farmers.</p>
            </div>
        </footer>
    );
};

export default Footer;
