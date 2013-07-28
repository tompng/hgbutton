attribute vec2 vertex;
uniform vec4 rect;
void main(){
  gl_Position=vec4(rect.xy+rect.zw*(vertex+vec2(1,1))/2.,0,1);
}
