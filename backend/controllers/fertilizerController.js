const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const mammoth = require('mammoth');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Calculate fertilizer recommendation
// @route   POST /api/fertilizers/calculate
// @access  Public
exports.calculateFertilizer = async (req, res, next) => {
    try {
        const { N, P, K, cropType } = req.body;

        // Placeholder logic
        const recommendation = `For ${cropType}, add 50kg of Urea, 20kg of DAP, and 15kg of MOP per acre.`;

        res.status(200).json({
            success: true,
            recommendation,
            data: { N, P, K, cropType }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Analyze soil report via PDF/Word and Gemini
// @route   POST /api/fertilizers/analyze
// @access  Public
exports.analyzeSoilReport = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a soil report (PDF or Word).' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        let analysisInput;
        let isMultimodal = false;

        const mimeType = req.file.mimetype;

        if (mimeType === 'application/pdf') {
            // Native PDF support
            analysisInput = {
                inlineData: {
                    data: Buffer.from(fs.readFileSync(req.file.path)).toString("base64"),
                    mimeType: "application/pdf"
                },
            };
            isMultimodal = true;
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimeType === 'application/msword') {
            // Extract text from Word
            const result = await mammoth.extractRawText({ path: req.file.path });
            analysisInput = result.value;
            isMultimodal = false;
        } else {
            return res.status(400).json({ success: false, message: 'Unsupported file type. Please upload a PDF or Word document.' });
        }

        const prompt = `Analyze this soil test report. 
        1. Extract the values for Nitrogen (N), Phosphorus (P), and Potassium (K). 
        2. Identify the current crop or recommended crop.
        3. Provide specific fertilizer recommendations based on these values.
        4. Calculate estimated quantities of Urea, DAP, and MOP required per acre.
        
        Return the result in the following JSON format ONLY:
        {
            "N": number,
            "P": number,
            "K": number,
            "crop": "string",
            "recommendation": "string",
            "urea": number,
            "dap": number,
            "mop": number,
            "totalCost": number
        }
        
        Ensure N, P, K, urea, dap, mop and totalCost are numbers.
        ${isMultimodal ? '' : '\n\nReport Text Content:\n' + analysisInput}`;

        let result;
        if (isMultimodal) {
            result = await model.generateContent([prompt, analysisInput]);
        } else {
            result = await model.generateContent(prompt);
        }

        const response = await result.response;
        const text = response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Could not parse AI response as JSON");
        }

        const analysisData = JSON.parse(jsonMatch[0]);

        res.status(200).json({
            success: true,
            data: analysisData
        });

        // Clean up uploaded file
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    } catch (error) {
        console.error("Analysis Error Details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        console.error("Full Error Stack:", error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); // Cleanup on error
        next(error);
    }
};
