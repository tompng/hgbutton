var LifeGame = {}
LifeGame.load = function(){
	this.calcShader = new ShaderObject({vert: 'vertex.vert', frag: 'calc.frag'});
	this.noiseShader = new ShaderObject({vert: 'vertex.vert', frag: 'noise.frag'});
	this.renderShader = new ShaderObject({vert: 'vertex.vert', frag: 'render.frag'});
	this.quad = new ArrayBufferObject(2, [-1,-1,1,-1,1,1,-1,1]);
}
LifeGame.render = function(target){
	this.noiseShader.use({
		rand:Math.random()
	}).render(GL.TRIANGLE_FAN, 4, {vertex: this.quad});
}
