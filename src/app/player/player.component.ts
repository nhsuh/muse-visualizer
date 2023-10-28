import { Component, OnInit } from '@angular/core';
import SceneInit from "../lib/SceneInit";
import * as THREE from "three";
import {vertexShader} from "../lib/Shaders";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  audioContext: any;
  analyser: any;
  dataArray: any;
  test: SceneInit;
  clock: THREE.Clock;

  ngOnInit() {
    this.clock = new THREE.Clock();
    this.test = new SceneInit("myThreeJsCanvas");
    this.test.initScene();
    this.test.animate();
  }

  setupAudioContext() {
    this.audioContext = new window.AudioContext();
    let audioElement = document.getElementById("myAudio");
    let source = this.audioContext.createMediaElementSource(audioElement);
    this.analyser = this.audioContext.createAnalyser();
    source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    this.analyser.fftSize = 1024;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  render() {
    this.analyser.getByteFrequencyData(this.dataArray);

    requestAnimationFrame(this.render);
  }

  async play() {
    console.log("hello")
    if (this.audioContext === undefined) {
      this.setupAudioContext();
    }
    const uniforms = {
      u_time: {
        type: "f",
        value: 1.0,
      },
      u_amplitude: {
        type: "f",
        value: 3.0,
      },
      u_data_arr: {
        type: "float[64]",
        value: this.dataArray,
      },
    }

    const planeGeometry = new THREE.PlaneGeometry(64, 64, 64, 64);
    const planeMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader(),
      wireframe: true
    });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotation.x = -Math.PI / 2 + Math.PI / 4;
    planeMesh.scale.x = 2;
    planeMesh.scale.y = 2;
    planeMesh.scale.z = 2;
    planeMesh.position.y = 8;
    this.test.scene.add(planeMesh);

    const render = () => {
      this.analyser.getByteFrequencyData(this.dataArray);
      uniforms.u_time.value += this.test.clock.getDelta();
      uniforms.u_data_arr.value = this.dataArray;

      requestAnimationFrame(render);
    }
    render();

  }
}
