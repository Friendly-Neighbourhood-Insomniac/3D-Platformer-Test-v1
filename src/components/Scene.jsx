import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// GLB Model Component
function GLBModel({ path, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], type = "fixed" }) {
  const { scene } = useGLTF(path)
  const clonedScene = scene.clone()
  
  return (
    <RigidBody type={type} position={position} rotation={rotation}>
      <primitive object={clonedScene} scale={scale} castShadow receiveShadow />
    </RigidBody>
  )
}

// Moving Platform Component
function MovingGLBModel({ path, startPos, endPos, scale = [1, 1, 1], speed = 1 }) {
  const ref = useRef()
  const { scene } = useGLTF(path)
  const clonedScene = scene.clone()
  
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
      <primitive object={clonedScene} scale={scale} castShadow receiveShadow />
    </RigidBody>
  )
}

// Collectible Component with animation
function AnimatedCollectible({ path, position, scale = [1, 1, 1] }) {
  const ref = useRef()
  const { scene } = useGLTF(path)
  const clonedScene = scene.clone()
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 2
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.3
    }
  })
  
  return (
    <group ref={ref} position={position}>
      <primitive object={clonedScene} scale={scale} castShadow />
    </group>
  )
}

function Scene() {
  return (
    <group>
      {/* ===== FOREST ZONE (Left Side: -250 to -50 X) ===== */}
      
      {/* Forest Base Platforms */}
      <GLBModel path="/assets/Models/GLB format/block-grass-large.glb" position={[-200, 0, 0]} scale={[4, 2, 4]} />
      <GLBModel path="/assets/Models/GLB format/block-grass-large.glb" position={[-180, 0, -30]} scale={[3, 2, 3]} />
      <GLBModel path="/assets/Models/GLB format/block-grass-large.glb" position={[-180, 0, 30]} scale={[3, 2, 3]} />
      <GLBModel path="/assets/Models/GLB format/block-grass-large.glb" position={[-160, 2, 0]} scale={[3, 2, 3]} />
      
      {/* Forest Stepped Platforms */}
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[-140, 4, -20]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[-140, 4, 20]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[-120, 6, 0]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[-100, 8, -15]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[-100, 8, 15]} scale={[2, 1, 2]} />
      
      {/* Forest Elevated Platforms */}
      <GLBModel path="/assets/Models/GLB format/block-grass-overhang.glb" position={[-80, 10, 0]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-grass-overhang-large.glb" position={[-60, 12, -25]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-grass-overhang-large.glb" position={[-60, 12, 25]} scale={[2, 1, 2]} />
      
      {/* Forest Trees and Vegetation */}
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[-210, 4, -15]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[-210, 4, 15]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine.glb" position={[-190, 4, -40]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine.glb" position={[-190, 4, 40]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[-170, 6, -30]} scale={[1.8, 1.8, 1.8]} />
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[-170, 6, 30]} scale={[1.8, 1.8, 1.8]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine.glb" position={[-150, 8, -35]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine.glb" position={[-150, 8, 35]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[-130, 10, -40]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[-130, 10, 40]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine.glb" position={[-110, 12, -30]} scale={[1.8, 1.8, 1.8]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine.glb" position={[-110, 12, 30]} scale={[1.8, 1.8, 1.8]} />
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[-90, 14, -35]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/tree.glb" position={[-90, 14, 35]} scale={[1.5, 1.5, 1.5]} />
      
      {/* Forest Decorative Elements */}
      <GLBModel path="/assets/Models/GLB format/flowers.glb" position={[-195, 4, -10]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/flowers.glb" position={[-195, 4, 10]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/grass.glb" position={[-175, 4, -20]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/grass.glb" position={[-175, 4, 20]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/mushrooms.glb" position={[-155, 6, -25]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/mushrooms.glb" position={[-155, 6, 25]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/plant.glb" position={[-135, 8, -30]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/plant.glb" position={[-135, 8, 30]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/flowers-tall.glb" position={[-115, 10, -25]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/flowers-tall.glb" position={[-115, 10, 25]} scale={[1.5, 1.5, 1.5]} />
      
      {/* Forest Collectibles */}
      <AnimatedCollectible path="/assets/Models/GLB format/coin-bronze.glb" position={[-200, 6, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/coin-silver.glb" position={[-160, 8, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/coin-gold.glb" position={[-120, 12, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[-80, 16, 0]} scale={[1.5, 1.5, 1.5]} />
      
      {/* Forest Interactive Elements */}
      <GLBModel path="/assets/Models/GLB format/crate.glb" position={[-185, 4, -15]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/barrel.glb" position={[-185, 4, 15]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/crate-item.glb" position={[-145, 8, -10]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/chest.glb" position={[-105, 12, 10]} scale={[1.5, 1.5, 1.5]} />
      
      {/* ===== TRANSITION ZONE (Center-Left: -50 to 0 X) ===== */}
      
      {/* Transition Platforms */}
      <GLBModel path="/assets/Models/GLB format/block-grass-large-slope.glb" position={[-40, 14, 0]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[-20, 16, -20]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[-20, 16, 20]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-grass-large.glb" position={[0, 18, 0]} scale={[3, 2, 3]} />
      
      {/* Transition Moving Platforms */}
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving.glb" 
        startPos={[-30, 20, 0]} 
        endPos={[-10, 20, 0]} 
        scale={[2, 1, 2]} 
        speed={0.8} 
      />
      
      {/* ===== SNOW ZONE (Center: 0 to 150 X) ===== */}
      
      {/* Snow Base Platforms */}
      <GLBModel path="/assets/Models/GLB format/block-snow-large.glb" position={[20, 20, 0]} scale={[4, 3, 4]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-large.glb" position={[40, 22, -30]} scale={[3, 2, 3]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-large.glb" position={[40, 22, 30]} scale={[3, 2, 3]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-large-tall.glb" position={[60, 24, 0]} scale={[3, 3, 3]} />
      
      {/* Snow Mountain Peaks */}
      <GLBModel path="/assets/Models/GLB format/block-snow-large-tall.glb" position={[80, 28, -20]} scale={[2, 4, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-large-tall.glb" position={[80, 28, 20]} scale={[2, 4, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-large-tall.glb" position={[100, 32, 0]} scale={[3, 5, 3]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-large-tall.glb" position={[120, 36, -25]} scale={[2, 4, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow-large-tall.glb" position={[120, 36, 25]} scale={[2, 4, 2]} />
      
      {/* Snow Stepped Platforms */}
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[30, 26, -15]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[30, 26, 15]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[50, 28, -20]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[50, 28, 20]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[70, 30, -30]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[70, 30, 30]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[90, 34, -35]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[90, 34, 35]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[110, 38, -40]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-snow.glb" position={[110, 38, 40]} scale={[2, 1, 2]} />
      
      {/* Snow Trees */}
      <GLBModel path="/assets/Models/GLB format/tree-pine-snow.glb" position={[15, 24, -25]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine-snow.glb" position={[15, 24, 25]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/tree-snow.glb" position={[35, 28, -35]} scale={[1.8, 1.8, 1.8]} />
      <GLBModel path="/assets/Models/GLB format/tree-snow.glb" position={[35, 28, 35]} scale={[1.8, 1.8, 1.8]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine-snow-small.glb" position={[55, 30, -40]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine-snow-small.glb" position={[55, 30, 40]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine-snow.glb" position={[75, 34, -45]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine-snow.glb" position={[75, 34, 45]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/tree-snow.glb" position={[95, 38, -50]} scale={[1.8, 1.8, 1.8]} />
      <GLBModel path="/assets/Models/GLB format/tree-snow.glb" position={[95, 38, 50]} scale={[1.8, 1.8, 1.8]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine-snow-small.glb" position={[115, 42, -45]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/tree-pine-snow-small.glb" position={[115, 42, 45]} scale={[1.5, 1.5, 1.5]} />
      
      {/* Snow Decorative Elements */}
      <GLBModel path="/assets/Models/GLB format/rocks.glb" position={[25, 26, -10]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/rocks.glb" position={[25, 26, 10]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/stones.glb" position={[45, 30, -15]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/stones.glb" position={[45, 30, 15]} scale={[1.5, 1.5, 1.5]} />
      
      {/* Snow Collectibles */}
      <AnimatedCollectible path="/assets/Models/GLB format/coin-silver.glb" position={[20, 26, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/coin-gold.glb" position={[60, 30, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[100, 38, 0]} scale={[1.5, 1.5, 1.5]} />
      
      {/* Snow Interactive Elements */}
      <GLBModel path="/assets/Models/GLB format/crate-strong.glb" position={[35, 28, -20]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/barrel.glb" position={[35, 28, 20]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/chest.glb" position={[85, 36, 15]} scale={[1.5, 1.5, 1.5]} />
      
      {/* Snow Moving Platforms */}
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving-blue.glb" 
        startPos={[65, 32, -10]} 
        endPos={[75, 32, -10]} 
        scale={[2, 1, 2]} 
        speed={1.2} 
      />
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving-large.glb" 
        startPos={[85, 36, -30]} 
        endPos={[95, 36, -30]} 
        scale={[2, 1, 2]} 
        speed={1.0} 
      />
      
      {/* ===== TRANSITION TO DESERT (Center-Right: 150 to 200 X) ===== */}
      
      {/* Transition Platforms */}
      <GLBModel path="/assets/Models/GLB format/block-snow-large-slope.glb" position={[140, 40, 0]} scale={[2, 2, 2]} rotation={[0, Math.PI, 0]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[160, 38, -20]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[160, 38, 20]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform-ramp.glb" position={[180, 36, 0]} scale={[2, 2, 2]} />
      
      {/* ===== DESERT/CANYON ZONE (Right Side: 200 to 450 X) ===== */}
      
      {/* Desert Base Platforms */}
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[220, 34, 0]} scale={[4, 3, 4]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[240, 32, -30]} scale={[3, 2, 3]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[240, 32, 30]} scale={[3, 2, 3]} />
      <GLBModel path="/assets/Models/GLB format/platform-fortified.glb" position={[260, 30, 0]} scale={[3, 2, 3]} />
      
      {/* Desert Stepped Platforms */}
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[280, 28, -20]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[280, 28, 20]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[300, 26, 0]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[320, 24, -15]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[320, 24, 15]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[340, 22, 0]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[360, 20, -25]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[360, 20, 25]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform-fortified.glb" position={[380, 18, 0]} scale={[3, 2, 3]} />
      
      {/* Desert Elevated Platforms */}
      <GLBModel path="/assets/Models/GLB format/platform-overhang.glb" position={[400, 16, -20]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform-overhang.glb" position={[400, 16, 20]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform-fortified.glb" position={[420, 14, 0]} scale={[4, 3, 4]} />
      
      {/* Desert Rock Formations */}
      <GLBModel path="/assets/Models/GLB format/rocks.glb" position={[210, 38, -25]} scale={[3, 3, 3]} />
      <GLBModel path="/assets/Models/GLB format/rocks.glb" position={[210, 38, 25]} scale={[3, 3, 3]} />
      <GLBModel path="/assets/Models/GLB format/stones.glb" position={[230, 36, -40]} scale={[2.5, 2.5, 2.5]} />
      <GLBModel path="/assets/Models/GLB format/stones.glb" position={[230, 36, 40]} scale={[2.5, 2.5, 2.5]} />
      <GLBModel path="/assets/Models/GLB format/rocks.glb" position={[250, 34, -35]} scale={[2.8, 2.8, 2.8]} />
      <GLBModel path="/assets/Models/GLB format/rocks.glb" position={[250, 34, 35]} scale={[2.8, 2.8, 2.8]} />
      <GLBModel path="/assets/Models/GLB format/stones.glb" position={[270, 32, -45]} scale={[2.2, 2.2, 2.2]} />
      <GLBModel path="/assets/Models/GLB format/stones.glb" position={[270, 32, 45]} scale={[2.2, 2.2, 2.2]} />
      <GLBModel path="/assets/Models/GLB format/rocks.glb" position={[290, 30, -40]} scale={[2.5, 2.5, 2.5]} />
      <GLBModel path="/assets/Models/GLB format/rocks.glb" position={[290, 30, 40]} scale={[2.5, 2.5, 2.5]} />
      <GLBModel path="/assets/Models/GLB format/stones.glb" position={[310, 28, -35]} scale={[2.8, 2.8, 2.8]} />
      <GLBModel path="/assets/Models/GLB format/stones.glb" position={[310, 28, 35]} scale={[2.8, 2.8, 2.8]} />
      <GLBModel path="/assets/Models/GLB format/rocks.glb" position={[330, 26, -45]} scale={[3, 3, 3]} />
      <GLBModel path="/assets/Models/GLB format/rocks.glb" position={[330, 26, 45]} scale={[3, 3, 3]} />
      <GLBModel path="/assets/Models/GLB format/stones.glb" position={[350, 24, -40]} scale={[2.5, 2.5, 2.5]} />
      <GLBModel path="/assets/Models/GLB format/stones.glb" position={[350, 24, 40]} scale={[2.5, 2.5, 2.5]} />
      <GLBModel path="/assets/Models/GLB format/rocks.glb" position={[370, 22, -35]} scale={[2.8, 2.8, 2.8]} />
      <GLBModel path="/assets/Models/GLB format/rocks.glb" position={[370, 22, 35]} scale={[2.8, 2.8, 2.8]} />
      <GLBModel path="/assets/Models/GLB format/stones.glb" position={[390, 20, -30]} scale={[3, 3, 3]} />
      <GLBModel path="/assets/Models/GLB format/stones.glb" position={[390, 20, 30]} scale={[3, 3, 3]} />
      <GLBModel path="/assets/Models/GLB format/rocks.glb" position={[410, 18, -40]} scale={[2.5, 2.5, 2.5]} />
      <GLBModel path="/assets/Models/GLB format/rocks.glb" position={[410, 18, 40]} scale={[2.5, 2.5, 2.5]} />
      
      {/* Desert Collectibles */}
      <AnimatedCollectible path="/assets/Models/GLB format/coin-gold.glb" position={[220, 40, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[260, 36, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/coin-gold.glb" position={[300, 32, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[340, 28, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/coin-gold.glb" position={[380, 24, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/jewel.glb" position={[420, 20, 0]} scale={[2, 2, 2]} />
      
      {/* Desert Interactive Elements */}
      <GLBModel path="/assets/Models/GLB format/crate-item-strong.glb" position={[235, 36, -15]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/barrel.glb" position={[235, 36, 15]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/chest.glb" position={[275, 32, 10]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/crate-strong.glb" position={[315, 28, -10]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/chest.glb" position={[355, 24, 20]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/crate-item.glb" position={[395, 20, -15]} scale={[1.5, 1.5, 1.5]} />
      
      {/* Desert Moving Platforms */}
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving.glb" 
        startPos={[245, 34, 0]} 
        endPos={[255, 34, 0]} 
        scale={[2, 1, 2]} 
        speed={1.5} 
      />
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving-large.glb" 
        startPos={[285, 30, -10]} 
        endPos={[295, 30, -10]} 
        scale={[2, 1, 2]} 
        speed={1.3} 
      />
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving-blue.glb" 
        startPos={[325, 26, 10]} 
        endPos={[335, 26, 10]} 
        scale={[2, 1, 2]} 
        speed={1.1} 
      />
      <MovingGLBModel 
        path="/assets/Models/GLB format/block-moving.glb" 
        startPos={[365, 22, 0]} 
        endPos={[375, 22, 0]} 
        scale={[2, 1, 2]} 
        speed={1.4} 
      />
      
      {/* ===== CONNECTING PLATFORMS (Fill gaps across 500x500) ===== */}
      
      {/* Main progression path connectors */}
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[-220, 0, 0]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/block-grass.glb" position={[-240, 0, 0]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[440, 12, 0]} scale={[2, 1, 2]} />
      <GLBModel path="/assets/Models/GLB format/platform.glb" position={[460, 10, 0]} scale={[2, 1, 2]} />
      
      {/* Side area connectors */}
      {Array.from({length: 20}, (_, i) => {
        const x = -240 + i * 35
        const y = Math.sin(x * 0.01) * 3 + 5
        return (
          <GLBModel 
            key={`connector-${i}`}
            path="/assets/Models/GLB format/block-grass.glb" 
            position={[x, y, -60]} 
            scale={[1.5, 1, 1.5]} 
          />
        )
      })}
      
      {Array.from({length: 20}, (_, i) => {
        const x = -240 + i * 35
        const y = Math.sin(x * 0.01) * 3 + 5
        return (
          <GLBModel 
            key={`connector-south-${i}`}
            path="/assets/Models/GLB format/block-grass.glb" 
            position={[x, y, 60]} 
            scale={[1.5, 1, 1.5]} 
          />
        )
      })}
      
      {/* ===== BOUNDARY WALLS AND DECORATIONS ===== */}
      
      {/* North boundary */}
      {Array.from({length: 50}, (_, i) => {
        const x = -250 + i * 14
        return (
          <GLBModel 
            key={`north-wall-${i}`}
            path="/assets/Models/GLB format/rocks.glb" 
            position={[x, 5, -80]} 
            scale={[2, 3, 2]} 
          />
        )
      })}
      
      {/* South boundary */}
      {Array.from({length: 50}, (_, i) => {
        const x = -250 + i * 14
        return (
          <GLBModel 
            key={`south-wall-${i}`}
            path="/assets/Models/GLB format/rocks.glb" 
            position={[x, 5, 80]} 
            scale={[2, 3, 2]} 
          />
        )
      })}
      
      {/* ===== GROUND PLANE ===== */}
      <RigidBody type="fixed" position={[100, -10, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[800, 2, 200]} />
          <meshStandardMaterial color="#2d4a22" />
        </mesh>
      </RigidBody>
      
      {/* ===== SPECIAL FEATURES ===== */}
      
      {/* Flags marking zone transitions */}
      <GLBModel path="/assets/Models/GLB format/flag.glb" position={[-50, 18, 0]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/flag.glb" position={[150, 42, 0]} scale={[2, 2, 2]} />
      <GLBModel path="/assets/Models/GLB format/flag.glb" position={[200, 38, 0]} scale={[2, 2, 2]} />
      
      {/* Signs for guidance */}
      <GLBModel path="/assets/Models/GLB format/sign.glb" position={[-180, 4, 5]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/sign.glb" position={[40, 26, 5]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/sign.glb" position={[240, 36, 5]} scale={[1.5, 1.5, 1.5]} />
      
      {/* Ladders for vertical navigation */}
      <GLBModel path="/assets/Models/GLB format/ladder.glb" position={[-160, 6, -5]} scale={[1.5, 2, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/ladder-long.glb" position={[60, 28, -5]} scale={[1.5, 2, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/ladder.glb" position={[260, 34, -5]} scale={[1.5, 2, 1.5]} />
      
      {/* Poles for atmosphere */}
      <GLBModel path="/assets/Models/GLB format/poles.glb" position={[-120, 10, -35]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/poles.glb" position={[80, 32, -35]} scale={[1.5, 1.5, 1.5]} />
      <GLBModel path="/assets/Models/GLB format/poles.glb" position={[320, 28, -35]} scale={[1.5, 1.5, 1.5]} />
      
      {/* Hearts for health pickups */}
      <AnimatedCollectible path="/assets/Models/GLB format/heart.glb" position={[-100, 14, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/heart.glb" position={[120, 40, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/heart.glb" position={[400, 22, 0]} scale={[1.5, 1.5, 1.5]} />
      
      {/* Keys for unlocking areas */}
      <AnimatedCollectible path="/assets/Models/GLB format/key.glb" position={[-60, 18, 0]} scale={[1.5, 1.5, 1.5]} />
      <AnimatedCollectible path="/assets/Models/GLB format/key.glb" position={[180, 40, 0]} scale={[1.5, 1.5, 1.5]} />
    </group>
  )
}

export default Scene