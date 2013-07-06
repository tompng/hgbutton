//size width, height, color, format, wrap_s, wrap_t, wrap, filter, image, mipmap
function TextureObject(options){
  var width = options.size || options.width || (options.image && options.image.width);
  var height = options.size || options.height || (options.image && options.image.height);
  var color = options.color || GL.RGBA;
  var format = options.format || GL.UNSIGNED_BYTE;
  var wrap_s = options.wrap_s || options.wrap || GL.REPEAT;
  var wrap_t = options.wrap_t || options.wrap || GL.REPEAT;
  var mag_filter = options.filter || options.mag_filter;
  var min_filter = options.filter || options.min_filter;
  var texture = GL.createTexture();
  var image = options.image || null;
  GL.bindTexture(GL.TEXTURE_2D, texture);
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
  if(image){
    if(image.complete == false){
      image.onload=function(){
        GL.texImage2D(GL.TEXTURE_2D, 0, color, color, GL.UNSIGNED_BYTE, image);
        if(options.mipmap)GL.generateMipmap(GL.TEXTURE_2D);
      }
    }else{
      GL.texImage2D(GL.TEXTURE_2D, 0, color, color, GL.UNSIGNED_BYTE, image);
      if(options.mipmap)GL.generateMipmap(GL.TEXTURE_2D);
    }
  }else{
    GL.texImage2D(GL.TEXTURE_2D, 0, color, width, height, 0, color, format, null);
  }
  GL.bindTexture(GL.TEXTURE_2D, null);
  this.texture = texture;
  this.width = width;
  this.height = height;
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

function ArrayBufferObject(dim, array){
  this.dimension = dim;
  this.arrayBuffer = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, this.arrayBuffer);
  if(!(array instanceof Float32Array)){
    array = new Float32Array(array);
  }
  GL.bufferData(GL.ARRAY_BUFFER, array, GL.STATIC_DRAW);
  GL.bindBuffer(GL.ARRAY_BUFFER, null);
}

function FrameBufferObject(){
  this.framebuffer = GL.createFramebuffer();
}
FrameBufferObject.prototype.setRenderTarget = function(renderTarget){
  this.target = renderTarget;
  if(!renderTarget.texture){
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);
  }else{
    GL.bindFramebuffer(GL.FRAMEBUFFER, this.framebuffer);
    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, renderTarget.texture.texture, 0);
  }
  GL.viewport(renderTarget.x, renderTarget.y, renderTarget.width, renderTarget.height);
}

//texture, x, y, width, height
function RenderTarget(options){
  this.texture = options.texture;
  this.x = options.x || 0;
  this.y = options.y || 0;
  this.width = options.width || options.texture.width;
  this.height = options.height || options.texture.height;
}

function Geometry(type, count, attributes){
  this.type = type;
  this.count = count;
  this.attributes = attributes;
}
