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
	this.offset = new THREE.Matrix4();
	this.min = null;
	this.max = null;
	this.rotXLimit = [0,0];
	this.rotYLimit = [0,0];
	this.rotZLimit = [0,0];
	this.pose = new THREE.Matrix4();
	this.mesh = null;
}

Joint.prototype.Update = function()
{

}

Joint.prototype.Load = function()
{
	//go through all the stored DOFs and set the necessary values
	for(var i = 0; i < this.data.length; ++i)
	{
		var inputDOF = this.data[i];
		//console.log("CurrentName : " + this.name + " ::: length : " + this.data.length)
		//console.log("current Dtype : " + inputDOF.dType + " ::: current values : " + inputDOF.getValue().x);
	switch(inputDOF.dType)
		{
			case 'offset': this.offset = inputDOF.getValue(); break;
			case 'boxmin': this.min = inputDOF.getValue(); break;
			case 'boxmax': this.max = inputDOF.getValue(); break;
			case 'rotxlimit': this.rotXLimit = [inputDOF.min, inputDOF.max]; break;
			case 'rotylimit': this.rotYLimit = [inputDOF.min, inputDOF.max]; break;
			case 'rotzlimit': this.rotZLimit = [inputDOF.min, inputDOF.max]; break;
			case 'pose': this.pose = inputDOF.getValue(); break;
		}
	}

	//draw a box using the min and max bounding box data
	this.MakeCube();
	jointDebug = this;
}

Joint.prototype.AddChild = function(inputJoint)
{
	this.children.push(inputJoint);
}

Joint.prototype.Draw = function(skeletonSceneNode)
{
	//console.log("trying to draw this skeleton scene node: " + skeletonSceneNode);
	skeletonSceneNode.add(this.mesh);
}

Joint.prototype.AddDOF = function(inputDOF)
{
	this.data.push(inputDOF);
}

Joint.prototype.MakeCube = function()
{
	var geometry = new THREE.Geometry();
	//create the 8 vertices for the cube
	geometry.vertices.push(new THREE.Vector3(this.min.x, this.min.y, this.max.z));
	geometry.vertices.push(new THREE.Vector3(this.max.x, this.min.y, this.max.z));
	geometry.vertices.push(new THREE.Vector3(this.max.x, this.max.y, this.max.z));
	geometry.vertices.push(new THREE.Vector3(this.min.x, this.max.y, this.max.z));

	geometry.vertices.push(new THREE.Vector3(this.min.x, this.min.y, this.min.z));
	geometry.vertices.push(new THREE.Vector3(this.max.x, this.min.y, this.min.z));
	geometry.vertices.push(new THREE.Vector3(this.max.x, this.max.y, this.min.z));
	geometry.vertices.push(new THREE.Vector3(this.min.x, this.max.y, this.min.z));

	

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

	for ( var i = 0; i < geometry.faces.length; i ++ )
	{
        //geometry.faces[ i ].color.setHex( Math.random() * 0xffffff );
        geometry.faces[ i ].color.setHex(0xEEEEEE );
    }
      var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );

    this.mesh = new THREE.Mesh(geometry, material);
}