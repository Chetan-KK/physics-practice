import Experience from "./Experience";
import * as THREE from 'three';

export default class Renderer {
    constructor () {
        this.experience = new Experience();
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;

        this.alpha = true;

        this.setInstance();
    }
    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            // alpha: this.alpha,
            antialias: true
        });

        this.instance.useLegacyLights = true;
        this.instance.outputEncoding = THREE.sRGBEncoding;
        this.instance.toneMapping = THREE.CineonToneMapping;
        this.instance.toneMappingExposure = 1.75;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;

        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
        this.instance.render(this.scene, this.camera);
    }
    resized() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.render(this.scene, this.camera);
    }
    update() {
        this.instance.render(this.scene, this.camera);
    }
}