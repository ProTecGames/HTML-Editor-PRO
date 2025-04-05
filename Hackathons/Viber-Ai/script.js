// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#threejs-canvas'),
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 1;

// Add Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.1, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(600));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(300).fill().forEach(addStar);

// Parallax Scroll
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  camera.position.z = 1 + scrollY * 0.005; // Adjust speed here
});

// Handle Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  scene.rotation.y += 0.0005;
  scene.rotation.x += 0.0002;
  renderer.render(scene, camera);
}
animate();
