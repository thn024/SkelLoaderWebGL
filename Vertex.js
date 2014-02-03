function Vertex(inputWords)
{
	this.position = null;
	this.nPosition = null;
	this.normal = null;
	this.nNormal = null;
	this.color = null;
	this.texCoord = null;
	this.numAttachments = 0;
	this.jointIndex = []
	this.weight = [];

	this.setInitialPosition(inputWords);
}

Vertex.prototype.setInitialPosition = function(inputString)
{
	var xVal =parseFloat(inputString[0]);
	var yVal =parseFloat(inputString[1]);
	var zVal =parseFloat(inputString[2]);
	this.position = new THREE.Vector3(xVal, yVal, zVal);
}

Vertex.prototype.setNormal = function(inputString)
{
	var xVal =parseFloat(inputString[0]);
	var yVal =parseFloat(inputString[1]);
	var zVal =parseFloat(inputString[2]);
	this.normal = new THREE.Vector3(xVal, yVal, zVal);
}

Vertex.prototype.setSkinWeights = function(inputString)
{
	this.numAttachments = parseInt(inputString[0]);
	var total = this.numAttachments*2+1;
	//console.log(inputString);
	for(var i = 1; i < total; i = i + 2)
	{
		this.jointIndex.push(parseFloat(inputString[i]));
		this.weight.push(parseFloat(inputString[i+1]));
	}
}

Vertex.prototype.prep = function(inputSkeleton, inputMatrixBuffer)
{
	this.handlePos(inputSkeleton, inputMatrixBuffer);
}

var debugPos; var debugPos2; var debugM; var debugI;
	//determine the new vertex position
Vertex.prototype.handlePos = function(inputSkeleton, inputMatrixBuffer)
{
	//go through the list of matricies
	//console.log("old position : ")
	//console.log(this.position);
	var iBuffer = [];
	for(var i = 0; i < this.jointIndex.length; i++)
	{
		
		//grab the weight that we want to multiply as a scalar
		var weight = this.weight[i];

		//grab the index of the world matrix we want from the vertex data
		var worldIndex = this.jointIndex[i];

		//get the world matrix for the index we want
		//console.log("worldIndex : " + worldIndex);
		//console.log("wordIndex == " + worldIndex);
		var currentWorldMatrix = inputSkeleton.getWorldMatrix(worldIndex).clone();

		//grab the binding matrix for the same worldIndex
		var bindingMatrix = inputMatrixBuffer[worldIndex].clone();

		//console.log("worldM : ");
		//console.log(currentWorldMatrix.elements);
		//grab the inverse of the binding matrix
		var invBindingMatrix = bindingMatrix.getInverse(bindingMatrix).clone();

		//console.log("invM :");
		//console.log(invBindingMatrix.elements);
		

		//multiply: (weight)(WorldMatrix)(invBindingMatrix), pop it onto the buffer stack
		var temp = currentWorldMatrix.multiply(invBindingMatrix).clone();
		debugM = currentWorldMatrix;
		//console.log("before scale")
		//console.log(temp.elements);
		
		temp = temp.multiplyScalar(weight);
		//console.log("after scale");
		//console.log(temp.elements);
		debugI = temp.clone();
		iBuffer.push(temp);

	}
	if(iBuffer.length > 1)
	{
		debugPos = inputSkeleton.getWorldMatrix(0);
		debugPos2 = debugI;
	}
	//create an empty matrix to hold the sums
	var temp = new THREE.Matrix4();
	temp.set(0,0,0,0,
			 0,0,0,0,
			 0,0,0,0,
			 0,0,0,0);
	for(var i = 0; i < iBuffer.length; ++i)
	{
		temp = this.addMatrix(temp, iBuffer[i]);
		//console.log("doing the matrix summations");
		//console.log(temp.elements);
	}

	var newPosition = this.position.clone().applyMatrix4(temp);
	var newNormal = this.normal.clone().applyMatrix4(temp);
	newNormal.normalize();

	//console.log(newPosition);
	this.nPosition = newPosition.clone();
	this.nNormal = newNormal.clone();
	//after you finish getting each 

}

Vertex.prototype.addMatrix = function(matrix1, matrix2)
{
	//console.log("adding:")
	//console.log(matrix1.elements);
	//console.log(matrix2.elements);
	val = []
	for(var i = 0; i < 16; i++)
	{
		val[i] = matrix1.elements[i] + matrix2.elements[i];
	}
	var tempM = new THREE.Matrix4();
	tempM.set(	val[0], val[4], val[8], val[12],
				val[1], val[5], val[9], val[13],
				val[2], val[6], val[10], val[14],
				val[3], val[7], val[11], val[15])
	return tempM;
}