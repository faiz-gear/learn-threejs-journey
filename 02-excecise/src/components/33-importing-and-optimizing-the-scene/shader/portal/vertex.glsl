uniform float uTime;
attribute float aScale;

varying vec2 vUv;

void main() {

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 modelViewPosition = viewMatrix *  modelPosition;
  vec4 projectionPosition = projectionMatrix * modelViewPosition;

  gl_Position = projectionPosition;

  vUv = uv;
}