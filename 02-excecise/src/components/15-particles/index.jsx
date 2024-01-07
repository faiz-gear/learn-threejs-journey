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
     * particles
     */
    // const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
    const particlesGeometry = new THREE.BufferGeometry()
    const count = 20000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i] = (Math.random() - 0.5) * 4
      colors[i] = Math.random()
    }
    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      // color: 'skyblue', // 指定点的大小是否因相机深度而减弱。 （仅限透视相机。）默认值为 true。
      // map: particleTexture, // 会有黑色边框, 挡住后面的粒子显示
      transparent: true,
      alphaMap: particleTexture, // 仍然会有边框
      // alphaTest: 0.001 //贴图的alpha值如果低于设置的值,则不会渲染. 还是会有黑色边界挡住
      // depthTest: false // 设否启用深度测试. 如果设置为false,不管粒子是否是处在别的物体后面,都会渲染, 如果粒子颜色不同或者存在其他物体显示,就会问题
      depthWrite: false, // 开启深度写入的材质,不管物体是否透明, 都会根据z来遮挡后面的物体;关闭则不会遮挡
      blending: THREE.AdditiveBlending, // 混合.粒子重叠的部分渲染的颜色会累加
      vertexColors: true // 开启设置顶点颜色
    })
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial())
    // scene.add(cube)

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

      // update particles
      // particles.rotation.y = elapsedTime * 0.2

      // pointsMaterial的points做动画性能不好,需要使用自定义着色器来生成material
      for (let i = 0; i < count; i++) {
        let xIndex = i * 3
        let yIndex = i * 3 + 1
        const x = particlesGeometry.attributes.position.array[xIndex]
        particlesGeometry.attributes.position.array[yIndex] = Math.sin(elapsedTime + x)
      }
      particlesGeometry.attributes.position.needsUpdate = true

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
