import React, { memo, useEffect, useMemo, useRef } from 'react'
import { useGLTF, Html, Text, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { InstancedRigidBodies, Physics, RigidBody, Debug, CuboidCollider, BallCollider } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'

const Demo = memo(() => {
  const cubeRef = useRef()
  const handleMeshPointerUp = (e) => {
    const mass = cubeRef.current.mass()
    cubeRef.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 })
    cubeRef.current.applyTorqueImpulse({ x: 0, y: 1 * mass, z: 0 })
  }

  const twister = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const euler = new THREE.Euler(0, time * 3, 0)
    const quaternion = new THREE.Quaternion().setFromEuler(euler)
    twister.current.setNextKinematicRotation(quaternion)

    const angle = time * 0.5
    const x = Math.cos(angle) * 3
    const z = Math.sin(angle) * 3
    twister.current.setNextKinematicTranslation({ x, y: 0.2, z })
  })

  const hitSound = useMemo(() => new Audio('/sounds/hit.mp3'), [])
  const handleCollisionEnter = () => {
    console.log('collision')

    // hitSound.currentTime = 0
    // hitSound.play()
    // hitSound.volume = 0.5
  }

  const { scene } = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf'
  )

  const count = 300
  const instancedMeshRef = useRef()
  useEffect(() => {
    // for (let i = 0; i < count; i++) {
    //   instancedMeshRef.current.setMatrixAt(
    //     i,
    //     new THREE.Matrix4().compose(new THREE.Vector3(i * 2, 0, 0), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1))
    //   )
    // }
  }, [])

  const transforms = useMemo(() => {
    const positions = []
    const rotations = []
    const scales = []
    for (let i = 0; i < count; i++) {
      positions.push([(Math.random() - 0.5) * 8, 6 + Math.random() * 2, (Math.random() - 0.5) * 8])
      rotations.push([Math.random(), Math.random(), Math.random()])
      scales.push([0.2 + 0.8 * Math.random(), 0.2 + 0.8 * Math.random(), 0.2 + 0.8 * Math.random()])
    }
    return {
      positions,
      rotations,
      scales
    }
  }, [])
  console.log('🚀 ~ file: index.jsx ~ line 69 ~ transforms ~ transforms', transforms)

  return (
    <>
      <Perf position="top-left" />
      <color args={['#fff']} attach={'background'} />
      {/* makeDefault: 设置默认的控制器,这样在同时使用其他控制器的时候可以deActive默认的控制器,停止使用的时候再active,防止冲突 */}
      <OrbitControls makeDefault />

      <ambientLight intensity={0.5} color={'#fff'} />
      <directionalLight castShadow intensity={0.5} color={'#fff'} position={[0, 10, 0]} />

      <Physics
        gravity={[0, -9.8, 0]} // 重力
      >
        <Debug />
        <RigidBody
          colliders="ball" // 物体对撞机的形状,球体
        >
          <mesh castShadow position={[-2, 3, 0]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={'#00a2ff'} />
          </mesh>
        </RigidBody>

        {/* <RigidBody>
          <mesh castShadow position={[-2, 3, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={'#ff7b00'} />
          </mesh>
          <mesh castShadow position={[-2, 3, -3]}>
            <boxGeometry args={[3, 2, 1]} />
            <meshStandardMaterial color={'#ff7b00'} />
          </mesh>
        </RigidBody> */}
        <RigidBody
          // colliders="hull" // 物体对撞机的形状,凸壳convex hull
          // colliders="trimesh" // 物体对撞机的形状,可以理解为是一个凹多边形
          colliders={false} // 手动控制物体的对撞机
          position={[0, 2, 0]}
          rotation={[Math.PI * 0.5, 0, 0]}
        >
          {/* <CuboidCollider args={[1.5, 1.5, 0.5]} /> */}
          {/* <BallCollider args={[1.5]} />
          <mesh castShadow>
            <torusGeometry args={[1, 0.5, 16, 32]}></torusGeometry>
            <meshStandardMaterial color={'#ff7b00'} />
          </mesh> */}
        </RigidBody>

        <RigidBody
          ref={cubeRef}
          position={[3, 3, 0]}
          // gravityScale={0.2} // 重力系数缩放
          // restitution={1} // 弹性系数
          friction={0.7} // 摩擦力
          mass={20} // 质量
          onCollisionEnter={handleCollisionEnter}
          onCollisionExit={() => console.log('exit')}
          onSleep={() => console.log('sleep')}
          onWake={() => console.log('wake')}
        >
          <mesh onClick={handleMeshPointerUp}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={'#ff7b00'} />
          </mesh>
        </RigidBody>

        <RigidBody
          ref={twister}
          position={[0, 0.2, 0]}
          type="kinematicPosition" // 运动位置, 需要手动更新位置
          friction={0}
        >
          <mesh castShadow scale={[0.4, 0.4, 3]}>
            <boxGeometry />
            <meshStandardMaterial color={'red'} />
          </mesh>
        </RigidBody>

        <RigidBody colliders={false} position={[0, 1, -3]}>
          <CuboidCollider args={[1.6, 0.02, 1]} position={[0, 0.5, 0]} />
          <CuboidCollider args={[1.6, 0.02, 1.2]} position={[0, 1.5, -1.2]} rotation={[-Math.PI * 0.6, 0, 0]} />
          <primitive object={scene} position={[0, 0, 0]} />
        </RigidBody>

        <RigidBody
          type="fixed" // 位置固定
          restitution={0.5} // 弹性系数
          friction={0.7} // 摩擦力
        >
          <mesh receiveShadow position={[0, -0.2, 0]}>
            <boxGeometry args={[10, 0.4, 10]} />
            <meshStandardMaterial color={'#c3ff00'} />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed">
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.5]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[-5.5, 1, 0]} />
        </RigidBody>

        <InstancedRigidBodies {...transforms}>
          <instancedMesh ref={instancedMeshRef} args={[null, null, count]}>
            <boxGeometry />
            <meshStandardMaterial color={'red'} />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
    </>
  )
})

export default Demo
