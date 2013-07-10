var BlurEffect = function(){
  this.size = 512;
  this.calcShader    = new ShaderObject({ vert: 'vertex.vert', frag: 'calc.frag' });
  this.renderShader  = new ShaderObject({ vert: 'vertex.vert', frag: 'render.frag' });
  this.messageShader = new ShaderObject({ vert: 'image.vert',  frag: 'image.frag' });
  this.textures = {
    は: new TextureObject({ image: createCharImage('は', 128) }),
    ご: new TextureObject({ image: createCharImage('ご', 128) }),
    ー: new TextureObject({ image: createCharImage('ー', 128) })
  };
  this.oldTarget = this.createRenderTarget();
  this.newTarget = this.createRenderTarget();
  var quadVertex = new ArrayBufferObject(2, [-1, -1, 1, -1, 1, 1, -1, 1]);
  this.quad      = new Geometry(GL.TRIANGLE_FAN, 4, { vertex: quadVertex });
  this.a         = 0;
}

BlurEffect.prototype.createRenderTarget = function() {
  var texture = new TextureObject({size: this.size, filter: GL.LINEAR});
  return new RenderTarget({texture: texture})
}

BlurEffect.prototype.flipRenderTarget = function() {
  var target_tmp = this.oldTarget;
  this.oldTarget = this.newTarget;
  this.newTarget = target_tmp;
};

BlurEffect.prototype.render = function(outputTarget,count){
  GL.framebuffer.setRenderTarget(this.newTarget);
  GL.enable(GL.BLEND);
  GL.blendFunc(GL.ONE,GL.ZERO);
  this.calcShader.use({
    velocity:[0,-0.001],
    x1: [7.3,6.5],x2:[6.1, -5.3],y1:[5.3,-4.8],y2:[8.1,7.3],
    texture: this.oldTarget.texture,
    t:[0.03*this.a,0.02*this.a]
  }).render(this.quad);
  GL.blendFunc(GL.ONE,GL.ONE);
  this.a++;
  this.messageShader.use({
    rect:    [0.2*Math.sin(0.0137*this.a), -0.5+0.2*Math.sin(0.0073*this.a), 0.1, 0.1],
    texture: this.textures.は
  }).render(this.quad);

  if(count){
    this.messageShader.use({
      rect:    [-1+1.5*Math.random(), -1+1.5*Math.random(), 0.5, 0.5],
      texture: this.textures.は
    }).render(this.quad);
    this.messageShader.use({
      rect:    [-1+1.5*Math.random(), -1+1.5*Math.random(), 0.5, 0.5],
      texture: this.textures.ご
    }).render(this.quad);
    this.messageShader.use({
      rect:    [-1+1.5*Math.random(), -1+1.5*Math.random(), 0.5, 0.5],
      texture: this.textures.ー
    }).render(this.quad);
  }
  GL.framebuffer.setRenderTarget(outputTarget);
  GL.blendFunc(GL.ONE,GL.ZERO);
  this.renderShader.use({
    texture: this.newTarget.texture,
  }).render(this.quad);

  this.flipRenderTarget();
}
