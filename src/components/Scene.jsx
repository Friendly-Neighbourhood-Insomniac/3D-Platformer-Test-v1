import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

// Platform component with physics
function Platform({ position, size = [4, 1, 4], color = "#4a9d4a", rotation = [0, 0, 0] }) {
  return (
    <RigidBody type="fixed" position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}

// Moving platform component
function MovingPlatform({ startPos, endPos, size = [4, 1, 4], color = "#6a6ad4", speed = 1 }) {
  const ref = useRef()
  const direction = useRef(1)
  
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

// Collectible component
function Collectible({ position, color = "#ffd700" }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 2
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.2
    }
  })
  
  return (
    <mesh ref={ref} position={position} castShadow>
      <sphereGeometry args={[0.3, 8, 6]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  )
}

// Hazard component
function Hazard({ position, size = [2, 0.5, 2], color = "#d44a4a" }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.2
    }
  })
  
  return (
    <RigidBody type="fixed" position={position} sensor onIntersectionEnter={() => console.log("Hazard hit!")}>
      <mesh ref={ref} castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </RigidBody>
  )
}

// Ramp component
function Ramp({ position, size = [4, 1, 4], rotation = [0, 0, 0], color = "#4a9d4a" }) {
  return (
    <RigidBody type="fixed" position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}

// Checkpoint component
function Checkpoint({ position, color = "#4ad4d4" }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime
      ref.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
  })
  
  return (
    <mesh ref={ref} position={[position[0], position[1] + 2, position[2]]}>
      <cylinderGeometry args={[0.5, 0.5, 3, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  )
}

function Scene() {
  return (
    <group>
      {/* Starting Area - Wide platform for player spawn */}
      <Platform position={[0, 0, 0]} size={[8, 1, 8]} />
      <Collectible position={[0, 2, 0]} />
      
      {/* Tutorial Section - Basic jumps */}
      <Platform position={[10, 0, 0]} size={[4, 1, 4]} />
      <Platform position={[16, 1, 0]} size={[4, 1, 4]} />
      <Platform position={[22, 2, 0]} size={[4, 1, 4]} />
      <Collectible position={[16, 3, 0]} />
      <Collectible position={[22, 4, 0]} />
      
      {/* First Challenge - Moving platforms */}
      <MovingPlatform 
        startPos={[28, 3, 0]} 
        endPos={[28, 6, 0]} 
        size={[3, 1, 3]} 
        speed={0.8}
      />
      <Platform position={[34, 6, 0]} size={[4, 1, 4]} />
      <Checkpoint position={[34, 6, 0]} />
      
      {/* Hazard Section */}
      <Platform position={[40, 6, 0]} size={[6, 1, 4]} />
      <Hazard position={[42, 7, 0]} size={[2, 0.5, 2]} />
      <Platform position={[48, 6, 0]} size={[4, 1, 4]} />
      <Collectible position={[48, 8, 0]} />
      
      {/* Ramp Section */}
      <Ramp position={[54, 7, 0]} size={[6, 1, 4]} rotation={[0, 0, 0.2]} />
      <Platform position={[62, 9, 0]} size={[4, 1, 4]} />
      
      {/* Complex Moving Section */}
      <MovingPlatform 
        startPos={[68, 9, 0]} 
        endPos={[74, 9, 0]} 
        size={[3, 1, 3]} 
        speed={1.2}
      />
      <MovingPlatform 
        startPos={[80, 12, 0]} 
        endPos={[80, 9, 0]} 
        size={[3, 1, 3]} 
        speed={1.0}
      />
      <Platform position={[86, 12, 0]} size={[4, 1, 4]} />
      <Checkpoint position={[86, 12, 0]} />
      
      {/* Precision Jumping Section */}
      <Platform position={[92, 12, 0]} size={[2, 1, 2]} />
      <Platform position={[96, 13, 0]} size={[2, 1, 2]} />
      <Platform position={[100, 14, 0]} size={[2, 1, 2]} />
      <Platform position={[104, 15, 0]} size={[2, 1, 2]} />
      <Collectible position={[92, 14, 0]} />
      <Collectible position={[96, 15, 0]} />
      <Collectible position={[100, 16, 0]} />
      <Collectible position={[104, 17, 0]} />
      
      {/* Side Path - Secret Area */}
      <Platform position={[50, 10, -8]} size={[4, 1, 4]} />
      <Platform position={[56, 11, -8]} size={[4, 1, 4]} />
      <Platform position={[62, 12, -8]} size={[4, 1, 4]} />
      <Collectible position={[50, 12, -8]} color="#ff6b6b" />
      <Collectible position={[56, 13, -8]} color="#ff6b6b" />
      <Collectible position={[62, 14, -8]} color="#ff6b6b" />
      
      {/* Bridge Section */}
      <Platform position={[108, 15, 0]} size={[2, 1, 4]} />
      <Platform position={[112, 15, 0]} size={[2, 1, 4]} />
      <Platform position={[116, 15, 0]} size={[2, 1, 4]} />
      <Platform position={[120, 15, 0]} size={[2, 1, 4]} />
      <Hazard position={[110, 16, 0]} size={[1, 0.5, 1]} />
      <Hazard position={[114, 16, 0]} size={[1, 0.5, 1]} />
      <Hazard position={[118, 16, 0]} size={[1, 0.5, 1]} />
      
      {/* Final Challenge - Multiple moving platforms */}
      <MovingPlatform 
        startPos={[126, 15, 0]} 
        endPos={[130, 18, 0]} 
        size={[3, 1, 3]} 
        speed={1.5}
      />
      <MovingPlatform 
        startPos={[136, 20, 0]} 
        endPos={[136, 17, 0]} 
        size={[3, 1, 3]} 
        speed={1.3}
      />
      <MovingPlatform 
        startPos={[142, 18, 0]} 
        endPos={[146, 21, 0]} 
        size={[3, 1, 3]} 
        speed={1.1}
      />
      
      {/* Victory Platform */}
      <Platform position={[152, 21, 0]} size={[8, 2, 8]} color="#ffd700" />
      <Checkpoint position={[152, 21, 0]} color="#ffd700" />
      <Collectible position={[150, 24, -2]} color="#ff6b6b" />
      <Collectible position={[152, 24, 0]} color="#ff6b6b" />
      <Collectible position={[154, 24, 2]} color="#ff6b6b" />
      
      {/* Lower Path - Alternative route */}
      <Platform position={[70, 3, 8]} size={[4, 1, 4]} />
      <Platform position={[76, 2, 8]} size={[4, 1, 4]} />
      <Platform position={[82, 1, 8]} size={[4, 1, 4]} />
      <Platform position={[88, 2, 8]} size={[4, 1, 4]} />
      <Platform position={[94, 3, 8]} size={[4, 1, 4]} />
      <Ramp position={[100, 5, 8]} size={[6, 1, 4]} rotation={[0, 0, 0.3]} />
      <Platform position={[108, 8, 8]} size={[4, 1, 4]} />
      
      {/* Connecting platforms to eliminate gaps */}
      <Platform position={[6, 0, 0]} size={[2, 1, 4]} />
      <Platform position={[13, 0.5, 0]} size={[2, 1, 4]} />
      <Platform position={[19, 1.5, 0]} size={[2, 1, 4]} />
      <Platform position={[25, 2.5, 0]} size={[2, 1, 4]} />
      <Platform position={[31, 4.5, 0]} size={[2, 1, 4]} />
      <Platform position={[37, 6, 0]} size={[2, 1, 4]} />
      <Platform position={[44, 6, 0]} size={[2, 1, 4]} />
      <Platform position={[51, 6.5, 0]} size={[2, 1, 4]} />
      <Platform position={[58, 8, 0]} size={[2, 1, 4]} />
      <Platform position={[65, 8.5, 0]} size={[2, 1, 4]} />
      <Platform position={[71, 9, 0]} size={[2, 1, 4]} />
      <Platform position={[77, 10, 0]} size={[2, 1, 4]} />
      <Platform position={[83, 11, 0]} size={[2, 1, 4]} />
      <Platform position={[89, 12, 0]} size={[2, 1, 4]} />
      <Platform position={[94, 12.5, 0]} size={[2, 1, 4]} />
      <Platform position={[98, 13.5, 0]} size={[2, 1, 4]} />
      <Platform position={[102, 14.5, 0]} size={[2, 1, 4]} />
      <Platform position={[106, 15, 0]} size={[2, 1, 4]} />
      <Platform position={[110, 15, 0]} size={[2, 1, 4]} />
      <Platform position={[114, 15, 0]} size={[2, 1, 4]} />
      <Platform position={[118, 15, 0]} size={[2, 1, 4]} />
      <Platform position={[122, 15, 0]} size={[2, 1, 4]} />
      <Platform position={[128, 16, 0]} size={[2, 1, 4]} />
      <Platform position={[133, 18, 0]} size={[2, 1, 4]} />
      <Platform position={[139, 19, 0]} size={[2, 1, 4]} />
      <Platform position={[144, 20, 0]} size={[2, 1, 4]} />
      <Platform position={[148, 21, 0]} size={[2, 1, 4]} />
      
      {/* Wall platforms for vertical navigation */}
      <Platform position={[30, 1, -4]} size={[2, 1, 2]} />
      <Platform position={[30, 3, -4]} size={[2, 1, 2]} />
      <Platform position={[30, 5, -4]} size={[2, 1, 2]} />
      
      <Platform position={[60, 4, -4]} size={[2, 1, 2]} />
      <Platform position={[60, 6, -4]} size={[2, 1, 2]} />
      <Platform position={[60, 8, -4]} size={[2, 1, 2]} />
      
      <Platform position={[90, 6, -4]} size={[2, 1, 2]} />
      <Platform position={[90, 8, -4]} size={[2, 1, 2]} />
      <Platform position={[90, 10, -4]} size={[2, 1, 2]} />
      
      <Platform position={[120, 8, -4]} size={[2, 1, 2]} />
      <Platform position={[120, 10, -4]} size={[2, 1, 2]} />
      <Platform position={[120, 12, -4]} size={[2, 1, 2]} />
      <Platform position={[120, 14, -4]} size={[2, 1, 2]} />
      
      {/* Ground level safety platforms */}
      <Platform position={[20, -2, 0]} size={[40, 1, 20]} color="#8b4513" />
      <Platform position={[80, -2, 0]} size={[40, 1, 20]} color="#8b4513" />
      <Platform position={[140, -2, 0]} size={[40, 1, 20]} color="#8b4513" />
    </group>
  )
}

export default Scene