import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const scenePath = "models/box.gltf";

export const LoadGLFTByPath = (scene) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      scenePath,
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
