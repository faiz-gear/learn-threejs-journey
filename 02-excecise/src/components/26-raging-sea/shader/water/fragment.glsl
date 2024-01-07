uniform vec3 uBigWavesSurfaceColor;
uniform vec3 uBigWavesDepthColor;
uniform float uBigWavesColorOffset;
uniform float uBigWavesColorMultiplier;

varying float vElevation;

void main() {
  vec3 color = mix(uBigWavesDepthColor, uBigWavesSurfaceColor, vElevation * uBigWavesColorMultiplier + uBigWavesColorOffset);
  gl_FragColor = vec4(color, 1.0);
}