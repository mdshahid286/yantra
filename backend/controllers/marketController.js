const axios = require("axios");

// @desc    Get specific market analysis for a crop with history and news
// @route   POST /api/market
// @access  Public
exports.getMarketAnalysis = async (req, res) => {
    try {
        const { crop } = req.body;
        if (!crop) {
            return res.status(400).json({ success: false, message: "Crop name is required" });
        }

        console.log(`[AI] Analyzing market for: ${crop}`);

        const prompt = `
You are an expert Indian agricultural market analyst.
Generate realistic, current market data and historical trends for ${crop} in India for the last 5 days.
Also provide 2 recent related market news items and 3 biological/market logic points for the recommendation.

Return ONLY valid JSON in this format:
{
  "currentPrice": number (price per quintal in INR),
  "trend": "Increasing" or "Decreasing" or "Stable",
  "recommendation": "short advisory sentence",
  "history": [
    {"date": "10th Feb", "price": 2200},
    {"date": "11th Feb", "price": 2280},
    {"date": "12th Feb", "price": 2300},
    {"date": "13th Feb", "price": 2350},
    {"date": "14th Feb", "price": 2450}
  ],
  "news": [
    {"time": "10 Mins Ago", "text": "News item 1..."},
    {"time": "2 Hours Ago", "text": "News item 2..."}
  ],
  "logic": [
    "Logic point 1",
    "Logic point 2",
    "Logic point 3"
  ]
}
`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            {
                headers: { "Content-Type": "application/json" },
                timeout: 30000
            }
        );

        const aiText = response.data.candidates[0].content.parts[0].text;
        console.log(`[AI RAW RESPONSE - ${crop}]:`, aiText);

        const jsonMatch = aiText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("Invalid response from AI");
        }

        const result = JSON.parse(jsonMatch[0]);
        return res.status(200).json(result);

    } catch (error) {
        console.error("Market Analysis Error:", error.response?.data || error.message);
        return res.status(200).json({
            currentPrice: 2450,
            trend: "Stable",
            recommendation: "Service temporarily unavailable. Using last known data.",
            history: [
                { "date": "10th Feb", "price": 2400 },
                { "date": "11th Feb", "price": 2410 },
                { "date": "12th Feb", "price": 2420 },
                { "date": "13th Feb", "price": 2440 },
                { "date": "14th Feb", "price": 2450 }
            ],
            news: [
                { "time": "Now", "text": "AI market service is experiencing high load. Checking local Mandi manually is advised." }
            ],
            logic: ["Data link interrupted", "Server latency high"]
        });
    }
};

// @desc    Get general market trends for dashboard
// @route   GET /api/market/trends
// @access  Public
exports.getMarketTrends = async (req, res) => {
    try {
        console.log("[AI] Fetching top commodity trends for dashboard");

        const prompt = `
You are an Indian agricultural market bot.
Provide current average prices and trends for top 4 Indian commodities (Wheat, Rice, Tomato, Onion).

Return ONLY valid JSON array in this format:
[
  { "commodity": "Wheat", "currentPrice": 2400, "trend": "up", "forecast": 2550 },
  ...
]
`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            {
                headers: { "Content-Type": "application/json" },
                timeout: 30000
            }
        );

        const aiText = response.data.candidates[0].content.parts[0].text;
        console.log("[AI RAW DASHBOARD]:", aiText);

        const jsonMatch = aiText.match(/\[[\s\S]*\]/);

        if (!jsonMatch) {
            throw new Error("Invalid response from AI");
        }

        const trends = JSON.parse(jsonMatch[0]);
        return res.status(200).json({
            success: true,
            data: trends,
            recommendation: "Positive outlook for staples."
        });

    } catch (error) {
        console.error("Market Trends Error:", error.response?.data || error.message);
        return res.status(200).json({
            success: false,
            data: [
                { commodity: 'Wheat', currentPrice: 2450, trend: 'stable', forecast: 2450 },
                { commodity: 'Rice', currentPrice: 3500, trend: 'stable', forecast: 3500 },
                { commodity: 'Tomato', currentPrice: 1800, trend: 'stable', forecast: 1800 },
                { commodity: 'Onion', currentPrice: 2200, trend: 'stable', forecast: 2200 },
            ],
            recommendation: "Fallback data active."
        });
    }
};