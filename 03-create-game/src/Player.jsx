import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { BallCollider, RigidBody, useRapier } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGame } from './store/useGame'

const cameraPosition = new THREE.Vector3()
const cameraTarget = new THREE.Vector3()

const Player = memo(() => {
  const ball = useGLTF('/learn-threejs-journey/ball.gltf')

  const ballRigidBodyRef = useRef(null)
  const [subscribeKeys, getKeys] = useKeyboardControls()
  const { rapier, world } = useRapier()
  const start = useGame((state) => state.start)
  const end = useGame((state) => state.end)
  const restart = useGame((state) => state.restart)
  const blocksCount = useGame((state) => state.blocksCount)

  const reset = useCallback(() => {
    const ball = ballRigidBodyRef.current
    ball.setTranslation({ x: 0, y: 1, z: 0 })
    ball.setLinvel({ x: 0, y: 0, z: 0 }) // 去除球体的线速度
    ball.setAngvel({ x: 0, y: 0, z: 0 }) // 去除球体的角速度
  }, [])

  useEffect(() => {
    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) {
          const rapierWorld = world.raw()
          const ballRigidBody = ballRigidBodyRef.current
          const origin = ballRigidBody.translation()
          origin.y -= 0.33 // 确保射线不会从球体内部发出

          const rayDirection = { x: 0, y: -1, z: 0 }
          const ray = new rapier.Ray(origin, rayDirection)
          const hit = rapierWorld.castRay(ray, 10, true)

          if (hit.toi < 0.15) {
            // 射线撞击到物体的时间小于0.15秒，说明球体接近地面
            ballRigidBody?.applyImpulse({ x: 0, y: 0.65, z: 0 })
          }
        }
      }
    )

    const unsubscribeAny = subscribeKeys(() => {
      start()
    })

    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (phase) => {
        console.log('phase change', phase)
        if (phase === 'ready') {
          reset()
        }
      }
    )

    return () => {
      unsubscribeAny()
      unsubscribeJump()
      unsubscribeReset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribeKeys])

  const [smoothCameraPosition] = useState(new THREE.Vector3(10, 10, 10))
  const [smoothCameraTarget] = useState(new THREE.Vector3())
  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward } = getKeys()

    const impulse = { x: 0, y: 0, z: 0 }
    const torque = { x: 0, y: 0, z: 0 }

    const impulseStrength = 0.6 * delta
    const torqueStrength = 0.2 * delta

    if (forward) {
      impulse.z -= impulseStrength
      torque.x -= torqueStrength
    }

    if (backward) {
      impulse.z += impulseStrength
      torque.x += torqueStrength
    }

    if (leftward) {
      impulse.x -= impulseStrength
      torque.z += torqueStrength
    }

    if (rightward) {
      impulse.x += impulseStrength
      torque.z -= torqueStrength
    }

    const ballRigidBody = ballRigidBodyRef.current
    ballRigidBody?.applyImpulse(impulse)
    ballRigidBody?.applyTorqueImpulse(torque)

    // update camera
    const ballRigidBodyPosition = ballRigidBody?.translation()
    const camera = state.camera

    cameraPosition.copy(ballRigidBodyPosition)
    cameraPosition.z += 2.25
    cameraPosition.y += 0.65

    cameraTarget.copy(ballRigidBodyPosition)
    cameraTarget.y += 0.25

    smoothCameraPosition.lerp(cameraPosition, 0.1)
    smoothCameraTarget.lerp(cameraTarget, 0.1)
    camera.position.copy(smoothCameraPosition)
    camera.lookAt(smoothCameraTarget)

    // end game
    if (ballRigidBodyPosition.z < -(blocksCount * 4 + 2)) {
      end()
    }

    // restart game
    if (ballRigidBodyPosition.y < -4) {
      restart()
    }
  })

  return (
    <RigidBody
      ref={ballRigidBodyRef}
      position={[0, 1, 0]}
      colliders={false}
      restitution={0.2}
      friction={1}
      rotation-z={Math.PI / 2}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <BallCollider args={[0.32]} />
      <primitive object={ball.scene} scale={0.3} />
    </RigidBody>
  )
})

Player.displayName = 'Player'

export default Player
