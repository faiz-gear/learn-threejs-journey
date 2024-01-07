import { memo, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const Demo = memo(() => {
  useEffect(() => {
    THREE.ColorManagement.enabled = false

    /**
     * Base
     */
    // Debug
    const gui = new dat.GUI()

    // Canvas
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader()
    const particleTexture = textureLoader.load('/textures/particles/2.png')

    /**
     * galaxy
     */
    const parameter = {
      count: 100000,
      size: 0.02,
      radius: 5,
      branches: 3,
      spin: 1,
      randomness: 1,
      randomPower: 3,
      insideColor: '#ff6030',
      outsideColor: '#1b3984'
    }
    let geometry = null
    let material = null
    let points = null
    const generateGalaxy = () => {
      if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
      }
      geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(parameter.count * 3)
      const colors = new Float32Array(parameter.count * 3)

      const insideColorThree = new THREE.Color(parameter.insideColor)
      const outsideColorThree = new THREE.Color(parameter.outsideColor)

      for (let i = 0; i < parameter.count; i++) {
        const i3 = i * 3
        // vertex position
        const radius = parameter.radius * Math.random()
        const branchAngle = ((i % parameter.branches) / parameter.branches) * Math.PI * 2
        const spinAngle = radius * parameter.spin // radius越大, 旋转角度越大

        const randomX =
          Math.pow(Math.random(), parameter.randomPower) * (Math.random() > 0.5 ? 1 : -1) * parameter.randomness
        const randomY =
          Math.pow(Math.random(), parameter.randomPower) * (Math.random() > 0.5 ? 1 : -1) * parameter.randomness
        const randomZ =
          Math.pow(Math.random(), parameter.randomPower) * (Math.random() > 0.5 ? 1 : -1) * parameter.randomness

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        // vertex color
        const mixedColor = insideColorThree.clone()
        mixedColor.lerp(outsideColorThree, radius / parameter.radius) // 颜色混合, 会改变原对象,所以需要克隆
        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

      material = new THREE.PointsMaterial({
        size: parameter.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
      })
      points = new THREE.Points(geometry, material)
      scene.add(points)
    }
    generateGalaxy()

    gui.add(parameter, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
    gui.add(parameter, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
    gui.add(parameter, 'radius').min(0.01).max(20).step(1).onFinishChange(generateGalaxy)
    gui.add(parameter, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
    gui.add(parameter, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
    gui.add(parameter, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
    gui.add(parameter, 'randomPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
    gui.addColor(parameter, 'insideColor').onFinishChange(generateGalaxy)
    gui.addColor(parameter, 'outsideColor').onFinishChange(generateGalaxy)

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
    camera.position.z = 3
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
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      // Update controls
      controls.update()

      // Render
      renderer.render(scene, camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
    }

    tick()
  })

  return <div>Demo</div>
})

export default Demo
