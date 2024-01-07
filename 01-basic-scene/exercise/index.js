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
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('.webgl')
})
renderer.setSize(window.innerWidth, window.innerHeight)

renderer.render(scene, camera)
