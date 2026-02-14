import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUsers, FaPaperPlane, FaLeaf,
    FaWheatAwn, FaDroplet, FaFilter,
    FaRegCommentDots
} from 'react-icons/fa6';
import API from '../services/api';
import '../styles/Community.css';

const Community = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ location: '', crop: '', farmingStyle: '' });

    const user = JSON.parse(localStorage.getItem('user')) || { _id: 'temp', name: 'Farmer' };
    const chatEndRef = useRef(null);

    useEffect(() => {
        fetchGroups();
    }, [filters]);

    useEffect(() => {
        if (selectedGroup) {
            fetchMessages(selectedGroup._id);
        }
    }, [selectedGroup]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchGroups = async () => {
        try {
            const query = new URLSearchParams(filters).toString();
            const response = await API.get(`/community/groups?${query}`);
            setGroups(response.data);
            if (!selectedGroup && response.data.length > 0) {
                // setSelectedGroup(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (groupId) => {
        try {
            const response = await API.get(`/community/messages/${groupId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedGroup) return;

        try {
            const payload = {
                groupId: selectedGroup._id,
                senderId: user._id,
                senderName: user.name,
                text: newMessage,
                type: 'text'
            };
            const response = await API.post('/community/message', payload);
            setMessages([...messages, response.data]);
            setNewMessage('');

            // Update local groups list last message
            setGroups(groups.map(g =>
                g._id === selectedGroup._id
                    ? { ...g, lastMessage: newMessage, lastMessageTime: new Date() }
                    : g
            ));
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'wheat': return <FaWheatAwn />;
            case 'leaf': return <FaLeaf />;
            case 'water': return <FaDroplet />;
            default: return <FaUsers />;
        }
    };

    return (
        <div className="community-container">
            <div className="community-grid">
                {/* Sidebar */}
                <aside className="community-sidebar">
                    <div className="sidebar-header">
                        <h2>Community</h2>
                        <p>Discuss with fellow farmers</p>
                    </div>

                    <div className="filter-section">
                        <div className="filter-group">
                            <label>Location</label>
                            <select
                                value={filters.location}
                                onChange={e => setFilters({ ...filters, location: e.target.value })}
                            >
                                <option value="">All Locations</option>
                                <option value="Pune">Pune</option>
                                <option value="Punjab">Punjab</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="National">National</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Crop</label>
                            <select
                                value={filters.crop}
                                onChange={e => setFilters({ ...filters, crop: e.target.value })}
                            >
                                <option value="">All Crops</option>
                                <option value="Wheat">Wheat</option>
                                <option value="Tomato">Tomato</option>
                                <option value="Rice">Rice</option>
                            </select>
                        </div>
                    </div>

                    <div className="group-list">
                        {groups.map(group => (
                            <motion.div
                                key={group._id}
                                className={`group-item ${selectedGroup?._id === group._id ? 'active' : ''}`}
                                onClick={() => setSelectedGroup(group)}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="group-icon">
                                    {getIcon(group.icon)}
                                </div>
                                <div className="group-info">
                                    <h4>{group.name}</h4>
                                    <p>{group.lastMessage || group.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </aside>

                {/* Chat Area */}
                <main className="chat-main">
                    {selectedGroup ? (
                        <>
                            <header className="chat-header">
                                <div className="chat-title">
                                    <h3>{selectedGroup.name}</h3>
                                    <span>{selectedGroup.membersCount} Farmers Online</span>
                                </div>
                                <div className="chat-actions">
                                    <FaFilter />
                                </div>
                            </header>

                            <div className="message-area">
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={msg._id || i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`message-bubble ${msg.senderId === user._id ? 'sent' : 'received'}`}
                                    >
                                        {msg.senderId !== user._id && (
                                            <span className="msg-sender">{msg.senderName}</span>
                                        )}
                                        <div className="msg-text">{msg.text}</div>
                                        <span className="msg-time">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </motion.div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="chat-input-container">
                                <form className="chat-form" onSubmit={handleSendMessage}>
                                    <div className="chat-input-wrapper">
                                        <input
                                            type="text"
                                            placeholder="Type your message..."
                                            value={newMessage}
                                            onChange={e => setNewMessage(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="send-btn">
                                        <FaPaperPlane />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="empty-chat">
                            <FaRegCommentDots />
                            <h3>Select a group to start discussing</h3>
                            <p>Discover farming techniques and market insights from your peers.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Community;
