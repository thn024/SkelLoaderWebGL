/**
 * @author Thinh Nguyen / http://ThinhN.com/
 */
var jointDebug;

function Joint(inputName)
{
	this.name = inputName;
	this.localM = new THREE.Matrix4();
	this.globalM = new THREE.Matrix4();
	this.parent = null; //TODO
	this.children = []; //setup a list for future children
	this.data = []; //set of DOF's to use
	this.dataGui = []; //set of DOFGuis' to use
	this.offset = [0,0,0];//new THREE.Vector3();
	this.min = [-1,-1,-1];
	this.max = [1,1,1];
	this.rotXLimit = [-100000,100000];
	this.rotYLimit = [-100000,100000];
	this.rotZLimit = [-100000,100000];
	this.pose = new THREE.Vector3();//[0,0,0]; //new THREE.Vector3();

	//this.pose.x = 0; this.pose.y = 0; this.pose.z = 0;
	//this.poseDOF = new DOF("pose 0 0 0");
	this.xPose = 0;
	this.yPose = 0;
	this.zPose = 0;

	this.xOff = 0;
	this.yOff = 0;
	this.zOff = 0;

	this.object3D = new THREE.Object3D();	//create a transformation matrix for this node
	this.mesh = null;


}

Joint.prototype.Update = function(root)
{
	this.setPose();
	this.setOffsets();

	root.jointBuffer.push(this);
	for(var i = 0; i < this.children.length; ++i)
	{
		this.children[i].Update(root);
	}
}

Joint.prototype.Load = function()
{
	//go through all the stored DOFs and set the necessary values
	for(var i = 0; i < this.data.length; ++i)
	{
		var inputDOF = this.data[i];
		var inputGui = this.dataGui[i];
		//var dofGui = inputJointGui.addFolder(inputDOF.dType);
		//console.log("CurrentName : " + this.name + " ::: length : " + this.data.length)
		//console.log("current Dtype : " + inputDOF.dType + " ::: current values : " + inputDOF.getValue().x);
	switch(inputDOF.dType)
		{
			case 'offset':
				this.offset = inputDOF.getValue();
				/*
				inputDOF.setGuiValue(inputGui, 'x', this.offset.x, null, null);
				inputDOF.setGuiValue(inputGui, 'y', this.offset.y, null, null);
				inputDOF.setGuiValue(inputGui, 'z', this.offset.z, null, null);
				*/
				break;
			case 'boxmin': this.min = inputDOF.getValue(); break;
			case 'boxmax': this.max = inputDOF.getValue(); break;
			case 'rotxlimit': this.rotXLimit = [inputDOF.min, inputDOF.max]; console.log("setting rotLimit"); break;
			case 'rotylimit': this.rotYLimit = [inputDOF.min, inputDOF.max]; break;
			case 'rotzlimit': this.rotZLimit = [inputDOF.min, inputDOF.max]; break;
			case 'pose': var ret = inputDOF.getValue();
							this.pose.x = ret[0];
							this.pose.y = ret[1];
							this.pose.z = ret[2];
				//inputDOF.setGuiValue(inputGui, 'x', this.pose.x, this.rotXLimit[0], this.rotXLimit[1]);
				//inputDOF.setGuiValue(inputGui, 'y', this.pose.y, this.rotYLimit[0], this.rotYLimit[1]);
				//inputDOF.setGuiValue(inputGui, 'z', this.pose.z, this.rotZLimit[0], this.rotZLimit[1]);
				break;
		}
	}

	//draw a box using the min and max bounding box data
	this.setPose();
	this.setOffsets();

	//this.Update()

	this.localM = this.object3D.matrix;
	this.MakeCube();
	jointDebug = this;
}

Joint.prototype.AddChild = function(inputJoint)
{
	this.children.push(inputJoint);
}

var mDebug; var mDebug2;



Joint.prototype.Draw = function(parent, rootSkeleton)
{
	//console.log("trying to draw this skeleton scene node: " + skeletonSceneNode);
	

	mDebug = this.object3D.matrixWorld;
	this.globalM = this.object3D.matrixWorld;
	//this.object3D.matrix.multiply(parent.matrix);
	//this.object3D.matrix = parent.matrix.multiply(this.object3D.matrix);
	//mDebug2= parent.matrix.clone();

	/*
	console.log(mDebug.elements);
	console.log(mDebug2.elements);
	console.log("now printing this.Object3D.matrix");
	console.log(this.object3D.matrix.elements);
	console.log("end");
	*/
	parent.add(this.object3D);
	this.object3D.add(this.mesh);
	
	rootSkeleton.jointBuffer.push(this);

	for(var i = 0; i < this.children.length; ++i)
	{
		this.children[i].Draw(this.object3D, rootSkeleton);
	}
	
	
	//root.add(this.object3D);
	
}

Joint.prototype.AddDOF = function(inputDOF)
{
	this.data.push(inputDOF);
}

Joint.prototype.AddDOFGui = function(inputDOFGui)
{
	this.dataGui.push(inputDOFGui);
}

//makes the cube out of the min vertex and max vertex
Joint.prototype.MakeCube = function()
{
	var geometry = new THREE.Geometry();
	//create the 8 vertices for the cube
	geometry.vertices.push(new THREE.Vector3(this.min[0], this.min[1], this.max[2]));
	geometry.vertices.push(new THREE.Vector3(this.max[0], this.min[1], this.max[2]));
	geometry.vertices.push(new THREE.Vector3(this.max[0], this.max[1], this.max[2]));
	geometry.vertices.push(new THREE.Vector3(this.min[0], this.max[1], this.max[2]));

	geometry.vertices.push(new THREE.Vector3(this.min[0], this.min[1], this.min[2]));
	geometry.vertices.push(new THREE.Vector3(this.max[0], this.min[1], this.min[2]));
	geometry.vertices.push(new THREE.Vector3(this.max[0], this.max[1], this.min[2]));
	geometry.vertices.push(new THREE.Vector3(this.min[0], this.max[1], this.min[2]));

	

	//front face
	geometry.faces.push(new THREE.Face3(0,1,2));
	geometry.faces.push(new THREE.Face3(3,0,2));

	//back face
	geometry.faces.push(new THREE.Face3(4,6,5));
	geometry.faces.push(new THREE.Face3(7,6,4));

	//left face
	geometry.faces.push(new THREE.Face3(0,3,4));
	geometry.faces.push(new THREE.Face3(3,7,4));

	//right face
	geometry.faces.push(new THREE.Face3(1,5,6));
	geometry.faces.push(new THREE.Face3(1,6,2));

	//bottem face
	geometry.faces.push(new THREE.Face3(0,4,1));
	geometry.faces.push(new THREE.Face3(4,5,1));

	//top face
	geometry.faces.push(new THREE.Face3(3,2,6));
	geometry.faces.push(new THREE.Face3(3,6,7));

	


	geometry.computeFaceNormals();

	for ( var i = 0; i < geometry.faces.length; i += 2 ) {
			var hex = Math.random() * 0xffffff;
			geometry.faces[ i ].color.setHex( hex );
			geometry.faces[ i + 1 ].color.setHex( hex );
		}

	var material = new THREE.MeshBasicMaterial( {
		vertexColors: THREE.FaceColors,
		shading: THREE.SmoothShading,
		//color: '0xffffff',
		overdraw: 0.5, transparent : false,
                    alphaTest : 0.5 } );

    this.mesh = new THREE.Mesh(geometry, material);
}

Joint.prototype.setPose = function()
{
	//this.object3D.rotation.set(this.pose.x, this.pose.y, this.pose.z)

	//check for boundaries
	if(this.pose.x < this.rotXLimit[0] || this.pose.x > this.rotXLimit[1])
	{
		console.log("out of xRotBounds for :" + this.pose.x);
		var lower = Math.abs(this.pose.x - this.rotXLimit[0]);
		var upper = Math.abs(this.pose.x - this.rotXLimit[1]);
		if(lower > upper)
		{
			this.pose.x = this.rotXLimit[1];
		}
		else
		{
			this.pose.x = this.rotXLimit[0];
		}
		console.log("setting xRot to : " + this.pose.x);
	}
	if(this.pose.y < this.rotYLimit[0] || this.pose.y > this.rotYLimit[1])
	{
		console.log("out of yRotBounds for :" + this.pose.y);
		var lower = Math.abs(this.pose.y - this.rotXLimit[0]);
		var upper = Math.abs(this.pose.y - this.rotXLimit[1]);
		if(lower > upper)
		{
			this.pose.y = this.rotYLimit[1];
		}
		else
		{
			this.pose.y = this.rotYLimit[0];
		}
		console.log("setting xRot to : " + this.pose.x);
	}
	if(this.pose.z < this.rotZLimit[0] || this.pose.z > this.rotZLimit[1])
	{
		console.log("out of zRotBounds for :" + this.pose.z);
		var lower = Math.abs(this.pose.z - this.rotXLimit[0]);
		var upper = Math.abs(this.pose.z - this.rotXLimit[1]);
		if(lower > upper)
		{
			this.pose.z = this.rotZLimit[1];
		}
		else
		{
			this.pose.z = this.rotZLimit[0];
		}
		console.log("setting zRot to : " + this.pose.z);
	}

	this.object3D.matrixAutoUpdate = false;

	var xMat = new THREE.Matrix4();
	var yMat = new THREE.Matrix4();
	var zMat = new THREE.Matrix4();
	var b = Math.cos(this.pose.x), a = Math.sin(this.pose.x);
	xMat.set(1,0,0,0,
			 0,b,-a,0,
			 0,a,b,0,
			 0,0,0,1);
	var b = Math.cos(this.pose.y), a = Math.sin(this.pose.y);
	yMat.set(b,0,a,0,
			 0,1,0,0,
			 -a,0,b,0,
			 0,0,0,1);
	var b = Math.cos(this.pose.z), a = Math.sin(this.pose.z);
	zMat.set(b,-a,0,0,
			 a,b,0,0,
			 0,0,1,0,
			 0,0,0,1);

	this.object3D.matrix = zMat.multiply(yMat).multiply(xMat);
}

Joint.prototype.setOffsets = function()
{
	//this.object3D.position.set(this.offset.x, this.offset.y, this.offset.z)
	var tMat = new THREE.Matrix4();
	tMat.set(1,0,0,this.offset[0],
			 0,1,0,this.offset[1],
			 0,0,1,this.offset[2],
			 0,0,0,1);
	this.object3D.matrix = tMat.multiply(this.object3D.matrix);
	//this.object3D.matrix = this.object3D.matrix.multiply(tMat);
}
