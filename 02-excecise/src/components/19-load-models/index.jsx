import { memo, useEffect } from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
const Demo = memo(() => {
  useEffect(() => {
    THREE.ColorManagement.enabled = false

    /**
     * Base
     */
    // Debug
    const gui = new dat.GUI()

    /**
     * Models
     */
    const dracoLoader = new DRACOLoader()
    // dracoLoader 会结合worker在另外的线程对draco压缩的模式进行解压(使用web assembly语法, 速度更快)
    dracoLoader.setDecoderPath('/draco/')

    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)

    let mixer = null
    // 会在加载了draco压缩后的模型时,开启额外的线程进行解压.如果不是压缩后的模型,则不会用到draco loader
    gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
      console.log(gltf)

      // scene.add(gltf.scene.children[0])
      // 直接遍历, 由于每一次add会remove gltf.scene.children中的mesh, 导致遍历次数会减少
      // for (const mesh of gltf.scene.children) {
      //   scene.add(mesh)
      // }
      // const children = [...gltf.scene.children]
      // for (const mesh of children) {
      //   scene.add(mesh)
      // }

      mixer = new THREE.AnimationMixer(gltf.scene) // root: 动画器要播放动画的对象
      const animationClip = gltf.animations[1] // AnimationClip是一组可重用的关键帧轨道，它代表一个动画。
      const action = mixer.clipAction(animationClip)
      action.play()
      gltf.scene.scale.set(0.025, 0.025, 0.025)
      scene.add(gltf.scene)
    })

    // Canvas
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()

    /**
     * Floor
     */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
      })
    )
    floor.receiveShadow = true
    floor.rotation.x = -Math.PI * 0.5
    scene.add(floor)

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.camera.left = -7
    directionalLight.shadow.camera.top = 7
    directionalLight.shadow.camera.right = 7
    directionalLight.shadow.camera.bottom = -7
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

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
    camera.position.set(2, 2, 2)
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.target.set(0, 0.75, 0)
    controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas
    })
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    /**
     * Animate
     */
    const clock = new THREE.Clock()
    let previousTime = 0

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = elapsedTime - previousTime
      previousTime = elapsedTime

      // update mixer
      mixer?.update(deltaTime)

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
