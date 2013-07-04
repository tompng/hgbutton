precision mediump float;
varying vec2 texcoord;
uniform sampler2D texture;
void main(void){
  vec4 color = texture2D(texture,texcoord);
  if(color.a < 0.5 || color.r < 0.5)discard;
  vec2 p=4.*texcoord;
  float rand=3.;
  float val = sin(1234.*sin(
    (9987.+1923.*rand)*texcoord.x
    +(8817.+1557.*rand)*texcoord.y
        +(7975.+1738.*rand)*texcoord.x*texcoord.y
    ));
  if(val < 0.9) discard;
  gl_FragColor=vec4(1,1,1,1);
}
