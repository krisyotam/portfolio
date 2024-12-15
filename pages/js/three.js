import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js';

// Vertex shader for 3D effect (no changes needed here)
const vertexShader = `
    varying vec3 vPosition;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// Fragment shader for the water effect (with reduced brightness and more subtle highlights)
const fragmentShader = `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vPosition;

    // Simplex noise for better 3D effect
    vec2 hash2(vec2 p) {
        p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
        return -1.0 + 2.0 * fract(sin(p)*43758.5453123);
    }

    float noise(vec2 p) {
        const float K1 = 0.366025404;
        const float K2 = 0.211324865;

        vec2 i = floor(p + (p.x+p.y)*K1);
        vec2 a = p - i + (i.x+i.y)*K2;
        vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
        vec2 b = a - o + K2;
        vec2 c = a - 1.0 + 2.0*K2;

        vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
        vec3 n = h*h*h*h*vec3(dot(a,hash2(i+0.0)), dot(b,hash2(i+o)), dot(c,hash2(i+1.0)));

        return dot(n, vec3(70.0));
    }

    void main() {
        vec3 position = normalize(vPosition); // Normalize to create a spherical effect
        float dist = length(position.xy); // Use the distance in the XY plane for spherical distortion

        // Add depth with stronger noise and increased frequency
        float noiseTime = uTime * 0.3; // Increased time factor for faster motion
        float noiseValue = noise(vUv * 4.0 + noiseTime) * 0.05; // Increased noise value for more pronounced ripples

        // Create a spherical shape with noise
        float radius = 0.25;
        float softness = 0.1;

        float circle = smoothstep(radius + softness + noiseValue, radius - softness + noiseValue, dist);

        // Add depth and gradient for more realism
        float gradient = 1.0 - smoothstep(0.0, radius * 2.0, dist);
        float edge = smoothstep(radius - softness, radius + softness, dist);

        // Change color to mimic clear filtered water (cyan/turquoise with a slight greenish tint)
        vec3 color = vec3(0.3, 0.7, 0.8);  // Water-like light cyan color
        float alpha = circle * 0.4 * (1.0 + gradient * 0.6);  // Reduce alpha for a more subtle effect

        // Add highlights with a reduced intensity for a less lit effect
        float light = max(dot(normalize(vPosition), normalize(vec3(0.5, 1.0, 0.5))), 0.0);  // Calculate light intensity
        color += vec3(1.0, 1.0, 1.0) * light * 0.2;  // Reduced highlight intensity

        gl_FragColor = vec4(color, alpha);
    }
`;

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('liquid-canvas'),
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Using SphereGeometry to create a 3D sphere
const geometry = new THREE.SphereGeometry(1.8, 32, 32); // radius = 2
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    uniforms: {
        uTime: { value: 0 }
    }
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

camera.position.z = 3;

// Animation loop
function animate(time) {
    material.uniforms.uTime.value = time * 0.001;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
