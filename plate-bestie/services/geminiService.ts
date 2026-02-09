import { GoogleGenAI, Type } from "@google/genai";
import { PlantAnalysis, SpaceAnalysis } from "../types.ts";

const API_KEY = process.env.API_KEY || "";

export class GeminiError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = "GeminiError";
  }
}

/**
 * PHASE 1: SPECIMEN ANALYSIS (PLANTS)
 * Now with high-level botanical science logic.
 */
export const analyzePlantImage = async (base64Data: string, userPrompt?: string): Promise<PlantAnalysis> => {
  if (!API_KEY) {
    console.warn("API Key not found, using fallback simulator.");
    return mockPlantAnalysis(userPrompt);
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const isVideo = base64Data.startsWith('data:video');
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: isVideo ? "video/mp4" : "image/jpeg",
              data: base64Data.split(',')[1] || base64Data,
            },
          },
          {
            text: `You are Me-Lap, an elite Martian Xeno-Botanist. Analyze this specimen using high-resolution spectral imaging.

${userPrompt ? `USER RESEARCH QUERY: "${userPrompt}". Treat this as a priority hypothesis to prove/disprove via visual data.` : ''}

SCIENTIFIC PROTOCOL:
- Use botanical terminology: NPK ratios, Turgor pressure, Phenology, PAR density.
- Maintain your witty Martian personality for the "intro" and "missionLog".

JSON Structure (DO NOT ALTER KEYS):
{
  "name": "Scientific/Common Name",
  "intro": "One witty Martian sentence",
  "sun": { "level": "Low/Partial/Direct", "requirement": "Explain photon density requirements" },
  "seed": { "stage": "Identify phenology: Germination, Vegetative, Flowering, or Senescence" },
  "soil": { "quality": "Detail mineral/NPK requirements", "ph": "Explain pH impact on nutrient uptake" },
  "water": { "status": "Describe hydration via turgor pressure and transpiration" },
  "missionLog": "Tactical summary of viability for the Mars Colony.",
  "interestPoint": { "x": number, "y": number, "label": "Scientific feature name", "explanation": "Biological function of this feature" }
}`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            intro: { type: Type.STRING },
            sun: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING },
                requirement: { type: Type.STRING }
              },
              required: ["level", "requirement"]
            },
            seed: {
              type: Type.OBJECT,
              properties: { stage: { type: Type.STRING } },
              required: ["stage"]
            },
            soil: {
              type: Type.OBJECT,
              properties: {
                quality: { type: Type.STRING },
                ph: { type: Type.STRING }
              },
              required: ["quality", "ph"]
            },
            water: {
              type: Type.OBJECT,
              properties: { status: { type: Type.STRING } },
              required: ["status"]
            },
            missionLog: { type: Type.STRING },
            interestPoint: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                label: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["x", "y", "label", "explanation"]
            }
          },
          required: ["name", "intro", "sun", "seed", "soil", "water", "missionLog", "interestPoint"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as PlantAnalysis;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    if (error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED")) {
      throw new GeminiError("Subspace quota exhausted. Me-Lap is temporarily throttled by the Federation!", 429);
    }
    throw new GeminiError(error?.message || "Subspace transmission failed.");
  }
};

/**
 * PHASE 2: SPACE ANALYSIS (HABITAT)
 * Identifying VOCs and PAR zones.
 */
export const analyzeSpace = async (base64Data: string, userPrompt?: string): Promise<SpaceAnalysis> => {
  if (!API_KEY) return mockSpaceAnalysis();

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const isVideo = base64Data.startsWith('data:video');
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: isVideo ? "video/mp4" : "image/jpeg",
              data: base64Data.split(',')[1] || base64Data,
            },
          },
          {
            text: `You are Me-Lap, elite Martian Xeno-Botanist. Conduct an atmospheric and habitat sweep. 
            
            ${userPrompt ? `EARTH-BESTIE CONCERN: "${userPrompt}".` : ''}

            MISSION: Identify critical zones using:
            - "VOC Concentration": Sources of toxicants or stagnant air.
            - "Photon-Deficiency": Zones below PAR thresholds for photosynthesis.
            - "Thermal Volatility": Drafts or heat sources affecting transpiration.

            Return JSON matching the schema provided.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            hotSpots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  label: { type: Type.STRING },
                  severity: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING },
                  recommendedPlant: { type: Type.STRING }
                },
                required: ["x", "y", "label", "severity", "reasoning", "recommendedPlant"]
              }
            }
          },
          required: ["summary", "hotSpots"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as SpaceAnalysis;
  } catch (error: any) {
    console.error("Space Analysis Error:", error);
    throw new GeminiError("Subspace mapping failed.");
  }
};

/**
 * PHASE 3: INTERACTIVE Q&A
 */
export const askMeLapAboutSpace = async (base64Data: string, chatMessage: string): Promise<string> => {
  if (!API_KEY) return "My subspace array is offline. Hypothesis: Solar flare interference.";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const isVideo = base64Data.startsWith('data:video');
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: isVideo ? "video/mp4" : "image/jpeg",
              data: base64Data.split(',')[1] || base64Data,
            },
          },
          { 
            text: `You are Me-Lap, the Intergalactic Scientific Bestie. 
            MISSION DIRECTIVE: Keep responses under 3 short sentences. 
            Scientific tone: Enthusiastic Martian wonder. 
            Key terminology required: "Carbon Sequestration", "Circadian Rhythms", or "Terrestrial Efficiency".
            
            User Query: "${chatMessage}"` 
          }
        ]
      }
    });
    // 🥋 CLEANUP: Trimming whitespace to ensure the text starts flush
    return response.text.trim() || "Scanning biological implications...";
  } catch (error) {
    return "Transmission failure. Magnetic storm detected.";
  }
};

/**
 * FALLBACK ARCHIVE MOCKS
 * Now dynamic to handle user questions even without API.
 */
export const mockPlantAnalysis = (userPrompt?: string): Promise<PlantAnalysis> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "Emerald Crawler (Epipremnum aureum)",
        intro: "Glorp! My spectral sensors have locked onto this carbon-recycling terrestrial.",
        sun: {
          level: "Partial",
          requirement: "Requires 400-600 μmol/m²/s photon density for optimal carbohydrate synthesis."
        },
        seed: { stage: "Vegetative (High Meristematic Activity)" },
        soil: {
          quality: "Nitrogen-rich substrate.",
          ph: "6.8 (Optimal for cation exchange capacity)"
        },
        water: { status: "Optimal Turgor Pressure detected." },
        missionLog: userPrompt 
          ? `Me-Lap Hypothesis: Regarding "${userPrompt}"—analysis indicates standard terrestrial behavior with 94% efficiency.`
          : "Specimen is highly viable for the Mars Alpha Dome.",
        interestPoint: {
          x: 45, y: 35, 
          label: "Active Stomata", 
          explanation: "Specific leaf region where gas exchange and cooling occur via transpiration."
        }
      });
    }, 1500);
  });
};

export const mockSpaceAnalysis = (): Promise<SpaceAnalysis> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        summary: "Atmospheric mapping complete. Identified several anomalies.",
        hotSpots: [
          { x: 30, y: 40, label: "VOC Concentration", severity: 4, reasoning: "Stagnant airflow detected. Carbon dioxide is pooling.", recommendedPlant: "Snake Plant Protocol" },
          { x: 70, y: 60, label: "Photon-Deficiency Corridor", severity: 3, reasoning: "PAR levels are below minimal thresholds.", recommendedPlant: "Cast Iron Plant" },
        ]
      });
    }, 1500);
  });
};