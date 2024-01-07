import { memo, useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

const Demo = memo(() => {
  useEffect(() => {
    console.log(THREE)

    // Scene
    const scene = new THREE.Scene()

    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight) // fov\aspect ratio\near\far
    camera.position.z = 10
    scene.add(camera)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('.webgl')
    })
    renderer.setSize(window.innerWidth, window.innerHeight)

    renderer.render(scene, camera)

    // animation
    let time = Date.now()
    const clock = new THREE.Clock()
    gsap.to(mesh.position, {
      x: 2,
      duration: 1
    })
    gsap.to(mesh.position, {
      x: 0,
      duration: 1,
      delay: 1
    })

    const tick = () => {
      // mesh.rotation.y += 0.01 // 方案1, 直接设置transform, 缺点:不同帧率下,旋转的速度回不一样

      // const currentTime = Date.now()
      // const delta = currentTime - time
      // time = currentTime
      // mesh.rotation.y += 0.001 * delta // 方案2, 根据时间的增量来计算旋转的增量,这样能保证每一次执行动画的增量始终是根据时间来的,不同帧率下动画频率也是一样的

      // const elapsedTime = clock.getElapsedTime() // 方案3. 通过new THREE.Clock().getElapsedTime()获取经过的时间, 从0开始
      // // mesh.rotation.y = elapsedTime * Math.PI * 2
      // mesh.position.x = Math.cos(elapsedTime)
      // mesh.position.y = Math.sin(elapsedTime)

      renderer.render(scene, camera)

      requestAnimationFrame(tick)
    }

    tick()
  }, [])

  return <div>Demo</div>
})

export default Demo
