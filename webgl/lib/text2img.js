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
  var img=new Image();
  img.src=canvas.toDataURL();
  return img;
}
