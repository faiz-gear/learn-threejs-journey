import { memo, useEffect } from 'react'
import * as THREE from 'three'

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
    camera.position.x = 0
    camera.position.z = 10

    scene.add(camera)

    // console.log('distance between the mesh and the center of scene', mesh.position.length())

    // console.log(
    //   'distance between the mesh and any THREE.Vector3, such as camera.position',
    //   mesh.position.distanceTo(camera.position)
    // )

    // // 会将网格直线移动到离场景中心距离为1的位置
    // mesh.position.normalize()
    // console.log('distance between the mesh and the center of scene after normalized', mesh.position.length())

    const axisHelper = new THREE.AxesHelper(10)
    scene.add(axisHelper)

    // mesh.position.x = 1
    // mesh.position.y = 0
    // mesh.position.z = 1
    mesh.position.set(5, 0, 1)

    mesh.scale.set(3, 2, 2)

    /**
     * 应用旋转的顺序。默认为“XYZ”，这意味着对象将首先绕其 X 轴旋转，然后绕其 Y 轴，最后绕其 Z 轴。其他可能性是：“YZX”、“ZXY”、“XZY”、“YXZ”和“ZYX”。这些必须是大写的。
     */
    mesh.rotation.order = 'YXZ'
    mesh.rotation.x = Math.PI / 4
    mesh.rotation.y = (Math.PI * 10) / 180

    // 让摄像头看向某个Vector3 向量
    // camera.lookAt(new THREE.Vector3(1, 0, 0))
    camera.lookAt(mesh.position)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('.webgl')
    })
    renderer.setSize(window.innerWidth, window.innerHeight)

    renderer.render(scene, camera)
  })

  return <div>Demo</div>
})

export default Demo
