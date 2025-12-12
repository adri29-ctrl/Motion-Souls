import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Stars, ContactShadows } from '@react-three/drei';
import Avatar from './Avatar';
import { Emotion } from '../types';

interface SceneProps {
  emotion: Emotion;
  isThinking: boolean;
  isSpeaking: boolean;
}

const Scene: React.FC<SceneProps> = ({ emotion, isThinking, isSpeaking }) => {
  return (
    <div className="w-full h-full absolute inset-0 -z-10 bg-gradient-to-b from-gray-900 to-black">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color={isThinking ? "blue" : "white"} />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <Avatar emotion={emotion} isThinking={isThinking} isSpeaking={isSpeaking} />
          
          <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.5} far={10} color="#000000" />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            minPolarAngle={Math.PI / 2.5} 
            maxPolarAngle={Math.PI / 1.8}
            autoRotate={isThinking}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene;