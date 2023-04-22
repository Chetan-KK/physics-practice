import Experience from "../Experience";
import hitSound from '/sounds/hit.mp3';

export default class Sounds {
    constructor () {
        this.experience = new Experience();

        // console.log(this.hitSound.play());

    }
    playHitSound(collision) {
        this.hitSound = new Audio(hitSound);
        this.impactStrength = collision.contact.getImpactVelocityAlongNormal();
        if (this.impactStrength > 1.5) {

            this.hitSound.play();
        }
    }
}