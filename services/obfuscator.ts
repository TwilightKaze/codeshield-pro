
import { GoogleGenAI } from "@google/genai";
import { ObfuscationSettings } from "../types";

export const obfuscateCode = async (
  code: string,
  settings: ObfuscationSettings,
  apiKey?: string
): Promise<string> => {
  const activeKey = apiKey || process.env.API_KEY;

  if (!activeKey) {
    throw new Error("API Key is missing. Please set it in Settings or .env.local");
  }

  const ai = new GoogleGenAI({ apiKey: activeKey });

  const intensityMap = {
    light: "minimal changes, mainly whitespace and simple renaming",
    medium: "standard obfuscation, renaming variables, string hiding, and basic logic shifting",
    strong: "heavy protection, logic flattening, dead code insertion, and complex encryption"
  };

  const prompt = `
    Obfuscate the following ${settings.language} code using these parameters:
    - Intensity: ${intensityMap[settings.intensity]}
    - Rename Variables: ${settings.renameVariables ? 'Yes' : 'No'}
    - String Encryption/Hiding: ${settings.stringEncryption ? 'Yes' : 'No'}
    - Control Flow Flattening: ${settings.controlFlowFlattening ? 'Yes' : 'No'}
    - Dead Code Injection: ${settings.deadCodeInjection ? 'Yes' : 'No'}
    - Target: ${settings.targetEnvironment}
    - Exclusions (Do not rename these): ${settings.exclusions}

    Respond ONLY with the obfuscated code. Do not include markdown code blocks or explanations.
    Code to obfuscate:
    ${code}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        temperature: 0.1,
        topP: 1,
      },
    });

    return response.text || "// Error: No response from model";
  } catch (error: any) {
    console.error("Obfuscation error:", error);
    throw new Error(error.message || "Failed to obfuscate code");
  }
};
