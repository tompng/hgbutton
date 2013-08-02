precision mediump float;
varying vec2 coord;
uniform sampler2D normal;
uniform vec3 light;
void main(void){
  vec3 norm=2.*texture2D(normal,coord).rgb-vec3(1,1,1);
  //vec3 color=texture2D(normal,3.*coord).rgb;
  vec3 color=vec3(1,1,1)*0.1;
	gl_FragColor=vec4(color*(1.+dot(norm,light))/2.,1);
}
