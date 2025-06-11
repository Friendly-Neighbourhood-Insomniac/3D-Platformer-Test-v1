import React, { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import { useInput } from './InputManager'
import CameraController from './CameraController'
import { useGameState } from './Scene'
import * as THREE from 'three'

function PlayerController({
  position = [0, 10, 0],
  capsuleHeight = 1.8,
  capsuleRadius = 0.4,
  speed = 8,
  runSpeed = 12,
  jumpForce = 20,
  gravityScale = 1,
  airControl = 0.3,
  groundRayLength = 0.7,
  cameraOffset = [0, 8, 15],
  cameraDamping = 0.05,
  debugMode = false
}) {
  const { getInput } = useInput()
  const { updateGameState } = useGameState()
  const rigidBodyRef = useRef()
  const meshRef = useRef()
  
  // State
  const [isGrounded, setIsGrounded] = useState(false)
  const [velocity, setVelocity] = useState(new THREE.Vector3())
  const [currentAnimation, setCurrentAnimation] = useState('idle')
  
  // Raycasting for ground detection
  const raycaster = useRef(new THREE.Raycaster())
  const rayDirection = useRef(new THREE.Vector3(0, -1, 0))
  
  // Ground detection
  const checkGrounded = useCallback(() => {
    if (!rigidBodyRef.current) return false
    
    const currentVel = rigidBodyRef.current.linvel()
    const position = rigidBodyRef.current.translation()
    
    // Check if velocity is very small and player is close to a platform
    // This is a simplified ground check
    const isNearGround = Math.abs(currentVel.y) < 0.5 && position.y > -10
    
    return isNearGround
  }, [])
  
  // Animation state management
  const updateAnimation = useCallback((vel, grounded, moving) => {
    let newAnimation = 'idle'
    
    if (!grounded) {
      newAnimation = vel.y > 0.5 ? 'jump' : 'fall'
    } else if (moving) {
      const speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z)
      newAnimation = speed > 6 ? 'run' : 'walk'
    }
    
    if (newAnimation !== currentAnimation) {
      setCurrentAnimation(newAnimation)
    }
  }, [currentAnimation])
  
  // Main update loop
  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return
    
    const input = getInput()
    const currentVel = rigidBodyRef.current.linvel()
    const currentPos = rigidBodyRef.current.translation()
    const vel = new THREE.Vector3(currentVel.x, currentVel.y, currentVel.z)
    
    // Ground check
    const grounded = checkGrounded()
    if (grounded !== isGrounded) {
      setIsGrounded(grounded)
    }
    
    // Movement calculation
    const isMoving = Math.abs(input.movement.x) > 0.1 || Math.abs(input.movement.y) > 0.1
    
    // Calculate movement relative to camera
    const camera = state.camera
    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)
    cameraDirection.y = 0
    cameraDirection.normalize()
    
    const cameraRight = new THREE.Vector3()
    cameraRight.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0))
    
    const moveDirection = new THREE.Vector3()
    moveDirection.addScaledVector(cameraRight, input.movement.x)
    moveDirection.addScaledVector(cameraDirection, input.movement.y)
    moveDirection.normalize()
    
    // Apply movement
    const currentSpeed = input.run ? runSpeed : speed
    const controlFactor = grounded ? 1 : airControl
    
    let newVelX = currentVel.x
    let newVelZ = currentVel.z
    
    if (isMoving) {
      newVelX = moveDirection.x * currentSpeed * controlFactor
      newVelZ = moveDirection.z * currentSpeed * controlFactor
    } else if (grounded) {
      // Apply friction when not moving
      newVelX *= 0.8
      newVelZ *= 0.8
    }
    
    // Jumping
    if (input.jump && grounded) {
      rigidBodyRef.current.setLinvel({
        x: newVelX,
        y: jumpForce,
        z: newVelZ
      }, true)
    } else {
      rigidBodyRef.current.setLinvel({
        x: newVelX,
        y: currentVel.y,
        z: newVelZ
      }, true)
    }
    
    // Update velocity state
    setVelocity(vel)
    
    // Update player position in game state
    updateGameState({ playerPosition: [currentPos.x, currentPos.y, currentPos.z] })
    
    // Update animation
    updateAnimation(vel, grounded, isMoving)
    
    // Character rotation based on movement
    if (isMoving && meshRef.current) {
      const targetRotation = Math.atan2(moveDirection.x, moveDirection.z)
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        0.1
      )
    }
    
    // Reset if fallen too far
    if (currentPos.y < -50) {
      rigidBodyRef.current.setTranslation(position, true)
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
    }
  })
  
  // Debug visualization
  const DebugVisuals = () => {
    if (!debugMode) return null
    
    return (
      <group>
        {/* Ground ray visualization */}
        <mesh position={[0, -capsuleHeight/2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, groundRayLength]} />
          <meshBasicMaterial color={isGrounded ? "green" : "red"} />
        </mesh>
        
        {/* Velocity vector */}
        <mesh 
          position={[0, capsuleHeight/2 + 0.5, 0]}
          rotation={[0, 0, -Math.atan2(velocity.z, velocity.x) + Math.PI/2]}
        >
          <cylinderGeometry args={[0.05, 0.05, velocity.length() * 0.1]} />
          <meshBasicMaterial color="blue" />
        </mesh>
        
        {/* Collider bounds */}
        <mesh>
          <capsuleGeometry args={[capsuleRadius, capsuleHeight]} />
          <meshBasicMaterial color="yellow" wireframe transparent opacity={0.3} />
        </mesh>
      </group>
    )
  }
  
  return (
    <>
      <RigidBody
        ref={rigidBodyRef}
        position={position}
        type="dynamic"
        mass={1}
        restitution={0.1}
        friction={0.8}
        linearDamping={0.1}
        angularDamping={0.5}
        gravityScale={gravityScale}
        lockRotations
      >
        <CapsuleCollider args={[capsuleHeight/2, capsuleRadius]} />
        
        <group ref={meshRef}>
          {/* Character mesh */}
          <mesh castShadow receiveShadow>
            <capsuleGeometry args={[capsuleRadius, capsuleHeight]} />
            <meshStandardMaterial 
              color={
                currentAnimation === 'idle' ? "#4a90e2" :
                currentAnimation === 'walk' ? "#32cd32" :
                currentAnimation === 'run' ? "#ffa500" :
                currentAnimation === 'jump' ? "#ff69b4" :
                "#e24a4a" // fall
              }
              emissive={isGrounded ? "#000000" : "#330000"}
              emissiveIntensity={isGrounded ? 0 : 0.2}
            />
          </mesh>
          
          {/* Character face/direction indicator */}
          <mesh position={[0, capsuleHeight/4, capsuleRadius * 0.8]}>
            <sphereGeometry args={[0.1]} />
            <meshStandardMaterial color="white" />
          </mesh>
          
          <DebugVisuals />
        </group>
      </RigidBody>
      
      {/* Camera controller */}
      <CameraController
        target={rigidBodyRef}
        offset={cameraOffset}
        damping={cameraDamping}
        enableRotation={true}
        minDistance={3}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.2}
      />
    </>
  )
}

export default PlayerController