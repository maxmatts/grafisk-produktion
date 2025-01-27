import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { LoadGLFTByPath } from "./Helpers/ModelHelper";
import { degToRad } from "three/src/math/MathUtils.js";
//import { LoadGLFTByPath } from "./Helpers/ModelHelper";

const canvasParent = document.getElementById("canvasParent");

//SIZE
const aspect = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const updateSize = () => {
  const { width, height } = canvasParent.getBoundingClientRect();
  aspect.width = width;
  aspect.height = height;

  // Update camera aspect ratio and projection matrix
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Update renderer size
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateSize();
//Resize
window.addEventListener("resize", updateSize);

//TEXTURE LOADER
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/bricks.png");

//CUBE TEXTURE LOADER
const cubeTextureLoader = new THREE.CubeTextureLoader();

const envTexture = cubeTextureLoader.load([
  "environments/cube_right.png",
  "environments/cube_left.png",
  "environments/cube_up.png",
  "environments/cube_down.png",
  "environments/cube_back.png",
  "environments/cube_front.png",
]);

//SCENE
const scene = new THREE.Scene();

scene.environment = envTexture;
//scene.background = envTexture;

//LIGHTS
const light = new THREE.AmbientLight("white");
const directionalLight = new THREE.DirectionalLight("skyblue", 10);

/* scene.add(light);
scene.add(directionalLight); */

//MESH
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ map: texture });
//material.wireframe = true;
material.roughness = 0.4;
material.metalness = 0.8;

//material.envMap = envTexture;

const mesh = new THREE.Mesh(geometry, material);
//scene.add(mesh);

//Load GLTF
let loadedBox = null;
LoadGLFTByPath(scene)
  .then((gltf) => {
    console.log("Model loaded successfully");

    loadedBox = gltf.scene;
    //loadedBox.position.set(1, 0, 0);
    loadedBox.rotation.x = degToRad(-15);
    loadedBox.rotation.z = degToRad(-15);
    loadedBox.position.y = -1;
  })
  .catch((error) => {
    console.error("Error loading model:", error);
  });

//CAMERA
const camera = new THREE.PerspectiveCamera(
  70,
  aspect.width / aspect.height,
  0.01,
  100
);
camera.position.z = 4;
camera.lookAt(mesh);

//RENDERER
const canvas = document.querySelector(".draw");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  shadows: true,
});
renderer.setSize(aspect.width, aspect.height);
renderer.setAnimationLoop(animate);

//OrbitControls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Optional: Add damping for smoother movement
controls.dampingFactor = 0.1;

function animate(time) {
  /*  mesh.rotation.x = time / 2000;
  mesh.rotation.y = time / 1000; */
  if (loadedBox) {
    loadedBox.rotation.y = time / 1000;
  }

  renderer.render(scene, camera);
}
