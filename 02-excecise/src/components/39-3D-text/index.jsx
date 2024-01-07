import React, { memo, useEffect, useRef, useState } from 'react'
import { Center, OrbitControls, Text3D, useMatcapTexture } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const getRandomTorusPosition = () => [
  (Math.random() - 0.5) * 10,
  (Math.random() - 0.5) * 10,
  (Math.random() - 0.5) * 10
]
const torusPositions = Array(100).fill(0).map(getRandomTorusPosition)

const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32)
const material = new THREE.MeshMatcapMaterial()

const Demo = memo(() => {
  const [matcapTexture] = useMatcapTexture('2E763A_78A0B7_B3D1CF_14F209', 256)

  // const [torusGeometry, setTorusGeometry] = useState()
  // const [material, setMaterial] = useState()

  useEffect(() => {
    matcapTexture.colorSpace = THREE.SRGBColorSpace
    matcapTexture.needsUpdate = true

    material.matcap = matcapTexture
    material.needsUpdate = true
  }, [])

  // const torusGroup = useRef()
  const torusGroup = useRef([])

  useFrame((state, delta) => {
    // const tori = torusGroup.current.children
    const tori = torusGroup.current
    for (const torus of tori) {
      torus.rotation.y += delta * 0.2
    }
  })
  return (
    <>
      <Perf position={'top-left'} />
      {/* makeDefault: 设置默认的控制器,这样在同时使用其他控制器的时候可以deActive默认的控制器,停止使用的时候再active,防止冲突 */}
      <OrbitControls makeDefault />
      <Center>
        <Text3D
          material={material}
          font={'/fonts/helvetiker_regular.typeface.json'}
          //
          size={0.75}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          Hello R3F
        </Text3D>
      </Center>

      {/* <torusGeometry ref={setTorusGeometry} args={[1, 0.6, 16, 32]} /> */}
      {/* <meshMatcapMaterial ref={setMaterial} matcap={matcapTexture} /> */}

      {/* <group ref={torusGroup}> */}
      {torusPositions.map((p, index) => (
        <mesh
          ref={(torusMesh) => (torusGroup.current[index] = torusMesh)}
          geometry={torusGeometry}
          material={material}
          key={p[0]}
          position={p}
          scale={0.2 + Math.random() * 0.2}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        ></mesh>
      ))}
      {/* </group> */}
    </>
  )
})

export default Demo
