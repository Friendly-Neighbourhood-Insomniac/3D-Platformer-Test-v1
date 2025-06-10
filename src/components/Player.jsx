import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useBox } from '@react-three/cannon'
import { Vector3 } from 'three'

function Player() {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [0, 5, 0],
    args: [1, 2, 1],
    material: {
      friction: 0.1,
      restitution: 0.1
    }
  }))

  const velocity = useRef([0, 0, 0])
  const position = useRef([0, 5, 0])
  
  useEffect(() => {
    api.velocity.subscribe((v) => velocity.current = v)
    api.position.subscribe((p) => position.current = p)
  }, [api])

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
    const { forward, backward, left, right, jump } = keys.current
    
    const moveSpeed = 8
    const jumpForce = 15
    
    let moveX = 0
    let moveZ = 0
    
    if (forward) moveZ -= moveSpeed
    if (backward) moveZ += moveSpeed
    if (left) moveX -= moveSpeed
    if (right) moveX += moveSpeed
    
    // Apply movement
    if (moveX !== 0 || moveZ !== 0) {
      api.velocity.set(moveX, velocity.current[1], moveZ)
    } else {
      api.velocity.set(0, velocity.current[1], 0)
    }
    
    // Jump (only if not already jumping)
    if (jump && Math.abs(velocity.current[1]) < 0.1) {
      api.velocity.set(velocity.current[0], jumpForce, velocity.current[2])
    }
  })

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="#4a90e2" />
    </mesh>
  )
}

export default Player