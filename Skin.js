function Skin(inputName)
{
	this.name = inputName;
	this.vertexBuffer = [];
	this.indexBuffer = [];
	this.matrixBuffer = [];

	this.tempString = [];
}

//for each different block of data, store the data into the corresponding buffers
Skin.prototype.handleInput = function(inputState, inputString, inputIndex, inputMatrixIndex)
{
	switch(inputState)
	{
		case 'positions':
			this.addVertex(new Vertex(inputString)); break;
		case 'normals':
			this.addNormal(inputString, inputIndex); break;
		case 'skinweights':
			this.addSkinWeights(inputString, inputIndex); break;
		case 'triangles':
			this.addTriangle(inputString, inputIndex); break;
		case 'bindings':
			console.log("preparing to do some bindings"); break;
		case 'matrix':
			this.addMatrix(inputString, inputIndex, inputMatrixIndex); break;
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

Skin.prototype.addNormal = function(inputString, inputIndex)
{
	//store the values of the normal into the corresponding vertex
	this.vertexBuffer[inputIndex].setNormal(inputString);
}

Skin.prototype.addSkinWeights = function(inputString, inputIndex)
{
	//store the values of the normal into the corresponding vertex
	this.vertexBuffer[inputIndex].setSkinWeights(inputString);
}

Skin.prototype.addTriangle = function(inputString, inputIndex)
{
	var vert1 = parseInt(inputString[0]);
	var vert2 = parseInt(inputString[1]);
	var vert3 = parseInt(inputString[2]);
	this.indexBuffer.push([vert1, vert2, vert3]);
	//console.log(inputString);
}

Skin.prototype.addMatrix = function(inputString, inputIndex, inputMatrixIndex)
{
	console.log(inputString);
	console.log(inputIndex);
	console.log(inputMatrixIndex);
	switch(inputMatrixIndex)
	{
		case 0:
			//create a new matrix for you to push into the matrix buffer
			this.matrixBuffer.push(new THREE.Matrix4());
			this.tempString = this.tempString.concat(inputString); break;
		case 1:
			this.tempString = this.tempString.concat(inputString); break;
		case 2:
			this.tempString = this.tempString.concat(inputString); break;
		case 3:
			this.tempString = this.tempString.concat(inputString);
			//done concatenating all the matrix elements, now set the matrix elements
			//console.log("the temp string is : " + this.tempString);
			
			
			
			this.matrixBuffer[inputIndex].set(
			parseFloat(this.tempString[0]), parseFloat(this.tempString[3]), parseFloat(this.tempString[6]), parseFloat(this.tempString[9]),
			parseFloat(this.tempString[1]), parseFloat(this.tempString[4]), parseFloat(this.tempString[7]), parseFloat(this.tempString[10]),
			parseFloat(this.tempString[2]), parseFloat(this.tempString[5]), parseFloat(this.tempString[8]), parseFloat(this.tempString[11]),
			0, 0, 0, 1)
			
			//this is column major code that failed
			/*
			this.matrixBuffer[inputIndex].set(
			parseFloat(this.tempString[0]), parseFloat(this.tempString[4]), parseFloat(this.tempString[8]), 10,
			parseFloat(this.tempString[1]), parseFloat(this.tempString[5]), parseFloat(this.tempString[9]), 10,
			parseFloat(this.tempString[2]), parseFloat(this.tempString[6]), parseFloat(this.tempString[10]), 10,
			parseFloat(this.tempString[3]), parseFloat(this.tempString[7]), parseFloat(this.tempString[11]), 1)
			*/

			
			//reset the tempstring to be null for the next matrix parsing;
			this.tempString = [];
			break;
		default: "probably parsed matrix wrong"; break;
	}
}