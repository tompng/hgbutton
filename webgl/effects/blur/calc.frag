precision mediump float;
uniform sampler2D texture;
varying vec2 texcoord;
uniform vec2 x1,x2,y1,y2,t;
uniform vec2 velocity;
void main(void){
	float blurx=dot(x1,texcoord)+dot(x2,texcoord);
	float blury=dot(y1,texcoord)+dot(y2,texcoord);
	vec2 v1=velocity+sin(vec2(blurx*4.,4.*blury)+3.*t)*0.001;
  vec2 v2=velocity+sin(vec2(blurx*3.,-3.*blury)+3.*t)*0.001;
	vec2 v3=velocity+sin(vec2(blury*4.,4.*blurx)+3.*t)*0.001;
	vec3 color=vec3(
			 texture2D(texture,texcoord+v1).r,
			 texture2D(texture,texcoord+v2).g,
			 texture2D(texture,texcoord+v3).b
	 );
			 
	gl_FragColor=vec4(color-vec3(1,1,1)/256.,1);
}