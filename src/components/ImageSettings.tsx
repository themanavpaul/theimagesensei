
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageSettings as ImageSettingsType, ImageDimension } from '@/lib/types';
import { Settings, Minus, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageSettingsProps {
  settings: ImageSettingsType;
  onSettingsChange: (settings: ImageSettingsType) => void;
}

const imageDimensions: ImageDimension[] = [
  { id: '1:1', name: 'Square', aspectRatio: '1:1', width: 1024, height: 1024 },
  { id: '4:3', name: 'Standard', aspectRatio: '4:3', width: 1024, height: 768 },
  { id: '3:4', name: 'Portrait', aspectRatio: '3:4', width: 768, height: 1024 },
  { id: '16:9', name: 'Wide', aspectRatio: '16:9', width: 1024, height: 576 },
];

const ImageSettings: React.FC<ImageSettingsProps> = ({ settings, onSettingsChange }) => {
  const [expanded, setExpanded] = useState(false);

  const handleDimensionSelect = (dimension: ImageDimension) => {
    onSettingsChange({
      ...settings,
      width: dimension.width,
      height: dimension.height,
    });
  };

  const handleStepsChange = (value: number[]) => {
    onSettingsChange({ ...settings, numInferenceSteps: value[0] });
  };

  const handleNegativePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, negativePrompt: e.target.value });
  };

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onSettingsChange({ ...settings, seed: isNaN(value) ? -1 : value });
  };

  const resetSeed = () => {
    onSettingsChange({ ...settings, seed: -1 });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="glass-morphism rounded-xl overflow-hidden transition-all duration-300">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-medium">Advanced Settings</h3>
          </div>
          <div className="text-xs text-white/60">
            {expanded ? 'Hide Settings' : 'Show Settings'}
          </div>
        </div>
        
        {expanded && (
          <div className="p-6 border-t border-white/5 space-y-6 animate-fade-in">
            <div className="space-y-3">
              <Label className="text-sm text-white/80">Image Dimensions</Label>
              <div className="grid grid-cols-4 gap-2">
                {imageDimensions.map((dim) => (
                  <Button
                    key={dim.id}
                    type="button"
                    variant="outline"
                    className={`text-xs py-1 px-2 h-auto flex flex-col items-center justify-center ${
                      settings.width === dim.width && settings.height === dim.height
                        ? 'bg-purple-500/20 border-purple-500/50'
                        : 'bg-white/5'
                    }`}
                    onClick={() => handleDimensionSelect(dim)}
                  >
                    <span>{dim.name}</span>
                    <span className="text-[10px] text-white/60">{dim.aspectRatio}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm text-white/80">Quality Steps: {settings.numInferenceSteps}</Label>
              </div>
              <div className="flex items-center gap-4">
                <Minus className="w-3 h-3 text-white/60" />
                <Slider
                  value={[settings.numInferenceSteps]}
                  min={10}
                  max={50}
                  step={1}
                  onValueChange={handleStepsChange}
                  className="flex-1"
                />
                <Plus className="w-3 h-3 text-white/60" />
              </div>
              <div className="text-xs text-white/60 text-center">
                Higher values produce more detailed images but take longer to generate
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="negative-prompt" className="text-sm text-white/80">Negative Prompt</Label>
              <Input
                id="negative-prompt"
                placeholder="Features you want to avoid (e.g., 'blurry, distorted')"
                value={settings.negativePrompt}
                onChange={handleNegativePromptChange}
                className="bg-white/5 border-white/10"
              />
              <div className="text-xs text-white/60">
                Specify elements you don't want in the generated image
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="seed" className="text-sm text-white/80">Seed</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetSeed}
                  className="h-6 px-2 text-xs text-white/60 hover:text-white"
                >
                  <RefreshCw className="w-3 h-3 mr-1" /> Randomize
                </Button>
              </div>
              <Input
                id="seed"
                type="number"
                placeholder="Random (-1)"
                value={settings.seed === -1 ? '' : settings.seed}
                onChange={handleSeedChange}
                className="bg-white/5 border-white/10"
              />
              <div className="text-xs text-white/60">
                Use the same seed to create variations of the same image with different prompts
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSettings;
