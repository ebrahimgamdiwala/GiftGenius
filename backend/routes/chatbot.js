const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to list available models
async function listAvailableModels() {
  try {
    const models = await genAI.listModels();
    console.log('Available models:', models);
    return models;
  } catch (error) {
    console.error('Error listing models:', error);
    return [];
  }
}

// Function to get relevant products based on user input
async function getRelevantProducts(userInput) {
  try {
    // Get all products from database
    const products = await Product.find({});
    
    if (!products || products.length === 0) {
      console.log('No products found in database');
      return [];
    }

    // Create a prompt for Gemini
    const prompt = `
      Based on the following user input: "${userInput}"
      And these available products: ${JSON.stringify(products)}
      
      Please analyze and return a JSON array of the 6 most relevant product IDs that would make good gift recommendations.
      Only return the IDs in this format: [1, 2, 3, 4, 5, 6]
    `;

    // Get response from Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini response:', text);
    
    // Parse the response to get product IDs
    const productIds = JSON.parse(text);
    
    // Get the actual products
    const recommendedProducts = await Product.find({
      _id: { $in: productIds }
    });

    return recommendedProducts;
  } catch (error) {
    console.error('Error in getRelevantProducts:', error);
    // Return all products if there's an error
    return await Product.find({}).limit(6);
  }
}

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        message: "Please provide a message",
        products: []
      });
    }

    // Get the last 5 messages for context
    const recentMessages = conversationHistory.slice(-5);
    const context = recentMessages.map(msg => `${msg.sender}: ${msg.message}`).join('\n');

    // First, search for relevant products based on the message
    const searchTerms = message.toLowerCase().split(' ');
    const relevantProducts = await Product.find({
      $or: [
        { name: { $regex: searchTerms.join('|'), $options: 'i' } },
        { description: { $regex: searchTerms.join('|'), $options: 'i' } },
        { category: { $regex: searchTerms.join('|'), $options: 'i' } }
      ]
    });

    // Create a more focused prompt for the AI
    const prompt = `Based on the following conversation about gift recommendations, suggest 3 relevant products from the available options.
    Consider the context and preferences mentioned. Only suggest products that are highly relevant to the conversation.
    
    Conversation context:
    ${context}
    
    Current message: ${message}
    
    Available products:
    ${JSON.stringify(relevantProducts.map(p => ({
      id: p._id,
      name: p.name,
      description: p.description,
      category: p.category
    })))}
    
    Please provide:
    1. A helpful response to the user's message
    2. A list of exactly 3 relevant product IDs from the available products that would make good gift recommendations
    
    Format your response as JSON:
    {
      "message": "your response to the user",
      "productIds": ["id1", "id2", "id3"]
    }`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw AI response:', text); // Debug log
    
    // Parse the AI response
    let aiResponse;
    try {
      // Try to find JSON in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON found, create a basic response
        aiResponse = {
          message: text,
          productIds: []
        };
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // If parsing fails, create a basic response
      aiResponse = {
        message: text,
        productIds: []
      };
    }

    // Fetch the recommended products
    let recommendedProducts = [];
    if (aiResponse.productIds && aiResponse.productIds.length > 0) {
      try {
        recommendedProducts = await Product.find({
          _id: { $in: aiResponse.productIds }
        }).limit(3);
      } catch (error) {
        console.error('Error fetching products:', error);
        recommendedProducts = [];
      }
    }

    // If we don't have enough products, get some from the relevant products list
    if (recommendedProducts.length < 3) {
      const remainingSlots = 3 - recommendedProducts.length;
      const usedIds = recommendedProducts.map(p => p._id.toString());
      const additionalProducts = relevantProducts
        .filter(p => !usedIds.includes(p._id.toString()))
        .slice(0, remainingSlots);
      recommendedProducts = [...recommendedProducts, ...additionalProducts];
    }

    res.json({
      message: aiResponse.message || "Here are some gift recommendations based on your preferences:",
      products: recommendedProducts
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ 
      message: "I'm having trouble processing your request. Please try again.",
      products: [],
      error: error.message
    });
  }
});

module.exports = router; 