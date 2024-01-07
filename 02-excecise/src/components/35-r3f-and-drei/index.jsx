import React, { memo, useRef } from 'react'
import {
  OrbitControls,
  TransformControls,
  PivotControls,
  Html,
  Text,
  Float,
  MeshReflectorMaterial
} from '@react-three/drei'

const radius = 8

const Demo = memo(() => {
  const cubeRef = useRef()
  const sphereRef = useRef()

  return (
    <>
      {/* makeDefault: 设置默认的控制器,这样在同时使用其他控制器的时候可以deActive默认的控制器,停止使用的时候再active,防止冲突 */}
      <OrbitControls makeDefault />
      <directionalLight position={[0, 2, 3]} intensity={0.8} />
      <ambientLight intensity={0.5} />

      <PivotControls anchor={[0, 0, 0]} depthTest={false} lineWidth={2} fixed scale={100}>
        <mesh ref={sphereRef} position-x={-2}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="mediumpurple" />
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
      </PivotControls>

      <mesh ref={cubeRef} position-x={2} scale={2}>
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
      <TransformControls object={cubeRef} mode="scale" />

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[10, 10]} />
        {/* <meshStandardMaterial color="green" /> */}
        {/* 反射材质只适用于plane几何体 */}
        <MeshReflectorMaterial
          resolution={512} // 反射贴图的分辨率
          blur={[1000, 1000]} // 模糊程度
          mixBlur={0.5} // 混合模糊程度, 0-1
          mirror={0} // 反射程度, 0-1  Mirror environment, 0 = texture colors, 1 = pick up env colors
        />
      </mesh>

      {/* 像气球一样浮动 */}
      <Float speed={3} floatIntensity={10}>
        {/* sdf font */}
        <Text position={[0, 3, 2]} fontSize={1} color="salmon" maxWidth={3} textAlign="center">
          I love R3F
          <meshNormalMaterial />
        </Text>
      </Float>
    </>
  )
})

export default Demo
