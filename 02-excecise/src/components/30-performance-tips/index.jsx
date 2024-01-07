import { memo, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import Stats from 'stats.js'

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const Demo = memo(() => {
  useEffect(() => {
    /**
     * Base
     */
    // Canvas
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader()
    const displacementTexture = textureLoader.load('/textures/displacementMap.png')

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
    camera.position.set(2, 2, 6)
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      powerPreference: 'high-performance',
      antialias: true
    })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(window.devicePixelRatio)

    /**
     * Test meshes
     */
    const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshStandardMaterial())
    cube.castShadow = true
    cube.receiveShadow = true
    cube.position.set(-5, 0, 0)
    // scene.add(cube)

    const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.4, 128, 32), new THREE.MeshStandardMaterial())
    torusKnot.castShadow = true
    torusKnot.receiveShadow = true
    // scene.add(torusKnot)

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshStandardMaterial())
    sphere.position.set(5, 0, 0)
    sphere.castShadow = true
    sphere.receiveShadow = true
    // scene.add(sphere)

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial())
    floor.position.set(0, -2, 0)
    floor.rotation.x = -Math.PI * 0.5
    floor.castShadow = true
    floor.receiveShadow = true
    // scene.add(floor)

    /**
     * Lights
     */
    const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.normalBias = 0.05
    directionalLight.position.set(0.25, 3, 2.25)
    scene.add(directionalLight)

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const tick = () => {
      stats.begin()
      const elapsedTime = clock.getElapsedTime()

      // Update test mesh
      torusKnot.rotation.y = elapsedTime * 0.1

      // Update controls
      controls.update()

      // Render
      renderer.render(scene, camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)

      stats.end()
    }

    tick()

    /**
     * Tips
     */

    // Tip 3 使用spector.js chrome dev tools, 查看GPU draw call的次数, 越少性能越高

    // // Tip 4
    console.log(renderer.info)

    // Tip 5 good js code

    // // Tip 6
    // scene.remove(cube)
    // cube.geometry.dispose()
    // cube.material.dispose()

    // Tip7 avoid lights.if need, choose cheap lights like ambientLight\directionalLight, hemisphereLight
    // Tip8 avoid remove or add light.if did this, all materials supporting lights will be recompiled
    // Tip9 avoid shadows.use Baked shadows

    // Tip 10
    directionalLight.shadow.camera.top = 3
    directionalLight.shadow.camera.right = 6
    directionalLight.shadow.camera.left = -6
    directionalLight.shadow.camera.bottom = -3
    directionalLight.shadow.camera.far = 10
    directionalLight.shadow.mapSize.set(1024, 1024)

    // const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
    // scene.add(cameraHelper)

    // Tip 11
    cube.castShadow = true
    cube.receiveShadow = false

    torusKnot.castShadow = true
    torusKnot.receiveShadow = false

    sphere.castShadow = true
    sphere.receiveShadow = false

    floor.castShadow = false
    floor.receiveShadow = true

    // // Tip 12 关闭阴影自动更新, 可以在tick函数中手动更新(renderer.shadowMap.needsUpdate = true)
    renderer.shadowMap.autoUpdate = false
    renderer.shadowMap.needsUpdate = true

    // // Tip 18 提取geometry的创建,只需要创建一次
    // const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

    // for (let i = 0; i < 50; i++) {
    //   const material = new THREE.MeshNormalMaterial()
    //   const mesh = new THREE.Mesh(geometry, material)
    //   mesh.position.x = (Math.random() - 0.5) * 10
    //   mesh.position.y = (Math.random() - 0.5) * 10
    //   mesh.position.z = (Math.random() - 0.5) * 10
    //   mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
    //   mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

    //   scene.add(mesh)
    // }

    // Tip 19 如果geometry不需要移动,可以通过merge多个geometry,这样GPU一次draw call就把多个geometry渲染了,提升性能

    // const geometries = []
    // for (let i = 0; i < 50; i++) {
    //   const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    //   geometry.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)
    //   geometry.rotateX((Math.random() - 0.5) * Math.PI * 2)
    //   geometry.rotateY((Math.random() - 0.5) * Math.PI * 2)
    //   geometries.push(geometry)
    // }

    // // 合并
    // const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)

    // const material = new THREE.MeshNormalMaterial()
    // const mesh = new THREE.Mesh(mergedGeometry, material)
    // scene.add(mesh)

    // // Tip 20 提取material的创建
    // const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    // const material = new THREE.MeshNormalMaterial()

    // for(let i = 0; i < 50; i++)
    // {

    //     const mesh = new THREE.Mesh(geometry, material)
    //     mesh.position.x = (Math.random() - 0.5) * 10
    //     mesh.position.y = (Math.random() - 0.5) * 10
    //     mesh.position.z = (Math.random() - 0.5) * 10
    //     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
    //     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

    //     scene.add(mesh)
    // }

    // // Tip 22 instancedMesh
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

    const material = new THREE.MeshNormalMaterial()

    const mesh = new THREE.InstancedMesh(geometry, material, 50)
    mesh.instanceMatrix.usage = THREE.DynamicDrawUsage // 如果矩阵在每次tick需要经常变化, 这样设置能够提升性能

    for (let i = 0; i < 50; i++) {
      // 通过矩阵设置单个instance的位置和旋转
      const matrix = new THREE.Matrix4()

      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      )

      // 欧拉角结合quaternion设置姿态角度
      const euler = new THREE.Euler((Math.random() - 0.5) * Math.PI * 2, (Math.random() - 0.5) * Math.PI * 2, 0) // rotation属性就是一个欧拉角
      const quaternion = new THREE.Quaternion()
      quaternion.setFromEuler(euler)

      matrix.makeRotationFromQuaternion(quaternion)
      matrix.setPosition(position)
      mesh.setMatrixAt(i, matrix)
    }

    // scene.add(mesh)

    // // Tip 29 限制设备像素比最大为2
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // // Tip 31, 32, 34 and 35
    const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256)

    const shaderMaterial = new THREE.ShaderMaterial({
      precision: 'lowp', // lowp mediump highp, 降低精度
      uniforms: {
        uDisplacementTexture: { value: displacementTexture }
        // uDisplacementStrength: { value: 1.5 } // 如果除了调试之外不需要动态修改值,使用define 来定义常量比uniform性能好
      },
      defines: {
        DISPLACEMENT_STRENGTH: 1.5
      },
      vertexShader: `
            uniform sampler2D uDisplacementTexture;
            uniform float uDisplacementStrength;

            // varying vec2 vUv;
            varying vec3 vColor;

            void main()
            {
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);

                // position
                float elevation = texture2D(uDisplacementTexture, uv).r;
                // 尽量不使用if语句或三元表达式 性能低
                // if(elevation < 0.5)
                // {
                //     elevation = 0.5;
                // }
                elevation = max(elevation, 0.5);
                modelPosition.y += elevation * DISPLACEMENT_STRENGTH;
                gl_Position = projectionMatrix * viewMatrix * modelPosition;

                // color 尽量减少在fragment shader中的计算
                float colorElevation = max(elevation, 0.25);
                vec3 color = mix(vec3(1.0, 0.1, 0.1), vec3(0.1, 0.0, 0.5), elevation);

                // vUv = uv;
                vColor = color;
            }
        `,
      fragmentShader: `
            // uniform sampler2D uDisplacementTexture;

            // varying vec2 vUv;
            varying vec3 vColor;

            void main()
            {
                // float elevation = texture2D(uDisplacementTexture, vUv).r;
                // if(elevation < 0.25)
                // {
                //     elevation = 0.25;
                // }
                // elevation = max(elevation, 0.25);

                // vec3 depthColor = vec3(1.0, 0.1, 0.1);
                // vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
                // vec3 finalColor = vec3(0.0);
                // finalColor.r += depthColor.r + (surfaceColor.r - depthColor.r) * elevation;
                // finalColor.g += depthColor.g + (surfaceColor.g - depthColor.g) * elevation;
                // finalColor.b += depthColor.b + (surfaceColor.b - depthColor.b) * elevation;
                // vec3 finalColor = mix(depthColor, surfaceColor, elevation);

                // gl_FragColor = vec4(finalColor, 1.0);
                gl_FragColor = vec4(vColor, 1.0);
            }
        `
    })

    const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial)
    shaderMesh.rotation.x = -Math.PI * 0.5
    scene.add(shaderMesh)
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
