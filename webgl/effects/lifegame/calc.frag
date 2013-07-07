precision mediump float;
uniform sampler2D texture;
varying vec2 texcoord;
uniform vec2 dx,dy;
void main(void){
  vec3 center=texture2D(texture,texcoord).rgb;
  float sum=texture2D(texture,texcoord-dx-dy).r
        +texture2D(texture,texcoord-dy).r
        +texture2D(texture,texcoord+dx-dy).r
        +texture2D(texture,texcoord-dx).r
        +texture2D(texture,texcoord+dx).r
        +texture2D(texture,texcoord-dx+dy).r
        +texture2D(texture,texcoord+dy).r
        +texture2D(texture,texcoord+dx+dy).r;
  float val;
  if(center.r>0.5)val=1.-10.*(sum-1.8)*(sum-3.2);
  else val=1.-20.*(sum-3.)*(sum-3.);
  if(val>0.5){
    val=center.r>0.?center.r-2./255.:1.;
  }
  else val=0.;
  //val=val<0.5?0.:1.;
  gl_FragColor=vec4(val,center.g*0.9+val,center.b*0.8+val,1);
}
