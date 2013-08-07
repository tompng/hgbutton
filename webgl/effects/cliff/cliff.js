var CliffEffect = function(url){
  if(!url)url = ""
  this.baseURL = url;
  this.size = 512;
  this.shader    = new ShaderObject({vert: url+'nmap.vert', frag: url+'nmap.frag'});
  this.normal = new TextureObject({image: url+"norm.jpg"});
  this.texture = new TextureObject({image: url+"texture.jpg"});

  var himg = new Image();
  himg.src = url+"geom.jpg";
  var self = this;
  himg.onload = function(){self.createGeometry(himg);}
}


CliffEffect.prototype.createGeometry = function(img){
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0);
  var data = new CanvasData(canvas);
  var vertex = [];
  var texcoord = [];
  var W = img.width/8;
  var H = img.height/8;
  function get(ix,iy){
    var x=ix*img.width/W;
    var y=iy*img.height/H;
    if(x<0)x=0;
    if(x>=img.width)x=img.width-1;
    y=(y%img.height+img.height)%img.height;
    return data.get(x,y).r/10*2;
  }
  for(var iy=0;iy<H;iy+=2){
    for(var ix=0;ix<=W;ix++){
      texcoord.push(ix/W,(H-iy-1)/H);
      texcoord.push(ix/W,(H-iy-2)/H);
      vertex.push(ix/W-0.5,iy/W-1,get(ix,H-iy-1));
      vertex.push(ix/W-0.5,(iy+1)/W-1,get(ix,H-iy-2));
    }
    for(var ix=W;ix>=0;ix--){
      texcoord.push(ix/W,(H-iy-2)/H);
      texcoord.push(ix/W,(H-iy-3)/H);
      vertex.push(ix/W-0.5,(iy+1)/W-1,get(ix,H-iy-2));
      vertex.push(ix/W-0.5,(iy+2)/W-1,get(ix,H-iy-3));
    }
  }
  var vbuf = new ArrayBufferObject(3, vertex);
  var tbuf = new ArrayBufferObject(2, texcoord);
  this.geometry = new Geometry(GL.TRIANGLE_STRIP, texcoord.length/2, { vertex: vbuf, texcoord: tbuf });
  this.time0=new Date();
}



CliffEffect.prototype.render = function(outputTarget){
  if(!this.geometry)return;
  GL.framebuffer.setRenderTarget(outputTarget);
  GL.blendFunc(GL.ONE,GL.ZERO);
  GL.clear(GL.DEPTH_BUFFER_BIT);
  GL.enable(GL.DEPTH_TEST);
  var lx,ly,lz;
  var time=(new Date()-this.time0)/1000;
  var tscale=0.2;
  lx=
    Math.sin(1.1*tscale*time)+
    Math.sin(1.3*tscale*time)+
    Math.sin(1.5*tscale*time)+
    Math.sin(1.7*tscale*time)+
    Math.sin(1.9*tscale*time)+
    Math.sin(2.3*tscale*time);
  ly=1+
    Math.sin(1.2*tscale*time)+
    Math.sin(1.7*tscale*time)+
    Math.sin(2.1*tscale*time);
  lz=1;
  var lr=Math.sqrt(lx*lx+ly*ly+lz*lz);
  for(var i=-1;i<=1;i++){
    var y=0.02*time%4-2;
    if(CliffEffect.y!=undefined){y=(y+2+CliffEffect.y)%4-2;}
    this.shader.use({
      light: [lx/lr,ly/lr,lz/lr],
      position: [0,y+4*i,-0.5],
      normal: this.normal,
      texture: this.texture
    }).render(this.geometry);
  }
  GL.disable(GL.DEPTH_TEST);
}
