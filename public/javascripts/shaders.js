const vShader1 = `
varying vec2 vUv;
uniform float uTime;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
const fShader1 = `
varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
  float time = uTime;

  vec2 uv = vUv;
  vec2 repeat = vec2(2.0, 2.0);
  uv = fract(uv * repeat);

  vec4 color = texture2D(uTexture, uv);
  gl_FragColor = color;
}
`
