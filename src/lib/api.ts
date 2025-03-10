import { toast } from "sonner";
import { ImageSettings } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const generateImage = async (
  prompt: string,
  settings: ImageSettings
): Promise<{ imageUrl: string, prompt: string }> => {
  try {
    console.log("Generating image with prompt:", prompt);
    console.log("Settings:", settings);
    
    toast.info("Generating your image...", {
      duration: Infinity,
      id: "generating-image"
    });
    
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { prompt, settings },
    });

    toast.dismiss("generating-image");
    
    if (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
      throw error;
    }

    if (data.error) {
      console.error("API error:", data.error);
      toast.error(data.error);
      throw new Error(data.error);
    }

    toast.success("Image generated successfully!");
    return { 
      imageUrl: data.imageUrl,
      prompt: data.prompt || prompt
    };
  } catch (error) {
    console.error("Error generating image:", error);
    toast.dismiss("generating-image");
    toast.error("Failed to generate image. Please try again.");
    throw error;
  }
};

export const generateMultipleImages = async (
  prompt: string,
  settings: ImageSettings,
  count: number,
  onProgress?: (current: number, total: number) => void
): Promise<Array<{ imageUrl: string, prompt: string }>> => {
  const results = [];
  
  for (let i = 0; i < count; i++) {
    // Call the progress callback if provided
    if (onProgress) {
      onProgress(i, count);
    }
    
    // Generate a unique seed for each image if not specified
    const imageSeed = settings.seed === -1 
      ? Math.floor(Math.random() * 2147483647) 
      : settings.seed + i; // Increment seed for variation
    
    const imageSettings = {
      ...settings,
      seed: imageSeed
    };
    
    try {
      const result = await generateImage(prompt, imageSettings);
      results.push(result);
    } catch (error) {
      console.error(`Error generating image ${i+1}/${count}:`, error);
      // Continue with the next image even if one fails
    }
  }
  
  return results;
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getUserImages = async () => {
  const { data, error } = await supabase
    .from('user_images')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};
