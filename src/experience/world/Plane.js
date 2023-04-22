import * as THREE from 'three';
import CANNON, { Vec3 } from 'cannon';
import Experience from "../Experience";

export default class Plane {
    constructor (size) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources.items;
        this.physics = this.experience.physics;

        this.size = size;

        this.setPlane();
        this.setPhysics();
    }
    setPlane() {
        this.geometry = new THREE.PlaneGeometry(this.size * 2, this.size * 2);
        this.material = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            map: this.resources.dirtColorTexture,
            normalMap: this.resources.dirtNormalTexture,
        });

        this.plane = new THREE.Mesh(this.geometry, this.material);

        this.plane.receiveShadow = true;

        this.plane.rotation.x = -Math.PI / 2;

        this.scene.add(this.plane);

    }
    setPhysics() {
        this.shape = new CANNON.Plane(.3);
        this.body = new CANNON.Body({
            mass: 0,
            shape: this.shape
        });
        this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);

        this.physics.world.addBody(this.body);


    }
    updatePhysics() {
    }
    updateSpaceSize(size) {
        this.geometry.dispose();
        this.material.dispose();
        this.scene.remove(this.plane);
        this.size = size;
        this.setPlane();
    }
}