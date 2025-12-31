
export type Language = 'JavaScript' | 'Python' | 'PHP' | 'Go' | 'Java';

export type Intensity = 'light' | 'medium' | 'strong';

export interface ObfuscationSettings {
  language: Language;
  intensity: Intensity;
  renameVariables: boolean;
  stringEncryption: boolean;
  controlFlowFlattening: boolean;
  deadCodeInjection: boolean;
  targetEnvironment: string;
  exclusions: string;
}

export interface AppState {
  sourceCode: string; // The currently displayed code
  codeBuffers: Record<string, string>; // Stores code for each language
  obfuscatedCode: string;
  settings: ObfuscationSettings;
  isProcessing: boolean;
  error: string | null;
}
