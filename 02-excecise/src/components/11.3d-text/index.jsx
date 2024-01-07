import { memo, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

const Demo = memo(() => {
  useEffect(() => {
    // canvas
    const canvas = document.querySelector('.webgl')

    // Scene
    const scene = new THREE.Scene()

    const textParams = {
      size: 0.5,
      height: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5
    }

    const axesHelper = new THREE.AxesHelper(4)
    scene.add(axesHelper)

    /**
     * texture
     */
    const textureLoader = new THREE.TextureLoader()
    const matcapTexture = textureLoader.load('/textures/matcaps/4.png')

    /**
     * Fonts
     */
    const fontsLoader = new FontLoader()
    fontsLoader.setPath('/fonts/').load('helvetiker_regular.typeface.json', (font) => {
      // Mesh
      const textGeometry = new TextGeometry('Faiz Gear', {
        font,
        ...textParams
      })
      // 文字居中
      // 方法1
      // Bounding结果threejs会用来判断当前几何体是否需要render
      // textGeometry.computeBoundingBox() // threejs中的几何体默认生成sphere球体边界, Box边界(Box3)需要调用computeBoundingBox生成
      // const max = textGeometry.boundingBox.max
      // textGeometry.translate(-(max.x - 0.02) * 0.5, -(max.y - 0.02) * 0.5, -(max.z - 0.03) * 0.5)
      // textGeometry.computeBoundingBox()
      // console.log(textGeometry.boundingBox)

      // 方法2: textGeometry.center() 原理就是方法1
      textGeometry.center()

      const textMaterail = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture
      })

      const text = new THREE.Mesh(textGeometry, textMaterail)

      scene.add(text)
    })

    console.time()
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)
    const donutMaterial = new THREE.MeshNormalMaterial()
    for (let i = 0; i < 500; i++) {
      const donut = new THREE.Mesh(donutGeometry, donutMaterial)
      donut.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)
      donut.rotation.x = Math.random() * Math.PI
      donut.rotation.y = Math.random() * Math.PI
      const scale = Math.random()
      donut.scale.set(scale, scale, scale)
      scene.add(donut)
    }

    console.timeEnd()

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000) // fov\aspect ratio\near\far

    camera.position.y = 0
    camera.position.z = 3
    camera.position.x = 0
    scene.add(camera)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true // 开启阻尼,这样在转动或拖拽时有停下来的效果(注意需要在每一帧之前update controls)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas
    })
    renderer.setSize(window.innerWidth, window.innerHeight)

    renderer.render(scene, camera)

    // const clock = new THREE.Clock()
    const tick = () => {
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
