
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
  count: number
): Promise<Array<{ imageUrl: string, prompt: string }>> => {
  const images = [];
  
  for (let i = 0; i < count; i++) {
    try {
      const index = i + 1;
      toast.info(`Generating image ${index} of ${count}...`, {
        duration: Infinity,
        id: `generating-image-${index}`
      });
      
      // Generate each image sequentially
      const result = await generateImage(prompt, settings);
      images.push(result);
      
      toast.dismiss(`generating-image-${index}`);
    } catch (error) {
      console.error(`Error generating image ${i + 1}:`, error);
      // Continue with the next image even if one fails
    }
  }
  
  return images;
};

// Add authentication functions
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
  try {
    console.log("Fetching user images...");
    const { data, error } = await supabase
      .from('user_images')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching user images:", error);
      throw error;
    }
    
    console.log("Fetched user images:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Error in getUserImages:", error);
    throw error;
  }
};
