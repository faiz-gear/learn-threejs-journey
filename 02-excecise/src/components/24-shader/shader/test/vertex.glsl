// ShaderMaterial会自动添加常用的uniform attribute等
// uniform mat4 projectionMatrix; 
// uniform mat4 viewMatrix; // 视图矩阵
// uniform mat4 modelMatrix; // 模型矩阵

uniform vec2 uFrequency; // 拱起的频率
uniform float uTime; // 过去的时间

// attribute vec3 position; // 接收到的每个顶点的坐标
// attribute vec2 uv; // 接收到的每个顶点的纹理坐标
attribute float aRandomZFactors;

varying vec2 vUv; // 片段着色器中可以访问的uv变量，用于传递给片段着色器
varying float vElavation; // 片段着色器中可以访问的海拔变量，用于传递给片段着色器

// varying float vaRandomZFactors; // varying变量可以传递给片段着色器

// float loremIpsum(float a, float b) {
//   // float a = 1.0;
//   // float b = 2.0;
//   // return a * b;
//   return a + b;
// }

// void  noReturn() {
//   float a = 1.0;
//   float b = 2.0;
// }

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // 海拔
  float elevation =sin(modelPosition.x * uFrequency.x + uTime * 2.0) * 0.1;// x方向的拱起的频率
  elevation += sin(modelPosition.y * uFrequency.y + uTime * 2.0) * 0.1; // y方向的拱起的频率
  modelPosition.z = elevation;
  
  // modelPosition.z += aRandomZFactors * 0.1;

  // vaRandomZFactors = aRandomZFactors;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectPosition = projectionMatrix * viewPosition;

  gl_Position = projectPosition;

  vUv = uv; // 传递给片元着色器
  vElavation = elevation;
}