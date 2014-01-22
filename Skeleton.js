/**
 * @author Thinh Nguyen / http://ThinhN.com/
 */

function Skeleton()
{
	this.root = null;
	this.skeletonSceneNode = new THREE.Object3D();
	this.skeletonSceneNode.scale.x = 50;
	this.skeletonSceneNode.scale.y = 50;
	this.skeletonSceneNode.scale.z = 50;
	this.skeletonSceneNode.name = "skeletonSceneNode";
	scene.add(this.skeletonSceneNode);
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
	this.root.Draw(this.skeletonSceneNode);
}

Skeleton.prototype.SetRoot = function(inputJoint)
{
	this.root = inputJoint;
}