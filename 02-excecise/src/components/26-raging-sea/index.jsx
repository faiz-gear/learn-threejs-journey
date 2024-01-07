import { memo, useEffect } from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import waterVertexShader from './shader/water/vertex.glsl'
import waterFragmentShader from './shader/water/fragment.glsl'

const Demo = memo(() => {
  useEffect(() => {
    THREE.ColorManagement.enabled = false

    /**
     * Base
     */
    // Debug
    const gui = new dat.GUI({ width: 340 })

    // Canvas
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()

    /**
     * Water
     */
    // Geometry
    const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

    const debugObject = {
      surfaceColor: '#6565bb',
      depthColor: '#09388c'
    }

    // Material
    const waterMaterial = new THREE.ShaderMaterial({
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uBigWavesElevation: { value: 0.1 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3.0 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallWavesInteractions: { value: 3 },

        uBigWavesSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uBigWavesDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uBigWavesColorOffset: { value: 0 },
        uBigWavesColorMultiplier: { value: 5 }
      }
    })

    gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0.05).max(0.5).step(0.001).name('elevation')
    gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('frequencyX')
    gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('frequencyZ')
    gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(10).step(0.001).name('speed')

    gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
    gui
      .add(waterMaterial.uniforms.uSmallWavesFrequency, 'value')
      .min(0)
      .max(30)
      .step(0.001)
      .name('uSmallWavesFrequency')
    gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
    gui
      .add(waterMaterial.uniforms.uSmallWavesInteractions, 'value')
      .min(0)
      .max(8)
      .step(1)
      .name('uSmallWavesInteractions')

    gui
      .addColor(debugObject, 'surfaceColor')
      .onChange((value) => waterMaterial.uniforms.uBigWavesSurfaceColor.value.set(value))
    gui
      .addColor(debugObject, 'depthColor')
      .onChange((value) => waterMaterial.uniforms.uBigWavesDepthColor.value.set(value))
    gui.add(waterMaterial.uniforms.uBigWavesColorOffset, 'value').min(0).max(1).step(0.001).name('colorOffset')
    gui.add(waterMaterial.uniforms.uBigWavesColorMultiplier, 'value').min(0).max(10).step(0.001).name('colorMultiplier')

    // Mesh
    const water = new THREE.Mesh(waterGeometry, waterMaterial)
    water.rotation.x = -Math.PI * 0.5
    scene.add(water)

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      // Update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      // Update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(1, 1, 1)
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      waterMaterial.uniforms.uTime.value = elapsedTime

      // Update controls
      controls.update()

      // Render
      renderer.render(scene, camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
    }

    tick()
  })

  return (
    <div>
      <section className="section">
        <h1>My Portfolio</h1>
      </section>
      <section className="section">
        <h2>My projects</h2>
      </section>
      <section className="section">
        <h2>Contact me</h2>
      </section>
    </div>
  )
})

export default Demo
