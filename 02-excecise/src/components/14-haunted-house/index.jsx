import React, { memo, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

THREE.ColorManagement.enabled = false

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

    // fog
    // near: 开始应用雾的最小距离。距离活动摄像机小于“近”单位的物体不会受到雾的影响。 far: 计算和应用雾停止的最大距离。距离活动相机超过“far”单位的物体不会受到雾的影响。
    const fog = new THREE.Fog('#262837', 1, 20)
    scene.fog = fog

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader()
    const doorColorTexture = textureLoader.load('/textures/door/Door_Wood_001_basecolor.jpg')
    const doorOpacityTexture = textureLoader.load('/textures/door/Door_Wood_001_opacity.jpg')
    const doorHeightTexture = textureLoader.load('/textures/door/Door_Wood_001_height.png')
    const doorNormalTexture = textureLoader.load('/textures/door/Door_Wood_001_normal.jpg')
    const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/Door_Wood_001_ambientOcclusion.jpg')
    const doorMetallicTexture = textureLoader.load('/textures/door/Door_Wood_001_metallic.jpg')
    const doorRoughnessTexture = textureLoader.load('/textures/door/Door_Wood_001_roughness.jpg')

    const brickColorTexture = textureLoader.load('/textures/bricks/color.jpg')
    const brickAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
    const brickNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
    const brickRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

    const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
    const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
    const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
    const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

    grassColorTexture.repeat.set(8, 8)
    grassColorTexture.wrapS = THREE.RepeatWrapping
    grassColorTexture.wrapT = THREE.RepeatWrapping
    grassAmbientOcclusionTexture.repeat.set(8, 8)
    grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
    grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
    grassNormalTexture.repeat.set(8, 8)
    grassNormalTexture.wrapS = THREE.RepeatWrapping
    grassNormalTexture.wrapT = THREE.RepeatWrapping
    grassRoughnessTexture.repeat.set(8, 8)
    grassRoughnessTexture.wrapS = THREE.RepeatWrapping
    grassRoughnessTexture.wrapT = THREE.RepeatWrapping

    /**
     * House
     */
    const house = new THREE.Group()
    scene.add(house)

    // walls
    const wallsHeight = 2.5
    const wallsDepth = 4
    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(4, wallsHeight, wallsDepth),
      new THREE.MeshStandardMaterial({
        // color: '#ac8e82'
        map: brickColorTexture,
        aoMap: brickAmbientOcclusionTexture,
        normalMap: brickNormalTexture,
        roughnessMap: brickRoughnessTexture
      })
    )
    walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
    walls.position.y = wallsHeight / 2
    house.add(walls)

    // roof
    const roofHeight = 1
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(3, roofHeight, 4),
      new THREE.MeshStandardMaterial({
        color: '#b35f45'
      })
    )
    roof.position.y = wallsHeight + roofHeight / 2
    roof.rotation.y = Math.PI * 0.25
    house.add(roof)

    // door
    const doorHeight = 2
    const doorMaterial = new THREE.MeshStandardMaterial({
      // color: '#aa7b7b',
      map: doorColorTexture,
      aoMap: doorAmbientOcclusionTexture, // 要设置uv2
      // aoMapIntensity: 5,
      transparent: true,
      alphaMap: doorOpacityTexture,
      displacementMap: doorHeightTexture, // 位移贴图需要几何体有更多顶点
      displacementScale: 0.12,
      normalMap: doorNormalTexture,
      metalnessMap: doorMetallicTexture,
      roughnessMap: doorRoughnessTexture
    })
    const door = new THREE.Mesh(new THREE.PlaneGeometry(2.2, doorHeight + 0.2, 100, 100), doorMaterial)
    door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
    door.position.z = wallsDepth / 2 + 0.01
    door.position.y = doorHeight / 2
    house.add(door)

    // bush
    const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
    const bushMaterial = new THREE.MeshStandardMaterial({
      color: '#89c845'
    })

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
    bush1.scale.set(0.5, 0.5, 0.5)
    bush1.position.set(0.8, 0.2, 2.2)

    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
    bush2.scale.set(0.2, 0.2, 0.2)
    bush2.position.set(1.4, 0.1, 2.1)

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
    bush3.scale.set(0.4, 0.4, 0.4)
    bush3.position.set(-1, 0.1, 2.1)

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
    bush4.scale.set(0.15, 0.15, 0.15)
    bush4.position.set(-1.2, 0.1, 2.6)

    house.add(bush1, bush2, bush3, bush4)

    // graves
    const graves = new THREE.Group()
    scene.add(graves)

    const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
    const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

    for (let i = 0; i < 50; i++) {
      const grave = new THREE.Mesh(graveGeometry, graveMaterial)

      const angle = Math.random() * Math.PI * 2
      const radius = 3 + Math.random() * 6
      grave.position.x = Math.cos(angle) * radius
      grave.position.z = Math.sin(angle) * radius
      grave.position.y = 0.3
      grave.rotation.y = (Math.random() - 0.5) * 0.4
      grave.rotation.z = (Math.random() - 0.5) * 0.4

      grave.castShadow = true
      graves.add(grave)
    }

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
      })
    )
    floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))

    floor.rotation.x = -Math.PI * 0.5
    floor.position.y = 0
    scene.add(floor)

    /**
     * Lights
     */
    // Ambient light
    const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
    gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
    scene.add(ambientLight)

    // Directional light
    const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
    moonLight.position.set(4, 5, -2)
    gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
    gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
    gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
    gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
    scene.add(moonLight)

    // door light
    const doorLight = new THREE.PointLight('#ff7d46', 1, 6)
    doorLight.position.set(0, 2.2, 2.7)
    house.add(doorLight)

    // ghosts
    const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
    const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
    const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
    scene.add(ghost1, ghost2, ghost3)

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
    camera.position.x = 4
    camera.position.y = 2
    camera.position.z = 5
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
    renderer.setClearColor('#262837') // 设置渲染器的背景颜色

    /**
     * shadow
     */
    renderer.shadowMap.enabled = true
    moonLight.castShadow = true
    doorLight.castShadow = true
    ghost1.castShadow = true
    ghost2.castShadow = true
    ghost3.castShadow = true
    walls.castShadow = true
    bush1.castShadow = true
    bush2.castShadow = true
    bush3.castShadow = true
    bush4.castShadow = true

    floor.receiveShadow = true

    // 阴影优化
    doorLight.shadow.mapSize.width = 256
    doorLight.shadow.mapSize.height = 256
    doorLight.shadow.camera.far = 7
    // const doorLightCameraHelper = new THREE.CameraHelper(doorLight.shadow.camera)
    // scene.add(doorLightCameraHelper)

    ghost1.shadow.mapSize.width = 256
    ghost1.shadow.mapSize.height = 256
    ghost1.shadow.camera.far = 7
    ghost2.shadow.mapSize.width = 256
    ghost2.shadow.mapSize.height = 256
    ghost2.shadow.camera.far = 7
    ghost3.shadow.mapSize.width = 256
    ghost3.shadow.mapSize.height = 256
    ghost3.shadow.camera.far = 7

    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      // update ghosts
      const ghostAngle1 = elapsedTime * 0.5
      ghost1.position.x = Math.cos(ghostAngle1) * 5
      ghost1.position.z = Math.sin(ghostAngle1) * 5
      ghost1.position.y = Math.sin(ghostAngle1 * 6)

      const ghostAngle2 = -elapsedTime * 0.3
      ghost2.position.x = Math.cos(ghostAngle2) * 5
      ghost2.position.z = Math.sin(ghostAngle2) * 5
      ghost2.position.y = Math.sin(elapsedTime) + Math.sin(elapsedTime * 3)

      const ghostAngle3 = -elapsedTime * 0.3
      ghost3.position.x = Math.cos(ghostAngle3) * (7 + Math.cos(elapsedTime * 0.2))
      ghost3.position.z = Math.sin(ghostAngle3) * (7 + Math.cos(elapsedTime * 0.3))
      ghost3.position.y = Math.sin(elapsedTime * 2) + Math.sin(elapsedTime)

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
