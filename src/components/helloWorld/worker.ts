import * as Comlink from "comlink";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { toJSON, fromJSON } from "flatted";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/js/libs/draco/gltf/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
const exporter = new GLTFExporter();

let modelValue: string;

let gltf: GLTF;

async function loadModel(
  url: string,
  callback: (event: ProgressEvent) => void
): Promise<void> {
  try {
    const val = await loader.loadAsync(url, callback);
    gltf = val;
    const result = await exporter.parseAsync(val.scene, {
      animations: val.animations,
    });
    modelValue = JSON.stringify(result);
  } catch (error) {
    console.error(error);
  }
}

function getModelVal() {
  console.log(gltf.parser, "gltf.parser");
  console.log(JSON.parse(modelValue));
  return JSON.stringify(gltf.parser.json);
  // return JSON.stringify(gltf.parser.json);
  // return modelValue;
  // return modelValue;
}

Comlink.expose({ loadModel, getModelVal });
