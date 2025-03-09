
import React from 'react';
import { GeneratedImage } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Copy, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { toast } from 'sonner';

interface GenerationHistoryProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
}

const GenerationHistory: React.FC<GenerationHistoryProps> = ({ images, onSelect }) => {
  if (images.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-12">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-medium">Recent Generations</h3>
        </div>
        <p className="text-sm text-white/50 text-center py-8">No generation history yet. Generate some images to see them here!</p>
      </div>
    );
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
                onClick={() => onSelect(image)}
              >
                <div className="aspect-square w-full overflow-hidden relative group">
                  <img
                    src={image.imageUrl}
                    alt={image.prompt}
                    className="w-full h-full object-cover transition-transform"
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
                        <Button variant="ghost" size="sm" className="w-6 h-6 p-0 min-w-6">
                          <Info className="w-3 h-3 text-white/50" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <div className="text-xs space-y-1">
                          <p>Dimensions: {image.settings.width}x{image.settings.height}</p>
                          <p>Steps: {image.settings.numInferenceSteps}</p>
                          <p>Model: {image.settings.model.split('/').pop() || 'SDXL'}</p>
                          <p>Format: {image.settings.fileFormat}</p>
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
      </div>
    </TooltipProvider>
  );
};

export default GenerationHistory;
