precision mediump float;
varying vec2 texcoord;
uniform float phase,time,active;
uniform sampler2D texture,wave,text;
void main(void){
  vec3 color=texture2D(text,texcoord).rgb;
  vec2 geom=texture2D(texture,texcoord).rg;
  vec3 w1=texture2D(wave,texcoord*0.2-0.2*vec2(0.1,0.2)*time
    +0.2*vec2(0.6,0.4)*time*active
  ).rgb;
  vec3 w2=texture2D(wave,texcoord*0.2+0.2*vec2(0.2,0.1)*time
    -0.2*vec2(0.6,0.4)*time*active
  ).rgb;
  vec3 hoge=(
  texture2D(text,texcoord+geom.g*(w1-w2).rg*0.1).rgb
  +texture2D(text,texcoord+geom.g*(w1.gb-w2.br).rg*0.1).rgb
  )*(w1+w2)/1.5;

  vec3 rgb=vec3(0.67,0.67,0.87)+color.b*vec3(0.33,0.33,0.23);
  rgb=color*(1.-phase)+phase*hoge;
  gl_FragColor=vec4(rgb,geom.r*(1.-phase)+phase*geom.g*(2.-geom.g));
}
