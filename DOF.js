/**
 * @author Thinh Nguyen / http://ThinhN.com/
 */

function DOF(inputWords)
{
	this.value = new THREE.Vector4();
	this.min = null;
	this.max = null;
	this.xPose = 0;
	this.yPose = 0;
	this.zPose = 0;
	this.dType = inputWords[0];
	//console.log(inputWords);
	switch (inputWords[0])
	{
		case 'offset':
		case 'boxmin':
		case 'boxmax':
		case 'pose':
		//console.log(inputWords);
			this.setValue(inputWords[1], inputWords[2], inputWords[3]);
			break;
		case 'rotxlimit':
		case 'rotylimit':
		case 'rotzlimit':
			this.setRot(inputWords[1], inputWords[2])
			break;
		default: console.log("error parsing a DOF");
			break;
	}
}

DOF.prototype.getValue = function()
{
	//return this.value;
	return [this.xPose, this.yPose, this.zPose];
}

DOF.prototype.getValueZ = function()
{
	//return this.value;
	return this.zPose;
}

DOF.prototype.getMinMax = function()
{
	return [this.min, this.max];
}

DOF.prototype.setValue = function(inputX, inputY, inputZ)
{
	var xValue = parseFloat(inputX);
	var yValue = parseFloat(inputY);
	var zValue = parseFloat(inputZ);
	this.value.x = xValue;
	this.value.y = yValue;
	this.value.z = zValue;

	this.xPose = xValue;
	this.yPose = yValue;
	this.zPose = zValue;
	//console.log("parsed these DOF values: " + xValue + " " + yValue + " " + zValue);
}

DOF.prototype.setRot = function(inputMin, inputMax)
{
	this.min = inputMin;
	this.max = inputMax;
	//console.log("rotMin : " + inputMin);
}
var debugGUI;

DOF.prototype.setGuiValue = function(inputGui, inputName, inputFloat, min, max)
{
	var val = new DOFValue(inputName, inputFloat);
	debugGUI = inputGui;
	inputGui.add(val, 'name');
	if(min == null)
	{
		inputGui.add(val, 'value');
	}
	else
	{
		inputGui.add(val, 'value', min, max)
	}
}