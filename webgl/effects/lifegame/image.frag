precision mediump float;
varying vec2 texcoord;
uniform sampler2D texture;
uniform float rand;
void main(void){
  vec4 color = texture2D(texture,texcoord);
  if(color.a*color.r < 0.5)discard;
  gl_FragColor=vec4(1,1,1,1);
}
