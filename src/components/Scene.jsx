import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

// Enhanced Platform component with varied textures
function Platform({ position, size = [4, 1, 4], color = "#4a9d4a", rotation = [0, 0, 0], type = "grass" }) {
  const getColor = () => {
    switch(type) {
      case "stone": return "#8b7355"
      case "wood": return "#8b4513"
      case "crystal": return "#9370db"
      case "metal": return "#708090"
      default: return color
    }
  }
  
  return (
    <RigidBody type="fixed" position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial 
          color={getColor()} 
          roughness={type === "crystal" ? 0.1 : 0.8}
          metalness={type === "metal" ? 0.8 : 0.1}
        />
      </mesh>
    </RigidBody>
  )
}

// Enhanced Moving platform
function MovingPlatform({ startPos, endPos, size = [4, 1, 4], color = "#6a6ad4", speed = 1, type = "normal" }) {
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
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.1}
        />
      </mesh>
    </RigidBody>
  )
}

// Enhanced Collectible with different types
function Collectible({ position, type = "coin", color = "#ffd700" }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 2
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.2
    }
  })
  
  const getGeometry = () => {
    switch(type) {
      case "gem": return <octahedronGeometry args={[0.4, 0]} />
      case "fruit": return <sphereGeometry args={[0.35, 8, 6]} />
      default: return <cylinderGeometry args={[0.3, 0.3, 0.1, 8]} />
    }
  }
  
  return (
    <mesh ref={ref} position={position} castShadow>
      {getGeometry()}
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.3}
        metalness={type === "gem" ? 0.8 : 0.1}
        roughness={type === "gem" ? 0.1 : 0.5}
      />
    </mesh>
  )
}

// Enhanced Hazard component
function Hazard({ position, size = [2, 0.5, 2], type = "spikes" }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.2
    }
  })
  
  const getColor = () => {
    switch(type) {
      case "lava": return "#ff4500"
      case "poison": return "#9acd32"
      case "electric": return "#00bfff"
      default: return "#d44a4a"
    }
  }
  
  return (
    <RigidBody type="fixed" position={position} sensor onIntersectionEnter={() => console.log("Hazard hit!")}>
      <mesh ref={ref} castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial 
          color={getColor()} 
          emissive={getColor()} 
          emissiveIntensity={0.3} 
        />
      </mesh>
    </RigidBody>
  )
}

// Jungle Vegetation component
function Vegetation({ position, type = "tree", scale = [1, 1, 1] }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current && type === "tree") {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })
  
  const getGeometry = () => {
    switch(type) {
      case "tree":
        return (
          <group>
            <mesh position={[0, 2, 0]}>
              <cylinderGeometry args={[0.3, 0.5, 4]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            <mesh position={[0, 5, 0]}>
              <sphereGeometry args={[2, 8, 6]} />
              <meshStandardMaterial color="#228b22" />
            </mesh>
          </group>
        )
      case "bush":
        return (
          <mesh>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color="#32cd32" />
          </mesh>
        )
      case "rock":
        return (
          <mesh>
            <dodecahedronGeometry args={[1]} />
            <meshStandardMaterial color="#696969" />
          </mesh>
        )
      case "crystal":
        return (
          <mesh>
            <octahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial 
              color="#9370db" 
              emissive="#9370db" 
              emissiveIntensity={0.2}
              transparent
              opacity={0.8}
            />
          </mesh>
        )
      default:
        return (
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#228b22" />
          </mesh>
        )
    }
  }
  
  return (
    <group ref={ref} position={position} scale={scale}>
      {getGeometry()}
    </group>
  )
}

// Background Mountains
function BackgroundMountains() {
  const mountains = []
  for (let i = 0; i < 20; i++) {
    const x = (i - 10) * 15 + (Math.random() - 0.5) * 10
    const z = -50 - Math.random() * 30
    const height = 15 + Math.random() * 20
    const width = 8 + Math.random() * 6
    
    mountains.push(
      <mesh key={i} position={[x, height/2, z]} castShadow>
        <coneGeometry args={[width, height, 6]} />
        <meshStandardMaterial color="#4a5d23" />
      </mesh>
    )
  }
  return <group>{mountains}</group>
}

// Jungle Floor
function JungleFloor() {
  const floorTiles = []
  for (let x = -20; x <= 180; x += 4) {
    for (let z = -30; z <= 30; z += 4) {
      const height = Math.sin(x * 0.1) * 0.5 + Math.cos(z * 0.1) * 0.3
      floorTiles.push(
        <Platform 
          key={`floor-${x}-${z}`}
          position={[x, height - 2, z]} 
          size={[4, 1, 4]} 
          color="#2d5016"
          type="grass"
        />
      )
    }
  }
  return <group>{floorTiles}</group>
}

// Jungle Canopy
function JungleCanopy() {
  const canopyElements = []
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 200 - 20
    const z = Math.random() * 60 - 30
    const y = 20 + Math.random() * 10
    
    canopyElements.push(
      <mesh key={i} position={[x, y, z]}>
        <sphereGeometry args={[3 + Math.random() * 2, 8, 6]} />
        <meshStandardMaterial 
          color="#228b22" 
          transparent 
          opacity={0.7}
        />
      </mesh>
    )
  }
  return <group>{canopyElements}</group>
}

function Scene() {
  return (
    <group>
      {/* Jungle Floor */}
      <JungleFloor />
      
      {/* Background Mountains */}
      <BackgroundMountains />
      
      {/* Jungle Canopy */}
      <JungleCanopy />
      
      {/* Starting Area - Jungle Clearing */}
      <Platform position={[0, 0, 0]} size={[8, 2, 8]} type="wood" />
      <Vegetation position={[-4, 2, -4]} type="tree" scale={[0.8, 0.8, 0.8]} />
      <Vegetation position={[4, 2, -4]} type="tree" scale={[0.8, 0.8, 0.8]} />
      <Vegetation position={[-4, 2, 4]} type="bush" />
      <Vegetation position={[4, 2, 4]} type="bush" />
      <Collectible position={[0, 3, 0]} type="fruit" color="#ff6347" />
      
      {/* Jungle Path Section 1 */}
      <Platform position={[8, 0, 0]} size={[6, 1, 6]} type="stone" />
      <Platform position={[16, 1, 0]} size={[4, 1, 4]} type="wood" />
      <Platform position={[22, 2, 0]} size={[4, 1, 4]} type="grass" />
      
      {/* Dense vegetation around path */}
      <Vegetation position={[6, 1, -4]} type="tree" scale={[1.2, 1.2, 1.2]} />
      <Vegetation position={[10, 1, 4]} type="tree" scale={[1.1, 1.1, 1.1]} />
      <Vegetation position={[14, 2, -3]} type="bush" scale={[1.5, 1.5, 1.5]} />
      <Vegetation position={[18, 3, 3]} type="rock" />
      <Vegetation position={[20, 3, -2]} type="crystal" scale={[0.6, 0.6, 0.6]} />
      
      <Collectible position={[16, 3, 0]} type="coin" />
      <Collectible position={[22, 4, 0]} type="gem" color="#ff1493" />
      
      {/* Swinging Vine Section */}
      <MovingPlatform 
        startPos={[28, 3, 0]} 
        endPos={[28, 6, 0]} 
        size={[3, 0.5, 3]} 
        color="#8b4513"
        speed={0.8}
        type="wood"
      />
      <Platform position={[34, 6, 0]} size={[5, 1, 5]} type="stone" />
      
      {/* Jungle vines and foliage */}
      <Vegetation position={[26, 8, -2]} type="tree" scale={[0.8, 1.5, 0.8]} />
      <Vegetation position={[30, 8, 2]} type="tree" scale={[0.8, 1.5, 0.8]} />
      <Vegetation position={[32, 7, -3]} type="bush" scale={[1.2, 1.2, 1.2]} />
      <Vegetation position={[36, 7, 3]} type="bush" scale={[1.2, 1.2, 1.2]} />
      
      {/* Crystal Cave Entrance */}
      <Platform position={[42, 6, 0]} size={[6, 2, 6]} type="crystal" />
      <Vegetation position={[39, 8, -3]} type="crystal" scale={[1.2, 1.2, 1.2]} />
      <Vegetation position={[45, 8, 3]} type="crystal" scale={[1.2, 1.2, 1.2]} />
      <Vegetation position={[42, 9, -4]} type="crystal" scale={[0.8, 0.8, 0.8]} />
      <Vegetation position={[42, 9, 4]} type="crystal" scale={[0.8, 0.8, 0.8]} />
      
      <Hazard position={[44, 7, 0]} size={[2, 0.5, 2]} type="electric" />
      <Collectible position={[42, 9, 0]} type="gem" color="#00ffff" />
      
      {/* Wooden Bridge Over Ravine */}
      <Platform position={[50, 6, 0]} size={[2, 0.5, 4]} type="wood" />
      <Platform position={[54, 6, 0]} size={[2, 0.5, 4]} type="wood" />
      <Platform position={[58, 6, 0]} size={[2, 0.5, 4]} type="wood" />
      <Platform position={[62, 6, 0]} size={[2, 0.5, 4]} type="wood" />
      <Platform position={[66, 6, 0]} size={[5, 1, 5]} type="grass" />
      
      {/* Ravine walls with vegetation */}
      <Vegetation position={[52, 3, -6]} type="tree" scale={[1.0, 2.0, 1.0]} />
      <Vegetation position={[56, 3, 6]} type="tree" scale={[1.0, 2.0, 1.0]} />
      <Vegetation position={[60, 3, -6]} type="tree" scale={[1.0, 2.0, 1.0]} />
      <Vegetation position={[64, 3, 6]} type="tree" scale={[1.0, 2.0, 1.0]} />
      
      <Hazard position={[58, 6, 0]} size={[1, 0.3, 1]} type="spikes" />
      <Collectible position={[54, 7, 0]} type="fruit" color="#ffa500" />
      <Collectible position={[62, 7, 0]} type="fruit" color="#ffa500" />
      
      {/* Ancient Temple Section */}
      <Platform position={[74, 8, 0]} size={[8, 2, 8]} type="stone" />
      <Platform position={[74, 10, -6]} size={[4, 4, 2]} type="stone" />
      <Platform position={[74, 10, 6]} size={[4, 4, 2]} type="stone" />
      
      {/* Temple decorations */}
      <Vegetation position={[70, 10, -3]} type="crystal" scale={[1.5, 1.5, 1.5]} />
      <Vegetation position={[78, 10, 3]} type="crystal" scale={[1.5, 1.5, 1.5]} />
      <Vegetation position={[72, 12, 0]} type="rock" scale={[1.2, 1.2, 1.2]} />
      <Vegetation position={[76, 12, 0]} type="rock" scale={[1.2, 1.2, 1.2]} />
      
      {/* Moving Temple Platforms */}
      <MovingPlatform 
        startPos={[82, 8, 0]} 
        endPos={[88, 12, 0]} 
        size={[3, 1, 3]} 
        color="#8b7355"
        speed={1.2}
        type="stone"
      />
      <MovingPlatform 
        startPos={[94, 14, 0]} 
        endPos={[94, 11, 0]} 
        size={[3, 1, 3]} 
        color="#8b7355"
        speed={1.0}
        type="stone"
      />
      
      {/* Lava Section */}
      <Platform position={[100, 14, 0]} size={[6, 1, 6]} type="stone" />
      <Hazard position={[98, 13, -2]} size={[2, 1, 2]} type="lava" />
      <Hazard position={[102, 13, 2]} size={[2, 1, 2]} type="lava" />
      <Hazard position={[100, 13, -4]} size={[2, 1, 2]} type="lava" />
      <Hazard position={[100, 13, 4]} size={[2, 1, 2]} type="lava" />
      
      {/* Lava environment */}
      <Vegetation position={[96, 15, -4]} type="rock" scale={[1.5, 1.5, 1.5]} />
      <Vegetation position={[104, 15, 4]} type="rock" scale={[1.5, 1.5, 1.5]} />
      
      <Collectible position={[100, 16, 0]} type="gem" color="#ff4500" />
      
      {/* Precision Jumping Section */}
      <Platform position={[108, 14, 0]} size={[2, 1, 2]} type="metal" />
      <Platform position={[112, 15, 0]} size={[2, 1, 2]} type="metal" />
      <Platform position={[116, 16, 0]} size={[2, 1, 2]} type="metal" />
      <Platform position={[120, 17, 0]} size={[2, 1, 2]} type="metal" />
      
      {/* Industrial/mechanical vegetation */}
      <Vegetation position={[106, 15, -3]} type="rock" scale={[0.8, 0.8, 0.8]} />
      <Vegetation position={[110, 16, 3]} type="rock" scale={[0.8, 0.8, 0.8]} />
      <Vegetation position={[114, 17, -3]} type="rock" scale={[0.8, 0.8, 0.8]} />
      <Vegetation position={[118, 18, 3]} type="rock" scale={[0.8, 0.8, 0.8]} />
      
      <Collectible position={[108, 16, 0]} type="coin" />
      <Collectible position={[112, 17, 0]} type="coin" />
      <Collectible position={[116, 18, 0]} type="coin" />
      <Collectible position={[120, 19, 0]} type="coin" />
      
      {/* Secret Jungle Path */}
      <Platform position={[70, 12, -12]} size={[4, 1, 4]} type="wood" />
      <Platform position={[76, 13, -12]} size={[4, 1, 4]} type="wood" />
      <Platform position={[82, 14, -12]} size={[4, 1, 4]} type="wood" />
      
      {/* Secret path vegetation */}
      <Vegetation position={[68, 13, -15]} type="tree" scale={[1.3, 1.3, 1.3]} />
      <Vegetation position={[72, 13, -9]} type="tree" scale={[1.3, 1.3, 1.3]} />
      <Vegetation position={[78, 14, -15]} type="tree" scale={[1.3, 1.3, 1.3]} />
      <Vegetation position={[84, 15, -9]} type="tree" scale={[1.3, 1.3, 1.3]} />
      <Vegetation position={[74, 14, -14]} type="bush" scale={[1.5, 1.5, 1.5]} />
      <Vegetation position={[80, 15, -14]} type="bush" scale={[1.5, 1.5, 1.5]} />
      
      <Collectible position={[70, 14, -12]} type="gem" color="#ff1493" />
      <Collectible position={[76, 15, -12]} type="gem" color="#ff1493" />
      <Collectible position={[82, 16, -12]} type="gem" color="#ff1493" />
      
      {/* Waterfall Section */}
      <Platform position={[126, 17, 0]} size={[6, 1, 6]} type="stone" />
      <Platform position={[134, 19, 0]} size={[4, 1, 4]} type="stone" />
      
      {/* Waterfall effects (using transparent blue boxes) */}
      <mesh position={[130, 25, -3]}>
        <boxGeometry args={[1, 15, 1]} />
        <meshStandardMaterial 
          color="#00bfff" 
          transparent 
          opacity={0.6}
          emissive="#00bfff"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[132, 25, 3]}>
        <boxGeometry args={[1, 15, 1]} />
        <meshStandardMaterial 
          color="#00bfff" 
          transparent 
          opacity={0.6}
          emissive="#00bfff"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Waterfall environment */}
      <Vegetation position={[124, 18, -4]} type="tree" scale={[1.4, 1.4, 1.4]} />
      <Vegetation position={[128, 18, 4]} type="tree" scale={[1.4, 1.4, 1.4]} />
      <Vegetation position={[132, 20, -4]} type="tree" scale={[1.4, 1.4, 1.4]} />
      <Vegetation position={[136, 20, 4]} type="tree" scale={[1.4, 1.4, 1.4]} />
      
      {/* Final Challenge - Multi-level Temple */}
      <MovingPlatform 
        startPos={[140, 19, 0]} 
        endPos={[146, 22, 0]} 
        size={[3, 1, 3]} 
        color="#8b7355"
        speed={1.5}
        type="stone"
      />
      <MovingPlatform 
        startPos={[152, 24, 0]} 
        endPos={[152, 21, 0]} 
        size={[3, 1, 3]} 
        color="#8b7355"
        speed={1.3}
        type="stone"
      />
      <MovingPlatform 
        startPos={[158, 22, 0]} 
        endPos={[162, 25, 0]} 
        size={[3, 1, 3]} 
        color="#8b7355"
        speed={1.1}
        type="stone"
      />
      
      {/* Victory Temple */}
      <Platform position={[168, 25, 0]} size={[10, 3, 10]} type="crystal" />
      <Platform position={[168, 28, -8]} size={[6, 6, 2]} type="crystal" />
      <Platform position={[168, 28, 8]} size={[6, 6, 2]} type="crystal" />
      <Platform position={[160, 28, 0]} size={[2, 6, 6]} type="crystal" />
      <Platform position={[176, 28, 0]} size={[2, 6, 6]} type="crystal" />
      
      {/* Victory temple decorations */}
      <Vegetation position={[164, 31, -4]} type="crystal" scale={[2, 2, 2]} />
      <Vegetation position={[172, 31, 4]} type="crystal" scale={[2, 2, 2]} />
      <Vegetation position={[164, 31, 4]} type="crystal" scale={[2, 2, 2]} />
      <Vegetation position={[172, 31, -4]} type="crystal" scale={[2, 2, 2]} />
      <Vegetation position={[168, 33, 0]} type="crystal" scale={[3, 3, 3]} />
      
      <Collectible position={[166, 28, -2]} type="gem" color="#ff1493" />
      <Collectible position={[168, 28, 0]} type="gem" color="#ffd700" />
      <Collectible position={[170, 28, 2]} type="gem" color="#00ffff" />
      
      {/* Lower Alternative Path */}
      <Platform position={[80, 4, 12]} size={[4, 1, 4]} type="wood" />
      <Platform position={[86, 3, 12]} size={[4, 1, 4]} type="wood" />
      <Platform position={[92, 2, 12]} size={[4, 1, 4]} type="wood" />
      <Platform position={[98, 3, 12]} size={[4, 1, 4]} type="wood" />
      <Platform position={[104, 4, 12]} size={[4, 1, 4]} type="wood" />
      
      {/* Lower path vegetation */}
      <Vegetation position={[78, 5, 15]} type="tree" scale={[1.2, 1.2, 1.2]} />
      <Vegetation position={[84, 4, 9]} type="tree" scale={[1.2, 1.2, 1.2]} />
      <Vegetation position={[90, 3, 15]} type="tree" scale={[1.2, 1.2, 1.2]} />
      <Vegetation position={[96, 4, 9]} type="tree" scale={[1.2, 1.2, 1.2]} />
      <Vegetation position={[102, 5, 15]} type="tree" scale={[1.2, 1.2, 1.2]} />
      <Vegetation position={[106, 5, 9]} type="tree" scale={[1.2, 1.2, 1.2]} />
      
      <Collectible position={[86, 5, 12]} type="fruit" color="#32cd32" />
      <Collectible position={[98, 5, 12]} type="fruit" color="#32cd32" />
      
      {/* Connecting Platforms - No gaps! */}
      <Platform position={[6, 0, 0]} size={[2, 1, 4]} type="grass" />
      <Platform position={[13, 0.5, 0]} size={[2, 1, 4]} type="grass" />
      <Platform position={[19, 1.5, 0]} size={[2, 1, 4]} type="grass" />
      <Platform position={[25, 2.5, 0]} size={[2, 1, 4]} type="grass" />
      <Platform position={[31, 4.5, 0]} size={[2, 1, 4]} type="grass" />
      <Platform position={[37, 6, 0]} size={[2, 1, 4]} type="grass" />
      <Platform position={[45, 6, 0]} size={[2, 1, 4]} type="grass" />
      <Platform position={[52, 6, 0]} size={[2, 1, 4]} type="wood" />
      <Platform position={[56, 6, 0]} size={[2, 1, 4]} type="wood" />
      <Platform position={[60, 6, 0]} size={[2, 1, 4]} type="wood" />
      <Platform position={[64, 6, 0]} size={[2, 1, 4]} type="wood" />
      <Platform position={[69, 7, 0]} size={[2, 1, 4]} type="stone" />
      <Platform position={[77, 9, 0]} size={[2, 1, 4]} type="stone" />
      <Platform position={[85, 10, 0]} size={[2, 1, 4]} type="stone" />
      <Platform position={[91, 12, 0]} size={[2, 1, 4]} type="stone" />
      <Platform position={[97, 13, 0]} size={[2, 1, 4]} type="stone" />
      <Platform position={[103, 14, 0]} size={[2, 1, 4]} type="metal" />
      <Platform position={[110, 14.5, 0]} size={[2, 1, 4]} type="metal" />
      <Platform position={[114, 15.5, 0]} size={[2, 1, 4]} type="metal" />
      <Platform position={[118, 16.5, 0]} size={[2, 1, 4]} type="metal" />
      <Platform position={[122, 17, 0]} size={[2, 1, 4]} type="stone" />
      <Platform position={[129, 18, 0]} size={[2, 1, 4]} type="stone" />
      <Platform position={[137, 20, 0]} size={[2, 1, 4]} type="stone" />
      <Platform position={[143, 21, 0]} size={[2, 1, 4]} type="stone" />
      <Platform position={[149, 22, 0]} size={[2, 1, 4]} type="stone" />
      <Platform position={[155, 23, 0]} size={[2, 1, 4]} type="stone" />
      <Platform position={[161, 24, 0]} size={[2, 1, 4]} type="crystal" />
      <Platform position={[164, 25, 0]} size={[2, 1, 4]} type="crystal" />
      
      {/* Side walls with vegetation to create enclosed feeling */}
      {Array.from({length: 40}, (_, i) => {
        const x = i * 4
        return (
          <group key={`side-walls-${i}`}>
            <Vegetation position={[x, 5, -15]} type="tree" scale={[1.5, 2, 1.5]} />
            <Vegetation position={[x, 5, 15]} type="tree" scale={[1.5, 2, 1.5]} />
            <Vegetation position={[x + 2, 3, -12]} type="bush" scale={[1.2, 1.2, 1.2]} />
            <Vegetation position={[x + 2, 3, 12]} type="bush" scale={[1.2, 1.2, 1.2]} />
          </group>
        )
      })}
      
      {/* Additional ground cover vegetation */}
      {Array.from({length: 100}, (_, i) => {
        const x = Math.random() * 180
        const z = (Math.random() - 0.5) * 25
        const y = -1 + Math.sin(x * 0.1) * 0.5
        const type = Math.random() > 0.7 ? "bush" : "rock"
        const scale = [0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5]
        
        return (
          <Vegetation 
            key={`ground-cover-${i}`}
            position={[x, y, z]} 
            type={type} 
            scale={scale} 
          />
        )
      })}
    </group>
  )
}

export default Scene