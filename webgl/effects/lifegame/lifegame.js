var LifeGame = function(){
  this.size = 512;
  this.calcShader    = new ShaderObject({ vert: 'vertex.vert', frag: 'calc.frag' });
  this.renderShader  = new ShaderObject({ vert: 'vertex.vert', frag: 'render.frag' });
  this.messageShader = new ShaderObject({ vert: 'image.vert',  frag: 'image.frag' });
  this.noiseShader = new ShaderObject({ vert: 'image.vert',  frag: 'noise.frag' });
  this.textures = [
    new TextureObject({ image: createCharImage('は', 128) }),
    new TextureObject({ image: createCharImage('ご', 128) }),
    new TextureObject({ image: createCharImage('ー', 128) })
  ];
  this.oldTarget = this.createRenderTarget();
  this.newTarget = this.createRenderTarget();
  var quadVertex = new ArrayBufferObject(2, [-1, -1, 1, -1, 1, 1, -1, 1]);
  this.quad      = new Geometry(GL.TRIANGLE_FAN, 4, { vertex: quadVertex });
  this.a         = 0;
  this.list = [];
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

LifeGame.prototype.render = function(outputTarget, count){

  for(var i=0;i<count;i++){
    var size=1+Math.random();
    this.list.push({
      size:size,
      x:(2-size)*Math.random()-1,
      y:1+size/6
    })
  }

  for(var i=0;i<this.list.length;i++)this.list[i].y-=0.02;
  while(true){
    var o=this.list[0];
    if(o&&o.y+o.size/3<-1)this.list.shift();
    else break;
  }

  GL.framebuffer.setRenderTarget(this.newTarget);
  this.calcShader.use({
    dx:      [1 / this.size, 0],
    dy:      [0, 1 / this.size],
    texture: this.oldTarget.texture
  }).render(this.quad);

  for(var i=0;i<this.list.length;i++){
    var o=this.list[i];
    for(var j=0;j<this.textures.length;j++){
      this.noiseShader.use({
        rect:    [o.x+j*o.size/3, o.y-o.size/3,o.size/3,o.size/3],
        texture: this.textures[j],
        rand: Math.random()
      }).render(this.quad);
    }
  }

  GL.framebuffer.setRenderTarget(outputTarget);
  this.renderShader.use({
    texture: this.newTarget.texture,
  }).render(this.quad);


  for(var i=0;i<this.list.length;i++){
    var o=this.list[i];
    for(var j=0;j<this.textures.length;j++){
      this.messageShader.use({
        rect:    [o.x+j*o.size/3, o.y-o.size/3,o.size/3,o.size/3],
        texture: this.textures[j]
      }).render(this.quad);
    }
  }

  this.flipRenderTarget();
}
