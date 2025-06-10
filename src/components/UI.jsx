import React from 'react'
import map4Data from '../../map4.json'

function UI() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 100
    }}>
      {/* Game Title */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
      }}>
        {map4Data.name || '3D Platformer'}
      </div>
      
      {/* Level Theme */}
      <div style={{
        position: 'absolute',
        top: '55px',
        left: '20px',
        color: 'white',
        fontSize: '14px',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        opacity: 0.8
      }}>
        Theme: {map4Data.theme || 'Unknown'}
      </div>
      
      {/* Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: 'white',
        fontSize: '14px',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        lineHeight: '1.5'
      }}>
        <div><strong>Controls:</strong></div>
        <div>WASD / Arrow Keys - Move</div>
        <div>Space - Jump</div>
        <div>Mouse - Look Around</div>
      </div>
      
      {/* Stats */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        color: 'white',
        fontSize: '14px',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        textAlign: 'right'
      }}>
        <div>Score: 0</div>
        <div>Lives: 3</div>
        <div>Collectibles: {map4Data.collectibles?.length || 0}</div>
      </div>
      
      {/* Level Info */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        color: 'white',
        fontSize: '12px',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        textAlign: 'right',
        opacity: 0.7
      }}>
        <div>Platforms: {map4Data.platforms?.length || 0}</div>
        <div>Enemies: {map4Data.enemies?.length || 0}</div>
        <div>Traps: {map4Data.traps?.length || 0}</div>
      </div>
    </div>
  )
}

export default UI