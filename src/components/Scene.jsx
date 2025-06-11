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

function Scene() {
  return (
    <group>
      {/* Simple starting platform to test */}
      <Platform position={[0, 0, 0]} size={[20, 4, 20]} type="wood" />
      
      {/* Basic test platforms */}
      <Platform position={[25, 0, 0]} size={[15, 2, 15]} type="stone" />
      <Platform position={[50, 2, 0]} size={[10, 2, 10]} type="wood" />
      <Platform position={[70, 4, 0]} size={[10, 2, 10]} type="grass" />
      
      {/* Some vegetation */}
      <Vegetation position={[-10, 4, -10]} type="tree" scale={[1.5, 1.5, 1.5]} />
      <Vegetation position={[10, 4, -10]} type="tree" scale={[1.5, 1.5, 1.5]} />
      <Vegetation position={[-10, 4, 10]} type="bush" scale={[2, 2, 2]} />
      <Vegetation position={[10, 4, 10]} type="bush" scale={[2, 2, 2]} />
      
      {/* Some collectibles */}
      <Collectible position={[0, 6, 0]} type="fruit" color="#ff6347" />
      <Collectible position={[50, 6, 0]} type="coin" />
      <Collectible position={[70, 8, 0]} type="gem" color="#ff1493" />
      
      {/* Moving platform */}
      <MovingPlatform 
        startPos={[90, 6, 0]} 
        endPos={[90, 12, 0]} 
        size={[8, 1, 8]} 
        color="#8b4513"
        speed={0.8}
        type="wood"
      />
      
      {/* Ground plane */}
      <RigidBody type="fixed" position={[0, -10, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[200, 1, 200]} />
          <meshStandardMaterial color="#2d5016" />
        </mesh>
      </RigidBody>
    </group>
  )
}

export default Scene