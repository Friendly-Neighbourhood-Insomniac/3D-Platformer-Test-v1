import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

function Player() {
  const playerRef = useRef()
  const [isGrounded, setIsGrounded] = useState(false)
  const [velocity, setVelocity] = useState([0, 0, 0])
  
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false
  })

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true
          break
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true
          break
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = true
          break
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = true
          break
        case 'Space':
          keys.current.jump = true
          event.preventDefault()
          break
      }
    }

    const handleKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false
          break
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false
          break
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = false
          break
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = false
          break
        case 'Space':
          keys.current.jump = false
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame(() => {
    if (!playerRef.current) return
    
    const { forward, backward, left, right, jump } = keys.current
    
    const moveSpeed = 12 // Increased speed for massive scale
    const jumpForce = 18 // Increased jump for larger gaps
    const airControl = 0.4
    
    // Get current velocity
    const currentVel = playerRef.current.linvel()
    setVelocity([currentVel.x, currentVel.y, currentVel.z])
    
    // Check if grounded (simple check based on Y velocity)
    const grounded = Math.abs(currentVel.y) < 0.5
    setIsGrounded(grounded)
    
    // Calculate movement direction
    let moveX = 0
    let moveZ = 0
    
    if (forward) moveZ -= 1
    if (backward) moveZ += 1
    if (left) moveX -= 1
    if (right) moveX += 1
    
    // Normalize diagonal movement
    if (moveX !== 0 && moveZ !== 0) {
      moveX *= 0.707
      moveZ *= 0.707
    }
    
    // Apply movement
    const controlFactor = grounded ? 1 : airControl
    const newVelX = moveX * moveSpeed * controlFactor
    const newVelZ = moveZ * moveSpeed * controlFactor
    
    playerRef.current.setLinvel({
      x: newVelX,
      y: currentVel.y,
      z: newVelZ
    }, true)
    
    // Jump
    if (jump && grounded) {
      playerRef.current.setLinvel({
        x: currentVel.x,
        y: jumpForce,
        z: currentVel.z
      }, true)
    }
    
    // Reset player if they fall too far (adjusted for massive scale)
    const position = playerRef.current.translation()
    if (position.y < -20) {
      playerRef.current.setTranslation({ x: 0, y: 8, z: 0 }, true)
      playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
    }
  })

  return (
    <RigidBody
      ref={playerRef}
      position={[0, 6, 0]}
      type="dynamic"
      colliders="ball"
      mass={1}
      restitution={0.1}
      friction={0.8}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow>
        <capsuleGeometry args={[0.8, 2]} />
        <meshStandardMaterial 
          color={isGrounded ? "#4a90e2" : "#e24a4a"} 
          emissive={isGrounded ? "#000000" : "#330000"}
          emissiveIntensity={isGrounded ? 0 : 0.2}
        />
      </mesh>
    </RigidBody>
  )
}

export default Player