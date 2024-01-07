import { memo, useEffect } from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
const Demo = memo(() => {
  useEffect(() => {
    /**
     * Loaders
     */
    const dracoLoader = new DRACOLoader()
    // dracoLoader 会结合worker在另外的线程对draco压缩的模式进行解压(使用web assembly语法, 速度更快)
    dracoLoader.setDecoderPath('/draco/')

    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)
    const rgbeLoader = new RGBELoader()
    const cubeTextureLoader = new THREE.CubeTextureLoader()

    /**
     * Base
     */
    // Debug
    const gui = new dat.GUI()
    const global = {}

    // Canvas
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()

    /**
     * Update all materials
     */
    // 简单写法
    // const updateAllMaterials = () => {
    //   scene.traverse((child) => {
    //     if (child.isMesh && child.material.isMeshStandardMaterial) {
    //       child.material.envMapIntensity = global.envMapIntensity
    //     }
    //   })
    // }
    // 复杂写法
    const updateAllMaterials = () => {
      scene.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
          // console.log('🚀 ~ file: index.jsx ~ line 42 ~ scene.traverse ~ child', child)
          // child.material.envMap = environmentMap
          child.material.envMapIntensity = global.envMapIntensity

          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }

    /**
     * Environment map
     */
    // Global intensity
    global.envMapIntensity = 5
    gui.add(global, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)

    // HDR (RGBE) equirectangular
    // rgbeLoader.load('/textures/environmentMaps/0/2k.hdr', (environmentMap) => {
    //   environmentMap.mapping = THREE.EquirectangularReflectionMapping // 必须设置

    //   scene.background = environmentMap
    //   scene.environment = environmentMap
    // })
    // const environmentMap = rgbeLoader.load('/textures/environmentMaps/0/2k.hdr')
    const environmentMap = cubeTextureLoader.load([
      '/textures/environmentMaps/0/px.jpg',
      '/textures/environmentMaps/0/nx.jpg',
      '/textures/environmentMaps/0/py.jpg',
      '/textures/environmentMaps/0/ny.jpg',
      '/textures/environmentMaps/0/pz.jpg',
      '/textures/environmentMaps/0/nz.jpg'
    ])
    // 环境贴图设置SRGBColorSpace, 更符合人眼的感光(解决导入的材质颜色变暗)
    environmentMap.colorSpace = THREE.SRGBColorSpace
    // environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = environmentMap
    scene.environment = environmentMap // Sets the environment map for all physical materials in the scene. However, it's not possible to overwrite an existing texture assigned to MeshStandardMaterial.envMap. Default is null.

    /**
     * Models
     */
    // Helmet
    // gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
    //   gltf.scene.scale.set(10, 10, 10)
    //   gltf.scene.position.y = -4
    //   gltf.scene.rotation.y = Math.PI / 2
    //   scene.add(gltf.scene)

    //   gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation')

    //   updateAllMaterials()
    // })

    gltfLoader.load('/models/hamburger/hamburger.glb', (gltf) => {
      // gltf.scene.scale.set(0.3, 0.3, 0.3)
      // gltf.scene.position.y = -4
      gltf.scene.rotation.y = Math.PI / 2
      scene.add(gltf.scene)

      gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation')

      updateAllMaterials()
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
    })

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(4, 1, -8)
    scene.add(camera)

    /**
     * geometry
     */
    const testSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshStandardMaterial())
    // scene.add(testSphere)

    /**
     * Light
     */
    const directionalLight = new THREE.DirectionalLight('#fff', 3)
    directionalLight.position.set(0.25, 3, -2.25)
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.mapSize.set(1024, 1024)
    // const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
    // scene.add(cameraHelper)
    scene.add(directionalLight)
    gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
    gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('x')
    gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('y')
    gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('z')

    directionalLight.castShadow = true
    /**
     * bias通常用于平面，因此不适用于我们的汉堡包。但如果你有在一块平坦的表面上出现阴影失真，可以试着增加偏差直到失真消失。
normalBias通常用于圆形表面，因此我们增加法向偏差直到阴影失真消失。
     */
    directionalLight.shadow.normalBias = 0.05 // 在计算曲面是否处于阴影中时，由于精度原因，阴影失真可能会发生在平滑和平坦表面上。
    // gui.add(directionalLight)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    // controls.target.y = 3.5
    controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true // 在一些devicePixeRatio为1的设备上模型会有锯齿,需要开启抗锯齿
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // 不使用过时光 这样假如从3d软件导出的模型中如果带有光的话, 模型显示出来的光照效果会一致
    renderer.useLegacyLights = false // physicallyCorrectLights was replaced with useLegacyLights
    /**
     * linear颜色空间：物理上的线性颜色空间，当计算机需要对sRGB像素运行图像处理算法时，一般会采用线性颜色空间计算。
sRGB颜色空间： sRGB是当今一般电子设备及互联网图像上的标准颜色空间。较适应人眼的感光。sRGB的gamma与2.2的标准gamma非常相似，所以在从linear转换为sRGB时可通过转换为gamma2.2替代。
gamma转换：线性与非线性颜色空间的转换可通过gamma空间进行转换。
从一般软件中导出的模型中包含颜色信息的贴图一般都是sRGB颜色空间（sRGB colorspace)
     */
    // 设置渲染器的颜色空间: (解决导入的模型颜色变暗)
    renderer.outputColorSpace = THREE.SRGBColorSpace // SRGBColorSpace是default, 可选:LinearSRGBColorSpace
    renderer.toneMapping = THREE.ReinhardToneMapping // 色调映射, 能够有更高的亮度,塑造更真实的效果
    renderer.toneMappingExposure = 3 // 曝光度
    gui
      .add(renderer, 'toneMapping', {
        No: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping
      })
      .onFinishChange(() => {
        renderer.toneMapping = Number(renderer.toneMapping)
      })
    gui.add(renderer, 'toneMappingExposure').min(0).max(10).name('toneMappingExposure')

    // shadows
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap

    /**
     * Animate
     */
    const tick = () => {
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
