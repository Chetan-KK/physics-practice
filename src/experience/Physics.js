import CANNON from "cannon";
import Experience from "./Experience";

export default class Physics {
    constructor () {
        this.experience = new Experience();
        this.clock = this.experience.time.clock;
        this.debug = this.experience.debug;

        this.world = new CANNON.World();
        this.world.broadphase = new CANNON.SAPBroadphase(this.world);
        this.world.allowSleep = true;

        this.debugProperties = {
            gravityForce: -9.82
        };
        this.debugProperties.resetGravity = () => {
            this.debugProperties.gravityForce = -9.82;
            this.world.gravity.set(0, this.debugProperties.gravityForce, 0);
        };

        this.world.gravity.set(0, this.debugProperties.gravityForce, 0);

        this.oldElapsedTime = 0;

        this.setMaterials();

        this.setDebug();
    }
    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder("physics");
            this.debugFolder.add(this.debugProperties, "gravityForce").min(-55).max(10).step(.001).name("gravity").onChange(() => {
                this.world.gravity.set(0, this.debugProperties.gravityForce, 0);
            });
            this.debugFolder.add(this.debugProperties, "resetGravity");
        }
    }



    setMaterials() {
        this.defaultMaterial = new CANNON.Material('default');

        this.defaultContactMaterial = new CANNON.ContactMaterial(
            this.defaultMaterial,
            this.defaultMaterial,
            {
                friction: .1,
                restitution: .7
            }
        );
        this.world.addContactMaterial(this.defaultContactMaterial);
        this.world.defaultContactMaterial = this.defaultContactMaterial;
    }

    update() {
        this.delta = this.clock.getElapsedTime() - this.oldElapsedTime;

        this.oldElapsedTime = this.clock.getElapsedTime();

        this.world.step(1 / 60, this.delta, 3);
    }
}