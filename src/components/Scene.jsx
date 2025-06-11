import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

// Basic Geometry Platform Component
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

// Collectible Component with animation
function Collectible({ position, color = "#FFD700", type = "coin" }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 2
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.3
    }
  })

  const getGeometry = () => {
    switch (type) {
      case "coin":
        return <cylinderGeometry args={[0.8, 0.8, 0.2, 8]} />
      case "gem":
        return <octahedronGeometry args={[0.8]} />
      case "heart":
        return <sphereGeometry args={[0.6]} />
      default:
        return <cylinderGeometry args={[0.8, 0.8, 0.2, 8]} />
    }
  }
  
  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        {getGeometry()}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

// Obstacle Component
function Obstacle({ position, size = [2, 2, 2], color = "#8B4513", type = "box" }) {
  const getGeometry = () => {
    switch (type) {
      case "cylinder":
        return <cylinderGeometry args={[size[0], size[0], size[1], 8]} />
      case "cone":
        return <coneGeometry args={[size[0], size[1], 8]} />
      case "sphere":
        return <sphereGeometry args={[size[0]]} />
      default:
        return <boxGeometry args={size} />
    }
  }

  return (
    <RigidBody type="fixed" position={position}>
      <mesh castShadow receiveShadow>
        {getGeometry()}
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}

// Decoration Component (non-collidable)
function Decoration({ position, size = [2, 4, 2], color = "#228B22", type = "tree" }) {
  const getGeometry = () => {
    switch (type) {
      case "tree":
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[0, 2, 0]}>
              <coneGeometry args={[1.5, 3, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        )
      case "rock":
        return <sphereGeometry args={size} />
      case "flower":
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 1, 6]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
            <mesh position={[0, 1, 0]}>
              <sphereGeometry args={[0.3]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        )
      default:
        return <boxGeometry args={size} />
    }
  }

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        {getGeometry()}
      </mesh>
    </group>
  )
}

// Ramp Component
function Ramp({ position, size = [10, 2, 10], rotation = [0, 0, 0], color = "#32CD32" }) {
  return (
    <RigidBody type="fixed" position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}

// Hazard Component
function Hazard({ position, size = [2, 1, 2], color = "#FF4500", type = "spikes" }) {
  const getGeometry = () => {
    switch (type) {
      case "spikes":
        return <coneGeometry args={[size[0], size[1], 4]} />
      case "saw":
        return <cylinderGeometry args={[size[0], size[0], 0.2, 16]} />
      default:
        return <coneGeometry args={[size[0], size[1], 4]} />
    }
  }

  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current && type === "saw") {
      ref.current.rotation.z = state.clock.elapsedTime * 5
    }
  })

  return (
    <RigidBody type="fixed" position={position}>
      <mesh ref={ref} castShadow receiveShadow>
        {getGeometry()}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </RigidBody>
  )
}

function Scene() {
  return (
    <group>
      {/* ===== GROUND ZONE (Y: 0-50) - Forest/Grassland ===== */}
      
      {/* Base Terrain - Large grass platforms */}
      <Platform position={[0, 0, 0]} size={[40, 4, 40]} color="#32CD32" />
      <Platform position={[100, 0, 0]} size={[30, 4, 30]} color="#228B22" />
      <Platform position={[200, 0, 0]} size={[35, 4, 35]} color="#32CD32" />
      <Platform position={[300, 0, 0]} size={[25, 4, 25]} color="#228B22" />
      <Platform position={[400, 0, 0]} size={[30, 4, 30]} color="#32CD32" />
      
      {/* Side platforms for exploration */}
      <Platform position={[50, 10, 100]} size={[15, 2, 15]} color="#90EE90" />
      <Platform position={[150, 15, -100]} size={[15, 2, 15]} color="#90EE90" />
      <Platform position={[250, 20, 100]} size={[15, 2, 15]} color="#90EE90" />
      <Platform position={[350, 15, -100]} size={[15, 2, 15]} color="#90EE90" />
      
      {/* Stepping stones */}
      <Platform position={[75, 8, 0]} size={[8, 2, 8]} color="#228B22" />
      <Platform position={[125, 12, 0]} size={[8, 2, 8]} color="#228B22" />
      <Platform position={[175, 16, 0]} size={[8, 2, 8]} color="#228B22" />
      <Platform position={[225, 20, 0]} size={[8, 2, 8]} color="#228B22" />
      <Platform position={[275, 24, 0]} size={[8, 2, 8]} color="#228B22" />
      <Platform position={[325, 28, 0]} size={[8, 2, 8]} color="#228B22" />
      <Platform position={[375, 32, 0]} size={[8, 2, 8]} color="#228B22" />
      
      {/* Forest decorations */}
      <Decoration position={[25, 6, 50]} type="tree" color="#228B22" />
      <Decoration position={[125, 6, -75]} type="tree" color="#228B22" />
      <Decoration position={[225, 6, 75]} type="tree" color="#006400" />
      <Decoration position={[325, 6, -50]} type="tree" color="#228B22" />
      <Decoration position={[425, 6, 60]} type="tree" color="#006400" />
      
      {/* Flowers and vegetation */}
      <Decoration position={[75, 6, -25]} type="flower" color="#FF69B4" />
      <Decoration position={[175, 6, 25]} type="flower" color="#FFB6C1" />
      <Decoration position={[275, 6, -40]} type="flower" color="#FF1493" />
      <Decoration position={[375, 6, 35]} type="flower" color="#FF69B4" />
      
      {/* Interactive obstacles */}
      <Obstacle position={[100, 8, 100]} size={[3, 3, 3]} color="#8B4513" type="box" />
      <Obstacle position={[200, 8, -80]} size={[2, 4, 2]} color="#654321" type="cylinder" />
      <Obstacle position={[300, 8, 90]} size={[4, 2, 4]} color="#8B4513" type="box" />
      <Obstacle position={[400, 8, -70]} size={[3, 3, 3]} color="#654321" type="box" />
      
      {/* Ground zone collectibles */}
      <Collectible position={[50, 15, 0]} color="#CD7F32" type="coin" />
      <Collectible position={[150, 20, 0]} color="#C0C0C0" type="coin" />
      <Collectible position={[250, 25, 0]} color="#FFD700" type="coin" />
      <Collectible position={[350, 20, 0]} color="#FF0000" type="heart" />
      
      {/* Transition ramp to mid zone */}
      <Ramp position={[450, 15, 0]} size={[20, 4, 20]} rotation={[0, 0, 0.2]} color="#228B22" />
      <Platform position={[480, 35, 0]} size={[15, 2, 15]} color="#228B22" />
      
      {/* ===== MID ZONE (Y: 50-150) - Snow/Mountain Region ===== */}
      
      {/* Snow base platforms */}
      <Platform position={[0, 50, 0]} size={[30, 6, 30]} color="#F0F8FF" />
      <Platform position={[100, 55, 0]} size={[25, 4, 25]} color="#E6E6FA" />
      <Platform position={[200, 60, 0]} size={[30, 6, 30]} color="#F0F8FF" />
      <Platform position={[300, 65, 0]} size={[25, 4, 25]} color="#E6E6FA" />
      <Platform position={[400, 70, 0]} size={[30, 6, 30]} color="#F0F8FF" />
      
      {/* Snow stepped platforms */}
      <Platform position={[50, 58, 75]} size={[12, 2, 12]} color="#F5F5F5" />
      <Platform position={[50, 58, -75]} size={[12, 2, 12]} color="#F5F5F5" />
      <Platform position={[150, 63, 60]} size={[12, 2, 12]} color="#F5F5F5" />
      <Platform position={[150, 63, -60]} size={[12, 2, 12]} color="#F5F5F5" />
      <Platform position={[250, 68, 80]} size={[12, 2, 12]} color="#F5F5F5" />
      <Platform position={[250, 68, -80]} size={[12, 2, 12]} color="#F5F5F5" />
      
      {/* Snow decorations (ice crystals and rocks) */}
      <Decoration position={[75, 65, 40]} type="rock" size={[2, 2, 2]} color="#B0C4DE" />
      <Decoration position={[175, 70, -45]} type="rock" size={[1.8, 1.8, 1.8]} color="#778899" />
      <Decoration position={[275, 75, 50]} type="rock" size={[1.5, 1.5, 1.5]} color="#B0C4DE" />
      <Decoration position={[375, 80, -40]} type="rock" size={[2.2, 2.2, 2.2]} color="#778899" />
      
      {/* Snow obstacles and hazards */}
      <Obstacle position={[125, 65, -25]} size={[4, 4, 4]} color="#696969" type="sphere" />
      <Obstacle position={[225, 70, 20]} size={[3, 3, 3]} color="#708090" type="sphere" />
      <Hazard position={[200, 67, 0]} size={[1.5, 3, 1.5]} color="#FF4500" type="spikes" />
      <Hazard position={[325, 75, -15]} size={[2, 2, 2]} color="#FF6347" type="spikes" />
      
      {/* Mid zone collectibles */}
      <Collectible position={[50, 70, 0]} color="#C0C0C0" type="coin" />
      <Collectible position={[150, 75, 0]} color="#FFD700" type="coin" />
      <Collectible position={[250, 80, 0]} color="#9932CC" type="gem" />
      <Collectible position={[350, 85, 0]} color="#FFD700" type="gem" />
      
      {/* Moving platforms in mid zone */}
      <MovingPlatform 
        startPos={[125, 75, 0]} 
        endPos={[175, 75, 0]} 
        size={[12, 2, 12]} 
        color="#4169E1" 
        speed={1.2} 
      />
      <MovingPlatform 
        startPos={[275, 83, -40]} 
        endPos={[325, 83, -40]} 
        size={[12, 2, 12]} 
        color="#1E90FF" 
        speed={1.0} 
      />
      
      {/* Transition to summit */}
      <Platform position={[430, 85, 0]} size={[15, 2, 15]} color="#E6E6FA" />
      <Ramp position={[450, 95, 0]} size={[15, 4, 15]} rotation={[0, 0, 0.3]} color="#F0F8FF" />
      
      {/* ===== SUMMIT ZONE (Y: 150-300) - Sky/Cloud Platforms ===== */}
      
      {/* Summit base platforms */}
      <Platform position={[0, 150, 0]} size={[25, 4, 25]} color="#87CEEB" />
      <Platform position={[100, 160, 0]} size={[20, 4, 20]} color="#B0E0E6" />
      <Platform position={[200, 170, 0]} size={[25, 4, 25]} color="#87CEEB" />
      <Platform position={[300, 180, 0]} size={[30, 6, 30]} color="#B0E0E6" />
      
      {/* Floating platforms */}
      <Platform position={[50, 165, 60]} size={[12, 2, 12]} color="#ADD8E6" />
      <Platform position={[50, 165, -60]} size={[12, 2, 12]} color="#ADD8E6" />
      <Platform position={[150, 175, 50]} size={[12, 2, 12]} color="#87CEFA" />
      <Platform position={[150, 175, -50]} size={[12, 2, 12]} color="#87CEFA" />
      <Platform position={[250, 185, 70]} size={[12, 2, 12]} color="#ADD8E6" />
      <Platform position={[250, 185, -70]} size={[12, 2, 12]} color="#ADD8E6" />
      
      {/* Summit moving platforms - more challenging */}
      <MovingPlatform 
        startPos={[75, 170, 0]} 
        endPos={[125, 170, 0]} 
        size={[15, 2, 15]} 
        color="#4169E1" 
        speed={1.5} 
      />
      <MovingPlatform 
        startPos={[175, 180, -25]} 
        endPos={[225, 180, 25]} 
        size={[12, 2, 12]} 
        color="#0000FF" 
        speed={1.8} 
      />
      <MovingPlatform 
        startPos={[275, 190, 0]} 
        endPos={[325, 190, 0]} 
        size={[12, 2, 12]} 
        color="#1E90FF" 
        speed={2.0} 
      />
      
      {/* Summit hazards */}
      <Hazard position={[100, 167, 0]} size={[2, 4, 2]} color="#FF4500" type="spikes" />
      <Hazard position={[200, 177, 0]} size={[3, 3, 3]} color="#FF6347" type="spikes" />
      <Hazard position={[250, 182, 0]} size={[2, 2, 2]} color="#FF0000" type="saw" />
      
      {/* Summit collectibles - high value */}
      <Collectible position={[50, 175, 0]} color="#FFD700" type="coin" />
      <Collectible position={[150, 185, 0]} color="#9932CC" type="gem" />
      <Collectible position={[250, 195, 0]} color="#FFD700" type="coin" />
      
      {/* Final goal area */}
      <Platform position={[400, 200, 0]} size={[40, 8, 40]} color="#FFD700" />
      
      {/* Victory flag */}
      <group position={[400, 210, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 15, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 7, 2]}>
          <boxGeometry args={[4, 3, 0.1]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>
      </group>
      
      {/* Victory chests */}
      <Obstacle position={[390, 208, 10]} size={[3, 2, 3]} color="#8B4513" type="box" />
      <Obstacle position={[410, 208, -10]} size={[3, 2, 3]} color="#8B4513" type="box" />
      
      {/* Victory collectibles */}
      <Collectible position={[395, 210, 5]} color="#9932CC" type="gem" />
      <Collectible position={[405, 210, -5]} color="#9932CC" type="gem" />
      <Collectible position={[400, 210, 0]} color="#FF0000" type="heart" />
      
      {/* ===== SECRET AREAS ===== */}
      
      {/* Secret area 1 - Hidden forest grove */}
      <Platform position={[100, 25, 150]} size={[15, 2, 15]} color="#32CD32" />
      <Platform position={[150, 30, 150]} size={[12, 2, 12]} color="#228B22" />
      <Decoration position={[100, 35, 160]} type="tree" color="#228B22" />
      <Decoration position={[150, 40, 140]} type="tree" color="#006400" />
      <Collectible position={[125, 40, 150]} color="#9932CC" type="gem" />
      
      {/* Secret area 2 - Snow cave */}
      <Platform position={[300, 90, -150]} size={[20, 4, 20]} color="#F0F8FF" />
      <Obstacle position={[300, 96, -150]} size={[3, 2, 3]} color="#8B4513" type="box" />
      <Collectible position={[310, 96, -160]} color="#FFD700" type="gem" />
      
      {/* Secret area 3 - Sky island */}
      <Platform position={[200, 220, 150]} size={[20, 4, 20]} color="#87CEEB" />
      <Decoration position={[200, 230, 160]} type="tree" color="#006400" />
      <Collectible position={[200, 230, 140]} color="#9932CC" type="gem" />
      <Collectible position={[210, 230, 150]} color="#FFD700" type="coin" />
      
      {/* ===== GROUND PLANE AND BOUNDARIES ===== */}
      
      {/* Ground plane */}
      <RigidBody type="fixed" position={[250, -25, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[1000, 10, 1000]} />
          <meshStandardMaterial color="#4a7c59" />
        </mesh>
      </RigidBody>
      
      {/* Boundary walls using rocks */}
      {Array.from({length: 20}, (_, i) => {
        const x = i * 30 - 250
        return (
          <Obstacle 
            key={`north-boundary-${i}`}
            position={[x, 15, 250]} 
            size={[4, 6, 4]} 
            color="#696969"
            type="sphere"
          />
        )
      })}
      
      {Array.from({length: 20}, (_, i) => {
        const x = i * 30 - 250
        return (
          <Obstacle 
            key={`south-boundary-${i}`}
            position={[x, 15, -250]} 
            size={[4, 6, 4]} 
            color="#696969"
            type="sphere"
          />
        )
      })}
      
      {/* ===== CHECKPOINT FLAGS ===== */}
      <group position={[450, 40, 10]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 8, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 4, 1.5]}>
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial color="#00FF00" />
        </mesh>
      </group>
      
      <group position={[400, 90, 10]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 8, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 4, 1.5]}>
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial color="#FFFF00" />
        </mesh>
      </group>
      
      <group position={[300, 195, 10]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 8, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 4, 1.5]}>
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>
      </group>
      
      {/* ===== GUIDANCE SIGNS ===== */}
      <group position={[50, 15, 20]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 4, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[4, 2, 0.2]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
      </group>
      
      <group position={[480, 40, 20]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 4, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[4, 2, 0.2]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
      </group>
      
      <group position={[430, 105, 20]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 4, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[4, 2, 0.2]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
      </group>
      
      {/* ===== INTERACTIVE ELEMENTS ===== */}
      
      {/* Buttons and levers */}
      <group position={[200, 15, 40]}>
        <mesh>
          <cylinderGeometry args={[1, 1, 0.5, 8]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>
      </group>
      
      <group position={[200, 70, 30]}>
        <mesh>
          <cylinderGeometry args={[1.5, 1.5, 0.3, 8]} />
          <meshStandardMaterial color="#00FF00" />
        </mesh>
      </group>
      
      <group position={[200, 185, 40]}>
        <mesh>
          <boxGeometry args={[2, 0.5, 2]} />
          <meshStandardMaterial color="#0000FF" />
        </mesh>
      </group>
      
      {/* Ladders for vertical navigation */}
      <group position={[150, 15, -40]}>
        <mesh>
          <boxGeometry args={[0.3, 8, 0.3]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[0.3, 8, 0.3]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {Array.from({length: 8}, (_, i) => (
          <mesh key={i} position={[0.25, -3 + i, 0]}>
            <boxGeometry args={[0.8, 0.2, 0.2]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        ))}
      </group>
      
      {/* Atmospheric elements */}
      <Obstacle position={[125, 15, -25]} size={[2, 4, 2]} color="#8B4513" type="cylinder" />
      <Obstacle position={[275, 75, -22]} size={[3, 2, 8]} color="#228B22" type="box" />
      <Obstacle position={[200, 185, -25]} size={[8, 3, 1]} color="#8B4513" type="box" />
    </group>
  )
}

export default Scene