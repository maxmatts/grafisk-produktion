import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//Resize

window.addEventListener("resize", () => {
  //Update Size
  aspect.width = window.innerWidth;
  aspect.height = window.innerHeight;

  //New Aspect Ratio
  camera.aspect = aspect.width / aspect.height;
  camera.updateProjectionMatrix();

  //New RendererSize
  renderer.setSize(aspect.width, aspect.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
//SIZE
const aspect = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//TEXTURE LOADER
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/bricks.png");

//CUBE TEXTURE LOADER
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envTexture = cubeTextureLoader.load([
  "/env/cube_right.png",
  "/env/cube_left.png",
  "env/cube_up.png",
  "env/cube_down.png",
  "env/cube_back.png",
  "env/cube_front.png",
]);

//SCENE
const scene = new THREE.Scene();

scene.background = envTexture;

//LIGHTS
const light = new THREE.AmbientLight("white");
//const directionalLight = new THREE.DirectionalLight("skyblue", 10);

//MESH
const geometry = new THREE.TorusGeometry(0.8, 0.4, 12, 48);
const material = new THREE.MeshStandardMaterial({ map: texture });
//material.wireframe = true;
material.roughness = 0.4;
material.metalness = 0.8;
material.envMap = envTexture;

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
});
renderer.setSize(aspect.width, aspect.height);
renderer.setAnimationLoop(animate);

//OrbitControls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Optional: Add damping for smoother movement
controls.dampingFactor = 0.1;

function animate(time) {
  mesh.rotation.x = time / 2000;
  mesh.rotation.y = time / 1000;

  renderer.render(scene, camera);
}
