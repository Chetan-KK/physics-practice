import * as THREE from 'three';
import Experience from './Experience';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera {
    constructor () {
        this.experience = new Experience();
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;

        this.setInstance();
        this.setControls();
    }
    setInstance() {
        this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height);
        this.instance.position.set(0, 8, 12);
        this.scene.add(this.instance);
    }
    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
    }
    resized() {
        this.instance.aspect = this.sizes.aspect;
        this.instance.updateProjectionMatrix();
    }
    update() {
        this.controls.update();
    }
}