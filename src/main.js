// 1. Imports and Constants
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// 2. Utility Functions

//Load GLTF-file
const LoadGLTFByPath = (scene, path) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      path,
      (gltf) => {
        scene.add(gltf.scene);
        resolve(gltf);
      },
      undefined,
      (error) => {
        console.error("Error loading GLTF:", error);
        reject(error);
      }
    );
  });
};
//Update size
const updateSize = (parentElement, camera, renderer, aspect) => {
  const { width, height } = parentElement.getBoundingClientRect();
  aspect.width = width;
  aspect.height = height;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

// 3. Scene Setup
const parentElement = document.querySelector(".canvas-wrapper"); // Replace with your container
const aspect = {
  width: parentElement.clientWidth,
  height: parentElement.clientHeight,
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  //FOV (Field of View)
  70,
  aspect.width / aspect.height,
  //Near value
  0.01,
  //Far Value
  100
);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".draw"),
  antialias: true,
});
updateSize(parentElement, camera, renderer, aspect);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

// Environment
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envTexture = cubeTextureLoader.load([
  "environments/cube_right.png",
  "environments/cube_left.png",
  "environments/cube_up.png",
  "environments/cube_down.png",
  "environments/cube_back.png",
  "environments/cube_front.png",
]);
scene.environment = envTexture;
scene.background = envTexture;

// Lights
const light = new THREE.AmbientLight("white");
const directionalLight = new THREE.DirectionalLight("skyblue", 10);
scene.add(light);
scene.add(directionalLight);

// Mesh
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/bricks.png");

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  map: texture,
  roughness: 0.4,
  metalness: 0.8,
});
const mesh = new THREE.Mesh(geometry, material);
//scene.add(mesh);

// GLTF Model
let loadedBox = null;
LoadGLTFByPath(scene, "models/box.gltf")
  .then((gltf) => {
    console.log("Model loaded successfully");
    loadedBox = gltf.scene;
    loadedBox.position.set(0, -1, 0);
  })
  .catch((error) => console.error("Error loading model:", error));

// 4. Event Listeners
window.addEventListener("resize", () =>
  updateSize(parentElement, camera, renderer, aspect)
);

// 5. Animation and Render Loop
const animate = (time) => {
  mesh.rotation.x = time / 2000;
  mesh.rotation.y = time / 1000;

  // Ensure the GLTF model is loaded before applying dynamic updates
  if (loadedBox) {
    loadedBox.rotation.y += 0.01; // Rotate the loaded model around Y-axis
  }

  controls.update(); // Update OrbitControls
  renderer.render(scene, camera); // Render the scene
};

renderer.setAnimationLoop(animate); // Start the animation loop
