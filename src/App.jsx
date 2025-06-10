import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, Sky } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import Scene from './components/Scene'
import Player from './components/Player'
import UI from './components/UI'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ 
          position: [0, 8, 15], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        shadows
      >
        <Suspense fallback={null}>
          <Sky 
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0}
            azimuth={0.25}
          />
          
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[50, 50, 25]} 
            intensity={1.5}
            castShadow
            shadow-mapSize={[4096, 4096]}
            shadow-camera-far={200}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />
          
          <Physics gravity={[0, -30, 0]} debug={false}>
            <Scene />
            <Player />
          </Physics>
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={8}
            maxDistance={80}
            target={[40, 5, 0]}
          />
          
          <Grid 
            args={[300, 300]} 
            position={[0, -0.01, 0]}
            cellSize={2}
            cellThickness={0.5}
            cellColor="#6f6f6f"
            sectionSize={10}
            sectionThickness={1}
            sectionColor="#9d4b4b"
            fadeDistance={150}
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