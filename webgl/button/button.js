var GL,FB;
function start(){
  var flag=false;
  var canvas=document.getElementById("webglcanvas");
  canvas.style.position='absolute';
  canvas.style.left=canvas.style.top=0;
  canvas.style.opacity=0.2
  var state=false;
  function check(e){
    var w=canvas.width;
    var x=(e.pageX-canvas.width/2)/(w/4*1000/1024);
    var y=(e.pageY-canvas.height/2)/(w/4*1000/1024);
    var r=80/1000,h=400/1000;
    if(-1<x&&x<1&&-h+r<y&&y<h-r)return true;
    if(-1+r<x&&x<1-r&&-h<y&&y<h)return true;
    if(x<0)x+=1-r;if(0<x)x-=1-r;
    if(y<0)y+=h-r;if(0<y)y-=h-r;
    return x*x+y*y<r*r;
  }
  function stateChange(flag){
    state=flag;
    if(state)buttonOver();
    else buttonOut();
  }
  canvas.onmousemove=function(e){
    var s2=check(e);
    if(state!=s2)stateChange(s2);
  }
  canvas.onmouseout=function(){if(state)stateChage(false);}
  canvas.onmousedown=function(){buttonClicked();}
  GL=canvas.getContext("experimental-webgl");
  if(!GL)return;
  document.body.className="webgl";
  GL.framebuffer=new FrameBufferObject();
  var renderTarget;
  window.onresize=function(){
    canvas.width=innerWidth;
    canvas.height=innerHeight;
    renderTarget = new RenderTarget({width: canvas.width, height: canvas.width,x:0,y:-(canvas.width-canvas.height)/2});
    GL.framebuffer.setRenderTarget(renderTarget);
  }
  load();
  window.onresize();
  GL.clearColor(0,0,0,1)
  GL.clear(GL.COLOR_BUFFER_BIT);
  GL.disable(GL.DEPTH_TEST);
  GL.enable(GL.BLEND);
  render(0,0,0);
}
function load(){}

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
  clickEffect.dest=1;
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
    overEffect.value-=dt;
    if(overEffect.value<0)overEffect.value=0;
  }
  var e1=Math.exp(-5*dt);
  clickEffect.value=clickEffect.value*e1+(1-e1)*clickEffect.dest;
  clickEffect.dest*=Math.exp(-dt/2);
  var threshold=1/256;
  if(clickEffect.value<threshold&&clickEffect.dest<threshold){
    clickEffect.value=clickEffect.dest=0;
  }
  if(clickEffect.value+clickEffect.dest+overEffect.value+overEffect.dest==0){
    renderFlag=false;
  }else{
    render(ctime-time0,overEffect.value,clickEffect.value);
    setTimeout(_render,16);
  }
}


function render(time,ovalue,cvalue){
  GL.clearColor(ovalue,cvalue,0,1)
  GL.clear(GL.COLOR_BUFFER_BIT);
}



