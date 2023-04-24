import EventEmitter from "events";
import Experience from "../Experience";

export default class Events extends EventEmitter {
    constructor () {
        super();
        this.experience = new Experience();
        this.canvas = this.experience.canvas;

        this.canvas.addEventListener('click', () => {
            this.emit('canvasClick');
        });

    }
}