import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Placeholder Geometry Component for missing GLB models
function PlaceholderModel({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], type = "fixed", color = "#8B4513", geometry = "box" }) {
  const getGeometry = () => {
    switch (geometry) {
      case "cylinder":
        return <cylinderGeometry args={[0.5, 0.5, 1, 8]} />
      case "cone":
        return <coneGeometry args={[0.5, 1, 8]} />
      case "sphere":
        return <sphereGeometry args={[0.5, 8, 6]} />
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }

  return (
    <RigidBody type={type} position={position} rotation={rotation}>
      <mesh scale={scale} castShadow receiveShadow>
        {getGeometry()}
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}

// GLB Model Component with fallback
function GLBModel({ path, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], type = "fixed" }) {
  try {
    const { scene } = useGLTF(path)
    const clonedScene = scene.clone()
    
    return (
      <RigidBody type={type} position={position} rotation={rotation}>
        <primitive object={clonedScene} scale={scale} castShadow receiveShadow />
      </RigidBody>
    )
  } catch (error) {
    // Fallback to placeholder if GLB fails to load
    const getPlaceholderProps = (path) => {
      if (path.includes('tree')) return { color: "#228B22", geometry: "cylinder" }
      if (path.includes('coin')) return { color: "#FFD700", geometry: "cylinder", scale: [scale[0] * 0.5, scale[1] * 0.1, scale[2] * 0.5] }
      if (path.includes('grass')) return { color: "#32CD32", geometry: "box" }
      if (path.includes('snow')) return { color: "#F0F8FF", geometry: "box" }
      if (path.includes('platform')) return { color: "#8B4513", geometry: "box" }
      if (path.includes('rock')) return { color: "#696969", geometry: "sphere" }
      if (path.includes('flower')) return { color: "#FF69B4", geometry: "cone" }
      if (path.includes('crate')) return { color: "#8B4513", geometry: "box" }
      if (path.includes('barrel')) return { color: "#654321", geometry: "cylinder" }
      if (path.includes('chest')) return { color: "#8B4513", geometry: "box" }
      if (path.includes('heart')) return { color: "#FF0000", geometry: "sphere" }
      if (path.includes('key')) return { color: "#FFD700", geometry: "cylinder" }
      if (path.includes('jewel')) return { color: "#9932CC", geometry: "sphere" }
      if (path.includes('flag')) return { color: "#FF0000", geometry: "cone" }
      if (path.includes('ladder')) return { color: "#8B4513", geometry: "cylinder" }
      if (path.includes('spike')) return { color: "#FF4500", geometry: "cone" }
      if (path.includes('moving')) return { color: "#4169E1", geometry: "box" }
      return { color: "#8B4513", geometry: "box" }
    }

    const placeholderProps = getPlaceholderProps(path)
    return <PlaceholderModel position={position} rotation={rotation} scale={scale} type={type} {...placeholderProps} />
  }
}

// Moving Platform Component with fallback
function MovingGLBModel({ path, startPos, endPos, scale = [1, 1, 1], speed = 1 }) {
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

  try {
    const { scene } = useGLTF(path)
    const clonedScene = scene.clone()
    
    return (
      <RigidBody ref={ref} type="kinematicPosition" position={startPos}>
        <primitive object={clonedScene} scale={scale} castShadow receiveShadow />
      </RigidBody>
    )
  } catch (error) {
    return (
      <RigidBody ref={ref} type="kinematicPosition" position={startPos}>
        <mesh scale={scale} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#4169E1" />
        </mesh>
      </RigidBody>
    )
  }
}

// Collectible Component with animation and fallback
function AnimatedCollectible({ path, position, scale = [1, 1, 1] }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 2
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.3
    }
  })

  const getCollectibleProps = (path) => {
    if (path.includes('coin-bronze')) return { color: "#CD7F32", geometry: "cylinder" }
    if (path.includes('coin-silver')) return { color: "#C0C0C0", geometry: "cylinder" }
    if (path.includes('coin-gold')) return { color: "#FFD700", geometry: "cylinder" }
    if (path.includes('jewel')) return { color: "#9932CC", geometry: "sphere" }
    if (path.includes('heart')) return { color: "#FF0000", geometry: "sphere" }
    if (path.includes('key')) return { color: "#FFD700", geometry: "cylinder" }
    return { color: "#FFD700", geometry: "cylinder" }
  }

  const props = getCollectibleProps(path)
  
  return (
    <group ref={ref} position={position}>
      <mesh scale={[scale[0] * 0.5, scale[1] * 0.1, scale[2] * 0.5]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.2, 8]} />
        <meshStandardMaterial color={props.color} />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <group>
      {/* ===== GROUND ZONE (Y: 0-20) - Forest/Grassland ===== */}
      
      {/* Base Terrain - Large grass platforms forming the foundation */}
      <GLBModel path="/assets/Models/GLB format/block-grass-large.glb" position={[0, 0, 0]} scale={[8, 2, 8]} />
      <GLBModel path="/assets/Models/GLB format/block-grass-large.glb" position={[50, 0, 0]} scale={[6, 2, 6]} />
      <GLBModel path="/assets/Models/GLB format/block-grass-large.glb" position={[100, 0, 0]} scale={[7, 2, 7]} />
      <GLBModel path="/assets/Models/GLB format/block-grass-large.glb" position={[150, 0, 0]} scale={[5, 2, 5]} />
      <GLBModel path="/assets/Models/GLB format/block-grass-large.glb" position={[200, 0, 0]} scale={[6, 2, 6]} />
      
      {/* Side platforms for exploration */}
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[25, 2, 30]} scale={[3, 1, 3]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[75, 3, -25]} scale={[3, 1, 3]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[125, 4, 35]} scale={[3, 1, 3]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[175, 2, -30]} scale={[3, 1, 3]} />
      
      {/* Forest decorations */}
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[10, 4, 15]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[40, 4, -20]} scale={[1.8, 1.8, 1.8]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine.glb" position={[80, 4, 25]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[120, 4, -15]} scale={[2.2, 2.2, 2.2]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine.glb" position={[160, 4, 20]} scale={[1.8, 1.8, 1.8]} />
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[190, 4, -25]} scale={[2, 2, 2]} />
      
      {/* Vegetation and details */}
      <GLBModel path="/assets/Models/GLB format/flowers.glb" position={[15, 4, -10]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/grass.glb" position={[35, 4, 10]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/mushrooms.glb" position={[65, 4, -15]} scale={[1.2, 1.2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/plant.glb" position={[95, 4, 18]} scale={[1.3, 1.3, 1.3]} />
      <GLBModel path="/assets/Models/GLB format/flowers-tall.glb" position={[135, 4, -12]} scale={[1.4, 1.4, 1.4]} />
      
      {/* Interactive elements */}
      <GLBModel path="/assets/Models/GLB format/barrel.glb" position={[30, 4, 5]} scale={[1.2, 1.2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/crate.glb" position={[70, 4, -8]} scale={[1.2, 1.2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/chest.glb" position={[110, 4, 12]} scale={[1.3, 1.3, 1.3]} />
      <GLBModel path="/assets/Models/GLB format/barrel.glb" position={[150, 4, -18]} scale={[1.2, 1.2, 1.2]} />
      
      {/* Ground zone collectibles */}
      <AnimatedCollectible path="/assets/Models/GLB format/coin-bronze.glb" position={[25, 6, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/coin-bronze.glb" position={[75, 7, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/coin-silver.glb" position={[125, 8, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/heart.glb" position={[175, 6, 0]} scale={[1.2, 1.2, 1.2]} />
      
      {/* Transition ramp to mid zone */}
      <GLBModel path="/assets/Models/GLB format/block-grass-large-slope.glb" position={[220, 2, 0]} scale={[3, 3, 3]} rotation={[0, 0, 0]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[240, 8, 0]} scale={[2, 1, 2]} />
      
      {/* ===== MID ZONE (Y: 20-60) - Snow/Mountain Region ===== */}
      
      {/* Snow base platforms */}
      <GLBModel path="/assets/Models/GLB format/block-snow-large.glb" position={[260, 20, 0]} scale={[6, 3, 6]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-large.glb" position={[310, 22, 0]} scale={[5, 2, 5]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-large.glb" position={[360, 25, 0]} scale={[6, 3, 6]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-large.glb" position={[410, 28, 0]} scale={[5, 2, 5]} />
      
      {/* Snow stepped platforms */}
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[285, 26, 25]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[285, 26, -25]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[335, 30, 20]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[335, 30, -20]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[385, 33, 30]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[385, 33, -30]} scale={[2, 1, 2]} />
      
      {/* Snow trees and decorations */}
      <GLBModel path="/assets/Models/GLB format/tree-pine-snow.glb" position={[270, 26, 15]} scale={[1.8, 1.8, 1.8]} />
      <GLBModel path="/assets/Models/GLB format/tree-snow.glb" position={[320, 28, -18]} scale={[1.6, 1.6, 1.6]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine-snow-small.glb" position={[370, 31, 22]} scale={[1.4, 1.4, 1.4]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine-snow.glb" position={[420, 34, -16]} scale={[1.7, 1.7, 1.7]} />
      
      {/* Snow obstacles and hazards */}
      <GLBModel path="/assets/Models/GLB format/rocks.glb" position={[290, 26, -10]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/stones.glb" position={[340, 30, 8]} scale={[1.8, 1.8, 1.8]} />
      <GLBModel path="/assets/Models/GLB format/trap-spikes.glb" position={[315, 28, 0]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/spike-block.glb" position={[365, 31, -5]} scale={[1.2, 1.2, 1.2]} />
      
      {/* Mid zone collectibles */}
      <AnimatedCollectible path="/assets/Models/GLB format/coin-silver.glb" position={[260, 26, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/coin-gold.glb" position={[310, 28, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[360, 31, 0]} scale={[1.3, 1.3, 1.3]} />
      <AnimatedCollectible path="/assets/Models/GLB format/key.glb" position={[410, 34, 0]} scale={[1.2, 1.2, 1.2]} />
      
      {/* Moving platforms in mid zone */}
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving.glb" 
        startPos={[290, 32, 0]} 
        endPos={[320, 32, 0]} 
        scale={[2, 1, 2]} 
        speed={1.2} 
      />
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving-blue.glb" 
        startPos={[340, 36, -15]} 
        endPos={[380, 36, -15]} 
        scale={[2, 1, 2]} 
        speed={1.0} 
      />
      
      {/* Transition to summit */}
      <GLBModel path="/assets/Models/GLB format/ladder-long.glb" position={[430, 30, 0]} scale={[2, 3, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-large-slope.glb" position={[450, 35, 0]} scale={[2, 2, 2]} />
      
      {/* ===== SUMMIT ZONE (Y: 60-120) - Sky/Cloud Platforms ===== */}
      
      {/* Summit base platforms */}
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[480, 60, 0]} scale={[5, 2, 5]} />
      <GLBModel path="/assets/Models/GLB format/platform-fortified.glb" position={[530, 65, 0]} scale={[4, 2, 4]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[580, 70, 0]} scale={[5, 2, 5]} />
      <GLBModel path="/assets/Models/GLB format/platform-fortified.glb" position={[630, 75, 0]} scale={[6, 3, 6]} />
      
      {/* Floating platforms */}
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[505, 68, 25]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[505, 68, -25]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform-overhang.glb" position={[555, 73, 20]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform-overhang.glb" position={[555, 73, -20]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[605, 78, 30]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[605, 78, -30]} scale={[2, 1, 2]} />
      
      {/* Summit moving platforms - more challenging */}
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving-large.glb" 
        startPos={[510, 72, 0]} 
        endPos={[550, 72, 0]} 
        scale={[3, 1, 3]} 
        speed={1.5} 
      />
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving-blue.glb" 
        startPos={[560, 77, -10]} 
        endPos={[600, 77, 10]} 
        scale={[2, 1, 2]} 
        speed={1.8} 
      />
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving.glb" 
        startPos={[610, 82, 0]} 
        endPos={[650, 82, 0]} 
        scale={[2, 1, 2]} 
        speed={2.0} 
      />
      
      {/* Summit hazards */}
      <GLBModel path="/assets/Models/GLB format/trap-spikes-large.glb" position={[520, 67, 0]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/spike-block-wide.glb" position={[570, 72, 0]} scale={[1.3, 1.3, 1.3]} />
      <GLBModel path="/assets/Models/GLB format/saw.glb" position={[590, 76, 0]} scale={[1.2, 1.2, 1.2]} />
      
      {/* Summit collectibles - high value */}
      <AnimatedCollectible path="/assets/Models/GLB format/coin-gold.glb" position={[480, 66, 0]} scale={[1.8, 1.8, 1.8]} />
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[530, 71, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/coin-gold.glb" position={[580, 76, 0]} scale={[1.8, 1.8, 1.8]} />
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[630, 81, 0]} scale={[1.8, 1.8, 1.8]} />
      
      {/* Final goal area */}
      <GLBModel path="/assets/Models/GLB format/platform-fortified.glb" position={[680, 80, 0]} scale={[8, 4, 8]} />
      <GLBModel path="/assets/Models/GLB format/flag.glb" position={[680, 88, 0]} scale={[3, 3, 3]} />
      <GLBModel path="/assets/Models/GLB format/chest.glb" position={[680, 84, 10]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/chest.glb" position={[680, 84, -10]} scale={[2, 2, 2]} />
      
      {/* Victory collectibles */}
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[675, 86, 5]} scale={[2, 2, 2]} />
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[685, 86, -5]} scale={[2, 2, 2]} />
      <AnimatedCollectible path="/assets/Models/GLB format/heart.glb" position={[680, 86, 0]} scale={[2, 2, 2]} />
      
      {/* ===== SIDE AREAS AND SECRET ZONES ===== */}
      
      {/* Secret area 1 - Hidden forest grove */}
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[50, 10, 60]} scale={[3, 1, 3]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[80, 12, 60]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[50, 14, 65]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine.glb" position={[80, 16, 55]} scale={[1.3, 1.3, 1.3]} />
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[65, 16, 60]} scale={[1.5, 1.5, 1.5]} />
      
      {/* Secret area 2 - Snow cave */}
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[350, 40, -60]} scale={[4, 2, 4]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-overhang.glb" position={[350, 44, -60]} scale={[3, 2, 3]} />
      <GLBModel path="/assets/Models/GLB format/chest.glb" position={[350, 46, -60]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/key.glb" position={[355, 46, -65]} scale={[1.3, 1.3, 1.3]} />
      
      {/* Secret area 3 - Sky island */}
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[600, 90, 60]} scale={[4, 2, 4]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine.glb" position={[600, 94, 65]} scale={[1.2, 1.2, 1.2]} />
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[600, 94, 55]} scale={[2, 2, 2]} />
      <AnimatedCollectible path="/assets/Models/GLB format/coin-gold.glb" position={[605, 94, 60]} scale={[1.8, 1.8, 1.8]} />
      
      {/* ===== BOUNDARY ELEMENTS ===== */}
      
      {/* Boundary walls using rocks */}
      {Array.from({length: 30}, (_, i) => {
        const x = i * 25 - 50
        return (
          <GLBModel 
            key={`north-boundary-${i}`}
            path="/assets/Models/GLB format/rocks.glb" 
            position={[x, 5, 80]} 
            scale={[2, 3, 2]} 
          />
        )
      })}
      
      {Array.from({length: 30}, (_, i) => {
        const x = i * 25 - 50
        return (
          <GLBModel 
            key={`south-boundary-${i}`}
            path="/assets/Models/GLB format/rocks.glb" 
            position={[x, 5, -80]} 
            scale={[2, 3, 2]} 
          />
        )
      })}
      
      {/* ===== GROUND PLANE ===== */}
      <RigidBody type="fixed" position={[350, -10, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[800, 2, 200]} />
          <meshStandardMaterial color="#2d4a22" />
        </mesh>
      </RigidBody>
      
      {/* ===== CHECKPOINT FLAGS ===== */}
      <GLBModel path="/assets/Models/GLB format/flag.glb" position={[200, 8, 5]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/flag.glb" position={[410, 34, 5]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/flag.glb" position={[630, 81, 5]} scale={[1.5, 1.5, 1.5]} />
      
      {/* ===== GUIDANCE SIGNS ===== */}
      <GLBModel path="/assets/Models/GLB format/sign.glb" position={[25, 4, 8]} scale={[1.2, 1.2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/sign.glb" position={[240, 8, 8]} scale={[1.2, 1.2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/sign.glb" position={[450, 35, 8]} scale={[1.2, 1.2, 1.2]} />
      
      {/* ===== ADDITIONAL INTERACTIVE ELEMENTS ===== */}
      
      {/* Levers and buttons for puzzles */}
      <GLBModel path="/assets/Models/GLB format/lever.glb" position={[100, 4, 15]} scale={[1.2, 1.2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/button-round.glb" position={[300, 28, 12]} scale={[1.3, 1.3, 1.3]} />
      <GLBModel path="/assets/Models/GLB format/button-square.glb" position={[550, 73, 15]} scale={[1.2, 1.2, 1.2]} />
      
      {/* Doors and locks */}
      <GLBModel path="/assets/Models/GLB format/door-rotate.glb" position={[150, 4, 20]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/lock.glb" position={[350, 31, 18]} scale={[1.2, 1.2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/door-large-open.glb" position={[650, 81, 20]} scale={[2, 2, 2]} />
      
      {/* Ladders for vertical navigation */}
      <GLBModel path="/assets/Models/GLB format/ladder.glb" position={[75, 4, -15]} scale={[1.2, 2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/ladder-broken.glb" position={[325, 28, -18]} scale={[1.3, 1.8, 1.3]} />
      <GLBModel path="/assets/Models/GLB format/ladder-long.glb" position={[575, 73, -15]} scale={[1.2, 2.5, 1.2]} />
      
      {/* Atmospheric elements */}
      <GLBModel path="/assets/Models/GLB format/poles.glb" position={[125, 4, -25]} scale={[1.2, 1.2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/hedge.glb" position={[275, 26, -22]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/fence-straight.glb" position={[525, 68, -25]} scale={[1.3, 1.3, 1.3]} />
    </group>
  )
}

export default Scene