precision mediump float;
varying vec2 texcoord;
uniform float rand;
void main(void){
  vec2 p=4.*texcoord;
  gl_FragColor.rgb=vec3(1,1,1)*(sin(1234.*sin(
    (9987.+1923.*rand)*p.x
    +(8817.+1557.*rand)*p.y
        +(7975.+1738.*rand)*p.x*p.y
    ))>0.9?1.:0.);
  gl_FragColor.a=1.;
}
