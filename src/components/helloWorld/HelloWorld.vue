<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import * as Comlink from 'comlink';
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { onMounted, ref, unref } from 'vue';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { inspector } from '../../editor/index.js';

interface WorkType {
  loadModel(url: string, callback?: (event: ProgressEvent) => void): Promise<void>;
  getModelVal(): string;
}

defineProps({ msg: String });

const container = ref<HTMLElement | null>(null);

let mixer: THREE.AnimationMixer;

const clock = new THREE.Clock();
const stats = new Stats();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe3dd);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(5, 2, 8);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
const obj = Comlink.wrap<WorkType>(worker);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('js/libs/draco/gltf/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load('models/gltf/Soldier.glb', function (gltf) {

  const model = gltf.scene;
  model.position.set(1, 1, 0);
  // model.scale.set(0.01, 0.01, 0.01);
  scene.add(model);
  mixer = new THREE.AnimationMixer(model);
  mixer.clipAction(gltf.animations[0]).play();

  inspector(scene);
  animate();

}, undefined, function (e) {

  console.error(e);

});


function loadGltf(gltf: GLTF) {
  if (!gltf) {
    return;
  }

  const model = gltf.scene;
  model.position.set(1, 1, 0);
  model.scale.set(0.01, 0.01, 0.01);
  scene.add(model);
  mixer = new THREE.AnimationMixer(model);
  mixer.clipAction(gltf.animations[0]).play();

  animate();
}


function animate() {

  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  mixer.update(delta);

  controls.update();

  stats.update();

  renderer.render(scene, camera);

}


window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

onMounted(async () => {
  if (container.value) {
    // unref(container)!.appendChild(stats.dom);
    unref(container)!.appendChild(renderer.domElement);
  }

  // await obj.loadModel('/models/gltf/LittlestTokyo/LittlestTokyo.gltf');

  // obj.getModelVal().then((val) => {
  //   // console.log(new URL('./worker.ts', import.meta.url));

  //   loader.parseAsync(JSON.parse(val), '/models/gltf/LittlestTokyo/').then((gltf) => {
  //     loadGltf(gltf);
  //     inspector(scene);
  //   });
  // });
});

// interface WorkType {
//   counter: number,
//   inc(): void,
// }

// async function init() {
//   alert(`Counter: ${await obj.counter}`);
//   await obj.inc();
//   alert(`Counter: ${await obj.counter}`);
// }
// init();
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
