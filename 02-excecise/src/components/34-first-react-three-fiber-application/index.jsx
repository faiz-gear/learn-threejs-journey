import React, { memo, useRef } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import CustomObject from './CustomObject'

extend({ OrbitControls })

const radius = 8

const Demo = memo(() => {
  const cubeRef = useRef()

  const { gl, camera } = useThree()

  useFrame((state, delta) => {
    cubeRef.current.rotation.y += delta
    const { camera, clock } = state
    const elapsedTime = clock.getElapsedTime()
    camera.position.setX(Math.cos(elapsedTime) * radius)
    camera.position.setZ(Math.sin(elapsedTime) * radius)
    camera.lookAt(0, 0, 0)
  })
  return (
    <>
      <directionalLight position={[0, 2, 3]} intensity={0.8} />
      <ambientLight intensity={0.5} />
      {/* <orbitControls args={[camera, gl.domElement]} /> */}
      <mesh position-x={-2}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      <mesh ref={cubeRef} position-x={2} scale={2}>
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="green" />
      </mesh>

      <CustomObject />
    </>
  )
})

export default Demo
