uniform mat4 modelview;
uniform mat4 projection;
uniform float size,time;
attribute vec2 delta;
attribute vec3 random0,random1,random2,random3,random4;
varying vec2 texcoord;
varying vec3 color;
void main(){
  texcoord=delta;
  vec3 pos=random0+
    time*(
      sin(vec3(dot(random0,vec3(8,-12,7)),dot(random0,vec3(8,15,6)),dot(random0,vec3(7,15,-9))))+
      sin(vec3(dot(random0,vec3(-13,8,12)),dot(random0,vec3(-7,11,10)),dot(random0,vec3(11,13,12))))+
      sin(vec3(dot(random0,vec3(14,14,7)),dot(random0,vec3(9,-5,26)),dot(random0,vec3(-8,11,7))))
    )/8.+
    time*time*(
      sin(vec3(dot(random0,vec3(-3,8,12)),dot(random0,vec3(-7,11,10)),dot(random0,vec3(11,13,12))))+
      sin(vec3(dot(random0,vec3(14,4,7)),dot(random0,vec3(9,-5,16)),dot(random0,vec3(-8,11,17))))+
      sin(vec3(dot(random0,vec3(18,-12,7)),dot(random0,vec3(18,5,6)),dot(random0,vec3(17,5,-9))))
    )/4.+
    time*time*time*(
      sin(vec3(dot(random0,vec3(14,4,7)),dot(random0,vec3(9,-25,6)),dot(random0,vec3(-18,11,7))))+
      sin(vec3(dot(random0,vec3(8,-12,7)),dot(random0,vec3(8,5,16)),dot(random0,vec3(7,25,-9))))+
      sin(vec3(dot(random0,vec3(-13,18,12)),dot(random0,vec3(-17,11,10)),dot(random0,vec3(11,13,12))))
    )/2.;

  gl_Position=projection*(modelview*vec4(pos,1)+vec4(delta,0,0)*size);
  color=(vec3(1,1,1)+random4)/2.;
}