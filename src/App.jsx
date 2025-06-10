import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Sky } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import Scene from './components/Scene'
import Player from './components/Player'
import UI from './components/UI'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ 
          position: [0, 15, 20], 
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Jungle Sky */}
          <Sky 
            distance={450000}
            sunPosition={[100, 20, 100]}
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
            position={[100, 100, 50]} 
            intensity={1.8}
            color="#FFF8DC"
            castShadow
            shadow-mapSize={[4096, 4096]}
            shadow-camera-far={300}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
          />
          
          {/* Additional atmospheric lighting */}
          <pointLight 
            position={[50, 30, 0]} 
            intensity={0.5} 
            color="#FFD700" 
            distance={100}
          />
          <pointLight 
            position={[100, 25, 0]} 
            intensity={0.4} 
            color="#FF6347" 
            distance={80}
          />
          <pointLight 
            position={[150, 35, 0]} 
            intensity={0.6} 
            color="#9370DB" 
            distance={120}
          />
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#87CEEB', 50, 200]} />
          
          <Physics gravity={[0, -30, 0]} debug={false}>
            <Scene />
            <Player />
          </Physics>
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={10}
            maxDistance={100}
            target={[80, 10, 0]}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
          
          {/* Environment for reflections */}
          <Environment preset="forest" background={false} />
        </Suspense>
      </Canvas>
      
      <UI />
    </div>
  )
}

export default App