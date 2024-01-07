import { memo, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

const gui = new dat.GUI()

const Demo = memo(() => {
  useEffect(() => {
    console.log(THREE)

    const textureLoader = new THREE.TextureLoader()
    const cubeTextureLoader = new THREE.CubeTextureLoader()

    const doorColorTexture = textureLoader.load('/textures/door/Door_Wood_001_basecolor.jpg')
    const doorOpacityTexture = textureLoader.load('/textures/door/Door_Wood_001_opacity.jpg')
    const doorHeightTexture = textureLoader.load('/textures/door/Door_Wood_001_height.png')
    const doorNormalTexture = textureLoader.load('/textures/door/Door_Wood_001_normal.jpg')
    const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/Door_Wood_001_ambientOcclusion.jpg')
    const doorMetallicTexture = textureLoader.load('/textures/door/Door_Wood_001_metallic.jpg')
    const doorRoughnessTexture = textureLoader.load('/textures/door/Door_Wood_001_roughness.jpg')
    const matcapTexture = textureLoader.load(' /textures/matcaps/3.png')
    const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
    gradientTexture.minFilter = THREE.NearestFilter
    gradientTexture.magFilter = THREE.NearestFilter
    gradientTexture.generateMipmaps = false // minFilter和magFilterw为NearestFilter采样时,最好设置generateMipmaps为false, 性能更高

    const enviromentMap = cubeTextureLoader.setPath('/textures/environmentMaps/4/').load([
      'px.png', // +x的贴图,
      'nx.png', // -x的贴图
      'py.png', // 依次类推
      'ny.png',
      'pz.png',
      'nz.png'
    ])

    // canvas
    const canvas = document.querySelector('.webgl')
    const cursor = { x: 0, y: 0 }
    canvas.addEventListener('mousemove', (e) => {
      cursor.x = e.clientX / canvas.clientWidth - 0.5
      cursor.y = e.clientY / canvas.clientHeight - 0.5
    })

    // Scene
    const scene = new THREE.Scene()
    scene.background = enviromentMap

    /**
     * 1.MeshBasicMaterial: 基础材质
     * 场景: 没有阴影 反射或其他高级效果,只能显示单一的颜色或纹理,通常用于测试\简单展示
     */
    // const material = new THREE.MeshBasicMaterial()
    /** texture */
    // material.map = doorColorTexture
    /** color */
    // material.color.setRGB(255, 0, 0)
    // material.color.setHex(0xff0000)
    /** wireframe */
    // material.wireframe = true
    /** opacity */
    // material.opacity = 0.5 // 设置opacity必须设置transparent
    // material.transparent = true
    /** alphaMap 透明度贴图 */
    // material.alphaMap = doorOpacityTexture // 也需要设置transparent
    // material.transparent = true
    /** side */
    // material.side = THREE.DoubleSide // 尽量少用,因为这会更加消耗gpu的性能,需要更多计算和绘制

    /**
     * 2.MeshNormalMaterial: 法线材质
     * 场景: 创建一些抽象的艺术效果，例如模拟海洋、云彩
     */
    // const material = new THREE.MeshNormalMaterial()
    // material.flatShading = true // 平面阴影, 面之间的过度会不再平滑

    /**
     * 3.MeshMatcapMaterial:捕捉材质
     * 场景:基于Matcap纹理, 纹理中包含了表面的光照和颜色信息, 会将贴图的对应的颜色展现出来 我们会产生物体被照亮的错觉
     */
    // const material = new THREE.MeshMatcapMaterial()
    // material.map = matcapTexture

    /**
     * 4.MeshDepthMaterial: 深度材质3D
     * 场景: 深度图像渲染，水下效果，立体显示效果.远黑近白, 当物体的位置接近摄影机的「near」时，物体会被用白色着色，当物体接近摄影机的「far」时，则使用黑色着色。
     */
    // const material = new THREE.MeshDepthMaterial()

    /**
     * 5.MeshLambertMaterial: 兰伯特材质(需要光照)
     * 场景: 简化的光照模型,高性能,适用与性能有限的设备,抹泥磨砂表面的物体, 不支持镜面反光
     */
    // const material = new THREE.MeshLambertMaterial()

    /**
     * 6.MeshPhongMaterial: 冯氏材质(与MeshLambertMaterial类似)
     * 场景: 真实渲染场景中, 可以实现镜面反射, 更大性能开销
     */
    // const material = new THREE.MeshPhongMaterial()
    // material.shininess = 1000 // 反射光亮度 默认30
    // material.specular = new THREE.Color(0xff0000) // 镜面反射颜色 默认0x111111

    /**
     * 7.MeshToonMaterial: 卡通材质
     * 场景: 卡通风格材质类型, 类似与兰伯特材质,但是默认情况下,会对阴影和光照两个部分着色, 可以理解为兰伯特材质设置了minFilter和magFilter为NearestFilter采样的纹理
     */
    // const material = new THREE.MeshToonMaterial()
    // material.gradientMap = gradientTexture // 渐变贴图

    /**
     * 8.MeshStandardMaterial: 标准材质(PBR材质, 根据现实物理光照原来进行渲染, 更真实)
     * 场景: 抹泥各种金属和非金属材质, 会有更逼真的效果,更多的性能消耗
     */
    const material = new THREE.MeshStandardMaterial()
    material.map = doorColorTexture
    material.aoMap = doorAmbientOcclusionTexture // 环境遮蔽贴图, 模拟物体表面的微小阴影, 需要设置uv2 atrribute
    material.aoMapIntensity = 5 // 环境贴图强度 (阴影强度)
    material.metalness = 0.65 // 金属度
    material.roughness = 0.65 // 粗糙度
    material.displacementMap = doorHeightTexture // 位移贴图
    /**
     * 位移贴图影响网格顶点的位置。不像其他贴图只影响材质的明暗，位移的顶点可以投射阴影，阻挡其他物体，或者作为真实的几何图形。位移纹理是一个图像，其中每个像素的值(白色是最高的)被映射到网格的顶点，并重新定位。
     */
    material.displacementScale = 0.05 // 位移贴图缩放
    material.metalnessMap = doorMetallicTexture // 金属度贴图
    material.roughnessMap = doorRoughnessTexture // 粗糙度贴图
    material.normalMap = doorNormalTexture // 法线贴图, 会有更多细节
    // material.transparent = true
    // material.alphaMap = doorOpacityTexture // 透明贴图 黑色透明 白色完全显示

    // const material = new THREE.MeshStandardMaterial()
    // material.metalness = 0.9 // 金属度
    // material.roughness = 0.1 // 粗糙度
    // material.envMap = enviromentMap // 环境贴图(需要使用到CubeTextureLoader, 需要有六个面的贴图)

    gui.add(material, 'metalness').min(0).max(1).step(0.01).name('金属度')
    gui.add(material, 'roughness').min(0).max(1).step(0.01).name('粗糙度')
    gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.01).name('ao(环境遮蔽)强度')
    gui.add(material, 'displacementScale').min(0).max(10).step(0.01).name('位移贴图缩放')
    gui.add(material.normalScale, 'x').min(0).max(10).step(0.01).name('法线贴图缩放 x')
    gui.add(material.normalScale, 'y').min(0).max(10).step(0.01).name('法线贴图缩放 y')

    // Mesh
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material)
    sphere.position.x = -1.5
    // sphere.position.z = 3
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), material)
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 16, 32), material)
    torus.position.x = 1.5

    /**
     * uv
     */
    // sphere.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(sphere.geometry.attributes.uv.array, 2))
    plane.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array, 2))

    scene.add(sphere, plane, torus)

    // Camera
    // PerspectiveCamera
    // 在离camrea near到far之间距离的物体才能被看到
    // 但是near不能设置过小, 如0.00001,far不能过大,如:999999999, 这在object 位置重叠时, gpu会很难判断出应该显示哪个物体在前
    // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000) // fov\aspect ratio\near\far

    // OrthographicCamera
    // const aspectRatio = window.innerWidth / window.innerHeight
    // // aspectRatio 可以让正交相机画面的宽高比于画布一致
    // const camera = new THREE.OrthographicCamera(1 * aspectRatio, -1 * aspectRatio, 1, -1, 0.1, 1000)

    /**
     * lights
     */
    const ambitionLight = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(ambitionLight)
    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    pointLight.position.x = 2
    pointLight.position.y = 3
    pointLight.position.z = 4
    scene.add(pointLight)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000) // fov\aspect ratio\near\far

    camera.position.y = 0
    camera.position.z = 5
    camera.position.x = 0

    scene.add(camera)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true // 开启阻尼,这样在转动或拖拽时有停下来的效果(注意需要在每一帧之前update controls)
    // controls.target.y = 2 // 设置相机lookat的position, 也是设置control的中心点(如旋转的时候的中心点, 会影响control的交互行为, 不推荐设置)
    // controls.update()

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    renderer.render(scene, camera)

    const clock = new THREE.Clock()
    const tick = () => {
      // update camera
      // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
      // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
      // camera.position.y = -cursor.y * 3
      // camera.lookAt(mesh.position)
      const elapsedTime = clock.getElapsedTime()
      sphere.rotation.y = 0.1 * elapsedTime
      plane.rotation.y = 0.1 * elapsedTime
      torus.rotation.y = 0.1 * elapsedTime

      // update controls
      controls.update()

      renderer.render(scene, camera)
      requestAnimationFrame(tick)
    }
    tick()
  })

  return <div>Demo</div>
})

export default Demo
