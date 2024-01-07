import './App.css'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
// import Demo from './components/01-basic-scene'
// import Demo from './components/02-transform-objects'
// import Demo from './components/03-object-group'
// import Demo from './components/04-animation'
// import Demo from './components/05-camera'
// import Demo from './components/06-fullsceen-and-resizing'
// import Demo from './components/07-geometry'
// import Demo from './components/08-debug-ui'
// import Demo from './components/09-texture'
// import Demo from './components/10-materials'
// import Demo from './components/11.3d-text'
// import Demo from './components/12-lights'
// import Demo from './components/13-shadow'
// import Demo from './components/14-haunted-house'
// import Demo from './components/15-particles'
// import Demo from './components/16-galaxy-generator'
// import Demo from './components/17-scroll-based-animation'
// import Demo from './components/18-physics'
// import Demo from './components/19-load-models'
// import Demo from './components/20-raycaster'
// import Demo from './components/21-blender'
// import Demo from './components/22-realistic-render'
// import Demo from './components/23-code-structuring'
// import Demo from './components/24-shader'
// import Demo from './components/25-shader-patterns'
// import Demo from './components/26-raging-sea'
// import Demo from './components/27-animated-galaxy'
// import Demo from './components/28-modified-material'
// import Demo from './components/29-post-processing'
// import Demo from './components/30-performance-tips'
// import Demo from './components/31-better-intro-and-html-loading'
// import Demo from './components/32-mixing-html-and-webgl'
// import Demo from './components/33-importing-and-optimizing-the-scene'
// import Demo from './components/34-first-react-three-fiber-application'
// import Demo from './components/35-r3f-and-drei'
// import Demo from './components/36-debug'
// import Demo from './components/37-environment-and-staging'
// import Demo from './components/38-load-models'
// import Demo from './components/39-3D-text'
// import Demo from './components/40-portal-scene'
// import Demo from './components/41-mouse-events'
// import Demo from './components/42-post-processing'
// import Demo from './components/43-fun-and-simple-portfolio'
import Demo from './components/44-physics'

function App() {
  return (
    <div className="app-container">
      <canvas className="webgl"></canvas>

      <Canvas
        // flat // use THREE.NoToneMapping
        // linear // use LinearSRGBColorSpace
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping, // 亮度映射算法
          outputColorSpace: THREE.SRGBColorSpace // 输出颜色空间
        }}
        camera={{
          near: 0.01,
          far: 200,
          fov: 60,
          position: [3, 2, 6]
        }}
        // onCreated={(state) => {
        //   // state.gl.setClearColor('red')
        //   state.scene.background = new THREE.Color('red')
        // }}
        shadows={true}
      >
        <Demo />
      </Canvas>
    </div>
  )
}

export default App
