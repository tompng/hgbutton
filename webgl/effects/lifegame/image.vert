attribute vec2 vertex;
uniform vec4 rect;
varying vec2 texcoord;
void main(){
  gl_Position=vec4(rect.xy+rect.zw*(vertex+vec2(1,1))/2.,0,1);
  texcoord=(vec2(1.+vertex.x,1.-vertex.y))/2.;
}
