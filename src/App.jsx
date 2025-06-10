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
          position: [0, 30, 40], 
          fov: 75,
          near: 0.1,
          far: 2000
        }}
        shadows
      >
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
          
          <Physics gravity={[0, -30, 0]} debug={false}>
            <Scene />
            <Player />
          </Physics>
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={20}
            maxDistance={300}
            target={[300, 20, 0]}
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