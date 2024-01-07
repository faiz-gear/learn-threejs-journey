import React, { memo, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js'

THREE.ColorManagement.enabled = false

const Demo = memo(() => {
  useEffect(() => {
    /**
     * Base
     */
    // Debug
    const gui = new dat.GUI({
      width: 400
    })

    // Canvas
    const canvas = document.querySelector('.webgl')

    // Scene
    const scene = new THREE.Scene()

    /**
     * Lights
     */
    // 1.环境光, 几何体的每一面都会照到, 颜色一样 (默认位置在0, 0, 0)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // 2.平行光 (默认位置在0, 1, 0)
    const directionLight = new THREE.DirectionalLight(0x00fffc, 0.5)
    const directionLightHelper = new THREE.DirectionalLightHelper(directionLight, 1)
    // gui.add(directionLight.position, 'x').min(-2).max(2).step(0.1).name('direction light x')
    // gui.add(directionLight.position, 'y').min(-2).max(2).step(0.1).name('direction light y')
    // gui.add(directionLight.position, 'z').min(-2).max(2).step(0.1).name('direction light z')
    // directionLight.castShadow = true
    // scene.add(directionLight)
    // scene.add(directionLightHelper)

    // 3.半球光 类似于环境光 但是sky是一种颜色 ground是一种颜色 (默认位置在0, 1, 0)
    const hemisSphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.5)
    const hemisSphereLightHelper = new THREE.HemisphereLightHelper(hemisSphereLight, 1)
    // gui.add(hemisSphereLight.position, 'x').min(-2).max(2).step(0.1).name('hemissphere light x')
    // gui.add(hemisSphereLight.position, 'y').min(-2).max(2).step(0.1).name('hemissphere light y')
    // gui.add(hemisSphereLight.position, 'z').min(-2).max(2).step(0.1).name('hemissphere light z')
    // scene.add(hemisSphereLight)
    // scene.add(hemisSphereLightHelper)

    // 4.点光源 (默认位置在0, 0, 0) 可以理解成一个无限小的点发出的光
    // 第三个参数distance距离,离点光源超出distance的几何体,将不会被点光源照射到,默认值是0, 代表没距离限制
    // 第四个参数是光沿着distance变暗的量, 默认为2
    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
    // pointLight.position.x = 2
    // pointLight.position.y = 3
    // pointLight.position.z = 4
    // gui.add(pointLight, 'distance').min(0).max(10).step(1).name('point light distance')
    // gui.add(pointLight, 'decay').min(0).max(10).step(1).name('point light decay')
    // gui.add(pointLight.position, 'x').min(-2).max(2).step(0.1).name('pointLight x')
    // gui.add(pointLight.position, 'y').min(-2).max(2).step(0.1).name('pointLight y')
    // gui.add(pointLight.position, 'z').min(-2).max(2).step(0.1).name('pointLight z')
    // pointLight.castShadow = true
    // scene.add(pointLight)
    // scene.add(pointLightHelper)

    // 5.矩形光 矩形光只在MeshStandardMaterial和MeshPhysicMaterial材质上才有作用 可以理解为打光的矩形灯
    const rectLight = new THREE.RectAreaLight(0xffffff, 2, 1, 1)
    const rectLightHelper = new RectAreaLightHelper(rectLight)
    // rectLight.position.set(0, 1, 1) // 先设置位置,再设置lookat,才能正确看到对应的点
    // rectLight.lookAt(1.5, 0, 0)
    // gui.add(rectLight.position, 'x').min(-2).max(2).step(0.1).name('rectLight x')
    // gui.add(rectLight.position, 'y').min(-2).max(2).step(0.1).name('rectLight y')
    // gui.add(rectLight.position, 'z').min(-2).max(2).step(0.1).name('rectLight z')
    // scene.add(rectLight)
    // scene.add(rectLightHelper)

    // 6.聚光灯 类似于手电筒
    const spotLight = new THREE.SpotLight(0xffffff, 2, 10, Math.PI * 0.1, 0.25, 2)
    spotLight.position.set(0, 2, 3)
    const spotLightHelper = new THREE.SpotLightHelper(spotLight)
    // gui.add(spotLight.position, 'x').min(-5).max(5).step(0.1).name('spotLight x')
    // gui.add(spotLight.position, 'y').min(-5).max(5).step(0.1).name('spotLight y')
    // gui.add(spotLight.position, 'z').min(-5).max(5).step(0.1).name('spotLight z')
    // gui
    //   .add(spotLight, 'angle')
    //   .min(Math.PI * 0.1)
    //   .max(Math.PI * 0.25)
    //   .step(Math.PI / 180)
    //   .name('spotLight angle')
    // // 光照边缘的半影 0-1之间 默认0, 为0时边缘很尖锐
    // gui.add(spotLight, 'penumbra').min(0).max(1).step(0.01).name('spotLight penumbra')
    // // // 设置聚光灯照向位置(必须按照这个方式写)
    // // spotLight.target.position.x = -0.5
    // // scene.add(spotLight.target)
    spotLight.castShadow = true
    scene.add(spotLightHelper)
    scene.add(spotLight)

    /**
     * Objects
     */
    // Material
    const material = new THREE.MeshStandardMaterial()
    material.roughness = 0.4

    // Objects
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
    sphere.position.x = -1.5

    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material)
    cube.castShadow = true

    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material)
    torus.position.x = 1.5

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
    plane.rotation.x = -Math.PI * 0.5
    plane.position.y = -0.65
    plane.receiveShadow = true

    scene.add(sphere, cube, torus, plane)

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
    renderer.shadowMap.enabled = true

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      // Update objects
      sphere.rotation.y = 0.1 * elapsedTime
      cube.rotation.y = 0.1 * elapsedTime
      torus.rotation.y = 0.1 * elapsedTime

      sphere.rotation.x = 0.15 * elapsedTime
      cube.rotation.x = 0.15 * elapsedTime
      torus.rotation.x = 0.15 * elapsedTime

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
