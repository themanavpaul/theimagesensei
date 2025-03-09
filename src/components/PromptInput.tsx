
import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    onGenerate(prompt);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative glass-morphism rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]">
        <div className="flex items-center p-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="flex-1 bg-transparent border-none outline-none p-4 text-white placeholder:text-white/50"
            disabled={isGenerating}
          />
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
      </form>
      <div className="text-xs text-center mt-2 text-white/60">
        Try: "A cyberpunk cityscape at night with neon lights" or "Surreal landscape with floating islands"
      </div>
    </div>
  );
};

export default PromptInput;
