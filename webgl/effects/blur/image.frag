precision mediump float;
varying vec2 texcoord;
uniform sampler2D texture;
uniform vec4 color;
void main(void){
	gl_FragColor=texture2D(texture,texcoord)*color;
}
