
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PromptInput from '@/components/PromptInput';
import ImageSettings from '@/components/ImageSettings';
import ImageDisplay from '@/components/ImageDisplay';
import GenerationHistory from '@/components/GenerationHistory';
import { generateImage } from '@/lib/api';
import { GeneratedImage, ImageSettings as ImageSettingsType } from '@/lib/types';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<ImageSettingsType>({
    width: 1024,
    height: 1024,
    numInferenceSteps: 30,
    negativePrompt: '',
    seed: -1,
  });
  const [generationHistory, setGenerationHistory] = useState<GeneratedImage[]>([]);
  
  // Fetch previous generations from Supabase on component mount
  useEffect(() => {
    const fetchPreviousGenerations = async () => {
      try {
        const { data, error } = await supabase
          .from('user_images')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) {
          console.error('Error fetching previous generations:', error);
          return;
        }
        
        if (data && data.length > 0) {
          // Transform the data to match our GeneratedImage type
          const transformedData: GeneratedImage[] = data.map(item => ({
            id: item.id,
            prompt: item.prompt,
            imageUrl: item.image_url,
            settings: {
              width: item.width,
              height: item.height,
              numInferenceSteps: item.inference_steps,
              negativePrompt: item.negative_prompt || '',
              seed: -1, // We don't store the seed in the DB
            },
            createdAt: new Date(item.created_at),
          }));
          
          setGenerationHistory(transformedData);
        }
      } catch (err) {
        console.error('Error in fetchPreviousGenerations:', err);
      }
    };
    
    fetchPreviousGenerations();
  }, []);

  const handleGenerate = async (prompt: string) => {
    setCurrentPrompt(prompt);
    setIsGenerating(true);
    setCurrentImage(null);
    
    try {
      const imageUrl = await generateImage(prompt, settings);
      setCurrentImage(imageUrl);
      
      // Add to history
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt,
        imageUrl,
        settings: { ...settings },
        createdAt: new Date(),
      };
      
      setGenerationHistory((prev) => [newImage, ...prev]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHistorySelect = (image: GeneratedImage) => {
    setCurrentPrompt(image.prompt);
    setCurrentImage(image.imageUrl);
    setSettings(image.settings);
  };

  return (
    <div className="min-h-screen pb-16">
      <Header />
      
      <main className="container px-4 mx-auto">
        <section className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-light tracking-tight text-gradient mb-3">
            Transform Your Words into Art
          </h2>
          <p className="text-white/70">
            Create stunning AI-generated images using Nebius Studio's powerful image generation technology.
          </p>
        </section>
        
        <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
        <ImageSettings settings={settings} onSettingsChange={setSettings} />
        <ImageDisplay 
          imageUrl={currentImage} 
          prompt={currentPrompt} 
          isGenerating={isGenerating} 
        />
        <GenerationHistory 
          images={generationHistory} 
          onSelect={handleHistorySelect} 
        />
      </main>
    </div>
  );
};

export default Index;
