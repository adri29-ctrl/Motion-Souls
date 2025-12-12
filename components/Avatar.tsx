import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Torus, Cylinder, Octahedron } from '@react-three/drei';
import * as THREE from 'three';
import { Emotion } from '../types';
import { EMOTION_COLORS } from '../constants';

interface AvatarProps {
  emotion: Emotion;
  isThinking: boolean;
  isSpeaking: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ emotion, isThinking, isSpeaking }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  
  // Target color based on emotion
  const targetColor = new THREE.Color(EMOTION_COLORS[emotion]);
  const currentColor = useRef(new THREE.Color(EMOTION_COLORS[Emotion.NEUTRAL]));

  useFrame((state, delta) => {
    if (!groupRef.current || !coreRef.current) return;

    const t = state.clock.getElapsedTime();

    // Color Lerp
    currentColor.current.lerp(targetColor, 0.05);
    (coreRef.current.material as THREE.MeshStandardMaterial).color = currentColor.current;
    (coreRef.current.material as THREE.MeshStandardMaterial).emissive = currentColor.current;

    // Idle Float
    groupRef.current.position.y = Math.sin(t * 1) * 0.1;

    // Core pulsing
    const pulseSpeed = isThinking ? 10 : (emotion === Emotion.ANGER ? 8 : 2);
    const pulseScale = 1 + Math.sin(t * pulseSpeed) * 0.02;
    coreRef.current.scale.set(pulseScale, pulseScale, pulseScale);

    // Ring rotations
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.5;
      ring1Ref.current.rotation.y = t * 0.3;
      // Expand rings when angry or surprised
      const ringScale = emotion === Emotion.ANGER || emotion === Emotion.SURPRISE ? 1.2 : 1;
      ring1Ref.current.scale.lerp(new THREE.Vector3(ringScale, ringScale, ringScale), 0.1);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = t * 0.4 + Math.PI / 2;
      ring2Ref.current.rotation.z = t * 0.6;
    }

    // Eye behavior
    if (eyeLeftRef.current && eyeRightRef.current) {
      // Blink
      const blink = Math.sin(t * 3) > 0.98 && !isThinking;
      const eyeScaleY = blink ? 0.1 : 1;
      
      // Emotion adjustments
      let eyeRotZ = 0;
      if (emotion === Emotion.ANGER) eyeRotZ = -0.4;
      if (emotion === Emotion.SADNESS) eyeRotZ = 0.4;

      eyeLeftRef.current.scale.y = THREE.MathUtils.lerp(eyeLeftRef.current.scale.y, eyeScaleY, 0.2);
      eyeRightRef.current.scale.y = THREE.MathUtils.lerp(eyeRightRef.current.scale.y, eyeScaleY, 0.2);
      
      eyeLeftRef.current.rotation.z = THREE.MathUtils.lerp(eyeLeftRef.current.rotation.z, eyeRotZ, 0.1);
      eyeRightRef.current.rotation.z = THREE.MathUtils.lerp(eyeRightRef.current.rotation.z, -eyeRotZ, 0.1);
    }

    // Speaking simulation (jitter)
    if (isSpeaking) {
       groupRef.current.position.y += Math.sin(t * 20) * 0.01;
       if (coreRef.current) {
         coreRef.current.scale.y = 1 + Math.sin(t * 15) * 0.1;
       }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Core (The Soul) */}
      <Sphere ref={coreRef} args={[0.8, 32, 32]}>
        <meshStandardMaterial
          roughness={0.2}
          metalness={0.8}
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* Eyes */}
      <group position={[0, 0.2, 0.65]}>
        <Cylinder ref={eyeLeftRef} position={[-0.3, 0, 0]} args={[0.08, 0.08, 0.05, 16]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="black" />
        </Cylinder>
        <Cylinder ref={eyeRightRef} position={[0.3, 0, 0]} args={[0.08, 0.08, 0.05, 16]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="black" />
        </Cylinder>
      </group>

      {/* Orbiting Data Rings */}
      <Torus ref={ring1Ref} args={[1.3, 0.02, 16, 100]}>
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.3} />
      </Torus>
      <Torus ref={ring2Ref} args={[1.6, 0.02, 16, 100]}>
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.2} />
      </Torus>
      
      {/* Floating Bits */}
      <Octahedron position={[1.5, 1, -1]} args={[0.2]}>
        <meshStandardMaterial wireframe color="#475569" />
      </Octahedron>
    </group>
  );
};

export default Avatar;