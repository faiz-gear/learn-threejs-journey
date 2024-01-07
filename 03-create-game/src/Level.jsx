import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useMemo, useState } from 'react'
import { useRef } from 'react'
import { memo } from 'react'
import * as THREE from 'three'
import { Float, Text, useGLTF } from '@react-three/drei'

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const floorMaterial1 = new THREE.MeshStandardMaterial({ color: '#111', metalness: 0, roughness: 0 })
const floorMaterial2 = new THREE.MeshStandardMaterial({ color: '#222', metalness: 0, roughness: 0 })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: '#f00', metalness: 0, roughness: 1 })
const wallMaterial = new THREE.MeshStandardMaterial({ color: '#877', metalness: 0, roughness: 0 })

const quaternion = new THREE.Quaternion()
const euler = new THREE.Euler()

export const BlockStart = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floorMaterial1}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
    </group>
  )
}

export const BlockEnd = ({ position = [0, 0, 0] }) => {
  const model = useGLTF('/model.gltf')
  model.scene.traverse((object) => {
    if (object.isMesh) object.castShadow = true
  })
  return (
    <group position={position}>
      <mesh receiveShadow geometry={boxGeometry} material={floorMaterial1} position={[0, 0, 0]} scale={[4, 0.2, 4]} />
      <RigidBody type="fixed" position={[0, 0.1, 0]} colliders={'hull'} friction={0} restitution={0.25}>
        <primitive object={model.scene} />
      </RigidBody>

      <Float>
        <Text font="/bebas-neue-v9-latin-regular.woff" position={[0, 2.25, 2]} scale={1}>
          Ending
          <meshBasicMaterial toneMapped={true} color={'white'} />
        </Text>
      </Float>
    </group>
  )
}

export const BlockSpinner = ({ position = [0, 0, 0] }) => {
  const spinnerRigidBodyRef = useRef(null)
  const [speed] = useState((Math.random() + 0.2) * (Math.random() > 0.5 ? 1 : -1))

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    spinnerRigidBodyRef.current.setNextKinematicRotation(quaternion.setFromEuler(euler.set(0, time * speed, 0)))
  })
  return (
    <group position={position}>
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floorMaterial2}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
      <RigidBody ref={spinnerRigidBodyRef} type="kinematicPosition">
        <mesh receiveShadow castShadow geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} />
      </RigidBody>
    </group>
  )
}

export const BlockLimbo = ({ position = [0, 0, 0] }) => {
  const spinnerRigidBodyRef = useRef(null)
  const [timeOffset] = useState(Math.random() * Math.PI * 2)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    const y = Math.sin(time + timeOffset) + 1.15

    spinnerRigidBodyRef.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] })
  })
  return (
    <group position={position}>
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floorMaterial2}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
      <RigidBody ref={spinnerRigidBodyRef} type="kinematicPosition">
        <mesh receiveShadow castShadow geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} />
      </RigidBody>
    </group>
  )
}

export const BlockAxe = ({ position = [0, 0, 0] }) => {
  const spinnerRigidBodyRef = useRef(null)
  const [timeOffset] = useState(Math.random() * Math.PI * 2)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    const x = Math.sin(time + timeOffset) * 1.25

    spinnerRigidBodyRef.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2]
    })
  })
  return (
    <group position={position}>
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floorMaterial2}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
      <RigidBody ref={spinnerRigidBodyRef} type="kinematicPosition">
        <mesh receiveShadow castShadow geometry={boxGeometry} material={obstacleMaterial} scale={[1.5, 1.5, 0.3]} />
      </RigidBody>
    </group>
  )
}

const Bounds = ({ length = 1 }) => {
  return (
    <RigidBody type="fixed" friction={0.2} restitution={0}>
      <mesh
        position={[-2.15, 0.75, -(length * 2) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[0.3, 1.5, 4 * length]}
        receiveShadow
      />
      <mesh
        position={[2.15, 0.75, -(length * 2) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[0.3, 1.5, 4 * length]}
        castShadow
      />

      <mesh
        position={[0, 0.75, -(length * 4) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[4, 1.5, 0.3]}
        castShadow
      />

      <CuboidCollider
        args={[2, 0.1, 2 * length]}
        position={[0, -0.1, -length * 2 + 2]}
        restitution={0.2}
        friction={1}
      />
    </RigidBody>
  )
}

const Level = memo(({ count = 2, types = [BlockLimbo, BlockLimbo, BlockAxe], seed = 0 }) => {
  const blocks = useMemo(
    () => new Array(count).fill(seed).map(() => types[Math.floor(Math.random() * types.length)]),
    [count, types, seed]
  )

  return (
    <>
      <BlockStart position={[0, 0, 0]} />

      {blocks.map((Block, index) => (
        <Block key={index} position={[0, 0, -(index + 1) * 4]} />
      ))}

      <BlockEnd position={[0, 0, -(count + 1) * 4]} />

      <Bounds length={count + 2} />
    </>
  )
})
Level.displayName = 'Level'

export default Level
