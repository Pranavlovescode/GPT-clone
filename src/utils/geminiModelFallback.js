/**
 * A utility to attempt requests with multiple Gemini models if the primary one fails
 */

export async function tryGeminiModels(apiKey, messages, primaryModel = 'gemini-pro') {
  // First, try to get the list of available models
  let availableModels = [];
  
  try {
    console.log('Fetching available Gemini models...');
    const listModelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const modelsResponse = await fetch(listModelsUrl);
    
    if (modelsResponse.ok) {
      const modelsData = await modelsResponse.json();
      availableModels = modelsData.models?.map(m => m.name.split('/').pop()) || [];
      console.log('Available Gemini models:', availableModels);
    } else {
      console.error('Failed to fetch model list, status:', modelsResponse.status);
    }
  } catch (error) {
    console.error('Error fetching models list:', error);
  }
  
  // Models to try in order of preference - updated with most common Gemini model names as of 2025
  const modelOptions = [
    'gemini-pro',        // Most common stable model name
    'gemini-1.0-pro',    // Possible naming convention
    'gemini-ultra',      // Higher capability model
    'gemini-1.5-pro',    // Newer version
    'chat-bison-001',    // Legacy model that might still work
  ];
  
  // If we got available models, add them to the front of our list
  // Filter to only include models that have "gemini" in the name
  const geminiModels = availableModels.filter(m => m.includes('gemini'));
  if (geminiModels.length > 0) {
    modelOptions.unshift(...geminiModels);
  }
  
  // Add the primary model if specified and ensure it's tried first
  if (primaryModel && primaryModel !== 'gemini-pro') {
    modelOptions.unshift(primaryModel);
  }
  
  // Remove duplicates
  const uniqueModels = [...new Set(modelOptions)];
  
  let lastError = null;
  
  // Try each model in order
  for (const modelName of uniqueModels) {
    try {
      console.log(`Attempting to use Gemini model: ${modelName}`);
      
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        })
      });
      
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Error parsing response JSON:', parseError);
          // Continue to next model on parse error
          lastError = new Error(`Failed to parse error response for model ${modelName}`);
          continue;
        }
        
        const errorMessage = errorData.error?.message || `Error status: ${response.status}`;
        console.error(`Error with model ${modelName}:`, errorMessage);
        
        // If this is a model-not-found error, try the next model
        if (errorMessage.includes('not found') || errorMessage.includes('not supported')) {
          console.log(`Model ${modelName} not available, trying next option...`);
          lastError = new Error(errorMessage);
          continue;
        }
        
        // Handle API key errors separately - no need to try other models
        if (response.status === 400 && errorMessage.includes('API key')) {
          throw new Error(`API Key error: ${errorMessage}`);
        }
        
        if (response.status === 403 || response.status === 401) {
          throw new Error(`Authentication error: ${errorMessage}`);
        }
        
        // For other types of errors, try the next model
        lastError = new Error(errorMessage);
        continue;
      }
      
      // If we got here, the request succeeded
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error parsing successful response:', parseError);
        lastError = new Error('Failed to parse successful response');
        continue;
      }
      return { 
        data,
        modelUsed: modelName 
      };
      
    } catch (error) {
      console.error(`Error with model ${modelName}:`, error);
      lastError = error;
      // Continue to next model option
    }
  }
  
  // If we get here, all models failed
  // Try one last alternative format with text-only content
  try {
    console.log('Trying simple text-only fallback format...');
    
    // Get the text of the last user message
    const lastUserMessage = messages.findLast(msg => msg.role === 'user')?.parts?.[0]?.text || '';
    
    const simplifiedUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const simplifiedResponse = await fetch(simplifiedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: lastUserMessage }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    });
    
    if (simplifiedResponse.ok) {
      const simplifiedData = await simplifiedResponse.json();
      return {
        data: simplifiedData,
        modelUsed: 'gemini-pro (simplified)'
      };
    }
  } catch (fallbackError) {
    console.error('Even simplified fallback failed:', fallbackError);
  }
  
  throw lastError || new Error('All Gemini model options and fallbacks failed');
}