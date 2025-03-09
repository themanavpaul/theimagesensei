
import React, { useState } from 'react';
import { Download, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Loading from './ui/Loading';
import { ImageSettings } from '@/lib/types';

interface ImageDisplayProps {
  images: { imageUrl: string; prompt: string }[];
  prompt: string;
  isGenerating: boolean;
  settings: ImageSettings;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  images, 
  prompt, 
  isGenerating,
  settings
}) => {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [imageUrl]: true
    }));
  };

  const handleDownload = (imageUrl: string) => {
    if (!imageUrl) return;
    
    const fileFormat = settings.fileFormat || 'webp';
    const timestamp = new Date().getTime();
    const filename = `imagesensei-${timestamp}.${fileFormat}`;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Image downloaded successfully');
  };

  const handleShare = (imageUrl: string, prompt: string) => {
    if (!imageUrl) return;
    
    if (navigator.share) {
      navigator.share({
        title: 'Image generated with ImageSensei',
        text: prompt,
        url: imageUrl
      })
      .then(() => toast.success('Shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(imageUrl)
        .then(() => toast.success('Image URL copied to clipboard'))
        .catch(() => toast.error('Failed to copy URL'));
    }
  };

  // Grid layout based on the number of images
  const getGridClass = () => {
    const count = images.length;
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1 md:grid-cols-2";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {isGenerating ? (
        <div className="glass-morphism rounded-2xl overflow-hidden transition-all duration-500 ease-in-out hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] aspect-square w-full flex flex-col items-center justify-center p-8 animate-pulse-subtle">
          <Loading size="lg" className="mb-6" />
          <p className="text-white/70 text-center max-w-md">
            Creating your masterpiece...
          </p>
          <p className="text-xs text-white/50 mt-2 text-center max-w-md">
            Transforming your prompt into {images.length > 1 ? `${images.length} beautiful images` : 'a beautiful image'}
          </p>
        </div>
      ) : images.length > 0 ? (
        <div className={`grid ${getGridClass()} gap-4`}>
          {images.map((image, index) => (
            <div key={index} className="glass-morphism rounded-2xl overflow-hidden transition-all duration-500 ease-in-out hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <div className="relative group">
                <div className={`aspect-square w-full bg-black/30 transition-opacity duration-500 ${loadedImages[image.imageUrl] ? 'opacity-100' : 'opacity-0'}`}>
                  <img
                    src={image.imageUrl}
                    alt={prompt}
                    className="w-full h-full object-cover"
                    onLoad={() => handleImageLoad(image.imageUrl)}
                  />
                </div>
                
                {!loadedImages[image.imageUrl] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loading size="lg" />
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-between items-end">
                    <p className="text-sm text-white/90 line-clamp-2 max-w-[80%]">{prompt}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 p-0"
                        onClick={() => handleDownload(image.imageUrl)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 p-0"
                        onClick={() => handleShare(image.imageUrl, prompt)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-morphism rounded-2xl overflow-hidden aspect-square w-full flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 rounded-full glass-morphism flex items-center justify-center mb-6 opacity-70">
            <Sparkles className="w-10 h-10 text-purple-400" />
          </div>
          <p className="text-white/70 text-center max-w-md">
            Your generated image will appear here
          </p>
          <p className="text-xs text-white/50 mt-2 text-center max-w-md">
            Enter a prompt above to create an AI-generated image
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
