precision mediump float;
varying vec2 coord;
uniform sampler2D normal, texture;
uniform vec3 light;
void main(void){
  vec3 norm=2.*texture2D(normal,coord).rgb-vec3(1,1,1);
  vec3 color=texture2D(texture,coord).rgb*0.4;
	gl_FragColor=vec4(color*(1.+dot(norm,light))/2.,1);
}
