import { memo, useEffect } from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import './style.css'

const Demo = memo(() => {
  useEffect(() => {
    THREE.ColorManagement.enabled = false

    /**
     * Debug
     */
    const gui = new dat.GUI()

    const parameters = {
      materialColor: '#ffeded'
    }

    gui.addColor(parameters, 'materialColor').onFinishChange((v) => material.color.set(v))

    /**
     * Base
     */
    // Canvas
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()

    const textureLoader = new THREE.TextureLoader()
    const particleTexture = textureLoader.load('/textures/particles/12.png')
    const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
    gradientTexture.magFilter = THREE.NearestFilter

    /**
     * Objects
     */
    const material = new THREE.MeshToonMaterial({
      color: parameters.materialColor,
      gradientMap: gradientTexture
    })
    const distance = 4
    const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material)
    const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material)
    const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material)

    mesh1.position.y = -distance * 0
    mesh2.position.y = -distance * 1
    mesh3.position.y = -distance * 2
    mesh1.position.x = -2
    mesh2.position.x = 2
    mesh3.position.x = -2

    const meshes = [mesh1, mesh2, mesh3]
    scene.add(...meshes)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    scene.add(directionalLight)

    /**
     * particles
     */
    const particlesGeometry = new THREE.BufferGeometry()
    const count = 400
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = distance * 0.5 - Math.random() * distance * meshes.length
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      color: parameters.materialColor,
      sizeAttenuation: true,
      size: 0.4,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      map: particleTexture,
      alphaMap: particleTexture
    })
    const points = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(points)

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
    // group
    const cameraGroup = new THREE.Group()
    scene.add(cameraGroup)
    // Base camera
    const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
    camera.position.z = 6
    cameraGroup.add(camera)

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true
    })
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    /**
     * scroll
     */
    let scrollY = window.scrollY
    let currentSection = 0
    const handleScroll = () => {
      scrollY = window.scrollY
      const section = Math.round(scrollY / sizes.height)
      console.log('🚀 ~ file: index.jsx ~ line 138 ~ handleScroll ~ section', section)
      if (currentSection !== section) {
        currentSection = section
        gsap.to(meshes[currentSection].rotation, {
          duration: 1.5,
          ease: 'power2.inOut',
          x: '+=6',
          y: '+=3',
          z: '+=1.5'
        })
      }
    }
    window.addEventListener('scroll', handleScroll)

    /**
     * cursor
     */
    const cursor = { x: 0, y: 0 }
    const handleMouseMove = (e) => {
      cursor.x = e.clientX / sizes.width - 0.5
      cursor.y = e.clientY / sizes.height - 0.5
    }
    window.addEventListener('mousemove', handleMouseMove)

    /**
     * Animate
     */
    const clock = new THREE.Clock()
    let previousTime = 0

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = elapsedTime - previousTime // 当前帧如上一帧的时间差,用来保证在不同帧率的电脑下动画速度一致
      previousTime = elapsedTime

      // camera animate
      camera.position.y = (-scrollY / sizes.height) * distance

      const parrallaX = cursor.x * 0.5
      const parrallaY = -cursor.y * 0.5
      // 增量动画
      cameraGroup.position.x += ((parrallaX - cameraGroup.position.x) * 0.1 * deltaTime) / 0.016 // 分成十段做增量动画, 以60FPS为标准
      cameraGroup.position.y += ((parrallaY - cameraGroup.position.y) * 0.1 * deltaTime) / 0.016

      // objects animate
      for (const mesh of meshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
      }

      // Render
      renderer.render(scene, camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
    }

    tick()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
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
