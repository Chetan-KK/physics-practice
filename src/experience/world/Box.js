import CANNON, { Vec3 } from "cannon";
import * as THREE from 'three';
import Experience from "../Experience";

export default class Box {
    constructor () {
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

    }
    setDebug() {
        if (this.debug.active) {

            this.uiFolder = this.debug.ui.addFolder("Box");


            this.debugProperties.createBox = () => {
                const w = Math.random();
                const h = Math.random();
                const d = Math.random();
                const randomX = Math.random() - .5;
                const randomZ = Math.random() - .5;
                this.setBox(w, h, d, { x: randomX, y: 3, z: randomZ });
                this.setPhysics(w, h, d, { x: randomX, y: 3, z: randomZ });
            };
            this.uiFolder.add(this.debugProperties, 'createBox');

            this.debugs();
        }
    }
    setBox(w, h, d, position) {
        this.geometry = new THREE.BoxGeometry(2, 2, 2);
        this.geometry.scale(w / 2, h / 2, d / 2);
        this.material = new THREE.MeshStandardMaterial({
            metalness: 1,
            roughness: 0
        });

        this.box = new THREE.Mesh(this.geometry, this.material);

        this.box.castShadow = true;
        this.box.position.set(position.x, position.y, position.z);

        this.scene.add(this.box);

    }
    setPhysics(w, h, d, position) {
        this.shape = new CANNON.Box(new CANNON.Vec3(w / 2, h / 2, d / 2));
        this.body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0, 3, 0),
            shape: this.shape,
        });

        this.body.position.copy(position);

        this.physics.world.addBody(this.body);

        this.objects.push({
            box: this.box,
            body: this.body
        });

        this.forceVec3 = new CANNON.Vec3(150, 0, 0);
        this.body.applyForce(this.forceVec3, new Vec3(0, 0, 0));
    }
    updatePhysics() {

        for (const object of this.objects) {
            object.box.position.copy(object.body.position);
            object.box.quaternion.copy(object.body.quaternion);
        }

        if (this.i < this.flashStrength) {
            this.debugProperties.createBox();
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


}