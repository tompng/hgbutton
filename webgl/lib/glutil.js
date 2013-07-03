//size width, height, color, format, wrap_s, wrap_t, wrap, filter, image, mipmap
function TextureObject(options)
  var width = options.size || opitons.width;
  var height = options.size || options.height;
  var color = options.color || GL.RGBA;
  var format = options.format || GL.UNSIGNED_BYTE;
  var wrap_s = options.wrap_s || options.wrap || GL.REPEAT;
  var wrap_t = options.wrap_t || options.wrap || GL.REPEAT;
  var mag_filter = options.filter || options.mag_filter;
  var min_filter = options.filter || options.min_filter;
  var texture = GL.createTexture();
  GL.bindTexture(GL.TEXTURE_2D, texture);
  GL.texImage2D(GL.TEXTURE_2D, 0, color, width, height, 0, color, format, options.image);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, wrap_s);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, wrap_t);
  if(options.mipmap){
    mag_filter = mag_filter || GL.LINEAR;
    min_filter = min_filter || GL.LINEAR_MIPMAP_NEAREST;
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, mag_filter || GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, min_filter || GL.LINEAR_MIPMAP_NEAREST);
    GL.generateMipmap(GL.TEXTURE_2D);
  }else{
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, mag_filter || GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, min_filter || GL.LINEAR);
  }
  if(options.mipmap)GL.generateMipmap(GL.TEXTURE_2D);
  GL.bindTexture(GL.TEXTURE_2D, null);
  this.texture = texture;
  this.width = width;
  this.heigh = height;
}
TextureObject.prototype.setLinear = function(flag){
  var filter = flag == false ? GL.LINEAR : GL.NEAREST;
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, filter);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, filter);
}
TextureObject.prototype.setNearest = function(flag){
  var filter = flag == false ? GL.NEAREST : GL.LINEAR;
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, filter);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, filter);
}

function ArrayBufferObject(dim, array32){
  this.dimension = dim;
  this.arrayBuffer = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, this.arrayBuffer);
  GL.bufferData(GL.ARRAY_BUFFER, array32, GL.STATIC_DRAW);
}

function FrameBufferObject(fb){
  this.framebuffer = fb;
}
FrameBufferObject.prototype.setTarget = function(texture, options){
  GL.bindFramebuffer(GL.FRAMEBUFFER, this.framebuffer);
  GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, texture.texture, 0);
  options = options || {}
  var x = options.x || 0;
  var y = options.y || 0;
  var width = options.width || texture.width;
  var height = options.height || texture.height;
  GL.viewport(x, y, width, height);
}
