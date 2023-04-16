import CANNON from "cannon";
import * as THREE from 'three';
import Experience from "../Experience";

export default class Sphere {
    constructor () {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources.items;
        this.physics = this.experience.physics;
        this.debug = this.experience.debug;

        this.debugProperties = {};
        this.objects = [];

        this.setDebug();

    }
    setDebug() {
        if (this.debug.active) {

            this.uiFolder = this.debug.ui.addFolder("sphere");
            this.debugProperties.createSphere = () => {
                const radius = Math.random() * .5;
                const randomX = Math.random() - .5;
                const randomZ = Math.random() - .5;
                this.setSphere(radius, { x: randomX, y: 3, z: randomZ });
                this.setPhysics(radius, { x: randomX, y: 3, z: randomZ });
            };
            this.uiFolder.add(this.debugProperties, 'createSphere');
        }
    }
    setSphere(radius, position) {
        this.geometry = new THREE.SphereGeometry(1, 16, 16);
        this.geometry.scale(radius, radius, radius);
        this.material = new THREE.MeshStandardMaterial({
            metalness: 1,
            roughness: 0
        });

        this.sphere = new THREE.Mesh(this.geometry, this.material);

        this.sphere.castShadow = true;
        this.sphere.position.set(position);

        this.scene.add(this.sphere);

    }
    setPhysics(radius, position) {
        this.shape = new CANNON.Sphere(radius);
        this.body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0, 3, 0),
            shape: this.shape
        });

        this.body.position.copy(position);

        this.physics.world.addBody(this.body);


        this.objects.push({
            sphere: this.sphere,
            body: this.body

        });
    }
    updatePhysics() {

        for (const object of this.objects) {
            object.sphere.position.copy(object.body.position);
        }

    }


}