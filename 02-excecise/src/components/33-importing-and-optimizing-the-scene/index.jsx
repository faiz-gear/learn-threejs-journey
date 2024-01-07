import { memo, useEffect } from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import fireFilesVertexShader from './shader/fireFiles/vertex.glsl'
import fireFilesFragmentShader from './shader/fireFiles/fragment.glsl'
import portalVertexShader from './shader/portal/vertex.glsl'
import portalFragmentShader from './shader/portal/fragment.glsl'

import './style.css'

let sceneReady = false
const Demo = memo(() => {
  useEffect(() => {
    /**
     * Base
     */
    // Debug
    const gui = new dat.GUI({
      width: 400
    })

    const debugObject = {
      clearColor: 0x1b1b1b,
      startColor: 0x000000,
      endColor: 0xffffff
    }

    // Canvas
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()

    /**
     * Loaders
     */
    // Texture loader
    const textureLoader = new THREE.TextureLoader()

    // Draco loader
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('draco/')

    // GLTF loader
    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)

    /**
     * Object
     */
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial())

    // scene.add(cube)

    const bakedTexture = textureLoader.load('baked.jpg')
    bakedTexture.flipY = false // 设置已确保纹理正常显示

    const bakedMaterial = new THREE.MeshBasicMaterial({
      map: bakedTexture
    })

    /**
     * Pole Light Material
     */
    const poleLightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffe5
    })
    // const poleLightNames = ['poleLightA', 'poleLightB']

    /**
     * Portal Light Material
     */
    const portalLightMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0
        },
        uColorStart: {
          value: new THREE.Color(debugObject.startColor)
        },
        uColorEnd: {
          value: new THREE.Color(debugObject.endColor)
        }
      },
      vertexShader: portalVertexShader,
      fragmentShader: portalFragmentShader
    })
    gui.addColor(debugObject, 'startColor').onChange(() => {
      portalLightMaterial.uniforms.uColorStart.value = new THREE.Color(debugObject.startColor)
    })
    gui.addColor(debugObject, 'endColor').onChange(() => {
      portalLightMaterial.uniforms.uColorEnd.value = new THREE.Color(debugObject.endColor)
    })
    // const portalLightNames = ['portalLight']

    gltfLoader.load('portal.glb', (gltf) => {
      // gltf.scene.traverse((child) => {
      //   child.material = bakedMaterial
      // })
      const poleLightA = gltf.scene.children.find((child) => child.name === 'poleLightA')
      const poleLightB = gltf.scene.children.find((child) => child.name === 'poleLightB')
      const portalLight = gltf.scene.children.find((child) => child.name === 'portalLight')
      const bakedMesh = gltf.scene.children.find((child) => child.name === 'baked')
      // poleLightNames.includes(child.name) && (child.material = poleLightMaterial)
      // portalLightNames.includes(child.name) && (child.material = portalLightMaterial)

      poleLightA.material = poleLightMaterial
      poleLightB.material = poleLightMaterial
      portalLight.material = portalLightMaterial
      bakedMesh.material = bakedMaterial

      scene.add(gltf.scene)
    })

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

      fireFilesShaderMaterial.uniforms.uDevicePixelRatio.value = Math.min(window.devicePixelRatio, 2) // 支持在多屏幕间移动有相同显示效果
    })

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 4
    camera.position.y = 2
    camera.position.z = 4
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    /**
     * fireFlies
     */
    const fireFilesGeometry = new THREE.BufferGeometry()
    const fireFliesCount = 100
    const randPositions = Array.from({ length: fireFliesCount }, () => [4, 4, 4].map(THREE.MathUtils.randFloatSpread))
      .map(([x, y, z]) => [x, y + 2, z])
      .flat()
    const scales = Float32Array.from({ length: fireFliesCount }, () => Math.random())

    const positions = Float32Array.from(randPositions)
    fireFilesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    fireFilesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

    const fireFilesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true
    })

    const fireFilesShaderMaterial = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending, // 重叠像素颜色混合
      depthWrite: false,
      uniforms: {
        uDevicePixelRatio: {
          value: Math.min(window.devicePixelRatio, 2)
        },
        uSize: { value: 100 },
        uTime: {
          value: 0
        }
      },
      vertexShader: fireFilesVertexShader,
      fragmentShader: fireFilesFragmentShader
    })

    gui.add(fireFilesShaderMaterial.uniforms.uSize, 'value').step(1).min(0).max(500).name('fireFilesSize')

    const fireFilesPoints = new THREE.Points(fireFilesGeometry, fireFilesShaderMaterial)
    scene.add(fireFilesPoints)

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace

    gui.addColor(debugObject, 'clearColor').onChange((col) => renderer.setClearColor(col))
    renderer.setClearColor(debugObject.clearColor)

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      fireFilesShaderMaterial.uniforms.uTime.value = elapsedTime
      portalLightMaterial.uniforms.uTime.value = elapsedTime
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
