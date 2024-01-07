import React, { Suspense, memo, useEffect, useRef } from 'react'
import { Clone, OrbitControls, useAnimations, useGLTF, meshBounds } from '@react-three/drei'
import { useFrame, useLoader } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { EffectComposer, Vignette, Glitch, Noise, Bloom, DepthOfField, SSR } from '@react-three/postprocessing'
import { BlendFunction, GlitchMode } from 'postprocessing'
import { useControls } from 'leva'
import Drunk from './Drunk'

const Demo = memo(() => {
  const cubeRef = useRef()
  const sphereRef = useRef()
  const drunkRef = useRef()

  const controls = useControls('vignette', {
    blendFunction: {
      options: BlendFunction,
      value: BlendFunction.NORMAL
    }
  })

  // const ssrProps = useControls({
  //   temporalResolve: true,
  //   STRETCH_MISSED_RAYS: true,
  //   USE_MRT: true,
  //   USE_NORMALMAP: true,
  //   USE_ROUGHNESSMAP: true,
  //   ENABLE_JITTERING: true,
  //   ENABLE_BLUR: true,
  //   temporalResolveMix: { value: 0.9, min: 0, max: 1 },
  //   temporalResolveCorrectionMix: { value: 0.25, min: 0, max: 1 },
  //   maxSamples: { value: 0, min: 0, max: 1 },
  //   resolutionScale: { value: 1, min: 0, max: 1 },
  //   blurMix: { value: 0.5, min: 0, max: 1 },
  //   blurKernelSize: { value: 8, min: 0, max: 8 },
  //   blurSharpness: { value: 0.5, min: 0, max: 1 },
  //   rayStep: { value: 0.3, min: 0, max: 1 },
  //   intensity: { value: 1, min: 0, max: 5 },
  //   maxRoughness: { value: 0.1, min: 0, max: 1 },
  //   jitter: { value: 0.7, min: 0, max: 5 },
  //   jitterSpread: { value: 0.45, min: 0, max: 1 },
  //   jitterRough: { value: 0.1, min: 0, max: 1 },
  //   roughnessFadeOut: { value: 1, min: 0, max: 1 },
  //   rayFadeOut: { value: 0, min: 0, max: 1 },
  //   MAX_STEPS: { value: 20, min: 0, max: 20 },
  //   NUM_BINARY_SEARCH_STEPS: { value: 5, min: 0, max: 10 },
  //   maxDepthDifference: { value: 3, min: 0, max: 10 },
  //   maxDepth: { value: 1, min: 0, max: 1 },
  //   thickness: { value: 10, min: 0, max: 10 },
  //   ior: { value: 1.45, min: 0, max: 2 }
  // })

  const drunkProps = useControls('drunk', {
    frequency: { value: 10, min: 0, max: 20 },
    amplitude: { value: 0.1, min: 0, max: 1 }
  })

  return (
    <>
      <color args={['#fff']} attach={'background'} />
      <EffectComposer
      // multisampling={8} // 多重采样,抗锯齿
      >
        {/* 边角晕影 */}
        {/* <Vignette darkness={0.9} offset={0.3} blendFunction={vignetteControls.blendFunction} /> */}
        {/* 故障效果 */}
        {/* <Glitch delay={[1, 1.5]} duration={[0.3, 0.6]} strength={[0.2, 0.4]} mode={GlitchMode.SPORADIC} /> */}
        {/* 噪声效果 */}
        {/* <Noise blendFunction={controls.blendFunction} premultiply /> */}
        {/* 发光效果 */}
        {/* <Bloom
          mipmapBlur
          intensity={0.5}
          luminanceThreshold={0.9} // 亮度阈值,大于这个值的像素才会被发光
        /> */}
        {/* 景深效果, 远处会模糊 */}
        {/* <DepthOfField
          focusDistance={0.025} // 0-1,值越大,焦点越远
          focalLength={0.02} // 0-1,值越大,景深越浅
          bokehScale={6}
        /> */}

        {/* screen surface reflections 平面反射 */}
        {/* <SSR {...ssrProps} /> */}

        <Drunk ref={drunkRef} {...drunkProps} />
      </EffectComposer>

      <Perf position="top-left" />
      {/* makeDefault: 设置默认的控制器,这样在同时使用其他控制器的时候可以deActive默认的控制器,停止使用的时候再active,防止冲突 */}
      <OrbitControls makeDefault />
      <directionalLight castShadow position={[0, 10, 10]} intensity={1} shadow-normalBias={0.04} />
      <ambientLight intensity={0.5} />
      <mesh ref={sphereRef} position-x={-2}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh ref={cubeRef} position-x={2} scale={2}>
        <boxGeometry />
        <meshBasicMaterial color={'mediumpurple'} />
        {/* <meshBasicMaterial color={[1.5, 1, 4]} toneMapped={false} /> */}
        {/* <meshStandardMaterial color={'white'} emissive="red" emissiveIntensity={10} toneMapped={false} /> */}
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#000" metalness={0} roughness={0} />
      </mesh>
    </>
  )
})

export default Demo
