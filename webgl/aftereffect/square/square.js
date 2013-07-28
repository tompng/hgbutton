var SquareEffect = function(url){
  if(!url)url="";
  this.baseURL=url;
  this.size = 512;
  this.shader    = new ShaderObject({vert: url+'quad.vert', frag: url+'quad.frag'});
  var quadVertex = new ArrayBufferObject(2, [-1, -1, 1, -1, 1, 1, -1, 1]);
  this.quad      = new Geometry(GL.TRIANGLE_FAN, 4, { vertex: quadVertex });
  this.time      = 0;
  this.color     = [1,1,1,1];
}
SquareEffect.prototype.rect=function(x,y,w,h,a){
  this.shader.use({
    rect:[x,y,w,h],
    color:[this.color[0],this.color[1],this.color[2],a]
  }).render(this.quad);
}

SquareEffect.prototype.render = function(outputTarget){
  GL.framebuffer.setRenderTarget(outputTarget);
  GL.blendFunc(GL.SRC_ALPHA,GL.ONE);
  this.time++;
  var m=60;
  var n=10;
  var phase=this.time%(3*m);
  if(phase<m){
    var t=phase/m,et=0.5;
    for(var ix=0;ix<n;ix++)for(var iy=0;iy<n;iy++){
      var tt=(1+Math.sin(123*ix+456*iy+789))*1000%1*(1-et);
      var a=(t-tt)/et;
      this.rect(2*ix/n-1,2*iy/n-1,2/n,2/n,a>1?1:a<0?0:a*a*(3-2*a));
    }
  }else if(phase<2*m){
    this.rect(-1,-1,2,2,1);
  }else{
    var t=(phase-2*m)/m;
    if(0<=t&&t<1)this.rect(-1,-1,2,2,1+2*t*t*t-3*t*t);
  }
}
