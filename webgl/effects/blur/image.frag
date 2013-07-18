precision mediump float;
varying vec2 texcoord;
uniform sampler2D texture;
uniform vec4 color;
void main(void){
  float alpha = texture2D(texture,texcoord).a;
	gl_FragColor=vec4(color.rgb,color.a*alpha);
}
