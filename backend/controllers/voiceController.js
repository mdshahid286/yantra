const { AssemblyAI } = require('assemblyai');
const fs = require('fs');
const path = require('path');

const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY,
});

// @desc    Convert text to speech (Deprecated - Use Frontend TTS)
// @route   POST /api/voice/tts
// @access  Public
exports.textToSpeech = async (req, res, next) => {
    // Recommend using browser TTS to save costs/latency
    return res.status(200).json({
        success: true,
        message: 'Use browser SpeechSynthesis for TTS.',
        useFrontendTTS: true
    });
};

// @desc    Convert speech to text using AssemblyAI
// @route   POST /api/voice/stt
// @access  Public
exports.speechToText = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No audio file uploaded' });
        }

        console.log("Uploading file to AssemblyAI...");

        // 1. Upload the audio file
        const uploadUrl = await client.files.upload(req.file.path);

        console.log("Transcribing...");

        // 2. Transcribe with Auto Language Detection
        const transcript = await client.transcripts.transcribe({
            audio_url: uploadUrl,
            language_detection: true,
            speech_models: ['universal-2'], // Updated to use speech_models list
        });

        // Clean up the uploaded file locally
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting temp file:", err);
        });

        if (transcript.status === 'error') {
            throw new Error(transcript.error);
        }

        console.log("Transcript:", transcript.text);

        res.status(200).json({
            success: true,
            transcript: transcript.text,
            language_code: transcript.language_code,
            message: 'Speech recognized successfully'
        });
    } catch (error) {
        console.error("STT Error:", error);
        // Clean up file if error occurred
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, () => { });
        }
        res.status(500).json({
            success: false,
            message: 'Error processing audio',
            error: error.message
        });
    }
};