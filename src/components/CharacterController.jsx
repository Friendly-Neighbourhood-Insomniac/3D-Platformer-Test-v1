import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import { useKeyboardControls, KeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

// Input mapping for keyboard controls
export const Controls = {
  forward: 'forward',
  backward: 'backward',
  left: 'left', 
  right: 'right',
  jump: 'jump',
  run: 'run'
}

export const keyMap = [
  { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
  { name: Controls.backward, keys: ['ArrowDown', 'KeyS'] },
  { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
  { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
  { name: Controls.jump, keys: ['Space'] },
  { name: Controls.run, keys: ['ShiftLeft', 'ShiftRight'] }
]

// Character Controller Component
function CharacterController({ 
  position = [0, 2, 0],
  capsuleHeight = 1.8,
  capsuleRadius = 0.4,
  speed = 8,
  runSpeed = 12,
  jumpForce = 15,
  gravityScale = 1,
  airControl = 0.3,
  groundRayLength = 0.7,
  cameraOffset = [0, 3, 8],
  cameraDamping = 0.05,
  debugMode = false,
  onGroundedChange,
  onVelocityChange,
  onAnimationChange
}) {
  const { camera, scene } = useThree()
  const rigidBodyRef = useRef()
  const meshRef = useRef()
  const cameraTargetRef = useRef(new THREE.Vector3())
  const cameraPositionRef = useRef(new THREE.Vector3())
  
  // State
  const [isGrounded, setIsGrounded] = useState(false)
  const [velocity, setVelocity] = useState(new THREE.Vector3())
  const [currentAnimation, setCurrentAnimation] = useState('idle')
  const [gamepadIndex, setGamepadIndex] = useState(-1)
  
  // Input states
  const inputState = useRef({
    movement: new THREE.Vector2(),
    jump: false,
    run: false,
    gamepad: null
  })
  
  // Mobile touch controls
  const [touchControls, setTouchControls] = useState({
    joystick: { x: 0, y: 0, active: false },
    jumpButton: false
  })
  
  // Raycaster for ground detection
  const raycaster = useRef(new THREE.Raycaster())
  const rayDirection = useRef(new THREE.Vector3(0, -1, 0))
  
  // Get keyboard controls
  const [, get] = useKeyboardControls()
  
  // Gamepad detection and handling
  useEffect(() => {
    const checkGamepads = () => {
      const gamepads = navigator.getGamepads()
      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          setGamepadIndex(i)
          break
        }
      }
    }
    
    window.addEventListener('gamepadconnected', checkGamepads)
    window.addEventListener('gamepaddisconnected', () => setGamepadIndex(-1))
    
    return () => {
      window.removeEventListener('gamepadconnected', checkGamepads)
      window.removeEventListener('gamepaddisconnected', () => setGamepadIndex(-1))
    }
  }, [])
  
  // Ground detection using raycasting
  const checkGrounded = useCallback(() => {
    if (!rigidBodyRef.current) return false
    
    const position = rigidBodyRef.current.translation()
    raycaster.current.set(
      new THREE.Vector3(position.x, position.y, position.z),
      rayDirection.current
    )
    
    const intersects = raycaster.current.intersectObjects(scene.children, true)
    const groundHit = intersects.find(hit => 
      hit.distance <= groundRayLength && 
      hit.object !== meshRef.current
    )
    
    return !!groundHit
  }, [scene, groundRayLength])
  
  // Update input from various sources
  const updateInput = useCallback(() => {
    const keyboardInput = get()
    let movement = new THREE.Vector2()
    let jump = false
    let run = false
    
    // Keyboard input
    if (keyboardInput.forward) movement.y += 1
    if (keyboardInput.backward) movement.y -= 1
    if (keyboardInput.left) movement.x -= 1
    if (keyboardInput.right) movement.x += 1
    if (keyboardInput.jump) jump = true
    if (keyboardInput.run) run = true
    
    // Gamepad input
    if (gamepadIndex >= 0) {
      const gamepad = navigator.getGamepads()[gamepadIndex]
      if (gamepad) {
        // Left stick for movement
        const deadzone = 0.1
        const leftStickX = Math.abs(gamepad.axes[0]) > deadzone ? gamepad.axes[0] : 0
        const leftStickY = Math.abs(gamepad.axes[1]) > deadzone ? -gamepad.axes[1] : 0
        
        movement.x += leftStickX
        movement.y += leftStickY
        
        // Buttons
        if (gamepad.buttons[0]?.pressed) jump = true // A button
        if (gamepad.buttons[1]?.pressed) run = true  // B button
        
        inputState.current.gamepad = gamepad
      }
    }
    
    // Touch/mobile input
    if (touchControls.joystick.active) {
      movement.x += touchControls.joystick.x
      movement.y += touchControls.joystick.y
    }
    if (touchControls.jumpButton) jump = true
    
    // Normalize diagonal movement
    if (movement.length() > 1) {
      movement.normalize()
    }
    
    inputState.current.movement = movement
    inputState.current.jump = jump
    inputState.current.run = run
  }, [get, gamepadIndex, touchControls])
  
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
      onAnimationChange?.(newAnimation)
    }
  }, [currentAnimation, onAnimationChange])
  
  // Camera follow logic
  const updateCamera = useCallback((playerPosition) => {
    const targetPosition = new THREE.Vector3(
      playerPosition.x + cameraOffset[0],
      playerPosition.y + cameraOffset[1], 
      playerPosition.z + cameraOffset[2]
    )
    
    const targetLookAt = new THREE.Vector3(
      playerPosition.x,
      playerPosition.y + 1,
      playerPosition.z
    )
    
    // Smooth camera movement
    cameraPositionRef.current.lerp(targetPosition, cameraDamping)
    cameraTargetRef.current.lerp(targetLookAt, cameraDamping)
    
    camera.position.copy(cameraPositionRef.current)
    camera.lookAt(cameraTargetRef.current)
  }, [camera, cameraOffset, cameraDamping])
  
  // Main update loop
  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return
    
    updateInput()
    
    const currentVel = rigidBodyRef.current.linvel()
    const currentPos = rigidBodyRef.current.translation()
    const vel = new THREE.Vector3(currentVel.x, currentVel.y, currentVel.z)
    
    // Ground check
    const grounded = checkGrounded()
    if (grounded !== isGrounded) {
      setIsGrounded(grounded)
      onGroundedChange?.(grounded)
    }
    
    // Movement calculation
    const { movement, jump, run } = inputState.current
    const isMoving = movement.length() > 0.1
    
    // Calculate movement relative to camera
    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)
    cameraDirection.y = 0
    cameraDirection.normalize()
    
    const cameraRight = new THREE.Vector3()
    cameraRight.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0))
    
    const moveDirection = new THREE.Vector3()
    moveDirection.addScaledVector(cameraRight, movement.x)
    moveDirection.addScaledVector(cameraDirection, -movement.y)
    moveDirection.normalize()
    
    // Apply movement
    const currentSpeed = run ? runSpeed : speed
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
    if (jump && grounded) {
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
    onVelocityChange?.(vel)
    
    // Update animation
    updateAnimation(vel, grounded, isMoving)
    
    // Update camera
    updateCamera(currentPos)
    
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
  )
}

export default CharacterController