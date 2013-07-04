precision mediump float;
uniform sampler2D texture;
varying vec2 texcoord;
void main(void){
  gl_FragColor=texture2D(texture, texcoord);
}