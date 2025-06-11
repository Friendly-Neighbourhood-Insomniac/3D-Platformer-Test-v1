import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Sky, KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Leva } from 'leva'
import Scene from './components/Scene'
import PlayerController from './components/PlayerController'
import InputProvider from './components/InputManager'
import { keyMap } from './components/CharacterController'
import UI from './components/UI'
import { usePlayerControls } from './hooks/useLeva'

function GameContent() {
  const playerControls = usePlayerControls()
  
  return (
    <>
      <Suspense fallback={null}>
        {/* Sky with proper lighting */}
        <Sky 
          distance={450000}
          sunPosition={[100, 100, 100]}
          inclination={0.49}
          azimuth={0.25}
          turbidity={8}
          rayleigh={2}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />
        
        {/* Bright ambient lighting */}
        <ambientLight intensity={1.2} color="#ffffff" />
        <directionalLight 
          position={[100, 100, 50]} 
          intensity={2.5}
          color="#ffffff"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={1000}
          shadow-camera-left={-500}
          shadow-camera-right={500}
          shadow-camera-top={500}
          shadow-camera-bottom={-500}
        />
        
        {/* Additional bright lighting */}
        <pointLight 
          position={[250, 100, 0]} 
          intensity={1.5} 
          color="#ffffff" 
          distance={300}
        />
        <pointLight 
          position={[0, 100, 250]} 
          intensity={1.5} 
          color="#ffffff" 
          distance={300}
        />
        
        {/* Light fog for depth */}
        <fog attach="fog" args={['#87CEEB', 200, 800]} />
        
        {/* Bright environment */}
        <Environment preset="sunset" background={true} />
        
        <Physics gravity={[0, -30, 0]} debug={playerControls.debugMode}>
          <Scene />
          <PlayerController
            position={[0, 2, 0]}
            capsuleHeight={playerControls.capsuleHeight}
            capsuleRadius={playerControls.capsuleRadius}
            speed={playerControls.speed}
            runSpeed={playerControls.runSpeed}
            jumpForce={playerControls.jumpForce}
            gravityScale={playerControls.gravityScale}
            airControl={playerControls.airControl}
            groundRayLength={playerControls.groundRayLength}
            cameraOffset={[
              playerControls.cameraOffsetX,
              playerControls.cameraOffsetY,
              playerControls.cameraOffsetZ
            ]}
            cameraDamping={playerControls.cameraDamping}
            debugMode={playerControls.debugMode}
          />
        </Physics>
      </Suspense>
    </>
  )
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Leva Controls Panel */}
      <Leva 
        collapsed={false}
        oneLineLabels={true}
        titleBar={{ position: { x: 0, y: 40 } }}
      />
      
      <InputProvider showMobileControls={true}>
        <KeyboardControls map={keyMap}>
          <Canvas
            camera={{ 
             position: [0, 15, 25], 
              fov: 75,
              near: 0.1,
              far: 2000
            }}
            shadows
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 2]}
          >
            <GameContent />
          </Canvas>
        </KeyboardControls>
      </InputProvider>
      
      <UI />
    </div>
  )
}

export default App