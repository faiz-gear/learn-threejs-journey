import { useKeyboardControls } from '@react-three/drei'
import { memo, useEffect, useRef } from 'react'
import { useGame } from './store/useGame'
import { addEffect } from '@react-three/fiber'

const Interface = memo(() => {
  const forward = useKeyboardControls((state) => state.forward)
  const backward = useKeyboardControls((state) => state.backward)
  const leftward = useKeyboardControls((state) => state.leftward)
  const rightward = useKeyboardControls((state) => state.rightward)
  const jump = useKeyboardControls((state) => state.jump)
  const restart = useGame((state) => state.restart)
  const phase = useGame((state) => state.phase)

  const timeRef = useRef()

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const time = timeRef.current
      let elapsedTime = 0
      const { phase, startTime, endTime } = useGame.getState()
      if (phase === 'playing') {
        elapsedTime = Date.now() - startTime
      } else if (phase === 'ending') {
        elapsedTime = endTime - startTime
      }

      time.textContent = (elapsedTime / 1000).toFixed(2)
    })

    return () => {
      unsubscribeEffect()
    }
  }, [])

  return (
    <div className="interface">
      <div className="time" ref={timeRef}>
        0.00
      </div>
      {phase === 'ending' && (
        <div className="restart" onClick={restart}>
          Restart
        </div>
      )}
      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? 'active' : ''}`}>W</div>
        </div>
        <div className="raw">
          <div className={`key ${leftward ? 'active' : ''}`}>A</div>
          <div className={`key ${backward ? 'active' : ''}`}>S</div>
          <div className={`key ${rightward ? 'active' : ''}`}>D</div>
        </div>
        <div className="raw">
          <div className={`key large ${jump ? 'active' : ''}`}>SPACE</div>
        </div>
      </div>
    </div>
  )
})

Interface.displayName = 'Interface'

export default Interface
