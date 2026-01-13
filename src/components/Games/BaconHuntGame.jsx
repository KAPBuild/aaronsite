import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { playPopSound, playWinSound, playClickSound } from '../../utils/sounds';
import confetti from 'canvas-confetti';
import * as THREE from 'three';

// Game state manager
const gameStateRef = {
  player: { x: 0, y: 0.075, z: 0, sizeScale: 1 },
  gummyBears: [],
  chocolates: [],
  bosses: [],
  bossesDefeated: 0,
  bigBoss: null,
  chocolatesCollected: 0,
  keys: {},
  score: 0,
};

// Reset game state
const resetGameState = () => {
  gameStateRef.player = { x: 0, y: 0.075, z: 0, sizeScale: 1 };
  gameStateRef.gummyBears = [];
  gameStateRef.chocolates = [];
  gameStateRef.bosses = [
    { id: 1, x: -2.5, y: 0.125, z: -1.5, health: 5, maxHealth: 5, vx: 0.02, vz: 0.01 },
    { id: 2, x: 3, y: 0.125, z: 1.5, health: 5, maxHealth: 5, vx: -0.02, vz: -0.015 },
  ];
  gameStateRef.bossesDefeated = 0;
  gameStateRef.bigBoss = null;
  gameStateRef.chocolatesCollected = 0;
  gameStateRef.score = 0;

  // Spawn initial gummy bears
  for (let i = 0; i < 8; i++) {
    gameStateRef.gummyBears.push({
      id: i,
      x: (Math.random() - 0.5) * 7,
      y: 0.08,
      z: (Math.random() - 0.5) * 5,
    });
  }

  // Spawn initial rare chocolates (2-3 at start)
  for (let i = 0; i < 3; i++) {
    gameStateRef.chocolates.push({
      id: i,
      x: (Math.random() - 0.5) * 7,
      y: 0.12,
      z: (Math.random() - 0.5) * 5,
    });
  }
};

resetGameState();

// Player mesh component
function Player({ playerRef }) {
  const scale = gameStateRef.player.sizeScale;

  return (
    <group ref={playerRef} position={[gameStateRef.player.x, gameStateRef.player.y, gameStateRef.player.z]} scale={scale}>
      {/* Bacon body - tall strip */}
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.35, 0.12]} />
        <meshStandardMaterial color="#D2691E" metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Bacon stripes on body */}
      <mesh position={[-0.04, -0.08, 0.06]} castShadow>
        <boxGeometry args={[0.05, 0.25, 0.02]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0.04, 0.0, 0.06]} castShadow>
        <boxGeometry args={[0.05, 0.25, 0.02]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Bacon head - separate */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.18, 0.18, 0.14]} />
        <meshStandardMaterial color="#C85A17" metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Head stripe */}
      <mesh position={[0, 0.25, 0.07]} castShadow>
        <boxGeometry args={[0.15, 0.08, 0.02]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Left eye white */}
      <mesh position={[-0.06, 0.3, 0.08]} castShadow>
        <boxGeometry args={[0.05, 0.06, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      {/* Right eye white */}
      <mesh position={[0.06, 0.3, 0.08]} castShadow>
        <boxGeometry args={[0.05, 0.06, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Left pupil */}
      <mesh position={[-0.06, 0.3, 0.085]} castShadow>
        <boxGeometry args={[0.02, 0.03, 0.01]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Right pupil */}
      <mesh position={[0.06, 0.3, 0.085]} castShadow>
        <boxGeometry args={[0.02, 0.03, 0.01]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Snout/nose */}
      <mesh position={[0, 0.2, 0.08]} castShadow>
        <boxGeometry args={[0.04, 0.04, 0.01]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
    </group>
  );
}

// Gummy bear component
function GummyBear({ bear, onCollect, speed }) {
  const meshRef = useRef();
  const colors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FF00FF', '#FF4500'];
  const color = colors[Math.floor(bear.id * 12345) % colors.length];

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(bear.x, bear.y, bear.z);
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[bear.x, bear.y, bear.z]}
      castShadow
      receiveShadow
      userData={{ type: 'gummy', bear }}
    >
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
    </mesh>
  );
}

// Rare chocolate component
function Chocolate({ chocolate }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(chocolate.x, chocolate.y, chocolate.z);
      meshRef.current.rotation.x += 0.02;
      meshRef.current.rotation.y += 0.03;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[chocolate.x, chocolate.y, chocolate.z]}
      castShadow
      receiveShadow
      userData={{ type: 'chocolate', chocolate }}
    >
      <boxGeometry args={[0.12, 0.08, 0.06]} />
      <meshStandardMaterial color="#6B4423" metalness={0.3} roughness={0.7} />
    </mesh>
  );
}

// Boss component
function Boss({ boss, onDamage, speed }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(boss.x, boss.y, boss.z);
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef} position={[boss.x, boss.y, boss.z]} userData={{ type: 'boss', boss }}>
      {/* Boss body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.25, 0.25]} />
        <meshStandardMaterial color="#FF6347" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Left eye white */}
      <mesh position={[-0.05, 0.05, 0.12]} castShadow>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      {/* Right eye white */}
      <mesh position={[0.05, 0.05, 0.12]} castShadow>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      {/* Left pupil */}
      <mesh position={[-0.05, 0.05, 0.13]} castShadow>
        <boxGeometry args={[0.02, 0.02, 0.01]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Right pupil */}
      <mesh position={[0.05, 0.05, 0.13]} castShadow>
        <boxGeometry args={[0.02, 0.02, 0.01]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}

// Big Boss component (appears after defeating 2 regular bosses)
function BigBoss({ boss }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(boss.x, boss.y, boss.z);
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef} position={[boss.x, boss.y, boss.z]} userData={{ type: 'bigBoss', boss }}>
      {/* Big Boss body - MUCH LARGER */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#8B0000" metalness={0.3} roughness={0.6} emissive="#FF0000" emissiveIntensity={0.2} />
      </mesh>
      {/* Left eye white */}
      <mesh position={[-0.12, 0.1, 0.26]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      {/* Right eye white */}
      <mesh position={[0.12, 0.1, 0.26]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      {/* Left pupil */}
      <mesh position={[-0.12, 0.1, 0.27]} castShadow>
        <boxGeometry args={[0.04, 0.04, 0.01]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Right pupil */}
      <mesh position={[0.12, 0.1, 0.27]} castShadow>
        <boxGeometry args={[0.04, 0.04, 0.01]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Angry mouth */}
      <mesh position={[0, -0.1, 0.26]} castShadow>
        <boxGeometry args={[0.2, 0.08, 0.02]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}

// Game scene logic
function GameScene({ gameState, setGameState, setScore, isPlaying }) {
  const playerRef = useRef();
  const { camera } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mousePos = useRef(new THREE.Vector2());

  // Game loop
  useFrame(() => {
    if (gameState !== 'playing') return;

    const speed = 0.08;
    const state = gameStateRef;

    // Player movement
    if (state.keys['w'] || state.keys['arrowup']) state.player.z -= speed;
    if (state.keys['s'] || state.keys['arrowdown']) state.player.z += speed;
    if (state.keys['a'] || state.keys['arrowleft']) state.player.x -= speed;
    if (state.keys['d'] || state.keys['arrowright']) state.player.x += speed;

    // Boundary checking
    state.player.x = Math.max(-3.9, Math.min(3.9, state.player.x));
    state.player.z = Math.max(-2.9, Math.min(2.9, state.player.z));

    // Update player mesh
    if (playerRef.current) {
      playerRef.current.position.set(state.player.x, state.player.y, state.player.z);
    }

    // Boss movement
    state.bosses.forEach((boss) => {
      boss.x += boss.vx;
      boss.z += boss.vz;

      if (boss.x <= -3.8 || boss.x >= 3.8) boss.vx *= -1;
      if (boss.z <= -2.8 || boss.z >= 2.8) boss.vz *= -1;
    });

    // Collision with gummy bears
    for (let i = state.gummyBears.length - 1; i >= 0; i--) {
      const gummy = state.gummyBears[i];
      const dist = Math.hypot(
        state.player.x - gummy.x,
        state.player.z - gummy.z
      );

      if (dist < 0.15) {
        playPopSound();
        state.score += 10;
        setScore(state.score);
        state.gummyBears.splice(i, 1);
      }
    }

    // Spawn more gummy bears
    if (state.gummyBears.length < 4) {
      state.gummyBears.push({
        id: Math.random(),
        x: (Math.random() - 0.5) * 7,
        y: 0.08,
        z: (Math.random() - 0.5) * 5,
      });
    }

    // Collision with rare chocolates
    for (let i = state.chocolates.length - 1; i >= 0; i--) {
      const chocolate = state.chocolates[i];
      const dist = Math.hypot(
        state.player.x - chocolate.x,
        state.player.z - chocolate.z
      );

      if (dist < 0.2) {
        playWinSound();
        state.player.sizeScale += 0.4;
        state.chocolatesCollected++;
        state.score += 50;
        setScore(state.score);
        state.chocolates.splice(i, 1);

        // Spawn a new chocolate at random location
        state.chocolates.push({
          id: Math.random(),
          x: (Math.random() - 0.5) * 7,
          y: 0.12,
          z: (Math.random() - 0.5) * 5,
        });
      }
    }

    // Collision with bosses
    for (let i = state.bosses.length - 1; i >= 0; i--) {
      const boss = state.bosses[i];
      const dist = Math.hypot(
        state.player.x - boss.x,
        state.player.z - boss.z
      );

      if (dist < 0.2) {
        boss.health--;
        if (boss.health <= 0) {
          playWinSound();
          state.bossesDefeated++;
          state.bosses.splice(i, 1);

          if (state.bossesDefeated === 2 && !state.bigBoss) {
            // Spawn the big boss in the center
            state.bigBoss = {
              id: 'bigboss',
              x: 0,
              y: 0.25,
              z: 0,
              health: 10,
              maxHealth: 10,
              vx: 0,
              vz: 0,
            };
          }
        }
      }
    }

    // Collision with big boss
    if (state.bigBoss) {
      const dist = Math.hypot(
        state.player.x - state.bigBoss.x,
        state.player.z - state.bigBoss.z
      );

      if (dist < 0.35) {
        state.bigBoss.health--;
        if (state.bigBoss.health <= 0) {
          playWinSound();
          state.bigBoss = null;
          setGameState('gameOver');
        }
      }
    }

    // Camera follow (3rd person Roblox style) - higher angle for better view
    const cameraHeight = 1.2;
    const cameraOffsetZ = 2.5;

    const targetCamX = state.player.x;
    const targetCamY = state.player.y + cameraHeight;
    const targetCamZ = state.player.z + cameraOffsetZ;

    camera.position.lerp(
      new THREE.Vector3(targetCamX, targetCamY, targetCamZ),
      0.1
    );
    camera.lookAt(state.player.x, state.player.y, state.player.z);
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Ground plane */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#2D5016" />
      </mesh>

      {/* Grid helper */}
      <gridHelper args={[8, 20, 0x6496c8, 0x6496c8]} position={[0, 0.01, 0]} />

      {/* Sky background */}
      <color attach="background" args={['#87CEEB']} />

      {/* Player */}
      <Player playerRef={playerRef} />

      {/* Gummy bears */}
      {gameStateRef.gummyBears.map((bear) => (
        <GummyBear key={bear.id} bear={bear} speed={0.04} />
      ))}

      {/* Rare chocolates */}
      {gameStateRef.chocolates.map((chocolate) => (
        <Chocolate key={chocolate.id} chocolate={chocolate} />
      ))}

      {/* Bosses */}
      {gameStateRef.bosses.map((boss) => (
        <Boss key={boss.id} boss={boss} speed={0.04} />
      ))}

      {/* Big Boss */}
      {gameStateRef.bigBoss && <BigBoss boss={gameStateRef.bigBoss} />}
    </>
  );
}

// Main component
const BaconHuntGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      gameStateRef.keys[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      gameStateRef.keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleStart = async () => {
    await playClickSound();
    resetGameState();
    setScore(0);
    setGameState('playing');
  };

  const handlePlayAgain = async () => {
    await playClickSound();
    handleStart();
  };

  const handleBackClick = async () => {
    await playClickSound();
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-yellow-100 to-pink-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <button
          onClick={handleBackClick}
          className="mb-4 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold transition-all active:scale-95"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl shadow-2xl border-8 border-yellow-400 p-8">
          <h1 className="text-5xl font-black text-center mb-2 text-orange-600">🥓 BACON HUNT 3D 🥓</h1>
          <p className="text-center text-gray-600 mb-6">Eat gummy bears and defeat the boss enemies in stunning 3D!</p>

          {gameState === 'start' && (
            <div className="text-center space-y-6">
              <div className="bg-yellow-50 border-4 border-orange-400 rounded-lg p-6">
                <p className="text-lg font-bold mb-4 text-gray-800">How to Play:</p>
                <ul className="text-left space-y-2 text-gray-700">
                  <li>🎮 Use WASD or Arrow Keys to move</li>
                  <li>🍬 Eat colorful gummy bears (+10 points each)</li>
                  <li>🍫 Collect rare chocolates to grow BIG! (+50 points, +40% size)</li>
                  <li>🔴 Run into red boss enemies to damage them (5 hits each)</li>
                  <li>⭐ Defeat both bosses to reveal the BIG BOSS!</li>
                  <li>⚔️ Defeat the BIG BOSS (10 hits) to win the game!</li>
                  <li>🎥 Watch the camera follow you in 3D!</li>
                </ul>
              </div>
              <button
                onClick={handleStart}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-black text-2xl rounded-xl transition-all active:scale-95 shadow-lg"
              >
                START GAME
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="space-y-4">
              <div style={{ width: '100%', height: '600px', borderRadius: '0.5rem', overflow: 'hidden', border: '4px solid #FF9900', position: 'relative' }}>
                <Canvas
                  camera={{ position: [0, 5, 10], fov: 75 }}
                  gl={{ antialias: true, shadowMap: { enabled: true } }}
                >
                  <GameScene gameState={gameState} setGameState={setGameState} setScore={setScore} isPlaying={gameState === 'playing'} />
                </Canvas>
                {/* HUD Overlay */}
                <div style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '15px 20px', borderRadius: '8px', color: 'white' }}>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>🍬 Gummy Bears: {gameStateRef.gummyBears.length}</p>
                  <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '5px 0', color: '#D2691E' }}>🍫 Chocolates: {gameStateRef.chocolatesCollected}</p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0', color: '#FFD700' }}>📏 Size: {(gameStateRef.player.sizeScale * 100).toFixed(0)}%</p>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '5px 0' }}>Score: {score}</p>
                </div>
                <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '15px 20px', borderRadius: '8px', color: 'white', textAlign: 'center' }}>
                  {gameStateRef.bigBoss ? (
                    <>
                      <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0', color: '#FF0000' }}>⚔️ BIG BOSS!</p>
                      <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '5px 0', color: '#FFD700' }}>❤️ {gameStateRef.bigBoss.health} / {gameStateRef.bigBoss.maxHealth}</p>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>🔴 BOSSES</p>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>{gameStateRef.bossesDefeated} / 2</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div className="text-center space-y-6">
              <div className="text-7xl">🎉</div>
              <h2 className="text-4xl font-black text-orange-600">YOU WON!</h2>
              <div className="bg-yellow-50 border-4 border-orange-400 rounded-lg p-6">
                <p className="text-3xl font-bold text-orange-600 mb-2">Final Score: {score}</p>
                <p className="text-lg text-gray-700">Bosses Defeated: 2/2 ✓</p>
              </div>
              <button
                onClick={handlePlayAgain}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-black text-2xl rounded-xl transition-all active:scale-95 shadow-lg"
              >
                PLAY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BaconHuntGame;
