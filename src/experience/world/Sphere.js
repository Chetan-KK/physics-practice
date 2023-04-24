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

        this.debugProperties.spawnPosition = { x: 0, z: 0 };
        this.debugProperties.height = 3;
        this.debugProperties.size = .5;
        this.debugProperties.controlSpeed = .1;
        this.debugProperties.force = 1000;

        this.i = 100;
        this.flashStrength = 100;

        this.setDebug();

        this.spaceSize = spaceSize;

        this.limit = { positive: this.spaceSize, nigative: -this.spaceSize };
        this.setSpawnPosView();

        this.buttons();
    }

    setDebug() {
        if (this.debug.active) {

            this.uiFolder = this.debug.ui.addFolder("sphere");

            this.debugProperties.createSphere = () => {

                const radius = this.debugProperties.size;


                const randomX = this.debugProperties.spawnPosition.x;
                const randomZ = this.debugProperties.spawnPosition.z;
                this.setSphere(radius, { x: randomX, y: this.debugProperties.height, z: randomZ });
                this.setPhysics(radius, { x: randomX, y: this.debugProperties.height, z: randomZ });
            };
            this.uiFolder.add(this.debugProperties, 'createSphere');



            this.uiFolder.add(this.debugProperties.spawnPosition, "x").min(-20).max(20).name("spawn x").step(.1).onChange(() => {
                this.circle.position.x = this.debugProperties.spawnPosition.x;
            });
            this.uiFolder.add(this.debugProperties.spawnPosition, "z").min(-20).max(20).name("spawn z").step(.1).onChange(() => {
                this.circle.position.z = this.debugProperties.spawnPosition.z;
            });
            this.uiFolder.add(this.debugProperties, "height").min(0).max(20).name("spawn height").step(.1).onChange(() => {
                this.circle.position.y = this.debugProperties.height;
            });

            this.debugs();
        }
    }
    setSpawnPosView() {
        this.circleGeometry = new THREE.RingGeometry(.9, 1, 32, 32);
        this.circle = new THREE.Mesh(this.circleGeometry, new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0xff0000
        }));

        console.log(this.debugProperties);

        this.circle.position.set(this.debugProperties.spawnPosition.x, this.debugProperties.height, this.debugProperties.spawnPosition.z);

        this.scene.add(this.circle);



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

        this.forceVec3 = new CANNON.Vec3(0, 0, -this.debugProperties.force);

        this.body.applyForce(this.forceVec3, new Vec3(0, 0, 0));
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

        this.uiFolder.add(this.debugProperties, "size").min(.1).max(2).step(.1).name("size");
        this.uiFolder.add(this.debugProperties, "controlSpeed").min(.1).max(2).step(.001).name("control speed");
        this.uiFolder.add(this.debugProperties, "force").min(500).max(5000).step(1).name("force");
    }
    reset() {
        for (const object of this.objects) {
            this.physics.world.remove(object.body);
            this.scene.remove(object.sphere);
        }
    }
    buttons() {
        window.addEventListener('keydown', (e) => {
            if (e.key == "w" || e.key == "W") {
                this.debugProperties.spawnPosition.z -= this.debugProperties.controlSpeed;
                this.circle.position.z -= this.debugProperties.controlSpeed;
            }
            if (e.key == "s" || e.key == "S") {
                this.debugProperties.spawnPosition.z += this.debugProperties.controlSpeed;
                this.circle.position.z += this.debugProperties.controlSpeed;
            }
            if (e.key == "a" || e.key == "A" || e.key == "ArrowLeft") {
                this.debugProperties.spawnPosition.x -= this.debugProperties.controlSpeed;
                this.circle.position.x -= this.debugProperties.controlSpeed;
            }
            if (e.key == "d" || e.key == "D" || e.key == "ArrowRight") {
                this.debugProperties.spawnPosition.x += this.debugProperties.controlSpeed;
                this.circle.position.x += this.debugProperties.controlSpeed;
            }

            if (e.key == 'ArrowDown') {
                this.debugProperties.height -= this.debugProperties.controlSpeed;
                this.circle.position.y -= this.debugProperties.controlSpeed;

            }
            if (e.key == 'ArrowUp') {
                this.debugProperties.height += this.debugProperties.controlSpeed;
                this.circle.position.y += this.debugProperties.controlSpeed;

            }

        });
        window.addEventListener('keydown', (e) => {
            if (e.key == " ") {
                this.debugProperties.createSphere();
            }
        });
    }
    updateSpaceSize(size) {
        this.limit = { positive: size, nigative: -size };
    }

}