import React, { useState, useEffect } from 'react'

function UI() {
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [collectibles, setCollectibles] = useState(0)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 100,
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Game Title */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontSize: '36px',
        fontWeight: 'bold',
        textShadow: '4px 4px 8px rgba(0,0,0,0.9)',
        background: 'linear-gradient(45deg, #FF6347, #FFD700, #32CD32)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.9))'
      }}>
        🌴 MASSIVE JUNGLE ODYSSEY 🏛️
      </div>
      
      {/* Level Theme */}
      <div style={{
        position: 'absolute',
        top: '70px',
        left: '20px',
        color: 'white',
        fontSize: '20px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        opacity: 0.95,
        background: 'rgba(0,0,0,0.3)',
        padding: '10px 18px',
        borderRadius: '25px',
        border: '3px solid rgba(255,215,0,0.6)'
      }}>
        🗺️ Epic 500x500 Crystal Temple Expedition
      </div>
      
      {/* Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: 'white',
        fontSize: '16px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        lineHeight: '2',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(34,139,34,0.5))',
        padding: '25px',
        borderRadius: '20px',
        border: '3px solid rgba(255,215,0,0.5)',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px', color: '#FFD700' }}>
          🎮 Epic Adventure Controls
        </div>
        <div style={{ marginBottom: '8px' }}>🏃 WASD / Arrow Keys - Traverse the massive jungle</div>
        <div style={{ marginBottom: '8px' }}>🦘 Space - Leap across enormous chasms</div>
        <div style={{ marginBottom: '8px' }}>🖱️ Mouse - Survey the vast landscape</div>
        <div style={{ marginBottom: '8px' }}>💎 Collect 100+ treasures across 500 units!</div>
        <div style={{ color: '#FF6347', fontWeight: 'bold', fontSize: '18px' }}>⚠️ Navigate lava chambers & crystal caves!</div>
      </div>
      
      {/* Stats Panel */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        color: 'white',
        fontSize: '18px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        textAlign: 'right',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(139,69,19,0.6))',
        padding: '30px',
        borderRadius: '25px',
        border: '4px solid rgba(255,215,0,0.7)',
        minWidth: '280px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#FFD700' }}>
          🏆 Massive Adventure Stats
        </div>
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>💰 Score:</span>
          <span style={{ color: '#32CD32', fontWeight: 'bold', fontSize: '20px' }}>{score.toLocaleString()}</span>
        </div>
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>❤️ Lives:</span>
          <span style={{ color: '#FF6B6B', fontWeight: 'bold', fontSize: '20px' }}>{lives}</span>
        </div>
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>💎 Treasures:</span>
          <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '20px' }}>{collectibles}/100+</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⏱️ Time:</span>
          <span style={{ color: '#4A90E2', fontWeight: 'bold', fontSize: '20px' }}>{formatTime(time)}</span>
        </div>
      </div>
      
      {/* Level Progress */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        color: 'white',
        fontSize: '16px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        textAlign: 'right',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(75,0,130,0.5))',
        padding: '25px',
        borderRadius: '20px',
        border: '3px solid rgba(147,112,219,0.7)',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px', color: '#9370DB' }}>
          🗺️ Massive Temple Complex
        </div>
        <div style={{ opacity: 0.95, marginBottom: '6px' }}>🌿 Jungle Platforms: 200+</div>
        <div style={{ opacity: 0.95, marginBottom: '6px' }}>⚡ Moving Bridges: 25+</div>
        <div style={{ opacity: 0.95, marginBottom: '6px' }}>🔥 Ancient Traps: 30+</div>
        <div style={{ opacity: 0.95, marginBottom: '6px' }}>🏛️ Temple Chambers: 15+</div>
        <div style={{ opacity: 0.95, marginBottom: '6px' }}>🗝️ Secret Paths: 8+</div>
        <div style={{ opacity: 0.95, marginBottom: '6px' }}>💧 Waterfall Zones: 5</div>
        <div style={{ opacity: 0.95, marginBottom: '6px' }}>🌋 Lava Chambers: 3</div>
        <div style={{ opacity: 0.95 }}>💎 Crystal Sanctum: 1 EPIC</div>
      </div>
      
      {/* Adventure Progress Bar */}
      <div style={{
        position: 'absolute',
        top: '140px',
        right: '20px',
        width: '300px',
        height: '60px',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(139,69,19,0.6))',
        border: '4px solid rgba(255,215,0,0.7)',
        borderRadius: '30px',
        overflow: 'hidden',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{
          width: '12%',
          height: '100%',
          background: 'linear-gradient(90deg, #FF6347, #FFD700, #32CD32, #9370DB)',
          borderRadius: '26px',
          transition: 'width 0.5s ease',
          boxShadow: '0 0 25px rgba(255,215,0,0.8)'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>🏛️</span>
          <span>Epic Journey: 12% (60/500 units)</span>
        </div>
      </div>
      
      {/* Collectible Types Legend */}
      <div style={{
        position: 'absolute',
        top: '220px',
        right: '20px',
        color: 'white',
        fontSize: '14px',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(34,139,34,0.4))',
        padding: '20px',
        borderRadius: '15px',
        border: '3px solid rgba(255,215,0,0.5)',
        backdropFilter: 'blur(5px)'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#FFD700' }}>
          💎 Massive Treasure Guide
        </div>
        <div style={{ marginBottom: '5px' }}>🪙 Gold Coins - 100 pts (50+ scattered)</div>
        <div style={{ marginBottom: '5px' }}>💎 Rare Gems - 250 pts (30+ hidden)</div>
        <div style={{ marginBottom: '5px' }}>🍎 Jungle Fruits - 50 pts (25+ fresh)</div>
        <div style={{ marginBottom: '5px' }}>🔮 Crystal Orbs - 500 pts (10+ mystical)</div>
        <div style={{ marginBottom: '5px' }}>🏆 Temple Relics - 1000 pts (5 legendary)</div>
        <div style={{ color: '#FF6347', fontWeight: 'bold' }}>⚠️ Massive Hazards: Lava Lakes, Electric Fields!</div>
      </div>
      
      {/* Scale Indicator */}
      <div style={{
        position: 'absolute',
        top: '380px',
        right: '20px',
        color: 'white',
        fontSize: '14px',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(255,69,0,0.4))',
        padding: '20px',
        borderRadius: '15px',
        border: '3px solid rgba(255,69,0,0.6)',
        backdropFilter: 'blur(5px)'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#FF4500' }}>
          📏 Epic Scale Metrics
        </div>
        <div style={{ marginBottom: '5px' }}>📐 Map Size: 500x500 units</div>
        <div style={{ marginBottom: '5px' }}>🏔️ Height Range: 0-90 units</div>
        <div style={{ marginBottom: '5px' }}>🌳 Vegetation: 1000+ objects</div>
        <div style={{ marginBottom: '5px' }}>🏗️ Platforms: 200+ structures</div>
        <div style={{ marginBottom: '5px' }}>⚡ Moving Elements: 25+ dynamic</div>
        <div style={{ color: '#FFD700', fontWeight: 'bold' }}>🎯 Journey Distance: 500+ units!</div>
      </div>
      
      {/* Achievement Notification Area */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }}>
        {/* Achievement notifications would appear here */}
      </div>
      
      {/* Atmospheric Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.15) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  )
}

export default UI