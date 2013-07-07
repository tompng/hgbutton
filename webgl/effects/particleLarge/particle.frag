precision mediump float;
varying vec2 texcoord;
varying vec3 color;
void main(void){
  float r2=dot(texcoord,texcoord);
  if(r2>1.)discard;
  gl_FragColor=vec4(color*0.+vec3(0.08,0.1,0.2)*(1.-r2)*(1.-r2),1);
}
