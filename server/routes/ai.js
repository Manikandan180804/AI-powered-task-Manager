import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Proxy AI requests to avoid CORS issues
router.post('/generate', async (req, res) => {
    try {
        const { prompt, apiKey, maxTokens = 2000 } = req.body;

        if (!apiKey) {
            return res.status(400).json({
                error: 'API key is required',
                success: false
            });
        }

        console.log('🤖 Calling Google Gemini API...');

        // Initialize Gemini with the API key
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                maxOutputTokens: maxTokens,
                temperature: 0.7,
            }
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = response.text();

        console.log('✅ AI response received');

        // Return in the format the frontend expects
        res.json({
            generatedText: generatedText,
            success: true
        });

    } catch (error) {
        console.error('❌ AI proxy error:', error.message);

        // Handle specific Gemini API errors
        if (error.message.includes('API_KEY_INVALID')) {
            return res.status(401).json({
                error: 'Invalid Gemini API key',
                message: 'Please check your API key at https://aistudio.google.com/app/apikey',
                success: false
            });
        }

        res.status(500).json({
            error: 'Failed to generate AI response',
            message: error.message,
            success: false
        });
    }
});

export default router;
