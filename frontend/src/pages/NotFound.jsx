import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTractor } from 'react-icons/fa';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <FaTractor style={styles.icon} />
            <h1 style={styles.title}>404: Lost in the Fields?</h1>
            <p style={styles.text}>The page you are looking for does not exist or has been moved.</p>
            <button className="btn btn-primary" onClick={() => navigate('/app')}>
                Return to Dashboard
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: '20px',
        background: 'var(--color-bg-body)',
    },
    icon: {
        fontSize: '5rem',
        color: 'var(--color-primary-light)',
        marginBottom: '20px',
    },
    title: {
        fontSize: '2.5rem',
        color: 'var(--color-primary-dark)',
        marginBottom: '10px',
    },
    text: {
        fontSize: '1.2rem',
        color: 'var(--color-text-secondary)',
        marginBottom: '30px',
    },
};

export default NotFound;
