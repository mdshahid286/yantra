import React, { useState } from 'react';
import { FaMicrophone, FaPlay, FaStop } from 'react-icons/fa';
import '../styles/VoiceAssistant.css';

const VoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [response, setResponse] = useState("Hello! I am your farming assistant. Press the microphone button and ask me anything about your crops, weather, or market prices.");

    const toggleListening = () => {
        setIsListening(!isListening);
        if (!isListening) {
            setResponse("Listening...");
            // Simulate processing delay then response
            setTimeout(() => {
                setIsListening(false);
                setResponse("Based on the current weather, it is a good time to apply urea to your wheat crop. Ensure soil moisture is adequate.");
            }, 3000);
        }
    };

    return (
        <div className="container voice-assistant-page">
            <div className="voice-header text-center">
                <h2><FaMicrophone /> Voice Assistant</h2>
                <p>Ask questions in your local language</p>
            </div>

            <div className="assistant-container">
                <div className={`mic-button-wrapper ${isListening ? 'listening' : ''}`}>
                    <button className="mic-button" onClick={toggleListening}>
                        {isListening ? <FaStop /> : <FaMicrophone />}
                    </button>
                    {isListening && <div className="ripple"></div>}
                </div>

                <p className="status-text">{isListening ? "Listening..." : "Tap to Speak"}</p>

                <div className="response-card">
                    <div className="response-header">
                        <span>AI Response</span>
                        <button className="btn-icon"><FaPlay /></button>
                    </div>
                    <p className="response-text">{response}</p>
                </div>
            </div>
        </div>
    );
};

export default VoiceAssistant;
