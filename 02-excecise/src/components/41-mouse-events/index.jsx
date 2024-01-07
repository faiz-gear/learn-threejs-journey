import React, { Suspense, memo, useEffect, useRef } from 'react'
import { Clone, OrbitControls, useAnimations, useGLTF, meshBounds } from '@react-three/drei'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'

const Demo = memo(() => {
  const cubeRef = useRef()
  const sphereRef = useRef()

  const hamburger = useGLTF('/models/hamburger/hamburger.glb')

  useFrame((state, delta) => {
    cubeRef.current.rotation.y += delta
  })

  const handleMouseEvent = (event) => {
    const color = `rgb(${(Math.random() * 255).toFixed(0)}, ${(Math.random() * 255).toFixed(0)}, ${(
      Math.random() * 255
    ).toFixed(0)})`
    event.object.material.color = new THREE.Color(color)
  }

  return (
    <>
      <Perf position="top-left" />
      {/* makeDefault: 设置默认的控制器,这样在同时使用其他控制器的时候可以deActive默认的控制器,停止使用的时候再active,防止冲突 */}
      <OrbitControls makeDefault />
      <directionalLight castShadow position={[0, 10, 10]} intensity={1} shadow-normalBias={0.04} />
      <ambientLight intensity={0.5} />
      <mesh ref={sphereRef} position-x={-2} onClick={handleMouseEvent}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh
        ref={cubeRef}
        raycast={meshBounds} // 会生成一个球形的包围盒 绑定的事件也会在包围盒上
        position-x={2}
        scale={2}
        onClick={handleMouseEvent}
      >
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="green" />
      </mesh>
      <primitive object={hamburger.scene} scale={0.25} position-y={0.5} onClick={handleMouseEvent} />
    </>
  )
})

export default Demo
