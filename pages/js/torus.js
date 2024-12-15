import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create the WebGL renderer and append it to the container
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Set alpha to true for transparent background
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = false; // Disable shadow map to prevent shadow from appearing
document.getElementById('torus-container').appendChild(renderer.domElement);

// Create the torus geometry (black and wireframe)
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x707070, wireframe: true }); // Black and wireframe
const torus = new THREE.Mesh(geometry, material);
torus.position.y = 10; // Move the torus upwards along the Y-axis
scene.add(torus);

// Set the camera position
camera.position.z = 50;

// Create the animate function
function animate() {
    requestAnimationFrame(animate);

    // Rotate the torus
    torus.rotation.x += 0.006;
    torus.rotation.y += 0.006;

    // Render the scene with a transparent background
    renderer.render(scene, camera);
}

animate();
