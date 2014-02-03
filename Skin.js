function Skin(inputName, inputSkeleton)
{
	this.name = inputName;
	this.skeleton = inputSkeleton;
	this.vertexBuffer = [];
	this.indexBuffer = [];
	this.matrixBuffer = [];
	this.tempString = [];
	
	this.object3D = new THREE.Object3D();
	this.visibility = false;
	this.object3D.visible = false;
	scene.add(this.object3D);
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
	
	//add each individual triangle into the scene, exetremely slow?
	/*
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

		//var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
		var material = new THREE.MeshPhongMaterial( { color: 0xffffff, ambient: 0x444444 } );
		material.side = THREE.DoubleSide;
		this.mesh = new THREE.Mesh(geometry, material);

		scene.add(this.mesh);

		debugDraw = geometry;
	}
	*/

	var geometry = new THREE.Geometry();
	var tNormalBuffer = [];
	for(var i = 0; i < this.vertexBuffer.length; ++i)
	{
		//fill up the vertex buffer
		geometry.vertices.push(this.vertexBuffer[i].position);
		tNormalBuffer.push(this.vertexBuffer[i].normal);
	}

	for(var i = 0; i < this.indexBuffer.length; ++i)
	{
		var index1 = this.indexBuffer[i][0];
		var index2 = this.indexBuffer[i][1];
		var index3 = this.indexBuffer[i][2];

		//make the face from those 3 vertices
		geometry.faces.push(new THREE.Face3(index1, index2, index3));

		//set the normals for each vertex

		geometry.faces[i].vertexNormals[0] = tNormalBuffer[index1];
		geometry.faces[i].vertexNormals[1] = tNormalBuffer[index2];
		geometry.faces[i].vertexNormals[2] = tNormalBuffer[index3];

		
		

		

		debugDraw = geometry;
	}

	//var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
	var material = new THREE.MeshPhongMaterial( { color: 0xffffff, ambient: 0x444444, transparent: false} );
	//material.side = THREE.DoubleSide;

	this.mesh = new THREE.Mesh(geometry, material);
	this.object3D.add(this.mesh);
}

Skin.prototype.toggleVisibility = function()
{
	this.visibility = !this.visibility;
	this.object3D.visible = this.visibility;
}