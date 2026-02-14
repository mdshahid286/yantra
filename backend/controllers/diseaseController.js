const axios = require('axios');
const fs = require('fs');

exports.detectDisease = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded"
            });
        }

        const imageBuffer = fs.readFileSync(req.file.path);
        const base64Image = imageBuffer.toString('base64');

        const prompt = `
Analyze this crop image.

Return ONLY a JSON like:
{
"disease":"",
"healthy":true,
"severity":"",
"treatment":""
}
`;

        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            { text: prompt },
                            {
                                inlineData: {
                                    mimeType: req.file.mimetype,
                                    data: base64Image
                                }
                            }
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

        const rawText =
            geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        console.log("Gemini RAW:", rawText);

        // 🧠 Extract JSON safely
        const match = rawText.match(/\{[\s\S]*\}/);

        let diagnosisData = {
            disease: "Unknown",
            healthy: false,
            severity: "Medium",
            treatment: "Consult agricultural expert"
        };

        if (match) {
            try {
                diagnosisData = JSON.parse(match[0]);
            } catch (e) {
                console.log("JSON parse failed. Using default.");
            }
        }

        return res.status(200).json({
            success: true,
            ...diagnosisData,
            imagePath: `/uploads/${req.file.filename}`
        });

    } catch (error) {

        console.error(
            "Gemini Disease Error:",
            error.response?.data || error.message
        );

        return res.status(200).json({
            success: false,
            disease: "Detection failed",
            healthy: false,
            severity: "Unknown",
            treatment: "Try again later"
        });
    }
};