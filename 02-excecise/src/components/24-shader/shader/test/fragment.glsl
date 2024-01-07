// precision mediump float;

// varying float vaRandomZFactors; // 接收varying变量
uniform vec3 uColor;
uniform sampler2D uTexture; // 接收uniform 纹理

varying vec2 vUv;
varying float vElavation;

void main()
{
  // gl_FragColor = vec4(1.0 * vaRandomZFactors, 0, 0, 0.5);
  // gl_FragColor = vec4(1.0, 0, 0, 1);
  // gl_FragColor = vec4(uColor, 1);

 vec4 textureColor = texture2D(uTexture, vUv);
 textureColor.rgb *=  vElavation + 0.6;
 gl_FragColor = textureColor;
}