function Channel()
{
	this.extrapolationType = null;
	this.numKeys = null;
	this.keys = [];
}

Channel.prototype.setExtrapolationType = function(inputWords)
{
	this.extrapolationType = [inputWords[1],inputWords[2]];
	//console.log("Setting ExtrapolationType : " + this.extrapolationType);
}

Channel.prototype.setNumKeys = function(inputWords)
{
	this.numKeys = parseFloat(inputWords[1]);
	//console.log("Number of keys in Channel : " + this.numKeys);
}

Channel.prototype.setKey = function(inputWords)
{
	var key = new Key();
	key.setTypeIn(inputWords[2]);
	key.setTypeOut(inputWords[3]);

	key.setTangentIn(parseFloat(inputWords[0]));
	key.setTangentOut(parseFloat(inputWords[1]));

	this.keys.push(key);
}

Channel.prototype.Evaluate = function(inputTime)
{

}

