
import React from 'react';
import { GeneratedImage } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock } from 'lucide-react';

interface GenerationHistoryProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
}

const GenerationHistory: React.FC<GenerationHistoryProps> = ({ images, onSelect }) => {
  if (images.length === 0) {
    return null;
  }

  return (
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
              className="w-40 shrink-0 glass-morphism rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
              onClick={() => onSelect(image)}
            >
              <div className="aspect-square w-full overflow-hidden">
                <img
                  src={image.imageUrl}
                  alt={image.prompt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <p className="text-xs text-white/70 truncate">{image.prompt}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default GenerationHistory;
