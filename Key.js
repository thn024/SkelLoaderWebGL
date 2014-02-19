function Key()
{
	this.typeIn = null;
	this.typeOut = null;
	this.tangentIn = null;
	this.tangentOut = null;
}

Key.prototype.setTypeIn = function(inputWords)
{
	this.typeIn = inputWords;
}

Key.prototype.setTypeOut = function(inputWords)
{
	this.typeOut = inputWords;
}

Key.prototype.setTangentIn = function(inputTangentIn)
{
	this.tangentIn = inputTangentIn;
}

Key.prototype.setTangentOut = function(inputTangentOut)
{
	this.tangentOut = inputTangentOut;
}
