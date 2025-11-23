import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// Individual block/cube in the tower
function Block({ position, color, isNew, isTranslucent }) {
  const meshRef = useRef();
  const [scale, setScale] = useState(isNew ? 0.1 : 1);

  useEffect(() => {
    if (isNew) {
      // Animate block dropping in
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.05;
        if (progress >= 1) {
          setScale(1);
          clearInterval(interval);
        } else {
          // Ease out animation
          setScale(progress * progress * (3 - 2 * progress));
        }
      }, 16);
      return () => clearInterval(interval);
    }
  }, [isNew]);

  return (
    <mesh ref={meshRef} position={position} scale={[scale, scale, scale]}>
      <boxGeometry args={[0.8, 0.4, 0.8]} />
      <meshStandardMaterial
        color={color}
        transparent={isTranslucent}
        opacity={isTranslucent ? 0.3 : 1}
        wireframe={isTranslucent}
      />
    </mesh>
  );
}

// Confetti particles for celebration
function ConfettiParticles({ show, color }) {
  const particlesRef = useRef();
  const [particles] = useState(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 2,
          Math.random() * 2,
          (Math.random() - 0.5) * 2,
        ],
        velocity: [
          (Math.random() - 0.5) * 0.1,
          Math.random() * 0.2,
          (Math.random() - 0.5) * 0.1,
        ],
      });
    }
    return temp;
  });

  useFrame(() => {
    if (show && particlesRef.current) {
      particlesRef.current.rotation.y += 0.02;
    }
  });

  if (!show) return null;

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// Single tower for a habit
function HabitTower({ streak, color, position, isCheckedToday, showConfetti, onHover }) {
  const groupRef = useRef();
  const [wobble, setWobble] = useState(0);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle idle animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;

      // Wobble effect
      if (wobble > 0) {
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * wobble;
        setWobble(wobble * 0.95); // Decay
      }
    }
  });

  const blocks = [];
  const blockCount = streak;

  for (let i = 0; i < blockCount; i++) {
    blocks.push(
      <Block
        key={i}
        position={[0, i * 0.45, 0]}
        color={color}
        isNew={false}
        isTranslucent={false}
      />
    );
  }

  // Show translucent block if not checked today
  if (!isCheckedToday && streak > 0) {
    blocks.push(
      <Block
        key="next"
        position={[0, blockCount * 0.45, 0]}
        color={color}
        isNew={false}
        isTranslucent={true}
      />
    );
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={() => {
        setWobble(0.1);
        onHover?.(true);
      }}
      onPointerLeave={() => onHover?.(false)}
    >
      {blocks}

      {/* Streak number floating above */}
      {streak > 0 && (
        <Text
          position={[0, blockCount * 0.45 + 0.8, 0]}
          fontSize={0.5}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {streak}
        </Text>
      )}

      {/* Confetti effect */}
      <ConfettiParticles show={showConfetti} color={color} />
    </group>
  );
}

// Main Tower Scene
export function TowerScene({ habits, getStreak, isCheckedToday }) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, 5, -5]} intensity={0.3} color="#10b981" />

        {/* Towers for each habit */}
        {habits.map((habit, index) => {
          const xPosition = (index - (habits.length - 1) / 2) * 2;
          const streak = getStreak(habit.id);
          const checked = isCheckedToday(habit.id);

          return (
            <HabitTower
              key={habit.id}
              streak={streak}
              color={habit.color}
              position={[xPosition, 0, 0]}
              isCheckedToday={checked}
              showConfetti={false}
            />
          );
        })}

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>

        {/* Camera controls */}
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  );
}
