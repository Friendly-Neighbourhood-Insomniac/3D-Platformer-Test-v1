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
        {/* Jungle Sky */}
        <Sky 
          distance={450000}
          sunPosition={[200, 40, 200]}
          inclination={0.6}
          azimuth={0.25}
          turbidity={10}
          rayleigh={3}
          mieCoefficient={0.005}
          mieDirectionalG={0.7}
        />
        
        {/* Jungle Lighting */}
        <ambientLight intensity={0.6} color="#90EE90" />
        <directionalLight 
          position={[300, 200, 100]} 
          intensity={1.8}
          color="#FFF8DC"
          castShadow
          shadow-mapSize={[4096, 4096]}
          shadow-camera-far={800}
          shadow-camera-left={-300}
          shadow-camera-right={300}
          shadow-camera-top={300}
          shadow-camera-bottom={-300}
        />
        
        {/* Additional atmospheric lighting for massive scale */}
        <pointLight 
          position={[150, 60, 0]} 
          intensity={0.8} 
          color="#FFD700" 
          distance={200}
        />
        <pointLight 
          position={[300, 50, 0]} 
          intensity={0.6} 
          color="#FF6347" 
          distance={180}
        />
        <pointLight 
          position={[450, 70, 0]} 
          intensity={0.8} 
          color="#9370DB" 
          distance={220}
        />
        <pointLight 
          position={[600, 80, 0]} 
          intensity={1.0} 
          color="#00FFFF" 
          distance={250}
        />
        
        {/* Fog for massive depth */}
        <fog attach="fog" args={['#87CEEB', 100, 500]} />
        
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
        
        {/* Environment for reflections */}
        <Environment preset="forest" background={false} />
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
              position: [0, 30, 40], 
              fov: 75,
              near: 0.1,
              far: 2000
            }}
            shadows
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