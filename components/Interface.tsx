import React, { useEffect, useRef } from 'react';
import { Message, Emotion, MemoryCore } from '../types';
import WebcamFeed from './WebcamFeed';
import { Activity, BrainCircuit, MessageSquare, Mic, Send, Terminal, Zap, Cpu } from 'lucide-react';
import { EMOTION_COLORS } from '../constants';

interface InterfaceProps {
  messages: Message[];
  currentEmotion: Emotion;
  isThinking: boolean;
  thoughtProcess: string;
  memory: MemoryCore;
  onSendMessage: (text: string) => void;
}

const Interface: React.FC<InterfaceProps> = ({ 
  messages, 
  currentEmotion, 
  isThinking, 
  thoughtProcess, 
  memory,
  onSendMessage 
}) => {
  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thoughtProcess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isThinking) {
      onSendMessage(input);
      setInput('');
    }
  };

  const currentColor = EMOTION_COLORS[currentEmotion];

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6 pointer-events-none">
      
      {/* HEADER HUD */}
      <div className="flex justify-between items-start w-full pointer-events-auto">
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-4xl font-display font-bold text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              MOTION SOULS
            </h1>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              OPEN SOULS FRAMEWORK: ACTIVE
            </div>
          </div>

          {/* RESTORED INITIAL ASCII LOGO (Placed below title, No Text, Larger Size) */}
          <div className="hidden md:block p-4 border border-slate-700 bg-black/80 rounded-lg text-cyan-400 font-mono-tech text-sm leading-4 whitespace-pre opacity-90 shadow-[0_0_25px_rgba(34,211,238,0.2)] hover:bg-black hover:text-cyan-300 transition-all cursor-default select-none transform hover:scale-105 duration-300">
{`   /===\\
  | . . |
 <| (O) |>
  | . . |
   \\===/`}
          </div>
        </div>

        {/* TRACKING MODULE */}
        <div className="hidden md:block w-48 h-32 border border-slate-700 bg-black/40 backdrop-blur-sm rounded-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-4 bg-slate-900/80 z-20 flex items-center px-2 border-b border-slate-700">
                <span className="text-[9px] text-slate-400 font-mono-tech">VISUAL INPUT FEED</span>
            </div>
            <div className="w-full h-full pt-4">
                 <WebcamFeed />
            </div>
        </div>
      </div>

      {/* CENTER - 3D Viewport is behind this, so we leave it empty */}
      
      {/* MAIN CONTROL DECK */}
      <div className="flex flex-col md:flex-row gap-4 h-1/2 md:h-1/3 w-full pointer-events-auto mt-auto">
        
        {/* LEFT PANEL: SYSTEM STATUS & MEMORY */}
        <div className="hidden md:flex flex-col w-1/4 bg-black/60 backdrop-blur-md border-l-2 border-slate-700 p-4 gap-4 rounded-r-xl overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 text-cyan-400 border-b border-slate-800 pb-2">
            <Cpu size={16} />
            <h3 className="font-display text-sm font-bold tracking-wider">SOUL STATE MONITOR</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto font-mono-tech text-xs text-slate-300 space-y-2 pr-2">
             <div className="flex justify-between">
                <span className="text-slate-500">COGNITION</span>
                <span className={isThinking ? "text-yellow-400 animate-pulse" : "text-green-400"}>
                    {isThinking ? "PROCESSING..." : "LISTENING"}
                </span>
             </div>
             <div className="flex justify-between">
                <span className="text-slate-500">AFFECT</span>
                <span style={{ color: currentColor }}>{currentEmotion.toUpperCase()}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-slate-500">MEMORY_NODES</span>
                <span>{memory.shortTerm.length}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-slate-500">CYCLE_COUNT</span>
                <span>{memory.interactionsCount}</span>
             </div>

             <div className="mt-4 border-t border-slate-800 pt-2">
                <div className="text-slate-500 mb-1">BLUEPRINT LOG:</div>
                <p className="text-slate-400 italic opacity-80 leading-relaxed font-light">
                   {thoughtProcess ? `> ${thoughtProcess}` : "> Waiting for external stimulus..."}
                </p>
             </div>
          </div>
        </div>

        {/* MIDDLE SECTION WRAPPER */}
        <div className="flex-1 flex flex-col relative">
            
            {/* CHAT INTERFACE */}
            <div className="flex-1 flex flex-col bg-black/60 backdrop-blur-md border-x-2 border-slate-700 md:rounded-t-xl overflow-hidden shadow-2xl relative">
                
                {/* Header decor */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans scroll-smooth">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
                            <BrainCircuit size={48} className="mb-2" />
                            <p className="font-mono-tech text-sm">INITIALIZE MOTION SOUL</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                        >
                            <div className={`px-4 py-2 rounded-lg backdrop-blur-sm text-sm md:text-base shadow-lg ${
                                msg.role === 'user' 
                                ? 'bg-slate-800/80 text-white border border-slate-600 rounded-br-none' 
                                : 'bg-cyan-950/40 text-cyan-100 border border-cyan-800 rounded-bl-none'
                            }`}>
                                {msg.content}
                            </div>
                            {msg.role === 'model' && msg.metadata?.emotion && (
                                <span className="text-[10px] font-mono-tech text-slate-500 mt-1 uppercase tracking-wider flex items-center gap-1">
                                    <Activity size={10} />
                                    {msg.metadata.emotion}
                                </span>
                            )}
                        </div>
                    ))}
                    {isThinking && (
                        <div className="mr-auto flex items-center gap-2 text-cyan-500 text-xs font-mono-tech animate-pulse p-2">
                            <Terminal size={14} />
                            <span>COMPUTING RESPONSE...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="p-3 bg-black/80 border-t border-slate-700 flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isThinking ? "Soul is thinking..." : "Communicate with Motion Soul..."}
                            disabled={isThinking}
                            className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-md py-3 pl-4 pr-10 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono-tech transition-all disabled:opacity-50 placeholder:text-slate-600"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                            <Zap size={14} className={isThinking ? "text-yellow-500 animate-spin" : ""} />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isThinking}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>

        {/* RIGHT PANEL: EMOTION GRAPH (Visual Only) */}
        <div className="hidden md:flex flex-col w-1/4 bg-black/60 backdrop-blur-md border-r-2 border-slate-700 p-4 rounded-l-xl shadow-2xl justify-end">
            <h3 className="font-display text-sm font-bold tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Activity size={16} />
                EMOTIONAL RESONANCE
            </h3>
            <div className="flex flex-col gap-3 font-mono-tech text-xs">
                {Object.values(Emotion).filter(e => e !== Emotion.THINKING).map((emotionName) => {
                    const isActive = currentEmotion === emotionName;
                    const color = EMOTION_COLORS[emotionName];
                    return (
                        <div key={emotionName} className="flex items-center gap-2">
                            <span className={`w-16 text-right ${isActive ? 'text-white font-bold' : 'text-slate-600'}`}>
                                {emotionName}
                            </span>
                            <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div 
                                    className="h-full transition-all duration-500 ease-out"
                                    style={{ 
                                        width: isActive ? '90%' : '10%', 
                                        backgroundColor: isActive ? color : '#1e293b'
                                    }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
            
            {/* Live Audio Visualizer Fake */}
            <div className="mt-8 h-16 flex items-end justify-between gap-1 opacity-70">
                 {[...Array(20)].map((_, i) => (
                    <div 
                        key={i} 
                        className="w-1 bg-cyan-500/50 rounded-t-sm transition-all duration-100"
                        style={{ 
                            height: `${Math.random() * 100}%`,
                            opacity: isThinking ? 0.3 : 0.8
                        }}
                    ></div>
                 ))}
            </div>
            <div className="text-[10px] text-center text-slate-500 mt-1 font-mono-tech">AUDIO SYNTHESIS STREAM</div>
        </div>

      </div>
    </div>
  );
};

export default Interface;