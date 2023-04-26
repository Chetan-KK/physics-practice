import Sizes from "./utils/Sizes";
import * as THREE from 'three';
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./world/World";
import Time from "./utils/Time";
import Resources from "./utils/Resources";
import sources from "./sources";
import Debug from "./utils/Debug";
import Physics from "./Physics";
import Sounds from "./utils/Sounds";
import Events from "./utils/Events";

let instance = null;

export default class Experience {
    constructor (canvas) {

        if (instance) {
            return instance;
        }
        instance = this;

        this.canvas = canvas;
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.events = new Events();
        this.sounds = new Sounds();
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.resources = new Resources(sources);
        this.world = new World();
        this.physics = new Physics();
        this.renderer = new Renderer();

        // this.canvas.addEventListener('dblclick', () => {
        //     if (!document.fullscreenElement) {
        //         if (this.canvas.requestFullscreen) {
        //             this.canvas.requestFullscreen();
        //         }
        //     }
        //     else {
        //         document.exitFullscreen();
        //     }
        // });

        this.sizes.on('resized', () => {
            this.resized();
        });

        this.time.on('update', () => {
            this.update();
        });



    }
    resized() {
        this.camera.resized();
        this.renderer.resized();
    }
    update() {
        this.camera.update();
        this.world.update();
        this.physics.update();
        this.renderer.update();
    }
}