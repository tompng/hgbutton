precision mediump float;
varying vec2 texcoord;
uniform sampler2D texture;
void main(void){
  vec4 color = texture2D(texture,texcoord);
  if(color.a < 0.5 || color.r < 0.5)discard;
	gl_FragColor=vec4(color.r*color.a*vec3(1,1,1),1);
}
