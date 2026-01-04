import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Proxy AI requests to avoid CORS issues
router.post('/generate', async (req, res) => {
    try {
        const { prompt, apiKey, maxTokens = 2000 } = req.body;

        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }

        console.log('🤖 Calling Google Gemini API...');

        // Initialize Gemini with the API key
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = response.text();

        console.log('✅ AI response received');
        res.json({ generatedText, success: true });

    } catch (error) {
        console.error('❌ AI proxy error:', error);
        res.status(500).json({
            error: 'Failed to generate AI response',
            message: error.message
        });
    }
});

export default router;
