export const vertexShader = () => {
    return `
      varying float x;
      varying float y;
      varying float z;
      varying vec3 vUv;

      uniform float u_amplitude;
      uniform float[64] u_data_arr;

      void main() {
        vUv = position;

        x = abs(position.x);
      y = abs(position.y);

        float floor_x = round(x);
        float floor_y = round(y);

        float x_multiplier = (32.0 - x) / 8.0;
        float y_multiplier = (32.0 - y) / 8.0;

         z = sin(u_data_arr[int(floor_x)] / 50.0 + u_data_arr[int(floor_y)] / 50.0) * u_amplitude;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, z, 1.0);
    }

    `
}

export const fragmentShader = () => {
    return `
        varying float x;
        varying float y;
        varying float z;

        uniform float u_time;
        void main() {

        gl_FragColor = vec4(abs(x+y+10.0 * z) * 0.01, abs(x+y) * 0.01, abs(x+y) * 0.5, 1.0);
        }
    `
}
