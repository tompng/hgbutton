attribute vec2 vertex;
varying vec2 texcoord;
void main(){
  gl_Position=vec4(vertex,0,1);
  texcoord=(vertex+vec2(1,1))/2.;
}
