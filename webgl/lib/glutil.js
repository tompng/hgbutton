//width, height, color, format, wrap_s, wrap_t, wrap, filter, image, mipmap
function TextureObject(gl, options)
  var width = opitons.width;
  var height = options.height;
  var color = options.color || gl.RGBA;
  var format = options.format || gl.UNSIGNED_BYTE;
  var wrap_s = options.wrap_s || options.wrap || gl.REPEAT;
  var wrap_t = options.wrap_t || options.wrap || gl.REPEAT;
  var mag_filter = options.filter || options.mag_filter || gl.NEAREST;
  var min_filter = options.filter || options.min_filter || gl.NEAREST;
  var texture=gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D,texture);
  gl.texImage2D(gl.TEXTURE_2D,0,color,width,height,0,color,format,options.image);
  if(options.mipmap){
    mag_filter = gl.LINEAR;
    min_filter = gl.LINEAR_MIPMAP_NEAREST;
  }
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,mag_filter);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,min_filter);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,wrap_s);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,wrap_t);
  if(options.mipmap)gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D,null);
  this.texture = texture;
  this.width = width;
  this.heigh = height;
}

function ArrayBufferObject(gl,dim,array32){
  this.dimension=dim;
  this.arrayBuffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,this.arrayBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,array32,gl.STATIC_DRAW);
}

function FrameBufferObject(fb){
  this.gl=gl;
  this.framebuffer=fb;
}
FrameBufferObject.prototype.setTarget=function(texture,options){
  var gl=this.gl;
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.texture,0);
  options = options || {}
  var x = options.x || 0;
  var y = options.y || 0;
  var width = options.width || texture.width;
  var height = options.height || texture.height;
  gl.viewport(x, y, width, height);
}
