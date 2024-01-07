import { memo, useEffect } from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as CANNON from 'cannon-es'

const Demo = memo(() => {
  useEffect(() => {
    THREE.ColorManagement.enabled = false

    /**
     * Debug
     */
    const gui = new dat.GUI()

    const debugObject = {
      count: 1,
      createSphere: () => {
        createSphere(Math.random() * 0.5, {
          x: (Math.random() - 0.5) * 3,
          y: 3,
          z: (Math.random() - 0.5) * 3
        })
      },
      createBox: () => {
        for (let i = 0; i < debugObject.count; i++) {
          createBox(Math.random(), Math.random(), Math.random(), {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
          })
        }
      },
      reset: () => {
        objectsToUpdate.forEach(({ mesh, body }) => {
          // remove body
          body.removeEventListener('collide', playSound)
          world.remove(body)
          // remove mesh
          scene.remove(mesh)
        })
      }
    }

    gui.add(debugObject, 'count').min(1).max(100).step(1)
    gui.add(debugObject, 'createSphere')
    gui.add(debugObject, 'createBox')
    gui.add(debugObject, 'reset')

    /**
     * Base
     */
    // Canvas
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()

    const axesHepler = new THREE.AxesHelper(5)
    scene.add(axesHepler)

    /**
     * Sound
     */
    const hitSound = new Audio('/sounds/hit.mp3')
    const playSound = (collide) => {
      const impactStrength = collide.contact.getImpactVelocityAlongNormal()
      if (impactStrength > 1.5) {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0 // 每次触发都重头开始播放
        hitSound.play()
      }
    }

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader()
    const cubeTextureLoader = new THREE.CubeTextureLoader()

    const environmentMapTexture = cubeTextureLoader.load([
      '/textures/environmentMaps/5/px.png',
      '/textures/environmentMaps/5/nx.png',
      '/textures/environmentMaps/5/py.png',
      '/textures/environmentMaps/5/ny.png',
      '/textures/environmentMaps/5/pz.png',
      '/textures/environmentMaps/5/nz.png'
    ])

    /**
     * Phsics
     */
    const world = new CANNON.World()
    // 设置重力加速度
    world.gravity.set(0, -9.82, 0)
    // 默认情况下,world会测试计算所有空间的object之间的可能存在的碰撞: CANNON.NaiveBroadphase, 性能差
    // 其他值: CANNON.GridBroadphase, 划分不同区域, 同一区域或者相邻的区域会测试计算 ; CANNON.SAPBroadphase: 推荐使用.但是在如果有物体在以很快的速度穿越的时候, 就可能会产生bug
    world.broadphase = new CANNON.SAPBroadphase(world) // 一次添加100个Box的情况下, cpu占用能减少8%左右
    // 允许物体sleep: 物体低于一定速度时,会认为是sleep状态的, 则不会计算sleep状态和其他物体的碰撞
    world.allowSleep = true // 一次添加100个Box的情况下, cpu占用能减少15%左右

    // material
    // const concretMaterial = new CANNON.Material('concret') // 混泥土材质
    // const plasticMaterial = new CANNON.Material('plastic') // 塑料材质
    const defaultMaterial = new CANNON.Material('default')

    // const concretPlasticContactMaterial = new CANNON.ContactMaterial(concretMaterial, plasticMaterial, {
    //   friction: 0.1, // 摩擦力,
    //   restitution: 0.7 // 恢复系数
    // }) // 接触材质
    const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
      friction: 0.1, // 摩擦力,
      restitution: 0.7 // 恢复系数
    }) // 接触材质
    world.addContactMaterial(defaultContactMaterial)
    world.defaultContactMaterial = defaultContactMaterial // 设置物理设置中物体的默认碰撞材质

    // sphere
    // const sphereShape = new CANNON.Sphere(0.5)
    // const sphereBody = new CANNON.Body({
    //   mass: 1,
    //   shape: sphereShape,
    //   position: new CANNON.Vec3(0, 3, 0)
    //   // material: plasticMaterial
    // })
    // 添加只会影响sphere的局部坐标系的力
    // 第一个参数force: 力的方向和大小 第二个参数localPoint代表施加力的点相对于物体局部坐标系原点的位置,也可以理解为相对于物体的受力点
    // sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
    // world.addBody(sphereBody)

    // floor
    const floorShape = new CANNON.Plane()
    const floorBody = new CANNON.Body({
      mass: 0, // 为0时, 这个shape是static
      shape: floorShape
      // material: concretMaterial
    })
    // 第一个参数设置旋转的轴和方向, 第二个是旋转的弧度
    // 一定要把plane的正面朝向物体(默认朝着z轴), 因为plane的背面是无限的(可以理解为是地下)
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2)
    world.addBody(floorBody)

    /**
     * Test sphere
     */
    // const sphere = new THREE.Mesh(
    //   new THREE.SphereGeometry(0.5, 32, 32),
    //   new THREE.MeshStandardMaterial({
    //     metalness: 0.3,
    //     roughness: 0.4,
    //     envMap: environmentMapTexture,
    //     envMapIntensity: 0.5
    //   })
    // )
    // sphere.castShadow = true
    // sphere.position.y = 0.5
    // scene.add(sphere)

    /**
     * Floor
     */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
      })
    )
    floor.receiveShadow = true
    floor.rotation.x = -Math.PI * 0.5
    scene.add(floor)

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
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
    camera.position.set(-3, 3, 3)
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
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const objectsToUpdate = []
    const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
    const sphereMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.9,
      roughness: 0.1,
      envMap: environmentMapTexture
    })
    const createSphere = (radius, position) => {
      // threejs sphere
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      sphere.scale.set(radius, radius, radius)
      sphere.castShadow = true
      sphere.position.copy(position)
      scene.add(sphere)

      // physic sphere
      const sphereShape = new CANNON.Sphere(radius)
      const sphereBody = new CANNON.Body({
        shape: sphereShape,
        mass: 1
      })
      sphereBody.position.copy(position)
      sphereBody.addEventListener('collide', playSound)
      world.addBody(sphereBody)

      // push to objectsToUpdate
      objectsToUpdate.push({
        mesh: sphere,
        body: sphereBody
      })
    }
    createSphere(0.5, { x: 0, y: 3, z: 0 })
    // createSphere(0.5, { x: 2, y: 4, z: 0 })
    // createSphere(0.5, { x: -2, y: 1, z: 1 })

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
    const boxMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.9,
      roughness: 0.1,
      envMap: environmentMapTexture
    })
    const createBox = (width, height, depth, position) => {
      // threejs box
      const box = new THREE.Mesh(boxGeometry, boxMaterial)
      box.scale.set(width, height, depth)
      box.castShadow = true
      box.position.copy(position)
      scene.add(box)

      // physic box
      const boxShape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
      const boxBody = new CANNON.Body({
        shape: boxShape,
        mass: 1
      })
      boxBody.position.copy(position)
      boxBody.addEventListener('collide', playSound)
      world.addBody(boxBody)

      // push to objectsToUpdate
      objectsToUpdate.push({
        mesh: box,
        body: boxBody
      })
    }

    // createBox(1, 1, 1, { x: 0, y: 3, z: 0 })

    /**
     * Animate
     */
    const clock = new THREE.Clock()
    let lastElapsedTime = 0

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = elapsedTime - lastElapsedTime
      lastElapsedTime = elapsedTime

      // update physic world

      // apply force
      // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

      /**
       * dt Number: The fixed time step size to use.
       * [timeSinceLastCalled] Number optional: The time elapsed since the function was last called.
       * [maxSubSteps=10] Number optional: Maximum number of fixed steps to take per function call.
       */
      world.step(1 / 60, deltaTime, 3)

      // update physic sphere to threejs sphere
      // sphere.position.copy(sphereBody.position)

      objectsToUpdate.forEach((o) => {
        o.mesh.position.copy(o.body.position)
        o.mesh.quaternion.copy(o.body.quaternion)
      })

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
