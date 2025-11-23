import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  RoundedBox, 
  Environment, 
  ContactShadows, 
  Float,
  Stars,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';

// Individual block/cube in the tower
function Block({ position, color, isNew, isTranslucent }) {
  const meshRef = useRef();
  const [scale, setScale] = useState(isNew ? 0.1 : 1);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (isNew) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.05;
        if (progress >= 1) {
          setScale(1);
          clearInterval(interval);
        } else {
          setScale(progress * progress * (3 - 2 * progress));
        }
      }, 16);
      return () => clearInterval(interval);
    }
  }, [isNew]);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    } else if (meshRef.current) {
      // Return to original position smoothly
      meshRef.current.rotation.y *= 0.9;
      meshRef.current.position.y += (position[1] - meshRef.current.position.y) * 0.1;
    }
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[0.8, 0.4, 0.8]} // Width, Height, Depth
        radius={0.01} // Radius of the rounded corners
        smoothness={4} // Number of segments (smoothness)
        scale={[scale, scale, scale]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={color}
          transparent={isTranslucent}
          opacity={isTranslucent ? 0.4 : 1}
          roughness={0.2}
          metalness={0.1}
          emissive={color}
          emissiveIntensity={isTranslucent ? 0.2 : 0}
        />
      </RoundedBox>
      {/* Add a subtle glow/rim light effect for active blocks */}
      {/* Removed per-block light to prevent flickering/performance issues */}
    </group>
  );
}

// Single tower for a habit
function HabitTower({ streak, color, position, isCheckedToday, habitName }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  const blocks = useMemo(() => {
    const b = [];
    const blockCount = streak;

    for (let i = 0; i < blockCount; i++) {
      b.push(
        <Block
          key={i}
          position={[0, i * 0.21 + 0.2, 0]}
          color={color}
          isNew={false}
          isTranslucent={false}
        />
      );
    }

    // Show translucent block if not checked today
    if (!isCheckedToday) {
      b.push(
        <Block
          key="next"
          position={[0, blockCount * 0.35 + 0.2, 0]}
          color={color}
          isNew={false}
          isTranslucent={true}
        />
      );
    }
    return b;
  }, [streak, color, isCheckedToday]);

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {blocks}

      {/* Streak number floating above */}
      <group position={[0, (streak + (isCheckedToday ? 0 : 1)) * 0.4 + 1, 0]}>
        <Text
          fontSize={0.4}
          color="#333"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#fff"
        >
          {streak}
        </Text>
        {hovered && (
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.25}
            color="#666"
            anchorX="center"
            anchorY="middle"
          >
            {habitName}
          </Text>
        )}
      </group>

      {/* Floor glow for this tower */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.4, 0.6, 32]} />
        <meshBasicMaterial color={color} opacity={0.2} transparent />
      </mesh>
    </group>
  );
}

// Main Tower Scene
export function TowerScene({ habits, getStreak, isCheckedToday }) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-50 to-gray-100">
      <Canvas shadows camera={{ position: [0, 0.5, 11], fov: 45 }}>
        <fog attach="fog" args={['#f9fafb', 20, 80]} />
        
        {/* Environment & Lighting */}
        <Environment preset="city" />
        <ambientLight intensity={0.4} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        
        {/* Background Elements */}
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={50} scale={12} size={2} speed={0.4} opacity={0.1} color="#3b82f6" />

        {/* Towers for each habit */}
        <group position={[0, -1, 0]}>
          {habits.map((habit, index) => {
            // Center the towers
            const spacing = 2.5;
            const totalWidth = (habits.length - 1) * spacing;
            const xPosition = (index * spacing) - (totalWidth / 2);
            
            const streak = getStreak(habit.id);
            const checked = isCheckedToday(habit.id);

            return (
              <HabitTower
                key={habit.id}
                habitName={habit.name}
                streak={streak}
                color={habit.color}
                position={[xPosition, 0, 0]}
                isCheckedToday={checked}
              />
            );
          })}
        </group>

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.01, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={2}
          maxDistance={50}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          target={[0, 3, 0]}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

