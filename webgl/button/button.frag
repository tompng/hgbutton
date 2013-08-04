precision mediump float;
varying vec2 texcoord;
uniform sampler2D texture,wave;
uniform float alpha;
uniform float phase;
uniform float time;
void main(void){
  vec4 data = texture2D(texture,texcoord);
  if(data.g==0.)discard;
  float border = data.b;
  float text = data.r;
  vec2 wc1 = texcoord*2.+vec2(1,0.)*time;
  vec2 wc2 = texcoord*2.+vec2(-1,0.)*time;
  vec4 color = texture2D(wave,wc1*vec2(0.1,0.8))+
               texture2D(wave,wc2*vec2(0.1,0.8));
	gl_FragColor=vec4(
  vec3(1,1,1)*(1.-text)+
  (vec3(0.1,0.3,0.5)+color.rgb*vec3(0.2,0.4,0.6))*text,
  data.g*alpha
  );
}
