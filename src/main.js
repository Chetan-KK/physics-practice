import './main.css';
import Experience from './experience/Experience';

const experienceCanvas = document.getElementById('experienceCanvas');
const experience = new Experience(experienceCanvas);

const initial = document.getElementById('initial');
initial.addEventListener('click', (e) => {
    e.target.style.display = "none";
});