
export interface ImageSettings {
  width: number;
  height: number;
  numInferenceSteps: number;
  negativePrompt: string;
  seed: number;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  settings: ImageSettings;
  createdAt: Date;
}

export interface ImageDimension {
  id: string;
  name: string;
  aspectRatio: string;
  width: number;
  height: number;
}
