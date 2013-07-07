var ParticleLarge = function(){
  this.size = 512;
  this.shader = new ShaderObject({ vert: 'particle.vert', frag: 'particle.frag' });
  this.textures = [
    new TextureObject({ image: createCharImage('は', 128) }),
    new TextureObject({ image: createCharImage('ご', 128) }),
    new TextureObject({ image: createCharImage('ー', 128) })
  ];
  this.projection=new J3DIMatrix4();
  this.projection.frustum(-0.1,0.1,-0.1,0.1,0.2,100);
  this.time = 0;
  this.geoms = [
    this.createGeometry('は'),
    this.createGeometry('ご'),
    this.createGeometry('ー')
  ]
}

ParticleLarge.prototype.createGeometry = function(text){
  var num = 10000;
  var deltas = [], sqrt3 = Math.sqrt(3);
  for(var i = 0; i < num; i++){
    deltas.push(-sqrt3, -1);
    deltas.push(sqrt3, -1);
    deltas.push(0, 2);
  }
  var params = {};
  params.delta = new ArrayBufferObject(2, deltas);

  var data = new CanvasData(createCharImage(text, 128));

  for(var i = 0; i < 5; i++){
    var rands=[];
    for(var j=0;j<num;){
      var z = 2 * Math.random() - 1, t = 2 * Math.PI * Math.random(), r = Math.sqrt(1 - z * z);
      var x = r * Math.cos(t), y = r * Math.sin(t);
      x=Math.random()-0.5;
      y=Math.random()-0.5;
      z=(Math.random()-0.5)*0.1;
      var color = data.get((0.5+x)*data.width,(0.5+y)*data.height);
      if(color.a*color.r > 0.5){
        rands.push(x, -y, z);
        rands.push(x, -y, z);
        rands.push(x, -y, z);
        j++;
      }
    }
    params['random' + i] = new ArrayBufferObject(3, rands);
  }
  return new Geometry(GL.TRIANGLES, num, params);
}

ParticleLarge.prototype.render = function(){
  GL.clearColor(0,0,0,1);
  GL.clear(GL.COLOR_BUFFER_BIT);
  GL.enable(GL.BLEND);
  GL.blendFunc(GL.ONE,GL.ONE);
  this.time += 0.02;
  var modelview;
  
  for(var i=0;i<3;i++){
    modelview=new J3DIMatrix4();
    modelview.translate(-1+i,0,-3);
    modelview.rotate(20*this.time,Math.cos(0.01*(1+i)*this.time),Math.cos(1+0.15*(1+i)*this.time),Math.cos(2+0.17*(1+i)*this.time));
    this.shader.use({
      modelview: modelview,
      projection: this.projection,
      size: 0.02,
      time: Math.cos(this.time)
    }).render(this.geoms[i]);
  }
}
