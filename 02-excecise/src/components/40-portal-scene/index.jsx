import React, { memo, useEffect, useRef, useState } from 'react'
import { Center, OrbitControls, Sparkles, shaderMaterial, useGLTF, useTexture } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import portalVertexShader from './shader/portal/vertex.glsl'
import portalFragmentShader from './shader/portal/fragment.glsl'
import { extend, useFrame } from '@react-three/fiber'

// 生成材质组件
const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color('#fff'),
    uColorEnd: new THREE.Color('#000')
  },
  portalVertexShader,
  portalFragmentShader
)

extend({ PortalMaterial })

const Demo = memo(() => {
  const { nodes } = useGLTF('/portal.glb')
  const texture = useTexture('/baked.jpg')

  const portalMaterialRef = useRef()

  useFrame((state, delta) => {
    portalMaterialRef.current.uTime += delta
  })

  return (
    <>
      <color args={['#191919']} attach={'background'} />
      <Perf position={'top-left'} />
      {/* makeDefault: 设置默认的控制器,这样在同时使用其他控制器的时候可以deActive默认的控制器,停止使用的时候再active,防止冲突 */}
      <OrbitControls makeDefault />
      <Center>
        <mesh geometry={nodes.baked.geometry}>
          <meshBasicMaterial map={texture} map-flipY={false} />
        </mesh>
        <mesh geometry={nodes.poleLightA.geometry} position={nodes.poleLightA.position}>
          <meshBasicMaterial color={'#ffe2e2'} />
        </mesh>
        <mesh geometry={nodes.poleLightB.geometry} position={nodes.poleLightB.position}>
          <meshBasicMaterial color={'#ffe2e2'} />
        </mesh>
        <mesh
          geometry={nodes.portalLight.geometry}
          position={nodes.portalLight.position}
          rotation={nodes.portalLight.rotation}
        >
          {/* <shaderMaterial vertexShader={portalVertexShader} fragmentShader={portalFragmentShader} /> */}
          <portalMaterial ref={portalMaterialRef} />
        </mesh>
        <Sparkles size={6} position-y={1} scale={[4, 2, 4]} speed={0.4} count={40} />
      </Center>
    </>
  )
})

export default Demo
