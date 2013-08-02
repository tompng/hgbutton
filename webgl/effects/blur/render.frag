precision mediump float;
uniform sampler2D texture;
varying vec2 texcoord;
uniform vec3 color;
void main(void){
  float val=dot(vec3(1,1,1),texture2D(texture, texcoord).rgb);
  gl_FragColor=vec4(color*val+val*val*vec3(0.3,0.3,0.3),1);
}