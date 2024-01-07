import { BlendFunction, Effect } from 'postprocessing'
import { Uniform } from 'three'

const fragmentShader = /* glsl */ `
  uniform float frequency;
  uniform float amplitude;
  uniform float offset;
  void mainUv(inout vec2 uv) {
    uv.y += sin(uv.x * frequency + offset) * amplitude;
  }
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 color = vec4(1., .0, .0, inputColor.a);
    outputColor = color;
  }
`

export default class DrunkEffect extends Effect {
  constructor(props) {
    const { frequency, amplitude, blendFunction = BlendFunction.ADD } = props
    super('DrunkEffect', fragmentShader, {
      uniforms: new Map([
        ['frequency', new Uniform(frequency || 10.0)],
        ['amplitude', new Uniform(amplitude || 0.1)],
        ['offset', new Uniform(0.0)]
      ]),
      blendFunction
    })
  }
  update(renderer, inputBuffer, delta) {
    this.uniforms.get('offset').value += delta
  }
}
