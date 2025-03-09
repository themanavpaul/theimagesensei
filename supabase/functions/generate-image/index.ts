
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ImageSettings = {
  width: number;
  height: number;
  numInferenceSteps: number;
  negativePrompt: string;
  seed: number;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, settings } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log("Generating image with prompt:", prompt);
    console.log("Settings:", settings);

    const NEBIUS_API_KEY = Deno.env.get('NEBIUS_API_KEY');
    if (!NEBIUS_API_KEY) {
      throw new Error('NEBIUS_API_KEY is not set');
    }

    // Call Nebius Studio API
    const response = await fetch('https://api.studio.nebius.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NEBIUS_API_KEY}`,
      },
      body: JSON.stringify({
        model: "stability-ai/sdxl",
        response_format: "b64_json",
        extra_body: {
          response_extension: "webp",
          width: settings.width,
          height: settings.height,
          num_inference_steps: settings.numInferenceSteps,
          negative_prompt: settings.negativePrompt,
          seed: settings.seed === -1 ? Math.floor(Math.random() * 2147483647) : settings.seed,
        },
        prompt: prompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Nebius API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Insert the generated image into Supabase
    const { supabaseClient } = await import('./supabaseClient.ts');
    
    const imageData = data.data[0].b64_json;
    const userId = req.headers.get('x-userid') || 'anonymous';
    
    // Create a unique filename
    const timestamp = new Date().getTime();
    const filename = `${timestamp}_${Math.random().toString(36).substring(2, 15)}.webp`;
    
    // Store image in Supabase Storage if available
    // For now we'll return the base64 data
    
    // Record the generation in the database
    await supabaseClient.from('user_images').insert({
      user_id: userId,
      prompt: prompt,
      width: settings.width,
      height: settings.height,
      inference_steps: settings.numInferenceSteps,
      negative_prompt: settings.negativePrompt || null,
      image_url: `data:image/webp;base64,${imageData}`,
      model: "stability-ai/sdxl",
      style: null
    });

    // Return the generated image
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: `data:image/webp;base64,${imageData}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-image function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
