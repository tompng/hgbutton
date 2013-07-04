var LifeGame = {}
LifeGame.load = function(){
  this.size = 512;
  this.calcShader = new ShaderObject({vert: 'vertex.vert', frag: 'calc.frag'});
  this.noiseShader = new ShaderObject({vert: 'vertex.vert', frag: 'noise.frag'});
  this.renderShader = new ShaderObject({vert: 'vertex.vert', frag: 'render.frag'});
  var texture0 = new TextureObject({size: this.size, filter:GL.NEAREST});
  var texture1 = new TextureObject({size: this.size, filter:GL.NEAREST});
  this.target0 = new RenderTarget({texture: texture0})
  this.target1 = new RenderTarget({texture: texture1})
  this.quad = new ArrayBufferObject(2, [-1, -1, 1, -1, 1, 1, -1, 1]);

  GL.framebuffer.setRenderTarget(this.target0);
  this.noiseShader.use({
    rand: Math.random()
  }).render(GL.TRIANGLE_FAN, 4, {vertex: this.quad});
}
LifeGame.render = function(target){
  GL.framebuffer.setRenderTarget(this.target1);
  this.calcShader.use({
    dx: [1 / this.size, 0],
    dy: [0, 1 / this.size],
    texture: this.target0.texture
  }).render(GL.TRIANGLE_FAN, 4, {vertex: this.quad});

  var target_tmp = this.target0;
  this.target0 = this.target1;
  this.target1 = target_tmp;

  GL.framebuffer.setRenderTarget(target);
  this.renderShader.use({
    texture: this.target1.texture,
  }).render(GL.TRIANGLE_FAN, 4, {vertex: this.quad});
}
