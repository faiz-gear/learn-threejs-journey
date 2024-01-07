import { memo, useEffect } from 'react'
import * as THREE from 'three'

const createBox = (color) => {
  return new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color }))
}

const Demo = memo(() => {
  useEffect(() => {
    console.log(THREE)

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight) // fov\aspect ratio\near\far
    camera.position.x = 0
    camera.position.z = 10

    scene.add(camera)

    // object group
    const group = new THREE.Group()
    const cube1 = createBox(0xff0000)
    cube1.position.x = -2
    group.add(cube1)
    const cube2 = createBox(0x00ff00)
    cube2.position.x = 0
    group.add(cube2)
    const cube3 = createBox(0x0000ff)
    cube3.position.x = 2
    group.add(cube3)
    scene.add(group)
    group.position.y = 2
    group.rotation.x = Math.PI / 6

    const axisHelper = new THREE.AxesHelper(10)
    scene.add(axisHelper)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('.webgl'),
      antialias: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)

    renderer.render(scene, camera)
  })

  return <div>Demo</div>
})

export default Demo
