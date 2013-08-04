attribute vec3 vertex;
uniform vec4 rect;
varying vec2 texcoord;
void main(){
  float r=vertex.x;
  float c=cos(vertex.y);
  float s=sin(vertex.y);
  gl_Position=vec4(r*c,r*s,0,1);
  texcoord=vec2(vertex.z,vertex.x);
}
