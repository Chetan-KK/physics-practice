import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import EventEmitter from "events";

export default class Resources extends EventEmitter {
    constructor (sources) {
        super();
        this.sources = sources;
        this.total = sources.length;
        this.items = {};
        this.itemsCount = 0;

        this.setLoaders();
    }
    setLoaders() {
        this.textureLoader = new THREE.TextureLoader();
        this.cubeTextureLoader = new THREE.CubeTextureLoader();
        this.gltfLoader = new GLTFLoader();

        this.sources.forEach(source => {
            switch (source.type) {
                case "texture":
                    this.textureLoader.load(source.path, (item) => {
                        this.setItem(source.name, item);
                    });
                    break;
                case "cubeTexture":
                    this.cubeTextureLoader.load(source.path, (item) => {
                        this.setItem(source.name, item);
                    });
                    break;
                case "gltfModel":
                    this.gltfLoader.load(source.path, (item) => {
                        this.setItem(source.name, item);
                    });
                    break;
            }
        });
    }
    setItem(name, item) {
        this.items[name] = item;
        this.itemsCount++;

        if (this.total == this.itemsCount) {
            this.emit('loaded');
        }
    }
}