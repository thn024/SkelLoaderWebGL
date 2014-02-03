/**
 * @author Thinh Nguyen / http://ThinhN.com/
 */

function Skeleton()
{
	this.root = null;
	this.skeletonSceneNode = new THREE.Object3D();
	this.skeletonSceneNode.scale.x = 20;
	this.skeletonSceneNode.scale.y = 20;
	this.skeletonSceneNode.scale.z = 20;
	this.skeletonSceneNode.name = "skeletonSceneNode";
	scene.add(this.skeletonSceneNode);
	this.visibility = false;
	this.skeletonSceneNode.visible = this.visibility;
	this.jointBuffer = [];
}

Skeleton.prototype.Update = function()
{
	//placeholder
}

Skeleton.prototype.Load = function()
{
	//dont think i need this?
}

Skeleton.prototype.Draw = function()
{
	//console.log(this.skeletonSceneNode);
	this.root.Draw(this.skeletonSceneNode, this);
}

Skeleton.prototype.SetRoot = function(inputJoint)
{
	this.root = inputJoint;
}

Skeleton.prototype.toggleVisibility = function()
{
	this.visibility = !this.visibility;
	this.skeletonSceneNode.visible = this.visibility;
}

Skeleton.prototype.setVisibility = function(inputBool)
{
	this.visibility = inputBool;
	this.skeletonSceneNode.visible = this.visibility;
}

//function that returns the world matrix at a specific node in the scene
Skeleton.prototype.getWorldMatrix = function(index)
{
	return this.jointBuffer[index].object3D.matrixWorld;
}