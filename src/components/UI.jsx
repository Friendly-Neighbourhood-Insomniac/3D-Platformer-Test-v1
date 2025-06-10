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
        fontSize: '32px',
        fontWeight: 'bold',
        textShadow: '4px 4px 8px rgba(0,0,0,0.9)',
        background: 'linear-gradient(45deg, #FF6347, #FFD700, #32CD32)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.9))'
      }}>
        🌴 Jungle Temple Quest 🏛️
      </div>
      
      {/* Level Theme */}
      <div style={{
        position: 'absolute',
        top: '65px',
        left: '20px',
        color: 'white',
        fontSize: '18px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        opacity: 0.95,
        background: 'rgba(0,0,0,0.3)',
        padding: '8px 15px',
        borderRadius: '20px',
        border: '2px solid rgba(255,215,0,0.5)'
      }}>
        🗺️ Ancient Emerald Ruins
      </div>
      
      {/* Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: 'white',
        fontSize: '14px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        lineHeight: '1.8',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(34,139,34,0.4))',
        padding: '20px',
        borderRadius: '15px',
        border: '2px solid rgba(255,215,0,0.4)',
        backdropFilter: 'blur(5px)'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#FFD700' }}>
          🎮 Adventure Controls
        </div>
        <div style={{ marginBottom: '6px' }}>🏃 WASD / Arrow Keys - Navigate the jungle</div>
        <div style={{ marginBottom: '6px' }}>🦘 Space - Jump over obstacles</div>
        <div style={{ marginBottom: '6px' }}>🖱️ Mouse - Explore camera angles</div>
        <div style={{ marginBottom: '6px' }}>💎 Collect gems and fruits!</div>
        <div style={{ color: '#FF6347', fontWeight: 'bold' }}>⚠️ Avoid lava and spikes!</div>
      </div>
      
      {/* Stats Panel */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        color: 'white',
        fontSize: '16px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        textAlign: 'right',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(139,69,19,0.5))',
        padding: '25px',
        borderRadius: '20px',
        border: '3px solid rgba(255,215,0,0.6)',
        minWidth: '220px',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#FFD700' }}>
          🏆 Adventure Stats
        </div>
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>💰 Score:</span>
          <span style={{ color: '#32CD32', fontWeight: 'bold', fontSize: '18px' }}>{score.toLocaleString()}</span>
        </div>
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>❤️ Lives:</span>
          <span style={{ color: '#FF6B6B', fontWeight: 'bold', fontSize: '18px' }}>{lives}</span>
        </div>
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>💎 Treasures:</span>
          <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '18px' }}>{collectibles}/45</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⏱️ Time:</span>
          <span style={{ color: '#4A90E2', fontWeight: 'bold', fontSize: '18px' }}>{formatTime(time)}</span>
        </div>
      </div>
      
      {/* Level Progress */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        color: 'white',
        fontSize: '14px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        textAlign: 'right',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(75,0,130,0.4))',
        padding: '20px',
        borderRadius: '15px',
        border: '2px solid rgba(147,112,219,0.6)',
        backdropFilter: 'blur(5px)'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#9370DB' }}>
          🗺️ Temple Exploration
        </div>
        <div style={{ opacity: 0.9, marginBottom: '4px' }}>🌿 Jungle Platforms: 80+</div>
        <div style={{ opacity: 0.9, marginBottom: '4px' }}>⚡ Moving Bridges: 12</div>
        <div style={{ opacity: 0.9, marginBottom: '4px' }}>🔥 Ancient Traps: 15</div>
        <div style={{ opacity: 0.9, marginBottom: '4px' }}>🏛️ Temple Chambers: 6</div>
        <div style={{ opacity: 0.9, marginBottom: '4px' }}>🗝️ Secret Paths: 3</div>
        <div style={{ opacity: 0.9 }}>💎 Crystal Sanctum: 1</div>
      </div>
      
      {/* Adventure Progress Bar */}
      <div style={{
        position: 'absolute',
        top: '120px',
        right: '20px',
        width: '250px',
        height: '50px',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(139,69,19,0.5))',
        border: '3px solid rgba(255,215,0,0.6)',
        borderRadius: '25px',
        overflow: 'hidden',
        backdropFilter: 'blur(5px)'
      }}>
        <div style={{
          width: '18%',
          height: '100%',
          background: 'linear-gradient(90deg, #FF6347, #FFD700, #32CD32)',
          borderRadius: '22px',
          transition: 'width 0.5s ease',
          boxShadow: '0 0 20px rgba(255,215,0,0.6)'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🏛️</span>
          <span>Temple Progress: 18%</span>
        </div>
      </div>
      
      {/* Collectible Types Legend */}
      <div style={{
        position: 'absolute',
        top: '190px',
        right: '20px',
        color: 'white',
        fontSize: '12px',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(34,139,34,0.3))',
        padding: '15px',
        borderRadius: '12px',
        border: '2px solid rgba(255,215,0,0.4)',
        backdropFilter: 'blur(3px)'
      }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#FFD700' }}>
          💎 Treasure Guide
        </div>
        <div style={{ marginBottom: '3px' }}>🪙 Gold Coins - 100 pts</div>
        <div style={{ marginBottom: '3px' }}>💎 Gems - 250 pts</div>
        <div style={{ marginBottom: '3px' }}>🍎 Jungle Fruits - 50 pts</div>
        <div style={{ marginBottom: '3px' }}>🔮 Crystal Orbs - 500 pts</div>
        <div style={{ color: '#FF6347' }}>⚠️ Avoid: Lava, Spikes, Electric</div>
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
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.1) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  )
}

export default UI