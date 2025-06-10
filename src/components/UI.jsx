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
        fontSize: '28px',
        fontWeight: 'bold',
        textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
        background: 'linear-gradient(45deg, #4a90e2, #50c878)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))'
      }}>
        Crystal Cavern Adventure
      </div>
      
      {/* Level Theme */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: '20px',
        color: 'white',
        fontSize: '16px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        opacity: 0.9
      }}>
        Theme: Emerald Heights
      </div>
      
      {/* Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: 'white',
        fontSize: '14px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        lineHeight: '1.6',
        background: 'rgba(0,0,0,0.3)',
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
          🎮 Controls
        </div>
        <div>🔄 WASD / Arrow Keys - Move</div>
        <div>🚀 Space - Jump</div>
        <div>🖱️ Mouse - Camera</div>
        <div>🎯 Collect all golden orbs!</div>
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
        background: 'rgba(0,0,0,0.4)',
        padding: '20px',
        borderRadius: '15px',
        border: '2px solid rgba(255,255,255,0.2)',
        minWidth: '200px'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#ffd700' }}>
          📊 Game Stats
        </div>
        <div style={{ marginBottom: '8px' }}>
          💰 Score: <span style={{ color: '#50c878', fontWeight: 'bold' }}>{score.toLocaleString()}</span>
        </div>
        <div style={{ marginBottom: '8px' }}>
          ❤️ Lives: <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>{lives}</span>
        </div>
        <div style={{ marginBottom: '8px' }}>
          ⭐ Collectibles: <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{collectibles}/24</span>
        </div>
        <div>
          ⏱️ Time: <span style={{ color: '#4a90e2', fontWeight: 'bold' }}>{formatTime(time)}</span>
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
        background: 'rgba(0,0,0,0.3)',
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#4ad4d4' }}>
          🏁 Level Progress
        </div>
        <div style={{ opacity: 0.8 }}>🏗️ Platforms: 50+</div>
        <div style={{ opacity: 0.8 }}>⚡ Moving Platforms: 8</div>
        <div style={{ opacity: 0.8 }}>🔥 Hazards: 12</div>
        <div style={{ opacity: 0.8 }}>🚩 Checkpoints: 4</div>
        <div style={{ opacity: 0.8 }}>🗝️ Secret Areas: 2</div>
      </div>
      
      {/* Mini Map Indicator */}
      <div style={{
        position: 'absolute',
        top: '120px',
        right: '20px',
        width: '200px',
        height: '40px',
        background: 'rgba(0,0,0,0.5)',
        border: '2px solid rgba(255,255,255,0.3)',
        borderRadius: '20px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '15%',
          height: '100%',
          background: 'linear-gradient(90deg, #4a90e2, #50c878)',
          borderRadius: '18px',
          transition: 'width 0.3s ease'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
        }}>
          Progress: 15%
        </div>
      </div>
      
      {/* Achievement Notification Area */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }}>
        {/* This would be populated with achievement notifications */}
      </div>
    </div>
  )
}

export default UI