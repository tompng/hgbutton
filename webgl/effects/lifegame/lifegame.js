var LifeGame = function(){
  this.size = 512;
  this.calcShader    = new ShaderObject({ vert: 'vertex.vert', frag: 'calc.frag' });
  this.noiseShader   = new ShaderObject({ vert: 'vertex.vert', frag: 'noise.frag' });
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

  // 初期化時にセルを作ってまっくろじゃなくする
  GL.framebuffer.setRenderTarget(this.oldTarget);
  this.noiseShader.use({
    rand: Math.random()
  }).render(this.quad);
}

LifeGame.prototype.createRenderTarget = function() {
  var texture = new TextureObject({size: this.size, filter: GL.NEAREST});
  return new RenderTarget({texture: texture})
}

LifeGame.prototype.flipRenderTarget = function() {
  var target_tmp = this.oldTarget;
  this.oldTarget = this.newTarget;
  this.newTarget = target_tmp;
};

LifeGame.prototype.render = function(outputTarget){
  GL.framebuffer.setRenderTarget(this.newTarget);
  this.calcShader.use({
    dx:      [1 / this.size, 0],
    dy:      [0, 1 / this.size],
    texture: this.oldTarget.texture
  }).render(this.quad);

  this.a++;
  this.messageShader.use({
    rect:    [-1, 1 - (this.a * 0.01) % 3, 0.7, 1],
    texture: this.textures.は
  }).render(this.quad);

  this.messageShader.use({
    rect:    [-1 + 0.65, 1 - (this.a * 0.012) % 3, 0.7, 1],
    texture: this.textures.ご
  }).render(this.quad);

  this.messageShader.use({
    rect:    [-1 + 0.65 * 2, 1 - (this.a * 0.013) % 3, 0.7, 1],
    texture: this.textures.ー
  }).render(this.quad);

  GL.framebuffer.setRenderTarget(outputTarget);
  this.renderShader.use({
    texture: this.newTarget.texture,
  }).render(this.quad);

  this.flipRenderTarget();
}
