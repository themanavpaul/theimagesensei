
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
  fileFormat: 'webp' | 'jpg' | 'png';
  style: string;
  model: string;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, settings, styleId } = await req.json();
    
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

    // Generate final prompt with style if provided
    let finalPrompt = prompt;
    if (settings.style && settings.style !== 'none') {
      // Find the style prompt appendix
      const styles = {
        'none': '',
        '3d-render': ' in a highly detailed 3D render style, with realistic textures and lighting.',
        'acrylic': ' painted in an acrylic style, with thick brush strokes and bold colors.',
        'anime': ' in an anime style, featuring vibrant colors and expressive character design.',
        'creative': ' in a highly creative and imaginative way, pushing artistic boundaries.',
        'dynamic': ' with a dynamic and action-packed composition, full of motion and energy.',
        'fashion': ' in a high-fashion editorial style, featuring elegant poses and stylish outfits.',
        'game-concept': ' designed as a concept for a next-generation video game.',
        'graphic-design-3d': ' in a 3D graphic design aesthetic, bold and futuristic.',
        'illustration': ' as a professional digital illustration, highly detailed and artistic.',
        'portrait': ' as a beautifully detailed portrait with realistic shading and depth.',
        'portrait-cinematic': ' in a cinematic portrait style, with dramatic lighting and deep contrast.',
        'portrait-fashion': ' in a high-fashion portrait style, elegant and editorial.',
        'ray-traced': ' using ray tracing technology, with ultra-realistic reflections and lighting.',
        'stock-photo': ' as a high-quality stock photo, professionally composed and well-lit.',
        'watercolor': ' painted in soft watercolor tones, with delicate brush strokes and a dreamy feel.',
      };
      finalPrompt += styles[settings.style] || '';
    }

    // Default to Stability AI SDXL if no model specified
    const modelId = settings.model || 'stability-ai/sdxl';
    const responseFormat = settings.fileFormat || 'webp';

    // Call Nebius Studio API
    const response = await fetch('https://api.studio.nebius.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NEBIUS_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelId,
        response_format: "b64_json",
        extra_body: {
          response_extension: responseFormat,
          width: settings.width,
          height: settings.height,
          num_inference_steps: settings.numInferenceSteps,
          negative_prompt: settings.negativePrompt,
          seed: settings.seed === -1 ? Math.floor(Math.random() * 2147483647) : settings.seed,
        },
        prompt: finalPrompt,
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
    const filename = `${timestamp}_${Math.random().toString(36).substring(2, 15)}.${responseFormat}`;
    
    // Record the generation in the database
    await supabaseClient.from('user_images').insert({
      user_id: userId,
      prompt: finalPrompt,
      width: settings.width,
      height: settings.height,
      inference_steps: settings.numInferenceSteps,
      negative_prompt: settings.negativePrompt || null,
      image_url: `data:image/${responseFormat};base64,${imageData}`,
      model: modelId,
      style: settings.style || null
    });

    // Return the generated image
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: `data:image/${responseFormat};base64,${imageData}`,
        prompt: finalPrompt
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
