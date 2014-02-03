function Skin(inputName)
{
	this.name = inputName;
	this.vertexBuffer = [];
	this.indexBuffer = [];
	this.matrixBuffer = [];
}

//for each different block of data, store the data into the corresponding buffers
Skin.prototype.handleInput = function(inputState, inputString, inputIndex)
{
	switch(inputState)
	{
		case 'positions':
			this.addVertex(new Vertex(inputString));
		case 'normals':
			this.addIndex(inputString, inputIndex);
		case 'skinweights':
		case 'triangles':
		case 'bindings':
		case 'matrix':
			break;
		default:
			console.log("i think there was something wrong in handling the input");
			break;
	}
}

Skin.prototype.addVertex = function(inputVertex)
{
	this.vertexBuffer.push(inputVertex);
}

Skin.prototype.addIndex = function(inputString)
{
	var xVal =parseFloat(inputString[0]);
	var yVal =parseFloat(inputString[1]);
	var zVal =parseFloat(inputString[2]);
	this.indexBuffer.push()
}