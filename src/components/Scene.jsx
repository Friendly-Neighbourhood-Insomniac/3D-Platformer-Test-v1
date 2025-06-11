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
      {/* =================================
          GROUND ZONE (Y: 0-50) - Forest/Grassland
          ================================= */}
      
      {/* Base Terrain - Large grass platforms */}
      <GLBModel path="/assets/Models/GLB format/block-grass-large.glb" position={[0, 0, 0]} scale={[5, 5, 1]} />
      <GLBModel path="/assets/Models/GLB format/block-grass-large.glb" position={[100, 0, 0]} scale={[5, 5, 1]} />
      <GLBModel path="/assets/Models/GLB format/block-grass-large.glb" position={[200, 0, 0]} scale={[5, 5, 1]} />
      <GLBModel path="/assets/Models/GLB format/block-grass-large.glb" position={[300, 0, 0]} scale={[5, 5, 1]} />
      <GLBModel path="/assets/Models/GLB format/block-grass-large.glb" position={[400, 0, 0]} scale={[5, 5, 1]} />
      
      {/* Side platforms for exploration */}
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[50, 10, 100]} scale={[3, 1, 3]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[150, 15, -100]} scale={[3, 1, 3]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[250, 20, 100]} scale={[3, 1, 3]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[350, 15, -100]} scale={[3, 1, 3]} />
      
      {/* Forest decorations */}
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[25, 10, 50]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[125, 10, -75]} scale={[1.8, 1.8, 1.8]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine.glb" position={[225, 10, 75]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[325, 10, -50]} scale={[2.2, 2.2, 2.2]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine.glb" position={[425, 10, 60]} scale={[1.8, 1.8, 1.8]} />
      
      {/* Vegetation and details */}
      <GLBModel path="/assets/Models/GLB format/flowers.glb" position={[75, 10, -25]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/grass.glb" position={[175, 10, 25]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/mushrooms.glb" position={[275, 10, -40]} scale={[1.2, 1.2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/plant.glb" position={[375, 10, 35]} scale={[1.3, 1.3, 1.3]} />
      
      {/* Interactive elements */}
      <GLBModel path="/assets/Models/GLB format/barrel.glb" position={[100, 10, 100]} scale={[1.2, 1.2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/crate.glb" position={[200, 10, -80]} scale={[1.2, 1.2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/chest.glb" position={[300, 10, 90]} scale={[1.3, 1.3, 1.3]} />
      <GLBModel path="/assets/Models/GLB format/barrel.glb" position={[400, 10, -70]} scale={[1.2, 1.2, 1.2]} />
      
      {/* Ground zone collectibles */}
      <AnimatedCollectible path="/assets/Models/GLB format/coin-bronze.glb" position={[50, 15, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/coin-bronze.glb" position={[150, 15, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/coin-silver.glb" position={[250, 15, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/heart.glb" position={[350, 15, 0]} scale={[1.2, 1.2, 1.2]} />
      
      {/* Transition ramp to mid zone */}
      <GLBModel path="/assets/Models/GLB format/block-grass-large-slope.glb" position={[450, 5, 0]} scale={[3, 3, 3]} rotation={[0, 0, 0]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[480, 20, 0]} scale={[2, 1, 2]} />
      
      {/* =================================
          MID ZONE (Y: 50-150) - Snow/Mountain Region
          ================================= */}
      
      {/* Snow base platforms */}
      <GLBModel path="/assets/Models/GLB format/block-snow-large.glb" position={[0, 50, 0]} scale={[5, 5, 1]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-large.glb" position={[100, 55, 0]} scale={[4, 3, 1]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-large.glb" position={[200, 60, 0]} scale={[5, 4, 1]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-large.glb" position={[300, 65, 0]} scale={[4, 3, 1]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-large.glb" position={[400, 70, 0]} scale={[5, 4, 1]} />
      
      {/* Snow stepped platforms */}
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[50, 58, 75]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[50, 58, -75]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[150, 63, 60]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[150, 63, -60]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[250, 68, 80]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[250, 68, -80]} scale={[2, 1, 2]} />
      
      {/* Snow trees and decorations */}
      <GLBModel path="/assets/Models/GLB format/tree-pine-snow.glb" position={[75, 60, 40]} scale={[1.8, 1.8, 1.8]} />
      <GLBModel path="/assets/Models/GLB format/tree-snow.glb" position={[175, 65, -45]} scale={[1.6, 1.6, 1.6]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine-snow-small.glb" position={[275, 70, 50]} scale={[1.4, 1.4, 1.4]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine-snow.glb" position={[375, 75, -40]} scale={[1.7, 1.7, 1.7]} />
      
      {/* Snow obstacles and hazards */}
      <GLBModel path="/assets/Models/GLB format/rocks.glb" position={[125, 58, -25]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/stones.glb" position={[225, 63, 20]} scale={[1.8, 1.8, 1.8]} />
      <GLBModel path="/assets/Models/GLB format/trap-spikes.glb" position={[200, 65, 300]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/spike-block.glb" position={[325, 70, -15]} scale={[1.2, 1.2, 1.2]} />
      
      {/* Mid zone collectibles */}
      <AnimatedCollectible path="/assets/Models/GLB format/coin-silver.glb" position={[50, 65, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/coin-gold.glb" position={[150, 70, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[250, 75, 0]} scale={[1.3, 1.3, 1.3]} />
      <AnimatedCollectible path="/assets/Models/GLB format/key.glb" position={[350, 80, 0]} scale={[1.2, 1.2, 1.2]} />
      
      {/* Moving platforms in mid zone */}
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving.glb" 
        startPos={[125, 70, 0]} 
        endPos={[175, 70, 0]} 
        scale={[2, 1, 2]} 
        speed={1.2} 
      />
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving-blue.glb" 
        startPos={[275, 78, -40]} 
        endPos={[325, 78, -40]} 
        scale={[2, 1, 2]} 
        speed={1.0} 
      />
      
      {/* Transition to summit */}
      <GLBModel path="/assets/Models/GLB format/ladder-long.glb" position={[400, 75, 400]} scale={[2, 3, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-large-slope.glb" position={[430, 85, 0]} scale={[2, 2, 2]} />
      
      {/* =================================
          SUMMIT ZONE (Y: 150-500) - Sky/Cloud Platforms
          ================================= */}
      
      {/* Summit base platforms */}
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[0, 150, 0]} scale={[5, 5, 1]} />
      <GLBModel path="/assets/Models/GLB format/platform-fortified.glb" position={[100, 160, 0]} scale={[4, 3, 1]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[200, 170, 0]} scale={[5, 4, 1]} />
      <GLBModel path="/assets/Models/GLB format/platform-fortified.glb" position={[300, 180, 0]} scale={[6, 5, 1]} />
      
      {/* Floating platforms */}
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[50, 165, 60]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[50, 165, -60]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform-overhang.glb" position={[150, 175, 50]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform-overhang.glb" position={[150, 175, -50]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[250, 185, 70]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[250, 185, -70]} scale={[2, 1, 2]} />
      
      {/* Summit moving platforms - more challenging */}
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving-large.glb" 
        startPos={[75, 170, 0]} 
        endPos={[125, 170, 0]} 
        scale={[3, 1, 3]} 
        speed={1.5} 
      />
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving-blue.glb" 
        startPos={[175, 180, -25]} 
        endPos={[225, 180, 25]} 
        scale={[2, 1, 2]} 
        speed={1.8} 
      />
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving.glb" 
        startPos={[275, 190, 0]} 
        endPos={[325, 190, 0]} 
        scale={[2, 1, 2]} 
        speed={2.0} 
      />
      
      {/* Summit hazards */}
      <GLBModel path="/assets/Models/GLB format/trap-spikes-large.glb" position={[100, 165, 0]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/spike-block-wide.glb" position={[200, 175, 0]} scale={[1.3, 1.3, 1.3]} />
      <GLBModel path="/assets/Models/GLB format/saw.glb" position={[250, 180, 0]} scale={[1.2, 1.2, 1.2]} />
      
      {/* Summit collectibles - high value */}
      <AnimatedCollectible path="/assets/Models/GLB format/coin-gold.glb" position={[50, 170, 0]} scale={[1.8, 1.8, 1.8]} />
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[150, 180, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/coin-gold.glb" position={[250, 190, 0]} scale={[1.8, 1.8, 1.8]} />
      
      {/* Final goal area */}
      <GLBModel path="/assets/Models/GLB format/platform-fortified.glb" position={[250, 200, 250]} scale={[8, 6, 8]} />
      <GLBModel path="/assets/Models/GLB format/flag.glb" position={[250, 210, 250]} scale={[3, 3, 3]} />
      <GLBModel path="/assets/Models/GLB format/chest.glb" position={[240, 206, 260]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/chest.glb" position={[260, 206, 240]} scale={[2, 2, 2]} />
      
      {/* Victory collectibles */}
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[245, 208, 255]} scale={[2, 2, 2]} />
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[255, 208, 245]} scale={[2, 2, 2]} />
      <AnimatedCollectible path="/assets/Models/GLB format/heart.glb" position={[250, 208, 250]} scale={[2, 2, 2]} />
      
      {/* =================================
          SECRET AREAS
          ================================= */}
      
      {/* Secret area 1 - Hidden forest grove */}
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[100, 25, 150]} scale={[3, 1, 3]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[150, 30, 150]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[100, 35, 160]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine.glb" position={[150, 40, 140]} scale={[1.3, 1.3, 1.3]} />
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[125, 40, 150]} scale={[1.5, 1.5, 1.5]} />
      
      {/* Secret area 2 - Snow cave */}
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[300, 90, -150]} scale={[4, 2, 4]} />
      <GLBModel path="/assets/Models/GLB format/chest.glb" position={[300, 96, -150]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/key.glb" position={[310, 96, -160]} scale={[1.3, 1.3, 1.3]} />
      
      {/* =================================
          GROUND PLANE AND BOUNDARIES
          ================================= */}
      
      {/* Ground plane */}
      <RigidBody type="fixed" position={[250, -25, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[1000, 10, 1000]} />
          <meshStandardMaterial color="#4a7c59" />
        </mesh>
      </RigidBody>
      
      {/* Boundary walls */}
      {Array.from({length: 20}, (_, i) => {
        const x = i * 30 - 250
        return (
          <GLBModel 
            key={`north-boundary-${i}`}
            path="/assets/Models/GLB format/rocks.glb" 
            position={[x, 15, 250]} 
            scale={[2, 3, 2]} 
          />
        )
      })}
      
      {Array.from({length: 20}, (_, i) => {
        const x = i * 30 - 250
        return (
          <GLBModel 
            key={`south-boundary-${i}`}
            path="/assets/Models/GLB format/rocks.glb" 
            position={[x, 15, -250]} 
            scale={[2, 3, 2]} 
          />
        )
      })}
      
      {/* =================================
          CHECKPOINT FLAGS
          ================================= */}
      <GLBModel path="/assets/Models/GLB format/flag.glb" position={[450, 25, 10]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/flag.glb" position={[400, 85, 10]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/flag.glb" position={[300, 195, 10]} scale={[1.5, 1.5, 1.5]} />
      
      {/* =================================
          GUIDANCE SIGNS
          ================================= */}
      <GLBModel path="/assets/Models/GLB format/sign.glb" position={[50, 15, 20]} scale={[1.2, 1.2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/sign.glb" position={[480, 25, 20]} scale={[1.2, 1.2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/sign.glb" position={[430, 90, 20]} scale={[1.2, 1.2, 1.2]} />
      
      {/* =================================
          INTERACTIVE ELEMENTS
          ================================= */}
      
      {/* Levers and buttons for puzzles */}
      <GLBModel path="/assets/Models/GLB format/lever.glb" position={[200, 15, 40]} scale={[1.2, 1.2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/button-round.glb" position={[200, 70, 30]} scale={[1.3, 1.3, 1.3]} />
      <GLBModel path="/assets/Models/GLB format/button-square.glb" position={[200, 185, 40]} scale={[1.2, 1.2, 1.2]} />
      
      {/* Doors and locks */}
      <GLBModel path="/assets/Models/GLB format/door-rotate.glb" position={[300, 15, 50]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/lock.glb" position={[300, 70, 45]} scale={[1.2, 1.2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/door-large-open.glb" position={[300, 195, 50]} scale={[2, 2, 2]} />
      
      {/* Ladders for vertical navigation */}
      <GLBModel path="/assets/Models/GLB format/ladder.glb" position={[150, 15, -40]} scale={[1.2, 2, 1.2]} />
      <GLBModel path="/assets/Models/GLB format/ladder-broken.glb" position={[250, 70, -45]} scale={[1.3, 1.8, 1.3]} />
      <GLBModel path="/assets/Models/GLB format/ladder-long.glb" position={[200, 185, -40]} scale={[1.2, 2.5, 1.2]} />
    </group>
  )
}

export default Scene