import Experience from "../Experience";
import * as THREE from 'three';

export default class environment {
    constructor () {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources.items;

        this.setSunLight();
        this.setEnvironmentMap();
    }
    setSunLight() {
        this.sunLight = new THREE.DirectionalLight(0xffffff);
        this.sunLight.position.set(3.5, 2, -1.5);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.normalBias = 0.05;

        this.scene.add(this.sunLight);
    }
    setEnvironmentMap() {
        this.environmentMap = {
            texture: this.resources.environmentMapTexture,
            intensity: 0.2
        };
        this.environmentMap.texture.encoding = THREE.sRGBEncoding;

        this.scene.environment = this.environmentMap.texture;
        this.scene.background = this.environmentMap.texture;

        this.environmentMap.updateMaterials = () => {
            this.scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    // child.material.envMap = this.environmentMap.texture;
                    // child.material.envMapIntensity = this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            });
        };
        this.environmentMap.updateMaterials();

    }
}