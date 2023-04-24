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
        this.debug = this.experience.debug;
        this.events = this.experience.events;

        this.resources.on('loaded', () => {
            this.loaded();
            this.isLoaded = true;

            this.events.on('canvasClick', () => {
                console.log("e");
            });
        });

        this.debugProperties = {};
        this.debugProperties.spaceSize = 20;

        this.debugProperties.reset = () => {
            this.sphere.reset();
            this.box.reset();
        };


        this.setDebug();

    }
    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('world');
            this.debugFolder.add(this.debugProperties, "reset");
            this.debugFolder.add(this.debugProperties, "spaceSize").min(2).max(20).step(.1).name("space size").onFinishChange(() => {
                this.plane.updateSpaceSize(this.debugProperties.spaceSize);
                this.sphere.updateSpaceSize(this.debugProperties.spaceSize);
                this.box.updateSpaceSize(this.debugProperties.spaceSize);
            });
        }
    }
    loaded() {
        this.environment = new environment();
        this.plane = new Plane(this.debugProperties.spaceSize);
        this.sphere = new Sphere(this.debugProperties.spaceSize);
        this.box = new Box(this.debugProperties.spaceSize);
    }
    update() {
        if (this.isLoaded) {
            this.sphere.updatePhysics();
            this.box.updatePhysics();
            this.plane.updatePhysics();
        }
    }
}