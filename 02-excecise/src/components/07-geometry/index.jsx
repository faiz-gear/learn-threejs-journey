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
    // 三维中所有的物体都是有点\线\三角面构成的, 比如BoxGeometry都是由verticles(顶点, 顶点上又包含uv\normal法线\颜色等)组成,顶点相连构成triangle(三角面), 两个三角面构成一个平面
    // 设置segments会有更多的片段,也会有更多的三角面,细节会更多
    // const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1)

    // const geometry = new THREE.Geometry()  Geometry已经废弃

    const count = 50 // 三角面个数
    // 存储vertices的position
    // const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]) // [x1, y1, z1, x2, y2, y3...]
    const positionsArray = new Float32Array(count * 3 * 3) // [x1, y1, z1, x2, y2, y3...]
    for (let i = 0; i < count * 3 * 3; i++) {
      positionsArray[i] = Math.random() - 0.5
    }
    const positionAttribute = new THREE.BufferAttribute(positionsArray, 3)

    // 缓冲几何体, 更易于gpu去计算和渲染,性能更高
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', positionAttribute)

    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000) // fov\aspect ratio\near\far

    camera.position.y = 0
    camera.position.z = 5
    camera.position.x = 0
    camera.lookAt(mesh.position)
    scene.add(camera)

    const controls = new OrbitControls(camera, canvas)
    // controls.enabled =  false
    controls.enableDamping = true // 开启阻尼,这样在转动或拖拽时有停下来的效果(注意需要在每一帧之前update controls)
    // controls.target.y = 2 // 设置相机lookat的position, 也是设置control的中心点(如旋转的时候的中心点, 会影响control的交互行为, 不推荐设置)
    // controls.update()

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 设置renderer的设备像素比为1-2之间,防止在一些高像素比设备上给gpu带来性能问题

    renderer.render(scene, camera)

    // const clock = new THREE.Clock()
    const tick = () => {
      // update controls
      controls.update()

      renderer.render(scene, camera)
      requestAnimationFrame(tick)
    }
    tick()

    // resize
    const onResize = () => {
      // update camera
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix() // 这样才能更新相机

      // update renderer
      renderer.setSize(window.innerWidth, window.innerHeight)
      // 让用户在切换屏幕的时候也能够根据不同的设备像素比切换,以达到良好的显示效果
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 设置renderer的设备像素比为1-2之间,防止在一些高像素比设备上给gpu带来性能问题
    }
    window.addEventListener('resize', onResize)

    // fullscreen
    window.addEventListener('dblclick', () => {
      const fullscreenElement = document.fullscreenElement || document.webkitFullScreenElement
      if (!fullscreenElement) {
        canvas?.requestFullscreen()
        canvas?.webkitRequestFullscreen()
      } else {
        document?.exitFullscreen()
        document?.webkitExitFullScreen()
      }
    })
  })

  return <div>Demo</div>
})

export default Demo
