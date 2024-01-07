import React, { memo, useRef } from 'react'
import { OrbitControls, Html, Text, Float } from '@react-three/drei'
import { button, useControls } from 'leva'
import { Perf } from 'r3f-perf'

const Demo = memo(() => {
  const cubeRef = useRef()
  const sphereRef = useRef()

  const { position, color, visible } = useControls('sphere', {
    position: {
      value: { x: 1, y: 0 },
      step: 0.01,
      joystick: 'invertY' // 摇杆控制, invertY: Y轴反转
    },
    color: '#c800ff',
    visible: false,
    interval: {
      value: [5, 10],
      min: 0,
      max: 20
    },
    clickMe: button(() => console.log('clicked')),
    choice: {
      options: ['a', 'b', 'c']
    }
  })

  const { scale } = useControls('cube', {
    scale: {
      value: 1,
      min: 0,
      max: 2,
      step: 0.01
    }
  })

  return (
    <>
      <Perf position="top-left" />

      {/* makeDefault: 设置默认的控制器,这样在同时使用其他控制器的时候可以deActive默认的控制器,停止使用的时候再active,防止冲突 */}
      <OrbitControls makeDefault />
      <directionalLight position={[0, 2, 3]} intensity={0.8} />
      <ambientLight intensity={0.5} />

      <mesh ref={sphereRef} position={[position.x, position.y, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} />
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

      <mesh ref={cubeRef} scale={scale} position-x={-2}>
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="green" />
      </mesh>

      {/* 像气球一样浮动 */}
      {visible && (
        <Float speed={3} floatIntensity={10}>
          {/* sdf font */}
          <Text position={[0, 3, 2]} fontSize={1} color="salmon" maxWidth={3} textAlign="center">
            I love R3F
            <meshNormalMaterial />
          </Text>
        </Float>
      )}
    </>
  )
})

export default Demo
