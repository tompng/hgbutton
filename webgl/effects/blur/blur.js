var BlurEffect = function(url){
  if(!url)url = ""
  this.baseURL = url;
  this.size = 512;
  this.calcShader    = new ShaderObject({vert: url+'vertex.vert', frag: url+'calc.frag'});
  this.renderShader  = new ShaderObject({vert: url+'vertex.vert', frag: url+'render.frag'});
  this.messageShader = new ShaderObject({vert: url+'image.vert',  frag: url+'image.frag'});
  this.textures = [
    new TextureObject({image: createCharImage('は', 128), clamp: true, mipmap: true}),
    new TextureObject({image: createCharImage('ご', 128), clamp: true, mipmap: true}),
    new TextureObject({image: createCharImage('ー', 128), clamp: true, mipmap: true})
  ];
  var img=new Image();
  img.src = url+"wave.jpg";
  this.waveTexture = new TextureObject({image: img});

  this.oldTarget = this.createRenderTarget();
  this.newTarget = this.createRenderTarget();
  var quadVertex = new ArrayBufferObject(2, [-1, -1, 1, -1, 1, 1, -1, 1]);
  this.quad = new Geometry(GL.TRIANGLE_FAN, 4, { vertex: quadVertex });
  this.time0 = new Date();

}

BlurEffect.prototype.createRenderTarget = function() {
  var texture = new TextureObject({size: this.size, filter: GL.LINEAR});
  return new RenderTarget({texture: texture});
}

BlurEffect.prototype.flipRenderTarget = function() {
  var target_tmp = this.oldTarget;
  this.oldTarget = this.newTarget;
  this.newTarget = target_tmp;
};

BlurEffect.prototype.render = function(outputTarget,count){
  GL.framebuffer.setRenderTarget(this.newTarget);
  GL.blendFunc(GL.ONE,GL.ZERO);
  var time = (new Date()-this.time0)/1000;
  this.calcShader.use({
    velocity:[0,-0.001],
    texture: this.oldTarget.texture,
    t:0.04*time,
    wave: this.waveTexture
  }).render(this.quad);
  GL.blendFunc(GL.SRC_ALPHA,GL.ONE);
  var size=0.2;

  for(var i=0;i<3;i++){
    this.messageShader.use({
      rect:    [0.1*Math.sin((0.67-0.1*i)*time)+(i-1)/2-size/2, -0.5+0.1*Math.sin((0.37+0.1*i)*time), size, size],
      color: [0.02,0.02,0.02,1],
      texture: this.textures[i]
    }).render(this.quad);
  }

  for(var n=0;n<count;n++){
    for(var i=0;i<3;i++){
      this.messageShader.use({
        rect:    [-1+1.5*Math.random(), -1+1.5*Math.random(), 0.5, 0.5],
        color: [1,1,1,1],
        texture: this.textures[i]
      }).render(this.quad);
    }
  }
  var phase=5.8+time*0.002;
  var offset=0.5;
  var scale=0.4;
  var color=[
    Math.min(1,Math.max(scale*(offset+Math.cos(phase)),0)),
    Math.min(1,Math.max(scale*(offset+Math.cos(phase+2*Math.PI/3)),0)),
    Math.min(1,Math.max(scale*(offset+Math.cos(phase+4*Math.PI/3)),0))
  ];
  GL.framebuffer.setRenderTarget(outputTarget);
  GL.blendFunc(GL.ONE,GL.ONE);
  this.renderShader.use({
    texture: this.newTarget.texture,
    color: color
  }).render(this.quad);

  this.flipRenderTarget();
}
