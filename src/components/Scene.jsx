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
  for (let i = 0; i < 50; i++) {
    const x = (i - 25) * 30 + (Math.random() - 0.5) * 20
    const z = -150 - Math.random() * 100
    const height = 40 + Math.random() * 60
    const width = 20 + Math.random() * 15
    
    mountains.push(
      <mesh key={i} position={[x, height/2, z]} castShadow>
        <coneGeometry args={[width, height, 6]} />
        <meshStandardMaterial color="#4a5d23" />
      </mesh>
    )
  }
  return <group>{mountains}</group>
}

// Jungle Floor - Massive 500x500 coverage
function JungleFloor() {
  const floorTiles = []
  for (let x = -100; x <= 600; x += 8) {
    for (let z = -150; z <= 150; z += 8) {
      const height = Math.sin(x * 0.05) * 1 + Math.cos(z * 0.05) * 0.8
      floorTiles.push(
        <Platform 
          key={`floor-${x}-${z}`}
          position={[x, height - 4, z]} 
          size={[8, 2, 8]} 
          color="#2d5016"
          type="grass"
        />
      )
    }
  }
  return <group>{floorTiles}</group>
}

// Jungle Canopy - Expanded for 500x500
function JungleCanopy() {
  const canopyElements = []
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 700 - 100
    const z = Math.random() * 300 - 150
    const y = 50 + Math.random() * 30
    
    canopyElements.push(
      <mesh key={i} position={[x, y, z]}>
        <sphereGeometry args={[6 + Math.random() * 4, 8, 6]} />
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
      
      {/* Starting Area - Jungle Clearing (0-50) */}
      <Platform position={[0, 0, 0]} size={[20, 4, 20]} type="wood" />
      <Vegetation position={[-10, 4, -10]} type="tree" scale={[1.5, 1.5, 1.5]} />
      <Vegetation position={[10, 4, -10]} type="tree" scale={[1.5, 1.5, 1.5]} />
      <Vegetation position={[-10, 4, 10]} type="bush" scale={[2, 2, 2]} />
      <Vegetation position={[10, 4, 10]} type="bush" scale={[2, 2, 2]} />
      <Collectible position={[0, 6, 0]} type="fruit" color="#ff6347" />
      
      {/* Early Jungle Path Section (50-100) */}
      <Platform position={[25, 0, 0]} size={[15, 2, 15]} type="stone" />
      <Platform position={[50, 2, 0]} size={[10, 2, 10]} type="wood" />
      <Platform position={[70, 4, 0]} size={[10, 2, 10]} type="grass" />
      
      {/* Dense vegetation around early path */}
      <Vegetation position={[15, 2, -15]} type="tree" scale={[2, 2, 2]} />
      <Vegetation position={[30, 2, 15]} type="tree" scale={[2, 2, 2]} />
      <Vegetation position={[45, 4, -12]} type="bush" scale={[2.5, 2.5, 2.5]} />
      <Vegetation position={[55, 6, 12]} type="rock" scale={[1.5, 1.5, 1.5]} />
      <Vegetation position={[65, 6, -8]} type="crystal" scale={[1.2, 1.2, 1.2]} />
      
      <Collectible position={[50, 6, 0]} type="coin" />
      <Collectible position={[70, 8, 0]} type="gem" color="#ff1493" />
      
      {/* First Major Bridge Section (100-150) */}
      <MovingPlatform 
        startPos={[90, 6, 0]} 
        endPos={[90, 12, 0]} 
        size={[8, 1, 8]} 
        color="#8b4513"
        speed={0.8}
        type="wood"
      />
      <Platform position={[110, 12, 0]} size={[12, 2, 12]} type="stone" />
      
      {/* Bridge environment */}
      <Vegetation position={[85, 16, -8]} type="tree" scale={[1.5, 3, 1.5]} />
      <Vegetation position={[95, 16, 8]} type="tree" scale={[1.5, 3, 1.5]} />
      <Vegetation position={[105, 14, -12]} type="bush" scale={[2, 2, 2]} />
      <Vegetation position={[115, 14, 12]} type="bush" scale={[2, 2, 2]} />
      
      {/* Crystal Cave Complex (150-200) */}
      <Platform position={[130, 12, 0]} size={[15, 4, 15]} type="crystal" />
      <Platform position={[150, 16, 0]} size={[12, 3, 12]} type="crystal" />
      <Platform position={[170, 20, 0]} size={[10, 2, 10]} type="crystal" />
      
      {/* Crystal formations */}
      <Vegetation position={[125, 16, -12]} type="crystal" scale={[2.5, 2.5, 2.5]} />
      <Vegetation position={[135, 16, 12]} type="crystal" scale={[2.5, 2.5, 2.5]} />
      <Vegetation position={[145, 20, -10]} type="crystal" scale={[2, 2, 2]} />
      <Vegetation position={[155, 20, 10]} type="crystal" scale={[2, 2, 2]} />
      <Vegetation position={[165, 24, -8]} type="crystal" scale={[1.8, 1.8, 1.8]} />
      <Vegetation position={[175, 24, 8]} type="crystal" scale={[1.8, 1.8, 1.8]} />
      
      <Hazard position={[140, 14, 0]} size={[4, 1, 4]} type="electric" />
      <Collectible position={[130, 18, 0]} type="gem" color="#00ffff" />
      <Collectible position={[150, 22, 0]} type="gem" color="#9370db" />
      <Collectible position={[170, 26, 0]} type="gem" color="#ff69b4" />
      
      {/* Wooden Bridge Network (200-250) */}
      <Platform position={[190, 20, 0]} size={[5, 1, 10]} type="wood" />
      <Platform position={[200, 20, 0]} size={[5, 1, 10]} type="wood" />
      <Platform position={[210, 20, 0]} size={[5, 1, 10]} type="wood" />
      <Platform position={[220, 20, 0]} size={[5, 1, 10]} type="wood" />
      <Platform position={[230, 20, 0]} size={[5, 1, 10]} type="wood" />
      <Platform position={[240, 20, 0]} size={[12, 2, 12]} type="grass" />
      
      {/* Bridge ravine environment */}
      <Vegetation position={[185, 8, -20]} type="tree" scale={[2, 4, 2]} />
      <Vegetation position={[195, 8, 20]} type="tree" scale={[2, 4, 2]} />
      <Vegetation position={[205, 8, -20]} type="tree" scale={[2, 4, 2]} />
      <Vegetation position={[215, 8, 20]} type="tree" scale={[2, 4, 2]} />
      <Vegetation position={[225, 8, -20]} type="tree" scale={[2, 4, 2]} />
      <Vegetation position={[235, 8, 20]} type="tree" scale={[2, 4, 2]} />
      
      <Hazard position={[210, 20, 0]} size={[2, 0.5, 2]} type="spikes" />
      <Collectible position={[200, 22, 0]} type="fruit" color="#ffa500" />
      <Collectible position={[220, 22, 0]} type="fruit" color="#ffa500" />
      <Collectible position={[240, 24, 0]} type="coin" />
      
      {/* Ancient Temple Complex (250-300) */}
      <Platform position={[260, 24, 0]} size={[20, 4, 20]} type="stone" />
      <Platform position={[280, 28, -15]} size={[10, 8, 5]} type="stone" />
      <Platform position={[280, 28, 15]} size={[10, 8, 5]} type="stone" />
      <Platform position={[300, 32, 0]} size={[15, 6, 15]} type="stone" />
      
      {/* Temple decorations */}
      <Vegetation position={[250, 28, -12]} type="crystal" scale={[3, 3, 3]} />
      <Vegetation position={[270, 28, 12]} type="crystal" scale={[3, 3, 3]} />
      <Vegetation position={[290, 32, -8]} type="rock" scale={[2.5, 2.5, 2.5]} />
      <Vegetation position={[310, 32, 8]} type="rock" scale={[2.5, 2.5, 2.5]} />
      <Vegetation position={[300, 38, 0]} type="crystal" scale={[2, 4, 2]} />
      
      {/* Moving Temple Platforms */}
      <MovingPlatform 
        startPos={[320, 32, 0]} 
        endPos={[340, 40, 0]} 
        size={[8, 2, 8]} 
        color="#8b7355"
        speed={1.2}
        type="stone"
      />
      <MovingPlatform 
        startPos={[360, 44, 0]} 
        endPos={[360, 36, 0]} 
        size={[8, 2, 8]} 
        color="#8b7355"
        speed={1.0}
        type="stone"
      />
      
      {/* Lava Chamber Section (300-350) */}
      <Platform position={[380, 44, 0]} size={[15, 2, 15]} type="stone" />
      <Hazard position={[375, 42, -8]} size={[5, 2, 5]} type="lava" />
      <Hazard position={[385, 42, 8]} size={[5, 2, 5]} type="lava" />
      <Hazard position={[380, 42, -15]} size={[5, 2, 5]} type="lava" />
      <Hazard position={[380, 42, 15]} size={[5, 2, 5]} type="lava" />
      
      {/* Lava environment */}
      <Vegetation position={[370, 46, -15]} type="rock" scale={[3, 3, 3]} />
      <Vegetation position={[390, 46, 15]} type="rock" scale={[3, 3, 3]} />
      
      <Collectible position={[380, 48, 0]} type="gem" color="#ff4500" />
      
      {/* Precision Jumping Section (350-400) */}
      <Platform position={[400, 44, 0]} size={[5, 2, 5]} type="metal" />
      <Platform position={[410, 46, 0]} size={[5, 2, 5]} type="metal" />
      <Platform position={[420, 48, 0]} size={[5, 2, 5]} type="metal" />
      <Platform position={[430, 50, 0]} size={[5, 2, 5]} type="metal" />
      <Platform position={[440, 52, 0]} size={[5, 2, 5]} type="metal" />
      
      {/* Industrial environment */}
      <Vegetation position={[395, 46, -12]} type="rock" scale={[1.5, 1.5, 1.5]} />
      <Vegetation position={[405, 48, 12]} type="rock" scale={[1.5, 1.5, 1.5]} />
      <Vegetation position={[415, 50, -12]} type="rock" scale={[1.5, 1.5, 1.5]} />
      <Vegetation position={[425, 52, 12]} type="rock" scale={[1.5, 1.5, 1.5]} />
      <Vegetation position={[435, 54, -12]} type="rock" scale={[1.5, 1.5, 1.5]} />
      <Vegetation position={[445, 56, 12]} type="rock" scale={[1.5, 1.5, 1.5]} />
      
      <Collectible position={[400, 48, 0]} type="coin" />
      <Collectible position={[410, 50, 0]} type="coin" />
      <Collectible position={[420, 52, 0]} type="coin" />
      <Collectible position={[430, 54, 0]} type="coin" />
      <Collectible position={[440, 56, 0]} type="coin" />
      
      {/* Waterfall Section (400-450) */}
      <Platform position={[460, 52, 0]} size={[15, 2, 15]} type="stone" />
      <Platform position={[480, 56, 0]} size={[10, 2, 10]} type="stone" />
      
      {/* Waterfall effects */}
      <mesh position={[470, 70, -12]}>
        <boxGeometry args={[3, 40, 3]} />
        <meshStandardMaterial 
          color="#00bfff" 
          transparent 
          opacity={0.6}
          emissive="#00bfff"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[475, 70, 12]}>
        <boxGeometry args={[3, 40, 3]} />
        <meshStandardMaterial 
          color="#00bfff" 
          transparent 
          opacity={0.6}
          emissive="#00bfff"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Waterfall environment */}
      <Vegetation position={[450, 54, -15]} type="tree" scale={[3, 3, 3]} />
      <Vegetation position={[470, 54, 15]} type="tree" scale={[3, 3, 3]} />
      <Vegetation position={[485, 58, -15]} type="tree" scale={[3, 3, 3]} />
      <Vegetation position={[490, 58, 15]} type="tree" scale={[3, 3, 3]} />
      
      {/* Final Challenge Section (450-500) */}
      <MovingPlatform 
        startPos={[500, 56, 0]} 
        endPos={[520, 64, 0]} 
        size={[8, 2, 8]} 
        color="#8b7355"
        speed={1.5}
        type="stone"
      />
      <MovingPlatform 
        startPos={[540, 68, 0]} 
        endPos={[540, 60, 0]} 
        size={[8, 2, 8]} 
        color="#8b7355"
        speed={1.3}
        type="stone"
      />
      <MovingPlatform 
        startPos={[560, 64, 0]} 
        endPos={[580, 72, 0]} 
        size={[8, 2, 8]} 
        color="#8b7355"
        speed={1.1}
        type="stone"
      />
      
      {/* Victory Crystal Temple (500+) */}
      <Platform position={[600, 72, 0]} size={[25, 6, 25]} type="crystal" />
      <Platform position={[600, 78, -20]} size={[15, 12, 5]} type="crystal" />
      <Platform position={[600, 78, 20]} size={[15, 12, 5]} type="crystal" />
      <Platform position={[580, 78, 0]} size={[5, 12, 15]} type="crystal" />
      <Platform position={[620, 78, 0]} size={[5, 12, 15]} type="crystal" />
      
      {/* Victory temple decorations */}
      <Vegetation position={[590, 84, -10]} type="crystal" scale={[4, 4, 4]} />
      <Vegetation position={[610, 84, 10]} type="crystal" scale={[4, 4, 4]} />
      <Vegetation position={[590, 84, 10]} type="crystal" scale={[4, 4, 4]} />
      <Vegetation position={[610, 84, -10]} type="crystal" scale={[4, 4, 4]} />
      <Vegetation position={[600, 90, 0]} type="crystal" scale={[6, 6, 6]} />
      
      <Collectible position={[595, 78, -5]} type="gem" color="#ff1493" />
      <Collectible position={[600, 78, 0]} type="gem" color="#ffd700" />
      <Collectible position={[605, 78, 5]} type="gem" color="#00ffff" />
      
      {/* Secret Jungle Paths */}
      <Platform position={[200, 32, -40]} size={[10, 2, 10]} type="wood" />
      <Platform position={[220, 36, -40]} size={[10, 2, 10]} type="wood" />
      <Platform position={[240, 40, -40]} size={[10, 2, 10]} type="wood" />
      <Platform position={[260, 44, -40]} size={[10, 2, 10]} type="wood" />
      <Platform position={[280, 48, -40]} size={[10, 2, 10]} type="wood" />
      
      {/* Secret path vegetation */}
      <Vegetation position={[195, 34, -50]} type="tree" scale={[2.5, 2.5, 2.5]} />
      <Vegetation position={[205, 34, -30]} type="tree" scale={[2.5, 2.5, 2.5]} />
      <Vegetation position={[225, 38, -50]} type="tree" scale={[2.5, 2.5, 2.5]} />
      <Vegetation position={[245, 42, -30]} type="tree" scale={[2.5, 2.5, 2.5]} />
      <Vegetation position={[265, 46, -50]} type="tree" scale={[2.5, 2.5, 2.5]} />
      <Vegetation position={[285, 50, -30]} type="tree" scale={[2.5, 2.5, 2.5]} />
      
      <Collectible position={[200, 36, -40]} type="gem" color="#ff1493" />
      <Collectible position={[240, 44, -40]} type="gem" color="#ff1493" />
      <Collectible position={[280, 52, -40]} type="gem" color="#ff1493" />
      
      {/* Lower Alternative Paths */}
      <Platform position={[300, 12, 40]} size={[10, 2, 10]} type="wood" />
      <Platform position={[320, 10, 40]} size={[10, 2, 10]} type="wood" />
      <Platform position={[340, 8, 40]} size={[10, 2, 10]} type="wood" />
      <Platform position={[360, 10, 40]} size={[10, 2, 10]} type="wood" />
      <Platform position={[380, 12, 40]} size={[10, 2, 10]} type="wood" />
      <Platform position={[400, 14, 40]} size={[10, 2, 10]} type="wood" />
      
      {/* Lower path vegetation */}
      <Vegetation position={[295, 14, 50]} type="tree" scale={[2.5, 2.5, 2.5]} />
      <Vegetation position={[315, 12, 30]} type="tree" scale={[2.5, 2.5, 2.5]} />
      <Vegetation position={[335, 10, 50]} type="tree" scale={[2.5, 2.5, 2.5]} />
      <Vegetation position={[355, 12, 30]} type="tree" scale={[2.5, 2.5, 2.5]} />
      <Vegetation position={[375, 14, 50]} type="tree" scale={[2.5, 2.5, 2.5]} />
      <Vegetation position={[395, 16, 30]} type="tree" scale={[2.5, 2.5, 2.5]} />
      
      <Collectible position={[320, 14, 40]} type="fruit" color="#32cd32" />
      <Collectible position={[360, 14, 40]} type="fruit" color="#32cd32" />
      <Collectible position={[400, 18, 40]} type="fruit" color="#32cd32" />
      
      {/* Connecting Platforms - No gaps across 500 units! */}
      {Array.from({length: 100}, (_, i) => {
        const x = i * 5
        const y = Math.sin(x * 0.02) * 2 + x * 0.1
        return (
          <Platform 
            key={`connector-${i}`}
            position={[x + 12.5, y, 0]} 
            size={[5, 2, 8]} 
            type={x < 100 ? "grass" : x < 200 ? "wood" : x < 300 ? "stone" : x < 400 ? "metal" : "crystal"} 
          />
        )
      })}
      
      {/* Side walls with massive vegetation for 500x500 coverage */}
      {Array.from({length: 125}, (_, i) => {
        const x = i * 4
        return (
          <group key={`side-walls-${i}`}>
            <Vegetation position={[x, 10, -60]} type="tree" scale={[3, 4, 3]} />
            <Vegetation position={[x, 10, 60]} type="tree" scale={[3, 4, 3]} />
            <Vegetation position={[x + 2, 6, -45]} type="bush" scale={[2.5, 2.5, 2.5]} />
            <Vegetation position={[x + 2, 6, 45]} type="bush" scale={[2.5, 2.5, 2.5]} />
            <Vegetation position={[x, 8, -75]} type="rock" scale={[2, 2, 2]} />
            <Vegetation position={[x, 8, 75]} type="rock" scale={[2, 2, 2]} />
          </group>
        )
      })}
      
      {/* Additional ground cover vegetation for massive scale */}
      {Array.from({length: 500}, (_, i) => {
        const x = Math.random() * 600
        const z = (Math.random() - 0.5) * 120
        const y = -2 + Math.sin(x * 0.05) * 1
        const type = Math.random() > 0.6 ? "bush" : "rock"
        const scale = [1 + Math.random(), 1 + Math.random(), 1 + Math.random()]
        
        return (
          <Vegetation 
            key={`ground-cover-${i}`}
            position={[x, y, z]} 
            type={type} 
            scale={scale} 
          />
        )
      })}
      
      {/* Atmospheric crystal formations throughout */}
      {Array.from({length: 50}, (_, i) => {
        const x = Math.random() * 600
        const z = (Math.random() - 0.5) * 100
        const y = 20 + Math.random() * 40
        const scale = [1.5 + Math.random() * 2, 1.5 + Math.random() * 2, 1.5 + Math.random() * 2]
        
        return (
          <Vegetation 
            key={`crystal-formation-${i}`}
            position={[x, y, z]} 
            type="crystal" 
            scale={scale} 
          />
        )
      })}
      
      {/* Hazard zones throughout the massive map */}
      <Hazard position={[150, 14, 0]} size={[3, 1, 3]} type="electric" />
      <Hazard position={[250, 26, 0]} size={[4, 1, 4]} type="spikes" />
      <Hazard position={[350, 46, 0]} size={[5, 1, 5]} type="lava" />
      <Hazard position={[450, 54, 0]} size={[3, 1, 3]} type="poison" />
      <Hazard position={[550, 66, 0]} size={[4, 1, 4]} type="electric" />
      
      {/* Collectibles scattered throughout the massive environment */}
      {Array.from({length: 100}, (_, i) => {
        const x = i * 6 + Math.random() * 10
        const y = 5 + Math.sin(x * 0.02) * 2 + x * 0.1 + 3
        const z = (Math.random() - 0.5) * 20
        const types = ["coin", "gem", "fruit"]
        const colors = ["#ffd700", "#ff1493", "#00ffff", "#32cd32", "#ff6347"]
        const type = types[Math.floor(Math.random() * types.length)]
        const color = colors[Math.floor(Math.random() * colors.length)]
        
        return (
          <Collectible 
            key={`scattered-collectible-${i}`}
            position={[x, y, z]} 
            type={type} 
            color={color} 
          />
        )
      })}
    </group>
  )
}

export default Scene