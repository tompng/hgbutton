var SugokuEffect = function(url){
  if(!url)url = ""
  this.baseURL = url;
  this.shader = new ShaderObject({vert: url+'image.vert',  frag: url+'image.frag'});
  function image(path){
    var img=new Image();
    img.src=url+path;
    return img;
  }
  var textures=[];
  for(var i=0;i<5;i++)textures[i]=new TextureObject({image: image(i+'.png'), clamp: true, mipmap: true});
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
  this.time = 0;
}


SugokuEffect.prototype.render = function(outputTarget,count){
  GL.framebuffer.setRenderTarget(outputTarget);
  GL.blendFunc(GL.SRC_ALPHA,GL.ONE_MINUS_SRC_ALPHA);
  this.time++;

  for(var i=0;i<7;i++){
    var size=0.8+0.2*Math.sin((0.237+0.04*i)*this.time)
    size*=this.sizes[i];
    this.shader.use({
      texture: this.textures[i],
      rect:    [0.01*Math.sin((0.2137-0.02*i)*this.time)+(i-2.5)/4-size/2, -0.5+0.01*Math.sin((0.273+0.03*i)*this.time), size, size],
      color: [0,0,0,(1+Math.cos(2*Math.PI*this.time/(3*50)))/2],
    }).render(this.quad);
  }
}
