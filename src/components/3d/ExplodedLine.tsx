import React, { useMemo } from 'react';
import * as THREE from 'three';

interface ExplodedLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  active?: boolean;
}

export const ExplodedLine: React.FC<ExplodedLineProps> = ({
  start,
  end,
  color = '#06b6d4',
  active = false
}) => {
  const points = useMemo(() => {
    const p1 = new THREE.Vector3(...start);
    const p2 = new THREE.Vector3(...end);
    // Add elbow waypoint for clean technical drafting look
    const pMid = new THREE.Vector3(start[0], end[1], start[2]);
    return [p1, pMid, p2];
  }, [start, end]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <group>
      {/* Technical leader line */}
      {/* @ts-expect-error Three line primitive */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color={active ? '#38bdf8' : color}
          transparent
          opacity={active ? 0.95 : 0.45}
          linewidth={active ? 2 : 1}
        />
      </line>

      {/* Start anchor ring on the 3D part */}
      <mesh position={start}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={active ? '#38bdf8' : color} />
      </mesh>

      {/* End terminal point near the label */}
      <mesh position={end}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color={active ? '#38bdf8' : color} />
      </mesh>
    </group>
  );
};
