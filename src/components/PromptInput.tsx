
import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface PromptInputProps {
  onGenerate: (prompt: string, imageCount: number) => void;
  isGenerating: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [imageCount, setImageCount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    onGenerate(prompt, imageCount);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative glass-morphism rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]">
        <div className="flex flex-col md:flex-row gap-2 p-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="flex-1 bg-transparent border-none outline-none p-4 text-white placeholder:text-white/50"
            disabled={isGenerating}
          />
          
          <div className="flex items-center gap-2 px-2">
            <div className="flex flex-col gap-1 min-w-[100px]">
              <Label className="text-xs text-white/70">Number of images</Label>
              <Select
                value={imageCount.toString()}
                onValueChange={(value) => setImageCount(parseInt(value))}
                disabled={isGenerating}
              >
                <SelectTrigger className="h-10 bg-white/5 border-white/10">
                  <SelectValue placeholder="1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              type="submit" 
              disabled={isGenerating || !prompt.trim()}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white ml-2 px-6 py-2 h-12 rounded-xl transition-all duration-300 ease-in-out"
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
