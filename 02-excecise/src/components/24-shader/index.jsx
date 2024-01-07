import { memo, useEffect } from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import testVertexShader from './shader/test/vertex.glsl'
import testFragmentShader from './shader/test/fragment.glsl'

const Demo = memo(() => {
  useEffect(() => {
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
    const flagTexture = textureLoader.load('/textures/flag-french.jpg')

    /**
     * Test mesh
     */
    // Geometry
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)
    // 添加自定义属性给顶点着色器使用
    const count = geometry.attributes.position.count
    const aRandomZFactors = new Float32Array(count) // 随机z的增量
    for (let i = 0; i < count; i++) {
      aRandomZFactors[i] = Math.random()
    }
    geometry.setAttribute('aRandomZFactors', new THREE.BufferAttribute(aRandomZFactors, 1)) // 因为只有z的随机增量,所以一个值代表一个顶点
    console.log('🚀 ~ file: index.jsx ~ line 32 ~ useEffect ~ geometry', geometry)

    // Material
    const material = new THREE.ShaderMaterial({
      vertexShader: testVertexShader,
      fragmentShader: testFragmentShader,
      wireframe: false,
      transparent: true,
      uniforms: {
        // 拱起的频率
        uFrequency: {
          value: new THREE.Vector2(10, 5)
        },
        // 根据时间挥动
        uTime: {
          value: 0 // 传给uniform的数据最好不要太大的数字
        },
        uColor: {
          value: new THREE.Color('red')
        },
        uTexture: {
          value: flagTexture
        }
      }
    })
    console.log('🚀 ~ file: index.jsx ~ line 48 ~ useEffect ~ material', material)
    gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.001).name('frequencyX')
    gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.001).name('frequencyY')

    // Mesh
    const mesh = new THREE.Mesh(geometry, material)
    mesh.scale.y = 0.5
    scene.add(mesh)

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
    camera.position.set(0.25, -0.25, 1)
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

      material.uniforms.uTime.value = elapsedTime

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
