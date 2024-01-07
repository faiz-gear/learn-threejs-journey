import { memo, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

// post-processing: 后处理
// 大致过程: renderer --> effect compose --> 屏幕上渲染
// 过程: 原来的renderer --> render target(根据render结果生成纹理) --> render target添加组合renderPass(effect) --> 生成结合了effect的纹理 --> 渲染在屏幕上
const Demo = memo(() => {
  useEffect(() => {
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
     * Loaders
     */
    const gltfLoader = new GLTFLoader()
    const cubeTextureLoader = new THREE.CubeTextureLoader()
    const textureLoader = new THREE.TextureLoader()

    /**
     * Update all materials
     */
    const updateAllMaterials = () => {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMapIntensity = 2.5
          child.material.needsUpdate = true
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }

    /**
     * Environment map
     */
    const environmentMap = cubeTextureLoader.load([
      '/textures/environmentMaps/0/px.jpg',
      '/textures/environmentMaps/0/nx.jpg',
      '/textures/environmentMaps/0/py.jpg',
      '/textures/environmentMaps/0/ny.jpg',
      '/textures/environmentMaps/0/pz.jpg',
      '/textures/environmentMaps/0/nz.jpg'
    ])

    scene.background = environmentMap
    scene.environment = environmentMap

    /**
     * Models
     */
    gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
      gltf.scene.scale.set(2, 2, 2)
      gltf.scene.rotation.y = Math.PI * 0.5
      scene.add(gltf.scene)

      updateAllMaterials()
    })

    /**
     * Lights
     */
    const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.normalBias = 0.05
    directionalLight.position.set(0.25, 3, -2.25)
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
    camera.position.set(4, 1, -4)
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.physicallyCorrectLights = true
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ReinhardToneMapping
    renderer.toneMappingExposure = 1.5
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    /**
     * Effect Composer
     */
    /* ---------------------------- 没有添加renderTarget,  effectComposer就会默认生成一个renderTarget, colorSpace默认值为NoColorSpace, 颜色会变暗--------------------------- */
    // https://threejs.org/docs/index.html?q=render#api/en/renderers/WebGLRenderTarget
    const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
      // colorSpace: THREE.SRGBColorSpace, // 新版本设置不生效, 需要设置添加GammaCorrectionShader伽马校正着色器
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
      // samples: 10 // 采样率, 原来使用WebGlMultisampleRenderTarget可以解决WebGLRenderTarget抗锯齿问题, 现在WebGLRenderTarget不会有抗锯齿问题, 提高samples可以提升渲染质量
    }) // 缓冲区, 对进行后处理后的渲染图像绘制像素
    const effectComposer = new EffectComposer(renderer, renderTarget)
    effectComposer.setSize(sizes.width, sizes.height)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // effect
    // first pass: 最基本渲染效果
    const renderPass = new RenderPass(scene, camera)
    effectComposer.addPass(renderPass)

    const dotScreenPass = new DotScreenPass()
    dotScreenPass.enabled = false
    effectComposer.addPass(dotScreenPass)

    // 故障效果
    const glitchPass = new GlitchPass()
    glitchPass.goWild = false // 一直故障
    glitchPass.enabled = false
    effectComposer.addPass(glitchPass)

    // 颜色转换效果
    const rgbShiftPass = new ShaderPass(RGBShiftShader)
    rgbShiftPass.enabled = false
    effectComposer.addPass(rgbShiftPass)

    // must be added after the render pass
    // 伽马校正着色器effect
    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
    gammaCorrectionPass.enabled = true
    effectComposer.addPass(gammaCorrectionPass)

    const unrealBloomPass = new UnrealBloomPass()
    unrealBloomPass.strength = 0.3
    unrealBloomPass.radius = 1
    unrealBloomPass.threshold = 0.6
    gui.add(unrealBloomPass, 'enabled')
    gui.add(unrealBloomPass, 'strength', 0.0, 2.0, 0.001)
    gui.add(unrealBloomPass, 'radius', 0.0, 2.0, 0.001)
    gui.add(unrealBloomPass, 'threshold', 0.0, 1.0, 0.001)
    effectComposer.addPass(unrealBloomPass)

    // 自定义TintShader 作为pass
    const TintShader = {
      uniforms: {
        tDiffuse: { value: null }, // 会自动把render target当前的纹理传递给tDiffuse
        uTint: { value: new THREE.Vector3() }
      },
      vertexShader: `
            varying vec2 vUv;
            void main() {
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              vUv = uv;
            }
          `,
      fragmentShader: `
            varying vec2 vUv;
            uniform sampler2D tDiffuse;
            uniform vec3 uTint;
            void main() {
              vec4 color = texture2D(tDiffuse, vUv);
              color.rgb += uTint.xyz;
              gl_FragColor = color;
            }
          `
    }
    const tintShaderPass = new ShaderPass(TintShader)
    gui.add(tintShaderPass.material.uniforms.uTint.value, 'x', -1, 1, 0.001)
    gui.add(tintShaderPass.material.uniforms.uTint.value, 'y', -1, 1, 0.001)
    gui.add(tintShaderPass.material.uniforms.uTint.value, 'z', -1, 1, 0.001)
    effectComposer.addPass(tintShaderPass)

    // DisplacementShader 作为pass
    const DisplacementShader = {
      uniforms: {
        tDiffuse: { value: null }, // 会自动把render target当前的纹理传递给tDiffuse
        uNormalMap: { value: null }
        // uTime: 0
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vUv = uv;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D tDiffuse;
        uniform sampler2D uNormalMap;
        // uniform float uTime;
        void main() {
          // vec2 newUv = vec2(
          //   vUv.x,
          //   vUv.y + sin(vUv.x * 10.0 + uTime) * 0.05
          // );
          vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
          vec2 newUv = vUv + normalColor.xy * 0.1;
          vec4 color = texture2D(tDiffuse, newUv);

          vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0));
          float light = dot(normalColor, lightDirection);
          light = clamp(light, 0.0, 1.0);
          color.rgb += light;
          gl_FragColor = color;
        }
      `
    }
    const displacementShaderPass = new ShaderPass(DisplacementShader)
    displacementShaderPass.material.uniforms.uNormalMap.value = textureLoader.load('/textures/interfaceNormalMap.png')
    effectComposer.addPass(displacementShaderPass)

    // 用来解决在低版本不支持webgl的浏览器中的锯齿问题
    // const smaaPass = new SMAAPass()
    // effectComposer.addPass(smaaPass)

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      // displacementShaderPass.material.uniforms.uTime.value = elapsedTime

      // Update controls
      controls.update()

      // Render
      // renderer.render(scene, camera)
      effectComposer.render() // 使用
      effectComposer.setSize(sizes.width, sizes.height)

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
