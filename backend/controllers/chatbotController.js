const axios = require('axios');

// @desc    Get AI agricultural advice
// @route   POST /api/chatbot
// @access  Public

exports.getChatResponse = async (req, res) => {

    try {

        console.log("Incoming Body:", req.body);

        const { query } = req.body;

        if (!query) {
            return res.status(400).json({
                response: "Query is missing"
            });
        }

        const prompt = `
You are an expert agricultural assistant for farmers.

Provide:
- crop recommendation
- disease treatment
- fertilizer advice
- irrigation suggestion
- market decision
- govt policy info

User Query: ${query}

Give short and practical advice.
`;

        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiText =
            geminiResponse.data.candidates[0].content.parts[0].text;

        return res.status(200).json({
            response: aiText
        });

    } catch (error) {

        console.error("Gemini API Error:", error.response?.data || error.message);

        return res.status(500).json({
            response: "AI service unavailable. Try again."
        });
    }
};