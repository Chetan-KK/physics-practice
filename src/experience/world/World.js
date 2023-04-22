import Experience from "../Experience";
import Box from "./Box";
import environment from "./Environment";
import Plane from "./Plane";
import Sphere from "./Sphere";

export default class World {
    constructor () {
        this.experience = new Experience();
        this.time = this.experience.time;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.resources.on('loaded', () => {
            this.loaded();
            this.isLoaded = true;
        });

    }
    loaded() {
        this.environment = new environment();
        this.plane = new Plane();
        this.sphere = new Sphere();
        this.box = new Box();
    }
    update() {
        if (this.isLoaded) {
            this.sphere.updatePhysics();
            this.box.updatePhysics();
            this.plane.updatePhysics();
        }
    }
}