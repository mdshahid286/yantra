const dotenv = require('dotenv');
const result = dotenv.config();
console.log('Dotenv Load Result:', result.error ? 'Error loading .env' : 'Success');
if (result.error) console.error(result.error);
console.log('Loaded Keys:', Object.keys(result.parsed || {}));

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin) || !origin) {
        res.header("Access-Control-Allow-Origin", origin || "*");
    }

    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/crop', require('./routes/cropRoutes'));
app.use('/api/disease', require('./routes/diseaseRoutes'));
app.use('/api/fertilizers', require('./routes/fertilizerRoutes'));
app.use('/api/schemes', require('./routes/schemeRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/profit', require('./routes/profitRoutes'));
app.use('/api/voice', require('./routes/voiceRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Yantra API is running' });
});

app.use(require('./middleware/error'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
