attribute vec3 vertex;
attribute vec2 texcoord;
varying vec2 coord;
uniform vec3 position;
void main(){
  vec3 p=vertex+position;
  gl_Position=vec4(p.xy,-0.1,-p.z);
  coord=texcoord;
}
