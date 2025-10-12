import { NextResponse } from 'next/server';
import { tryGeminiModels } from '@/utils/geminiModelFallback';

// Helper function to generate a fallback response when all API calls fail
function generateFallbackResponse(userMessage) {
  const message = userMessage.trim().toLowerCase();
  
  if (message.includes('hello') || message.includes('hi ') || message.includes('hey')) {
    return "Hello! I'm currently having trouble connecting to the AI service. Please check your API key in settings or try again later.";
  }
  
  if (message.includes('help') || message.includes('error') || message.includes('problem')) {
    return "I notice you might be asking for help. There seems to be an issue with the AI service connection. Please check your API key in settings or try switching to a different API provider (OpenAI or Gemini).";
  }
  
  if (message.includes('weather') || message.includes('forecast')) {
    return "I'd like to provide weather information, but I'm currently unable to connect to the AI service. Please verify your API key in settings or try again later.";
  }
  
  // Default fallback
  return "I apologize, but I'm having trouble connecting to the AI service right now. This might be due to an invalid API key, service outage, or model availability issue. Please check your API key in settings or try switching between OpenAI and Gemini providers.";
}

// Helper function to fetch available Gemini models
async function listAvailableGeminiModels(apiKey) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return { success: false, error: `Failed to list models: ${response.status}` };
    }
    
    const data = await response.json();
    const models = data.models || [];
    
    // Extract just the model names for easier reference
    const modelNames = models.map(m => {
      // Format: "models/gemini-pro"
      const fullName = m.name;
      const nameParts = fullName.split('/');
      return nameParts[nameParts.length - 1]; // Get the last part
    });
    
    return {
      success: true,
      models: modelNames,
      rawModels: models
    };
  } catch (error) {
    console.error('Error listing Gemini models:', error);
    return { success: false, error: error.message };
  }
}

// Helper function to clean API keys
function cleanApiKey(apiKey) {
  if (!apiKey) {
    return '';
  }
  
  let key = apiKey.toString().trim();
  
  // Remove common prefixes
  if (key.startsWith('apiKey=')) {
    key = key.substring(7);
  }
  
  // Check for keys stored in JSON format
  try {
    const parsed = JSON.parse(key);
    if (typeof parsed === 'string') {
      key = parsed;
    } else if (parsed && typeof parsed.key === 'string') {
      key = parsed.key;
    }
  } catch (e) {
    // Not JSON, continue with normal processing
  }
  
  // Remove any quotes if somehow present
  key = key.replace(/["']/g, '');
  
  return key;
}

export async function POST(request) {
  try {
    const body = await request.json().catch(err => {
      console.error('Failed to parse request body:', err);
      return {};
    });
    
    const { messages, apiKey, apiProvider = 'openai' } = body;

    // Log request details (without API key)
    console.log(`API Request to ${apiProvider}:`, { 
      messageCount: messages?.length || 0,
      hasApiKey: !!apiKey
    });

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    // Format messages for API calls
    const formattedMessages = messages.map(msg => ({
      role: msg.role || 'user', // Default to user if role is missing
      content: msg.content || ''
    }));

    // Choose API based on provider
    if (apiProvider === 'openai') {
      return await handleOpenAI(formattedMessages, apiKey);
    } else if (apiProvider === 'gemini') {
      return await handleGemini(formattedMessages, apiKey);
    } else {
      return NextResponse.json({ error: 'Unsupported API provider' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    
    // More detailed error message
    let errorMessage = 'An error occurred while processing your request';
    if (error.message) {
      errorMessage = error.message;
    }
    
    // Additional logging for troubleshooting
    console.error('Stack trace:', error.stack);
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV !== 'production' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}

async function handleOpenAI(messages, apiKey) {
  // Clean up API key using our helper function
  const cleanedKey = cleanApiKey(apiKey);
  
  const url = 'https://api.openai.com/v1/chat/completions';
  
  // Note: OpenAI might update their model names over time
  // As of 2023, both "gpt-3.5-turbo" and "gpt-3.5-turbo-0125" are valid
  // If one fails, try the other
  const modelToUse = 'gpt-3.5-turbo';
  
  console.log('Sending request to OpenAI API with model:', modelToUse);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cleanedKey}`
    },
    body: JSON.stringify({
      model: modelToUse,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    let errorMessage = `OpenAI API error (${response.status})`;
    
    try {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      
      // Check for common API key issues
      if (response.status === 401) {
        errorMessage = 'Invalid API key. Please check your OpenAI API key in settings.';
      } else if (errorData.error && errorData.error.message) {
        errorMessage = `OpenAI API error: ${errorData.error.message}`;
      } else {
        errorMessage = `OpenAI API error (${response.status}): Please check your API key and try again.`;
      }
    } catch (parseError) {
      console.error('Failed to parse error response:', parseError);
    }
    
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  return NextResponse.json({
    content: data.choices[0]?.message?.content || 'No response from AI',
    model: data.model
  });
}

async function handleGemini(messages, apiKey) {
  // Convert chat format from OpenAI to Gemini
  // Gemini uses a different format with "parts" instead of "content"
  const geminiMessages = [];
  
  try {
    for (const msg of messages) {
      geminiMessages.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content || '' }]
      });
    }
    
    // Clean up API key using our helper function
    const cleanedKey = cleanApiKey(apiKey);
    
    if (!cleanedKey) {
      return NextResponse.json({ 
        error: 'Invalid API key format' 
      }, { status: 400 });
    }
    
    // Check available models first
    const modelsResult = await listAvailableGeminiModels(cleanedKey);
    console.log('Available Gemini models:', modelsResult.success ? modelsResult.models : 'Failed to list models');
    
    // Try multiple Gemini models until one works
    try {
      const { data, modelUsed } = await tryGeminiModels(cleanedKey, geminiMessages);
      
      // Handle various response formats that Gemini might return
      let responseText = '';
      
      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          responseText = candidate.content.parts[0].text;
        } else if (candidate.text) {
          responseText = candidate.text;
        } else if (candidate.output) {
          responseText = candidate.output;
        }
      }
      
      return NextResponse.json({
        content: responseText || 'No response content from AI',
        model: modelUsed
      });
      
    } catch (modelError) {
      console.error('All Gemini model attempts failed:', modelError);
      
      // Create a more user-friendly error message
      let errorMsg = 'Failed to get response from Gemini API';
      
      if (modelError.message.includes('API key')) {
        errorMsg = 'Invalid Gemini API key. Please check your settings.';
      } else if (modelError.message.includes('not found') || modelError.message.includes('not supported')) {
        // Try one last desperate approach - direct request with minimal format
        console.log('Trying direct minimal request as last resort...');
        try {
          // Extract just the last user message
          const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
          
          const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${cleanedKey}`;
          const directResponse = await fetch(directUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: lastUserMessage
                }]
              }]
            })
          });
          
          if (directResponse.ok) {
            const directData = await directResponse.json();
            const directText = directData?.candidates?.[0]?.content?.parts?.[0]?.text || 'No direct response available';
            
            return NextResponse.json({
              content: directText,
              model: 'gemini-pro (direct)'
            });
          } else {
            console.error('Direct request failed:', await directResponse.text());
          }
        } catch (directError) {
          console.error('Direct request attempt failed:', directError);
        }
        
        errorMsg = 'The Gemini models are currently unavailable. Please try again later or switch to OpenAI.';
      } else if (modelError.message.includes('quota')) {
        errorMsg = 'Your Gemini API quota has been exceeded. Please check your Google AI Studio account.';
      }
      
      // Add fallback mode to return a simulated response rather than error
      console.log('Using simulated response fallback');
      
      // Extract the last user message to make a more relevant fallback
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
      const simulatedResponse = generateFallbackResponse(lastUserMessage);
      
      // Return this with a special note so the frontend can show a warning
      return NextResponse.json({
        content: `[API CONNECTION ERROR] ${simulatedResponse}`,
        model: 'fallback-simulation',
        isSimulated: true
      });
      
      // Uncomment this to throw an error instead of using fallback
      // throw new Error(errorMsg);
    }
    
  } catch (error) {
    console.error('Error in Gemini handler:', error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
}