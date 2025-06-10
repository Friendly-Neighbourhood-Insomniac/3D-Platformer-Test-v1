import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useBox } from '@react-three/cannon'
import map4Data from '../../map4.json'

function Player() {
  const playerStart = map4Data.playerStart || { x: 0, y: 1.5, z: 0 }
  
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [playerStart.x, playerStart.y, playerStart.z],
    args: [0.8, 1.6, 0.8],
    material: {
      friction: 0.1,
      restitution: 0.1
    }
  }))

  const velocity = useRef([0, 0, 0])
  const position = useRef([playerStart.x, playerStart.y, playerStart.z])
  
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
    
    const moveSpeed = 6
    const jumpForce = 12
    
    let moveX = 0
    let moveZ = 0
    
    if (forward) moveZ -= moveSpeed
    if (backward) moveZ += moveSpeed
    if (left) moveX -= moveSpeed
    if (right) moveX += moveSpeed
    
    // Apply movement with some air control
    const airControl = Math.abs(velocity.current[1]) < 0.1 ? 1 : 0.3
    api.velocity.set(moveX * airControl, velocity.current[1], moveZ * airControl)
    
    // Jump (only if not already jumping)
    if (jump && Math.abs(velocity.current[1]) < 0.1) {
      api.velocity.set(velocity.current[0], jumpForce, velocity.current[2])
    }
    
    // Reset player if they fall too far
    if (position.current[1] < -20) {
      api.position.set(playerStart.x, playerStart.y, playerStart.z)
      api.velocity.set(0, 0, 0)
    }
  })

  return (
    <mesh ref={ref} castShadow>
      <capsuleGeometry args={[0.4, 1.2]} />
      <meshStandardMaterial color="#4a90e2" />
    </mesh>
  )
}

export default Player