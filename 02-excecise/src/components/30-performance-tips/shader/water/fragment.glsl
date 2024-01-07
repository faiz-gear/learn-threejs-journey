varying vec3 vColor;

void main() {
  // gl_PointCoord就是point的uv坐标

  // 圆
  // float strength = distance(gl_PointCoord, vec2(0.5));
  // strength = step(0.5, strength);
  // strength = 1.0 - strength;

  // 中心线性渐变圆
  // float strength = distance(gl_PointCoord, vec2(0.5));
  // strength *= 2.0;
  // strength = 1.0 - strength;

  // 中心指数渐变圆
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength;
  strength = pow(strength, 10.0);

  vec3 finalColor = mix(vec3(0.0), vColor, strength);

  gl_FragColor = vec4(finalColor, 1.0);

  
}