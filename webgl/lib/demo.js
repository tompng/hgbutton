var GL,FB;
function start(effectClass){
  var flag=false;
  document.body.onclick=function(){flag=true;}
  document.body.onkeydown=function(){flag=true;}
  var canvas=document.getElementById("webglcanvas");
  GL=canvas.getContext("experimental-webgl");
  GL.framebuffer=new FrameBufferObject();
  var renderTarget = new RenderTarget({width: canvas.width, height: canvas.height});
  GL.framebuffer.setRenderTarget(renderTarget);
  GL.clearColor(0,1,0,1)
  GL.clear(GL.COLOR_BUFFER_BIT);
  GL.disable(GL.DEPTH_TEST);
  var effect = new effectClass();
  effect.render(renderTarget,1);
  var t=new Date();
  setInterval(function(){
    if(flag&&(new Date()-1000/10>t)){
      effect.render(renderTarget,1);
      flag=false;
      t=new Date();
    }else effect.render(renderTarget,0);
  },10)
}
