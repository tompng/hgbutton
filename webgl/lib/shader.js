//vert, frat
function createShaderProgram(gl,options){
  var vfile = options.vert
  var ffile = options.frag
  function load(file){
    var http=new XMLHttpRequest();
    http.open("GET",file,false);
    http.send(null);
    return http.responseText;
  }
  function compile(type,input){
    var code=input.charAt(0)=="#"?document.getElementById(input.substr(1)).text:load(input);
    var shader=gl.createShader(type);
    gl.shaderSource(shader,code);
    gl.compileShader(shader);
    if(gl.getShaderParameter(shader,gl.COMPILE_STATUS))return shader;
    var log="Error compiling shader '"+input+"'\n"+gl.getShaderInfoLog(shader);
    codelines=code.split("\n");
    function itoa(i){var s="",n=codelines.length;while(n>1){s=(i%10)+s;i=Math.floor(i/10);n/=10;}return s;}
    for(var i=0;i<codelines.length;i++)log+="\n"+itoa(i+1)+"  "+codelines[i];
    gl.deleteShader(shader);
    console.log(log);
  }
  var vshader=compile(gl.VERTEX_SHADER,vfile);
  var fshader=compile(gl.FRAGMENT_SHADER,ffile);
  if(!vshader||!fshader){
    if(!vshader)console.log("failed loading vert: '"+vfile+"'");
    if(!fshader)console.log("failed loading frag: '"+ffile+"'");
    if(vshader)gl.deleteShader(vshader);
    if(fshader)gl.deleteShader(fshader);
    return null;
  }
  var program=gl.createProgram();
  gl.attachShader(program,vshader);
  gl.attachShader(program,fshader);
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
    console.log("Error in program linking '"+vfile+"' and '"+ffile+"'\n"+gl.getProgramInfoLog(program));
    if(vshader)gl.deleteShader(vshader);
    if(fshader)gl.deleteShader(fshader);
    gl.deleteProgram(program);
    return null;
  }
  program.uniform={};
  program.attribute={};
  var ulen=gl.getProgramParameter(program,gl.ACTIVE_UNIFORMS);
  var alen=gl.getProgramParameter(program,gl.ACTIVE_ATTRIBUTES);
  for(var i=0;i<alen;i++){
    var attr=gl.getActiveAttrib(program,i);
    program.attribute[attr.name]=gl.getAttribLocation(program,attr.name);
  }
  for(var i=0;i<ulen;i++){
    var uni=gl.getActiveUniform(program,i);
    program.uniform[uni.name]=gl.getUniformLocation(program,uni.name);
  }
  return program;
}
