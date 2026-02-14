import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaPaperPlane, FaPlay, FaRobot, FaUser, FaLightbulb, FaStop } from 'react-icons/fa';
import API from '../services/api';
import '../styles/VoiceAssistant.css';
import axios from 'axios';

const VoiceAssistant = () => {
    const [messages, setMessages] = useState([
        { id: 1, type: 'ai', text: 'Hello Kisan! How can I help you today? I can check weather, market trends, or help with disease detection.' }
    ]);
    const [isListening, setIsListening] = useState(false);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Helper to format text with **bold**
    const formatMessage = (text) => {
        if (!text) return "";
        // Split by **text**
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                // Remove asterisks and wrap in strong
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    // Helper to clean text for TTS (remove markdown)
    const cleanTextForTTS = (text) => {
        if (!text) return "";
        return text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
    };

    // Play audio response using Browser API
    const playAudio = (text) => {
        if (!text) return;

        const cleanText = cleanTextForTTS(text);

        // Stop any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(cleanText);

        // Optional: Attempt to set a voice (browsers have different voices)
        // const voices = window.speechSynthesis.getVoices();
        // utterance.voice = voices.find(v => v.lang.includes('en')) || voices[0];

        utterance.onerror = (e) => console.error('Speech synthesis error:', e);

        window.speechSynthesis.speak(utterance);
    };

    // Send message to AI
    const handleSend = async (text = inputText, autoPlay = false) => {
        if (!text.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text: text.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/chatbot",   // ← change to your backend URL
                { query: text },
                { timeout: 30000 }
            );

            const aiText = response.data.response;

            const aiResponse = {
                id: Date.now() + 1,
                type: 'ai',
                text: aiText
            };

            setMessages(prev => [...prev, aiResponse]);

            if (autoPlay) {
                playAudio(aiText);
            }

        } catch (error) {
            console.error("AI assistant error:", error);

            const errorMsg = {
                id: Date.now() + 1,
                type: 'ai',
                text: "I'm having trouble connecting right now. Please try again."
            };

            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    // Start/Stop voice recording
    const toggleListening = async () => {
        if (isListening) {
            // Stop recording
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
            setIsListening(false);
        } else {
            // Start recording
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

                    // Stop all tracks to release microphone
                    stream.getTracks().forEach(track => track.stop());

                    setLoading(true);
                    try {
                        const formData = new FormData();
                        formData.append('audio', audioBlob, 'recording.webm');

                        const response = await axios.post('http://localhost:5000/api/voice/stt', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                            timeout: 30000
                        });

                        const transcript = response.data.transcript;
                        if (transcript && transcript.trim()) {
                            handleSend(transcript, true);
                        } else {
                            const errorMsg = {
                                id: Date.now(),
                                type: 'ai',
                                text: "I couldn't hear that clearly. Please try again."
                            };
                            setMessages(prev => [...prev, errorMsg]);
                        }
                    } catch (err) {
                        console.error("Transcription error:", err);
                        const errorMsg = {
                            id: Date.now(),
                            type: 'ai',
                            text: "Voice recognition is temporarily unavailable. Please type your message instead."
                        };
                        setMessages(prev => [...prev, errorMsg]);
                    } finally {
                        setLoading(false);
                    }
                };

                mediaRecorder.start();
                setIsListening(true);
            } catch (err) {
                console.error("Microphone access error:", err);
                const errorMsg = {
                    id: Date.now(),
                    type: 'ai',
                    text: "I need microphone access to listen. Please allow microphone permissions and try again."
                };
                setMessages(prev => [...prev, errorMsg]);
            }
        }
    };

    return (
        <div className="voice-assistant-container">
            <header className="assistant-header">
                <div className="status-indicator">
                    <div className={`status-dot ${isListening ? 'listening' : 'idle'}`}></div>
                    <span>{isListening ? 'Listening...' : 'AI Assistant Online'}</span>
                </div>
                <h1>AgriVoice AI</h1>
            </header>

            <div className="chat-window glass-card">
                <div className="messages-area">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className={`message-wrapper ${msg.type}`}
                            >
                                <div className="avatar">
                                    {msg.type === 'ai' ? <FaRobot /> : <FaUser />}
                                </div>
                                <div className="message-content">
                                    {formatMessage(msg.text)}
                                    {msg.type === 'ai' && msg.text && msg.text.length < 500 && (
                                        <button
                                            className="play-btn-mini"
                                            onClick={() => playAudio(msg.text)}
                                            title="Play audio (TTS)"
                                        >
                                            <FaPlay />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <motion.div
                                key="loading-indicator"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="message-wrapper ai"
                            >
                                <div className="avatar">
                                    <FaRobot />
                                </div>
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </AnimatePresence>
                </div>

                <div className="suggestions-row">
                    {["Weather in Pune", "Wheat prices", "Pest control", "Subsidies"].map((s, idx) => (
                        <button
                            key={idx}
                            className="suggestion-chip"
                            onClick={() => handleSend(s)}
                            disabled={loading}
                        >
                            <FaLightbulb /> {s}
                        </button>
                    ))}
                </div>

                <div className="input-area glass-card">
                    <div className="wave-container">
                        {isListening && (
                            <div className="wave-wrapper">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className={`wave bar-${i}`}></div>)}
                            </div>
                        )}
                    </div>

                    <input
                        type="text"
                        placeholder="Ask me anything..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
                        disabled={loading || isListening}
                    />

                    <div className="action-buttons">
                        <button
                            className={`mic-btn ${isListening ? 'active' : ''}`}
                            onClick={toggleListening}
                            disabled={loading}
                            title={isListening ? "Stop recording" : "Start recording"}
                        >
                            {isListening ? <FaStop /> : <FaMicrophone />}
                        </button>
                        <button
                            className="send-btn"
                            onClick={() => handleSend()}
                            disabled={loading || !inputText.trim()}
                            title="Send message"
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceAssistant;