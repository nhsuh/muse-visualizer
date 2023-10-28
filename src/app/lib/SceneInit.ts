import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

export default class SceneInit {
    canvasID: string;
    camera: THREE.PerspectiveCamera;
    clock: THREE.Clock;
    scene: THREE.Scene;
    uniforms: any;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    stats: Stats;


    constructor(canvasID: string) {
        this.canvasID = canvasID;
    }

    initScene() {
        this.camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 196;
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.uniforms = {
            u_time: {type: "f", value: 1.0},
            colorB: {type: "vec3", value: new THREE.Color(0xfff000)},
            ColorA: {type: "vec3", value: new THREE.Color(0xffffff)}
        };

        // @ts-ignore
        const canvas: HTMLElement = document.getElementById(this.canvasID);
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        })

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        let ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        ambientLight.castShadow = false;
        this.scene.add(ambientLight);

        let spotLight = new THREE.SpotLight(0xffffff, 0.55);
        spotLight.castShadow = true;
        spotLight.position.set(0, 80, 10);
        this.scene.add(spotLight);

        window.addEventListener("resize", () => this.onWindowResize(), false);

    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.render();
        this.stats.update();
        this.controls.update();
    }
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    onWindowResize() {
        this.camera.aspect = window.innerWidth/ window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }


}
