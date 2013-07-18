var BlurEffect = function(){
  this.size = 512;
  this.calcShader    = new ShaderObject({vert: 'vertex.vert', frag: 'calc.frag'});
  this.renderShader  = new ShaderObject({vert: 'vertex.vert', frag: 'render.frag'});
  this.messageShader = new ShaderObject({vert: 'image.vert',  frag: 'image.frag'});
  this.textures = [
    new TextureObject({image: createCharImage('は', 128), clamp: true, mipmap: true}),
    new TextureObject({image: createCharImage('ご', 128), clamp: true, mipmap: true}),
    new TextureObject({image: createCharImage('ー', 128), clamp: true, mipmap: true})
  ];
  var img=new Image();
  img.src="wave.png";
  this.waveTexture = new TextureObject({image: img});

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
    texture: this.oldTarget.texture,
    t:0.0004*this.a,
    wave: this.waveTexture
  }).render(this.quad);
  GL.blendFunc(GL.SRC_ALPHA,GL.ONE);
  this.a++;
  var size=0.2;
  for(var i=0;i<3;i++){
    this.messageShader.use({
      rect:    [0.1*Math.sin((0.0137-0.002*i)*this.a)+(i-1)/2-size/2, -0.5+0.1*Math.sin((0.0073+0.002*i)*this.a), size, size],
      color: [0.02,0.02,0.02,1],
      texture: this.textures[i]
    }).render(this.quad);
  }

  if(count){
    for(var i=0;i<3;i++){
      this.messageShader.use({
        rect:    [-1+1.5*Math.random(), -1+1.5*Math.random(), 0.5, 0.5],
        color: [1,1,1,1],
        texture: this.textures[i]
      }).render(this.quad);
    }
  }
  GL.framebuffer.setRenderTarget(outputTarget);
  GL.blendFunc(GL.ONE,GL.ZERO);
  this.renderShader.use({
    texture: this.newTarget.texture,
  }).render(this.quad);

  GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA)

  for(var i=0;i<3;i++){
    this.messageShader.use({
      rect:    [0.1*Math.sin((0.0137-0.002*i)*this.a)+(i-1)/2-size/2, -0.5+0.1*Math.sin((0.0073+0.002*i)*this.a), size, size],
      color: [1,1,1,0.1],
      texture: this.textures[i]
    }).render(this.quad);
  }


  this.flipRenderTarget();
}
