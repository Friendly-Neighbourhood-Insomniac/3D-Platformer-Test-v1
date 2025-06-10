import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function CameraController({ 
  target,
  offset = [0, 5, 10],
  damping = 0.05,
  lookAtOffset = [0, 1, 0],
  enableRotation = true,
  rotationSpeed = 0.5,
  minDistance = 3,
  maxDistance = 20,
  minPolarAngle = 0,
  maxPolarAngle = Math.PI / 2,
  autoRotate = false,
  autoRotateSpeed = 0.5
}) {
  const { camera, gl } = useThree()
  const spherical = useRef(new THREE.Spherical())
  const targetPosition = useRef(new THREE.Vector3())
  const currentPosition = useRef(new THREE.Vector3())
  const lookAtTarget = useRef(new THREE.Vector3())
  const currentLookAt = useRef(new THREE.Vector3())
  
  const mouseState = useRef({
    isDown: false,
    lastX: 0,
    lastY: 0
  })
  
  const touchState = useRef({
    isDown: false,
    lastX: 0,
    lastY: 0,
    distance: 0
  })
  
  // Initialize spherical coordinates from offset
  useEffect(() => {
    const offsetVec = new THREE.Vector3(...offset)
    spherical.current.setFromVector3(offsetVec)
    spherical.current.makeSafe()
  }, [offset])
  
  // Mouse controls
  useEffect(() => {
    if (!enableRotation) return
    
    const handleMouseDown = (event) => {
      mouseState.current.isDown = true
      mouseState.current.lastX = event.clientX
      mouseState.current.lastY = event.clientY
      gl.domElement.style.cursor = 'grabbing'
    }
    
    const handleMouseMove = (event) => {
      if (!mouseState.current.isDown) return
      
      const deltaX = event.clientX - mouseState.current.lastX
      const deltaY = event.clientY - mouseState.current.lastY
      
      spherical.current.theta -= deltaX * rotationSpeed * 0.01
      spherical.current.phi += deltaY * rotationSpeed * 0.01
      
      spherical.current.phi = Math.max(minPolarAngle, Math.min(maxPolarAngle, spherical.current.phi))
      
      mouseState.current.lastX = event.clientX
      mouseState.current.lastY = event.clientY
    }
    
    const handleMouseUp = () => {
      mouseState.current.isDown = false
      gl.domElement.style.cursor = 'grab'
    }
    
    const handleWheel = (event) => {
      spherical.current.radius += event.deltaY * 0.01
      spherical.current.radius = Math.max(minDistance, Math.min(maxDistance, spherical.current.radius))
    }
    
    gl.domElement.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    gl.domElement.addEventListener('wheel', handleWheel)
    
    gl.domElement.style.cursor = 'grab'
    
    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      gl.domElement.removeEventListener('wheel', handleWheel)
      gl.domElement.style.cursor = 'default'
    }
  }, [enableRotation, rotationSpeed, minDistance, maxDistance, minPolarAngle, maxPolarAngle, gl])
  
  // Touch controls for mobile
  useEffect(() => {
    if (!enableRotation) return
    
    const handleTouchStart = (event) => {
      if (event.touches.length === 1) {
        touchState.current.isDown = true
        touchState.current.lastX = event.touches[0].clientX
        touchState.current.lastY = event.touches[0].clientY
      } else if (event.touches.length === 2) {
        const dx = event.touches[0].clientX - event.touches[1].clientX
        const dy = event.touches[0].clientY - event.touches[1].clientY
        touchState.current.distance = Math.sqrt(dx * dx + dy * dy)
      }
    }
    
    const handleTouchMove = (event) => {
      event.preventDefault()
      
      if (event.touches.length === 1 && touchState.current.isDown) {
        const deltaX = event.touches[0].clientX - touchState.current.lastX
        const deltaY = event.touches[0].clientY - touchState.current.lastY
        
        spherical.current.theta -= deltaX * rotationSpeed * 0.01
        spherical.current.phi += deltaY * rotationSpeed * 0.01
        
        spherical.current.phi = Math.max(minPolarAngle, Math.min(maxPolarAngle, spherical.current.phi))
        
        touchState.current.lastX = event.touches[0].clientX
        touchState.current.lastY = event.touches[0].clientY
      } else if (event.touches.length === 2) {
        const dx = event.touches[0].clientX - event.touches[1].clientX
        const dy = event.touches[0].clientY - event.touches[1].clientY
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        const deltaDistance = distance - touchState.current.distance
        spherical.current.radius -= deltaDistance * 0.01
        spherical.current.radius = Math.max(minDistance, Math.min(maxDistance, spherical.current.radius))
        
        touchState.current.distance = distance
      }
    }
    
    const handleTouchEnd = () => {
      touchState.current.isDown = false
    }
    
    gl.domElement.addEventListener('touchstart', handleTouchStart, { passive: false })
    gl.domElement.addEventListener('touchmove', handleTouchMove, { passive: false })
    gl.domElement.addEventListener('touchend', handleTouchEnd)
    
    return () => {
      gl.domElement.removeEventListener('touchstart', handleTouchStart)
      gl.domElement.removeEventListener('touchmove', handleTouchMove)
      gl.domElement.removeEventListener('touchend', handleTouchEnd)
    }
  }, [enableRotation, rotationSpeed, minDistance, maxDistance, minPolarAngle, maxPolarAngle, gl])
  
  useFrame((state, delta) => {
    if (!target) return
    
    // Auto rotation
    if (autoRotate) {
      spherical.current.theta += autoRotateSpeed * delta
    }
    
    // Get target position
    const targetPos = target.current ? target.current.translation() : target
    targetPosition.current.set(targetPos.x, targetPos.y, targetPos.z)
    
    // Calculate camera position from spherical coordinates
    const cameraPosition = new THREE.Vector3()
    cameraPosition.setFromSpherical(spherical.current)
    cameraPosition.add(targetPosition.current)
    
    // Smooth camera movement
    currentPosition.current.lerp(cameraPosition, damping)
    camera.position.copy(currentPosition.current)
    
    // Calculate look-at target
    lookAtTarget.current.copy(targetPosition.current)
    lookAtTarget.current.add(new THREE.Vector3(...lookAtOffset))
    
    // Smooth look-at
    currentLookAt.current.lerp(lookAtTarget.current, damping)
    camera.lookAt(currentLookAt.current)
  })
  
  return null
}

export default CameraController