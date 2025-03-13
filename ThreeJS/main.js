// File: src/main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './style.css';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create planets and their orbits
const planetData = [
  { name: 'Mercury', radius: 0.5, distance: 10, color: 0x888888, speed: 0.01 },
  { name: 'Venus', radius: 0.8, distance: 15, color: 0xffa500, speed: 0.007 },
  { name: 'Earth', radius: 1, distance: 20, color: 0x0000ff, speed: 0.005 },
  { name: 'Mars', radius: 0.7, distance: 25, color: 0xff0000, speed: 0.003 },
];

const planets = planetData.map(planet => {
  // Create planet
  const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: planet.color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = planet.distance;
  scene.add(mesh);
  
  // Create orbit path
  const orbitGeometry = new THREE.BufferGeometry();
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
  const orbitPoints = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    orbitPoints.push(new THREE.Vector3(Math.cos(angle) * planet.distance, 0, Math.sin(angle) * planet.distance));
  }
  orbitGeometry.setFromPoints(orbitPoints);
  const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
  scene.add(orbit);

  return { mesh, ...planet };
});

// Position camera
camera.position.set(50, 30, 50);
camera.lookAt(scene.position);

// Add some ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate planets around the Sun
  planets.forEach(planet => {
    const angle = Date.now() * planet.speed;
    planet.mesh.position.x = Math.cos(angle) * planet.distance;
    planet.mesh.position.z = Math.sin(angle) * planet.distance;
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});