import React, { Suspense, memo, useEffect, useRef } from 'react'
import { Clone, OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Perf } from 'r3f-perf'
import { useControls } from 'leva'

const radius = 8

const Model = () => {
  // const hamburger = useLoader(GLTFLoader, '/models/FlightHelmet/glTF/FlightHelmet.gltf', (loader) => {
  //   const dracoLoader = new DRACOLoader()
  //   dracoLoader.setDecoderPath('/draco/')
  //   loader.setDRACOLoader(dracoLoader)
  // })

  const hamburger = useGLTF('/models/hamburger/hamburger.glb')

  return (
    <>
      {/* Clone复用模型,同时不会增加多余的geometry */}
      <Clone object={hamburger.scene} scale={0.25} position-y={-1} position-x={-4} />
      <Clone object={hamburger.scene} scale={0.25} position-y={-1} position-x={0} />
      <Clone object={hamburger.scene} scale={0.25} position-y={-1} position-x={4} />
    </>
  )
}
// 提前加载模型(模块导入之前加载)
useGLTF.preload('/models/hamburger/hamburger.glb')

// gltfjsx: https://gltf.pmnd.rs/
function Hamburger(props) {
  const { nodes, materials } = useGLTF('/models/hamburger/hamburger.glb')
  return (
    <group {...props} dispose={null}>
      <mesh name="立方体" castShadow receiveShadow geometry={nodes.立方体.geometry} material={materials.bunMaterial} />
      <mesh
        name="立方体001"
        castShadow
        receiveShadow
        geometry={nodes.立方体001.geometry}
        material={materials.meatMaterial}
        position={[0, 0.89, 0]}
      />
      <mesh
        name="平面"
        castShadow
        receiveShadow
        geometry={nodes.平面.geometry}
        material={materials.cheeseMaterial}
        position={[0, 2.83, 0]}
      />
      <mesh
        name="立方体002"
        castShadow
        receiveShadow
        geometry={nodes.立方体002.geometry}
        material={materials.bunMaterial}
        position={[0, 2.58, 0]}
        rotation={[-Math.PI, 0, 0]}
      />
    </group>
  )
}

const Placeholder = (props) => (
  <mesh {...props}>
    <boxGeometry args={[1, 1, 1, 2, 2, 3]} />
    <meshBasicMaterial color={'red'} wireframe />
  </mesh>
)

const Fox = () => {
  const fox = useGLTF('/models/Fox/glTF/Fox.gltf')
  const animations = useAnimations(fox.animations, fox.scene)
  const { animationName } = useControls('fox behavior', {
    animationName: { options: animations.names }
  })

  useEffect(() => {
    const action = animations.actions[animationName]
    console.log('🚀 ~ file: index.jsx ~ line 83 ~ useEffect ~ animationName', animationName)
    action
      .reset() // 必须reset, 不然第二次切换动画会失效
      .fadeIn(0.5)
      .play()

    // setTimeout(() => {
    //   const walkAction = animations.actions.Walk
    //   walkAction.play()
    //   // fade out the run action, fade in the walk action
    //   walkAction.crossFadeFrom(runAction, 1)
    // }, 2000)

    return () => {
      action.fadeOut(0.5)
    }
  }, [animationName])

  return <primitive object={fox.scene} scale={0.02} position={[-2.5, 0, 2.5]} rotation-y={0.3}></primitive>
}

const Demo = memo(() => {
  const cubeRef = useRef()
  const sphereRef = useRef()

  return (
    <>
      <Perf position="top-left" />
      {/* makeDefault: 设置默认的控制器,这样在同时使用其他控制器的时候可以deActive默认的控制器,停止使用的时候再active,防止冲突 */}
      <OrbitControls makeDefault />
      <directionalLight castShadow position={[0, 10, 10]} intensity={1} shadow-normalBias={0.04} />
      <ambientLight intensity={0.5} />

      {/* <mesh ref={sphereRef} position-x={-2}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh ref={cubeRef} position-x={2} scale={2}>
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </mesh> */}

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="green" />
      </mesh>

      <Suspense fallback={<Placeholder position-y={0.5} scale={[2, 3, 2]} />}>
        {/* <Model /> */}
        <Hamburger scale={0.35} />
      </Suspense>
      <Fox />
    </>
  )
})

export default Demo
