
import React, { useState } from 'react';
import { GeneratedImage } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Copy, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { toast } from 'sonner';

interface GenerationHistoryProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
}

const GenerationHistory: React.FC<GenerationHistoryProps> = ({ images, onSelect }) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  if (images.length === 0) {
    return null;
  }

  const copyPrompt = (prompt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt)
      .then(() => toast.success('Prompt copied to clipboard'))
      .catch(() => toast.error('Failed to copy prompt'));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleImageClick = (image: GeneratedImage) => {
    setSelectedImage(image);
  };

  const handleUseSettings = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      setSelectedImage(null);
    }
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-4xl mx-auto mt-12">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-medium">Recent Generations</h3>
        </div>
        
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex space-x-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="w-48 shrink-0 glass-morphism rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <div className="aspect-square w-full overflow-hidden relative group">
                  <img
                    src={image.imageUrl}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-7 h-7 p-0 bg-white/10 hover:bg-white/20 rounded-full"
                          onClick={(e) => copyPrompt(image.prompt, e)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy prompt</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs text-white/70 truncate max-w-[80%]">{image.prompt}</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                          <Info className="w-3 h-3 text-white/50" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1">
                          <p>Dimensions: {image.settings.width}x{image.settings.height}</p>
                          <p>Format: {image.settings.fileFormat}</p>
                          <p>Steps: {image.settings.numInferenceSteps}</p>
                          <p>Model: {image.settings.model.split('/').pop() || 'SDXL'}</p>
                          {image.settings.style && image.settings.style !== 'none' && (
                            <p>Style: {image.settings.style}</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-[10px] text-white/50">{formatDate(image.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Dialog open={selectedImage !== null} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="sm:max-w-[500px] glass-morphism border-none text-white">
            <DialogHeader>
              <DialogTitle>Image Details</DialogTitle>
              <DialogClose className="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>
            
            {selectedImage && (
              <div className="space-y-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-md">
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.prompt}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium">Prompt</h4>
                    <p className="text-sm text-white/70">{selectedImage.prompt}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <h4 className="text-xs font-medium">Dimensions</h4>
                      <p className="text-xs text-white/70">{selectedImage.settings.width}x{selectedImage.settings.height}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium">Format</h4>
                      <p className="text-xs text-white/70">{selectedImage.settings.fileFormat}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium">Steps</h4>
                      <p className="text-xs text-white/70">{selectedImage.settings.numInferenceSteps}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium">Model</h4>
                      <p className="text-xs text-white/70">{selectedImage.settings.model.split('/').pop() || 'SDXL'}</p>
                    </div>
                    {selectedImage.settings.style && selectedImage.settings.style !== 'none' && (
                      <div>
                        <h4 className="text-xs font-medium">Style</h4>
                        <p className="text-xs text-white/70">{selectedImage.settings.style}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-medium">Generated</h4>
                      <p className="text-xs text-white/70">{formatDate(selectedImage.createdAt)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="bg-white/10 hover:bg-white/20"
                    onClick={() => copyPrompt(selectedImage.prompt, new MouseEvent('click') as any)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Prompt
                  </Button>
                  
                  <Button 
                    variant="default"
                    size="sm"
                    onClick={handleUseSettings}
                  >
                    Use These Settings
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default GenerationHistory;
