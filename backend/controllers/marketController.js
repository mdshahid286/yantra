const axios = require("axios");

// @desc    Get specific market analysis for a crop
// @route   POST /api/market
// @access  Public
exports.getMarketAnalysis = async (req, res) => {
    try {
        const { crop } = req.body;
        if (!crop) {
            return res.status(400).json({ success: false, message: "Crop name is required" });
        }

        const prompt = `
You are an expert Indian agricultural market analyst.
Generate realistic, current market data for ${crop} in India.

Return ONLY valid JSON in this format:
{
  "currentPrice": number (price per quintal in INR),
  "trend": "Increasing" or "Decreasing" or "Stable",
  "recommendation": "short advisory sentence (e.g., Hold for better prices, Sell now as demand is peaking, etc.)"
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
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("Invalid response from AI");
        }

        const result = JSON.parse(jsonMatch[0]);
        return res.status(200).json(result);

    } catch (error) {
        console.error("Market Analysis Error:", error.response?.data || error.message);
        return res.status(200).json({
            currentPrice: 0,
            trend: "Unknown",
            recommendation: "Market data analysis unavailable. Please try again later."
        });
    }
};

// @desc    Get general market trends for dashboard
// @route   GET /api/market/trends
// @access  Public
exports.getMarketTrends = async (req, res) => {
    try {
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
        const jsonMatch = aiText.match(/\[[\s\S]*\]/);

        if (!jsonMatch) {
            throw new Error("Invalid response from AI");
        }

        const trends = JSON.parse(jsonMatch[0]);
        return res.status(200).json({
            success: true,
            data: trends,
            recommendation: "Market outlook: Generally positive trends in staples. Vegetable prices volatile due to weather."
        });

    } catch (error) {
        console.error("Market Trends Error:", error.response?.data || error.message);
        return res.status(200).json({
            success: false,
            data: [
                { commodity: 'Wheat', currentPrice: 0, trend: 'stable', forecast: 0 },
                { commodity: 'Rice', currentPrice: 0, trend: 'stable', forecast: 0 },
                { commodity: 'Tomato', currentPrice: 0, trend: 'stable', forecast: 0 },
                { commodity: 'Onion', currentPrice: 0, trend: 'stable', forecast: 0 },
            ],
            recommendation: "Market data service temporarily down."
        });
    }
};