//vert, frag
function ShaderObject(options){
  var vfile = options.vert
  var ffile = options.frag
  function load(file){
    var http = new XMLHttpRequest();
    http.open("GET", file, false);
    http.send(null);
    return http.responseText;
  }
  function compile(type, input){
    var code = input.charAt(0) == "#" ? document.getElementById(input.substr(1)).text : load(input);
    var shader = GL.createShader(type);
    GL.shaderSource(shader, code);
    GL.compileShader(shader);
    if(GL.getShaderParameter(shader, GL.COMPILE_STATUS))return shader;
    var log = "Error compiling shader '" + input + "'\n" + GL.getShaderInfoLog(shader);
    codelines = code.split("\n");
    var linestrlength = codelines.length.toString().length;
    for(var i = 0; i < codelines.length; i++){
      var linestr = ("0000" + (i + 1)).substr(-linestrlength, linestrlength)
      log += linestr + "  " + codelines[i] + "\n";
    }
    GL.deleteShader(shader);
    console.log(log);
  }
  var vshader = compile(GL.VERTEX_SHADER, vfile);
  var fshader = compile(GL.FRAGMENT_SHADER, ffile);
  if(!vshader || !fshader){
    if(!vshader)console.log("failed loading vert: '" + vfile + "'");
    if(!fshader)console.log("failed loading frag: '" + ffile + "'");
    if(vshader)GL.deleteShader(vshader);
    if(fshader)GL.deleteShader(fshader);
    return null;
  }
  var program = GL.createProgram();
  GL.attachShader(program, vshader);
  GL.attachShader(program, fshader);
  GL.linkProgram(program);
  if(!GL.getProgramParameter(program, GL.LINK_STATUS)){
    console.log("Error in program linking '" + vfile + "' and '" + ffile + "'\n" + GL.getProgramInfoLog(program));
    if(vshader)GL.deleteShader(vshader);
    if(fshader)GL.deleteShader(fshader);
    GL.deleteProgram(program);
    return null;
  }
  var uniforms = {};
  var attributes = {};
  var ulen = GL.getProgramParameter(program, GL.ACTIVE_UNIFORMS);
  var alen = GL.getProgramParameter(program, GL.ACTIVE_ATTRIBUTES);
  for(var i = 0; i < alen; i++){
    var attr = GL.getActiveAttrib(program, i);
    attributes[attr.name] = GL.getAttribLocation(program, attr.name);
  }
  for(var i = 0; i < ulen; i++){
    var uni = GL.getActiveUniform(program, i);
    uniforms[uni.name] = GL.getUniformLocation(program, uni.name);
  }
  this.program = program;
  this.uniforms = uniforms;
  this.attributes = attributes;
}

ShaderObject.prototype.use = function(params){
  GL.useProgram(this.program);
  var texture_index = 0;
  for(var key in params){
    var uniform = this.uniforms[key]
    if(!uniform){
      console.log('no uniform : ' + key);
    }
    var value = params[key];
    if(value instanceof TextureObject){
      GL.uniform1i(uniform, texture_index);
      GL.activeTexture(GL['TEXTURE'+texture_index]);
      GL.bindTexture(GL.TEXTURE_2D, value.texture);
      texture_index++;
    }else if(window.J3DIMatrix4 && value instanceof J3DIMatrix4){
      value.setUniform(GL, uniform);
    }else if(value.length){
      switch(value.length){
        case 2:GL.uniform2fv(uniform, value);break;
        case 3:GL.uniform3fv(uniform, value);break;
        case 4:GL.uniform4fv(uniform, value);break;
      }
    }else{
      GL.uniform1f(uniform, value);
    }
  }
  return this;
}

ShaderObject.prototype.render = function(geometry){
  for(var key in geometry.attributes){
    var abo = geometry.attributes[key];
    var attr = this.attributes[key]
    GL.enableVertexAttribArray(attr);
    GL.bindBuffer(GL.ARRAY_BUFFER, abo.arrayBuffer);
    GL.vertexAttribPointer(attr, abo.dimension, GL.FLOAT, false, 0, 0);
  }
  GL.drawArrays(geometry.type, 0, geometry.count);
}
