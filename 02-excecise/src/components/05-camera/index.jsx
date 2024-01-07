import { memo, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const Demo = memo(() => {
  useEffect(() => {
    console.log(THREE)

    // canvas
    const canvas = document.querySelector('.webgl')
    const cursor = { x: 0, y: 0 }
    canvas.addEventListener('mousemove', (e) => {
      cursor.x = e.clientX / canvas.clientWidth - 0.5
      cursor.y = e.clientY / canvas.clientHeight - 0.5
    })

    // Scene
    const scene = new THREE.Scene()

    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Camera
    // PerspectiveCamera
    // 在离camrea near到far之间距离的物体才能被看到
    // 但是near不能设置过小, 如0.00001,far不能过大,如:999999999, 这在object 位置重叠时, gpu会很难判断出应该显示哪个物体在前
    // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000) // fov\aspect ratio\near\far

    // OrthographicCamera
    // const aspectRatio = window.innerWidth / window.innerHeight
    // // aspectRatio 可以让正交相机画面的宽高比于画布一致
    // const camera = new THREE.OrthographicCamera(1 * aspectRatio, -1 * aspectRatio, 1, -1, 0.1, 1000)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000) // fov\aspect ratio\near\far

    camera.position.y = 0
    camera.position.z = 5
    camera.position.x = 0
    camera.lookAt(mesh.position)
    scene.add(camera)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true // 开启阻尼,这样在转动或拖拽时有停下来的效果(注意需要在每一帧之前update controls)
    // controls.target.y = 2 // 设置相机lookat的position, 也是设置control的中心点(如旋转的时候的中心点, 会影响control的交互行为, 不推荐设置)
    // controls.update()

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas
    })
    renderer.setSize(window.innerWidth, window.innerHeight)

    renderer.render(scene, camera)

    // const clock = new THREE.Clock()
    const tick = () => {
      // update camera
      // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
      // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
      // camera.position.y = -cursor.y * 3
      // camera.lookAt(mesh.position)

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
