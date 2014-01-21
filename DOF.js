/**
 * @author Thinh Nguyen / http://ThinhN.com/
 */

function DOF(inputWords)
{
	this.value = null;
	this.min = null;
	this.max = null;
	this.dType = inputWords[0];
	switch (inputWords[0])
	{
		case 'offset':
		case 'boxmin':
		case 'boxmax':
		case 'pose':
			this.setValue(inputWords[1], inputWords[2], inputWords[3]);
			break;
		case 'rotxlimit':
		case 'rotylimit':
		case 'rotzlimit':
			this.setMinMax(inputWords[1], inputWords[2])
			break;
		default: console.log("error parsing a DOF");
			break;
	}
}

DOF.prototype.getValue = function()
{
	return this.value;
}

DOF.prototype.getMinMax = function()
{
	return [this.min, this.max];
}

DOF.prototype.setValue = function(inputX, inputY, inputZ)
{
	xValue = parseFloat(inputX);
	yValue = parseFloat(inputY);
	zValue = parseFloat(inputZ);
	this.value = new THREE.Vector4(xValue, yValue, zValue, 1);
}

DOF.prototype.setMinMax = function(inputMin, inputMax)
{
	this.min = inputMin;
	this.max = inputMax;
}