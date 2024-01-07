import React, { Suspense, memo, useEffect, useRef } from 'react'
import {
  Clone,
  OrbitControls,
  useAnimations,
  useGLTF,
  meshBounds,
  Environment,
  Float,
  PresentationControls,
  ContactShadows,
  Html,
  Text
} from '@react-three/drei'

const Demo = memo(() => {
  const { scene } = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf'
  )

  return (
    <>
      <color args={['#695b5b']} attach={'background'} />
      {/* makeDefault: 设置默认的控制器,这样在同时使用其他控制器的时候可以deActive默认的控制器,停止使用的时候再active,防止冲突 */}
      {/* <OrbitControls makeDefault /> */}

      <Environment preset="studio" />

      {/* 基于use-gesture,在移动端的手势可能会有奇怪的bug,所以需要添加touch-action: none */}
      <PresentationControls
        global // 操作object外面也可以触发
        rotation={[0.13, 0.1, 0]} // 默认的旋转
        polar={[-0.4, 0.2]} // 极角, 限制vertical垂直方向可旋转的角度
        azimuth={[0, 0.75]} // 限制horizontal水平方向可旋转的角度
        config={{
          mass: 2, // 越大越难拖动
          tension: 400 // 张力
        }} // use-spring配置
        snap={{
          mass: 4,
          tension: 400
        }} // 生成快照, 松开手指会返回初始状态
      >
        {/* 演示控制器, 使得被包裹的object可以被旋转,而不是旋转相机 */}
        <Float floatIntensity={0.4} position={[-1.2, 0, 0]}>
          <primitive object={scene} position-y={-1.2}>
            {/* primitive 和 mesh都是object, 都可以添加object */}
            <Html
              transform // 跟随父元素变化
              wrapperClass="htmlScreen"
              distanceFactor={1.17}
              position={[0, 1.56, -1.4]}
              rotation-x={-0.256}
            >
              <iframe src="https://bruno-simon.com/html/" />
            </Html>
          </primitive>
          <Text fontSize={1} position={[3, 0.75, 0.75]} maxWidth={2} rotation-y={-0.55}>
            Faiz Gear
          </Text>
          <rectAreaLight
            width={2.5}
            height={1.65}
            intensity={65}
            color="#f07e1b"
            position={[0, 0.55, -1.15]}
            rotation={[0.1, Math.PI, 0]}
          />
        </Float>
      </PresentationControls>

      <ContactShadows position-y={-1.4} blur={2.4} opacity={0.4} scale={10} />
    </>
  )
})

export default Demo
