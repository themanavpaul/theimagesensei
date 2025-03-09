
export interface ImageSettings {
  width: number;
  height: number;
  numInferenceSteps: number;
  negativePrompt: string;
  seed: number;
  fileFormat: 'webp' | 'jpg' | 'png';
  style: string;
  model: string;
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

export interface ImageStyle {
  id: string;
  name: string;
  promptAppendix: string;
}

export interface ImageModel {
  id: string;
  name: string;
  modelId: string;
  maxSteps: number;
}

export interface User {
  id: string;
  email: string;
}
