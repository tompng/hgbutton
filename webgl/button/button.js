var GL,FB;
var mouseX=0,mouseY=0;
function start(){
  var flag=false;
  var canvas=document.getElementById("webglcanvas");
  var state=false;
  function check(e){
    var w=canvas.width;
    var x=(e.pageX-canvas.width/2)/(w/4);
    var y=(e.pageY-canvas.height/2)/(w/4);
    var r=160/1000,h=400/1000;
    mouseX=x;mouseY=y;
    if(-1<x&&x<1&&-h+r<y&&y<h-r)return true;
    if(-1+r<x&&x<1-r&&-h<y&&y<h)return true;
    if(x<0)x+=1-r;if(0<x)x-=1-r;
    if(y<0)y+=h-r;if(0<y)y-=h-r;
    return x*x+y*y<r*r;
  }
  function stateChange(flag){
    state=flag;
    if(state){
      buttonOver();
      document.body.style.cursor="pointer"
    }
    else{
      document.body.style.cursor=""
      buttonOut();
    }
  }
  canvas.onmousemove=function(e){
    var s2=check(e);
    if(state!=s2)stateChange(s2);
  }
  canvas.onmousedown=function(e){
    if(!check(e))return;
    buttonClicked();
    if(!state)stateChange(true);
  }
  document.onmouseout=window.onblur=function(){if(state)stateChange(false);}
  GL=canvas.getContext("experimental-webgl");
  if(!GL)return;
  document.body.className="webgl";
  GL.framebuffer=new FrameBufferObject();
  var renderTarget;
  window.onresize=function(){
    canvas.width=innerWidth;
    canvas.height=innerHeight;
    renderTarget=new RenderTarget({width:canvas.width,height:canvas.width,x:0,y:-(canvas.width-canvas.height)/2});
    GL.framebuffer.setRenderTarget(renderTarget);
    renderWithArg();
  }
  load();
  window.onresize();
  GL.clearColor(0,0,0,1)
}

var renderFlag=false;
var overEffect={value:0,dest:0}
var clickEffect={value:0,dest:0}
function buttonOver(){
  overEffect.dest=1;
  if(!renderFlag)_render(true);
}
function buttonOut(){
  overEffect.dest=0;
}
function buttonClicked(){
  if(window.onButtonClick)onButtonClick();
  clickEffect.dest=1;
  overEffect.value=1;
  if(!renderFlag)_render(true);
}

var time0=new Date();
var prevTime=new Date();
function _render(flag){
  var ctime=new Date();
  if(flag)prevTime=ctime;
  var dt=(ctime-prevTime)/1000;
  prevTime=ctime;
  if(overEffect.dest==1){
    overEffect.value+=dt;
    if(overEffect.value>1)overEffect.value=1;
  }else{
    overEffect.value-=dt/2;
    if(overEffect.value<0)overEffect.value=0;
  }
  var e1=Math.exp(-8*dt);
  clickEffect.value=clickEffect.value*e1+(1-e1)*clickEffect.dest;
  clickEffect.dest*=Math.exp(-4*dt);
  var threshold=1/256;
  if(clickEffect.value<threshold&&clickEffect.dest<threshold){
    clickEffect.value=clickEffect.dest=0;
  }
  if(clickEffect.value+clickEffect.dest+overEffect.value+overEffect.dest==0){
    renderFlag=false;
  }else{
    renderFlag=true;
    renderWithArg();
    setTimeout(_render,16);
  }
}
function renderWithArg(){
  var ctime=new Date();
  render((ctime-time0)/1000,overEffect.value,clickEffect.value);
}

var texture,text,shader,quad,wave,lgeom;
function load(){
  texture=new TextureObject({image:'glbutton.png',mipmap:true});
  text=new TextureObject({image:'button.png',mipmap:true});
  shader=new ShaderObject({vert:'button.vert',frag:'button.frag'});
  light=new ShaderObject({vert:'light.vert',frag:'light.frag'});
  wave=new TextureObject({image:'../effects/blur/wave.jpg'})
  var quadVertex=new ArrayBufferObject(2, [-1, -1, 1, -1, 1, 1, -1, 1]);
  quad=new Geometry(GL.TRIANGLE_FAN,4,{vertex:quadVertex});
  var larr=[];
  var N=1000;
  for(var i=0;i<N;i++){
    larr.push(0,2*Math.PI*(i+0.5)/N,(i+0.5)/N);
    larr.push(2,2*Math.PI*i/N,i/N);
    larr.push(2,2*Math.PI*(i+1)/N,(i+1)/N);
  }
  lgeom=new Geometry(GL.TRIANGLES,3*N,{vertex:new ArrayBufferObject(3,larr)}); 
  texture.onload=text.onload=shader.onload=light.onload=function(){
    renderWithArg();
  }
}

function render(time,ovalue,cvalue){
  GL.clearColor(ovalue,cvalue,0,1)
  GL.clearColor(0,0,0,1)
  GL.clear(GL.COLOR_BUFFER_BIT);
  GL.enable(GL.BLEND);
  GL.blendFunc(GL.ONE, GL.ONE);
  function col(t){
    t=2*Math.PI*t;
    return Math.min(1,Math.max(0.2,0.5+0.8*Math.cos(t)));
  }
  if(cvalue){
    light.use({
      time: time,
      texture: wave,
      rgb: [col(0.1*time),col(0.1*time+1/3),col(0.1*time+2/3)],
      phase: cvalue
    }).render(lgeom);
  }
  GL.blendFuncSeparate(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA, GL.ZERO, GL.ONE);
  shader.use({
    time: time,
    wave: wave,
    phase: ovalue,
    active: cvalue,
    texture: texture,
    text: text,
    mouse: [Math.max(Math.min(1,mouseX),-1),Math.max(Math.min(0.25,mouseY),-0.25)],
    rect:[-0.5*1.024,-0.25*1.024,1.024,0.5*1.024]
  }).render(quad);
}


