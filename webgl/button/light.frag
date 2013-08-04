precision mediump float;
varying vec2 texcoord;
uniform float phase,time;
uniform sampler2D texture;
uniform vec3 rgb;
void main(void){
  float r=texcoord.g;
  vec4 color=
    texture2D(texture,vec2(1,0.2)*texcoord+vec2(-0.1,-0.4)*time)+
    texture2D(texture,vec2(1,0.2)*texcoord+vec2(0.1,0.3)*time);
  gl_FragColor=2.*(2.-r)*phase*color*vec4(rgb,1);
}
