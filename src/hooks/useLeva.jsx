import { useControls, folder } from 'leva'

export function usePlayerControls() {
  return useControls('Player Controller', {
    Movement: folder({
      speed: { value: 8, min: 1, max: 20, step: 0.5 },
      runSpeed: { value: 12, min: 5, max: 30, step: 0.5 },
      airControl: { value: 0.3, min: 0, max: 1, step: 0.1 }
    }),
    Physics: folder({
      jumpForce: { value: 15, min: 5, max: 30, step: 0.5 },
      gravityScale: { value: 1, min: 0.1, max: 3, step: 0.1 },
      mass: { value: 1, min: 0.1, max: 5, step: 0.1 }
    }),
    Collider: folder({
      capsuleHeight: { value: 1.8, min: 0.5, max: 3, step: 0.1 },
      capsuleRadius: { value: 0.4, min: 0.1, max: 1, step: 0.05 },
      groundRayLength: { value: 0.7, min: 0.1, max: 2, step: 0.1 }
    }),
    Camera: folder({
      cameraOffsetX: { value: 0, min: -10, max: 10, step: 0.5 },
      cameraOffsetY: { value: 5, min: 1, max: 15, step: 0.5 },
      cameraOffsetZ: { value: 10, min: 3, max: 20, step: 0.5 },
      cameraDamping: { value: 0.05, min: 0.01, max: 0.2, step: 0.01 }
    }),
    Debug: folder({
      debugMode: { value: false },
      showVelocity: { value: false },
      showGroundRay: { value: false }
    })
  })
}

export function useCameraControls() {
  return useControls('Camera', {
    'Follow Settings': folder({
      damping: { value: 0.05, min: 0.01, max: 0.2, step: 0.01 },
      rotationSpeed: { value: 0.5, min: 0.1, max: 2, step: 0.1 },
      autoRotate: { value: false },
      autoRotateSpeed: { value: 0.5, min: 0.1, max: 2, step: 0.1 }
    }),
    'Distance Limits': folder({
      minDistance: { value: 3, min: 1, max: 10, step: 0.5 },
      maxDistance: { value: 20, min: 10, max: 50, step: 1 }
    }),
    'Angle Limits': folder({
      minPolarAngle: { value: 0, min: 0, max: Math.PI/2, step: 0.1 },
      maxPolarAngle: { value: Math.PI/2.2, min: Math.PI/4, max: Math.PI/2, step: 0.1 }
    })
  })
}

export function useInputControls() {
  return useControls('Input', {
    'Sensitivity': folder({
      mouseSensitivity: { value: 1, min: 0.1, max: 3, step: 0.1 },
      gamepadSensitivity: { value: 1, min: 0.1, max: 3, step: 0.1 },
      touchSensitivity: { value: 1, min: 0.1, max: 3, step: 0.1 }
    }),
    'Deadzone': folder({
      gamepadDeadzone: { value: 0.1, min: 0, max: 0.5, step: 0.05 },
      touchDeadzone: { value: 0.1, min: 0, max: 0.5, step: 0.05 }
    }),
    'Mobile Controls': folder({
      showMobileControls: { value: true },
      joystickSize: { value: 100, min: 50, max: 150, step: 10 },
      buttonSize: { value: 60, min: 40, max: 100, step: 5 }
    })
  })
}