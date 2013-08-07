precision mediump float;
uniform sampler2D texture;
varying vec2 texcoord;
uniform float opacity;
void main(void){
  gl_FragColor=texture2D(texture, texcoord)*opacity;
}