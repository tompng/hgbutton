function SquareEffect(duration){
  this.duration = duration || 1000;
  this.time0 = new Date();
}
SquareEffect.prototype.render=function(target){
  var time=(new Date()-this.time0)/this.duration;
  if(time>1)return false;
  SquareEffect.render(target,time);
  return true;
}

SquareEffect.load = function(url){
  if(!url)url="";
  this.baseURL=url;
  this.size = 512;
  this.shader    = new ShaderObject({vert: url+'quad.vert', frag: url+'quad.frag'});
  var quadVertex = new ArrayBufferObject(2, [-1, -1, 1, -1, 1, 1, -1, 1]);
  this.quad      = new Geometry(GL.TRIANGLE_FAN, 4, { vertex: quadVertex });
  this.time      = 0;
  this.color     = [1,1,1,1];
}
SquareEffect.rect=function(x,y,w,h,a){
  this.shader.use({
    rect:[x,y,w,h],
    color:[this.color[0],this.color[1],this.color[2],a]
  }).render(this.quad);
}

SquareEffect.render = function(target,time){
  GL.framebuffer.setRenderTarget(target);
  GL.blendFunc(GL.SRC_ALPHA,GL.ONE);
  var n=12;
  var t=time*3%3,et=0.4;
  for(var ix=0;ix<n;ix++)for(var iy=0;iy<n;iy++){
    var t0=(1+Math.sin(123*ix+456*iy+789))*1000%1*(1-et);
    var t1=t0+et;
    var t2=1+(1+Math.sin(789*ix+123*iy+456))*1000%1*(1-et);;
    var t3=t2+et;
    var a;
    if(t<t0)a=0;
    else if(t<t1)a=(t-t0)/et;
    else if(t<t2)a=1;
    else if(t<t3)a=1-(t-t2)/et;
    else a=0;
    var alpha=0.8+(1+Math.sin(987*ix+654*iy+321))*1000%1*0.2;
    this.rect(2*ix/n-1,2*iy/n-1,2/n,2/n,alpha*a*a*(3-2*a));
  }
}
