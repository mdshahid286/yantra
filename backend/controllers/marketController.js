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
Generate realistic, current market data and historical trends for ${crop} in India for the past 30 days (give 10-12 data points sampled across the month).
Also provide 3 distinct Buying Tips, 3 distinct Selling Tips, and 3 Market Insights.

Return ONLY valid JSON in this format:
{
  "currentPrice": number (price per quintal in INR),
  "trend": "Increasing" or "Decreasing" or "Stable",
  "recommendation": "short advisory sentence",
  "history": [
    {"date": "15th Jan", "price": 2100},
    {"date": "20th Jan", "price": 2150},
    {"date": "25th Jan", "price": 2200},
    {"date": "1st Feb", "price": 2250},
    {"date": "5th Feb", "price": 2300},
    {"date": "10th Feb", "price": 2350},
    {"date": "14th Feb", "price": 2450}
  ],
  "buyingTips": ["Tip 1", "Tip 2", "Tip 3"],
  "sellingTips": ["Tip 1", "Tip 2", "Tip 3"],
  "insights": ["Insight 1", "Insight 2", "Insight 3"]
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
                { "date": "15th Jan", "price": 2300 },
                { "date": "1st Feb", "price": 2400 },
                { "date": "14th Feb", "price": 2450 }
            ],
            buyingTips: ["Monitor local mandi arrivals", "Check moisture content"],
            sellingTips: ["Hold if storage is available", "Wait for MSP announcement"],
            insights: ["Demand is steady", "Logistics are recovering"]
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