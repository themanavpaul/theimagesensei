
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PromptInput from '@/components/PromptInput';
import ImageSettings from '@/components/ImageSettings';
import ImageDisplay from '@/components/ImageDisplay';
import GenerationHistory from '@/components/GenerationHistory';
import { generateMultipleImages, getUserImages } from '@/lib/api';
import { GeneratedImage, ImageSettings as ImageSettingsType } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentImages, setCurrentImages] = useState<Array<{ imageUrl: string; prompt: string }>>([]);
  const [currentProgress, setCurrentProgress] = useState<{ current: number, total: number } | null>(null);
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
  
  // Fetch previous generations from Supabase on component mount
  useEffect(() => {
    if (user) {
      fetchGenerationHistory();
    }
  }, [user]);

  const fetchGenerationHistory = async () => {
    if (!user) return;

    try {
      const images = await getUserImages();
      
      if (images && images.length > 0) {
        // Transform the data to match our GeneratedImage type
        const transformedData: GeneratedImage[] = images.map(item => ({
          id: item.id,
          prompt: item.prompt,
          images: [{ imageUrl: item.image_url }], // Convert single imageUrl to array of images
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
        
        setGenerationHistory(transformedData);
      }
    } catch (err) {
      console.error('Error in fetchGenerationHistory:', err);
      toast.error('Failed to load your generation history');
    }
  };

  const handleGenerate = async (prompt: string, numImages: number) => {
    if (!user) {
      toast.error('Please sign in to generate images');
      navigate('/auth');
      return;
    }

    setCurrentPrompt(prompt);
    setIsGenerating(true);
    setCurrentImages([]);
    setCurrentProgress({ current: 0, total: numImages });
    
    try {
      const handleProgress = (current: number, total: number) => {
        setCurrentProgress({ current: current + 1, total });
        toast.info(`Generating image ${current + 1} of ${total}...`, {
          id: "generating-progress",
          duration: 1500,
        });
      };

      const results = await generateMultipleImages(prompt, settings, numImages, handleProgress);
      setCurrentImages(results);
      
      // Add to history
      if (results.length > 0) {
        // Create a GeneratedImage with all generated images
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          prompt: results[0].prompt,
          images: results.map(result => ({ imageUrl: result.imageUrl })),
          settings: { ...settings },
          createdAt: new Date(),
        };
        
        setGenerationHistory((prev) => [newImage, ...prev]);
        
        // Refresh history from the database
        fetchGenerationHistory();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
      setCurrentProgress(null);
    }
  };

  const handleHistorySelect = (image: GeneratedImage) => {
    setCurrentPrompt(image.prompt);
    // Set current images from the history item's images array
    setCurrentImages(image.images.map(img => ({ imageUrl: img.imageUrl, prompt: image.prompt })));
    setSettings(image.settings);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container px-4 mx-auto flex-grow">
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
        
        {currentProgress && (
          <div className="w-full max-w-4xl mx-auto mb-4">
            <div className="w-full bg-white/10 rounded-full h-2.5">
              <div 
                className="bg-purple-600 h-2.5 rounded-full"
                style={{ width: `${(currentProgress.current / currentProgress.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-center mt-1 text-white/60">
              Generating image {currentProgress.current} of {currentProgress.total}
            </p>
          </div>
        )}
        
        <ImageDisplay 
          images={currentImages} 
          prompt={currentPrompt} 
          isGenerating={isGenerating}
          settings={settings}
        />
        
        <GenerationHistory 
          images={generationHistory} 
          onSelect={handleHistorySelect} 
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
