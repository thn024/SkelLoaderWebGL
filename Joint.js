/**
 * @author Thinh Nguyen / http://ThinhN.com/
 */

function Joint(inputName)
{
	this.name = inputName;
	this.localM = new THREE.Matrix4();
	this.globalM = new THREE.Matrix4();
	this.parent = null; //TODO
	this.children = []; //setup a list for future children
	this.data = []; //set of DOF's to use
}

Joint.prototype.Update = function()
{

}

Joint.prototype.Load = function()
{

}

Joint.prototype.AddChild = function(inputJoint)
{
	this.children.push(inputJoint);
}

Joint.prototype.Draw = function()
{

}

Joint.prototype.AddDOF = function(inputDOF)
{
	this.data.push(inputDOF);
}