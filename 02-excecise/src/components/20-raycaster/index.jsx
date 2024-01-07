import { memo, useEffect } from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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

    /**
     * Objects
     */
    const object1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: '#ff0000' })
    )
    object1.position.x = -2

    const object2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: '#ff0000' })
    )

    const object3 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: '#ff0000' })
    )
    object3.position.x = 2

    scene.add(object1, object2, object3)

    /**
     * Raycaster
     */
    const raycaster = new THREE.Raycaster()
    // origin:发出射线的原点 direction: 射线的方向
    // const raycasterOrigin = new THREE.Vector3(-3, 0, 0)
    // const raycasterDirection = new THREE.Vector3(10, 0, 0)
    // raycasterDirection.normalize() // 只需要代表方向, 归一化
    // raycaster.set(raycasterOrigin, raycasterDirection)
    // const intersect = raycaster.intersectObject(object2) // 返回的是一个Intersection数组, 射线可能穿过一个对象多次,比如Torus
    // console.log('🚀 ~ file: index.jsx ~ line 53 ~ useEffect ~ intersect', intersect)
    // const intersects = raycaster.intersectObjects([object1, object2, object3])
    // console.log('🚀 ~ file: index.jsx ~ line 55 ~ useEffect ~ intersects', intersects)

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
    camera.position.z = 3
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

    /**
     * Mouse
     */
    const mouse = new THREE.Vector2()
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / sizes.width) * 2 - 1
      const y = -((e.clientY / sizes.height) * 2 - 1)
      mouse.set(x, y)
    })

    window.addEventListener('click', () => {
      if (currentIntersect) {
        console.log('click object', currentIntersect.object)
      }
    })

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const objects = [object1, object2, object3]
    let currentIntersect = null
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      // cast a ray 发射光线
      // mouse必须要是一个x和y归一化-1到1的值
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(objects)
      objects.forEach((object) => object.material.color.set('#f00'))
      intersects.forEach((intersect) => intersect.object.material.color.set('#00f'))
      if (intersects.length) {
        if (!currentIntersect) {
          console.log('mouse enter')
        }
        currentIntersect = intersects[0]
      } else {
        if (currentIntersect) {
          console.log('mouse leave')
        }
        currentIntersect = null
      }

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
