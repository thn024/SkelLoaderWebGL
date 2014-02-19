function Channel(inputSkeleton, inputIndex)
{
	this.extrapolationType = null;	//constant, linear, cycle, cycle_offset, bounce
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

	key.setIndex(this.keys.length);

	this.keys.push(key);
}
var debugAnim;
var debugAres;
Channel.prototype.Evaluate = function(inputTime)
{
	

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
	var outOfBounds = false;

	if(this.extrapolationType == "constant")
	{
		result = this.keys[0].value;
		outOfBounds = true;
	}

	//if the time is before the first key's time
	if(inputTime < this.keys[0].time)
	{
		//temporary
		result = this.keys[0].value;
		outOfBounds = true;
	}

	//if the time is after the last key's time
	if(inputTime > this.keys[this.keys.length-1].time)
	{
		//temporary
		result = this.keys[this.keys.length-1].value;
		outOfBounds= true;
	}

	//go through all the keys to look for the span
	if(!outOfBounds)
	{
		for(var i = 0; i < this.keys.length; ++i)
		{
			currentKey = this.keys[i];

			//if the time is exactly the value of a keytime, return key value
			if(inputTime == this.keys[i].time)
			{
				//console.log("hit an exact time");
				result = this.keys[i].value;
				exact = true;
				//console.log(result);
				break;
			}
			else
			{
				if(inputTime < this.keys[i].time)
				{
					//result = tempLower.value;
					result = this.evalCubic(tempLower, this.keys[i], inputTime);
					console.log("hit a relative time");
					//console.log(result);
					break;
				}
				tempLower = this.keys[i];
			}
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
		//console.log("To : " + result);
		tempJoint.pose.setComponent(this.DOFIndex, result);
	}



}

Channel.prototype.evalCubic = function(inputKey1, inputKey2, inputTime)
{
	//set up the time vector
	

	var key1Time = inputKey1.time;
	var key2Time = inputKey2.time;

	var key1Value = inputKey1.value;
	var key2Value = inputKey2.value;

	var realTime = (inputTime-key1Time)/(key2Time - key1Time);


	var key1Tangent;
	var key2Tangent;
	//smooth first tangent
	/*
	switch(inputKey1.typeIn)
	{
		case "flat": break;
		case "linear": break;
		case "smooth":
		console.log(inputKey1.index);
		console.log(inputKey2.index);
		var prevValue;
		var prevTime;
		if(this.extrapolationType = "cycle_offset")
		{
			//if the previous key index is < 0, offset it with the value, use the previous keyframe's value
			if(inputKey1.index-1 < 0)
			{
				prevValue = this.keys[this.keys.length-1].value - inputKey1.value;
				prevTime = 
			}
			else
			{
				prevValue = this.keys[inputKey1.index-1].value;
			}
		}
			var key1Tangent = (key2Value - prevValue)/(key2Time - this.keys[inputKey1.index-1].time);
			console.log("SMOOTH VALUE " + key1Tangent);
		case "fixed": break;
		default:		break;
	}
	*/

	key1Tangent = 0;
	key2Tangent = 0;
	//var key1Tangent = (key2Value - keys[inputKey1.index-1].value)/(key2Time - keys[inputKey1.index-1].time)

	//console.log("key2t = " + key2Time);
	//console.log("key1t = " + key1Time);
	//console.log("realtime = " + realTime);

	var timeVec = new THREE.Vector4();
	timeVec.setX(realTime*realTime*realTime);
	timeVec.setY(realTime*realTime);
	timeVec.setZ(realTime);
	timeVec.setW(1);

	//set up the inverse matrix
	var mat = new THREE.Matrix4();
	mat.set(	2,-2,1,1,
				-3,3,-2,-1,
				0,0,1,0,
				1,0,0,0	);

	var posT = new THREE.Vector4(key1Value, key2Value, key1Tangent, key2Tangent);

	posT.applyMatrix4(mat);

	var result = timeVec.dot(posT);
	console.log("result position = " + result);

	return result;
}