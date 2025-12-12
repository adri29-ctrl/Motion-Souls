import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, ScanFace, RefreshCw } from 'lucide-react';

const WebcamFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    setError(null);
    try {
      // Use generic video constraints to avoid OverconstrainedError on some devices
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true // Request any video stream, don't force resolution
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Explicitly play to ensure it starts
        await videoRef.current.play();
        setHasPermission(true);
      }
    } catch (err) {
      console.warn("Camera initialization failed", err);
      setError("SIGNAL_LOSS");
      setHasPermission(false);
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      // Cleanup stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black/80 rounded-lg overflow-hidden border border-slate-700 shadow-lg group">
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        <span className="flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full ${hasPermission ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${hasPermission ? 'bg-green-500' : 'bg-red-500'}`}></span>
        </span>
        <span className="text-[10px] font-mono-tech text-slate-300 uppercase tracking-wider">
            {hasPermission ? 'OPTICAL SENSORS ONLINE' : 'VISUAL LINK OFFLINE'}
        </span>
      </div>

      {/* Video Element - Always rendered */}
      <video 
          ref={videoRef} 
          muted 
          playsInline 
          className={`w-full h-full object-cover grayscale contrast-125 transition-opacity duration-700 ${hasPermission ? 'opacity-60' : 'opacity-0'}`}
      />

      {/* Active State Overlay */}
      {hasPermission && (
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <ScanFace className="w-16 h-16 text-cyan-400 animate-pulse" />
            <div className="absolute top-1/4 left-1/4 w-4 h-4 border-l-2 border-t-2 border-cyan-500"></div>
            <div className="absolute top-1/4 right-1/4 w-4 h-4 border-r-2 border-t-2 border-cyan-500"></div>
            <div className="absolute bottom-1/4 left-1/4 w-4 h-4 border-l-2 border-b-2 border-cyan-500"></div>
            <div className="absolute bottom-1/4 right-1/4 w-4 h-4 border-r-2 border-b-2 border-cyan-500"></div>
        </div>
      )}

      {/* Loading / Error State Overlay */}
      {!hasPermission && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 bg-black/90 z-0">
            {error ? (
                <button onClick={startCamera} className="flex flex-col items-center hover:text-cyan-400 transition-colors cursor-pointer">
                    <RefreshCw className="w-8 h-8 mb-2" />
                    <span className="text-xs font-mono-tech">RETRY CONNECTION</span>
                </button>
            ) : (
                <div className="flex flex-col items-center">
                    <Camera className="w-8 h-8 mb-2 animate-pulse" />
                    <span className="text-xs font-mono-tech">INITIALIZING...</span>
                </div>
            )}
        </div>
      )}
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,180,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,180,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
    </div>
  );
};

export default WebcamFeed;