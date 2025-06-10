import React from 'react'
import { useGLTF } from '@react-three/drei'
import { useBox } from '@react-three/cannon'
import map1Data from '../../map1.json'

function SceneObject({ item }) {
  const { scene } = useGLTF(item.path)
  
  // Create physics body for collision
  const [ref] = useBox(() => ({
    position: item.position,
    rotation: item.rotation ? [
      (item.rotation[0] * Math.PI) / 180,
      (item.rotation[1] * Math.PI) / 180,
      (item.rotation[2] * Math.PI) / 180
    ] : [0, 0, 0],
    type: 'Static',
    args: [
      (item.scale?.[0] || 1) * 2,
      (item.scale?.[1] || 1) * 2,
      (item.scale?.[2] || 1) * 2
    ]
  }))

  return (
    <group ref={ref}>
      <primitive 
        object={scene.clone()} 
        position={item.position}
        rotation={item.rotation ? [
          (item.rotation[0] * Math.PI) / 180,
          (item.rotation[1] * Math.PI) / 180,
          (item.rotation[2] * Math.PI) / 180
        ] : [0, 0, 0]}
        scale={item.scale || [1, 1, 1]}
        castShadow
        receiveShadow
      />
    </group>
  )
}

function Scene() {
  return (
    <group>
      {map1Data.scene.map((item, index) => (
        <SceneObject key={`${item.id}-${index}`} item={item} />
      ))}
    </group>
  )
}

// Preload all GLB files
map1Data.scene.forEach(item => {
  useGLTF.preload(item.path)
})

export default Scene