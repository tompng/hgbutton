var GL,FB;
function start(effectClass,baseURL){
  var flag=false;
  document.body.onclick=function(){flag=true;}
  document.body.onkeydown=function(){flag=true;}
  var canvas=document.getElementById("webglcanvas");
  canvas.style.position='absolute';
  canvas.style.left=canvas.style.top=0;
  GL=canvas.getContext("experimental-webgl");
  GL.framebuffer=new FrameBufferObject();
  var renderTarget;
  window.onresize=function(){
    canvas.width=innerWidth;
    canvas.height=innerHeight;
    renderTarget = new RenderTarget({width: canvas.width, height: canvas.width,x:0,y:-(canvas.width-canvas.height)/2});
    GL.framebuffer.setRenderTarget(renderTarget);
  }
  window.onresize();
  GL.clearColor(0,0,0,1)
  GL.clear(GL.COLOR_BUFFER_BIT);
  GL.disable(GL.DEPTH_TEST);
  GL.enable(GL.BLEND);
  var effect = new effectClass(baseURL);
  effect.render(renderTarget,1);
  var t=new Date();
  setInterval(function(){
    GL.clear(GL.COLOR_BUFFER_BIT);
    if(flag&&(new Date()-1000/10>t)){
      effect.render(renderTarget,1);
      flag=false;
      t=new Date();
    }else effect.render(renderTarget,0);
  },10)
}
