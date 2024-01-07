import { memo, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const Demo = memo(() => {
  useEffect(() => {
    console.log(THREE)

    // canvas
    const canvas = document.querySelector('.webgl')

    // Scene
    const scene = new THREE.Scene()

    // Mesh
    // 三维中所有的物体都是有点\线\三角面构成的, 比如BoxGeometry都是由verticles(顶点, 顶点上又包含uv\normal法线\颜色等)组成,顶点相连构成triangle(三角面), 两个三角面构成一个平面
    // 设置segments会有更多的片段,也会有更多的三角面,细节会更多
    const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)

    /** 方案1 */
    // const image = new Image()
    // const texture = new THREE.Texture(image)
    // image.src = '/door/Door_Wood_001_basecolor.jpg'
    // image.onload = () => {
    //   texture.needsUpdate = true
    // }
    /** 方案2(原理是方案1) */
    const loadingManager = new THREE.LoadingManager()
    const textureLoader = new THREE.TextureLoader(loadingManager)
    loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
      console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.')
    }
    loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
      console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.')
    }
    loadingManager.onLoad = function () {
      console.log('Loading complete!')
    }
    loadingManager.onError = function (url) {
      console.log('There was an error loading ' + url)
    }
    // geometry除了有verticel顶点(vector 3),还会有uv(vector 2), uv决定了如何把纹理换算到几何体中渲染
    const colorTexture = textureLoader.load('/textures/door/Door_Wood_001_basecolor.jpg')
    const opacityTexture = textureLoader.load('/textures/door/Door_Wood_001_opacity.jpg')
    const heightTexture = textureLoader.load('/textures/door/Door_Wood_001_height.jpg')
    const normalTexture = textureLoader.load('/textures/door/Door_Wood_001_normal.jpg')
    const ambientOcclusionTexture = textureLoader.load('/textures/door/Door_Wood_001_ambientOcclusion.jpg')
    const metallicTexture = textureLoader.load('/textures/door/Door_Wood_001_metallic.jpg')
    const roughnessTexture = textureLoader.load('/textures/door/Door_Wood_001_roughness.jpg')
    const checkerboardBigTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
    const checkerboardSmallTexture = textureLoader.load('/textures/checkerboard-8x8.png')

    // colorTexture.repeat.x = 2
    // colorTexture.repeat.y = 2

    // colorTexture.wrapS = THREE.RepeatWrapping
    // colorTexture.wrapT = THREE.RepeatWrapping
    // colorTexture.wrapS = THREE.MirroredRepeatWrapping // 镜像重复
    // colorTexture.wrapT = THREE.MirroredRepeatWrapping // 镜像重复

    // colorTexture.offset.x = 0.1 // 偏移纹理
    // colorTexture.offset.y = 0.1

    // texture是一个平面, 只需要绕着一个轴进行旋转
    // colorTexture.rotation = Math.PI / 4
    // colorTexture.center.x = 0.5
    // colorTexture.center.y = 0.5

    // 设置纹理颜色采样方式
    /**
     * midmap
     * 核心思想: 远处用分辨率较低的纹理，近处用分辨率较大的纹理
     * threejs会根据原始纹理图,生成一系列由大到小的纹理图, 每一幅问理由是前一幅尺寸的1/2, 知道尺寸缩小的1*1
     */

    /**
     * minFilter
     *  使用场景: 大纹理贴到小空间, 如1024*1024到16*16, 相当于纹理缩小
     * */
    // checkerboardBigTexture.minFilter = THREE.NearestFilter // 颜色过渡更突兀,产生锯齿
    // checkerboardBigTexture.minFilter = THREE.LinearMipmapLinearFilter // 颜色过渡更光滑, 默认值
    /**
     * magFilter
     *  使用场景: 小纹理贴到大空间,  如16*16到1024*1024, 相当于纹理拉大
     */
    // checkerboardSmallTexture.magFilter = THREE.NearestFilter // 最近点采样
    checkerboardSmallTexture.magFilter = THREE.LinearFilter // 线性采样, 默认值

    const material = new THREE.MeshBasicMaterial({ map: checkerboardSmallTexture })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000) // fov\aspect ratio\near\far

    camera.position.y = 0
    camera.position.z = 2
    camera.position.x = 0
    // camera.lookAt(mesh.position)
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
  }, [])

  return <div>Demo</div>
})

export default Demo
