import React, { useRef, useState, createContext, useContext } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

// Game State Context
const GameStateContext = createContext()

export const useGameState = () => {
  const context = useContext(GameStateContext)
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider')
  }
  return context
}

// Game State Provider
export function GameStateProvider({ children }) {
  const [gameState, setGameState] = useState({
    score: 0,
    collectibles: 0,
    bridgesActivated: new Set(),
    playerPosition: [0, 0, 0]
  })

  const updateGameState = (updates) => {
    setGameState(prev => ({ ...prev, ...updates }))
  }

  const activateBridge = (bridgeId) => {
    setGameState(prev => ({
      ...prev,
      bridgesActivated: new Set([...prev.bridgesActivated, bridgeId])
    }))
  }

  const collectItem = (points, type = 'coin') => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      collectibles: prev.collectibles + 1
    }))
  }

  return (
    <GameStateContext.Provider value={{
      gameState,
      updateGameState,
      activateBridge,
      collectItem
    }}>
      {children}
    </GameStateContext.Provider>
  )
}

// Simple Platform Component
function Platform({ position = [0, 0, 0], size = [10, 2, 10], color = "#32CD32", type = "fixed" }) {
  return (
    <RigidBody type={type} position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}

// Interactive Bridge Component
function InteractiveBridge({ 
  position, 
  size = [8, 1, 8], 
  bridgeId, 
  activationDistance = 5,
  color = "#8B4513"
}) {
  const { gameState, activateBridge } = useGameState()
  const [isActivated, setIsActivated] = useState(false)
  const [playerNear, setPlayerNear] = useState(false)
  const bridgeRef = useRef()
  
  useFrame(() => {
    if (!bridgeRef.current) return
    
    // Check distance to player (simplified - using gameState.playerPosition)
    const bridgePos = new THREE.Vector3(...position)
    const playerPos = new THREE.Vector3(...gameState.playerPosition)
    const distance = bridgePos.distanceTo(playerPos)
    
    const wasNear = playerNear
    const isNear = distance < activationDistance
    setPlayerNear(isNear)
    
    // Activate bridge when player gets close
    if (isNear && !wasNear && !isActivated) {
      setIsActivated(true)
      activateBridge(bridgeId)
      
      // Animate bridge appearing
      if (bridgeRef.current) {
        bridgeRef.current.scale.y = 0.1
        const startTime = Date.now()
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / 1000, 1) // 1 second animation
          bridgeRef.current.scale.y = 0.1 + (0.9 * progress)
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }
        animate()
      }
    }
  })

  return (
    <RigidBody 
      type="fixed" 
      position={position}
      sensor={!isActivated} // Make it a sensor until activated
    >
      <mesh 
        ref={bridgeRef}
        castShadow 
        receiveShadow
        scale={isActivated ? [1, 1, 1] : [1, 0.1, 1]}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial 
          color={isActivated ? color : "#654321"} 
          transparent
          opacity={isActivated ? 1 : 0.5}
          emissive={playerNear && !isActivated ? "#444444" : "#000000"}
          emissiveIntensity={playerNear && !isActivated ? 0.3 : 0}
        />
      </mesh>
      
      {/* Activation indicator */}
      {playerNear && !isActivated && (
        <mesh position={[0, size[1]/2 + 1, 0]}>
          <sphereGeometry args={[0.5]} />
          <meshStandardMaterial 
            color="#FFFF00" 
            emissive="#FFFF00" 
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </RigidBody>
  )
}

// Moving Platform Component
function MovingPlatform({ startPos, endPos, size = [8, 2, 8], color = "#4169E1", speed = 1 }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (!ref.current) return
    
    const time = state.clock.elapsedTime * speed
    const progress = (Math.sin(time) + 1) / 2
    
    const currentPos = [
      startPos[0] + (endPos[0] - startPos[0]) * progress,
      startPos[1] + (endPos[1] - startPos[1]) * progress,
      startPos[2] + (endPos[2] - startPos[2]) * progress
    ]
    
    ref.current.setTranslation(currentPos, true)
  })

  return (
    <RigidBody ref={ref} type="kinematicPosition" position={startPos}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}

// Interactive Collectible Component
function InteractiveCollectible({ 
  position, 
  color = "#FFD700", 
  type = "coin",
  points = 10,
  collectDistance = 3
}) {
  const { gameState, collectItem } = useGameState()
  const [collected, setCollected] = useState(false)
  const [playerNear, setPlayerNear] = useState(false)
  const ref = useRef()
  
  useFrame((state) => {
    if (collected || !ref.current) return
    
    // Rotation animation
    ref.current.rotation.y = state.clock.elapsedTime * 2
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.5
    
    // Check distance to player
    const collectiblePos = new THREE.Vector3(...position)
    const playerPos = new THREE.Vector3(...gameState.playerPosition)
    const distance = collectiblePos.distanceTo(playerPos)
    
    const wasNear = playerNear
    const isNear = distance < collectDistance
    setPlayerNear(isNear)
    
    // Collect when player gets close
    if (isNear && !wasNear && !collected) {
      setCollected(true)
      collectItem(points, type)
      
      // Collection animation
      const startTime = Date.now()
      const startScale = ref.current.scale.x
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / 500, 1) // 0.5 second animation
        const scale = startScale * (1 - progress)
        ref.current.scale.set(scale, scale, scale)
        ref.current.position.y = position[1] + progress * 3 // Float upward
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    }
  })

  const getGeometry = () => {
    switch (type) {
      case "coin":
        return <cylinderGeometry args={[1, 1, 0.3, 8]} />
      case "gem":
        return <octahedronGeometry args={[1]} />
      case "star":
        return <sphereGeometry args={[0.8]} />
      default:
        return <cylinderGeometry args={[1, 1, 0.3, 8]} />
    }
  }
  
  if (collected) return null
  
  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        {getGeometry()}
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={playerNear ? 0.5 : 0.3}
        />
      </mesh>
      
      {/* Collection indicator */}
      {playerNear && (
        <mesh position={[0, 2, 0]}>
          <ringGeometry args={[1.2, 1.5, 8]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
      
      {/* Points indicator */}
      {playerNear && (
        <mesh position={[0, 2.5, 0]}>
          <planeGeometry args={[1, 0.5]} />
          <meshStandardMaterial 
            color="#FFFFFF"
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
    </group>
  )
}

// Simple Obstacle Component
function Obstacle({ position, size = [3, 3, 3], color = "#8B4513" }) {
  return (
    <RigidBody type="fixed" position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}

// Checkpoint Flag Component
function CheckpointFlag({ position, color = "#00FF00" }) {
  const { gameState } = useGameState()
  const [activated, setActivated] = useState(false)
  const [playerNear, setPlayerNear] = useState(false)
  const flagRef = useRef()
  
  useFrame(() => {
    if (!flagRef.current) return
    
    // Check distance to player
    const flagPos = new THREE.Vector3(...position)
    const playerPos = new THREE.Vector3(...gameState.playerPosition)
    const distance = flagPos.distanceTo(playerPos)
    
    const wasNear = playerNear
    const isNear = distance < 5
    setPlayerNear(isNear)
    
    // Activate checkpoint
    if (isNear && !wasNear && !activated) {
      setActivated(true)
    }
    
    // Flag animation
    if (flagRef.current) {
      flagRef.current.rotation.z = Math.sin(Date.now() * 0.003) * 0.1
    }
  })

  return (
    <group position={position}>
      {/* Flag pole */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 8, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Flag */}
      <mesh 
        ref={flagRef}
        position={[0, 4, 1.5]}
      >
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial 
          color={activated ? "#00FF00" : color}
          emissive={activated ? "#004400" : "#000000"}
          emissiveIntensity={activated ? 0.3 : 0}
        />
      </mesh>
      
      {/* Activation indicator */}
      {playerNear && !activated && (
        <mesh position={[0, 9, 0]}>
          <sphereGeometry args={[0.5]} />
          <meshStandardMaterial 
            color="#FFFF00" 
            emissive="#FFFF00" 
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
      
      {/* Checkpoint activated effect */}
      {activated && (
        <mesh position={[0, 4, 0]}>
          <ringGeometry args={[3, 4, 16]} />
          <meshStandardMaterial 
            color="#00FF00"
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  )
}

// Jump Pad Component
function JumpPad({ position, color = "#FF69B4" }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2
    }
  })

  return (
    <RigidBody type="fixed" position={position}>
      <mesh ref={ref} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2, 0.5, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </RigidBody>
  )
}

// Player Position Tracker (invisible component to track player position)
function PlayerTracker({ playerRef }) {
  const { updateGameState } = useGameState()
  
  useFrame(() => {
    if (playerRef?.current) {
      const pos = playerRef.current.translation()
      updateGameState({ playerPosition: [pos.x, pos.y, pos.z] })
    }
  })
  
  return null
}

function Scene() {
  return (
    <GameStateProvider>
      <group>
        {/* ===== ZONE 1: STARTING AREA (Green Forest) ===== */}
        
        {/* Starting platform */}
        <Platform position={[0, 0, 0]} size={[20, 3, 20]} color="#228B22" />
        
        {/* Tutorial platforms - simple jumps */}
        <Platform position={[25, 2, 0]} size={[8, 2, 8]} color="#32CD32" />
        <Platform position={[40, 4, 0]} size={[8, 2, 8]} color="#32CD32" />
        <Platform position={[55, 6, 0]} size={[8, 2, 8]} color="#32CD32" />
        
        {/* Interactive collectibles */}
        <InteractiveCollectible position={[25, 6, 0]} color="#FFD700" type="coin" points={10} />
        <InteractiveCollectible position={[40, 8, 0]} color="#FFD700" type="coin" points={10} />
        <InteractiveCollectible position={[55, 10, 0]} color="#FFD700" type="coin" points={10} />
        
        {/* Simple obstacles */}
        <Obstacle position={[15, 5, 0]} size={[2, 4, 2]} color="#8B4513" />
        <Obstacle position={[32, 8, 0]} size={[2, 3, 2]} color="#8B4513" />
        
        {/* Interactive bridge */}
        <InteractiveBridge 
          position={[70, 8, 0]} 
          size={[12, 1, 8]} 
          bridgeId="bridge1"
          color="#8B4513"
        />
        
        {/* Zone 1 checkpoint */}
        <CheckpointFlag position={[85, 10, 0]} color="#00FF00" />
        
        {/* ===== ZONE 2: DESERT AREA (Yellow/Orange) ===== */}
        
        {/* Desert base platform */}
        <Platform position={[100, 8, 0]} size={[15, 3, 15]} color="#DAA520" />
        
        {/* Moving platforms introduction */}
        <MovingPlatform 
          startPos={[120, 12, 0]} 
          endPos={[140, 12, 0]} 
          size={[6, 2, 6]} 
          color="#FF8C00" 
          speed={0.8} 
        />
        
        <MovingPlatform 
          startPos={[160, 16, 0]} 
          endPos={[160, 16, 20]} 
          size={[6, 2, 6]} 
          color="#FF8C00" 
          speed={1.0} 
        />
        
        {/* Desert platforms */}
        <Platform position={[180, 20, 0]} size={[10, 2, 10]} color="#DAA520" />
        <Platform position={[200, 24, 0]} size={[8, 2, 8]} color="#DAA520" />
        
        {/* Interactive bridge in desert */}
        <InteractiveBridge 
          position={[220, 26, 0]} 
          size={[10, 1, 6]} 
          bridgeId="bridge2"
          color="#CD853F"
        />
        
        {/* Desert collectibles */}
        <InteractiveCollectible position={[100, 14, 0]} color="#C0C0C0" type="coin" points={15} />
        <InteractiveCollectible position={[180, 26, 0]} color="#9932CC" type="gem" points={25} />
        <InteractiveCollectible position={[200, 30, 0]} color="#9932CC" type="gem" points={25} />
        
        {/* Jump pad */}
        <JumpPad position={[240, 28, 0]} color="#FF69B4" />
        
        {/* Zone 2 checkpoint */}
        <CheckpointFlag position={[260, 32, 0]} color="#FFFF00" />
        
        {/* ===== ZONE 3: ICE AREA (Blue/White) ===== */}
        
        {/* Ice platforms */}
        <Platform position={[280, 35, 0]} size={[12, 3, 12]} color="#87CEEB" />
        <Platform position={[300, 40, 0]} size={[8, 2, 8]} color="#B0E0E6" />
        <Platform position={[320, 45, 0]} size={[8, 2, 8]} color="#87CEEB" />
        
        {/* Challenging moving platforms */}
        <MovingPlatform 
          startPos={[340, 50, -10]} 
          endPos={[340, 50, 10]} 
          size={[6, 2, 6]} 
          color="#4169E1" 
          speed={1.5} 
        />
        
        <MovingPlatform 
          startPos={[360, 55, 0]} 
          endPos={[380, 55, 0]} 
          size={[6, 2, 6]} 
          color="#4169E1" 
          speed={1.2} 
        />
        
        {/* Interactive ice bridge */}
        <InteractiveBridge 
          position={[400, 58, 0]} 
          size={[14, 1, 8]} 
          bridgeId="bridge3"
          color="#B0E0E6"
        />
        
        {/* Ice collectibles */}
        <InteractiveCollectible position={[280, 41, 0]} color="#00FFFF" type="star" points={30} />
        <InteractiveCollectible position={[320, 51, 0]} color="#9932CC" type="gem" points={25} />
        <InteractiveCollectible position={[400, 64, 0]} color="#00FFFF" type="star" points={30} />
        
        {/* Zone 3 checkpoint */}
        <CheckpointFlag position={[420, 62, 0]} color="#00BFFF" />
        
        {/* ===== ZONE 4: VOLCANO AREA (Red/Orange) ===== */}
        
        {/* Volcano platforms */}
        <Platform position={[440, 65, 0]} size={[10, 3, 10]} color="#DC143C" />
        <Platform position={[460, 70, 0]} size={[8, 2, 8]} color="#FF4500" />
        
        {/* Fast moving platforms */}
        <MovingPlatform 
          startPos={[480, 75, -15]} 
          endPos={[480, 75, 15]} 
          size={[6, 2, 6]} 
          color="#FF0000" 
          speed={2.0} 
        />
        
        <MovingPlatform 
          startPos={[500, 80, 0]} 
          endPos={[520, 80, 0]} 
          size={[6, 2, 6]} 
          color="#FF0000" 
          speed={1.8} 
        />
        
        {/* Volcano bridge */}
        <InteractiveBridge 
          position={[540, 82, 0]} 
          size={[12, 1, 6]} 
          bridgeId="bridge4"
          color="#8B0000"
        />
        
        {/* Volcano collectibles */}
        <InteractiveCollectible position={[440, 71, 0]} color="#FF6347" type="star" points={35} />
        <InteractiveCollectible position={[460, 76, 0]} color="#FFD700" type="gem" points={40} />
        <InteractiveCollectible position={[540, 88, 0]} color="#FF6347" type="star" points={35} />
        
        {/* Zone 4 checkpoint */}
        <CheckpointFlag position={[560, 86, 0]} color="#FF0000" />
        
        {/* ===== ZONE 5: FINAL AREA (Purple/Gold) ===== */}
        
        {/* Final challenge platforms */}
        <Platform position={[580, 90, 0]} size={[8, 2, 8]} color="#9370DB" />
        
        {/* Multiple moving platforms */}
        <MovingPlatform 
          startPos={[600, 95, -10]} 
          endPos={[620, 95, 10]} 
          size={[5, 2, 5]} 
          color="#8A2BE2" 
          speed={2.2} 
        />
        
        <MovingPlatform 
          startPos={[640, 100, 10]} 
          endPos={[640, 100, -10]} 
          size={[5, 2, 5]} 
          color="#8A2BE2" 
          speed={2.5} 
        />
        
        <MovingPlatform 
          startPos={[660, 105, 0]} 
          endPos={[680, 105, 0]} 
          size={[5, 2, 5]} 
          color="#8A2BE2" 
          speed={2.0} 
        />
        
        {/* Final bridge */}
        <InteractiveBridge 
          position={[700, 108, 0]} 
          size={[16, 2, 10]} 
          bridgeId="bridge5"
          color="#FFD700"
        />
        
        {/* Final platform */}
        <Platform position={[720, 110, 0]} size={[20, 4, 20]} color="#FFD700" />
        
        {/* Final collectibles */}
        <InteractiveCollectible position={[580, 96, 0]} color="#9932CC" type="star" points={50} />
        <InteractiveCollectible position={[720, 118, 0]} color="#FFD700" type="star" points={100} />
        <InteractiveCollectible position={[715, 118, 5]} color="#9932CC" type="gem" points={75} />
        <InteractiveCollectible position={[725, 118, -5]} color="#9932CC" type="gem" points={75} />
        
        {/* Victory flag */}
        <group position={[720, 118, 0]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 15, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 7, 2]}>
            <boxGeometry args={[5, 4, 0.1]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
        </group>
        
        {/* ===== SIDE AREAS & SECRETS ===== */}
        
        {/* Secret area 1 - accessible from zone 2 */}
        <Platform position={[150, 30, 50]} size={[8, 2, 8]} color="#32CD32" />
        <Platform position={[170, 35, 50]} size={[6, 2, 6]} color="#32CD32" />
        <InteractiveCollectible position={[150, 36, 50]} color="#9932CC" type="gem" points={50} />
        <InteractiveCollectible position={[170, 41, 50]} color="#FFD700" type="star" points={75} />
        
        {/* Secret bridge */}
        <InteractiveBridge 
          position={[190, 38, 50]} 
          size={[8, 1, 6]} 
          bridgeId="secretBridge1"
          color="#228B22"
        />
        
        {/* Secret area 2 - accessible from zone 3 */}
        <Platform position={[340, 60, -50]} size={[10, 2, 10]} color="#87CEEB" />
        <InteractiveCollectible position={[340, 66, -50]} color="#00FFFF" type="star" points={60} />
        <InteractiveCollectible position={[335, 66, -45]} color="#9932CC" type="gem" points={50} />
        <InteractiveCollectible position={[345, 66, -55]} color="#9932CC" type="gem" points={50} />
        
        {/* ===== GROUND AND BOUNDARIES ===== */}
        
        {/* Ground plane */}
        <RigidBody type="fixed" position={[350, -20, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[800, 5, 400]} />
            <meshStandardMaterial color="#4a7c59" />
          </mesh>
        </RigidBody>
        
        {/* Simple boundary walls */}
        <RigidBody type="fixed" position={[350, 20, 100]}>
          <mesh>
            <boxGeometry args={[800, 40, 5]} />
            <meshStandardMaterial color="#696969" />
          </mesh>
        </RigidBody>
        
        <RigidBody type="fixed" position={[350, 20, -100]}>
          <mesh>
            <boxGeometry args={[800, 40, 5]} />
            <meshStandardMaterial color="#696969" />
          </mesh>
        </RigidBody>
        
        {/* ===== DECORATIVE ELEMENTS ===== */}
        
        {/* Simple trees in zone 1 */}
        <group position={[10, 5, 30]}>
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 3, 0]}>
            <coneGeometry args={[2, 4, 8]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        </group>
        
        <group position={[50, 8, -30]}>
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 3, 0]}>
            <coneGeometry args={[2, 4, 8]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        </group>
        
        {/* Cacti in zone 2 */}
        <group position={[120, 15, 30]}>
          <mesh>
            <cylinderGeometry args={[0.8, 0.8, 6, 8]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        </group>
        
        <group position={[180, 27, -25]}>
          <mesh>
            <cylinderGeometry args={[0.6, 0.6, 5, 8]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        </group>
        
        {/* Ice crystals in zone 3 */}
        <group position={[290, 42, 25]}>
          <mesh>
            <coneGeometry args={[1, 3, 6]} />
            <meshStandardMaterial color="#87CEEB" />
          </mesh>
        </group>
        
        <group position={[330, 52, -30]}>
          <mesh>
            <coneGeometry args={[0.8, 2.5, 6]} />
            <meshStandardMaterial color="#B0E0E6" />
          </mesh>
        </group>
        
        {/* Lava rocks in zone 4 */}
        <group position={[450, 72, 20]}>
          <mesh>
            <sphereGeometry args={[1.5]} />
            <meshStandardMaterial color="#8B0000" />
          </mesh>
        </group>
        
        <group position={[490, 82, -25]}>
          <mesh>
            <sphereGeometry args={[1.2]} />
            <meshStandardMaterial color="#DC143C" />
          </mesh>
        </group>
        
        {/* Crystal formations in final zone */}
        <group position={[590, 97, 15]}>
          <mesh>
            <octahedronGeometry args={[1.5]} />
            <meshStandardMaterial color="#9370DB" />
          </mesh>
        </group>
        
        <group position={[670, 112, -20]}>
          <mesh>
            <octahedronGeometry args={[1.2]} />
            <meshStandardMaterial color="#8A2BE2" />
          </mesh>
        </group>
        
        {/* ===== GUIDANCE ELEMENTS ===== */}
        
        {/* Simple directional arrows */}
        <group position={[15, 8, 0]}>
          <mesh rotation={[0, 0, -Math.PI/2]}>
            <coneGeometry args={[1, 3, 3]} />
            <meshStandardMaterial color="#FFFF00" />
          </mesh>
        </group>
        
        <group position={[95, 12, 0]}>
          <mesh rotation={[0, 0, -Math.PI/2]}>
            <coneGeometry args={[1, 3, 3]} />
            <meshStandardMaterial color="#FFFF00" />
          </mesh>
        </group>
        
        <group position={[275, 38, 0]}>
          <mesh rotation={[0, 0, -Math.PI/2]}>
            <coneGeometry args={[1, 3, 3]} />
            <meshStandardMaterial color="#FFFF00" />
          </mesh>
        </group>
        
        <group position={[435, 68, 0]}>
          <mesh rotation={[0, 0, -Math.PI/2]}>
            <coneGeometry args={[1, 3, 3]} />
            <meshStandardMaterial color="#FFFF00" />
          </mesh>
        </group>
        
        <group position={[575, 93, 0]}>
          <mesh rotation={[0, 0, -Math.PI/2]}>
            <coneGeometry args={[1, 3, 3]} />
            <meshStandardMaterial color="#FFFF00" />
          </mesh>
        </group>
      </group>
    </GameStateProvider>
  )
}

export default Scene