
import React, { useState } from 'react';
import Header from '@/components/Header';
import PromptInput from '@/components/PromptInput';
import ImageSettings from '@/components/ImageSettings';
import ImageDisplay from '@/components/ImageDisplay';
import GenerationHistory from '@/components/GenerationHistory';
import { generateImage } from '@/lib/api';
import { GeneratedImage, ImageSettings as ImageSettingsType } from '@/lib/types';
import { toast } from 'sonner';

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
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate image. Please try again.');
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
