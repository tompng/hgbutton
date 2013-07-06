function createCharImage(text,size){
  var canvas=document.createElement("canvas");
  canvas.width=canvas.height=size;
  var g=canvas.getContext('2d');
  var font='DFMaruGothic-SB-MP-RKSJ-H';
  g.font=size*7/8+'px '+font;
  g.textAlign='center';
  g.textBaseline='middle';
  g.fillStyle='white';
  g.strokeStyle='black';
  g.lineWidth=size/8;
  g.strokeText(text,size/2,size/2);
  g.fillText(text,size/2,size/2);
  return canvas;
}

function CanvasData(canvas){
  this.width=canvas.width;
  this.height=canvas.height;
  var g=canvas.getContext('2d')
  this.data=g.getImageData(0,0,this.width,this.height).data;
}
CanvasData.prototype.get=function(x,y){
  var index=4*(this.width*(y|0)+(x|0));
  return {
    r:this.data[index+0]/255,
    g:this.data[index+1]/255,
    b:this.data[index+2]/255,
    a:this.data[index+3]/255
  };
}
