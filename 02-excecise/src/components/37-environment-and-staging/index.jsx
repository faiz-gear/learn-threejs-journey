import React, { memo, useRef } from 'react'
import {
  OrbitControls,
  Html,
  Text,
  Float,
  useHelper,
  BakeShadows,
  SoftShadows,
  AccumulativeShadows,
  RandomizedLight,
  ContactShadows,
  Sky,
  Environment,
  Lightformer,
  Stage
} from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import { useControls } from 'leva'

const Demo = memo(() => {
  const cubeRef = useRef()
  const sphereRef = useRef()
  const directionLightRef = useRef()
  useHelper(directionLightRef, THREE.DirectionalLightHelper, 1, 'red')

  useFrame((state, delta) => {
    cubeRef.current.rotation.y += delta * 0.2
  })

  const { color, opacity, blur } = useControls('Contact Shadows', {
    color: '#040d0b',
    opacity: {
      value: 0.4,
      min: 0,
      max: 1
    },
    blur: {
      value: 2.8,
      min: 0,
      max: 10
    }
  })

  const { sunPosition } = useControls('Sky', {
    sunPosition: {
      value: [1, 2, 3]
    }
  })

  const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } = useControls('environment maps', {
    envMapIntensity: {
      value: 3.5,
      min: 0,
      max: 12
    },
    envMapHeight: {
      value: 7,
      min: 0,
      max: 100
    },
    envMapRadius: {
      value: 20,
      min: 10,
      max: 1000
    },
    envMapScale: {
      value: 100,
      min: 10,
      max: 1000
    }
  })
  return (
    <>
      {/* 设置场景颜色 */}
      {/* <color args={['ivory']} attach="background" /> */}

      {/* 生成烘焙阴影(场景是静态的时候可以用,就不会每一帧都去计算阴影) */}
      {/* <BakeShadows /> */}

      {/* <SoftShadows samples={17} /> */}

      {/* 累积阴影(只在平面上生效) */}
      {/* <AccumulativeShadows
        scale={10}
        position={[0, -0.99, 0]}
        color="#8fd280"
        opacity={0.8}
        frames={Infinity}
        blend={100}
        temporal
      >
        <RandomizedLight amount={8} radius={1} ambient={0.5} intensity={3} bias={0.001} position={[1, 2, 3]} />
      </AccumulativeShadows> */}

      {/* 不需要Canvas开启shadows,只在平面上生效 */}
      {/* <ContactShadows
        scale={10}
        far={10}
        resolution={512}
        position={[0, 0, 0]}
        color={color}
        opacity={opacity}
        blur={blur}
        frames={1} // 设置1帧就是烘焙阴影
      /> */}

      {/* 天空  */}
      {/* <Sky sunPosition={sunPosition} /> */}

      {/* 环境贴图, 会照亮场景 */}
      {/* <Environment
        // background
        preset="sunset"
        // files="/textures/environmentMaps/industrial_workshop_foundry_4k.hdr"
        // resolution={32} // 环境贴图的分辨率, 越低性能越好
        ground={{
          height: envMapHeight,
          radius: envMapRadius,
          scale: envMapScale
        }}
      > */}
      {/* <color args={[0, 0, 0]} attach="background"></color> */}
      {/* 网格生成环境贴图照亮场景 */}
      {/* <mesh position-z={-5} scale={10}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color={[10, 0, 0]} />
        </mesh> */}
      {/*  */}
      {/* 和上面效果一样 */}
      {/* <Lightformer position-z={-5} scale={10} color={'red'} intensity={2} form={'circle'} /> */}
      {/* </Environment> */}

      <Perf position="top-left" />
      {/* makeDefault: 设置默认的控制器,这样在同时使用其他控制器的时候可以deActive默认的控制器,停止使用的时候再active,防止冲突 */}
      <OrbitControls makeDefault />
      {/* <directionalLight
        castShadow
        ref={directionLightRef}
        position={sunPosition}
        intensity={0.8}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
      /> */}
      {/* <ambientLight intensity={0.5} /> */}

      {/* <mesh ref={sphereRef} position-x={-2} position-y={2} castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="mediumpurple" envMapIntensity={envMapIntensity} />
        <Html
          position={[1, 1, 0]}
          wrapperClass="label"
          center // label的子元素居中
          distanceFactor={6} // label离最近的Object的距离因子, 越大离相机越近
          occlude={[sphereRef, cubeRef]} // label遮挡的对象, 需要判断label是在前面还是后面的对象
        >
          That's a sphere
        </Html>
      </mesh>

      <mesh ref={cubeRef} position-x={2} position-y={2} scale={2} castShadow>
        <boxGeometry />
        <meshStandardMaterial color={[1, 0, 0]} envMapIntensity={envMapIntensity} />
      </mesh> */}

      {/* <mesh position-y={-1} rotation-x={-Math.PI * 0.5} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#c3d280" envMapIntensity={envMapIntensity} />
      </mesh> */}

      {/* 像气球一样浮动 */}
      {/* <Float speed={3} floatIntensity={10}>
        <Text position={[0, 3, 2]} fontSize={1} color="salmon" maxWidth={3} textAlign="center">
          I love R3F
          <meshNormalMaterial />
        </Text>
      </Float> */}

      {/* 内置了Environment\Light\Shadows */}
      <Stage
        preset={'portrait'} // 'rembrandt' | 'portrait' | 'upfront' | 'soft'
        shadows={'contact'}
        environment={{
          preset: 'night'
        }}
      >
        <mesh ref={sphereRef} position-x={-2} position-y={1} castShadow>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="mediumpurple" envMapIntensity={envMapIntensity} />
          <Html
            position={[1, 1, 0]}
            wrapperClass="label"
            center // label的子元素居中
            distanceFactor={6} // label离最近的Object的距离因子, 越大离相机越近
            occlude={[sphereRef, cubeRef]} // label遮挡的对象, 需要判断label是在前面还是后面的对象
          >
            That's a sphere
          </Html>
        </mesh>

        <mesh ref={cubeRef} position-x={2} position-y={1} scale={2} castShadow>
          <boxGeometry />
          <meshStandardMaterial color={[1, 0, 0]} envMapIntensity={envMapIntensity} />
        </mesh>
      </Stage>
    </>
  )
})

export default Demo
