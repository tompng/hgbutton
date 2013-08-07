function SugokuEffect(duration){
  this.duration = duration || 1500;
  this.time0 = new Date();
}
SugokuEffect.prototype.render=function(target){
  var time=(new Date()-this.time0)/this.duration;
  return SugokuEffect.render(target,time)
}

SugokuEffect.load = function(url){
  if(!url)url = ""
  this.baseURL = url;
  this.shader = new ShaderObject({vert: url+'image.vert',  frag: url+'image.frag'});
  var textures=[];
  for(var i=0;i<5;i++)textures[i]=new TextureObject({image: url+i+'.png', clamp: true, mipmap: true});
  this.textures = [
    textures[0],
    textures[1],
    textures[2],
    textures[2],
    textures[3],
    textures[4],
    textures[4]
  ];
  this.sizes=[1,0.7,0.9,0.85,0.9,0.7,0.8]
  var quadVertex = new ArrayBufferObject(2, [-1, -1, 1, -1, 1, 1, -1, 1]);
  this.quad = new Geometry(GL.TRIANGLE_FAN, 4, { vertex: quadVertex });
}


SugokuEffect.render = function(target,time){
  if(time>1)return false;
  GL.framebuffer.setRenderTarget(target);
  GL.blendFunc(GL.SRC_ALPHA,GL.ONE_MINUS_SRC_ALPHA);
  for(var i=0;i<7;i++){
    var size=0.8+0.2*Math.sin((18+5.1*i)*time);
    size*=this.sizes[i];
    this.shader.use({
      texture: this.textures[i],
      rect:    [0.01*Math.sin((13.2-i)*time)+(i-2.5)/4-size/2, -0.5+0.01*Math.sin((11.3+1.3*i)*time), size, size],
      color: [0,0,0,time*(1-time)*(1-time)*(1-time)*10],
    }).render(this.quad);
  }
  return true;
}
