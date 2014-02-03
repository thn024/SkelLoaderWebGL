function Vertex(inputWords)
{
	this.position = null;
	this.normal = null;
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
	this.position = new THREE.Vector4(xVal, yVal, zVal, 1);
}

Vertex.prototype.setNormal = function(inputString)
{
	var xVal =parseFloat(inputString[0]);
	var yVal =parseFloat(inputString[1]);
	var zVal =parseFloat(inputString[2]);
	this.normal = new THREE.Vector4(xVal, yVal, zVal, 1);
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