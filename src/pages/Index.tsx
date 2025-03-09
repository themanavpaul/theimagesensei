
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PromptInput from '@/components/PromptInput';
import ImageSettings from '@/components/ImageSettings';
import ImageDisplay from '@/components/ImageDisplay';
import GenerationHistory from '@/components/GenerationHistory';
import { generateImage, generateMultipleImages, getUserImages } from '@/lib/api';
import { GeneratedImage, ImageSettings as ImageSettingsType } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentImages, setCurrentImages] = useState<Array<{imageUrl: string, prompt: string}>>([]);
  const [settings, setSettings] = useState<ImageSettingsType>({
    width: 1024,
    height: 1024,
    numInferenceSteps: 30,
    negativePrompt: '',
    seed: -1,
    fileFormat: 'webp',
    style: 'none',
    model: 'stability-ai/sdxl',
  });
  const [generationHistory, setGenerationHistory] = useState<GeneratedImage[]>([]);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Fetch previous generations from Supabase on component mount and when user changes
  useEffect(() => {
    console.log("User changed, fetching generation history...", user?.id);
    if (user) {
      fetchGenerationHistory();
    }
  }, [user]);

  const fetchGenerationHistory = async () => {
    if (!user) return;

    try {
      console.log("Fetching generation history...");
      const images = await getUserImages();
      
      if (images && images.length > 0) {
        // Transform the data to match our GeneratedImage type
        const transformedData: GeneratedImage[] = images.map(item => ({
          id: item.id,
          prompt: item.prompt,
          imageUrl: item.image_url,
          settings: {
            width: item.width,
            height: item.height,
            numInferenceSteps: item.inference_steps,
            negativePrompt: item.negative_prompt || '',
            seed: -1, // We don't store the seed in the DB
            fileFormat: item.image_url.includes('webp') ? 'webp' : 
                      item.image_url.includes('jpg') ? 'jpg' : 'png',
            style: item.style || 'none',
            model: item.model || 'stability-ai/sdxl',
          },
          createdAt: new Date(item.created_at),
        }));
        
        console.log("Setting generation history:", transformedData.length);
        setGenerationHistory(transformedData);
      } else {
        console.log("No images found in history");
        setGenerationHistory([]);
      }
    } catch (err) {
      console.error('Error in fetchGenerationHistory:', err);
      toast.error('Failed to load your generation history');
    }
  };

  const handleGenerate = async (prompt: string, imageCount: number = 1) => {
    if (!user) {
      toast.error('Please sign in to generate images');
      navigate('/auth');
      return;
    }

    setCurrentPrompt(prompt);
    setIsGenerating(true);
    setCurrentImages([]);
    
    try {
      let results;
      if (imageCount > 1) {
        results = await generateMultipleImages(prompt, settings, imageCount);
      } else {
        const result = await generateImage(prompt, settings);
        results = [result];
      }
      
      setCurrentImages(results);
      setCurrentPrompt(results[0]?.prompt || prompt);
      
      // Add to history (if it was successful)
      if (results.length > 0) {
        // Refresh history from the database
        await fetchGenerationHistory();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHistorySelect = (image: GeneratedImage) => {
    setCurrentPrompt(image.prompt);
    setCurrentImages([{ imageUrl: image.imageUrl, prompt: image.prompt }]);
    setSettings(image.settings);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container px-4 mx-auto flex-1">
        <section className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-light tracking-tight text-gradient mb-3">
            Transform Your Words into Art
          </h2>
          <p className="text-white/70">
            Create stunning AI-generated images using ImageSensei's powerful image generation technology.
          </p>
          {!user && !loading && (
            <div className="mt-4">
              <button 
                onClick={() => navigate('/auth')} 
                className="text-purple-400 hover:text-purple-300 underline text-sm"
              >
                Sign in to save your creations
              </button>
            </div>
          )}
        </section>
        
        <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
        <ImageSettings settings={settings} onSettingsChange={setSettings} />
        <ImageDisplay 
          images={currentImages} 
          prompt={currentPrompt} 
          isGenerating={isGenerating}
          settings={settings}
        />
        {user && (
          <GenerationHistory 
            images={generationHistory} 
            onSelect={handleHistorySelect} 
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
