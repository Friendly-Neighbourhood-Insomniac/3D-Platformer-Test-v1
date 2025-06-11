import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

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

// Collectible Component
function Collectible({ position, color = "#FFD700", type = "coin" }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 2
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.5
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
  
  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        {getGeometry()}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
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
  return (
    <group position={position}>
      {/* Flag pole */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 8, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Flag */}
      <mesh position={[0, 4, 1.5]}>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
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

function Scene() {
  return (
    <group>
      {/* ===== ZONE 1: STARTING AREA (Green Forest) ===== */}
      
      {/* Starting platform */}
      <Platform position={[0, 0, 0]} size={[20, 3, 20]} color="#228B22" />
      
      {/* Tutorial platforms - simple jumps */}
      <Platform position={[25, 2, 0]} size={[8, 2, 8]} color="#32CD32" />
      <Platform position={[40, 4, 0]} size={[8, 2, 8]} color="#32CD32" />
      <Platform position={[55, 6, 0]} size={[8, 2, 8]} color="#32CD32" />
      
      {/* First collectibles */}
      <Collectible position={[25, 6, 0]} color="#FFD700" type="coin" />
      <Collectible position={[40, 8, 0]} color="#FFD700" type="coin" />
      <Collectible position={[55, 10, 0]} color="#FFD700" type="coin" />
      
      {/* Simple obstacles */}
      <Obstacle position={[15, 5, 0]} size={[2, 4, 2]} color="#8B4513" />
      <Obstacle position={[32, 8, 0]} size={[2, 3, 2]} color="#8B4513" />
      
      {/* Zone 1 checkpoint */}
      <CheckpointFlag position={[70, 8, 0]} color="#00FF00" />
      
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
      
      {/* Desert collectibles */}
      <Collectible position={[100, 14, 0]} color="#C0C0C0" type="coin" />
      <Collectible position={[180, 26, 0]} color="#9932CC" type="gem" />
      <Collectible position={[200, 30, 0]} color="#9932CC" type="gem" />
      
      {/* Jump pad */}
      <JumpPad position={[220, 26, 0]} color="#FF69B4" />
      
      {/* Zone 2 checkpoint */}
      <CheckpointFlag position={[240, 30, 0]} color="#FFFF00" />
      
      {/* ===== ZONE 3: ICE AREA (Blue/White) ===== */}
      
      {/* Ice platforms */}
      <Platform position={[270, 35, 0]} size={[12, 3, 12]} color="#87CEEB" />
      <Platform position={[290, 40, 0]} size={[8, 2, 8]} color="#B0E0E6" />
      <Platform position={[310, 45, 0]} size={[8, 2, 8]} color="#87CEEB" />
      
      {/* Challenging moving platforms */}
      <MovingPlatform 
        startPos={[330, 50, -10]} 
        endPos={[330, 50, 10]} 
        size={[6, 2, 6]} 
        color="#4169E1" 
        speed={1.5} 
      />
      
      <MovingPlatform 
        startPos={[350, 55, 0]} 
        endPos={[370, 55, 0]} 
        size={[6, 2, 6]} 
        color="#4169E1" 
        speed={1.2} 
      />
      
      {/* Ice collectibles */}
      <Collectible position={[270, 41, 0]} color="#00FFFF" type="star" />
      <Collectible position={[310, 51, 0]} color="#9932CC" type="gem" />
      
      {/* Zone 3 checkpoint */}
      <CheckpointFlag position={[390, 60, 0]} color="#00BFFF" />
      
      {/* ===== ZONE 4: VOLCANO AREA (Red/Orange) ===== */}
      
      {/* Volcano platforms */}
      <Platform position={[420, 65, 0]} size={[10, 3, 10]} color="#DC143C" />
      <Platform position={[440, 70, 0]} size={[8, 2, 8]} color="#FF4500" />
      
      {/* Fast moving platforms */}
      <MovingPlatform 
        startPos={[460, 75, -15]} 
        endPos={[460, 75, 15]} 
        size={[6, 2, 6]} 
        color="#FF0000" 
        speed={2.0} 
      />
      
      <MovingPlatform 
        startPos={[480, 80, 0]} 
        endPos={[500, 80, 0]} 
        size={[6, 2, 6]} 
        color="#FF0000" 
        speed={1.8} 
      />
      
      {/* Volcano collectibles */}
      <Collectible position={[420, 71, 0]} color="#FF6347" type="star" />
      <Collectible position={[440, 76, 0]} color="#FFD700" type="gem" />
      
      {/* Zone 4 checkpoint */}
      <CheckpointFlag position={[520, 85, 0]} color="#FF0000" />
      
      {/* ===== ZONE 5: FINAL AREA (Purple/Gold) ===== */}
      
      {/* Final challenge platforms */}
      <Platform position={[550, 90, 0]} size={[8, 2, 8]} color="#9370DB" />
      
      {/* Multiple moving platforms */}
      <MovingPlatform 
        startPos={[570, 95, -10]} 
        endPos={[590, 95, 10]} 
        size={[5, 2, 5]} 
        color="#8A2BE2" 
        speed={2.2} 
      />
      
      <MovingPlatform 
        startPos={[610, 100, 10]} 
        endPos={[610, 100, -10]} 
        size={[5, 2, 5]} 
        color="#8A2BE2" 
        speed={2.5} 
      />
      
      <MovingPlatform 
        startPos={[630, 105, 0]} 
        endPos={[650, 105, 0]} 
        size={[5, 2, 5]} 
        color="#8A2BE2" 
        speed={2.0} 
      />
      
      {/* Final platform */}
      <Platform position={[680, 110, 0]} size={[20, 4, 20]} color="#FFD700" />
      
      {/* Final collectibles */}
      <Collectible position={[550, 96, 0]} color="#9932CC" type="star" />
      <Collectible position={[680, 118, 0]} color="#FFD700" type="star" />
      <Collectible position={[675, 118, 5]} color="#9932CC" type="gem" />
      <Collectible position={[685, 118, -5]} color="#9932CC" type="gem" />
      
      {/* Victory flag */}
      <group position={[680, 118, 0]}>
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
      <Collectible position={[150, 36, 50]} color="#9932CC" type="gem" />
      <Collectible position={[170, 41, 50]} color="#FFD700" type="star" />
      
      {/* Secret area 2 - accessible from zone 3 */}
      <Platform position={[320, 60, -50]} size={[10, 2, 10]} color="#87CEEB" />
      <Collectible position={[320, 66, -50]} color="#00FFFF" type="star" />
      <Collectible position={[315, 66, -45]} color="#9932CC" type="gem" />
      <Collectible position={[325, 66, -55]} color="#9932CC" type="gem" />
      
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
      <group position={[280, 42, 25]}>
        <mesh>
          <coneGeometry args={[1, 3, 6]} />
          <meshStandardMaterial color="#87CEEB" />
        </mesh>
      </group>
      
      <group position={[320, 52, -30]}>
        <mesh>
          <coneGeometry args={[0.8, 2.5, 6]} />
          <meshStandardMaterial color="#B0E0E6" />
        </mesh>
      </group>
      
      {/* Lava rocks in zone 4 */}
      <group position={[430, 72, 20]}>
        <mesh>
          <sphereGeometry args={[1.5]} />
          <meshStandardMaterial color="#8B0000" />
        </mesh>
      </group>
      
      <group position={[470, 82, -25]}>
        <mesh>
          <sphereGeometry args={[1.2]} />
          <meshStandardMaterial color="#DC143C" />
        </mesh>
      </group>
      
      {/* Crystal formations in final zone */}
      <group position={[560, 97, 15]}>
        <mesh>
          <octahedronGeometry args={[1.5]} />
          <meshStandardMaterial color="#9370DB" />
        </mesh>
      </group>
      
      <group position={[640, 112, -20]}>
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
      
      <group position={[85, 12, 0]}>
        <mesh rotation={[0, 0, -Math.PI/2]}>
          <coneGeometry args={[1, 3, 3]} />
          <meshStandardMaterial color="#FFFF00" />
        </mesh>
      </group>
      
      <group position={[255, 35, 0]}>
        <mesh rotation={[0, 0, -Math.PI/2]}>
          <coneGeometry args={[1, 3, 3]} />
          <meshStandardMaterial color="#FFFF00" />
        </mesh>
      </group>
      
      <group position={[405, 70, 0]}>
        <mesh rotation={[0, 0, -Math.PI/2]}>
          <coneGeometry args={[1, 3, 3]} />
          <meshStandardMaterial color="#FFFF00" />
        </mesh>
      </group>
      
      <group position={[535, 95, 0]}>
        <mesh rotation={[0, 0, -Math.PI/2]}>
          <coneGeometry args={[1, 3, 3]} />
          <meshStandardMaterial color="#FFFF00" />
        </mesh>
      </group>
    </group>
  )
}

export default Scene