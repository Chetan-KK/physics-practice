import CANNON from "cannon";
import Experience from "./Experience";

export default class Physics {
    constructor () {
        this.experience = new Experience();
        this.clock = this.experience.time.clock;

        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);

        this.oldElapsedTime = 0;

        this.setMaterials();

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