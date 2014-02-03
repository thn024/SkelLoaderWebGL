function Skin(inputName, inputSkeleton)
{
	this.name = inputName;
	this.skeleton = inputSkeleton;
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
	//console.log(inputString);
	//console.log(inputIndex);
	//console.log(inputMatrixIndex);
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


var debugDraw;
Skin.prototype.Draw = function()
{
	for(var i = 0; i < this.vertexBuffer.length; ++i)
	{
		this.vertexBuffer[i].prep(this.skeleton, this.matrixBuffer);
	}

	debugDraw = this.indexBuffer;
	
	for(var i = 0; i < this.indexBuffer.length; ++i)
	{
		//create the actual triangle for the geometry
		var geometry = new THREE.Geometry();
		var vert1 = this.vertexBuffer[this.indexBuffer[i][0]];
		var vert2 = this.vertexBuffer[this.indexBuffer[i][1]];
		var vert3 = this.vertexBuffer[this.indexBuffer[i][2]];

		geometry.vertices.push(vert1.position);
		geometry.vertices.push(vert2.position);
		geometry.vertices.push(vert3.position);

		//make the face from those 3 vertices
		geometry.faces.push(new THREE.Face3(0,1,2));

		//set the normals for each vertex

		geometry.faces[0].vertexNormals[0] = vert1.normal;
		geometry.faces[0].vertexNormals[1] = vert2.normal;
		geometry.faces[0].vertexNormals[2] = vert3.normal;

		var hex = 0xAAAAAAA;
		geometry.faces[0].color.setHex( hex );

		var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );

		this.mesh = new THREE.Mesh(geometry, material);

		scene.add(this.mesh);

		debugDraw = geometry;
	}
	
}

