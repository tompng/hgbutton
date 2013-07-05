precision mediump float;
uniform sampler2D texture;
varying vec2 texcoord;
void main(void){
  float val=dot(vec3(1,1,1),texture2D(texture, texcoord).rgb);
  gl_FragColor=vec4(vec3(0.8,0.4,0.2)*val+val*val*vec3(0,0.2,0.2),1);
}