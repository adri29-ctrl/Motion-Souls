import React, { useState, useEffect, useCallback } from 'react';
import Scene from './components/Scene';
import Interface from './components/Interface';
import { generateSoulResponse } from './services/geminiService';
import { Message, Emotion, MemoryCore } from './types';
import { EMOTION_COLORS } from './constants';

const App: React.FC = () => {
  // --- State ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>(Emotion.NEUTRAL);
  const [thoughtProcess, setThoughtProcess] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [memory, setMemory] = useState<MemoryCore>({
    shortTerm: [],
    lastEmotion: Emotion.NEUTRAL,
    interactionsCount: 0
  });

  // --- TTS Handling ---
  const speak = useCallback((text: string, emotion: Emotion) => {
    if (!window.speechSynthesis) return;
    
    // Cancel previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English')) || 
                           voices.find(v => v.name.includes('Samantha')) ||
                           voices[0];
    
    if (preferredVoice) utterance.voice = preferredVoice;

    // Adjust parameters based on emotion
    switch(emotion) {
      case Emotion.JOY:
        utterance.pitch = 1.2;
        utterance.rate = 1.1;
        break;
      case Emotion.SADNESS:
        utterance.pitch = 0.8;
        utterance.rate = 0.8;
        break;
      case Emotion.ANGER:
        utterance.pitch = 0.9;
        utterance.rate = 1.2;
        break;
      case Emotion.SURPRISE:
        utterance.pitch = 1.3;
        utterance.rate = 1.1;
        break;
      default:
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // --- Gemini Interaction ---
  const handleSendMessage = async (text: string) => {
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsThinking(true);
    setCurrentEmotion(Emotion.THINKING);

    // Prepare history for API
    const historyForApi = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    try {
      const soulData = await generateSoulResponse(historyForApi, text);

      const newModelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: soulData.response,
        timestamp: Date.now(),
        metadata: {
          emotion: soulData.emotion,
          thought: soulData.thought_process
        }
      };

      setMessages(prev => [...prev, newModelMsg]);
      setCurrentEmotion(soulData.emotion);
      setThoughtProcess(soulData.thought_process);
      
      // Update Memory
      setMemory(prev => ({
        shortTerm: [...prev.shortTerm.slice(-4), text, soulData.response], // Keep last 5
        lastEmotion: soulData.emotion,
        interactionsCount: prev.interactionsCount + 1
      }));

      // Trigger TTS
      speak(soulData.response, soulData.emotion);

    } catch (error) {
      console.error("Interaction failed", error);
    } finally {
      setIsThinking(false);
    }
  };

  // Pre-load voices
  useEffect(() => {
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
    }
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-950">
      
      {/* 3D Scene Background */}
      <Scene 
        emotion={currentEmotion} 
        isThinking={isThinking} 
        isSpeaking={isSpeaking} 
      />

      {/* Grid Overlay for aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Main UI */}
      <Interface 
        messages={messages}
        currentEmotion={currentEmotion}
        isThinking={isThinking}
        thoughtProcess={thoughtProcess}
        memory={memory}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default App;