var AriaEffect = function(url){
  if(!url)url = ""
  this.baseURL = url;
  this.shader = new ShaderObject({vert: url+'image.vert',  frag: url+'image.frag'});
  var textures=[];
  var imgurl = url+"../../image/round/";
  var names = ['i.png','ne.png','bikkuri.png'];
  var textures = [];
  this.wave = new TextureObject({image: url+'../../effects/blur/wave.jpg'})
  for(var i=0;i<names.length;i++){
    textures[i]=new TextureObject({image: imgurl+names[i], clamp: true});
  }
  this.textures = [
    textures[0],
    textures[0],
    textures[1],
    textures[2]
  ];
  var quadVertex = new ArrayBufferObject(2, [-1, -1, 1, -1, 1, 1, -1, 1]);
  this.quad = new Geometry(GL.TRIANGLE_FAN, 4, { vertex: quadVertex });
  this.time0 = new Date();
}

AriaEffect.prototype.render = function(outputTarget,count){
  GL.framebuffer.setRenderTarget(outputTarget);
  GL.blendFuncSeparate(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA, GL.ZERO, GL.ONE);
  var time=(new Date()-this.time0)/1000;
  var offsets = [-0.65,-0.15,0.35,0.75]
  for(var i=0;i<4;i++){
    var phase = time*0.8%4;
    var start = i*0.2;
    this.shader.use({
      wave: this.wave,
      time: time,
      texture: this.textures[i],
      phase: Math.min(Math.max(0,phase-start),1),
      alpha: Math.min(1,3-phase),
      position: [offsets[i],0],
      rect:    [-0.25,-0.4,0.5,0.8]
    }).render(this.quad);
  }
}
