import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SYSTEM_INSTRUCTION, GEMINI_MODEL } from '../constants';
import { SoulResponse, Emotion } from '../types';

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client && process.env.API_KEY) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

// Defined schema for strictly structured output
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    emotion: {
      type: Type.STRING,
      enum: [Emotion.NEUTRAL, Emotion.JOY, Emotion.SADNESS, Emotion.ANGER, Emotion.SURPRISE],
      description: "The emotional state of the character based on the interaction."
    },
    thought_process: {
      type: Type.STRING,
      description: "Internal reasoning or memory access logs."
    },
    response: {
      type: Type.STRING,
      description: "The verbal response to the user."
    }
  },
  required: ["emotion", "thought_process", "response"]
};

export const generateSoulResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  userInput: string
): Promise<SoulResponse> => {
  const ai = getClient();
  if (!ai) throw new Error("API Key not found");

  try {
    const chat = ai.chats.create({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: userInput });
    const text = result.text;
    
    if (!text) throw new Error("Empty response from Soul Engine");

    const parsed = JSON.parse(text) as SoulResponse;
    return parsed;
  } catch (error) {
    console.error("Soul Engine Error:", error);
    // Fallback response to keep the app alive
    return {
      emotion: Emotion.NEUTRAL,
      thought_process: "ERR: CONNECTION_LOST. RECALIBRATING...",
      response: "I'm having trouble connecting to my core processes right now."
    };
  }
};