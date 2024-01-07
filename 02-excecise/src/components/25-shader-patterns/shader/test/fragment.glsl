#define PI 3.1415926535897932384626

varying vec2 vUv;

// 生成随机数
float random(vec2 st) 
{
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) *  43758.5453123);
}

// 旋转
vec2 rotate(vec2 uv, float rotation, vec2 mid) 
{
  return vec2(
    sin(rotation) * (uv.x - mid.x) + cos(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.x - mid.x) + mid.y - sin(rotation) * (uv.y - mid.y)
  );
}

vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

// 生成噪点算法函数
float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
  // 从左至右渐变
  // float strength = vUv.x;  

  // 从下至上渐变
  // float strength = vUv.y;  

  // 从上至下渐变
  // float strength = 1.0 - vUv.y;

  // 区间渐变
  // float strength = vUv.y * 6.0;

  // 分段渐变
  // float strength = mod(vUv.y * 10.0, 1.0);

  // 等间隔分段
  // float strength = mod(vUv.y * 10.0, 1.0); 
  // strength = step(0.5, strength); // 步长函数,相当于strength > 0.5 ? 1 : 0, 但是性能会比if语句高

  // 不等间隔分段 - y方向
  // float strength = mod(vUv.y * 10.0, 1.0); 
  // strength = step(0.8, strength); 

  // 不等间隔分段 - x方向
  // float strength = mod(vUv.x * 10.0, 1.0); 
  // strength = step(0.8, strength); 

  // 不等间隔分段 - xy方向
  // float strength = step(0.8, mod(vUv.x * 10.0, 1.0)) + step(0.8, mod(vUv.y * 10.0, 1.0)); 

  // float strength = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0)); 

  // float strength = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0)); 

  // float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) *  step(0.8, mod(vUv.y * 10.0, 1.0));
  // float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) *  step(0.4, mod(vUv.y * 10.0, 1.0));
  // float strength = barX + barY;

  // float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) *  step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
  // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0)) *  step(0.4, mod(vUv.y * 10.0, 1.0));
  // float strength = barX + barY;

  // float strength = abs(vUv.x - 0.5) ;  

  // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));  

  // float strength = step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));  

  // float strength1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));  
  // float strength2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));  
  // float strength = strength1 * strength2;

  // float strength = floor(vUv.x * 10.0) / 10.0;

  // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;

  // vec2 gridUv = vec2(
  //   floor(vUv.x * 10.0) / 10.0, 
  //   floor(vUv.y * 10.0) / 10.0
  //   );
  // float strength = random(gridUv);

  // vec2 gridUv = vec2(
  //   floor(vUv.x * 10.0) / 10.0, 
  //   floor(vUv.y * 10.0 + vUv.x * 5.0) / 10.0
  //   );
  // float strength = random(gridUv);

  // float strength = length(vUv); // 获取向量的长度
  // float strength = length(vUv - 0.5); // 径向渐变

  // float strength = distance(vUv, vec2(0.2, 0.8)); // 获取向量到某个点的距离.径向渐变

  // float strength = 1.0 - distance(vUv, vec2(0.5)); 

  // float strength = 0.015 / distance(vUv, vec2(0.5)); 

  // vec2 lightUv = vec2(
  //   vUv.x * 0.2 + 0.4,
  //   vUv.y * 0.5 + 0.25
  // );
  // float strength = 0.015 / distance(lightUv, vec2(0.5)); 

  // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));
  // vec2 lightUvX = vec2(
  //   rotatedUv.x * 0.1 + 0.45,
  //   rotatedUv.y * 0.5 + 0.25
  // );
  // float lightX = 0.015 / distance(lightUvX, vec2(0.5));
  // vec2 lightUvY = vec2(
  //   rotatedUv.y * 0.1 + 0.45,
  //   rotatedUv.x * 0.5 + 0.25
  // );
  // float lightY = 0.015 / distance(lightUvY, vec2(0.5));
  // float strength = lightX * lightY; 

  // float strength = step(0.25, distance(vUv, vec2(0.5)));

  // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

  // float strength = step(0.02, abs(distance(vUv, vec2(0.5)) - 0.25)); // 空心圆

  // float strength = 1.0 - step(0.02, abs(distance(vUv, vec2(0.5)) - 0.25)); // 空心圆

  // vec2 wavedUv = vec2(
  //   vUv.x,
  //   vUv.y + sin(vUv.x * 30.0) * 0.1
  // );
  // float strength = 1.0 - step(0.02, abs(distance(wavedUv, vec2(0.5)) - 0.25));

  // vec2 wavedUv = vec2(
  //   vUv.x + sin(vUv.y * 30.0) * 0.1,
  //   vUv.y + sin(vUv.x * 30.0) * 0.1
  // );
  // float strength = 1.0 - step(0.02, abs(distance(wavedUv, vec2(0.5)) - 0.25));

  // vec2 wavedUv = vec2(
  //   vUv.x + sin(vUv.y * 300.0) * 0.1,
  //   vUv.y + sin(vUv.x * 300.0) * 0.1
  // );
  // float strength = 1.0 - step(0.02, abs(distance(wavedUv, vec2(0.5)) - 0.25));

  // 根据uv坐标的 角度变化颜色
  // float angle = atan(vUv.x, vUv.y);
  // float strength = angle;

  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // float strength = angle;
  
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= PI * 2.0;
  // angle += 0.5;
  // float strength = angle;

  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= PI * 2.0; // 划分成一圈
  // angle += 0.5; // 偏移
  // angle *= 20.0;
  // angle = mod(angle, 1.0);
  // float strength = angle;

  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= PI * 2.0; // 划分成一圈
  // angle += 0.5; // 偏移
  // angle = sin(angle * 100.0);
  // float strength = angle;

//   float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
//   angle /= PI * 2.0; // 划分成一圈
//   angle += 0.5; // 偏移
//   angle = sin(angle * 100.0);
//   float radius = 0.25 + angle * 0.02;
//  float strength = 1.0 - step(0.02, abs(distance(vUv, vec2(0.5)) - radius));

  // float strength = cnoise(vUv * 10.0); // 噪点算法,可以用来制作云层\水等效果

  // float strength = step(0.0, cnoise(vUv * 10.0));

  // float strength = abs(cnoise(vUv * 10.0));

  // float strength = sin(cnoise(vUv * 10.0) * 20.0);

  float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

  // 处理strength的边界
  strength = clamp(strength, 0.0, 1.0);

// 混合色
  vec3 blackColor = vec3(0.0);
  vec3 uvColor = vec3(vUv, 1.0);
  vec3 mixColor = mix(blackColor, uvColor, strength);
  gl_FragColor = vec4(mixColor, 1.0);
 // 黑白色
  // gl_FragColor = vec4(strength, strength, strength, 1);
}