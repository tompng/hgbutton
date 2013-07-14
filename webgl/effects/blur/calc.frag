precision mediump float;
uniform sampler2D texture, wave;
varying vec2 texcoord;
uniform vec2 x1,x2,y1,y2,t;
uniform vec2 velocity;
void main(void){
  float blurx=dot(x1,texcoord)+dot(x2,texcoord);
  float blury=dot(y1,texcoord)+dot(y2,texcoord);

  vec2 v1=velocity+(texture2D(wave,texcoord+vec2(0,0.02)*t).rg-vec2(0.5,0.5))*0.01;
  vec2 v2=velocity+(texture2D(wave,texcoord+vec2(-0.017,-0.01)*t).rg-vec2(0.5,0.5))*0.01;
  vec2 v3=velocity+(texture2D(wave,texcoord+vec2(0.017,-0.01)*t).rg-vec2(0.5,0.5))*0.01;

  vec3 color=vec3(
    dot(texture2D(texture,texcoord+v1),vec4(0.96, 0,    0.04, 0)),
    dot(texture2D(texture,texcoord+v2),vec4(0.04, 0.96, 0,    0)),
    dot(texture2D(texture,texcoord+v3),vec4(0,    0.04, 0.96, 0))
  );
  gl_FragColor=vec4(color-vec3(1,1,1)/256.,1);
}
