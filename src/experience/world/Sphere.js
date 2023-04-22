import CANNON, { Vec3 } from "cannon";
import * as THREE from 'three';
import Experience from "../Experience";

export default class Sphere {
    constructor (spaceSize) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources.items;
        this.physics = this.experience.physics;
        this.debug = this.experience.debug;

        this.debugProperties = {};
        this.objects = [];

        this.i = 100;
        this.flashStrength = 100;

        this.setDebug();

        this.limit = { positive: this.spaceSize, nigative: -this.spaceSize };

    }
    setDebug() {
        if (this.debug.active) {

            this.uiFolder = this.debug.ui.addFolder("sphere");

            this.debugProperties.height = 3;



            this.debugProperties.createSphere = () => {
                const radius = Math.random() * .5;
                const randomX = Math.random() - .5;
                const randomZ = Math.random() - .5;
                this.setSphere(radius, { x: randomX, y: this.debugProperties.height, z: randomZ });
                this.setPhysics(radius, { x: randomX, y: this.debugProperties.height, z: randomZ });
            };
            this.uiFolder.add(this.debugProperties, 'createSphere');

            this.uiFolder.add(this.debugProperties, "height").min(2).max(20).name("spawn height").step(.1);

            this.debugs();
        }
    }
    setSphere(radius, position) {
        this.geometry = new THREE.SphereGeometry(1, 16, 16);
        this.geometry.scale(radius, radius, radius);
        this.material = new THREE.MeshStandardMaterial({
            metalness: .5,
            roughness: .5
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

        // this.forceVec3 = new CANNON.Vec3(150, 0, 0);

        // this.body.applyForce(this.forceVec3, new Vec3(0, 0, 0));
    }
    updatePhysics() {

        for (const object of this.objects) {
            object.sphere.position.copy(object.body.position);
        }

        for (const object of this.objects) {
            if (object.sphere.position.x > this.limit.positive ||
                object.sphere.position.x < this.limit.nigative ||
                object.sphere.position.z > this.limit.positive ||
                object.sphere.position.z < this.limit.nigative) {
                this.physics.world.remove(object.body);
                this.scene.remove(object.sphere);
            }
        }

        if (this.i < this.flashStrength) {
            this.debugProperties.createSphere();
        }
        this.i++;

    }
    debugs() {
        this.debugProperties.flash = () => {
            this.i = 0;
        };
        this.uiFolder.add(this.debugProperties, 'flash');
        // this.uiFolder.add(this.forceVec3, "x").min(0).max(1000).step(.1).name("force X");
    }
    reset() {
        for (const object of this.objects) {
            this.physics.world.remove(object.body);
            this.scene.remove(object.sphere);
        }
    }
    updateSpaceSize(size) {
        this.limit = { positive: size, nigative: -size };
    }

}