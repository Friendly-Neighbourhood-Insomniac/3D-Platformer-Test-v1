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
      {/* Simple Top Bar */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.6)',
        padding: '15px 25px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255,255,255,0.2)'
      }}>
        {/* Game Title */}
        <div style={{
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
        }}>
          🌴 Jungle Temple
        </div>
        
        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '30px',
          color: 'white',
          fontSize: '18px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💰</span>
            <span style={{ fontWeight: 'bold', color: '#FFD700' }}>{score.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>❤️</span>
            <span style={{ fontWeight: 'bold', color: '#FF6B6B' }}>{lives}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💎</span>
            <span style={{ fontWeight: 'bold', color: '#9370DB' }}>{collectibles}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⏱️</span>
            <span style={{ fontWeight: 'bold', color: '#4A90E2' }}>{formatTime(time)}</span>
          </div>
        </div>
      </div>
      
      {/* Simple Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: 'white',
        fontSize: '16px',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        background: 'rgba(0,0,0,0.6)',
        padding: '20px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
          🎮 Controls
        </div>
        <div style={{ opacity: 0.9, lineHeight: '1.6' }}>
          <div>WASD / Arrows - Move</div>
          <div>Space - Jump</div>
          <div>Mouse - Look around</div>
        </div>
      </div>
      
      {/* Simple Progress */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        color: 'white',
        fontSize: '16px',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        background: 'rgba(0,0,0,0.6)',
        padding: '20px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255,255,255,0.2)',
        textAlign: 'center',
        minWidth: '200px'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
          🗺️ Progress
        </div>
        
        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '20px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '10px'
        }}>
          <div style={{
            width: '12%',
            height: '100%',
            background: 'linear-gradient(90deg, #32CD32, #FFD700)',
            borderRadius: '10px',
            transition: 'width 0.5s ease'
          }} />
        </div>
        
        <div style={{ opacity: 0.9, fontSize: '14px' }}>
          60 / 500 units
        </div>
      </div>
      
      {/* Minimal Achievement Area */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }}>
        {/* Achievement notifications would appear here when needed */}
      </div>
    </div>
  )
}

export default UI