attribute vec2 vertex;
uniform vec4 rect;
varying vec2 texcoord;
uniform vec2 position;
uniform float phase;
void main(){
  float c=cos(phase*1.5708);
  float s=sin(phase*1.5708);
  vec3 xyz = vec3(rect.xy+rect.zw*(vertex+vec2(1,1))/2., 0);
  vec3 pos = vec3(xyz.x*s+xyz.z*c, xyz.y, 1.+xyz.z*s-xyz.x*c);

  
  
  gl_Position=vec4(pos.xy+position*pos.z,0,pos.z);
  texcoord=(vec2(1.+vertex.x,1.-vertex.y))/2.;
}
