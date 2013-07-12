function createCharImage(text,size,options){
  var canvas=document.createElement("canvas");
  canvas.width=canvas.height=size;
  var g=canvas.getContext('2d');
  var font='DFMaruGothic-SB-MP-RKSJ-H';
  var lineWidth=(options&&options.lineWidth)||0;
  var lineColor=(options&&options.lineColor)||'black'
  var color=(options&&options.color)||'white';
  var background=(options&&options.background);
  g.font=size*(1-lineWidth/2)+'px '+font;
  g.textAlign='center';
  g.textBaseline='middle';
  if(background){
    g.fillStyle=background;
    g.fillRect(0,0,size,size);
  }
  if(lineWidth){
    g.lineWidth=size*lineWidth/2;
    g.strokeStyle=lineColor;
    g.strokeText(text,size/2,size/2);
  }
  g.fillStyle=color;
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
