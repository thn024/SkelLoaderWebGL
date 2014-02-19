function Animation(inputName, inputSkeleton)
{
	this.name = inputName;
	this.skeleton = inputSkeleton;
	this.vertexBuffer = [];
	this.indexBuffer = [];
	this.matrixBuffer = [];
	this.tempString = [];

	this.timeRange = [0,0];
	this.numChannels = -1;
	this.channels = [];
}

Animation.prototype.setTimeRange = function(inputString)
{
	var min = parseFloat(inputString[1]);
	var max = parseFloat(inputString[2]);
	this.timeRange = [min, max];
	console.log("TOTAL TIME RANGE : " + this.timeRange);
}

Animation.prototype.setNumChannels = function(inputString)
{
	var numChannel = parseFloat(inputString[1]);
	this.numChannels = numChannel;
	console.log("TOTAL CHANNELS : " + this.numChannels);
}

Animation.prototype.addChannel = function(inputChannel)
{
	this.channels.push(inputChannel);
}