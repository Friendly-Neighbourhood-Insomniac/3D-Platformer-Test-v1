import React, { createContext, useContext, useRef, useEffect, useState } from 'react'

const InputContext = createContext()

export const useInput = () => {
  const context = useContext(InputContext)
  if (!context) {
    throw new Error('useInput must be used within an InputProvider')
  }
  return context
}

// Virtual joystick component for mobile
function VirtualJoystick({ onMove, size = 100, deadzone = 0.1 }) {
  const [isActive, setIsActive] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef()
  const knobRef = useRef()
  
  const handleStart = (clientX, clientY) => {
    setIsActive(true)
    updatePosition(clientX, clientY)
  }
  
  const handleMove = (clientX, clientY) => {
    if (!isActive) return
    updatePosition(clientX, clientY)
  }
  
  const handleEnd = () => {
    setIsActive(false)
    setPosition({ x: 0, y: 0 })
    onMove(0, 0)
  }
  
  const updatePosition = (clientX, clientY) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    let deltaX = clientX - centerX
    let deltaY = clientY - centerY
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const maxDistance = size / 2
    
    if (distance > maxDistance) {
      deltaX = (deltaX / distance) * maxDistance
      deltaY = (deltaY / distance) * maxDistance
    }
    
    const normalizedX = deltaX / maxDistance
    const normalizedY = -deltaY / maxDistance // Invert Y for game coordinates
    
    // Apply deadzone
    const magnitude = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY)
    if (magnitude < deadzone) {
      setPosition({ x: 0, y: 0 })
      onMove(0, 0)
    } else {
      setPosition({ x: deltaX, y: deltaY })
      onMove(normalizedX, normalizedY)
    }
  }
  
  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        touchAction: 'none',
        userSelect: 'none'
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => {
        e.preventDefault()
        const touch = e.touches[0]
        handleStart(touch.clientX, touch.clientY)
      }}
      onTouchMove={(e) => {
        e.preventDefault()
        const touch = e.touches[0]
        handleMove(touch.clientX, touch.clientY)
      }}
      onTouchEnd={(e) => {
        e.preventDefault()
        handleEnd()
      }}
    >
      <div
        ref={knobRef}
        style={{
          position: 'absolute',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          border: '2px solid rgba(255, 255, 255, 1)',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
          transition: isActive ? 'none' : 'transform 0.2s ease-out',
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}

// Virtual button component
function VirtualButton({ onPress, onRelease, children, style = {} }) {
  const [isPressed, setIsPressed] = useState(false)
  
  const handleStart = () => {
    setIsPressed(true)
    onPress?.()
  }
  
  const handleEnd = () => {
    setIsPressed(false)
    onRelease?.()
  }
  
  return (
    <div
      style={{
        position: 'absolute',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: isPressed ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)',
        border: '2px solid rgba(255, 255, 255, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        touchAction: 'none',
        userSelect: 'none',
        cursor: 'pointer',
        transform: isPressed ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.1s ease',
        ...style
      }}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => {
        e.preventDefault()
        handleStart()
      }}
      onTouchEnd={(e) => {
        e.preventDefault()
        handleEnd()
      }}
    >
      {children}
    </div>
  )
}

// Main input provider component
export function InputProvider({ children, showMobileControls = true }) {
  const inputState = useRef({
    keyboard: {},
    gamepad: null,
    gamepadIndex: -1,
    mobile: {
      joystick: { x: 0, y: 0 },
      jump: false,
      run: false
    }
  })
  
  const [isMobile, setIsMobile] = useState(false)
  const [gamepadConnected, setGamepadConnected] = useState(false)
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(mobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (event) => {
      inputState.current.keyboard[event.code] = true
    }
    
    const handleKeyUp = (event) => {
      inputState.current.keyboard[event.code] = false
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
  
  // Gamepad handling
  useEffect(() => {
    const checkGamepads = () => {
      const gamepads = navigator.getGamepads()
      let connected = false
      
      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          inputState.current.gamepad = gamepads[i]
          inputState.current.gamepadIndex = i
          connected = true
          break
        }
      }
      
      setGamepadConnected(connected)
      if (!connected) {
        inputState.current.gamepad = null
        inputState.current.gamepadIndex = -1
      }
    }
    
    const handleGamepadConnected = () => {
      checkGamepads()
    }
    
    const handleGamepadDisconnected = () => {
      checkGamepads()
    }
    
    window.addEventListener('gamepadconnected', handleGamepadConnected)
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected)
    
    // Poll for gamepad state
    const gamepadInterval = setInterval(checkGamepads, 100)
    
    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected)
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected)
      clearInterval(gamepadInterval)
    }
  }, [])
  
  // Input API
  const getInput = () => {
    const input = {
      movement: { x: 0, y: 0 },
      jump: false,
      run: false,
      camera: { x: 0, y: 0 }
    }
    
    // Keyboard input
    const kb = inputState.current.keyboard
    if (kb.KeyW || kb.ArrowUp) input.movement.y += 1
    if (kb.KeyS || kb.ArrowDown) input.movement.y -= 1
    if (kb.KeyA || kb.ArrowLeft) input.movement.x -= 1
    if (kb.KeyD || kb.ArrowRight) input.movement.x += 1
    if (kb.Space) input.jump = true
    if (kb.ShiftLeft || kb.ShiftRight) input.run = true
    
    // Gamepad input
    const gamepad = inputState.current.gamepad
    if (gamepad) {
      const deadzone = 0.1
      
      // Left stick for movement
      if (Math.abs(gamepad.axes[0]) > deadzone) input.movement.x += gamepad.axes[0]
      if (Math.abs(gamepad.axes[1]) > deadzone) input.movement.y -= gamepad.axes[1]
      
      // Right stick for camera
      if (Math.abs(gamepad.axes[2]) > deadzone) input.camera.x += gamepad.axes[2]
      if (Math.abs(gamepad.axes[3]) > deadzone) input.camera.y += gamepad.axes[3]
      
      // Buttons
      if (gamepad.buttons[0]?.pressed) input.jump = true // A
      if (gamepad.buttons[1]?.pressed) input.run = true  // B
    }
    
    // Mobile input
    const mobile = inputState.current.mobile
    input.movement.x += mobile.joystick.x
    input.movement.y += mobile.joystick.y
    if (mobile.jump) input.jump = true
    if (mobile.run) input.run = true
    
    // Normalize movement
    const movementMagnitude = Math.sqrt(input.movement.x * input.movement.x + input.movement.y * input.movement.y)
    if (movementMagnitude > 1) {
      input.movement.x /= movementMagnitude
      input.movement.y /= movementMagnitude
    }
    
    return input
  }
  
  const isKeyPressed = (key) => {
    return !!inputState.current.keyboard[key]
  }
  
  const isGamepadButtonPressed = (buttonIndex) => {
    return inputState.current.gamepad?.buttons[buttonIndex]?.pressed || false
  }
  
  const getGamepadAxis = (axisIndex) => {
    return inputState.current.gamepad?.axes[axisIndex] || 0
  }
  
  const contextValue = {
    getInput,
    isKeyPressed,
    isGamepadButtonPressed,
    getGamepadAxis,
    gamepadConnected,
    isMobile
  }
  
  return (
    <InputContext.Provider value={contextValue}>
      {children}
      
      {/* Mobile controls */}
      {isMobile && showMobileControls && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 1000 }}>
          <div style={{ pointerEvents: 'auto' }}>
            <VirtualJoystick
              onMove={(x, y) => {
                inputState.current.mobile.joystick.x = x
                inputState.current.mobile.joystick.y = y
              }}
            />
            
            <VirtualButton
              style={{ bottom: '20px', right: '20px' }}
              onPress={() => inputState.current.mobile.jump = true}
              onRelease={() => inputState.current.mobile.jump = false}
            >
              ↑
            </VirtualButton>
            
            <VirtualButton
              style={{ bottom: '20px', right: '100px' }}
              onPress={() => inputState.current.mobile.run = true}
              onRelease={() => inputState.current.mobile.run = false}
            >
              ⚡
            </VirtualButton>
          </div>
        </div>
      )}
    </InputContext.Provider>
  )
}

export default InputProvider