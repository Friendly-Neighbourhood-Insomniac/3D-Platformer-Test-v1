import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import Scene from './components/Scene'
import Player from './components/Player'
import UI from './components/UI'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ 
          position: [15, 8, 15], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        shadows
      >
        <Suspense fallback={null}>
          <Environment preset="forest" />
          <ambientLight intensity={0.3} />
          <directionalLight 
            position={[20, 20, 10]} 
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={100}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
          />
          
          <Physics gravity={[0, -25, 0]} broadphase="SAP">
            <Scene />
            <Player />
          </Physics>
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minDistance={5}
            maxDistance={50}
          />
          
          <Grid 
            args={[200, 200]} 
            position={[0, -0.01, 0]}
            cellSize={2}
            cellThickness={0.5}
            cellColor="#6f6f6f"
            sectionSize={10}
            sectionThickness={1}
            sectionColor="#9d4b4b"
            fadeDistance={100}
            fadeStrength={1}
            infiniteGrid
          />
        </Suspense>
      </Canvas>
      
      <UI />
    </div>
  )
}

export default App