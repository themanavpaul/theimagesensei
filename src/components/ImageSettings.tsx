
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageSettings as ImageSettingsType, ImageDimension, ImageStyle, ImageModel } from '@/lib/types';
import { Settings, Minus, Plus, RefreshCw, Palette, FileType, Server } from 'lucide-react';
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

const imageStyles: ImageStyle[] = [
  { id: 'none', name: 'None', promptAppendix: '' },
  { id: '3d-render', name: '3D Render', promptAppendix: ' in a highly detailed 3D render style, with realistic textures and lighting.' },
  { id: 'acrylic', name: 'Acrylic', promptAppendix: ' painted in an acrylic style, with thick brush strokes and bold colors.' },
  { id: 'anime', name: 'Anime General', promptAppendix: ' in an anime style, featuring vibrant colors and expressive character design.' },
  { id: 'creative', name: 'Creative', promptAppendix: ' in a highly creative and imaginative way, pushing artistic boundaries.' },
  { id: 'dynamic', name: 'Dynamic', promptAppendix: ' with a dynamic and action-packed composition, full of motion and energy.' },
  { id: 'fashion', name: 'Fashion', promptAppendix: ' in a high-fashion editorial style, featuring elegant poses and stylish outfits.' },
  { id: 'game-concept', name: 'Game Concept', promptAppendix: ' designed as a concept for a next-generation video game.' },
  { id: 'graphic-design-3d', name: 'Graphic Design 3D', promptAppendix: ' in a 3D graphic design aesthetic, bold and futuristic.' },
  { id: 'illustration', name: 'Illustration', promptAppendix: ' as a professional digital illustration, highly detailed and artistic.' },
  { id: 'portrait', name: 'Portrait', promptAppendix: ' as a beautifully detailed portrait with realistic shading and depth.' },
  { id: 'portrait-cinematic', name: 'Portrait Cinematic', promptAppendix: ' in a cinematic portrait style, with dramatic lighting and deep contrast.' },
  { id: 'portrait-fashion', name: 'Portrait Fashion', promptAppendix: ' in a high-fashion portrait style, elegant and editorial.' },
  { id: 'ray-traced', name: 'Ray Traced', promptAppendix: ' using ray tracing technology, with ultra-realistic reflections and lighting.' },
  { id: 'stock-photo', name: 'Stock Photo', promptAppendix: ' as a high-quality stock photo, professionally composed and well-lit.' },
  { id: 'watercolor', name: 'Watercolor', promptAppendix: ' painted in soft watercolor tones, with delicate brush strokes and a dreamy feel.' },
];

const imageModels: ImageModel[] = [
  { id: 'sdxl', name: 'Stable Diffusion XL 1.0', modelId: 'stability-ai/sdxl', maxSteps: 64 },
  { id: 'flux-dev', name: 'Flux.1-dev', modelId: 'black-forest-labs/flux-dev', maxSteps: 50 },
  { id: 'flux-schnell', name: 'FLUX.1-schnell', modelId: 'black-forest-labs/flux-schnell', maxSteps: 16 },
];

const fileFormats = [
  { id: 'webp', name: 'WebP' },
  { id: 'jpg', name: 'JPG' },
  { id: 'png', name: 'PNG' },
];

const ImageSettings: React.FC<ImageSettingsProps> = ({ settings, onSettingsChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [currentModel, setCurrentModel] = useState<ImageModel>(
    imageModels.find(model => model.modelId === settings.model) || imageModels[0]
  );

  useEffect(() => {
    // Initialize default values if not present
    if (!settings.fileFormat) {
      handleSettingsChange('fileFormat', 'webp');
    }
    if (!settings.style) {
      handleSettingsChange('style', 'none');
    }
    if (!settings.model) {
      handleSettingsChange('model', imageModels[0].modelId);
      setCurrentModel(imageModels[0]);
    }
  }, []);

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

  const handleSettingsChange = (key: keyof ImageSettingsType, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
    
    // Handle model change to update max steps
    if (key === 'model') {
      const selectedModel = imageModels.find(model => model.modelId === value);
      if (selectedModel) {
        setCurrentModel(selectedModel);
        // Adjust steps if they exceed the new maximum
        if (settings.numInferenceSteps > selectedModel.maxSteps) {
          onSettingsChange({ 
            ...settings, 
            [key]: value, 
            numInferenceSteps: selectedModel.maxSteps 
          });
        }
      }
    }
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileType className="w-4 h-4 text-purple-400" />
                  <Label className="text-sm text-white/80">File Format</Label>
                </div>
                <Select
                  value={settings.fileFormat || 'webp'}
                  onValueChange={(value) => handleSettingsChange('fileFormat', value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {fileFormats.map((format) => (
                      <SelectItem key={format.id} value={format.id}>
                        {format.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-400" />
                  <Label className="text-sm text-white/80">Style</Label>
                </div>
                <Select
                  value={settings.style || 'none'}
                  onValueChange={(value) => handleSettingsChange('style', value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {imageStyles.map((style) => (
                      <SelectItem key={style.id} value={style.id}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-400" />
                <Label className="text-sm text-white/80">Model</Label>
              </div>
              <Select
                value={settings.model || imageModels[0].modelId}
                onValueChange={(value) => handleSettingsChange('model', value)}
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {imageModels.map((model) => (
                    <SelectItem key={model.id} value={model.modelId}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  max={currentModel.maxSteps}
                  step={1}
                  onValueChange={handleStepsChange}
                  className="flex-1"
                />
                <Plus className="w-3 h-3 text-white/60" />
              </div>
              <div className="text-xs text-white/60 text-center">
                Higher values produce more detailed images but take longer to generate (Max: {currentModel.maxSteps} for {currentModel.name})
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
