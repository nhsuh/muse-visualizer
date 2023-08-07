import { Component } from '@angular/core';
import * as THREE from "three";
@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})
export class CubeComponent {
  playing = false;
  listener = new THREE.AudioListener();
  audio = new THREE.Audio( this.listener );
  fftSize = 128;
  analyser = new THREE.AudioAnalyser( this.audio, this.fftSize );

  onClick(){
    this.playing = true;
    let media = new Audio();
    media.src = "../../assets/hehe.mp3";
    media.load();
    this.audio.setMediaElementSource( media );
    this.audio.hasPlaybackControl = true;
    media.play();
    this.audio.play();
    let uniforms: { tAudioData: any; }, renderer: THREE.WebGLRenderer;
    const canvas = document.getElementById('canvas');
    if (!canvas) {
      return;
    }
    const canvasSizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    renderer = new THREE.WebGLRenderer( { canvas: canvas, } );
    renderer.setClearColor(0xe232222, 1);
    renderer.setSize(canvasSizes.width, canvasSizes.height);
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const format = ( renderer.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat;
    uniforms = {
      tAudioData: { value: new THREE.DataTexture( this.analyser.data, this.fftSize /2, 1, format ) },
    };
    const geometry = new THREE.PlaneGeometry( 1, 1 );
    const material = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: "varying vec2 vUv; void main() { vUv = uv;gl_Position = vec4( position,1.0 );}",
      fragmentShader: "uniform sampler2D tAudioData; varying vec2 vUv; void main() {vec3 backgroundColor = vec3( 0.1, 0.1,0.1 );vec3 color = vec3( 1, 0, vUv.y );float f = texture2D( tAudioData, vec2( vUv.x, 0 ) ).r;float i = step( vUv.y, f ) * step( f-f, vUv.y );gl_FragColor = vec4( mix( backgroundColor, color, i ), 1.0 );} ",
    } );
    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    const animateGeometry = () => {
      window.requestAnimationFrame(animateGeometry);
      this.analyser.getFrequencyData();
      uniforms.tAudioData.value.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animateGeometry();
  }

}
