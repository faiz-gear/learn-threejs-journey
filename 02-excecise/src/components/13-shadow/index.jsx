import React, { memo, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

THREE.ColorManagement.enabled = false

const Demo = memo(() => {
  useEffect(() => {
    THREE.ColorManagement.enabled = false

    const textureLoader = new THREE.TextureLoader()

    const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
    const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')

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
     * Lights: 只有DirectionalLight\PointLight\SpotLight能产生阴影, 并且需要设置light.castShadow = true 需要产生阴影的物体mesh.castShadow = true, 需要添加阴影贴图的物体mesh.receiveShadow = true
     */
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
    scene.add(ambientLight)

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
    directionalLight.position.set(2, 2, -1)
    // gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
    // gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
    // gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
    // gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)
    directionalLight.castShadow = true
    // 产生的阴影贴图会存在光照对象上
    directionalLight.shadow.mapSize.width = 1024 // default 512, 设大会更清晰, 必须设置2的次幂,和mipmap有关系
    directionalLight.shadow.mapSize.height = 1024 // default 512
    // shadow camera, 并不是场景中的camera, 是光源的视角, 是用来产生场景的depthMap的; 从光源的视角中,在物体之后的物体会在阴影中
    // directionalLight的shadow camera是 OrthographicCamera
    directionalLight.shadow.camera.near = 1 // 设置near和far在需要产生阴影的物体所在范围区间内,可以减少不必要的bug, 但是不能设置过大或过小, 不然生成的阴影贴图会被裁剪或缺失
    directionalLight.shadow.camera.far = 6
    directionalLight.shadow.camera.top = 2 // 设置相机生成阴影贴图的矩形范围 可以理解为截图需要生成阴影贴图的部分, 只要让矩形范围框住需要产生阴影的部分即可.矩形范围如果小于物体的边界,那么生成的阴影贴图也会被裁剪
    directionalLight.shadow.camera.right = 2
    directionalLight.shadow.camera.bottom = -2
    directionalLight.shadow.camera.left = -2
    // directionalLight.shadow.radius = 10 // 模糊(shadow map计算算法为THREE.PCFSoftShadowMap时, 设置radius会失效)
    // const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
    // scene.add(directionalLightCameraHelper)

    scene.add(directionalLight)

    // spotLight
    const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3, 0.2)
    spotLight.castShadow = true
    spotLight.position.set(0, 2, 2)
    // PerspectiveCamera
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.camera.fov = 30
    spotLight.shadow.camera.near = 2
    spotLight.shadow.camera.far = 5

    const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
    // scene.add(spotLightCameraHelper)
    scene.add(spotLight)

    // pointLight
    const pointLight = new THREE.PointLight(0xffffff, 0.3)
    pointLight.castShadow = true
    pointLight.position.set(-1, 1, 0)
    // PerspectiveCamera
    pointLight.shadow.mapSize.width = 1024
    pointLight.shadow.mapSize.height = 1024
    // 点光源的camera fov不要修改, 因为点光源要去生成各个角度的阴影贴图
    pointLight.shadow.camera.near = 0.1
    pointLight.shadow.camera.far = 3

    const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
    // scene.add(pointLightCameraHelper)
    scene.add(pointLight)

    /**
     * Materials
     */
    const material = new THREE.MeshStandardMaterial()
    material.roughness = 0.7
    gui.add(material, 'metalness').min(0).max(1).step(0.001)
    gui.add(material, 'roughness').min(0).max(1).step(0.001)

    /**
     * Objects
     */
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
    sphere.castShadow = true

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      // new THREE.MeshBasicMaterial({ map: bakedShadow })
      material
    ) // 烘烤贴图, 模拟物体的阴影,但是是静态的,物体不能移动
    plane.rotation.x = -Math.PI * 0.5
    plane.position.y = -0.5
    plane.receiveShadow = true

    // 阴影平面
    const sphereShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.5),
      new THREE.MeshStandardMaterial({
        color: 0x000000,
        alphaMap: simpleShadow,
        transparent: true
      })
    )
    sphereShadow.rotation.x = -Math.PI / 2
    sphereShadow.position.y = plane.position.y + 0.01

    scene.add(sphere, plane, sphereShadow)

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
    camera.position.x = 1
    camera.position.y = 1
    camera.position.z = 2
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
    renderer.shadowMap.enabled = false // 渲染器要开启阴影贴图, 这样才会为需要显示阴影效果的物体自动生成并添加阴影贴图
    renderer.shadowMap.type = THREE.PCFSoftShadowMap // 默认是PCFShadowMap, 边缘没有PCFSoftShadowMap渲染效果好, 但是性能是最高的

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      // move sphere
      sphere.position.x = Math.cos(elapsedTime) * 1.5
      sphere.position.z = Math.sin(elapsedTime) * 1.5
      sphere.position.y = Math.abs(Math.sin(elapsedTime * 2))

      // move sphere shadow
      sphereShadow.position.x = sphere.position.x
      sphereShadow.position.z = sphere.position.z
      const scale = 1 - sphere.position.y * 0.2
      sphereShadow.scale.set(scale, scale, scale)
      sphereShadow.material.opacity = 1 - sphere.position.y * 0.8

      // Update controls
      controls.update()

      // Render
      renderer.render(scene, camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
    }

    tick()
  }, [])
  return <div>Demo</div>
})

export default Demo
