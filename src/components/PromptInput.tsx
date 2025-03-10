
import React, { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ImageSettings, ImageStyle } from '@/lib/types';

interface PromptInputProps {
  onGenerate: (prompt: string, numImages: number) => void;
  isGenerating: boolean;
}

const imageStyles: Record<string, string> = {
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

const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [numImages, setNumImages] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    onGenerate(prompt, numImages);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative glass-morphism rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]">
        <div className="flex flex-col md:flex-row items-stretch p-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="flex-1 bg-transparent border-none outline-none p-4 text-white placeholder:text-white/50"
            disabled={isGenerating}
          />
          <div className="flex items-center px-2 md:px-0">
            <div className="flex items-center mr-2 bg-black/20 rounded-lg px-2 py-1">
              <span className="text-white/70 text-sm mr-2">Images:</span>
              <select
                value={numImages}
                onChange={(e) => setNumImages(Number(e.target.value))}
                className="bg-black/40 text-white border-none outline-none rounded px-2 py-1"
                disabled={isGenerating}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
            <Button 
              type="submit" 
              disabled={isGenerating || !prompt.trim()}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-2 h-12 rounded-xl transition-all duration-300 ease-in-out"
            >
              <span className="relative flex items-center gap-2">
                <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" /> 
                {isGenerating ? 'Generating...' : 'Generate'}
              </span>
            </Button>
          </div>
        </div>
      </form>
      <div className="text-xs text-center mt-2 text-white/60">
        Try: "A cyberpunk cityscape at night with neon lights" or "Surreal landscape with floating islands"
      </div>
    </div>
  );
};

export default PromptInput;
