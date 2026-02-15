const axios = require('axios');

// @desc    Recommend crops based on soil data
// @route   POST /api/crop
// @access  Public
exports.recommendCrop = async (req, res) => {
    try {
        const { soilType, landSize, location } = req.body;

        if (!soilType || !location) {
            return res.status(400).json({
                success: false,
                message: "Missing soil data or location"
            });
        }

        const prompt = `
You are an expert agricultural scientist. Given the following soil and land details, recommend 1-2 best crops to grow.
Provide a brief suitability analysis and 2 quick pros for the suggested crops.

Soil Data: ${soilType}
Land Size: ${landSize}
Location: ${location}

Return ONLY a JSON response like:
{
  "crops": "Crops: [Name]. Analysis: [Brief reasoning]. Pros: [Pro 1], [Pro 2]"
}
`;

        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const rawText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log("Gemini Crop RAW:", rawText);

        // Extract JSON safely
        const match = rawText.match(/\{[\s\S]*\}/);
        let resultData = { crops: "No specific recommendations at this time." };

        if (match) {
            try {
                resultData = JSON.parse(match[0]);
            } catch (e) {
                console.log("JSON parse failed for crop recommendation. Using fallback.");
                resultData = { crops: rawText };
            }
        }

        return res.status(200).json({
            success: true,
            crops: resultData.crops
        });

    } catch (error) {
        console.error("Crop Recommendation Error:", error.response?.data || error.message);
        return res.status(200).json({
            success: false,
            crops: "AI service currently unavailable. Please try again later."
        });
    }
};

// @desc    Get detailed sowing plan for a crop
// @route   POST /api/crop/sowing-plan
// @access  Public
exports.getSowingPlan = async (req, res) => {
    try {
        const { cropName, location, soilType } = req.body;

        if (!cropName) {
            return res.status(400).json({
                success: false,
                message: "Please provide a crop name"
            });
        }

        const prompt = `
You are an expert agriculturalist. Create a detailed sowing plan for "${cropName}" for a farmer in "${location || 'India'}".
Soil Context: ${soilType || 'General'}

Include the following sections in a clear, easy-to-read format (you can use Markdown):
1. **Best Sowing Time**: Ideal months/seasons.
2. **Seed Rate**: Kg per acre.
3. **Seed Treatment**: Recommended chemicals or bio-agents.
4. **Sowing Method**: Line sowing, broadcasting, etc., with spacing.
5. **Fertilizer Management**: Basal dose and top dressing.
6. **Water Management**: Initial irrigation and critical stages.
7. **Intercultural Operations**: Weeding and earthing up.

Keep the language simple and actionable for a farmer.
`;

        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const planText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        return res.status(200).json({
            success: true,
            plan: planText || "Could not generate sowing plan. Please try again."
        });

    } catch (error) {
        console.error("Sowing Plan Error:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: "AI service error",
            plan: "Unable to generate plan at this moment due to high demand. Please try again in 1 minute."
        });
    }
};
