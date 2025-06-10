import React from 'react'
import { useGLTF } from '@react-three/drei'
import { useBox } from '@react-three/cannon'
import map4Data from '../../map4.json'

function Platform({ platform }) {
  const { scene } = useGLTF(`assets/Models/GLB format/${platform.asset}`)
  
  const [ref] = useBox(() => ({
    position: platform.position,
    rotation: platform.rotation ? [
      (platform.rotation[0] * Math.PI) / 180,
      (platform.rotation[1] * Math.PI) / 180,
      (platform.rotation[2] * Math.PI) / 180
    ] : [0, 0, 0],
    type: 'Static',
    args: [
      (platform.scale?.[0] || 1) * 3,
      (platform.scale?.[1] || 1) * 1,
      (platform.scale?.[2] || 1) * 3
    ]
  }))

  return (
    <group ref={ref}>
      <primitive 
        object={scene.clone()} 
        position={platform.position}
        rotation={platform.rotation ? [
          (platform.rotation[0] * Math.PI) / 180,
          (platform.rotation[1] * Math.PI) / 180,
          (platform.rotation[2] * Math.PI) / 180
        ] : [0, 0, 0]}
        scale={platform.scale || [1, 1, 1]}
        castShadow
        receiveShadow
      />
    </group>
  )
}

function Obstacle({ obstacle }) {
  const { scene } = useGLTF(`assets/Models/GLB format/${obstacle.asset}`)
  
  const [ref] = useBox(() => ({
    position: obstacle.position,
    type: 'Static',
    args: [1, 1, 1]
  }))

  return (
    <group ref={ref}>
      <primitive 
        object={scene.clone()} 
        position={obstacle.position}
        castShadow
        receiveShadow
      />
    </group>
  )
}

function Collectible({ collectible }) {
  const { scene } = useGLTF(`assets/Models/GLB format/${collectible.asset}`)
  
  return (
    <group>
      <primitive 
        object={scene.clone()} 
        position={collectible.position}
        castShadow
      />
    </group>
  )
}

function Decoration({ decoration }) {
  const { scene } = useGLTF(`assets/Models/GLB format/${decoration.asset}`)
  
  return (
    <primitive 
      object={scene.clone()} 
      position={decoration.position}
      rotation={decoration.rotation ? [
        (decoration.rotation[0] * Math.PI) / 180,
        (decoration.rotation[1] * Math.PI) / 180,
        (decoration.rotation[2] * Math.PI) / 180
      ] : [0, 0, 0]}
      scale={decoration.scale || [1, 1, 1]}
      castShadow
      receiveShadow
    />
  )
}

function Trap({ trap }) {
  const { scene } = useGLTF(`assets/Models/GLB format/${trap.asset}`)
  
  return (
    <primitive 
      object={scene.clone()} 
      position={trap.position}
      rotation={trap.rotation ? [
        (trap.rotation[0] * Math.PI) / 180,
        (trap.rotation[1] * Math.PI) / 180,
        (trap.rotation[2] * Math.PI) / 180
      ] : [0, 0, 0]}
      castShadow
    />
  )
}

function Enemy({ enemy }) {
  const { scene } = useGLTF(`assets/Models/GLB format/${enemy.asset}`)
  
  const [ref] = useBox(() => ({
    position: enemy.position,
    type: 'Static',
    args: [1, 1, 1]
  }))

  return (
    <group ref={ref}>
      <primitive 
        object={scene.clone()} 
        position={enemy.position}
        castShadow
      />
    </group>
  )
}

function Trigger({ trigger }) {
  const { scene } = useGLTF(`assets/Models/GLB format/${trigger.asset}`)
  
  const [ref] = useBox(() => ({
    position: trigger.position,
    type: 'Static',
    args: [2, 3, 1]
  }))

  return (
    <group ref={ref}>
      <primitive 
        object={scene.clone()} 
        position={trigger.position}
        castShadow
        receiveShadow
      />
    </group>
  )
}

function Scene() {
  return (
    <group>
      {/* Render Platforms */}
      {map4Data.platforms?.map((platform, index) => (
        <Platform key={`platform-${index}`} platform={platform} />
      ))}
      
      {/* Render Obstacles */}
      {map4Data.obstacles?.map((obstacle, index) => (
        <Obstacle key={`obstacle-${index}`} obstacle={obstacle} />
      ))}
      
      {/* Render Collectibles */}
      {map4Data.collectibles?.map((collectible, index) => (
        <Collectible key={`collectible-${index}`} collectible={collectible} />
      ))}
      
      {/* Render Decorations */}
      {map4Data.decorations?.map((decoration, index) => (
        <Decoration key={`decoration-${index}`} decoration={decoration} />
      ))}
      
      {/* Render Traps */}
      {map4Data.traps?.map((trap, index) => (
        <Trap key={`trap-${index}`} trap={trap} />
      ))}
      
      {/* Render Enemies */}
      {map4Data.enemies?.map((enemy, index) => (
        <Enemy key={`enemy-${index}`} enemy={enemy} />
      ))}
      
      {/* Render Triggers */}
      {map4Data.triggers?.map((trigger, index) => (
        <Trigger key={`trigger-${index}`} trigger={trigger} />
      ))}
    </group>
  )
}

// Preload all GLB files used in map4
const assetsToPreload = [
  ...map4Data.platforms?.map(p => `assets/Models/GLB format/${p.asset}`) || [],
  ...map4Data.obstacles?.map(o => `assets/Models/GLB format/${o.asset}`) || [],
  ...map4Data.collectibles?.map(c => `assets/Models/GLB format/${c.asset}`) || [],
  ...map4Data.decorations?.map(d => `assets/Models/GLB format/${d.asset}`) || [],
  ...map4Data.traps?.map(t => `assets/Models/GLB format/${t.asset}`) || [],
  ...map4Data.enemies?.map(e => `assets/Models/GLB format/${e.asset}`) || [],
  ...map4Data.triggers?.map(t => `assets/Models/GLB format/${t.asset}`) || []
]

assetsToPreload.forEach(asset => {
  useGLTF.preload(asset)
})

export default Scene