var LifeGame = function(){
  this.size = 512;
  this.calcShader    = new ShaderObject({ vert: 'vertex.vert', frag: 'calc.frag' });
  this.noiseShader   = new ShaderObject({ vert: 'vertex.vert', frag: 'noise.frag' });
  this.renderShader  = new ShaderObject({ vert: 'vertex.vert', frag: 'render.frag' });
  this.messageShader = new ShaderObject({ vert: 'image.vert',  frag: 'image.frag' });
  this.textures = {
    い: new TextureObject({ size:128, image: createCharImage('い', 128) }),
    ね: new TextureObject({ size:128, image: createCharImage('ね', 128) })
  };
  this.oldTarget = this.createRenderTarget();
  this.target    = this.createRenderTarget();
  this.quad      = new ArrayBufferObject(2, [-1, -1, 1, -1, 1, 1, -1, 1]);
  this.a         = 0;

  // 初期化時にセルを作ってまっくろじゃなくする
  GL.framebuffer.setRenderTarget(this.oldTarget);
  this.noiseShader.use({
    rand: Math.random()
  }).render(GL.TRIANGLE_FAN, 4, { vertex: this.quad });
}

LifeGame.prototype.createRenderTarget = function() {
  var texture = new TextureObject({size: this.size, filter: GL.NEAREST});
  return new RenderTarget({texture: texture})
}

LifeGame.prototype.flipRenderTarget = function() {
  var target_tmp = this.oldTarget;
  this.oldTarget = this.target;
  this.target    = target_tmp;
};

LifeGame.prototype.render = function(outputTarget){
  GL.framebuffer.setRenderTarget(this.target);
  this.calcShader.use({
    dx:      [1 / this.size, 0],
    dy:      [0, 1 / this.size],
    texture: this.oldTarget.texture
  }).render(GL.TRIANGLE_FAN, 4, { vertex: this.quad });

  this.a++;
  this.messageShader.use({
    rect:    [-1, 1 - (this.a * 0.01) % 3, 0.7, 1],
    texture: this.textures.い
  }).render(GL.TRIANGLE_FAN, 4, { vertex: this.quad });

  this.messageShader.use({
    rect:    [-1 + 0.65, 1 - (this.a * 0.012) % 3, 0.7, 1],
    texture: this.textures.い
  }).render(GL.TRIANGLE_FAN, 4, { vertex: this.quad });

  this.messageShader.use({
    rect:    [-1 + 0.65 * 2, 1 - (this.a * 0.013) % 3, 0.7, 1],
    texture: this.textures.ね
  }).render(GL.TRIANGLE_FAN, 4, { vertex: this.quad });

  GL.framebuffer.setRenderTarget(outputTarget);
  this.renderShader.use({
    texture: this.target.texture,
  }).render(GL.TRIANGLE_FAN, 4, { vertex: this.quad });

  this.flipRenderTarget();
}
