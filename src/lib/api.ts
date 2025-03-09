
import { toast } from "sonner";
import { ImageSettings } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const generateImage = async (
  prompt: string,
  settings: ImageSettings
): Promise<string> => {
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
    return data.imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    toast.dismiss("generating-image");
    toast.error("Failed to generate image. Please try again.");
    throw error;
  }
};
