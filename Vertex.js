function Vertex(inputWords)
{
	this.position = null;
	this.normal = null;
	this.color = null;
	this.texCoord = null;
	this.numAttachments = 0;
	this.jointIndex = 0;
	this.weight = null;

	this.setPosition(inputWords);
}

Vertex.prototype.setPosition = function(inputString)
{
	var xVal =parseFloat(inputString[0]);
	var yVal =parseFloat(inputString[1]);
	var zVal =parseFloat(inputString[2]);
	this.position = new THREE.Vector4(xVal, yVal, zVal, 1);
}