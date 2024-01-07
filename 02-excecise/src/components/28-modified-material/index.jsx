import { memo, useEffect } from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import galaxyVertexShader from './shader/water/vertex.glsl'
import galaxyFragmentShader from './shader/water/fragment.glsl'

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
     * Loaders
     */
    const textureLoader = new THREE.TextureLoader()
    const gltfLoader = new GLTFLoader()
    const cubeTextureLoader = new THREE.CubeTextureLoader()

    /**
     * Update all materials
     */
    const updateAllMaterials = () => {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMapIntensity = 1
          child.material.needsUpdate = true
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }

    /**
     * Environment map
     */
    const environmentMap = cubeTextureLoader.load([
      '/textures/environmentMaps/0/px.jpg',
      '/textures/environmentMaps/0/nx.jpg',
      '/textures/environmentMaps/0/py.jpg',
      '/textures/environmentMaps/0/ny.jpg',
      '/textures/environmentMaps/0/pz.jpg',
      '/textures/environmentMaps/0/nz.jpg'
    ])

    scene.background = environmentMap
    scene.environment = environmentMap

    /**
     * Material
     */

    // Textures
    const mapTexture = textureLoader.load('/models/LeePerrySmith/color.jpg')
    mapTexture.colorSpace = THREE.SRGBColorSpace
    const normalTexture = textureLoader.load('/models/LeePerrySmith/normal.jpg')

    // Material
    const material = new THREE.MeshStandardMaterial({
      map: mapTexture,
      normalMap: normalTexture
    })

    const depthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking
    })

    const customUniforms = {
      uTime: { value: 0.0 }
    }
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = customUniforms.uTime
      // 添加旋转矩阵
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        uniform float uTime;
        mat2 get2dRotateMatrix(float _angle) {
          return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
        }
      `
      )

      // 修改vertex
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        transformed.xz = rotateMatrix * transformed.xz;
      `
      )

      // 旋转法线坐标, 修复顶点旋转后导致法线位置计算不准确,从而阴影出现问题
      shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
        #include <beginnormal_vertex>
        float angle = (position.y + uTime) * 0.3;
        mat2 rotateMatrix = get2dRotateMatrix(angle);
        objectNormal.xz = rotateMatrix * objectNormal.xz;
      `
      )
    }

    depthMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = customUniforms.uTime
      // 添加旋转矩阵
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        uniform float uTime;
        mat2 get2dRotateMatrix(float _angle) {
          return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
        }
      `
      )

      // 修改vertex
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        float angle = (position.y + uTime) * 0.3;
        mat2 rotateMatrix = get2dRotateMatrix(angle);
        transformed.xz = rotateMatrix * transformed.xz;
      `
      )
    }
    /**
     * Models
     */
    gltfLoader.load('/models/LeePerrySmith/LeePerrySmith.glb', (gltf) => {
      // Model
      const mesh = gltf.scene.children[0]
      mesh.rotation.y = Math.PI * 0.5
      mesh.material = material
      mesh.customDepthMaterial = depthMaterial
      mesh.castShadow = true
      scene.add(mesh)

      // Update materials
      updateAllMaterials()
    })

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(15, 15, 15), new THREE.MeshStandardMaterial())
    plane.receiveShadow = true
    plane.rotation.y = Math.PI / 2
    plane.position.x = -5
    plane.position.y = 2
    scene.add(plane)

    const axesHelper = new THREE.AxesHelper(10)
    scene.add(axesHelper)
    /**
     * Lights
     */
    const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.normalBias = 0.05
    directionalLight.position.set(5.5, 2, 0)
    scene.add(directionalLight)

    const helper = new THREE.DirectionalLightHelper(directionalLight)
    scene.add(helper)

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
    camera.position.set(4, 1, -4)
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.useLegacyLights = false
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      customUniforms.uTime.value = elapsedTime

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
