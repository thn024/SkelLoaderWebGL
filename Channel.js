function Channel(inputSkeleton, inputIndex)
{
	this.extrapolationType = null;
	this.numKeys = null;
	this.keys = [];
	this.skeleton = inputSkeleton;
	this.jointIndex = -1;
	//if this is the first 3 root translations
	console.log(inputIndex);
	if(inputIndex == 0 || inputIndex == 1 || inputIndex == 2)
	{
		this.jointIndex = Math.floor((inputIndex)/3);
	}
	else
	{
		this.jointIndex = Math.floor((inputIndex - 3)/3);
	}
	this.DOFIndex = inputIndex % 3;
	this.inputIndex = inputIndex;
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

	key.setTime(parseFloat(inputWords[0]));
	key.setValue(parseFloat(inputWords[1]));

	this.keys.push(key);
}
var debugAnim;
var debugAres;
Channel.prototype.Evaluate = function(inputTime)
{
	//set up the time vector
	var timeVec = new THREE.Vector4();
	timeVec.setX(inputTime*inputTime*inputTime);
	timeVec.setY(inputTime*inputTime);
	timeVec.setZ(inputTime);
	timeVec.setW(1);

	var a,b,c,d;

	//set up the inverse matrix
	var mat = new THREE.Matrix4();
	mat.set(	2,-2,1,1,
				-3,3,-2,-1,
				0,0,1,0,
				1,0,0,0	);

	//grab the positions
	//get the joint that this channel corresponds to
	var tempJoint = this.skeleton.getJoint(this.jointIndex);
	debugAnim = tempJoint;
	
	var initialPose = null;

	var tempLower = tempLower = this.keys[0];
	var tempUpper = 4;
	var result;
	var currentKey
	var exact = false;

	//if the time is before the first key's time
	if(inputTime < this.keys[0].time)
	{
		//temporary
		result = this.keys[0].value;
	}

	//if the time is after the last key's time
	if(inputTime > this.keys[this.keys.length-1].time)
	{
		//temporary
		result = this.keys[this.keys.length-1].value;
	}

	//go through all the keys to look for the span
	for(var i = 0; i < this.keys.length; ++i)
	{
		currentKey = this.keys[i];

		//if the time is exactly the value of a keytime, return key value
		if(inputTime == this.keys[i].time)
		{
			console.log("hit an exact time");
			result = this.keys[i].value;
			exact = true;
			console.log(result);
			break;
		}
		else
		{
			if(inputTime > this.keys[i].time)
			{
				result = tempLower.value;
				console.log("hit a relative time");
				console.log(result);
				break;
			}
			tempLower = this.keys[i];
		}
	}

	debugAres = result;

	//if its one of the first 3 channels, grab the offset data
	if(this.inputIndex == 0 || this.inputIndex == 1 || this.inputIndex == 2)
	{
		console.log("setting offset for root");
		//tempJoint.offset[this.DOFIndex] = result;
	}
	else
	{
		console.log("setting pose components");
		console.log("From : " + tempJoint.pose.getComponent(this.DOFIndex));
		console.log("To : " + result);
		tempJoint.pose.setComponent(this.DOFIndex, result);
	}



}