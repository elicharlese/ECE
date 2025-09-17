'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface CameraProps {
  position?: [number, number, number];
  fov?: number;
  near?: number;
  far?: number;
  enableAutoRotate?: boolean;
  autoRotateSpeed?: number;
  target?: [number, number, number];
}

export function Camera({
  position = [0, 0, 5],
  fov = 60,
  near = 0.1,
  far = 1000,
  enableAutoRotate = false,
  autoRotateSpeed = 0.5,
  target = [0, 0, 0]
}: CameraProps) {
  // Relax ref typing to avoid mismatched @types/three versions across workspace during type-check
  const cameraRef = useRef<any>(null);
  const { viewport } = useThree();
  
  // Auto-rotate camera around the scene
  useFrame((state, delta) => {
    if (enableAutoRotate && cameraRef.current) {
      const camera = cameraRef.current;
      const radius = Math.sqrt(position[0] ** 2 + position[2] ** 2);
      const angle = state.clock.elapsedTime * autoRotateSpeed;
      
      camera.position.x = Math.cos(angle) * radius;
      camera.position.z = Math.sin(angle) * radius;
      camera.lookAt(new THREE.Vector3(...target));
    }
  });

  // Responsive camera positioning
  const responsivePosition: [number, number, number] = [
    position[0] * (viewport.width > viewport.height ? 1 : 1.2),
    position[1],
    position[2] * (viewport.width > viewport.height ? 1 : 1.5)
  ];

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={responsivePosition}
      fov={fov}
      near={near}
      far={far}
      aspect={viewport.width / viewport.height}
    />
  );
}
