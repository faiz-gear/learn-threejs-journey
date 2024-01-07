uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute float aRandomness;

varying vec3 vColor;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float angle = atan(modelPosition.x,  modelPosition.z);// 当前角度
  float distanceToCenter = length(modelPosition.xz); // 距离原点的距离
  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2; // 离原点越近速度越快
  angle += angleOffset;
  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  modelPosition.xyz += aRandomness;

  vec4 modelViewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * modelViewPosition;

  gl_PointSize = uSize * aScale; // point size
  gl_PointSize *= (1.0 / -modelViewPosition.z);

  vColor = color;
}