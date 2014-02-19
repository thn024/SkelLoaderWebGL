function Key()
{
	this.typeIn = null;
	this.typeOut = null;
	this.time = null;
	this.value = null;
}

Key.prototype.setTypeIn = function(inputWords)
{
	this.typeIn = inputWords;
}

Key.prototype.setTypeOut = function(inputWords)
{
	this.typeOut = inputWords;
}

Key.prototype.setTime = function(inputTimeIn)
{
	this.time = inputTimeIn;
}

Key.prototype.setValue = function(inputValueIn)
{
	this.value = inputValueIn;
}
